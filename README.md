# CC Switch Website

CC Switch 官方网站，展示产品功能、文档和更新日志。

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行完整质量检查
npm run check
```

## 项目结构

```
src/
├── components/     # 组件（ccswitch 首页与演示、docs、changelog、download、sponsors、tutorials、seo、ui）
├── content/        # 文档路由表、教程与赞助商注册表、首页演示数据
├── hooks/          # 自定义 Hooks
├── i18n/           # 三语文案（translations.ts）与语言路由
├── lib/            # 标题锚点、更新日志、下载清单、SEO 等工具
└── pages/          # 页面
public/
└── docs/           # 运行时加载的 Markdown：手册、更新日志、发布说明、攻略
scripts/            # 更新日志切分、发版同步、sitemap 生成
docs/               # 下载镜像（R2）配置说明与事故复盘
```

## 内容同步

站点内容的源头在主仓库 [cc-switch](https://github.com/farion1231/cc-switch)，按下面的方式同步，不要直接改站点副本：

| 内容 | 主仓库 | 本站 | 同步方式 |
|------|--------|------|----------|
| 更新日志 | `docs/release-notes/v<版本>-<lang>.md` | `public/docs/changelog/<lang>.md` | `node scripts/sync-release.mjs <版本>` |
| 用户手册 | `docs/user-manual/<lang>/` | `public/docs/<lang>/` | 整目录镜像，链接由站点在运行时改写 |
| 攻略 | `docs/guides/<slug>-<lang>.md` | `public/docs/tutorials/<lang>/<slug>.md` | 拷贝时换名，并在 `src/content/tutorials.ts` 登记 |
| 赞助商 | 四语 README 的赞助商区块 | `src/content/sponsors.ts` | 顺序、链接、优惠以 README 为准 |

`sync-release.mjs` 会从主仓库读取三语发布说明和 `CHANGELOG.md` 里的日期，把相对链接改写成站内路由，写入更新日志，并更新结构化数据里的版本号和 sitemap。默认主仓库在同级目录 `../cc-switch`，可以用 `--repo` 指定；`--check` 只核对、不写文件。

新增教程、版本或文档页后要运行 `npm run generate:sitemap`；`npm run check` 会在 sitemap 漏收页面时报错。

## 相关链接

- [官网](https://ccswitch.io)
- [CC Switch 主仓库](https://github.com/farion1231/cc-switch)

## 许可证

[MIT](LICENSE)
