# 在没有图形界面的服务器上用好 cc-switch

# TL;DR

cc-switch 有几个版本:桌面 GUI 版（原版,[farion1231/cc-switch](https://github.com/farion1231/cc-switch),带图形界面）和 CLI 版（本文,[SaladDay/cc-switch-cli](https://github.com/SaladDay/cc-switch-cli),一个二进制文件）等。

CLI版本适用于没有图形界面的地方,比如 SSH 连上的服务器、Docker 容器、WSL等。

**装好之后,可以选两种方式操作: 进 TUI 交互界面, 或者敲一行行命令; 两套流程效果完全一样。**

多台机器用 WebDAV 同步,桌面配好,服务器拉下来直接用。



# 安装

如前所述，cc-switch-cli有两种操作模式，TUI和CLI；

不管后面选 TUI 还是 CLI,安装只有一步:

```bash
curl -fsSL https://github.com/SaladDay/cc-switch-cli/releases/latest/download/install.sh | bash
```

二进制默认放到 `~/.local/bin/cc-switch`。确保 `~/.local/bin` 在你的 `PATH` 里:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

arm64 机器（树莓派、部分云服务器）如果脚本装不上,也可以手动下:

```bash
curl -LO https://github.com/saladday/cc-switch-cli/releases/latest/download/cc-switch-cli-linux-arm64-musl.tar.gz
tar -xzf cc-switch-cli-linux-arm64-musl.tar.gz
chmod +x cc-switch
mv cc-switch ~/.local/bin/
```

验证装好没:

```bash
cc-switch --version
```

![cc-switch --version](/docs/assets/cc-switch-cli-headless-guide/01-version-check.png)

>  后续将分为TUI和CLI两部分进行讲解，各位可按需空降。

# Part 1: 我用 TUI

TUI 就是在终端里跑的全屏键盘界面,看起来像"终端里的 App"。只要你 SSH 连上去有交互式会话,就能直接用。

## 界面一览

进了 TUI 之后,左边是侧栏,右边是内容区。用 ← → 键在侧栏和内容之间切,↑ ↓ 键在列表里移动,回车确认,Esc 返回。

用 [ ] 键切换应用，Claude / Codex / Gemini / OpenCode / Hermes / OpenClaw。选中哪个,后面的操作就针对哪个应用。

侧栏里有这些页面:

| 页面 | 干什么用 |
|------|---------|
| **首页** | 众所周知，首页 |
| **供应商** | 列出所有供应商,添加/编辑/删除/切换/测速/流式检查 |
| **MCP** | 管理 MCP 服务器,启用/禁用/同步到各应用 |
| **Skills** | 浏览已安装的技能,发现新技能,管理技能仓库 |
| **会话** | 查看历史会话记录和消息详情 |
| **使用统计** | 按供应商和模型查看 token 用量、请求次数和费用 |
| **Prompts** | 管理提示词预设,激活/编辑/创建 |
| **配置** | 备份恢复、导入导出、通用配置片段、WebDAV 同步、OpenClaw 工作区(仅 OpenClaw 模式) |
| **设置** | 语言切换、代理设置、托管账号、可见应用模式 |

> 注:OpenClaw 模式下侧栏多了「工作区」「环境」「工具」「智能体」四个入口;Hermes 模式多了「Hermes 记忆」。

![TUI 首页](/docs/assets/cc-switch-cli-headless-guide/02-tui-home.png)

## 添加供应商 + 切换

先确保对应的 CLI 跑过一次（比如 `claude --help` / `codex --help`）,否则 cc-switch 写不进 live 文件。

然后在终端里直接敲:

```bash
cc-switch
```

就会进入全屏 TUI 界面。

按 ↓ 键移动到供应商页面，Enter！

在供应商管理界面按a，进入添加供应商界面：

![添加供应商](/docs/assets/cc-switch-cli-headless-guide/03-tui-add-provider.png)

选择你的模板，按左右键可以切换模板，敲击回车即可选择模板。

按需填写信息。

其中 Claude 模型配置项可以配置各个模型；

![Claude 模型配置](/docs/assets/cc-switch-cli-headless-guide/04-tui-model-config.png)

其中，右侧JSON预览面板中，标底色的为通用配置，可在左侧“添加通用配置”中添加。

![JSON 预览与通用配置](/docs/assets/cc-switch-cli-headless-guide/05-tui-json-preview.png)

结束之后，键入Ctrl + S进行保存。

**切换供应商:**

主界面里选中要切的供应商,回车。当前生效的供应商会有标记。

![切换供应商后](/docs/assets/cc-switch-cli-headless-guide/06-tui-provider-switched.png)

---

## 同步配置(WebDAV)

多台机器,或者桌面上用 GUI 版配好了供应商,WebDAV 可以直接同步过来,不用重输。

在 TUI 里进 配置 → WebDAV 同步 → 坚果云一键配置（或其他WebDAV服务）,填入坚果云的**应用专用密码**（不是登录密码）。

> 应用密码在坚果云个人中心->安全选项->第三方应用管理处生成。

![WebDAV 配置](/docs/assets/cc-switch-cli-headless-guide/07-tui-webdav-config.png)

这样就配置好了，就可以上传下载了。

之后，你可以在GUI里上传，在TUI里下载，非常的方便。

## 几个实用页面

除了添加和切换供应商,这几个页面也值得点开看看:

**首页** — 一眼看完当前状态:哪个供应商在用、API 地址是什么、配了几个 MCP 和 Skill、WebDAV 连没连上、各 CLI 工具就绪没。代理开着的话还能看到请求流量的小图（代理怎么玩转,我们会另出教程细讲）。

![TUI 首页总览](/docs/assets/cc-switch-cli-headless-guide/08-tui-home-overview.png)

**使用统计**— 可以看到各个供应商的用量统计,比如各模型的 token 消耗和请求次数。调优成本和用量的时候很有用。

![使用统计页面](/docs/assets/cc-switch-cli-headless-guide/09-tui-usage-stats.png)

**Skills** — 从这里发现、安装、管理、启用社区技能,一键同步到对应 app 目录。

![Skills 页面](/docs/assets/cc-switch-cli-headless-guide/10-tui-skills.png)

**会话** — 左边是历史会话列表,右边是消息详情,可以翻以前的对话记录。按 app 和供应商筛选。

![会话页面](/docs/assets/cc-switch-cli-headless-guide/11-tui-sessions.png)

---

# Part 2: 我用 CLI

不想用 TUI、要写脚本自动化,或者是在没有 TTY 的地方（Dockerfile / cron）,直接用命令。

## 添加供应商 + 切换

**添加供应商（交互式,也会问问题,只是不走全屏 TUI）:**

```bash
cc-switch provider add
```

终端一步步问你:名称 → Base URL → API Key → 模型。填完就好。

![provider add](/docs/assets/cc-switch-cli-headless-guide/12-cli-provider-add.png)

**查看和切换:**

```bash
cc-switch provider list      # 有哪些供应商
cc-switch provider current   # 当前用哪个
cc-switch provider switch <id>   # 切过去
```

![provider list](/docs/assets/cc-switch-cli-headless-guide/13-cli-provider-list.png)

![provider current](/docs/assets/cc-switch-cli-headless-guide/14-cli-provider-current.png)

**不指定 --app 则默认管理 Claude。要管其他应用:**

```bash
cc-switch --app codex provider list
cc-switch --app codex provider switch <id>
cc-switch --app gemini provider list
```

---

## 同步配置(WebDAV)

和 TUI 流程一样。

**设置 WebDAV（坚果云）:**

```bash
cc-switch config webdav jianguoyun --username 你的邮箱 --password 应用专用密码
```

**通用 WebDAV:**

```bash
cc-switch config webdav set --base-url https://dav.example.com --username xxx --password xxx --enable
```

**测连通:**

```bash
cc-switch config webdav check-connection
```

**上传 / 下载:**

```bash
cc-switch config webdav upload
cc-switch config webdav download
```

---

## 检查有没有问题

```bash
cc-switch env check   # 看有没有环境变量冲突
cc-switch env tools   # 看各 CLI 装好没
```

![env check + env tools](/docs/assets/cc-switch-cli-headless-guide/15-cli-env-check-tools.png)

---

## 命令速查

TUI 里能做的事,CLI 都有一一对应的命令。以下是常用的:

**供应商**

| 命令 | 说明 |
|------|------|
| `provider list` | 列出所有供应商 |
| `provider current` | 看当前用哪个 |
| `provider switch <id>` | 切换供应商 |
| `provider add` | 交互式添加供应商 |
| `provider add --template openai` | 用预设模板添加 |
| `provider edit <id>` | 编辑供应商 |
| `provider delete <id>` | 删除供应商 |
| `provider duplicate <id>` | 复制供应商 |
| `provider export <id>` | 导出为 Claude settings 文件 |
| `provider speedtest <id>` | 测 API 延迟 |
| `provider stream-check <id>` | 流式响应健康检查 |
| `provider fetch-models <id>` | 拉远端模型列表 |
| `provider quota <id>` | 查用量配额 |
| `provider import-live` | 从 app 当前配置导入供应商 |

**MCP**

| 命令 | 说明 |
|------|------|
| `mcp list` | 列出所有 MCP 服务器 |
| `mcp add` | 添加 MCP 服务器 |
| `mcp edit <id>` | 编辑 MCP 服务器 |
| `mcp delete <id>` | 删除 MCP 服务器 |
| `mcp enable <id> --app claude` | 为某个应用启用 |
| `mcp disable <id> --app claude` | 为某个应用禁用 |
| `mcp sync` | 同步到 app 配置文件 |
| `mcp import` | 从 app 配置导入 |

**Prompts**

| 命令 | 说明 |
|------|------|
| `prompts list` | 列出提示词预设 |
| `prompts current` | 看当前激活的 |
| `prompts activate <id>` | 激活提示词 |
| `prompts deactivate` | 停用提示词 |
| `prompts create [name]` | 新建提示词 |
| `prompts edit <id>` | 编辑提示词 |
| `prompts show <id>` | 看完整内容 |
| `prompts delete <id>` | 删除提示词 |

**Skills**

| 命令 | 说明 |
|------|------|
| `skills list` | 列出已安装技能 |
| `skills discover <关键词>` | 搜索技能 |
| `skills install <name>` | 安装技能 |
| `skills uninstall <name>` | 卸载技能 |
| `skills enable <name>` | 为当前应用启用 |
| `skills disable <name>` | 为当前应用禁用 |
| `skills sync` | 同步到 app 目录 |
| `skills repos list` | 看技能仓库列表 |

**配置**

| 命令 | 说明 |
|------|------|
| `config show` | 看当前配置 |
| `config path` | 看配置文件路径 |
| `config backup` | 创建备份 |
| `config restore` | 从备份恢复 |
| `config export <path>` | 导出配置 |
| `config import <path>` | 导入配置 |
| `config webdav show` | 看 WebDAV 设置 |
| `config webdav jianguoyun --username xxx --password xxx` | 坚果云一键配置 |
| `config webdav upload/download` | 上传/下载配置 |
| `config reset` | 重置配置 |

**代理**

| 命令 | 说明 |
|------|------|
| `proxy show` | 看代理状态 |
| `proxy enable` | 启用代理 |
| `proxy disable` | 禁用代理 |
| `proxy config --listen-port 15721` | 设置监听端口 |

**环境**

| 命令 | 说明 |
|------|------|
| `env check` | 检查环境变量冲突 |
| `env list` | 列出相关环境变量 |
| `env tools` | 看各 CLI 工具装好没 |

**其他**

| 命令 | 说明 |
|------|------|
| `daemon start/stop/status` | 守护进程管理 |
| `completions install --activate` | 装 shell 补全 |
| `update` | 更新 cc-switch 自身 |
| `sessions` | 查看历史会话 |

> 所有命令都支持 `--app` 指定目标应用:`--app claude`（默认）、`--app codex`、`--app gemini`、`--app opencode`、`--app hermes`、`--app openclaw`。

---

## 小技巧

**临时用一个供应商,不切全局:**

比如平时用 DeepSeek,但这次想让 Claude 走 OpenAI,又不想把全局供应商切掉:

```bash
cc-switch start claude <provider-id>
```

`start` 会临时把那个供应商写入 live 配置,拉起 Claude;等你退出 Claude,全局设置不受影响。Codex 也一样:

```bash
cc-switch start codex <provider-id>
```

还可以在后面加 `--` 把参数透传给目标 CLI:

```bash
cc-switch start claude deepseek -- --dangerously-skip-permissions
```

**Shell 别名,少打字:**

在 `~/.bashrc` 里加上:

```bash
alias ccpl='cc-switch provider list'
alias ccps='cc-switch provider switch'
alias ccpc='cc-switch provider current'
alias ccpw='cc-switch config webdav'
```

这样 `ccpl` 就能看供应商列表,`ccps abc123` 就能切,比打全称快多了。

**恢复之前的会话:**

```bash
cc-switch sessions list       # 找到想继续的会话
cc-switch sessions resume <id>  # 用当时的配置接着聊
```

**不存供应商也能测 API:**

```bash
cc-switch provider fetch-models --base-url https://api.example.com --api-key sk-xxx
```

不确定一个 API 能不能用的时候,先拿这个命令试试,不用建供应商。

**导出单个供应商给 Claude 用:**

```bash
cc-switch provider export deepseek
```

会在当前目录生成 `.claude/settings.local.json`,Claude 启动自动加载。适合临时给某个项目用特定 API。

**Shell 补全（省键盘）:**

```bash
cc-switch completions install --activate
```

装完新开终端,敲 `cc-switch pr` 按 Tab 就能补齐 `cc-switch provider`。

**用 `CC_SWITCH_CONFIG_DIR` 隔离不同项目:**

```bash
export CC_SWITCH_CONFIG_DIR=/opt/my-project/.cc-switch
cc-switch provider list   # 走 /opt/my-project/.cc-switch/cc-switch.db
```

一台机器上多项目、多用户可以独立管理。

## 邪修！

你可以让codex、claudecode...使用cc-switch-cli来管理你的所有配置。

---

# cc-switch-cli 和 cc-switch 功能差异

目前CLI已经支持大部分的原本功能，并持续火力开发中，有缺的功能、想要的新花样,直接来 [GitHub Issues](https://github.com/SaladDay/cc-switch-cli/issues) 开 issue,PR 更欢迎——毕竟 CLI 版就是从 PR 堆里长出来的。

