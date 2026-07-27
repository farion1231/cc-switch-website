# 站内下载与应用内更新（Cloudflare R2 镜像）

`/download` 页面从 `https://dl.ccswitch.io` 提供安装包直接下载，不再仅仅外链 GitHub Releases；Tauri updater 的应用内更新也走同一镜像（R2 优先、GitHub 兜底）。本文档记录整套管线和一次性配置步骤。

## 架构

```
主仓库 sync workflow（.github/workflows/sync-r2.yml）
  触发：release 转正（release: types: [released]）或 workflow_dispatch 手动补跑
  └─ sync-to-r2 job
       ├─ 官方仓库缺任一 R2 secret 时直接失败（fork 才允许跳过）
       ├─ 校验 tag 是否为当前 releases/latest——不是则只回填版本目录，
       │   不写根清单、不清理（防止手动补跑旧 tag 把根清单指向旧版甚至 404）
       ├─ gh release download 拉取全部资产
       ├─ scripts/generate-download-manifest.mjs 生成 manifest.json
       ├─ scripts/rewrite-updater-manifest.mjs 把 latest.json 的下载 URL 改写到 R2
       ├─ aws s3 cp 上传到 R2：<bucket>/vX.Y.Z/<安装包 + macOS tar.gz>
       │                        + 根路径 manifest.json / latest.json（max-age=300）
       └─ 清理旧版本（保留最近 5 个，KEEP_VERSIONS 可调）

R2 bucket: cc-switch-releases（绑定自定义域 dl.ccswitch.io，走 Cloudflare CDN）

本站前端
  ├─ src/lib/downloads.ts           manifest 契约 + 平台/架构检测（与主仓库脚本保持同步）
  ├─ src/hooks/useDownloadManifest.ts   fetch https://dl.ccswitch.io/manifest.json + 内存缓存
  └─ src/components/download/DownloadSection.tsx   检测到的平台大按钮 + 全平台矩阵
       └─ manifest 拉取失败时整体降级为 GitHub Releases 外链按钮
```

manifest.json 结构（字段变更时两边同步改）：

```json
{
  "version": "3.18.0",
  "tag": "v3.18.0",
  "pubDate": "2026-07-24T00:00:00.000Z",
  "files": [
    {
      "platform": "macos",          // macos | windows | linux
      "kind": "dmg",                // dmg | zip | msi | portable | appimage | deb | rpm
      "arch": "universal",          // universal | x64 | arm64
      "name": "CC-Switch-v3.18.0-macOS.dmg",
      "size": 26699423,
      "sha256": "0f4d…（64 位十六进制，前端截断展示 + 点击复制）",
      "url": "https://dl.ccswitch.io/v3.18.0/CC-Switch-v3.18.0-macOS.dmg"
    }
  ]
}
```

`pubDate` 由 CI 从 GitHub release 的 `publishedAt` 取真实发布时间传入（脚本第 5 个参数）；`sha256` 供下载页展示，用户可与 GitHub Releases 页面自动显示的 digest 交叉比对——两者信任源不同（R2 vs GitHub），哈希一致即可确认镜像未被篡改。

## 应用内更新镜像（Tauri updater）

主仓库 `tauri.conf.json` 的 updater endpoints 为 `["https://dl.ccswitch.io/latest.json", "https://github.com/.../latest.json"]`——按序尝试，R2 不可用时自动落回 GitHub。为此 sync-to-r2 额外做两件事：

- macOS 更新包 `.tar.gz` 随版本目录一起上传（Windows 的 `.msi`、Linux 的 `.AppImage` 本来就是下载资产）；
- `latest.json` 经 `scripts/rewrite-updater-manifest.mjs` 把 URL 前缀改写为 `dl.ccswitch.io/<tag>/` 后上传到 bucket 根路径。

安全性：每个平台条目的 minisign 签名内嵌在 `latest.json` 里、针对文件内容计算，公钥编译在应用内，客户端下载后强制验签——所以镜像本身无需被信任，URL 改写也不影响签名有效性。`.sig` 文件因此不需要上传。

这些更新专用文件（`.sig`、`.tar.gz`、`latest.json`）都不进下载页的 manifest.json。注意 endpoint 顺序的变更要随新版本装到用户机器上才生效：老版本继续走 GitHub endpoint，不受影响。

两条重要语义：

