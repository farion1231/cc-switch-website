# 站内下载（Cloudflare R2 镜像）

`/download` 页面从 `https://dl.ccswitch.io` 提供安装包直接下载，不再仅仅外链 GitHub Releases。本文档记录整套管线和一次性配置步骤。

## 架构

```
主仓库 release workflow（打 tag 发版时）
  └─ sync-to-r2 job（.github/workflows/release.yml）
       ├─ gh release download 拉取全部资产
       ├─ scripts/generate-download-manifest.mjs 生成 manifest.json
       ├─ aws s3 cp 上传到 R2：<bucket>/vX.Y.Z/<安装包>  +  <bucket>/manifest.json
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

`.sig`、`.tar.gz`（Tauri updater 专用）和 `latest.json` 不进 manifest、也不上传到 R2。

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

   secrets 未配置时 sync-to-r2 job 会自动跳过，不影响发版。

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

aws s3 cp r2-assets "s3://cc-switch-releases/v3.18.0/" --recursive \
  --exclude "*.sig" --exclude "*.tar.gz" --exclude "latest.json" \
  --cache-control "public, max-age=31536000, immutable" \
  --endpoint-url "$ENDPOINT"
aws s3 cp manifest.json "s3://cc-switch-releases/manifest.json" \
  --content-type "application/json" \
  --cache-control "public, max-age=300" \
  --endpoint-url "$ENDPOINT"

rm -rf r2-assets manifest.json
```

验证：`curl -s https://dl.ccswitch.io/manifest.json | head`，然后打开 `/download` 页面确认按钮带上版本号和文件大小。

## 注意事项

- 前端在 manifest 拉取失败时降级为 GitHub 外链，所以 R2 配置完成前就可以上线 `/download` 页面。
- `AWS_REQUEST_CHECKSUM_CALCULATION=when_required` 两个环境变量是必须的：aws-cli ≥ 2.23 默认发送 R2 不支持的 CRC 校验头。
- 历史版本只保留最近 5 个（workflow 里 `KEEP_VERSIONS`），更早的版本仍指向 GitHub Releases，存储稳定压在 ~1.5GB。
- 后续优化方向：把 Tauri updater 的 `latest.json` 和 `.tar.gz` 也镜像到 R2，加速应用内更新（需要同时改主仓库 tauri.conf 的 updater endpoint）。