- **发布闸门**：sync 由 `release: types: [released]` 触发——只在 prerelease 手动转正（或直接发 stable）时运行，与 GitHub `/releases/latest/` 的语义对齐。打 tag 后、转正前的窗口期里，下载页和更新源都仍指向上一个 stable，不会把未验证的版本提前推给用户。
- **updater 的回退是"连不上才回退"，不是"内容回退"**：tauri-plugin-updater 按序尝试 endpoints，停在第一个能解析的响应上。R2 清单合法但停更时不会再查 GitHub，清单里的安装包 URL 下载失败也不会换源。所以 R2 镜像一旦启用就必须保持新鲜——这正是官方仓库缺 secrets 时硬失败而不是跳过的原因。**这是明确接受的取舍**（已评审确认）：内容级回退需要 Worker 或应用端自行拉取双清单比较版本、并处理安装包换源，列为可选后续项，不在当前范围。

## 一次性配置（Cloudflare 面板 + GitHub）

1. **开通 R2**：Cloudflare 面板 → R2（需绑定付款方式；免费额度内不扣费：存储 10GB·月、读 1000 万次/月、出口流量无限免费）。
2. **建 bucket**：名为 `cc-switch-releases`（与 workflow 中 `R2_BUCKET` 一致）。
3. **绑自定义域**：bucket → Settings → Custom Domains → 添加 `dl.ccswitch.io`。绑定后才有 CDN 缓存和免费下载；不要用 `r2.dev` 开发域（限速且不可缓存）。
4. **配置 CORS**（必须，否则前端跨域拉不到 manifest）：bucket → Settings → CORS Policy：

   ```json
   [
     {
       "AllowedOrigins": ["https://ccswitch.io", "http://localhost:8080"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 86400
     }
   ]
   ```

5. **创建 API Token**：R2 → Manage R2 API Tokens → Create API Token，权限 Object Read & Write，限定到 `cc-switch-releases` bucket。记下 Access Key ID / Secret Access Key，以及账户 ID（面板 URL 或 R2 概览页可见）。
6. **配置主仓库 GitHub Actions secrets**（farion1231/cc-switch → Settings → Secrets and variables → Actions）：
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`

   在官方仓库（farion1231/cc-switch）三个 secrets 缺一 sync 就会失败——镜像静默停更会让走 R2 端点的用户永远收不到更新（见下面的 updater 限制），所以宁可红灯报警；只有 fork 才允许自动跳过。sync 失败后修好 secrets，用 workflow_dispatch 手动补跑对应 tag 即可（只有等于当前 releases/latest 的 tag 会重写根清单并触发清理；旧 tag 仅回填版本目录文件）。

## 首次回填（不用等下次发版）

在主仓库目录执行（把凭据换成第 5 步拿到的值）：

```bash
cd ~/Code/cc-switch
gh release download v3.18.0 --dir r2-assets --repo farion1231/cc-switch
pub_date=$(gh release view v3.18.0 --repo farion1231/cc-switch --json publishedAt --jq .publishedAt)
node scripts/generate-download-manifest.mjs r2-assets v3.18.0 https://dl.ccswitch.io manifest.json "$pub_date"

export AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY>
export AWS_DEFAULT_REGION=auto
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required
ENDPOINT=https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com

node scripts/rewrite-updater-manifest.mjs r2-assets/latest.json v3.18.0 https://dl.ccswitch.io latest-r2.json

aws s3 cp r2-assets "s3://cc-switch-releases/v3.18.0/" --recursive \
  --exclude "*.sig" --exclude "latest.json" \
  --cache-control "public, max-age=31536000, immutable" \
  --endpoint-url "$ENDPOINT"
aws s3 cp manifest.json "s3://cc-switch-releases/manifest.json" \
  --content-type "application/json" \
  --cache-control "public, max-age=300" \
  --endpoint-url "$ENDPOINT"
aws s3 cp latest-r2.json "s3://cc-switch-releases/latest.json" \
  --content-type "application/json" \
  --cache-control "public, max-age=300" \
  --endpoint-url "$ENDPOINT"

rm -rf r2-assets manifest.json latest-r2.json
```

验证：`curl -s https://dl.ccswitch.io/manifest.json | head` 与 `curl -s https://dl.ccswitch.io/latest.json | head`，然后打开 `/download` 页面确认按钮带上版本号和文件大小。

## 注意事项

- 前端在 manifest 拉取失败时降级为 GitHub 外链，所以 R2 配置完成前就可以上线 `/download` 页面。
- `AWS_REQUEST_CHECKSUM_CALCULATION=when_required` 两个环境变量是必须的：aws-cli ≥ 2.23 默认发送 R2 不支持的 CRC 校验头。
- 历史版本只保留最近 5 个（workflow 里 `KEEP_VERSIONS`），更早的版本仍指向 GitHub Releases，存储稳定压在 ~1.5GB。根路径的 `latest.json` 永远指向最新版本，不受版本目录清理影响。
