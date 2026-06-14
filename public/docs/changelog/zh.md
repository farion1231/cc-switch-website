# 更新日志

CC Switch 的重要版本更新记录。

## [3.16.2] - 2026-06-07

> 在 v3.16.1 的 Codex 稳定性补丁之后，这一版主要拓宽了数据的可携带性与用量观测能力——新增 S3 兼容云同步、OpenCode 会话用量同步、官方订阅额度模板——并继续加固 Codex 通过 Chat Completions 路由第三方供应商的稳健性，同时修复了一批 Windows / macOS 平台问题，新增 CherryIN、ZenMux 供应商，并全面刷新了三语用户手册。

### 使用攻略

这一版新增了云同步的 S3 后端和更多用量统计来源，如果你想用上，可以先看这些文档：

- **[设置](/zh/docs?section=getting-started&item=settings)**：在设置页配置云同步（WebDAV / S3 兼容存储），用于在多台设备间备份和恢复供应商、MCP、提示词、技能等配置。
- **[用量统计](/zh/docs?section=proxy&item=usage)**：了解用量看板的数据来源（代理日志、Codex / Gemini / OpenCode 会话同步）与统计口径。

> [!WARNING]
>
> ## 唯一官方渠道声明（请务必阅读）
>
> CC Switch 是**完全免费、开源**的桌面应用，**不会向用户收取任何费用**。请仅通过下列官方渠道获取本软件：
>
> | 类别     | 唯一官方                                                                       |
> | -------- | ------------------------------------------------------------------------------ |
> | 官网     | **[ccswitch.io](https://ccswitch.io)**                                         |
> | 源码     | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | 下载     | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | 作者     | **[@farion1231](https://github.com/farion1231)**                               |
> | 举报山寨 | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **任何向你收费、要求充值、或索取登录凭据的"CC Switch"网站或客户端均为假冒**。如果你被诱导支付了费用，请立即停止操作并通过 GitHub Issues 反馈。

### 概览

CC Switch v3.16.2 是 v3.16.1 之后的一版维护更新。在上一版集中处理 Codex 官方鉴权与本地路由接管的安全问题之后，这一版把重心放在两件事上：一是拓宽数据的可携带性和用量观测——新增 S3 兼容云同步（WebDAV 之外的第二套云备份后端）、OpenCode 会话用量同步，以及面向官方订阅的额度统计模板；二是继续打磨 Codex 通过 Chat Completions 路由第三方供应商时暴露出来的边角问题——流式截断判定、空 tools 下的 `tool_choice`、自定义工具元数据、推理 token 统计、文件 / 音频附件转换等。

此外，本版还修复了一批本地代理的稳健性问题（临时端口解析、接管占位符还原死循环、Anthropic `system` 消息归一化、上游 413 文案、Claude Desktop 的 `[1m]` 模型路由），处理了若干 Windows / macOS 平台体验问题，并新增 CherryIN、ZenMux 两个供应商，同时全面刷新了三语用户手册。

### 重点内容

- **S3 兼容云同步**：在 WebDAV 之外新增 S3 兼容对象存储作为第二套云备份后端，内置 AWS S3、MinIO、Cloudflare R2、阿里云 OSS、腾讯云 COS、华为 OBS 等一键预设。
- **更多用量统计来源**：新增 OpenCode 会话用量同步，以及面向 Claude / Codex / Gemini 官方订阅的额度统计模板（显式开关、默认关闭）。
- **Codex Chat Completions 路由继续加固**：修复流式截断误判、空 tools 下 `tool_choice` 被拒、自定义工具元数据丢失、推理 token 统计缺失，并支持文件 / 音频附件转换与 `/v1/models` 探活端点。
- **本地代理更稳**：修复临时端口（port 0）解析、接管占位符还原死循环、Anthropic `system` 消息归一化、上游 413 文案，以及 Claude Desktop 1M 上下文模型路由。
- **平台与供应商**：修复 Windows 托盘 / 任务栏图标、子目录技能更新、macOS 输入自动大写等问题，并新增 CherryIN、ZenMux 供应商。

### 新功能

#### S3 兼容云同步

云同步现在支持 S3 兼容对象存储作为 WebDAV 之外的第二套后端，签名采用自实现的 AWS Signature V4，以兼容尽可能多的服务。设置页提供 AWS S3、MinIO、Cloudflare R2、阿里云 OSS、腾讯云 COS、华为 OBS 以及自定义 endpoint 的一键预设，支持连接测试、手动上传 / 下载，以及在配置变更时自动同步（providers、endpoint、MCP、提示词、技能、设置、代理等配置表，**不含**用量日志这类高频写入数据）。开启 S3 同步会停用正在运行的 WebDAV 同步，反之亦然（[#1351](https://github.com/farion1231/cc-switch/pull/1351)）。

#### OpenCode 会话用量同步

新增 OpenCode 作为用量统计来源，从 OpenCode 本地 SQLite 数据库读取每条消息的 token、成本和模型数据并导入用量记录，并提供独立的「OpenCode」应用筛选页签和「OpenCode Session」数据来源标签。数据库路径会遵循 `OPENCODE_DB` 和 `XDG_DATA_HOME`（在所有平台默认 `~/.local/share/opencode`），只导入已完成的消息，并在判断新鲜度时把 WAL 文件一并计入，避免刚写入的会话被跳过（[#3215](https://github.com/farion1231/cc-switch/pull/3215)）。

#### 官方订阅额度模板

由于部分用户担心发起用量查询的 IP 和发起应用内请求的不一致导致封号风险，因此为 Claude / Codex / Gemini 官方供应商新增一个显式、可选的「官方订阅」用量模板，通过 CLI / OAuth 凭据查询套餐额度，替代此前对官方供应商的隐式自动查询。该模板默认关闭，需要在用量脚本弹窗里开启，并可配置刷新间隔。使用此功能建议开启代理的 TUN 模式。

#### 文本模型图片回退整流器

新增一个代理整流器：当路由到的模型仅支持文本（显式声明，或由内置的模型名启发式判定），或上游拒绝图片输入时，会把 Anthropic 图片块替换为 `[Unsupported Image]` 占位标记，避免对话被中断。设置页提供该回退功能的开关，并单独提供一个开关控制启发式检测（可关闭以避免误判多模态模型）。

#### ZenMux Token Plan 供应商

新增 ZenMux 作为 Token Plan 类的 Coding Plan 供应商，可在用量脚本弹窗里手动填写 API key 和 base URL，并以美元口径富展示已用 / 额度（[#2709](https://github.com/farion1231/cc-switch/pull/2709)）。

#### CherryIN 预设

新增 CherryIN 聚合网关作为快捷配置预设，覆盖全部 7 个受管应用——Claude Code / Claude Desktop / OpenClaw / Hermes 使用 Anthropic 格式端点（open.cherryin.net），OpenCode 使用 `@ai-sdk/anthropic`（`/v1`），Codex 使用 OpenAI 兼容端点，Gemini CLI 使用 Gemini 兼容端点，附带官方品牌图标，位置紧挨 AiHubMix（[#3643](https://github.com/farion1231/cc-switch/pull/3643)）。

#### Codex CLI 模型探活端点 `/v1/models`

本地代理现在会响应 Codex CLI 启动时探测的 `GET /v1/models`，返回 CC Switch 托管的 Codex 模型目录。同时加入了过期目录守卫：解析 live 的 `config.toml`，仅当 `model_catalog_json` 仍指向 CC Switch 持有的目录文件时才提供，避免把上一个供应商遗留的目录暴露给 Codex（[#3818](https://github.com/farion1231/cc-switch/pull/3818)）。

#### Codex Chat 文件与音频附件

Codex 的 Responses→Chat 转换现在会把 `input_file`（携带 `file_id` 或内联 `file_data`）和 `input_audio` 内容部分映射为 Chat Completions 的对应形态，并补发此前会被丢弃的顶层 `input_*` 项，让文件和音频附件能够送达只支持 Chat 的 Codex 上游。

### 变更

#### 用量看板 Hero 重新设计

把用量看板的 Hero 区与汇总卡片重排为更紧凑的布局，将真实 token 总量、请求数和成本合并到顶部一行展示（[#3426](https://github.com/farion1231/cc-switch/pull/3426)）。

#### SSSAiCode 端点刷新

把 SSSAiCode 预设的官网、注册和 API base URL 更新到 `sssaicodeapi.com` 域名，并刷新其端点候选节点（默认 `node-hk.sssaicodeapi.com`，另含 `node-hk.sssaiapi.com` 和 `node-cf.sssaicodeapi.com`），覆盖全部 7 个应用预设。

### 修复

#### Codex Chat 流式截断判定

当 Chat Completions 上游在没有 `finish_reason` 或 `[DONE]` 的情况下结束流时，CC Switch 不再把它当作正常完成：只有流真正结束才正常收尾；已产出部分内容时发出 incomplete（`max_output_tokens`）响应；完全没有产出时发出失败的 `stream_truncated` 事件。晚到的推理内容也会回填到仍在进行的流式工具调用上。

#### Codex Chat 空 tools 下的 `tool_choice`

Responses→Chat 转换现在会在最终 tools 数组缺失或为空（包括所有工具被过滤掉）时一并丢弃 `tool_choice` 和 `parallel_tool_calls`，避免严格的 OpenAI 兼容上游（vLLM、企业网关）以"When using `tool_choice`, `tools` must be set."报 503/400（[#3640](https://github.com/farion1231/cc-switch/pull/3640)）。

#### Codex 自定义工具元数据保留

自定义 Codex 工具（如自由格式的 `apply_patch` 工具）现在会把完整的原始定义——包括 format 和 grammar 元数据——以紧凑、顺序稳定的 JSON 块嵌入生成的 Chat 函数描述中，而不是替换成通用占位符，从而在 Chat Completions 上游上仍可正常使用（[#3644](https://github.com/farion1231/cc-switch/pull/3644)）。

#### Codex Chat 用量缺少 `reasoning_tokens`

Chat→Responses 的用量转换现在总会包含 `output_tokens_details.reasoning_tokens`（默认 0），即使供应商省略 `completion_tokens_details` 或返回非对象也是如此，满足 Codex CLI 的严格要求，避免反复的响应解析失败和重试（[#3514](https://github.com/farion1231/cc-switch/pull/3514)）。

#### Codex 自定义工具 / 搜索工具的跨轮推理

Codex Chat 历史里的跨轮推理缓存现在覆盖完整的工具调用集合（`function_call`、`custom_tool_call`、`tool_search_call`）及其输出，而不再仅限普通函数调用，因此 `apply_patch` 和工具搜索调用在通过 `previous_response_id` 恢复时能保留各自的 `reasoning_content`。

#### 临时端口（port 0）解析

当代理被配置为监听 0 端口（由系统分配）时，接管流程现在会先启动代理以拿到真实端口，再写入 live 配置和数据库，避免客户端 URL 指向无效的 `:0` 地址；若还没解析出具体端口，Claude Desktop 的网关 URL 会被直接拒绝。

#### 代理占位符备份 / 恢复死循环

如果上一次停止代理时未能还原原始 live 配置、把代理占位符遗留在了 live 中，再次接管时不会再用代理配置覆盖掉正常备份，恢复时也不会把占位符写回 live：两条路径都会识别占位符状态并以当前供应商为真相来源重建 live，修复了代理开关变成空操作、客户端被钉死在本地代理地址的问题（[#3689](https://github.com/farion1231/cc-switch/pull/3689)）。

#### 代理接管期间误拦截供应商切换

在本地路由接管期间，现在只有显式归类为官方的供应商会被禁止切换，而不会再把端点存在 meta 里、或字段尚未填写的自定义供应商一并禁用。被禁用的「启用」按钮现在以更轻量的提示气泡替代原先的红色「已拦截」标记。

#### localhost 监听地址归一化

保存代理时如果监听地址填的是 `localhost`，现在会先归一化为 `127.0.0.1` 再持久化，避免绑定不一致（[#3016](https://github.com/farion1231/cc-switch/pull/3016)）。

#### Anthropic `system` 消息归一化

对 Anthropic 格式的供应商，`messages` 数组里的 system 角色条目现在会被折叠并合并到顶层 `system` 字段（保留原顺序以及已有的顶层 system），避免严格上游拒绝非首位的 system 消息；OpenAI Chat 路由不受影响（[#3775](https://github.com/farion1231/cc-switch/pull/3775)）。

#### Claude Desktop 1M 上下文模型路由

Claude Desktop 在 1M 上下文 beta 激活时会给模型名追加 `[1m]` 标记（如 `claude-opus-4-8[1m]`）。代理现在会在路由匹配前先剥掉该后缀，让精确、别名、旧名和角色关键词匹配都能正确命中，修复了对话中途切换到 1M 模型时的 `route_unknown`（HTTP 400）失败；诊断用的 `route_unknown` 错误里仍保留原始模型名。

#### Codex 413 错误文案

当 Codex 上游网关以 HTTP 413 拒绝过大的请求体时，代理现在返回专门的提示，说明这是供应商服务端的请求体大小限制（而非 CC Switch 本地限制），并给出可操作的恢复步骤（运行 `/compact`、移除大段日志或内联图片，或请供应商调高限制），不再原样回显上游的 HTML 错误页。

#### 代理面板错误详情

切换代理接管失败时，代理面板的提示现在会带上后端返回的具体错误详情，而不是只显示一句笼统的失败信息（[#3656](https://github.com/farion1231/cc-switch/pull/3656)）。

#### Copilot 无限空白检测阈值

把流式无限空白的中断阈值从 20 调高到 500 个连续空白字符，避免参数里含深层缩进代码（Python、YAML、Rust、Markdown）的正常工具调用被误判中断，同时仍能捕获真正的 Copilot 无限空白 bug（[#2647](https://github.com/farion1231/cc-switch/pull/2647)）。

#### 订阅档位托盘渲染

通过统一的档位到标签映射，修复官方订阅档位在托盘和额度展示上的渲染问题：Claude / Codex 不再漏掉 7 天窗口，Gemini Pro / Flash / Flash-Lite 档位不再泄露原始机器名，多窗口套餐（如 Opus + Sonnet）现在按最差利用率展示而非取第一个匹配。

#### Claude 流式 input_tokens 虚高

部分 Anthropic 兼容的流式供应商（如 Qwen、MiniMax）会在 `message_start` 里把完整上下文当作 `input_tokens` 上报，重复计入了已经单独统计的缓存部分，导致显示的缓存命中率被人为拉低。现在解析器会优先采用 `message_delta` 中更小的正 `input_tokens`，并采用同一 usage 块里配套的缓存计数；原生 Claude 和 OpenRouter 转换路径不变。

#### 智谱配额查询端点路由

智谱 Coding Plan 的配额查询此前被硬编码到 `api.z.ai`，导致使用大陆预设（`open.bigmodel.cn`）的用户在国际端点不可达时查不到用量。现在配额请求会路由到与用户所配 base URL 匹配的主机（[#3702](https://github.com/farion1231/cc-switch/pull/3702)）。

#### MiniMax 余额接口与定价

适配 MiniMax Coding Plan 配额的新余额接口（新接口返回剩余百分比字段，而非旧解析器依赖、会导致档位为空、托盘不再显示用量的用量计数），过滤掉非编程模型（如视频），兼容无周限额的套餐，并为 MiniMax M3 模型补充了默认定价（[#3518](https://github.com/farion1231/cc-switch/pull/3518)）。

#### GLM Coding Plan 端点与模型拉取

把智谱 / Z.AI 的 GLM Coding Plan 预设修正到 `/api/coding/paas/v4` 端点（覆盖 Codex、OpenCode、OpenClaw、Hermes），并让模型列表探测对已经以 `/v{N}` 版本段结尾的 base URL 改为先查 `{base}/models`（保留 `/v1/models` 作为兜底），让「拉取模型」按钮不再在带版本号的端点上 404（[#3524](https://github.com/farion1231/cc-switch/pull/3524)）。

#### Codex 模型目录路径可移植性

Codex 现在只把相对文件名 `cc-switch-model-catalog.json` 写入 `config.toml`，而不是绝对路径（Codex CLI 会从配置目录解析它），修复了在 WSL 和符号链接环境下绝对路径无法转换、导致模型目录失效的问题（[#3614](https://github.com/farion1231/cc-switch/pull/3614)）。

#### APINebula 的 OpenCode SDK

APINebula 的 OpenCode 预设现在加载 `@ai-sdk/openai-compatible` 而非 `@ai-sdk/openai`，让请求使用该中转期望的 OpenAI Chat Completions 格式，而不是只支持 chat-completions 的上游会失败的 Responses API。

#### Windows 退出后托盘图标残留

在 Windows 上退出 CC Switch 可能会留下一个失效的托盘图标，直到鼠标划过才消失。现在应用会在退出前显式移除托盘图标，让它随进程结束干净消失（[#3797](https://github.com/farion1231/cc-switch/pull/3797)）。

#### Windows 任务栏图标

在运行时显式设置 Windows AppUserModelID，并给安装器生成的桌面和开始菜单快捷方式写入相同的 ID 和产品图标，让 CC Switch 在任务栏上显示正确图标并正确归组（[#3457](https://github.com/farion1231/cc-switch/pull/3457)）。

#### Windows 子目录技能的更新检查

在 Windows 上扫描已安装技能时，把反斜杠路径分隔符归一化为正斜杠，让嵌套在子目录里的技能（如 `skills/my-skill`）能被更新检查匹配到，而不是被静默跳过（[#3430](https://github.com/farion1231/cc-switch/pull/3430)）。

#### macOS 输入自动大写

为共享的文本 Input 组件关闭自动完成、自动纠错、自动大写和拼写检查，让 macOS 不再对配置字段里输入的首字母自动大写或自动纠正（[#3626](https://github.com/farion1231/cc-switch/pull/3626)）。

#### Codex VS Code 会话预览

从 VS Code 发起的 Codex 请求，其会话预览在注入请求前存在 markdown 标题时，可能显示选区或打开文件的内容而非真实提示。现在后端标题和前端预览都会匹配最后一个「## My request for Codex:」标题（IDE 把真实请求作为最后一节注入），让预览反映用户的提示（[#3593](https://github.com/farion1231/cc-switch/pull/3593)）。

#### 中文界面 VS Code 文案

把简体和繁体中文里「应用到 Claude Code 插件」的描述改为正确书写「VS Code」而非「Vscode」，与英文、日文文案对齐（[#3228](https://github.com/farion1231/cc-switch/pull/3228)）。

### 文档

#### 用户手册刷新

刷新了 README 各语言版本以及 en / zh / ja 用户手册，使其反映全部 7 个受管应用（在介绍和总览文案里补上 Claude Desktop 与 Hermes），把 OpenCode 配置路径修正为 `~/.config/opencode/`（`opencode.json`），补充了 Hermes 配置文件说明，把语言文档更新为四种语言，订正各应用 MCP / 提示词 / 技能的支持情况，说明导出现在会生成带时间戳、含用量日志的 SQL 备份，并补充了定价模型 ID 匹配规则（[#3411](https://github.com/farion1231/cc-switch/pull/3411)）。

#### Codex 官方认证保留指南

新增中 / 英 / 日三语指南，说明如何在把模型流量切到第三方 API 的同时，保留 Codex 官方远程操作和官方插件的可用性，并从 v3.16.1 release notes 链接到该指南。

#### README 链接与赞助商标记

把各语言 README 里的 Release Notes 链接更新到 v3.16.1，并修复 README_ZH 赞助商区块里损坏的弯引号字符，让其 HTML 属性能正确渲染（[#3772](https://github.com/farion1231/cc-switch/pull/3772)）。

### 升级提醒

#### S3 与 WebDAV 云同步互斥

云同步同一时间只会运行一套后端。开启 S3 自动同步会停用正在运行的 WebDAV 自动同步，反之亦然。如果你之前用的是 WebDAV，切到 S3 前请确认两端数据已对齐，避免误以为旧后端仍在备份。

#### 修改模型映射后仍需重启 Codex

Codex 在启动时读取 `model_catalog_json`。即使本版已把模型目录改写为相对路径并新增了 `/v1/models` 探活端点，只要你修改了模型映射表，仍然需要重启 Codex 才能让 `/model` 菜单刷新。

### 风险提示

本版本继续沿用此前版本对反向代理类功能的风险提示。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**Codex 第三方供应商 Chat 路由**：通过 CC Switch 本地代理把 Codex 请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束不同，请在使用前阅读目标供应商的服务条款。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，同样需要遵守目标供应商的计费、合规与数据留存约束。

用户启用上述功能即表示自行承担相关风险。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

### 致谢

感谢以下贡献者在 v3.16.2 中提交的功能与修复：

- [#1351](https://github.com/farion1231/cc-switch/pull/1351)：新增 S3 兼容云存储同步，感谢 @keithyt06。
- [#3215](https://github.com/farion1231/cc-switch/pull/3215)：新增 OpenCode 会话用量同步，感谢 @nothingness0db。
- [#2709](https://github.com/farion1231/cc-switch/pull/2709)：新增 ZenMux Token Plan 供应商，感谢 @Eter365。
- [#3643](https://github.com/farion1231/cc-switch/pull/3643)：新增 CherryIN 预设供应商，感谢 @zhibisora。
- [#3818](https://github.com/farion1231/cc-switch/pull/3818)：新增 Codex CLI 探活用的 `GET /v1/models` 端点，感谢 @CSberlin。
- [#3426](https://github.com/farion1231/cc-switch/pull/3426)：用量看板 Hero 重新设计，感谢 @allenxu09。
- [#3640](https://github.com/farion1231/cc-switch/pull/3640)：空 tools 时丢弃 `tool_choice`，感谢 @Postroggy。
- [#3644](https://github.com/farion1231/cc-switch/pull/3644)：Chat 路由保留 Codex 自定义工具元数据，感谢 @LanternCX。
- [#3514](https://github.com/farion1231/cc-switch/pull/3514)：Chat→Responses 始终包含 `reasoning_tokens`，感谢 @yeeyzy。
- [#3689](https://github.com/farion1231/cc-switch/pull/3689)：live 已是代理占位符时跳过备份 / 恢复，感谢 @YongmaoLuo。
- [#3016](https://github.com/farion1231/cc-switch/pull/3016)：归一化 localhost 监听地址，感谢 @Alexlangl。
- [#3775](https://github.com/farion1231/cc-switch/pull/3775)：规范化 Anthropic `system` 消息，感谢 @Dearli666。
- [#3656](https://github.com/farion1231/cc-switch/pull/3656)：改进代理面板错误信息展示，感谢 @lzcndm。
- [#2647](https://github.com/farion1231/cc-switch/pull/2647)：调高无限空白检测阈值 20 → 500，感谢 @NiuBlibing。
- [#3702](https://github.com/farion1231/cc-switch/pull/3702)：智谱配额查询按所配 base URL 路由，感谢 @YongmaoLuo。
- [#3518](https://github.com/farion1231/cc-switch/pull/3518)：适配 MiniMax 余额查询新接口与默认定价，感谢 @LaoYueHanNi。
- [#3524](https://github.com/farion1231/cc-switch/pull/3524)：修复智谱 Coding Plan 预设与带版本号端点的模型探测，感谢 @makoMakoGo。
- [#3614](https://github.com/farion1231/cc-switch/pull/3614)：模型目录改用相对文件名，感谢 @steponeerror。
- [#3797](https://github.com/farion1231/cc-switch/pull/3797)：修复 Windows 退出后托盘图标残留，感谢 @iAJue。
- [#3457](https://github.com/farion1231/cc-switch/pull/3457)：修复 Windows 任务栏图标，感谢 @ZhangNanNan1018。
- [#3430](https://github.com/farion1231/cc-switch/pull/3430)：归一化 Windows 路径分隔符以匹配子目录技能更新，感谢 @Ninthless。
- [#3626](https://github.com/farion1231/cc-switch/pull/3626)：关闭 macOS 输入框自动大写，感谢 @ZHLHZHU。
- [#3593](https://github.com/farion1231/cc-switch/pull/3593)：修复 Codex VS Code 会话预览，感谢 @xwil1。
- [#3228](https://github.com/farion1231/cc-switch/pull/3228)：对齐中文界面 VS Code 文案，感谢 @Games55k。
- [#3411](https://github.com/farion1231/cc-switch/pull/3411)：刷新用户手册以反映当前应用支持，感谢 @makoMakoGo。
- [#3772](https://github.com/farion1231/cc-switch/pull/3772)：修复 README release note 链接与赞助商标记，感谢 @null-easy。

也感谢所有在 v3.16.1 发布后反馈 Codex Chat 路由、本地代理接管、用量统计和平台兼容性问题的用户，很多补丁都来自这些真实使用场景里的复现线索。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.16.2-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.16.2-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.16.2-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.16.2-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.16.2-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

Homebrew 安装：

```bash
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux 资产同时提供 **x86_64** 和 **ARM64**（`aarch64`）两种架构。资产文件名中包含架构标识，请按你机器的 `uname -m` 输出选择对应版本：

- `CC-Switch-v3.16.2-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.2-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.16.1] - 2026-06-01

> Codex 稳定性补丁：由于部分用户反映不希望改变配置文件的写入方式，因此为 Codex 增强模式添加开关并默认关闭。开启此开关后，你可以在使用第三方 API 的情况下继续使用 Codex 的手机远程操作、官方插件等功能；本版本也包含一系列稳定性修复。

### 使用攻略

如果你希望在使用第三方 API 的时候解锁官方订阅才可以使用的远程操作 Codex、解锁官方插件，或希望在 Codex 中使用 DeepSeek / Kimi / GLM / MiniMax 等 Chat Completions 上游，建议先看这些文档：

- **[使用第三方 API 时保留 Codex 远程操作和官方插件](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-official-auth-preservation-guide-zh.md)**：说明如何先完成官方登录，再开启 Codex 应用增强，让官方登录态留在 `auth.json`，同时把模型流量切到第三方 API。
- **[在 Codex 中使用 DeepSeek：本地路由实战攻略](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-deepseek-routing-guide-zh.md)**：从添加 Codex 供应商、开启本地路由，到验证请求转发的完整路径。
- **[添加 Codex 供应商：Chat Completions 路由与模型映射](/zh/docs?section=providers&item=add)**：覆盖「需要本地路由映射」、模型映射表与思考能力配置。
- **[本地代理服务](/zh/docs?section=proxy&item=service)** 与 **[本地路由](/zh/docs?section=proxy&item=routing)**：了解代理服务、接管 live 配置、以及相关风险提示。

> [!WARNING]
>
> ## 唯一官方渠道声明（请务必阅读）
>
> CC Switch 是**完全免费、开源**的桌面应用，**不会向用户收取任何费用**。请仅通过下列官方渠道获取本软件：
>
> | 类别     | 唯一官方                                                                       |
> | -------- | ------------------------------------------------------------------------------ |
> | 官网     | **[ccswitch.io](https://ccswitch.io)**                                         |
> | 源码     | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | 下载     | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | 作者     | **[@farion1231](https://github.com/farion1231)**                               |
> | 举报山寨 | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **任何向你收费、要求充值、或索取登录凭据的"CC Switch"网站或客户端均为假冒**。如果你被诱导支付了费用，请立即停止操作并通过 GitHub Issues 反馈。

### 概览

CC Switch v3.16.1 是 v3.16.0 之后的一版 Codex 稳定性补丁。v3.16.0 让第三方 Codex 供应商通过 Chat Completions 路由成为一等公民；这一版则主要处理真实使用中暴露出的几个高风险边角：官方 ChatGPT / Codex OAuth 登录态在第三方供应商切换或本地路由接管期间被覆盖，Codex 模型目录在 live 回填、热切换、关闭接管恢复或编辑当前供应商时被清空，以及 Codex 的 `tool_search`、插件 / 连接器命名空间、自定义工具在 Chat Completions 上游路径中没有完整恢复为 Responses 事件。

这版也加固了本地路由接管的所有权判断：切换供应商和开启 / 关闭接管现在按应用串行执行，判断 live 文件是否由代理接管时不再只看滞后的 `enabled` 或代理服务是否正在运行，而是结合备份和 live 中的代理占位符。这样可以避免刚开启接管、代理临时停止，或热切换时的普通 live 写入把代理托管配置覆盖掉。

### 重点内容

- **Codex OAuth 与第三方供应商切换更安全**：新增可选的官方认证保留设置；开启后，第三方供应商 token 写入 `config.toml`，官方 ChatGPT / Codex OAuth 登录继续留在 `auth.json`。
- **Codex 模型目录不再被静默清空**：`modelCatalog` 以数据库为真相来源，live 回填、供应商切换、接管关闭恢复、编辑弹窗都会避免用丢失投影的 live 配置覆盖数据库。
- **Codex Chat 工具 / 插件路由恢复**：Chat Completions 上游返回的 `tool_search`、已加载命名空间工具、自定义工具会重新映射回 Codex Responses 形态；流式自定义工具现在发出原生 `response.custom_tool_call_input.*` 事件。
- **本地路由接管与热切换更稳**：供应商切换和接管开关按 app 串行，热切换会刷新 Codex live 中的供应商显示信息，但 endpoint 仍保持指向本地代理。
- **诊断与平台兼容性修复**：Codex 代理错误返回更丰富上下文；Codex CLI 模型模板发现支持更多平台并提供 GPT-5.5 静态兜底；Windows 工具版本探测修复乱码与误判。

### 新功能

#### Codex 官方认证保留设置

新增一个可选设置，用于在切换第三方 Codex 供应商时保留官方 ChatGPT / Codex OAuth 登录态。开启后，CC Switch 会把第三方供应商的 API key 放进 Codex `config.toml` 的 provider-scoped `experimental_bearer_token`，而不是覆盖 `auth.json` 里的官方登录缓存。

由于部分用户不希望此功能改变配置文件的写入方式，因此该设置默认关闭，保持 v3.16.0 之前的兼容行为。需要同时使用官方 Codex 登录和第三方供应商的用户，可以在“设置 → Codex 应用增强”里手动开启。

#### Codex DeepSeek 路由指南

新增中 / 英 / 日三语的 Codex DeepSeek 路由指南，包含供应商路由要求、DeepSeek Codex 供应商表单配置，以及本地路由接管的截图说明。

### 变更

#### Codex 认证保留默认改为 opt-in

官方认证保留设置默认关闭。这样第三方 Codex 供应商切换继续沿用旧行为，避免已有用户在不知情的情况下改变 `auth.json` / `config.toml` 的写入方式。

#### Codex 切换供应商后提示重启

Codex 的模型目录与部分配置在客户端启动时加载。现在成功切换 Codex 供应商后，界面会提示用户重启 Codex，让模型目录和配置变化真正生效。

#### 供应商切换与接管开关串行化

Codex / Claude / Gemini 的供应商切换与本地路由接管开关现在共享 per-app 锁，避免两个流程同时修改 live 配置和备份。判断 live 是否由代理接管时，也会优先看 live 备份与 `PROXY_MANAGED` 占位符，而不是只看代理服务是否正在运行。

#### Codex 热切换刷新显示信息

在本地路由接管期间热切换 Codex 供应商时，CC Switch 会刷新 live 配置中的 provider id、模型和显示名称，让 Codex 客户端菜单能跟随当前供应商；同时 base URL 仍保持本地代理地址，避免真实上游 endpoint 泄回 live 文件。

### 修复

#### Codex 接管期间编辑弹窗误显示 live OAuth

当 Codex 处于本地路由接管状态时，live `auth.json` / `config.toml` 已被代理临时改写。编辑当前供应商如果继续读取 live，就会把代理占位符或官方 OAuth 登录误显示成供应商配置。现在编辑弹窗会明确提示：此处显示的是数据库中存储的供应商配置，而不是代理托管的 live 文件；即使代理服务暂时停止，只要该 app 仍处于接管状态，也会按接管逻辑处理。

#### Codex OAuth 在接管期间被清空或覆盖

修复多条 preserve-mode 接管路径，它们此前可能清空或覆盖官方 ChatGPT / Codex OAuth `auth.json`。现在接管检测会识别 `config.toml` 里的 `PROXY_MANAGED`，清理流程只移除代理占位符 token，第三方供应商错误归类为 official 时也不会再走官方 auth 覆盖路径。供应商同步与切换会把 live 备份和占位符视为接管所有权信号，避免正常 live 写入覆盖刚接管或代理暂停时的代理配置。

#### Codex 模型目录数据丢失

修复 `modelCatalog` 在 live 回填、当前供应商编辑弹窗、供应商切换、关闭接管恢复等场景被清空的问题。快照备份会保留已有 `model_catalog_json` 指针；由供应商重建的备份会从数据库真相来源重新生成目录投影；编辑当前供应商时会优先使用数据库里的模型目录，而不是信任可能已经丢失投影的 live 反解结果。

同时，供应商切换现在会始终刷新生成的 Codex 模型目录 JSON（[#3360](https://github.com/farion1231/cc-switch/pull/3360)，感谢 [@Postroggy](https://github.com/Postroggy)）。

#### Codex Chat 工具、插件和自定义工具恢复

修复第三方 Codex 供应商走 Chat Completions 路由时，`tool_search`、已加载的 MCP / connector 命名空间工具、自定义工具无法完整恢复为 Codex Responses 形态的问题。非流式与流式 Chat 响应现在都会根据原始 Responses 请求恢复正确的工具类型、namespace、call id 与参数；自定义工具流式输出会发出原生的 `response.custom_tool_call_input.delta` 和 `response.custom_tool_call_input.done` 事件。

#### Codex 代理错误诊断更完整

Codex 转发失败时，现在返回包含 provider、model、endpoint、上游 HTTP 状态、稳定 `cc_switch_*` 错误码和规范 HTTP 状态的 JSON 错误。这样排查「到底是哪个供应商、哪个 endpoint、哪种上游错误」会清楚很多。

#### Codex 原生余额 / Coding Plan 查询凭据

修复原生余额与 Coding Plan 查询时跨 app 错用凭据的问题。现在每个 app 会解析自己的供应商凭据，不再把其他应用面的认证假设带进查询流程（[#3355](https://github.com/farion1231/cc-switch/pull/3355)，感谢 [@SiskonEmilia](https://github.com/SiskonEmilia)）。

#### Codex CLI 发现与模型目录模板兜底

修复第三方 Codex 模型目录投影对 Codex CLI 发现路径过窄的问题。现在后端会在多平台常见安装位置寻找 Codex CLI，并在仍找不到模板时使用内置 GPT-5.5 模型目录模板兜底（[#3382](https://github.com/farion1231/cc-switch/pull/3382)，感谢 [@chofuhoyu](https://github.com/chofuhoyu)）。

#### Claude Desktop 官方供应商添加失败

修复添加 Claude Desktop 官方供应商时报错的问题（[#3405](https://github.com/farion1231/cc-switch/pull/3405)，感谢 [@Eunknight](https://github.com/Eunknight)）。

#### Kimi / Moonshot 工具思考历史规范化

把 Kimi / Moonshot 加入 Anthropic 兼容工具思考历史 normalizer。后续轮次现在能正确重放 reasoning 与 tool-call 上下文，避免因为历史消息形态不符合上游要求而失败（[#3377](https://github.com/farion1231/cc-switch/pull/3377)，感谢 [@Neon-Wang](https://github.com/Neon-Wang)）。

#### Windows 工具版本探测

修复 Windows 上 `.cmd` / `.bat` 版本命令被错误加引号，以及本地化命令输出被解码成乱码的问题。此前这些问题会让可运行的工具显示为「已安装但无法运行」。

### 升级提醒

#### 官方 OAuth 保留需要手动开启

如果你希望官方 ChatGPT / Codex OAuth 登录长期保留在 `auth.json`，同时又频繁切换第三方 Codex 供应商，请在设置中开启 Codex 官方认证保留。默认关闭是为了保持老用户的兼容行为。

#### 修改模型映射后仍需重启 Codex

Codex 在启动时读取 `model_catalog_json`。因此即使 v3.16.1 已修复模型目录被清空的问题，只要你修改了模型映射表，仍然需要重启 Codex 才能让 `/model` 菜单刷新。

#### 接管期间编辑的是存储配置，不是 live 文件

本地路由接管开启后，live `auth.json` / `config.toml` 会临时指向 CC Switch 代理。此时编辑供应商时看到的是数据库里保存的供应商配置，属于预期行为；关闭接管后，CC Switch 会按备份或数据库真相来源恢复 live 配置。

### 风险提示

本版本继续沿用此前版本对反向代理类功能的风险提示。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**Codex 第三方供应商 Chat 路由**：通过 CC Switch 本地代理把 Codex 请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束不同，请在使用前阅读目标供应商的服务条款。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，同样需要遵守目标供应商的计费、合规与数据留存约束。

用户启用上述功能即表示自行承担相关风险。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

### 致谢

感谢以下贡献者在 v3.16.1 中提交修复：

- [#3360](https://github.com/farion1231/cc-switch/pull/3360)：Codex 供应商切换时始终更新模型目录 JSON，感谢 [@Postroggy](https://github.com/Postroggy)。
- [#3355](https://github.com/farion1231/cc-switch/pull/3355)：原生余额 / Coding Plan 查询按 app 解析凭据，感谢 [@SiskonEmilia](https://github.com/SiskonEmilia)。
- [#3405](https://github.com/farion1231/cc-switch/pull/3405)：修复 Claude Desktop 官方供应商添加报错，感谢 [@Eunknight](https://github.com/Eunknight)。
- [#3382](https://github.com/farion1231/cc-switch/pull/3382)：Codex CLI 多平台发现与 GPT-5.5 模型模板兜底，感谢 [@chofuhoyu](https://github.com/chofuhoyu)。
- [#3377](https://github.com/farion1231/cc-switch/pull/3377)：Kimi / Moonshot 工具思考历史规范化，感谢 [@Neon-Wang](https://github.com/Neon-Wang)。

也感谢所有在 v3.16.0 发布后反馈 Codex OAuth、模型目录、本地路由接管和 Chat Completions 工具调用问题的用户。很多补丁都来自这些真实使用场景里的复现线索。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.16.1-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.16.1-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.16.1-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.16.1-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.16.1-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

Homebrew 安装：

```bash
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux 资产同时提供 **x86_64** 和 **ARM64**（`aarch64`）两种架构。资产文件名中包含架构标识，请按你机器的 `uname -m` 输出选择对应版本：

- `CC-Switch-v3.16.1-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.1-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.16.0] - 2026-05-29

> 为 Codex 增加 Chat Completions -> Response 格式转换（你可以在 Codex 里使用 DeepSeek, Kimi, GLM 了！）、Codex 供应商身份与历史统一、应用管理面板全方位增强、合作伙伴预设扩张、默认模型 / 定价矩阵升级到 GPT-5.5 与 Claude Opus 4.8、代理与格式转换鲁棒性强化

### 使用攻略

本版本最主打的两块能力是 **Codex 第三方供应商 Chat Completions 路由**与**应用内受管 CLI 工具管理**。如果你想让 DeepSeek、Kimi、MiniMax 这类只支持 OpenAI Chat 协议的供应商在 Codex 里直接可用，或者想在应用内一站式安装 / 升级 CLI 工具，建议先读这几篇：

- **[在 Codex 中使用 DeepSeek：本地路由实战攻略](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-deepseek-routing-guide-zh.md)** —— 以 DeepSeek 内置预设为例，演示从添加 Codex 供应商、开启本地路由到验证请求转发的完整路径。
- **[添加 Codex 供应商：Chat Completions 路由与模型映射](/zh/docs?section=providers&item=add)** —— 覆盖「需要本地路由映射」开关、模型映射表、思考能力（reasoning）自适应识别的完整流程。
- **[设置 → 关于：受管 CLI 工具管理](/zh/docs?section=getting-started&item=settings)** —— 覆盖版本检测、单独升级 / 全部升级、冲突诊断、按安装来源锚定的升级命令。

> [!WARNING]
>
> ## 唯一官方渠道声明（请务必阅读）
>
> CC Switch 是**完全免费、开源**的桌面应用，**不会向用户收取任何费用**。最近发现多个山寨网站冒用 CC Switch 名义诱导用户付费、收集账号信息，部分已造成实际经济损失。请仅通过下列官方渠道获取本软件：
>
> | 类别     | 唯一官方                                                                       |
> | -------- | ------------------------------------------------------------------------------ |
> | 官网     | **[ccswitch.io](https://ccswitch.io)**                                         |
> | 源码     | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | 下载     | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | 作者     | **[@farion1231](https://github.com/farion1231)**                               |
> | 举报山寨 | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **任何向你收费、要求充值、或索取登录凭据的"CC Switch"网站或客户端均为假冒**。如果你被诱导支付了费用，请立即停止操作并通过 GitHub Issues 反馈，让我们能尽快下线相关山寨站点。

### 概览

CC Switch v3.16.0 自 v3.15.0 以来的开发核心，是把**第三方 Codex 供应商通过 Chat Completions 路由升级为一等公民**。Codex 原生只认 OpenAI Responses API 与 GPT 系列模型，本版本让 CC Switch 的本地代理把 Codex 发出的 Responses 请求转换为上游的 Chat Completions，再把 JSON 与 SSE 流式响应重建回 Responses 形态，沿途保留 `reasoning_content` / 内联 `<think>` 块 / 流式推理摘要 / 工具调用 / `previous_response_id` 续接状态，并把错误信封规范化、在 Stream Check 中正确探测 Chat 格式供应商。配套上货 22 个带显式模型目录的 Chat 路由预设（DeepSeek、智谱 GLM、Kimi、MiniMax、StepFun、百度千帆、百炼、ModelScope、Longcat、百灵、小米 MiMo、火山 Agentplan、BytePlus、豆包 Seed、SiliconFlow、Novita AI、Nvidia 等）。

Codex 第三方供应商的**身份与历史**这一版被统一并加固：所有第三方供应商现在归并到稳定的 `custom` model-provider 桶，并提供一次性设备迁移来改写历史 JSONL 会话与 `state_5.sqlite` 线程表（原文件备份在 `~/.cc-switch/backups/` 下），避免因供应商 id 变化导致过往会话"凭空消失"；同时修复了 live 读取 / 切换过程中 OAuth 登录态、用户选中的目录模型、用户自定义 provider id 被覆盖的问题。

本版本还新增了**应用内受管 CLI 工具生命周期**：设置页的「关于」Tab 升级为 Claude / Codex / Gemini / OpenCode / OpenClaw / Hermes 的工具管理面板，支持静默安装 / 更新、全部升级、冲突诊断、按安装来源锚定的升级，以及对 WSL 的处理和"已安装但跑不起来"状态的可见化。

供应商生态与模型矩阵同步刷新：新增 APIKEY.FUN、APINebula、AtlasCloud、SudoCode、小米 MiMo Token Plan、Claude Desktop 官方预设；跨应用刷新合作伙伴链接与默认模型 / 定价；默认 Claude Opus 模型线升级到 **4.8**，适用处的 GPT 默认升级到 **5.5**。此外还在用量可观测性、繁体中文本地化、文档、以及代理 / 格式转换的鲁棒性上做了大量打磨与修复。

### 重点内容

- **Codex Chat Completions 路由**：Codex 供应商现在可以由仅支持 OpenAI Chat Completions 的上游提供服务。CC Switch 把 Codex 的 Responses 请求转成 Chat Completions、把 JSON 与 SSE 响应重建回 Responses 形态、保留 reasoning / `<think>` / 工具调用状态、规范化错误信封，并在 Stream Check 中正确探测 Chat 格式供应商
- **Codex 第三方供应商身份与历史统一并更安全**：第三方 Codex 供应商现在共用稳定的 `custom` model-provider 桶，配一次性迁移改写历史 JSONL 会话与 `state_5.sqlite` 线程，并修复 live 读取 / 切换时 OAuth 登录态、用户选中的目录模型、用户自定义 provider id 的保留
- **受管 CLI 工具管理**：「关于」页升级为 Claude / Codex / Gemini / OpenCode / OpenClaw / Hermes 的工具管理面板，含安装 / 更新动作、全部升级、冲突诊断、按来源锚定的升级、WSL 处理，以及"已安装但跑不起来"状态可见化
- **供应商生态与模型矩阵刷新**：新增 APIKEY.FUN、APINebula、AtlasCloud、SudoCode、小米 MiMo Token Plan、Claude Desktop 官方预设；跨应用刷新合作伙伴链接与默认模型 / 定价；默认 Claude Opus 升级到 4.8、适用处 GPT 默认升级到 5.5
- **用量与文档打磨**：用量看板在日志写入时即时响应更新，修复自定义用量脚本摘要与 subagent 会话日志计费，繁体中文 UI 本地化落地，新增德文 README 与扩充后的 Claude Desktop / Codex Chat / 工具管理手册
- **代理与转换硬化**：修复 Codex Chat 推理 / 缓存 / usage 边角情况、DeepSeek Anthropic 工具思考历史、Claude 兼容的空 `tool_calls` 流、受管账号接管鉴权、MiMo 推理输出、Gemini Native 工具调用重放，以及多条易 panic 的代理路径

### 新功能

#### Codex Chat Completions 路由

Codex 供应商现在可以由只会说 OpenAI Chat Completions API 的上游提供服务。CC Switch 的本地代理把 Codex 发出的 Responses 请求转换为 Chat Completions，并把 Chat 响应（JSON 与 SSE 两种）重建回 Responses 形态，沿途保留 `reasoning_content`、内联 `<think>` 块、流式推理摘要、工具调用，以及 `previous_response_id` 续接。一个有界的 Codex Chat 历史缓存会在工具输出之前恢复对应的工具调用。

> 💡 特别感谢 [@EldenPdx](https://github.com/EldenPdx) 的 PR [#2804](https://github.com/farion1231/cc-switch/pull/2804)：本功能的 Chat ↔ Responses 格式转换实现参考了他在该 PR 中的实现。

#### 22 个带 Chat 路由的 Codex 第三方供应商预设

为主流中国开源模型启用了 Chat Completions 路由并带显式模型目录——DeepSeek、智谱 GLM（+ 英文站）、Kimi、MiniMax（+ 英文站）、StepFun（+ 英文站）、百度千帆 Coding Plan、百炼（Bailian）、ModelScope、Longcat、百灵（BaiLing）、小米 MiMo（+ Token Plan）、火山 Agentplan、BytePlus、豆包 Seed、SiliconFlow（+ 英文站）、Novita AI、Nvidia。每个预设都声明了自己的上下文窗口，便于 UI 给模型映射行确定尺寸。

#### Codex 模型映射表

Codex 供应商表单现在提供模型目录（每行：模型 + 显示名 + 上下文窗口），它是上游模型列表的唯一真相来源，并投影到 `~/.codex/cc-switch-model-catalog.json`。

#### Stream Check 支持 Codex Chat 供应商

Stream Check 现在对 Chat 格式的 Codex 供应商改用 Chat 形态的请求体打 `/chat/completions`，而不是 `/v1/responses`；并把 URL 回退顺序与生产环境的 `CodexAdapter` 对齐（仅 origin 的 base URL 先打 `/v1/<endpoint>`），这样裸路径上的非 404 错误不会再把一个正常工作的供应商误判为不可用。

#### Codex Chat 思考能力（Reasoning）自适应

当 Codex 供应商走 Chat Completions 路由时，CC Switch 现在会**自动识别**上游的推理接口——依据是供应商的名称、base URL 和模型名——并注入正确的思考参数（`thinking:{type}`、`enable_thinking`、`reasoning_split`、顶层 `reasoning_effort`，或 OpenRouter 的原生 `reasoning:{effort}` 对象），无需手动配置。聚合 / 托管平台（OpenRouter、SiliconFlow）按**平台优先**匹配，因为同一个模型在不同平台上可能暴露不同的推理控制。只暴露"思考开 / 关"开关的供应商（Kimi、GLM、Qwen、MiniMax、MiMo、SiliconFlow）会**丢弃 effort 等级**而不是透传一个不支持的字段——因此在 Codex 里调节这类供应商的思考等级不会有任何效果——而有真实 effort 档位的供应商（DeepSeek、OpenRouter，以及 StepFun 仅 `step-3.5-flash-2603`）则会把等级透传上去。OpenRouter 特别使用原生 `reasoning:{effort}` 对象，把 `max` 钳到 `xhigh`（它的枚举里没有 `max`），并显式转发 `effort:"none"` 以便关闭推理。

#### Codex Goal Mode 与远程压缩控制

Codex 配置编辑现在为第三方供应商暴露一个 Goal Mode 开关和一个远程压缩（Remote Compaction）开关；新建的 Codex 模板默认 `disable_response_storage = true`，同时仍允许显式开启 goal 支持。

#### 小米 MiMo Token Plan 预设

新增小米 MiMo Token Plan 预设，规格与官方文档对齐（#2803，感谢 @BlueOcean223）。

#### Claude Desktop 官方预设

新增一个 Claude Desktop 官方预设，用于恢复原生 Claude Desktop 登录，并附带本地化的 Claude Desktop 使用指南（中 / 英 / 日）。

#### 受管 CLI 工具生命周期

为受管 CLI 工具新增静默安装 / 更新命令、最新版本检查、单工具与批量动作、全部升级，以及跨 PATH、Homebrew、npm、pnpm、bun、volta、fnm、nvm、scoop、WinGet、Windows 原生路径和 WSL 的多安装诊断。

#### 按来源感知的工具诊断

设置 / 关于 页面现在可以诊断冲突的工具安装、为每条路径展示具体的安装来源与版本，并生成由后端规划、锚定到真实安装来源的升级命令。

#### 实时用量刷新

后端现在在代理日志、会话日志同步或汇总写入用量数据时发出 `usage-log-recorded` 事件；用量看板监听该事件并立即让查询失效，而不是等到下一个轮询周期（#3027，感谢 @in30mn1a）。

#### 繁体中文本地化

新增 `zh-TW` UI 本地化与一个设置语言选项（#3093，感谢 @LaiYueTing）。

#### 德文 README

新增 `README_DE.md` 并从现有 README 的语言切换器中链接到它（#2994，感谢 @flitzrrr）。

#### 新合作伙伴预设

跨各受支持的应用面新增 APIKEY.FUN、APINebula、AtlasCloud、SudoCode 合作伙伴预设，含合作伙伴文案、图标与 README 条目。

### 变更

#### Codex 第三方供应商统一进 "custom" 历史桶

Codex 按 `model_provider` 过滤可恢复历史，因此在供应商专属 id 之间切换会让过去的会话看起来"消失"了。所有第三方供应商现在归并到单一稳定的 `custom` 桶（保留 `openai` / `ollama` 这类预留的内置 id），并配一次性设备迁移：改写历史 JSONL 会话与 `state_5.sqlite` 线程表，原文件备份到 `~/.cc-switch/backups/codex-history-provider-migration-v1/`。

#### Codex 供应商表单简化

从 Codex 表单中移除了 API Format 选择器（`wire_api` 永远是 `responses`，该选择器会误导用户以为能改协议）；模型映射表现在是唯一真相来源，不再有隐藏的默认条目；表单注明改动目录后需要重启 Codex，因为 `model_catalog_json` 在启动时加载。表单只保留「需要本地路由映射」开关。

#### Codex 本地路由开关提示重写

把「关 / 开」两段提示从"场景描述"改写为"动作指引"（什么时候该开），并在中 / 英 / 日三语同步。

#### Codex Live 配置保留

Codex live 配置读取不再强制改写用户的 `model_provider` 字段；供应商作用域的 `experimental_bearer_token` 处理现在会在第三方供应商之间切换时保留 OAuth 登录态。

#### 工具安装 / 升级策略

受管工具安装现在优先使用官方原生安装器（在有的情况下），适当时回退到包管理器，对兼容工具先跑 self-update，把升级锚定到检测到的安装来源，并在工作进行中锁定重复的批量动作。

#### 「关于」页升级为工具管理

设置的「关于」页现在呈现已安装 / 最新版本、安装与更新动作、冲突诊断、WSL shell 偏好，以及对损坏或跑不起来工具更清晰的状态。

#### 默认模型与定价刷新

默认 Claude Opus 模型升级到 4.8，适用处把基于 GPT 的预设与模板迁到 GPT-5.5，刷新定价种子，把 Claude Desktop 模型映射与 Claude Code 的三角色档位对齐，并重命名 OpenCode 的 Go 预设以去掉一个陈旧的模型后缀。

#### 合作伙伴链接刷新

更新了胜算云推荐链接、Atlas Cloud 的 UTM 链接，以及跨各 README 语言版本与供应商元数据中的合作伙伴文案。

#### Homebrew 官方 Cask 安装

由于 CC Switch 已进入 Homebrew 官方仓库，安装简化为 `brew install --cask cc-switch`；各 README 中移除了对私有 tap 的要求。

#### 共享前端工具

用一个共享的 `deepClone` helper 替换 JSON stringify / parse 的深拷贝写法，并抽取了一个共享的 `useTauriEvent` hook（#3140，感谢 @ChongBiaoZhang）。

### 修复

#### Codex Chat 错误响应转换为 Responses 信封

Codex Chat → Responses 桥接此前会原样透传上游错误体，导致 Codex 客户端无法识别 MiniMax 的 `base_resp`、裸 OpenAI Chat 错误，或纯文本 / HTML 错误页。现在错误会被规整为标准的 `{error: {message, type, code, param}}` 信封并保留原始 HTTP 状态码；非 JSON 体会被包裹并在 UTF-8 字符边界截断到 1KB。同时修复了一个既存的 append-vs-insert bug，它会在重写后的 JSON 体上产生重复的 `Content-Type` 头。

#### Codex 流中段 system 消息折叠

MiniMax 的 OpenAI 兼容端点会严格拒绝任何非首位的 `system` 消息（错误 2013）。现在所有 `system` 片段会被折叠为单条首位消息（按原顺序拼接），对宽松后端也是无损的。

#### Codex 模型目录重启后被清空

编辑当前激活的 Codex 供应商会触发一次省略了 `modelCatalog` 的 live 读取，于是随后的保存会静默销毁用户配置的模型映射。Live 读取现在会反向解析磁盘上的目录投影，往返出与保存路径写入的相同形状。

#### Codex 模型目录无限渲染循环

打断了目录表格与其父状态之间的双向同步环路——它在添加或编辑条目时会导致 UI 严重抖动。

#### Codex Chat 保留用户选中的目录模型

客户端从目录里选中的模型（例如通过 `/model`）不再被 `config.toml` 的默认模型覆盖。

#### Codex Chat 推理与缓存稳定性

在 Codex 省略或改写 `previous_response_id` 时恢复一个唯一的 call-id 回退；停止从 `previous_response_id` 派生缓存身份；并在工具转换中对可解析的 JSON 字符串载荷做规范化，以便前缀缓存稳定复用。

#### Codex Chat 流式 usage 恢复

Responses → Chat 转换现在会在请求为流式时注入 `stream_options.include_usage`（并入客户端提供的任何 `stream_options`），这样 Kimi、MiniMax 这类 OpenAI 兼容上游会重新吐出尾部的 usage 块。此前它们在 Codex Chat 路径上的流式 token / 成本 / 缓存统计都被记成了零。

#### Codex Chat 工具调用推理回填

Kimi / Moonshot、DeepSeek 这类思考模型会拒绝携带 `tool_calls` 但 `reasoning_content` 为空的 assistant 消息。当跨轮历史恢复未命中时（代理重启、`call_id` 含糊，或某轮上游没有推理），现在会在最后一遍补回一个占位 `reasoning_content`——真实的尾部推理仍会优先附上——这样请求不再因 `reasoning_content is missing in assistant tool call message` 而失败。

#### 受管账号 Claude 接管鉴权

受管账号供应商（GitHub Copilot / Codex OAuth）在接管 Claude live 配置时，现在会丢弃 token 环境变量键、只写入 `ANTHROPIC_API_KEY` 占位符，并带一个出站守卫拒绝把 `PROXY_MANAGED` 占位符发往上游。

#### 接管期间的 Claude Desktop profile 同步

代理接管时现在会同步 Claude Desktop 的 profile 数据，模型路由与 Claude Code 的三角色档位对齐，并修正了 Cowork egress profile（#3157、#3172，感谢 @MelorTang、@JGSphaela）。

#### 受管账号接管的模型字段

本地路由现在在受管账号上从目标供应商取接管模型字段，而不是携带陈旧的模型值。

#### DeepSeek Anthropic 工具思考历史

规范化了 DeepSeek Anthropic 兼容的工具思考历史，让后续轮次能够重放推理 / 工具调用上下文而不产生畸形消息（#3203，感谢 @Q3yp）。

#### Claude 兼容流中的空工具调用

修复了一个 Claude 兼容流式边角情况：空的 `tool_calls` 数组会重置块状态并破坏流式响应（#2915，感谢 @zhizhuowq）。

#### Claude Code 代理路径的 MiMo 推理

在 Claude Code 代理路径上新增 MiMo 的 `reasoning_content` 支持（#2990，感谢 @zhangyapu1）。

#### Gemini Native 工具调用鲁棒性

修复了长多轮会话中合成工具调用 ID 的 `functionResponse.name` 解析（422）与 `thought_signature` 重放（400）问题（#2814，感谢 @Tiancrimson）。

#### 会话日志 subagent token 计费

`collect_jsonl_files()` 现在会扫描此前被漏掉的 subagent JSONL 日志，使 subagent 的 token 用量被计入会话成本（仅会话日志模式）（#2821，感谢 @LaoYueHanNi）。

#### 用量看板 / 同步稳定性

修复了非 ASCII 模型名导致的 Codex 用量同步 panic、自定义用量脚本摘要，以及用量汇总后缺失实时刷新的问题（#3027、#3129，感谢 @in30mn1a、@hanhan3344）。

#### 智谱 Coding Plan 配额档位排序

当 5 小时桶利用率为 0% 时，智谱 API 会省略 `nextResetTime`；旧的 `i64::MAX` 哨兵会把这类条目排到最后，导致周窗口错误地占用五小时槽位。现在档位排序会让缺失的 `nextResetTime` 映射到五小时桶，使智谱 Coding Plan 的托盘与用量配额显示保持正确。

#### 技能按 key 安装

从 skills.sh 搜索结果安装时现在使用唯一 key 而不是目录名，使共享目录名的技能能安装到正确的那个（#2784，感谢 @zhaomoran）；同时修复了一处技能同步的复制回退（#2791，感谢 @rogerdigital）。

#### 用量价格输入精度

把价格输入步长降到 0.0001，使 DeepSeek 缓存读取这类不足一分的成本也能录入（#2793，关闭 #2503，感谢 @rogerdigital）。

#### Ghostty 干净窗口启动

Ghostty 现在打开单个干净窗口，而不是克隆已有标签页；其他终端则通过 `open -na` 打开新窗口（#2801，关闭 #2798，感谢 @luw2007）。

#### 工具版本与更新可靠性

版本探测不再掩盖跑不起来的安装；预发布工具在版本检查中被正确处理；批量更新逐工具执行；安装 / 更新按钮在预检期间保持锁定；锚定升级分支强制使用绝对路径；WSL 安装器路径在需要时使用原生 Unix 安装器。

#### Codex mise 检测

修复了 Codex 的 mise 环境检测（#2822，感谢 @iambinlin）。

#### Codex 归档会话

Codex 的归档会话现在会被纳入会话发现（#2861，感谢 @nanmen2）。

#### Codex Chat 空工具参数

在 Codex Chat 转换中，空的工具调用参数载荷会被强制为 `{}`，使上游与客户端收到合法 JSON。

#### Claude 供应商 deeplink 导入

通过 deeplink 导入 Claude 供应商时现在会保留自定义环境字段（#2928，感谢 @doutuifei）。

#### OMO 推荐模型

把 OMO 推荐模型与上游默认值同步，并改进了「填入推荐」的反馈。

#### 胜算云模型 ID 加前缀以正确路由

胜算云（ShengSuanYun）预设现在带上了上游网关要求的厂商前缀——`anthropic/…`、`google/…`、`openai/…`（如 `anthropic/claude-sonnet-4.6`、`google/gemini-3.1-pro-preview`）——覆盖 Claude Code、Claude Desktop、Codex、Gemini、OpenCode、OpenClaw 各预设，含 Claude Code 路由环境变量（`ANTHROPIC_MODEL` / `ANTHROPIC_DEFAULT_{HAIKU,SONNET,OPUS}_MODEL`），使它们解析到合法的上游模型而不是路由失败。

#### ClaudeAPI 重新启用模型测试

把 ClaudeAPI 预设（Claude Code 与 Claude Desktop）从 `third_party` 重新归类为 `aggregator`，使其模型测试按钮不再被第三方 Claude 门禁禁用；合作伙伴金星不受影响，因为它由 `isPartner` 而非 category 驱动。

#### 关于页版本检查

版本检查现在能处理预发布工具版本，不会再误判更新状态。

#### App 切换器文本裁切

移除了一个会裁切 App 切换器文本的固定宽度约束（#3161，感谢 @loocor）。

#### useEffect 竞态条件

为 `App.tsx` 的 effects 加了 active-flag 模式以防卸载时的监听器泄漏，并守卫了把 `undefined` 语言存进 localStorage 的情况（#2827，感谢 @Zylo206）。

### 移除

#### LionCC 赞助商与预设

跨各 README、供应商配置与 locale 移除了 LionCC 赞助商条目与 LionCCAPI 预设（图标资源保留）。

#### AICoding 合作伙伴条目

从 README 赞助商列表、供应商预设与 i18n 元数据中移除了 AICoding 合作伙伴。

#### Kimi For Coding 的 Codex 预设

从 Codex 预设目录中移除了 Kimi For Coding 预设。

#### CLI 卸载命令提示

从工具管理 UI 中去掉了生成的 CLI 卸载命令提示，同时保留冲突诊断的可见性。

### 文档

#### Codex Chat 供应商支持

在 changelog 与用户手册中记录了 Chat Completions 路由、供应商支持、推理自适应识别，以及本地路由指引。

#### 设置手册刷新

更新了设置文档，覆盖新的受管工具生命周期与 Hermes 安装器行为。

#### Claude Desktop 指南

新增了本地化的 Claude Desktop 指南页与截图，覆盖供应商设置、导入、模型映射，以及本地路由上下文。

#### 安装文档

更新了安装文档与 README，推荐官方 Homebrew cask，并跨各语言刷新了 v3.15.0 发布说明里关于山寨站点的警告措辞。

### ⚠️ 升级提醒

#### Codex 第三方供应商历史一次性迁移

升级后首次启动会对 Codex 历史执行一次性迁移：把第三方供应商归并到 `custom` 桶，并改写历史 JSONL 会话与 `state_5.sqlite` 线程表。原文件会备份到 `~/.cc-switch/backups/codex-history-provider-migration-v1/`。这一步是为了修复"切换供应商后过往会话消失"的问题——迁移后历史能正常恢复。

#### Codex 改动模型目录需重启

Codex 在启动时加载 `model_catalog_json`，因此在 CC Switch 里改动模型映射表后，需要**重启 Codex** 才能让新目录生效。

#### Chat 路由供应商的思考等级可能无效

对只暴露"思考开 / 关"开关的供应商（Kimi、GLM、Qwen、MiniMax、MiMo、SiliconFlow），在 Codex 里调节思考等级（`model_reasoning_effort` 的 low / medium / high）**不会有任何效果**——CC Switch 不会把不被支持的 effort 字段透传给它们。只有具备真实 effort 档位的供应商（DeepSeek、OpenRouter，以及 StepFun 仅 `step-3.5-flash-2603`）调节等级才真正生效。

#### 默认模型升级到 Opus 4.8 / GPT-5.5

默认 Claude Opus 模型线升级到 4.8，适用处的 GPT 默认升级到 5.5。如果你依赖某个固定的旧默认模型，升级后请检查相关预设 / 模板的模型字段是否符合预期。

### ⚠️ 风险提示

本版本在涉及反向代理类功能上沿用 v3.12.3 / v3.13.0 / v3.15.0 提出的风险提示。

**GitHub Copilot 反向代理**：使用 Copilot 的反代路径可能违反 GitHub / Microsoft 服务条款。详情见 [v3.12.3 release notes](v3.12.3-zh.md#️-风险提示)。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**Codex 第三方供应商 Chat 路由**：通过 CC Switch 本地代理把 Codex 请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束各不相同，请在使用前阅读目标供应商的服务条款。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，第三方供应商对计费、合规与数据留存的约束各不相同，请在使用前阅读目标供应商的服务条款。

用户启用上述功能即表示**自行承担所有风险**。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.16.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.16.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.16.0-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.16.0-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.16.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

> macOS 版本已通过 Apple 代码签名和公证，可直接安装使用。

#### Homebrew（macOS）

> 🎉 CC Switch 现已收录至 Homebrew 官方 cask 仓库，无需添加第三方 tap！

```bash
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

> Linux 资产同时提供 **x86_64** 和 **ARM64**（`aarch64`）两种架构。资产文件名中包含架构标识，请按你机器的 `uname -m` 输出选择对应版本：
>
> - `CC-Switch-v3.16.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
> - `CC-Switch-v3.16.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.15.0] - 2026-05-16

> Claude Desktop 升级为一等管理面板（含第三方供应商代理切换）、按角色的模型映射、反向代理大幅强化、Codex OAuth 实时模型发现、用量看板筛选驱动 Hero 卡

> [!WARNING]
>
> ## 唯一官方渠道声明（请务必阅读）
>
> CC Switch 是**完全免费、开源**的桌面应用，**不会向用户收取任何费用**。最近发现多个山寨网站冒用 CC Switch 名义诱导用户付费、收集账号信息，部分已造成实际经济损失。请仅通过下列官方渠道获取本软件：
>
> | 类别     | 唯一官方                                                                       |
> | -------- | ------------------------------------------------------------------------------ |
> | 官网     | **[ccswitch.io](https://ccswitch.io)**                                         |
> | 源码     | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | 下载     | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | 作者     | **[@farion1231](https://github.com/farion1231)**                               |
> | 举报山寨 | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **任何向你收费、要求充值、或索取登录凭据的"CC Switch"网站或客户端均为假冒**。如果你被诱导支付了费用，请立即停止操作并通过 GitHub Issues 反馈，让我们能尽快下线相关山寨站点。

### Claude Desktop 使用攻略

本版本最主打的能力是 **Claude Desktop 一等管理面板**。如果你已经在 Claude Code 里配置了很多供应商，建议先阅读这篇攻略：

**[使用 CC Switch，一键配置、管理和切换 Claude Desktop 供应商](/zh/docs?section=providers&item=claude-desktop)**

攻略覆盖从 Claude Code 一键导入已有供应商、添加 Claude Desktop 专属供应商、直连 / 模型映射两种模式、本地路由开关显示设置，到恢复 Claude Desktop 官方登录模式的完整流程。

### 概览

CC Switch v3.15.0 是 v3.14.x 之后的一次大版本更新，核心聚焦在**把 Claude Desktop 升级为一等管理面板**，并配套提供第三方供应商通过内置代理网关进行切换、按角色的模型映射（sonnet / opus / haiku）+ `supports1m` 长上下文标志、Copilot/Codex OAuth 供应商复用、重新设计的 Claude Code 导入流程、App 切换器对"Claude Code"和"Claude Desktop"的可视化区分，以及 44 个从 Claude Code 预设目录翻译而来的 Claude Desktop 预设。

围绕反向代理的可靠性，本版本进行了一次系统性硬化：P0–P3 多轮针对路由 / 生命周期 / 重试 / 故障转移 / 补正器的修补；非 Anthropic 后端启用 HTTPS 连接池复用以降低单请求延迟；Codex 与 OpenAI Responses 缓存命中率提升（`prompt_cache_key` 仅在有真实客户端会话标识时发送、对外请求体与 `tool_call` 参数 / `tool_result` 内容的 JSON key 规范化排序、`session_id` 串入用量记录器）；Anthropic ↔ OpenAI `tool_choice` 正确互转；Vertex AI 完整 URL 不再被截断；Gemini 改为从 URI 路径提取模型名；Local Routing 接管检测更精细；可监听 IPv6 地址。Codex OAuth 类 Claude 供应商不再依赖硬编码的模型列表，CC Switch 会按需从 ChatGPT 后端拉取实时模型列表。

Claude Code 的模型映射改为基于角色（`sonnet` / `opus` / `haiku`）+ 显示名，并引入 `supports1m` 布尔标志，替代旧版的 `[1M]` 后缀写法，把路由决策与原始模型 ID 解耦。用量看板新增**筛选驱动的 Hero 卡**，展示缓存归一化后的真实总 token 与缓存命中率，并跟随当前日期范围 / 供应商 / 模型筛选实时更新；配套修复了缓存成本语义错误以及每个请求都触发的定价警告噪声。在 OpenAI Responses API usage 解析路径上做了鲁棒化处理，让上游缺失或畸形的 `usage` 不再让 VSCode Claude Code 插件因 `null` 输出崩溃。

供应商生态进一步扩张：新增 BytePlus、火山 Agentplan、ClaudeAPI、ClaudeCN、RunAPI、RelaxyCode、PatewayAI、百度千帆 Coding Plan 合作伙伴预设；豆包 Seed 升级为合作伙伴预设；供应商卡片现在会显示"是否支持 Local Routing"的徽章。本版本还修复了大量 Codex 会话、OAuth、Claude Desktop 表单、Linux 段错误、终端 fallback 等场景下的细节问题，并完成了多项 GitHub Actions 依赖升级。

### 重点内容

- **Claude Desktop 成为一等管理面板**：通过内置代理网关提供第三方供应商切换、按角色的模型映射（sonnet / opus / haiku）+ `supports1m` 长上下文标志、Copilot/Codex OAuth 供应商复用、44 个从 Claude Code 预设目录翻译过来的预设。注意：20 个 Claude Desktop 预设默认从代理模式切到直连模式，升级后如依赖代理路由请验证连通性
- **反向代理大幅强化**：P0–P3 生命周期 / 重试 / 故障转移 / 补正器修补；非 Anthropic 后端 HTTPS 连接池复用；Codex/Responses 缓存命中率提升；Anthropic ↔ OpenAI `tool_choice` 正确映射；Vertex AI URL 完整保留；Gemini 路径式模型提取；接管检测细化；支持 IPv6 监听地址
- **供应商生态扩张**：新增 BytePlus、火山 Agentplan、ClaudeAPI、ClaudeCN、RunAPI、RelaxyCode、PatewayAI、百度千帆 Coding Plan 合作伙伴预设；豆包 Seed 升级合作伙伴；供应商卡片显示"路由代理支持"徽章
- **按角色的模型映射 + 1M 标志**：基于角色的 sonnet / opus / haiku 路由 + 显示名 + `supports1m` 标志，替代旧的 `[1M]` 后缀
- **Codex OAuth 实时模型发现**：ChatGPT Codex 类供应商按需从 ChatGPT 后端拉取实时模型列表
- **用量看板筛选驱动 Hero**：展示缓存归一化的真实总 token 和缓存命中率，跟随当前日期 / 供应商 / 模型筛选实时更新
- **DeepSeek 工具调用 + 零 usage 最终 delta**：DeepSeek 工具调用一并返回 `reasoning_content` (#2543, 感谢 @bling-yshs)；最终 `message_delta` 总是带 usage 块（即便全为 0），严格 Anthropic 客户端不再因 `null` 崩溃 (#2485, 感谢 @Myoontyee)
- **OpenAI Responses API usage 解析鲁棒化**：让上游缺失或畸形 usage 不再让 VSCode Claude Code 插件崩溃 (#2422, 感谢 @magucas)

### 新功能

#### Claude Desktop 第三方供应商代理切换

CC Switch 第一次把 **Claude Desktop** 作为一等受管面板对待，与 Claude Code / Codex / Gemini / OpenCode / OpenClaw / Hermes 并列。

- 新增 Claude Desktop 专属面板，通过 CC Switch 内置代理网关把第三方供应商代理给 Claude Desktop
- 为需要路由代理的供应商在卡片上呈现"是否支持 Local Routing"的徽章
- 按角色的模型路由映射，锁定到 `sonnet` / `opus` / `haiku`
- Copilot / Codex OAuth 供应商在 Claude Desktop 面板中可复用
- 重新设计的 Claude Code 设置导入流程
- App 切换器视觉区分"Claude Code"与"Claude Desktop"，应用可见性设置中使用"Claude Code"标签
- 44 个从 Claude Code 预设目录翻译过来的 Claude Desktop 供应商预设

#### 供应商卡片：路由代理支持徽章

Claude Code 与 Codex 面板中的供应商卡片新增"路由代理支持"徽章，方便一眼识别哪些供应商可以通过 Local Routing 提供服务。

#### Codex OAuth 实时模型列表

ChatGPT Codex 类供应商不再依赖硬编码的模型选择，CC Switch 会按需从 ChatGPT 后端拉取**实时模型列表**。

#### 按角色的模型映射 + 1M 标志

Claude Code 模型映射改为基于角色（`sonnet` / `opus` / `haiku`）+ 显示名，并引入 `supports1m` 布尔标志，替代旧版 `[1M]` 后缀，把路由决策与原始模型 ID 解耦。

#### 用量看板筛选驱动 Hero

用量看板的 Hero 摘要现在是筛选驱动的，跟随当前日期范围 / 供应商 / 模型筛选实时变化；展示**缓存归一化后的真实总 token**与缓存命中率，让 Hero 数字与下方明细列表对齐。

#### 供应商表单"先存上再说"

软化供应商表单的输入校验，把非阻塞性的输入问题改为"先存上再说"的提示，不会因为一个无伤大雅的字段问题阻止保存 (#2307, 感谢 @allenxln)。

#### Universal 供应商复制动作

为 universal 供应商在供应商列表中新增"复制"按钮 (#2416, 感谢 @hubutui)。

#### 持久化 Tauri 窗口状态

窗口位置和尺寸现在跨重启保留 (#2377, 感谢 @BillSaul)。

#### 托盘图标 hover 提示

系统托盘图标现在悬浮显示状态提示 (#2417, 感谢 @Coconut-Fish)。

#### Warp 终端会话启动

新增对 Warp 终端的支持，可在 Warp 中执行保存的会话 (#2466, 感谢 @tisonkun)。

#### DeepSeek 工具调用 `reasoning_content`

DeepSeek 工具调用响应现在同时返回 `reasoning_content` 和 `tool_calls`，调用方可以两者一并渲染 (#2543, 感谢 @bling-yshs)。

#### 百度千帆 Coding Plan（Claude Code）

新增百度千帆 Coding Plan 预设 (#2322, 感谢 @jimmyzhuu)。

#### Compshare Coding Plan 预设（跨应用）

Compshare Coding Plan 预设跨 claude / codex / hermes / openclaw 全应用就位。

#### 合作伙伴供应商预设

新增 **BytePlus**、**火山 Agentplan**、**ClaudeAPI**、**ClaudeCN**、**RunAPI**、**RelaxyCode**、**PatewayAI** 合作伙伴预设；**豆包 Seed** 升级合作伙伴预设（端点和链接刷新）。

#### 44 个 Claude Desktop 供应商预设

从 Claude Code 预设目录翻译 44 个供应商预设进入新的 Claude Desktop 面板。

### 变更

#### 20 个 Claude Desktop 预设默认切到直连模式

20 个 Claude Desktop 预设默认从代理模式切到直连模式，降低对不需要代理兼容垫片的用户的上手摩擦。如果你升级前依赖代理路由这些预设的连通性，请升级后验证。

#### Claude Desktop 操作约束

切换 Claude Desktop 供应商会写入 CC Switch 管理的 3P profile，**需要重启 Claude Desktop** 才能生效；代理模式的供应商在使用期间需要 CC Switch 的 Local Routing 保持运行。

#### Failover / Local Routing 联动校验

Failover 控件现在要求目标应用的 Local Routing 接管已启用才能开启；只关代理服务但仍有应用依赖接管状态的情况会被拦下，避免出现"代理关了但应用仍以为接管在跑"的不一致。

#### 用量统计语义变化

用量摘要现在报告**缓存归一化后的真实总 token**和**缓存命中率**。历史 token 与成本数字在数据去重 + 价格重算后**可能会有偏移**——新数字更准，但不会等于旧版给出的数字。

#### 供应商预设渲染顺序

预设列表现在按作者定义的数组顺序渲染，合作伙伴排前面，替代之前的隐式排序。

#### 模型映射提示文案简化

`modelMappingOffHint` 跨中 / 英 / 日重写为动作导向的简洁文案。

#### CC Switch 品牌官网统一到 ccswitch.io

应用内和 README 中所有"官网"引用都统一到 ccswitch.io 作为唯一官方网站；Release notes 模板也呈现 ccswitch.io。

#### 主题切换简化

移除主题切换时的圆形扩散动画，改为即时交叉淡入。

#### Claude Code App 切换器视觉区分

App 切换器视觉上区分"Claude Code"和"Claude Desktop"，应用可见性设置中使用"Claude Code"标签。

#### CI：Claude Review 升级到 Opus 4.7

Claude review GitHub Action 升级到 Opus 4.7；调整 prompt 降低 nitpick 噪声；新增 `@claude` 仅 review 的 Code Action；锁定 PR head SHA 用于 checkout；移除 `--max-turns 5` 限制。

#### GitHub Actions 依赖升级

- `actions/checkout` 4 → 6 (#2517)
- `pnpm/action-setup` 5 → 6 (#2518)
- `softprops/action-gh-release` 2 → 3 (#2519)
- `actions/stale` 9 → 10 (#2520)

#### DeepSeek 预设切到 V4

DeepSeek 预设现在出货 V4（flash / pro）+ 刷新定价种子。

#### Codex 1M 上下文开关在编辑表单隐藏

Codex 供应商编辑表单中不再呈现 1M 上下文开关，降低对当前 Codex 部署无实际效果的旋钮密度。

#### OpenClaudeCode 迁移到 MicuAPI 域名

OpenClaudeCode 预设迁移到 MicuAPI 域名；Micu API 链接刷新到 `micuapi.ai`。

#### CrazyRouter 端点切到 `cn` 子域

CrazyRouter 预设端点改用 `cn` 子域。

#### RelaxyCode 自定义图标

RelaxyCode 预设图标改用自定义 `relaxcode.png` 资源。

#### Kimi For Coding 文档 URL

Kimi For Coding 网站 URL 更新到 `/code/docs/` 路径。

#### SiliconFlow 国际站显示 USD

SiliconFlow 国际站的余额显示正确为 USD（之前错显 CNY）。

### 修复

#### OpenAI Responses API usage 解析鲁棒化

强化 `build_anthropic_usage_from_responses()` 与 Responses → Anthropic SSE 翻译器，让上游缺失或畸形的 `usage` 不再在 `message_delta` 中产出 `"usage": null`。这解决了严格 Anthropic 客户端（典型如 VSCode Claude Code 插件）在某些供应商（Codex OAuth、DashScope 的 `compatible-mode/v1/responses` 端点）下崩在 `Cannot read properties of null (reading 'output_tokens')` 的问题。增加 OpenAI 字段名回退（`prompt_tokens` / `completion_tokens`）、null / 空 / 部分对象处理、即使 input/output tokens 缺失也保留缓存 token 字段 (#2422, 感谢 @magucas)。

#### 代理可靠性补丁（P0–P3）

跨 request-forwarder 路径多轮路由 / 生命周期 / 重试 / 补正器修补；抽取共享的 `handle_rectifier_retry_failure` helper 与 `auth_header_value` helper。

#### 代理：非 Anthropic 后端 HTTPS 连接池复用

非 Anthropic 后端复用池化的 HTTPS 连接，不再每个请求开新 TLS session，显著降低单请求延迟。

#### 代理：转发客户端真实 HTTP 方法

不再硬编码 `POST`，按客户端实际的 HTTP 方法转发；上游的非 POST 端点（如 GET `/v1/models`）现在能正常工作。

#### 代理：每次尝试计数器 + `max_retries` 接线

客户端请求计数器移出每次尝试的循环；`AppProxyConfig.max_retries` 现在正确接到请求转发器。

#### 代理：故障转移判定细化

请求转发器中重试 / 不可重试错误的分类更准确。

#### 代理：接管检测细化

接管检测更紧；关接管时走 fallback 恢复，避免遗留状态把供应商卡住。

#### 代理：Anthropic ↔ OpenAI `tool_choice` 互转

格式转换时把 Anthropic 的 `tool_choice` 正确映射到 OpenAI Chat 的嵌套形式。

#### 代理：Gemini 请求模型从 URI 路径提取

Gemini 请求模型从 URI 路径提取（不再从 body 取），转换后的流量上报正确的模型名。

#### 代理：认证 header 错误处理

`get_auth_headers` 现在返回 `Result`，凭据有问题时不再 panic。

#### 代理：IPv6 监听地址校验

代理面板现在接受 IPv6 监听地址。

#### 代理：Codex / Responses 缓存命中率提升

通过稳定缓存键派生提高 Codex 与 OpenAI Responses 请求的缓存命中率；只在客户端确实带了会话标识时才发 `prompt_cache_key`，避免不相关对话被坍缩到同一个 key 上；对外请求体与 `tool_call` 参数 / `tool_result` 内容里的 JSON key 做规范化排序以便前缀缓存能字节级匹配；把 `session_id` 串到 usage 日志记录器做请求关联。

#### 代理：JSON Schema 下划线字段保留

私参过滤现在保留 JSON Schema name map（`properties`、`patternProperties`、`definitions`、`$defs`）内的下划线前缀字段名，用户自定义 schema key（如 `_id`、`_meta`）能正常穿过过滤。

#### 代理：Read 工具空白页剔除

从 `Read` 工具输入中剔除空白页，避免供应商拒绝请求 (#2472, 感谢 @Kwensiu)。

#### 代理：单请求热路径瘦身

缩减每个请求的热路径开销和数据库等待时间。

#### 代理：接管下展示真实供应商模型名

接管运行时，Claude Code 菜单现在暴露真实供应商模型名，不是陈旧的 alias。

#### 代理：最终 `message_delta` 总是带 usage

最终 `message_delta` 事件现在总是包含 usage 块（即使全为 0），严格 Anthropic 客户端不再因为 `null` 崩溃 (#2485, 感谢 @Myoontyee)。

#### 代理：流式 `message_delta` 去重

对某些上游会发两次的 `message_delta` 事件做去重 (#2366, 感谢 @codeasier)。

#### 代理：工具调用路径的 `reasoning_content` 保留

工具调用路径转换时正确保留 scoped `reasoning_content` 字段；Kimi / Moonshot 的 OpenAI Chat 兼容路径保留该字段，通用 OpenAI 兼容请求保持不带 (#2367, 感谢 @codeasier)。

#### 代理：Vertex AI 完整 URL 保留

Vertex AI 的完整 URL 在代理转发时不再被截断 (#2415, 感谢 @xpfo-go)。

#### 代理：剥离 system content 开头的计费 header

某些上游会在 system message 开头插一段计费 header 内容，现在被剥离 (#2350)。

#### 代理：Claude 鉴权策略从 `ANTHROPIC_*` 环境变量名派生

不再依赖不透明的启发式，鉴权策略从实际的 `ANTHROPIC_*` 环境变量名派生。

#### 第三方 Claude 供应商：禁用模型测试

对那些不一致实现 `/v1/models` 的第三方 Claude 网关，关闭模型探测。

#### Model-Fetch：Anthropic 兼容子路径供应商的 `/models`

`/models` 发现现在对 Anthropic 兼容的子路径供应商生效。

#### Copilot：Claude 模型 ID 对比实时 `/models`

Copilot 后端的供应商现在用实时 `/models` 列表来比对 Claude 模型 ID，避免陈旧 ID 不一致。

#### Codex：会话标题不再吸入 `environment_context`

Codex 会话标题提取不再把 `environment_context` 的噪声拉进来 (#2439, 感谢 @eclipsehx)。

#### Codex：隐藏 subagent 会话

Codex subagent 会话从主会话列表隐藏 (#2445, 感谢 @LanternCX)。

#### Codex 启动期 live import 去重

修复 Codex 启动期 live import 路径里的重复导入 bug (#2590, 感谢 @DhruvShankpal)。

#### Codex 供应商切换不再扰动历史

切换激活 Codex 供应商不再改动现有会话历史 (#2349, 感谢 @SaladDay)。

#### Codex 用量日志措辞修正

修正一条 Codex 会话用量的误导性日志 (#2473, 感谢 @tisonkun)。

#### Claude：`max` effort 通过 env 持久化

`max` effort 现在能跨重启正确通过 env 变量持久化 (#2493, 感谢 @makoMakoGo)。

#### Claude Desktop：模型路由不再要求 `[1M]` 后缀

路由匹配不再要求遗留的 `[1M]` 后缀。

#### Claude Desktop：供应商表单输入失焦

修复 Claude Desktop 供应商表单中输入框编辑时丢失焦点的问题。

#### Claude Desktop：假的"代理停止"状态提示

移除代理主动停止时假触发的提示。

#### Claude Desktop：空工具栏胶囊隐藏

当 Claude Desktop 是激活应用时，空的工具栏胶囊会被隐藏。

#### UI：Monitor 徽章图标居中

在 App 切换器里居中 Monitor 徽章图标。

#### Linux：选择主题触发 segfault

防止在 Linux 上选择主题触发 segfault (#2502, 感谢 @definfo)。

#### 终端：冷启动时 iTerm fallback

防止冷启动时把不存在的 iTerm 选为 fallback (#2448, 感谢 @hulkbig)。

#### 配置：JSON key 字母序排序

配置写入现在按字母序排 JSON key，输出确定 (#2469, 感谢 @fuleinist)。

#### "导入已有"无副作用化

"导入已有"操作改为无副作用 (#2429, 感谢 @xwil1)。

#### Coding Plan：智谱周窗口按重置时间命名

修正智谱周窗口的等级名以匹配实际重置时间 (#2420, 感谢 @TuYv)。

#### DashScope：usage 解析鲁棒化

强化 DashScope usage 解析，畸形 payload 不会再让 VSCode Claude Code 插件崩 (#2425, 感谢 @magucas)。

#### 用量：代理和会话日志去重

跨代理和会话日志两个来源的用量记录去重。

#### 用量：缓存成本语义 + 定价警告风暴

修正缓存成本语义，并消除每个请求都触发的噪声定价警告。

#### CI：前端格式化 + Linux clippy 恢复

恢复前端格式化与 Linux clippy 在 CI 中的运行。

#### 代理测试 helper clippy 警告

修复代理测试 helper 中的一个 clippy 警告。

### 移除

#### Hermes Agent 用量追踪集成

移除原本计划在本周期上线的 Hermes Agent 用量追踪集成——上游行为变化让维护这个集成变得不切实际。该集成**从未在任何已发布版本中启用**；开发过程中发现的"零成本渲染" bug 在回滚集成前已经修复。

#### 主题切换圆形扩散动画

移除主题切换时的圆形扩散动画——在性能较弱的合成器上会卡顿，视觉收益有限。

#### DDSHub 合作伙伴整合

移除 DDSHub 作为合作伙伴预设，并删除各 README 中的交叉链接段落。

### 文档

#### README 赞助商刷新（中 / 英 / 日）

新增 BytePlus、ClaudeCN、RunAPI、PatewayAI 赞助商条目；交叉链接 BytePlus 与火山条目；刷新 CrazyRouter 的 $2 额度领取流程、Compshare 描述、Right Code 描述、其他赞助商的 logo 与列表项；把 LionCC logo 抹平到白底；中文 README 的赞助商 logo 切到火山图；在 README 副标题中加入 Hermes Agent。

#### Release notes 模板

Release notes 模板中呈现 `ccswitch.io`。

#### 品牌官网

在各 README 与应用内引用中把 `ccswitch.io` 文档化为唯一官方网站。

### ⚠️ 升级提醒

#### 20 个 Claude Desktop 预设默认切到直连模式

这 20 个预设之前默认通过代理路由，现在默认直连。如果你升级前正好用着其中某个、又依赖代理路由的连通性（比如代理里有特殊补正器或转换层），请验证一下连通性；如有需要，可在 CC Switch 面板里手动切回代理模式。

#### Claude Desktop 操作约束

切换 Claude Desktop 供应商需要**重启 Claude Desktop** 才能生效；代理模式的供应商在使用期间需要 CC Switch 的 Local Routing 保持运行——退出 CC Switch 或停止 Local Routing 会让代理模式的 Claude Desktop 供应商断流。

#### Failover 需要接管启用

启用 Failover 前请先确认目标应用的 Local Routing 接管已开启，否则 Failover 控件会拒绝启动；想关代理服务但仍有应用依赖接管的情况会被拦下，需要先在应用层关掉接管再停代理。

#### 用量统计数字可能与历史不一致

用量摘要现在用缓存归一化的真实总 token + 缓存命中率。历史 token 与成本数字在数据去重 + 价格重算后**可能会有偏移**——新数字更准，但不会等于旧版给出的数字。

### ⚠️ 风险提示

本版本在涉及反向代理类功能上沿用 v3.12.3 / v3.13.0 提出的风险提示。

**GitHub Copilot 反向代理**：使用 Copilot 的反代路径可能违反 GitHub / Microsoft 服务条款。详情见 [v3.12.3 release notes](v3.12.3-zh.md#️-风险提示)。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，第三方供应商对计费、合规与数据留存的约束各不相同，请在使用前阅读目标供应商的服务条款。

用户启用上述功能即表示**自行承担所有风险**。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.15.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.15.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.15.0-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.15.0-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.15.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

> macOS 版本已通过 Apple 代码签名和公证，可直接安装使用。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

> Linux 资产同时提供 **x86_64** 和 **ARM64**（`aarch64`）两种架构。资产文件名中包含架构标识，请按你机器的 `uname -m` 输出选择对应版本：
>
> - `CC-Switch-v3.15.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
> - `CC-Switch-v3.15.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.14.1] - 2026-04-23

> 托盘用量可见化、Codex OAuth 多项稳定性修复、Skills 导入/安装可靠性提升、Hermes 配置健康扫描器移除

### 概览

CC Switch v3.14.1 是 v3.14.0 之后的一次补丁版本，围绕 **Codex OAuth 反代稳定性**、**托盘用量可见化**、**Skills 导入 / 安装可靠性**、**Gemini 会话恢复路径**，以及**简化 Hermes 配置健康处理**展开。

系统托盘第一次把当前 Claude / Codex / Gemini 供应商的**缓存用量**直接呈现在子菜单里——包含订阅额度摘要和用量脚本摘要，并用颜色标记利用率；针对 Kimi / 智谱 / MiniMax 这类中国编码套餐供应商，托盘还会额外渲染 `🟢 h12% w80%` 风格的 **5 小时 + 周窗口**双窗口排版，语义与官方订阅徽章完全一致（取更紧的那个驱动 emoji）。创建 Claude 供应商时，如果 `ANTHROPIC_BASE_URL` 命中已知的编码套餐 host，会自动注入 `meta.usage_script`，托盘可以不打开 Usage Script 模态框就直接点亮。

Codex OAuth 侧修复了多项反代稳定性问题：使用客户端自带的 session ID 作为 `prompt_cache_key` 和 Codex session 头，避免生成 UUID 造成缓存抖动，显著提高缓存命中率；非流式 Anthropic 客户端在 ChatGPT Codex 上游强制 OpenAI Responses SSE 时也能正确拿到 JSON 响应；Stream Check 现在会以和生产一致的 `store: false`、encrypted reasoning include 以及供应商 FAST 模式构造探测请求，避免出现"检测失败但实际能用"的错位。配合新增的 **FAST 模式显式开关**，让用户可以在 Codex OAuth 型 Claude 供应商上按需发 `service_tier="priority"`，在延迟和 ChatGPT 配额消耗之间自己选。

另外，移除了 CC Switch 内置的 **Hermes 配置健康扫描器**及其警告横幅（以及对应的 `scan_hermes_config_health` 命令、`HermesHealthWarning` 类型和 `HermesWriteOutcome.warnings` 载荷），把 Hermes 面板聚焦回当前供应商展示、默认切换、Memory 编辑和启动 Hermes Web UI，深度配置健康度由 Hermes 自己负责。

### 重点内容

- **托盘用量可见化**：Claude / Codex / Gemini 托盘子菜单展示当前供应商缓存用量，含订阅与脚本摘要及颜色标记；刷新带节流、仅针对可见应用、并回写到 React Query (#2184, 感谢 @TuYv)
- **托盘编码套餐用量（Kimi / 智谱 / MiniMax）**：托盘渲染 5 小时 + 周窗口双窗口用量，沿用 `🟢 h12% w80%` 排版；命中已知 host 的 Claude 供应商自动注入 `meta.usage_script`
- **Codex OAuth FAST 模式**：为 Codex OAuth 型 Claude 供应商新增显式 FAST 开关，开启后转换后的 Responses 请求发 `service_tier="priority"`，默认关闭 (#2210, 感谢 @JesusDR01)
- **Codex OAuth 稳定性**：修复反代缓存路由 (#2218, 感谢 @majiayu000)、Responses SSE 聚合 (#2235, 感谢 @xpfo-go)、Stream Check 与生产一致性 (#2210, 感谢 @JesusDR01)
- **Hermes 配置健康扫描器移除**：把 Hermes 面板聚焦回供应商管理、Memory 编辑和 Web UI 启动，不再重复承担深度配置健康判断
- **Skills 导入 / 安装可靠性**：导入过程中禁用操作按钮、结果按 ID 去重 (#2211, 感谢 @TuYv)；一键配置基于最新表单状态 (#2249, 感谢 @Coconut-Fish)；根级 `SKILL.md` 仓库安装稳定 (#2231, 感谢 @santugege)
- **Gemini 会话恢复路径**：扫描会话时读取 `.project_root` 元数据，把原始项目目录带回恢复流程 (#2240, 感谢 @tisonkun)
- **Session / 设置布局打磨**：滚动区域视口加宽度约束修复横向溢出，应用底部和设置页底部间距更紧凑 (#2201, 感谢 @Coconut-Fish)

### 新功能

#### 托盘用量可见化

- 系统托盘子菜单新增当前 Claude / Codex / Gemini 供应商的**缓存用量**展示 (#2184, 感谢 @TuYv)
- 包含订阅额度摘要和用量脚本摘要，并用颜色标记利用率
- 托盘触发的刷新**带节流**、**只覆盖可见应用**，并同步回 React Query，主窗口和托盘共享同一份用量数据

#### 托盘编码套餐用量（Kimi / 智谱 / MiniMax）

- 托盘为中国编码套餐供应商渲染 **5 小时 + 周窗口**双窗口用量
- 使用与官方订阅徽章一致的 `🟢 h12% w80%` 两窗口排版，取更紧的那个利用率驱动 emoji 颜色
- 创建 Claude 供应商时，如果 `ANTHROPIC_BASE_URL` 匹配已知编码套餐 host，会**自动注入** `meta.usage_script`，托盘不打开 Usage Script 模态框也能直接点亮
- 更新时会**保留已有** `usage_script` 值，不覆盖用户自定义

#### Codex OAuth FAST 模式

- 为 Codex OAuth 型 Claude 供应商新增显式 FAST 模式开关 (#2210, 感谢 @JesusDR01)
- 开启时，转换后的 Responses 请求会发 `service_tier="priority"` 以降低延迟
- 默认关闭，避免意外增加 ChatGPT 配额消耗

### 变更

#### Session 与设置布局打磨

- 滚动区域视口加上宽度约束，修复横向溢出 (#2201, 感谢 @Coconut-Fish)
- 应用底部和设置页底部间距更紧凑，让长 Session / 设置视图看起来更干净

### 移除

#### Hermes 配置健康扫描器

- 移除应用内的 Hermes 配置健康扫描器和警告横幅
- 移除 `scan_hermes_config_health` 命令、`HermesHealthWarning` 类型以及 `HermesWriteOutcome.warnings` 载荷
- CC Switch 的 Hermes 面板回归核心职责：当前供应商展示、切换默认供应商、Memory 编辑、以及启动 Hermes Web UI 处理深度配置

### 修复

#### Codex OAuth 缓存路由

- 使用客户端自带的 session ID 作为 `prompt_cache_key` 和 Codex session 头，保留显式缓存 key (#2218, 感谢 @majiayu000)
- 停止生成 UUID 导致的缓存抖动，让 ChatGPT Codex 反代的缓存身份更稳定

#### Codex OAuth Responses SSE 聚合

- ChatGPT Codex 上游强制 OpenAI Responses SSE 时，非流式 Anthropic 客户端也能正确拿到 JSON (#2235, 感谢 @xpfo-go)
- CC Switch 会在非流式转换之前先聚合上游 SSE 事件

#### Codex OAuth Stream Check 对齐

- Stream Check 构造的 Codex OAuth 测试请求现在与生产代理一致，使用相同的 `store: false`、加密 reasoning include 和供应商 FAST 模式设置 (#2210, 感谢 @JesusDR01)
- 避免"检测失败但实际能用"的错位

#### Codex 模型提取

- 读取 Codex 配置的 `model` 字段时，改用 TOML 解析替代首行正则匹配 (#2227, 感谢 @nmsn)
- 多行 TOML 也能正确处理

#### 模型快速填入 / 一键配置

- 模型快速填入现在基于**最新的**供应商表单配置应用 (#2249, 感谢 @Coconut-Fish)
- 修复陈旧表单状态导致一键配置失败的问题

#### Skills 导入去重

- Skills 导入对话框在导入进行时禁用所有操作按钮 (#2211, 感谢 @TuYv)
- 已安装 Skills 的缓存按 ID 去重，避免双击造成重复的已安装条目 (#2139)

#### 根级 Skill 仓库

- Skill 的安装与更新流程现在能一致地识别三种源路径：直接嵌套路径、按 install-name 递归搜索、以及仓库根的 `SKILL.md` 源 (#2231, 感谢 @santugege)

#### Gemini 会话恢复路径

- Gemini 会话扫描时读取 `.project_root` 元数据 (#2240, 感谢 @tisonkun)
- 恢复流程可以在可用时把原始项目目录传回

#### 供应商名悬浮提示

- 供应商图标在 inline SVG、图像 URL、以及首字母回退渲染路径下都会在 hover 时展示供应商名称 (#2237, 感谢 @tisonkun)

### 说明与注意事项

- **Hermes 健康扫描器已移除**：如果你依赖 CC Switch 提示 Hermes YAML 的深度配置问题，请改为通过工具栏的"启动 Hermes Web UI"按钮在 Hermes 原生面板里查看。日常供应商管理、切换、Memory 编辑、MCP 与 Skills 同步仍然由 CC Switch 负责。
- **Codex OAuth FAST 模式默认关闭**：只有在你接受可能增加 ChatGPT 配额消耗换取更低延迟时，才需要打开。
- **托盘缓存用量**：刷新带节流，只覆盖当前显示的应用，避免无必要的上游 API 调用；数据会回写到 React Query，因此主窗口和托盘看到的值一致。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64                                 |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.14.1-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.14.1-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.14.1-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.14.1-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.14.1-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

> macOS 版本已通过 Apple 代码签名和公证，可直接安装使用。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.14.0] - 2026-04-21

> Hermes Agent 成为第 6 个受管应用、Claude Opus 4.7 全面接入、Gemini Native API 代理、Local Routing 统一重命名、应用级窗口控件

### 概览

CC Switch v3.14.0 是一次大版本更新，核心焦点是把 **Hermes Agent 作为第 6 个一等受管应用**接入 CC Switch，并把 **Claude Opus 4.7** 铺设到全部聚合器与 Bedrock 预设矩阵。Hermes 支持覆盖数据库 v9 → v10 迁移、完整的 Rust 命令面、基于 YAML 的 `~/.hermes/config.yaml` 读写（含原子备份）、MCP 同步、Skills 同步、SQLite + JSONL 会话管理，以及专属的前端面板和 Memory 编辑面板；与 Hermes Agent 0.10.0 schema 对齐的四种协议（`chat_completions`、`anthropic_messages`、`codex_responses`、`bedrock_converse`）全部可选。用户自行维护的 `providers:` dict 条目以只读卡片形式呈现，深度 YAML 配置则直接委托给 Hermes Web UI。

除了 Hermes，本次还新增了 **Gemini Native API 代理**（`api_format = "gemini_native"`），让代理可以把请求直接转发到 Google 的 `generateContent` 端点，完整支持流式、schema 转换和 shadow 请求；把老的 "Local Proxy Takeover" 在三语 UI / README / 文档中统一重命名为 **Local Routing**；新增 **应用级窗口控件**，在 Linux Wayland 等合成器绘制按钮失灵的场景下可选让 CC Switch 自绘最小化 / 最大化 / 关闭按钮；并在本版本发布前额外合入了从工具栏直接启动 `hermes dashboard`、LemonData 全应用预设、DDSHub Codex 端点以及若干 Hermes 健康检查与 Usage 模态框的修复。

会话侧通过 `@tanstack/react-virtual` **虚拟化会话列表**，让上千条记录的长会话也能流畅滚动，长消息默认折叠；Usage 面板新增**日期范围选择器**（今日 / 1d / 7d / 14d / 30d + 自定义日期时间）和翻页输入；**Stream Check 错误分类**以彩色 toast 呈现，默认探测模型重新梳理，"模型不存在"响应被单独识别；并新增在 Local Routing 激活时**阻止切换到官方供应商**的保护，以免官方流量被引入本地代理造成账号风险。Pricing 数据库 v8 → v9 重新种入约 50 个新模型条目（包括 Claude 4.7、Opus 4.7 Adaptive Thinking、Grok 4、Qwen 3.5/3.6、MiniMax M2.5/M2.7、Doubao Seed 2.0 系列、GLM-5/5.1 等），并修正了多项陈旧价格。

### 重点内容

- **Hermes Agent 支持（第 6 个受管应用）**：数据库 v9 → v10 迁移、完整 Rust 命令面、YAML 读写带原子备份、MCP 同步、Skills 同步、SQLite + JSONL 会话管理、专属前端面板、四种 API 协议（`chat_completions` / `anthropic_messages` / `codex_responses` / `bedrock_converse`）
- **Claude Opus 4.7 全面接入**：自适应思维白名单、按百万 token 定价种子、Bedrock SKU（`anthropic.claude-opus-4-7` / `global.anthropic.claude-opus-4-7`，丢弃老 `-v1` 后缀），全部聚合器 / Bedrock 预设升级为默认 Opus 模型
- **Claude `max` 推理力度**：推理下拉从 `high` 升级到 `max`
- **Gemini Native API 代理**：新增 `api_format = "gemini_native"`，代理可直达 Google `generateContent`，完整流式 / schema 转换 / shadow 请求
- **GitHub Copilot 企业版**：为 Copilot 型 Claude 供应商新增 GHES 认证与端点配置
- **Copilot 次数消耗深度优化**：转发前主动剥离 thinking 块、`tool_result` 消息归类修正、subagent 检测、`x-interaction-id` 合并计费、orphan `tool_result` 清理、默认启用 warmup 降级 —— 系统性降低 premium 交互消耗
- **会话列表虚拟化**：长会话流畅滚动，长消息默认折叠降低文字布局成本
- **Codex / OpenClaw 会话标题提取**：自动抽取有意义标题，两行显示，剥离 OpenClaw `message_id` 尾噪声
- **Usage 日期范围选择器**：Today / 1d / 7d / 14d / 30d 预设 + 自定义日期时间日历；分页列表支持页码跳转输入
- **Stream Check 错误分类**：错误按类别分色 toast；默认探测模型刷新；单独识别 "model not found"
- **Local Routing 激活时阻止官方供应商切换**：官方流量走本地代理有账号暂停风险，强制拦截并 toast 警告
- **Pricing 数据库刷新（v8 → v9）**：新增 ~50 条模型条目并修正陈旧价格
- **应用级窗口控件**：可选让 CC Switch 自绘 min/max/close，显著改善 Linux Wayland 体验
- **Hermes 接入统一 Skills 管理**：Skills 安装 / 启用 / 过滤现覆盖 Hermes
- **Hermes / OpenClaw 配置目录自定义**：在设置里指定 `~/.hermes/config.yaml` 或 `openclaw.json` 的自定义位置
- **从工具栏启动 Hermes Dashboard**：Web UI 探测失败时，点击可在用户首选终端中启动 `hermes dashboard`
- **新合作伙伴预设**：LemonData 覆盖全部 6 个应用；DDSHub 新增 Codex 端点；StepFun Step Plan

### 新功能

#### Hermes Agent 支持（第 6 个受管应用）

CC Switch 首次支持 Hermes Agent 作为一等受管应用，与 Claude / Codex / Gemini / OpenCode / OpenClaw 并列。

- **数据库迁移 v9 → v10**：为 `mcp_servers` 和 `skills` 表新增 `enabled_hermes` 列（`DEFAULT 0` 自动迁移，无数据丢失）
- **YAML 配置读写**：`~/.hermes/config.yaml` 读写带原子备份；`tests/hermes_roundtrip.rs` 守护不损坏不相关键和 OAuth MCP `auth` 块
- **四种 API 协议**：与 Hermes Agent 0.10.0 对齐的 `chat_completions` / `anthropic_messages` / `codex_responses` / `bedrock_converse`；新 deeplink 默认为 `chat_completions`
- **用户 `providers:` dict 只读呈现**：用户在 YAML 里手写的 providers 条目在 CC Switch 中以只读卡片展示，深度配置跳转到 Hermes Web UI
- **累加式切换**：与 Claude / Codex 的"覆盖式"切换不同，Hermes 所有供应商共存于同一 YAML

#### Hermes Memory 面板

- 新增 Memory 面板直接编辑 `MEMORY.md` / `USER.md`，带启用开关、字符数限制和保存流
- 替换 Hermes 的 Prompts 入口

#### Hermes 供应商预设（约 50 个）

- 覆盖 Nous Research、胜算云、OpenRouter、DeepSeek、Together AI、StepFun、智谱 GLM、百炼、Kimi、MiniMax、豆包、百灵、魔搭、KAT-Coder、PackyCode、Cubence、AIGoCode、RightCode、AICodeMirror、AICoding、CrazyRouter、SSSAiCode、Micu、CTok.ai、DDSHub、E-FlowCode、LionCCAPI、PIPELLM、Compshare、SiliconFlow、AiHubMix、DMXAPI、TheRouter、Novita、Nvidia、小米 MiMo

#### 从工具栏启动 Hermes Dashboard

- Hermes Web UI 探测失败时，工具栏按钮改为弹出确认框，提供在用户首选终端里运行 `hermes dashboard`
- 通过临时 bash / batch 脚本启动，`hermes dashboard` 就绪后自动打开浏览器，无需轮询
- Memory 面板和 Health banner 保留原有 toast 行为
- 顺便修正了离线 toast 里过时的 `hermes web` 提示（正确命令是 `hermes dashboard`）
- Linux 终端探测改为先 `which` 后 stat，提升兼容性

#### Claude Opus 4.7 支持

- 新增 Claude Opus 4.7 及其自适应思维白名单、按百万 token 定价种子、Bedrock SKU（`anthropic.claude-opus-4-7` / `global.anthropic.claude-opus-4-7`，丢弃老 `-v1` 后缀）
- 全部聚合器 / Bedrock 预设升级为默认 Opus 模型

#### Claude `max` 推理力度

- Claude 推理下拉从 `high` 升级到 `max`，解锁更强的思考容量

#### Gemini Native API 代理

- 新增 `api_format = "gemini_native"`，代理可直接转发到 Google `generateContent` API (#1918, 感谢 @yovinchen)
- 完整支持流式、schema 转换、shadow 请求
- 在 proxy providers 模块下新增 `gemini_url.rs`、`gemini_schema.rs`、`gemini_shadow.rs`、`streaming_gemini.rs`、`transform_gemini.rs`

#### GitHub Copilot 企业版（GHES）

- 为 Copilot 型 Claude 供应商新增 GHES 认证与端点配置 (#2175, 感谢 @hotelbe)

#### 会话列表虚拟化

- 通过 `@tanstack/react-virtual` 虚拟化会话列表，上千条记录流畅滚动
- 长会话消息默认折叠，减少文字布局开销

#### Codex / OpenClaw 会话标题提取

- Codex 和 OpenClaw 会话自动抽取有意义的标题，两行显示
- 剥离 OpenClaw `message_id` 后缀噪声

#### Usage 日期范围选择器

- Usage 面板新增日期范围选择器，预设 Tab（Today / 1d / 7d / 14d / 30d）+ 自定义日期 + 时间日历 (#2002, 感谢 @yovinchen)
- 分页列表新增页码跳转输入

#### 模型映射快速填入

- 供应商表单的模型映射字段旁新增快速填入按钮，加快编辑 (#2179, 感谢 @lispking)

#### Stream Check 错误分类

- 按类别为 Stream Check 错误上色并以 toast 呈现
- 刷新所有厂商默认探测模型到当前主力机型
- 对 "model not found" 响应做单独识别

#### Local Routing 激活时阻止官方供应商切换

- 在 Local Routing 激活状态下，切换到官方供应商会被强制拦截并弹出警告 toast
- 原因：官方 API 流量经由本地代理存在账号暂停风险

#### Pricing 数据库刷新（v8 → v9）

- 迁移时重新种入定价表
- 新增约 50 条模型条目，覆盖 Claude 4.7、Opus 4.7 Adaptive Thinking、Grok 4、Qwen 3.5/3.6、MiniMax M2.5/M2.7、Doubao Seed 2.0 系列、GLM-5/5.1
- 修正 DeepSeek、Kimi K2.5 等陈旧价格

#### 应用级窗口控件

- 新增可选设置，让 CC Switch 自绘最小化 / 切换最大化 / 关闭按钮，代替系统装饰 (#1119, 感谢 @git1677967754)
- 在合成器按钮可能失灵的 Linux Wayland 上显著改善体验

#### Hermes 接入统一 Skills 管理

- 统一的 Skills 界面新增 Hermes
- Skills 安装 / 启用 / 过滤现覆盖 Hermes，与 Claude / Codex / Gemini / OpenCode / OpenClaw 并列

#### OpenClaw 配置目录自定义

- 新增设置项，允许把 CC Switch 指向自定义的 `openclaw.json` 位置 (#1518, 感谢 @mrFranklin)

#### Hermes 配置目录自定义

- 新增设置项，允许把 CC Switch 指向自定义的 `~/.hermes/config.yaml` 位置，底层通过数据驱动 dispatch

#### StepFun Step Plan 预设

- 新增 StepFun Step Plan（EN / ZH）供应商预设 (#2155, 感谢 @hengm3467)

#### New API 用量脚本模板

- 为 New API 用量脚本模板新增 User-Agent 头，提升上游兼容性

#### LemonData 全应用预设

- LemonData 作为第三方合作伙伴预设覆盖 Claude / Codex / Gemini / OpenCode / OpenClaw / Hermes 全部 6 个应用
- 含图标资源和 zh / en / ja 三语合作伙伴推广文案
- Claude 预设使用 `ANTHROPIC_API_KEY` 认证，OpenAI 兼容应用目标为 `gpt-5.4`

#### DDSHub Codex 预设

- 新增 DDSHub 的 Codex 兼容端点（与 Claude 服务同 host）
- base URL 省略 `/v1` 后缀，由网关自动路由 OpenAI SDK 路径

### 变更

#### "Local Proxy Takeover" → "Local Routing"

- 三语 UI 文案、README、文档中全部统一重命名
- 功能行为保持不变

#### Hermes `Auto` api_mode 移除

- 用户必须显式选择协议；新 deeplink 默认为 `chat_completions`
- 消除了基于 URL 的启发式识别带来的意外

#### Hermes 供应商表单

- 新增 API mode 下拉和按供应商的模型编辑器
- 切换激活供应商时，把按供应商的模型绑定到顶层 `model:`

#### Hermes 深度配置委托

- 深度 YAML 配置不再在 CC Switch 表单里重复，直接通过"启动 Hermes Web UI"按钮交给 Web UI

#### Hermes 工具栏布局

- Web UI 按钮图标从 `ExternalLink` 换成 `LayoutDashboard` —— 点击可能启动 `hermes dashboard` 而非仅仅打开 URL，面板式图标语义更准
- MCP 移到工具栏末尾，与 Claude / Codex / Gemini / OpenCode 的布局对齐

#### Claude Quick-Set 移除 `ANTHROPIC_REASONING_MODEL`

- 把推理能力和模型选择解耦，quick-set 表单不再暴露该遗留字段

#### 按供应商代理配置移除

- 统一到全局的 Local Routing
- 按供应商的代理开关和存储都已移除

#### 统一工具栏图标按钮宽度

- 在 Claude / Codex / Gemini / OpenCode / OpenClaw / Hermes 面板之间规格化图标按钮宽度，表头视觉一致

#### Rust Toolchain 锁定 1.95

- 全仓库采纳 clippy 1.95 建议并锁定 toolchain，防止 nightly 漂移

#### 托盘菜单 ID 常量

- 托盘标识符从硬编码字符串 `"main"` 改为 `TRAY_ID` 常量（`"cc-switch"`），所有调用点同步 (#1978, 感谢 @lidaxian121)

#### Copilot 次数消耗深度优化

一次系统性优化专门降低 Copilot 反向代理的 premium 交互消耗，涵盖以下多项改进：

- **转发前主动剥离 thinking 块**：Anthropic 的 `thinking` / `redacted_thinking` 块会被 OpenAI 兼容端点拒绝，过去一次请求先失败消耗一次 premium 交互、再由 `thinking_rectifier` 触发重试。新增主动剥离步骤（Copilot 优化管线第 3.5 步，位于 `tool_result` 合并之后），直接省掉那一次无谓的 premium 消耗
- **请求分类修正**：含 `tool_result` 的消息归类为代理继续，而不是用户发起的新请求 —— 避免每次工具调用都被错误计入 premium 次数
- **subagent 检测**：通过 `__SUBAGENT_MARKER__` 和 `metadata._agent_` 回退识别 subagent，设置 `x-interaction-type=conversation-subagent`
- **确定性 `x-interaction-id` 合并计费**：从 session ID 推导 `x-interaction-id`，把同一会话内的多次请求合并为一次计费交互
- **Orphan `tool_result` 清理**：清理孤立的 `tool_result`，避免触发上游错误导致重试和重复计费
- **Warmup 降级默认开启**：使用 `gpt-5-mini` 作为默认降级模型
- **优化管线重排**：classify → sanitize → merge → warmup，让分类看到原始 `tool_result` 语义
- 修复 `CopilotOptimizerConfig` 默认值不一致（统一到 `gpt-5-mini`）

#### 用量脚本内网支持

- 移除 usage script 的私网 IP / 可疑主机名屏蔽，解锁企业内网、Docker、自建 API 端点
- 内置模板仍强制 HTTPS（localhost 除外）和同源检查；自定义模板仍由用户控制，这类请求 URL 检查跳过

#### Failover 队列备注

- 供应商备注现在在 failover 队列选择器和队列行中显示，方便在多供应商队列里识别 (#2138, 感谢 @Coconut-Fish)

### Bug 修复

#### 工具栏最大化后持续折叠

- 窗口最大化 / 还原后，工具栏不再卡在折叠状态；折叠判定会随尺寸变化重新计算

#### Hermes YAML 污染与 OAuth MCP `auth` 丢失

- 经 CC Switch 往返写入不再丢失 OAuth MCP `auth` 块、也不污染不相关的 YAML 键
- 新增 `tests/hermes_roundtrip.rs` 作为守护测试

#### Hermes 激活供应商展示

- Hermes UI 现在正确展示激活供应商，并连通添加 / 启用 / 移除动作

#### Hermes 供应商持久化

- 供应商持久化到 `custom_providers:` 下，`api_mode` 和 `model` 可跨重启 / 配置重载存活

#### Hermes 健康检查错借 OpenClaw schema

- 以前 Hermes 供应商被路由到 `check_additive_app_stream`（OpenClaw 的调度器），后者读 camelCase 的 `baseUrl` / `apiKey` / `api`，导致即便 Hermes 字段全填还是报 "OpenClaw provider is missing baseUrl"
- 新增 `check_hermes_stream`，用 Hermes 专用提取器把 `api_mode`（`chat_completions` / `anthropic_messages` / `codex_responses`）映射到对应的 `check_claude_stream` `api_format`，`bedrock_converse` 明确标记为不支持
- 先解析 `api_mode` 再抽 URL / API key，让 `bedrock_converse` 用户看到真实原因，而不是误导性的 "missing base_url"

#### Usage 查询模态框支持 Hermes / OpenClaw

- `getProviderCredentials` 新增对 Hermes（snake_case `base_url` / `api_key`）和 OpenClaw（camelCase `baseUrl` / `apiKey`）的扁平 `settingsConfig` 字段读取，让 SiliconFlow 等匹配供应商自动选中 "official balance" 模板
- 重构 BALANCE 和 TOKEN_PLAN 测试路径复用 `providerCredentials`，不再直接读 `env.ANTHROPIC_*`，修正了非 Claude 应用即使配置了 key 也报 "empty key" 的问题

#### Codex `cache_control` 保留

- 在 Codex 格式转换合并 system prompt 时保留 `cache_control` (#1946, 感谢 @yovinchen)

#### Claude prompt cache key 泄漏

- Claude chat 转换时不再发送 prompt cache key (#2003, 感谢 @yovinchen)

#### 代理逐跳响应头剥离

- 按 RFC 7230 剥离代理响应的 hop-by-hop 头（Connection、Keep-Alive、Transfer-Encoding 等） (#2060, 感谢 @yovinchen)

#### 代理 CORS 层移除

- 移除代理中过于宽松的 CORS 层 (#1915, 感谢 @zerone0x)

#### 代理 toast 显示后端错误详情

- 代理相关 toast 现在展示后端错误 payload 的详情，而不是一句笼统的失败

#### Usage 日志去重

- 代理和会话日志的用量记录去重，相同请求不再被重复计数
- 请求日志时间范围与面板的 1d / 7d / 30d 选择器同步

#### Common Config 勾选持久化

- Claude / Codex / Gemini common-config 勾选状态重开后正确保留 (#2191, 感谢 @zxZeng)

#### Claude 插件 `settings.json` 同步

- 编辑当前供应商时，会同步回 Claude 插件路径下的 `settings.json` (#1905, 感谢 @chengww5217)

#### Google Official Gemini env 保留

- 保存 Google Official Gemini 供应商时不再清空 `env` 块

#### OpenCode JSON5 尾逗号解析

- OpenCode 配置读取容忍尾逗号（JSON5） (#2023, 感谢 @wwminger)

#### 预设刷新

- 刷新 DeepSeek 和 Claude 1M 的陈旧 context 窗口
- 刷新陈旧模型 ID，回填 Hermes 模型列表
- 修正 Nous 端点，Hermes 占位图替换为 Nous 品牌图
- 移除未使用的官方 Hermes 预设

#### 搜索命中时折叠消息自动展开

- 搜索匹配落在折叠内容内部时，消息自动展开以定位匹配

#### 未知订阅配额等级隐藏

- 供应商卡片不再渲染未知订阅配额等级

#### weekly_limit 标签统一

- 跨语言把 `weekly_limit` 等级标签对齐到官方的"7 天"命名

#### 根级 Skill 仓库安装

- 修复当仓库根本身就是一个 skill 时的安装失败

#### Session ID 解析 clippy

- 移除 session ID 解析里的冗余闭包（clippy 警告）

#### Stream Check 默认探测模型刷新

- 默认探测模型更新到每家厂商当前主力

#### Skills 导入同步

- 导入的 Skills 即时同步到启用应用目录，不再仅记录在数据库里导致 UI 显示"已安装"但目标目录空缺 (#2101, 感谢 @yaoguohh)

#### Ghostty 会话恢复

- 改为通过 shell 执行 + `--working-directory` 启动 Ghostty 会话恢复 (#1976, 感谢 @Suda202)
- 避免路径含空格 / 特殊字符时 `cwd` 转义问题

### 文档

#### README 赞助商更新

- SiliconFlow 注册赠送更新为 ¥16
- 精简 SSSAiCode 赞助文案
- 更新合作伙伴 logo
- 新增 LemonData 赞助商

#### 全局代理提示澄清

- 三语澄清全局代理与 Local Routing 的关系

#### Takeover → Routing 文档重命名

- 接管相关文档在三语下重命名为 routing，同步更新锚点

#### PIPELLM 网站 URL

- PIPELLM 赞助商网站 URL 更新为 `code.pipellm.ai`

### ⚠️ 重要变更（Breaking）

#### Hermes 必须显式 `api_mode`

- `Auto` 模式移除；导入或 deeplink 得到的供应商默认落到 `chat_completions`
- 既有 `Auto` 配置的用户会被提示选择协议

#### Claude Quick-Set 移除 `ANTHROPIC_REASONING_MODEL`

- 该遗留字段不再暴露；既有设置自动清理

#### 按供应商代理配置移除

- 迁移到全局 Local Routing 设置
- 既有按供应商代理值被忽略

#### 数据库 schema v9 → v10

- 为 `mcp_servers` 和 `skills` 表新增 `enabled_hermes` 列
- 自动迁移，`DEFAULT 0`，无数据丢失

#### Pricing 表 v8 → v9 重置

- 首次启动时 `model_pricing` 表被清空并重新种入，以应用新模型和修正后的价格

#### XCodeAPI 预设移除

- 使用 XCodeAPI 预设的用户请迁移到其它供应商

### ⚠️ 风险提示

本版本在涉及反向代理类功能上沿用 v3.12.3 / v3.13.0 提出的风险提示。

**GitHub Copilot 反向代理**：使用 Copilot 的反代路径可能违反 GitHub / Microsoft 服务条款。详情见 [v3.12.3 release notes](v3.12.3-zh.md#️-风险提示)。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

用户启用上述功能即表示**自行承担所有风险**。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64                                 |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.14.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.14.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.14.0-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.14.0-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.14.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

> macOS 版本已通过 Apple 代码签名和公证，可直接安装使用。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.13.0] - 2026-04-10

> 轻量模式、配额与余额展示、供应商模型自动获取、Codex OAuth 反向代理、托盘按应用分级菜单

### 概览

CC Switch v3.13.0 是一次重要的功能版本，聚焦于可观测性、供应商工作流与代理兼容性。本版本在各主要供应商卡片上新增了**配额与余额展示**，覆盖 Claude / Codex / Gemini 官方订阅、Token Plan（Kimi / Zhipu GLM / MiniMax）、Copilot premium interactions 以及 DeepSeek / StepFun / SiliconFlow / OpenRouter / Novita AI 等第三方余额查询；引入了**轻量模式**，让 CC Switch 可以仅驻留在系统托盘中运行；通过 OpenAI 兼容的 `/v1/models` 端点在 Claude / Codex / Gemini / OpenCode / OpenClaw 五个应用的供应商表单中实现了**模型自动发现**；为 ChatGPT 订阅者提供了 **Codex OAuth 反向代理**；将托盘菜单重构为**按应用分级的子菜单**；将代理转发层重建在 **Hyper 客户端**之上；并完成了 **Skills 工作流**的发现、批量更新和存储位置切换改造，内置了 skills.sh 搜索安装。其他改进还包括完整 URL 端点模式、更完善的 token 用量追踪、Copilot 调用优化器、多字节 UTF-8 流式分片边界修复以及 Linux 启动时 UI 无响应修复，以及更友善的新用户引导等。

### 重点内容

- **轻量模式**：新增仅托盘运行模式，退出到托盘时销毁主窗口、按需重建，空闲时资源占用接近零
- **配额与余额展示**：供应商卡片上直接展示配额或余额 —— 覆盖 Claude / Codex / Gemini 官方订阅、GitHub Copilot premium interactions、Codex OAuth、Token Plan（Kimi / Zhipu GLM / MiniMax），以及 DeepSeek / StepFun / SiliconFlow / OpenRouter / Novita AI 的官方余额查询
- **供应商模型自动获取**：为 Claude / Codex / Gemini / OpenCode / OpenClaw 的供应商表单新增 OpenAI 兼容的 `/v1/models` 发现能力，按分组下拉展示并提供针对性错误提示
- **Codex OAuth 反向代理**：新增 ChatGPT 的 Codex 反向代理，作为新的 Claude 供应商卡片类型，让用户在可以在 Claude Code 里面使用 ChatGPT 订阅。包含受管 OAuth 登录流程和订阅配额展示（[⚠️ 风险提示](#️-风险提示)）
- **托盘按应用分级菜单**：将托盘菜单重构为按应用分组的子菜单，防止供应商多时菜单溢出，让后台切换供应商在大量供应商场景下仍可用
- **Skills 发现与批量更新**：基于 SHA-256 内容哈希的更新检测、单项和"全部更新"批量操作、`skills.sh` 表搜索集成，以及 CC Switch 与 `~/.agents/skills` 的存储位置切换
- **会话工作流升级**：会话管理器批量删除、Claude 终端恢复前的目录选择器、无需代理拦截即可导入 Claude / Codex / Gemini 会话日志用量、精确的 Codex JSONL 解析、按应用筛选用量面板
- **OpenCode / OpenClaw 流式检测覆盖**：新增 OpenCode 的 npm 包映射检测、OpenClaw `openai-completions` 支持，以及其余所有 OpenClaw 协议变体
- **完整 URL 端点模式**：新增将 `base_url` 视作完整上游端点的供应商选项，支持非标准 URL 布局的厂商
- **Hyper 代理转发栈**：将代理转发层重构到 Hyper 客户端之上，实现透明头部转发、改进的端点重写以及对动态上游端点的更好支持
- **Copilot 调用优化器**：新增请求分类和路由逻辑，降低 GitHub Copilot premium interaction 的不必要消耗
- **UTF-8 流式分片边界修复**：所有 4 条 SSE 流式路径改为跨分片保留残留多字节序列，消除 Copilot 反代下中文/emoji 乱码
- **Linux 启动 UI 修复**：修复长期存在的 Linux 窗口初次无法响应点击、需用户手动最大化再还原才能操作的问题
- **首次运行引导**：新安装时弹出一次性欢迎对话框、自动种入 Claude / OpenAI / Google 官方预设、启动时自动导入 OpenCode / OpenClaw 的 live 配置
- **Claude 会话标题与搜索高亮**：从 Claude 会话中提取有意义的标题（自定义标题 → 首条用户消息 → 目录名），在会话管理器搜索时高亮匹配关键词
- **URL 图标支持**：图标系统新增双渲染模式，大 SVG 和光栅图片（PNG / JPG / WebP）通过 Vite URL import 加载，小 SVG 保持内联
- **新供应商预设**：新增 TheRouter、DDSHub、LionCCAPI、胜算云、PIPELLM、E-FlowCode 预设

### 新功能

#### 轻量模式

新增仅托盘运行模式，显著降低 CC Switch 空闲时的桌面占用。

- 退出到托盘时销毁主窗口而非隐藏，释放 UI 资源和内存
- 用户从托盘、深链接或单例激活时按需重建窗口
- 覆盖所有窗口重新显示路径：正常启动、深链接、单例、托盘 `show_main` 以及轻量模式退出返程

#### 配额与余额展示

在供应商卡片上新增配额和余额读数，用户无需离开卡片即可查看剩余容量。

- **官方订阅**：Claude / Codex / Gemini 官方供应商的订阅配额展示
- **GitHub Copilot**：在 Copilot 供应商卡片上显示 premium interactions 剩余量
- **Codex OAuth**：在 Codex OAuth 卡片上内联展示 ChatGPT 订阅配额
- **Token Plan 供应商**：Kimi、Zhipu GLM、MiniMax 用量进度显示（为避免混淆，需要手动开启）
- **第三方余额**：为 DeepSeek、StepFun、SiliconFlow、OpenRouter、Novita AI 提供官方余额查询（为避免混淆，需要手动开启）
- 官方供应商的健康检查和用量配置按钮自动隐藏，保持卡片简洁

#### 供应商模型自动获取

为所有供应商表单新增 OpenAI 兼容的模型发现能力，消除手动复制粘贴模型 ID 的繁琐流程。

- 使用配置的 API key 向供应商的 `/v1/models` 端点发起请求
- 在下拉菜单中按类别分组展示模型
- 对网络 / 认证 / 端点不存在 / 解析失败等场景提供具体错误消息
- 支持全部五个应用（Claude / Codex / Gemini / OpenCode / OpenClaw）

#### Codex OAuth 反向代理

新增 ChatGPT 订阅者的 Codex OAuth 反向代理路径，让 ChatGPT 订阅者可以在 Claude Code 中使用自己的订阅。

- 受管 OAuth 登录流程，通过 ChatGPT 认证
- 作为新的 Claude 供应商卡片类型出现在列表中，与 API-key 型供应商并列
- 订阅配额内联展示
- 与 Auth Center UI 紧密集成，统一管理 Token
- 启用前请参见下文的 [⚠️ 风险提示](#️-风险提示)

#### 托盘按应用分级菜单

将托盘菜单重构为按应用分组的子菜单，取代原来的扁平列表。

- 为 Claude / Codex / Gemini / OpenCode / OpenClaw 分别建立独立的子菜单
- 防止用户有大量供应商时托盘菜单溢出屏幕
- 后台切换供应商的可扩展性更好

#### Skills 发现与批量更新

将 Skills 管理面板升级为完整的发现 + 维护工作流。

- **SHA-256 更新检测**：通过内容哈希判断哪些 skill 在远端有更新
- **单项与批量更新**：单项"更新"按钮 + 带滑入动画的"全部更新"批量操作
- **存储位置切换**：在 CC Switch 存储和 `~/.agents/skills` 之间切换而不丢失 skill 状态
- **公共注册表搜索**：将 `skills.sh` 搜索直接集成到对话框中，方便发现社区 skill

#### 会话工作流升级

多项会话管理改进，降低使用 Claude / Codex / Gemini 会话时的摩擦。

- **批量删除会话**：在会话管理器中选择并一次删除多个会话 (#1693, 感谢 @Alexlangl)
- **恢复前目录选择器**：Claude 终端恢复前先选择工作目录 (#1752, 感谢 @yovinchen)
- **无需代理的会话日志用量**：直接从 Claude / Codex / Gemini 会话日志导入用量数据，无需代理拦截
- **精确的 Codex JSONL 解析**：替换 Codex 的估算用量为基于 JSONL 会话日志的精确解析，同时对模型名称做归一化以保证定价查询一致性
- **Gemini CLI 会话日志集成**：Gemini 用量现在从 Gemini CLI 会话日志精确同步
- **按应用筛选用量**：用量面板可按 Claude / Codex / Gemini 独立筛选

#### OpenCode / OpenClaw 流式检测覆盖

将 Stream Check 面板的覆盖范围扩展到 OpenCode 和所有 OpenClaw 协议变体。

- 通过 npm 包映射检测 OpenCode 供应商
- 支持 OpenClaw `openai-completions` 协议
- 支持剩余的三个 OpenClaw 协议变体
- 针对自定义头透传、OpenClaw 自定义 auth-header 检测、Bedrock 错误消息、OpenCode 默认 `baseURL` 回退等边界情况进行了处理

#### 完整 URL 端点模式

新增将 `base_url` 视作完整上游端点的供应商选项，取代原有的 base-URL 加路径拼接模式 (#1561, 感谢 @yovinchen)。

- 代理转发和 Stream Check 都会遵循完整 URL 模式
- 解锁需要非标准 URL 布局的厂商
- 可在供应商表单中按供应商配置

#### OpenCode StepFun Step Plan 预设

- 为 OpenCode 新增 StepFun Step Plan 供应商预设及合理默认值 (#1668, 感谢 @sky-wang-salvation)

#### Copilot 调用优化器

新增请求分类和路由逻辑，降低 GitHub Copilot premium interaction 的不必要消耗。

- 根据请求意图和权重进行分类
- 将低价值请求路由到非 premium 通道
- 旨在延长 Copilot 订阅的可用时长
- 注意，即使优化过消耗以后，在 Copilot 外使用 Copilot 的 API 消耗仍然会高于在 Copilot 内使用。

#### 首次运行欢迎对话框

新安装用户首次打开时显示一次性欢迎对话框，引导了解 CC Switch 工作流程。

- 说明已有 live 配置如何被保留为默认供应商
- 介绍内置官方预设如何实现一键回滚到官方端点
- 升级用户通过空供应商检查自动跳过

#### 官方供应商自动种入

- 启动时自动种入 Claude Official / OpenAI Official / Google Official 供应商条目，为每位用户提供一键回滚到官方端点的路径

#### OpenCode / OpenClaw 自动导入

- 启动时自动导入 OpenCode 和 OpenClaw 的 live 供应商配置，与 Claude / Codex / Gemini 已有的自动导入行为对齐

#### Common Config 编辑器引导

- 在 Claude / Codex / Gemini 的 Common Config 代码片段编辑器弹窗中添加引导信息和空状态提示
- 用户首次打开供应商添加/编辑表单时弹出一次性对话框说明 Common Config Snippets

#### Claude 会话标题与搜索高亮

- 为 Claude 会话新增有意义的标题提取，优先链：自定义标题元数据 → 首条真实用户消息 → 目录名回退
- 在会话管理器搜索时高亮匹配关键词

#### URL 图标支持

- 图标系统新增双渲染模式：小 SVG 以 React 组件内联，大 SVG 和光栅图片（PNG / JPG / WebP）通过 Vite URL import 以 `<img>` 标签加载

#### Kaku 终端支持

- macOS 上新增 Kaku 作为可选终端用于启动会话，复用 WezTerm 兼容的启动路径 (#1983, 感谢 @yovinchen)

#### OMO Slim Council 支持

- 恢复 council 作为内置 oh-my-opencode-slim agent 的一等支持，更新元数据和 UI 文案 (#1982, 感谢 @yovinchen)

#### 新供应商预设

- **TheRouter**：覆盖 Claude / Codex / Gemini / OpenCode / OpenClaw 五个应用 (#1891, #1892, 感谢 @cmzz)
- **DDSHub**：作为 Claude 的第三方合作伙伴供应商，含图标和推广文案
- **LionCCAPI**：覆盖全部五个应用，OpenCode / OpenClaw 使用 anthropic-messages 协议
- **胜算云 (Shengsuanyun)**：作为聚合类合作伙伴供应商覆盖全部五个应用，支持 URL 图标和本地化名称
- **PIPELLM**：覆盖 Claude / Codex / OpenCode / OpenClaw，含完整模型定义和图标
- **E-FlowCode**：覆盖全部五个应用，按应用配置不同协议

### 变更

#### 托盘菜单组织

- 将托盘菜单重构为按应用分级的子菜单（Claude / Codex / Gemini / OpenCode / OpenClaw）
- 防止菜单溢出，支持大量供应商的场景

#### 代理转发栈

将代理转发层重建在 Hyper HTTP 客户端之上 (#1714, 感谢 @yovinchen)。

- 透明头部转发：头部透传，不做激进过滤
- 改进的端点重写逻辑
- 更好地支持动态上游端点
- 与新的"完整 URL 端点模式"配合，解锁非标准 URL 布局的厂商

#### OAuth Auth Center UI 精修

- 精修 Auth Center 的文案、布局和图标呈现，让 Codex OAuth 登录流程更清爽

#### 供应商键生命周期与 Live 同步

重做了新增模式供应商的创建/重命名/复制流程，让 Live 配置写入、清理和回滚在 OpenCode / OpenClaw 与接管场景下保持一致 (#1724, 感谢 @yovinchen)。

- 新增模式高亮行为在刷新后依旧保持 (#1747, 感谢 @yovinchen)
- OpenCode / OpenClaw 的 Live 配置写入保持一致
- 失败时正确回滚，避免半提交状态

#### Codex OAuth 默认值

- Codex OAuth 预设升级到 GPT-5.4 系列

### Bug 修复

#### Copilot 认证与代理兼容性

- 修复 GitHub Copilot 认证回归问题 (#1854, 感谢 @Mason-mengze)
- 修正企业版和动态端点处理
- 修复 macOS 和 Linux 上的剪贴板验证码复制问题
- 修复 Copilot 作为 Claude 供应商时 OpenAI 模型的 Responses 分流 (#1735, 感谢 @Mason-mengze)

#### UTF-8 流式分片边界

修复 Claude Code 在 Copilot 反代下，当中文字符或 emoji 等多字节 UTF-8 序列跨 TCP 分片传输时出现的间歇性乱码（U+FFFD 替换字符）问题 (#1923, 感谢 @Cod1ng)。

- 将所有 4 条 SSE 流式路径中的 `String::from_utf8_lossy` 替换为新的 `append_utf8_safe` 辅助函数
- 通过残留缓冲区保留不完整的尾部字节，并在下一个分片合并后再解码
- 直连 Copilot 的场景不可复现，因为直连模式透传原始字节而不做格式转换

#### 碎片 System Prompt 规范化

修复严格的 OpenAI 兼容 chat 后端（Nvidia、Qwen 风格）在转换后 Claude 负载包含多条 system 消息时拒绝请求的问题 (#1942, 感谢 @yovinchen)。

- 在 Anthropic → OpenAI chat 转换时将 system 内容合并为单条前置 system 消息
- 其余消息流保持不变

#### 流式解析兼容性

- 修复 SSE 解析以接受包含可选空格的字段，提升对非严格流式实现的兼容性 (#1664, 感谢 @Alexlangl)

#### 供应商切换状态损坏

- 将按应用的供应商切换串行化，防止并发故障转移或热切换操作导致 `is_current`、设置状态和 Live 备份状态不一致

#### Claude 接管 Live 配置漂移

- 修复 Claude 接管启用时供应商编辑导致 Live 设置与供应商状态失步，同时保持接管恢复行为不被破坏 (#1828, 感谢 @geekdada)

#### WebDAV 密码保留与校验

- 修复 WebDAV 密码字段在刷新后不可见的问题
- 连接校验时正确处理 `MKCOL 405` 响应 (#1685, 感谢 @Alexlangl)

#### 供应商卡片动作状态

- 修复新增模式高亮行为 (#1747, 感谢 @yovinchen)
- 始终渲染动作按钮，对齐各卡片的用量显示布局
- 用警告路径替换硬阻塞的代理切换
- 禁用 Copilot 和 Codex OAuth 卡片上不受支持的测试/用量动作
- 隐藏官方供应商的用量配置和健康检查按钮
- 移除供应商卡片上的 hover 推送动画

#### 用量精确性与定价

- 修复 MiniMax 配额数学和 0% → 100% 进度
- 修正 CNY → USD 定价并补齐缺失模型
- 改进 Gemini 会话日志同步的精度
- 修复基于会话的用量条目显示为"未知供应商"的问题

#### 用量编辑器与 Skills UI 回归

- 修复编辑提取器代码时用量查询字段被重置的问题 (#1771, 感谢 @if-nil)
- 修正 `skills.sh` 链接失效和空描述问题
- 修复用量配置中的 auto-query 默认间隔（5 分钟）和 number-input 清空问题

#### 中文 Skills 术语

- 统一 zh locale 下设置面板中的 Skills 相关标签，保持存储与同步选项用词一致

#### 环境与预设兼容性

- 在 CLI 扫描中新增 Bun 全局 bin 检测 (#1742, 感谢 @makoMakoGo)
- 适配 oh-my-openagent 重命名并保持向后兼容 (#1746, 感谢 @yovinchen)
- 修正 OpenCode `kimi-for-coding` 预设 (#1738, 感谢 @makoMakoGo)
- 将 Gemini keychain 解析限制为仅 macOS
- 修复空集合时 OpenClaw 序列化器 panic (#1724, 感谢 @yovinchen)

#### Linux 启动时 UI 无响应

修复长期存在的 Linux 专属 bug：窗口 UI（包括原生标题栏按钮）在用户手动最大化再还原之前无法接收点击。

- **根因 1**：Tauri webview 在 Linux 上 `show()` 之后未获得键盘焦点，首次点击被 X11 / Wayland 的 click-to-activate 消费掉（Tauri #10746、wry #637）
- **根因 2**：在某些 WebKitGTK / 合成器组合下，GTK surface 的输入区域在 `visible:false → show()` 路径上未能重协商，导致整个窗口无响应
- **缓解措施**：启动时设置 `WEBKIT_DISABLE_COMPOSITING_MODE=1`，并新增 `linux_fix::nudge_main_window` 辅助函数，在 show 之后 ~200ms 执行 `set_focus` + ±1px 无操作尺寸调整，等效于一次视觉上不可见的"最大化再还原"
- **覆盖范围**：接入所有窗口重新显示路径 —— 正常启动、深链接、单例、托盘 `show_main` 以及轻量模式退出返程

#### Linux 标题栏拖动区域

- 在 Linux 上从顶部标题栏移除 `data-tauri-drag-region`，避免触发 Wayland 下受 Tauri #13440 影响的 `gtk_window_begin_move_drag` 路径
- macOS 拖动行为保持不变

#### OpenCode / OpenClaw 流式检测边界情况

- 修复自定义头透传
- 修复 OpenClaw 自定义 auth-header 检测
- 修复 Bedrock 错误消息
- 修复 OpenCode 默认 `baseURL` 回退处理

#### 供应商切换时重复 Toast

- 修复代理未运行时切换到 Copilot / ChatGPT / OpenAI 格式供应商时出现双重 toast 通知（代理必需警告 + 切换成功）

#### 会话搜索精度与中文支持

- 修复会话搜索结果在跨供应商时被截断的问题
- 将 FlexSearch 分词器切换为 full 模式以支持中文子串匹配

#### 自适应思维推理力度

- 修复 `resolve_reasoning_effort()` 将自适应思维错误映射为 `high`，应为 `xhigh`（OpenAI 格式转换场景）

#### Thinking 模型回退显示

- 修复 Claude 供应商表单仅填写主模型后 Thinking 模型字段显示为空，改为只读回退到 ANTHROPIC_MODEL (#1984, 感谢 @yovinchen)

#### Auth Tab 本地化

- 修复设置面板 auth tab 标签在所有语言包中缺失 i18n 翻译 key (#1985, 感谢 @yovinchen)

#### 数据库迁移守卫

- 修复 skills 或 model_pricing 表不存在时数据库迁移失败，在 ALTER 和 UPDATE 操作前添加表存在性检查

### 文档

#### 用户手册刷新

- 在 EN / ZH / JA 用户手册中覆盖托盘子菜单、轻量模式、供应商模型获取、会话管理、工作区文件、WebDAV v2 行为、OpenCode / OpenClaw 启用等供应商工作流改进

#### 社区与贡献文档

- 新增 `CONTRIBUTING.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md`
- 新增双语 GitHub issue 和 PR 模板
- 新增 Dependabot 配置 (#1829, 感谢 @bengbengbalabalabeng) 和 stale-bot 工作流以自动关闭不活跃的 issue
- 新增 PR / push 质量检查 CI 工作流

#### Release Notes 风险提示回填

- 在三语 v3.12.3 release notes 中新增 Copilot 反代风险提示，并为重点内容添加锚点链接

#### 赞助商合作伙伴

- 在三语 README 中新增胜算云、LionCC、DDS 作为赞助商合作伙伴

### ⚠️ 风险提示

**Codex OAuth 反向代理免责声明**

本版本新增的 Codex OAuth 反向代理功能通过逆向工程的 OAuth 流程访问 ChatGPT 的 Codex 服务。启用此功能前，请注意以下风险：

1. **违反服务条款**：使用逆向 OAuth 流程访问 OpenAI 服务可能违反 OpenAI 的服务条款，其中禁止未经授权的自动化访问、服务复制以及绕过既定的访问路径。
2. **账号风险**：OpenAI 可能将异常使用模式标记为可疑的自动化行为，从而对 ChatGPT 访问施加临时或永久限制。
3. **无法保证长期可用**：OpenAI 可能随时更新其认证和检测机制，当前可用的使用方式未来可能被标记。

v3.12.3 引入的 **GitHub Copilot 反向代理**同样适用原有风险提示 —— 详见 [v3.12.3 release notes](v3.12.3-zh.md#️-风险提示)。

用户启用上述功能即表示**自行承担所有风险**。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64                                 |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.13.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.13.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.13.0-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.13.0-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.13.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

> macOS 版本已通过 Apple 代码签名和公证，可直接安装使用。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.3] - 2026-03-24

> GitHub Copilot 反向代理、macOS 代码签名与公证、Reasoning Effort 映射、Tool Search 环境变量开关、Skill 备份/恢复生命周期

### 概览

CC Switch v3.12.3 新增了 **GitHub Copilot 反向代理** 支持和 **Copilot Auth Center** 认证管理，引入了 **Reasoning Effort 映射** 实现跨供应商推理强度控制，通过 Claude 2.1.76+ 原生 `ENABLE_TOOL_SEARCH` 环境变量实现了 **Tool Search 开关**，新增了 **OpenCode SQLite 后端** 支持，并完成了 **macOS 代码签名与 Apple 公证**。同时引入了完整的 Skill 备份/恢复生命周期，改进了代理对 OpenAI o 系列模型的兼容性和 gzip 压缩支持，优化了 Skills 缓存策略，更新了 Claude 4.6 上下文窗口、MiniMax M2.7 和小米 MiMo 模型预设，并修复了 WebDAV 密码、工具消息解析、暗色模式和 Copilot 请求指纹等方面的问题。

### 重点内容

- **GitHub Copilot 反向代理**：新增 Copilot 反向代理支持，通过 Copilot Auth Center 管理 GitHub Token 认证，实现 Copilot 模型在 Claude Code 中的无缝使用（[⚠️ 风险提示](#️-风险提示)）
- **macOS 代码签名与公证**：macOS 版本已通过 Apple 代码签名和公证，新增 DMG 安装格式，无需再手动绕过"未知开发者"警告
- **Reasoning Effort 映射**：代理层自动映射 — 显式 `output_config.effort` 优先，回退到 `budget_tokens` 阈值（<4000→low, 4000–16000→medium, ≥16000→high），支持 o 系列和 GPT-5+ 模型
- **Tool Search 环境变量开关**：利用 Claude 2.1.76+ 原生 `ENABLE_TOOL_SEARCH` 环境变量，在通用配置编辑器中一键启用 Tool Search
- **Skill 备份/恢复生命周期**：卸载前自动备份 Skill 文件；新增备份列表、恢复和删除管理
- **OpenCode SQLite 后端**：为 OpenCode 新增 SQLite 会话存储（与现有 JSON 后端并存），ID 冲突时 SQLite 优先的双后端扫描
- **Codex 1M 上下文窗口开关**：配置编辑器中一键设置 `model_context_window = 1000000`，自动填充 `model_auto_compact_token_limit`
- **禁用自动升级开关**：通用配置编辑器中新增 `DISABLE_AUTOUPDATER` 环境变量复选框，防止 Claude Code 自动升级
- **代理 Gzip 压缩**：非流式代理请求自动协商 gzip 压缩，减少带宽消耗
- **o 系列模型兼容性**：Chat Completions 代理正确使用 `max_completion_tokens` 处理 o1/o3/o4-mini 模型
- **Skills 导入重构**：将基于文件系统的隐式应用推断替换为显式的 `ImportSkillSelection`，防止多应用错误激活

### 新功能

#### GitHub Copilot 反向代理

新增完整的 GitHub Copilot 集成，作为 Claude Code 供应商使用。

- 通过 OAuth Device Code 流程进行 GitHub 认证
- 支持多账号管理和自动 Token 刷新
- Anthropic ↔ OpenAI 格式自动转换
- 实时获取可用模型列表和用量统计 (#930，感谢 @Mason-mengze)

#### Copilot Auth Center

在设置中新增认证中心面板，全局管理 GitHub 账号。

- 支持按供应商绑定账号（通过 `meta.authBinding`）
- 统一的 Token 管理和刷新机制

#### Tool Search 开关

利用 Claude 2.1.76+ 原生 `ENABLE_TOOL_SEARCH` 环境变量控制 Tool Search 功能。

- 在供应商通用配置编辑器中以复选框形式暴露
- 替代了之前的二进制补丁方案，更简洁可靠 (#930，感谢 @Mason-mengze)

#### Reasoning Effort 映射

新增代理层自动推理强度映射，支持 OpenAI o 系列和 GPT-5+ 模型。

- 两级解析：显式 `output_config.effort` 优先，回退到 `budget_tokens` 阈值（<4000→low, 4000–16000→medium, ≥16000→high）
- 覆盖 Chat Completions 和 Responses API 两条路径，含 17 个单元测试

#### OpenCode SQLite 后端

为 OpenCode 新增 SQLite 会话存储支持（与现有 JSON 后端并存）。

- 双后端扫描，ID 冲突时 SQLite 优先
- 原子会话删除和路径校验
- JSON 后端保持向后兼容

#### Codex 1M 上下文窗口开关

在配置编辑器中新增 Codex 1M 上下文窗口一键开关。

- 复选框设置 `config.toml` 中的 `model_context_window = 1000000`
- 启用时自动填充 `model_auto_compact_token_limit = 900000`
- 关闭时干净移除两个字段

#### 禁用自动升级开关

在 Claude 通用配置编辑器中新增禁用自动升级的复选框。

- 勾选后设置 `DISABLE_AUTOUPDATER=1` 环境变量，阻止 Claude Code 自动升级
- 与 Teammates 模式、Tool Search、高强度思考等开关同一排显示

#### Skill 卸载自动备份

卸载 Skill 前自动备份文件，防止数据意外丢失。

- 备份存储在 `~/.cc-switch/skill-backups/`，包含所有 skill 文件和记录原始元数据的 `meta.json`
- 旧备份自动清理，最多保留 20 个
- 备份路径返回前端并在成功提示中显示

#### Skill 备份恢复与删除

新增卸载时创建的 Skill 备份的管理功能。

- 列出所有可用的 skill 备份及元数据
- 恢复操作将文件拷回 SSOT，保存数据库记录，并同步到当前应用，失败时自动回滚
- 删除操作在确认对话框后移除备份目录

#### macOS 代码签名与 Apple 公证

CI 流程新增完整的 macOS 代码签名和 Apple 公证支持。

- 导入 Apple Developer ID 证书，签名 Universal Binary
- 提交 Apple 公证并将票据装订到 `.app` 和 `.dmg`
- 硬性验证步骤（`codesign --verify` + `spctl -a` + `stapler validate`）把关发布

### 变更

#### Skills 缓存策略优化

- 将 `invalidateQueries` 替换为直接 `setQueryData` 更新，用于 skill 安装/卸载/导入操作
- 新增 `staleTime: Infinity` 和 `keepPreviousData`，消除加载闪烁 (#1573，感谢 @TangZhiZzz)

#### 代理 Gzip 压缩

- 非流式请求允许 reqwest 自动协商 gzip 并透明解压响应
- 流式请求保守地保持 `Accept-Encoding: identity`，避免中断的 SSE 流解压出错

#### o1/o3 模型兼容性

- Chat Completions 路径对 o1/o3/o4-mini 模型使用 `max_completion_tokens` 替代 `max_tokens` (#1451，感谢 @Hemilt0n)
- Responses API 路径保持使用正确的 `max_output_tokens` 字段

#### OpenCode 模型变体

- 将 OpenCode 的模型变体放在预设顶层而非嵌套在 options 内部，提升可发现性 (#1317)

#### Skills 导入流程

- 将基于文件系统的隐式应用推断替换为显式的 `ImportSkillSelection`，防止同一 skill 目录存在于多个应用路径下时错误激活多个应用
- 为 `sync_to_app` 增加协调逻辑，移除已禁用/孤立的符号链接
- MCP `sync_all_enabled` 现在会从 live 配置中移除已禁用的服务器

#### Claude 4.6 上下文窗口

- Claude Opus 4.6 和 Sonnet 4.6 上下文窗口从 200K 更新至 1M（GA 发布）

#### MiniMax 模型升级

- MiniMax 预设从 M2.5 升级至 M2.7，更新三语合作伙伴描述

#### 小米 MiMo 模型升级

- MiMo 预设从 mimo-v2-flash 升级至 mimo-v2-pro

#### 添加供应商对话框简化

- 移除冗余的 OAuth 标签页，对话框从 3 个标签页减少到 2 个（应用专属 + 通用）

#### 供应商表单高级选项折叠

- Claude 供应商表单中的模型映射、API 格式等高级字段在未填写时默认折叠
- 预设填充值后自动展开，手动清空不会自动折叠

### Bug 修复

#### WebDAV 密码被静默清除

- 修复 ProviderList 或 UsageScriptModal 保存设置时 WebDAV 密码被静默清除的问题
- 前端 payload 中剥离 `webdavSync`，后端 `merge_settings_for_save()` 增加回填逻辑保护现有密码

#### 工具消息解析

- 修复 Claude（tool_result content blocks）、Codex（function_call/function_call_output payloads）和 Gemini（array content + toolCalls extraction）的 tool_use/tool_result 消息分类 (#1401，感谢 @BlueOcean223)

#### 暗色模式选择器

- 将 Tailwind `darkMode` 从 `["selector", "class"]` 改为 `["selector", ".dark"]`，确保暗色模式正确激活 (#1596，感谢 @qinxiandiqi)

#### Copilot 请求指纹

- 统一所有 Copilot API 调用点的请求指纹头，防止 User-Agent 泄漏和 Stream Check 不匹配

#### 供应商表单防重复提交

- 修复快速连续点击按钮时供应商添加/编辑表单重复提交的问题 (#1352，感谢 @Hexi1997)

#### Ghostty 终端会话恢复

- 修复在 Ghostty 终端中恢复 Claude 会话失败的问题 (#1506，感谢 @canyonsehun)

#### Skill ZIP 导入扩展名

- ZIP 导入对话框现在支持 `.skill` 文件扩展名 (#1240, #1455，感谢 @yovinchen)

#### Skill ZIP 安装目标应用

- ZIP 方式安装的 skill 现在使用当前活跃应用，而非始终默认为 Claude

#### OpenClaw 活跃供应商高亮

- 修复 OpenClaw 当前激活的供应商卡片未高亮显示的问题 (#1419，感谢 @funnytime75)

#### 响应式布局与 TOC

- 改善存在 TOC 标题时的响应式布局 (#1491，感谢 @West-Pavilion)

#### Skills 导入对话框白屏

- 在 ImportSkillsDialog 中补充缺失的 TooltipProvider，修复打开对话框时的运行时崩溃

#### 面板底部空白区域

- 将所有内容面板的硬编码 `h-[calc(100vh-8rem)]` 替换为 `flex-1 min-h-0`，消除因不同平台偏移量不匹配导致的底部空白

### 文档

#### 定价模型 ID 归一化

- 在中英日三语用户手册中新增模型 ID 归一化规则说明（前缀剥离、后缀修剪、`@`→`-` 替换）(#1591，感谢 @makoMakoGo)

#### macOS 签名与公证说明

- 移除 README、安装指南和 FAQ 中所有 `xattr` 变通方案和"未知开发者"警告
- 替换为"已通过 Apple 代码签名和公证"的说明

### ⚠️ 风险提示

**GitHub Copilot 反向代理免责声明**

本版本新增的 Copilot 反向代理功能通过逆向工程的非官方 API 访问 GitHub Copilot 服务。启用此功能前，请注意以下风险：

1. **违反服务条款**：此功能可能违反 [GitHub 可接受使用政策](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies)和[附加产品条款](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)，其中禁止过度自动化批量活动、未经授权的服务复制以及通过自动化手段对服务器施加不当负担。
2. **账号风险**：已有类似工具的用户收到 GitHub 官方警告邮件，指出其存在"脚本化交互或其他刻意的异常或高强度使用"行为。收到警告后继续使用可能导致 Copilot 访问权限被暂停甚至永久封禁。
3. **无法保证长期可用**：GitHub 可能随时更新其检测机制，当前可用的使用方式未来可能被标记。

用户启用此功能即表示**自行承担所有风险**。CC Switch 不对因使用此功能而导致的任何账号限制、警告或服务暂停承担责任。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 12 (Monterey) 及以上    | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                       | 说明                                |
| ------------------------------------------ | ----------------------------------- |
| `CC-Switch-v3.12.3-Windows.msi`            | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.12.3-Windows-Portable.zip`   | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                               | 说明                                                      |
| ---------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.12.3-macOS.dmg`     | **推荐** - DMG 安装包，拖入 Applications 即可             |
| `CC-Switch-v3.12.3-macOS.zip`     | 解压后拖入 Applications，Universal Binary                 |
| `CC-Switch-v3.12.3-macOS.tar.gz`  | 用于 Homebrew 安装和自动更新                              |

> macOS 版本已通过 Apple 代码签名和公证，可直接安装使用。

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.2] - 2026-03-12

> 代理接管期间通用配置保护、Snippet 生命周期稳定性、Codex TOML Section 感知编辑

### 概览

CC Switch v3.12.2 是一个以可靠性为核心的补丁版本，重点解决代理（Proxy）接管模式下通用配置（Common Config）丢失的问题，并改进了 Codex TOML 配置的编辑准确性。代理接管的热切换和供应商同步现在会更新恢复备份而非直接覆盖 live 文件；启动流程重新排序，确保先从干净的 live 文件提取 Snippet 再恢复接管状态；Codex 的 `base_url` 编辑重构为 Section 感知模式，不再错误追加到文件末尾。

### 重点内容

- **首次使用引导优化**：供应商列表空状态显示详细的导入说明，Claude/Codex/Gemini 还会提示通用配置 Snippet 功能

- **代理接管恢复流程重构**：热切换和供应商同步现在刷新恢复备份，而非覆盖 live 配置文件，回滚时保留完整的用户配置
- **Snippet 生命周期稳定**：引入 `cleared` 标志防止已清除的 Snippet 被自动重新提取，启动顺序调整确保从干净状态提取
- **Codex TOML Section 感知编辑**：`base_url` 和 `model` 字段的读写现在定位到正确的 `[model_providers.<name>]` Section
- **Codex MCP 配置保护**：热切换供应商时保留恢复快照中已有的 `mcp_servers` 配置块，按 server id 合并而非整表替换，供应商/通用配置的 MCP 定义优先

### 新功能

#### 空状态引导优化

改善首次使用体验，当供应商列表为空时显示详细的导入说明。

- 空状态页面展示导入供应商的操作指引
- 对 Claude/Codex/Gemini 应用有条件地显示通用配置 Snippet 提示（OpenCode/OpenClaw 不显示）

### 变更

#### 代理接管恢复流程

代理接管的热切换和供应商同步逻辑经过重构，确保通用配置在整个接管生命周期中得到保护。

- 接管活跃时，供应商同步更新恢复备份而非直接写入 live 配置文件
- 保存恢复快照前先应用通用配置，使回滚能还原真实的用户配置
- 遗留供应商中推断使用了通用配置的条目自动标记 `commonConfigEnabled=true`

#### Codex TOML 编辑引擎

将 Codex `config.toml` 的更新逻辑重构到共享的 Section 感知 TOML 辅助函数上。

- Rust 端新增 `codex_config.rs` 模块，包含 `update_codex_toml_field` 和 `remove_codex_toml_base_url_if`
- 前端新增 `getTomlSectionRange` / `getCodexProviderSectionName` 等 Section 感知工具函数
- `proxy.rs` 中散落的 TOML 内联编辑逻辑统一委托给新模块

#### 通用配置初始化生命周期

启动流程重新排序，通用配置 Snippet 的提取和迁移逻辑更加健壮。

- 启动时先从干净的 live 文件自动提取通用配置 Snippet，再恢复代理接管状态
- 引入 Snippet `cleared` 标志，追踪用户是否主动清除了某个 Snippet
- 持久化一次性遗留迁移标志，避免重复执行旧版 `commonConfigEnabled` 回填

### Bug 修复

#### 通用配置丢失

- 修复代理接管期间通用配置可能被丢弃的多种场景：同步覆盖 live 文件、热切换产生不完整的恢复快照、供应商切换丢失配置变更

#### Codex 恢复快照保护

- 修复 Codex 接管恢复备份在供应商热切换时丢弃已有 `mcp_servers` 配置块的问题；将 MCP 备份保留策略从整表替换改为按 server id 合并，供应商/通用配置的 MCP 定义在冲突时优先，备份中独有的服务器仍被保留

#### 已清除 Snippet 复活

- 修复启动时自动提取机制重新创建用户已主动清除的通用配置 Snippet 的问题

#### Codex `base_url` 位置错误

- 修复 Codex `base_url` 提取和编辑未定位到正确的 `[model_providers.<name>]` Section，导致追加到文件末尾或误将 `mcp_servers.*.base_url` 识别为供应商端点的问题

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 10.15 (Catalina) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                       | 说明                                |
| ------------------------------------------ | ----------------------------------- |
| `CC-Switch-v3.12.2-Windows.msi`            | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.12.2-Windows-Portable.zip`   | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                               | 说明                                                      |
| ---------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.12.2-macOS.zip`      | **推荐** - 解压后拖入 Applications 即可，Universal Binary |
| `CC-Switch-v3.12.2-macOS.tar.gz`   | 用于 Homebrew 安装和自动更新                              |

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告，请先关闭，然后前往"系统设置" → "隐私与安全性" → 点击"仍要打开"，之后便可以正常打开

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.1] - 2026-03-12

> 稳定性修复、StepFun 预设、OpenClaw authHeader 支持，以及新赞助商伙伴

### 概览

CC Switch v3.12.1 是一个以稳定性改进和 Bug 修复为主的补丁版本。修复了通用配置弹窗无限重复打开的循环问题、WebDAV 同步时的外键约束失败以及多个 i18n 插值问题。同时新增了 **StepFun（阶跃星辰）** 供应商预设、OpenClaw **输入类型选择** 和 **authHeader** 支持，将默认 Gemini 模型升级到 **3.1-pro**，并欢迎四位新赞助商伙伴加入。

### 重点内容

- **通用配置弹窗修复**：解决了通用配置弹窗无限重复打开的循环问题，并新增草稿编辑支持
- **WebDAV 同步可靠性**：修复了 WebDAV 同步恢复 `provider_health` 时的外键约束失败
- **StepFun 预设**：新增 StepFun（阶跃星辰）供应商预设，包含 step-3.5-flash 模型
- **OpenClaw 增强**：新增模型高级选项的输入类型选择和 `authHeader` 字段，支持供应商特定的认证头
- **Gemini 模型升级**：供应商预设中的默认 Gemini 模型升级到 3.1-pro
- **新赞助商**：欢迎 Micu API、XCodeAPI、SiliconFlow、CTok 加入赞助伙伴

### 新功能

#### StepFun 供应商预设

新增 StepFun（阶跃星辰）供应商预设，阶跃星辰是领先的中国 AI 模型提供商。

- 在各支持应用中新增 StepFun 预设条目
- 包含 step-3.5-flash 模型（#1369，感谢 @hengm3467）

#### OpenClaw 增强

增强 OpenClaw 配置能力，提供更细粒度的控制和更好的供应商兼容性。

- 新增模型高级选项的输入类型（input type）选择下拉框（#1368，感谢 @liuxxxu）
- 在 `OpenClawProviderConfig` 中新增可选的 `authHeader` 布尔字段，支持供应商特定的认证头（如 Longcat），并重构表单状态以复用共享类型

#### 赞助商伙伴

- **Micu API**：新增 Micu API 赞助商及推广链接
- **XCodeAPI**：新增 XCodeAPI 赞助商
- **SiliconFlow**：新增 SiliconFlow（硅基流动）赞助商及推广链接
- **CTok**：新增 CTok 赞助商

### 变更

- **UCloud → Compshare**：将 UCloud 供应商更名为 Compshare（优云智算），支持三种语言（中/英/日）的完整国际化
- **Compshare 链接**：更新 Compshare 赞助商注册链接指向 coding-plan 页面
- **Gemini 模型升级**：供应商预设中的默认 Gemini 模型从 2.5-pro 升级到 3.1-pro

### Bug 修复

#### 通用配置与 UI

- 修复通用配置弹窗无限重复打开的循环问题，并新增草稿编辑支持以防止编辑过程中数据丢失
- 修复 Windows 下因左侧溢出导致工具栏紧凑模式不触发的问题（#1375，感谢 @zuoliangyu）
- 修复会话删除后搜索索引未与查询数据同步，导致列表显示过期的问题

#### 同步与数据

- 修复 WebDAV 同步恢复 `provider_health` 表时的外键约束失败

#### 供应商与预设

- 为 Longcat 供应商预设补充缺失的 `authHeader: true`（#1377，感谢 @wavever）
- 对齐 OpenClaw 工具权限配置与上游 schema（#1355，感谢 @bigsongeth）
- 修正 X-Code API URL，从 `www.x-code.cn` 改为 `x-code.cc`

#### i18n 与本地化

- 修复 Stream Check Toast 的 i18n 插值 key 与翻译占位符不匹配
- 修复代理启动 Toast 未正确插值地址和端口的问题（#1399，感谢 @Mason-mengze）
- 将 OpenCode API 格式标签从 "OpenAI" 改为 "OpenAI Responses"，更准确地反映实际格式

### 特别感谢

感谢以下贡献者为本版本做出的贡献！

@hengm3467 @liuxxxu @bigsongeth @zuoliangyu @wavever @Mason-mengze

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 10.15 (Catalina) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                       | 说明                                |
| ------------------------------------------ | ----------------------------------- |
| `CC-Switch-v3.12.1-Windows.msi`            | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.12.1-Windows-Portable.zip`   | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                               | 说明                                                      |
| ---------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.12.1-macOS.zip`      | **推荐** - 解压后拖入 Applications 即可，Universal Binary |
| `CC-Switch-v3.12.1-macOS.tar.gz`   | 用于 Homebrew 安装和自动更新                              |

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告，请先关闭，然后前往"系统设置" → "隐私与安全性" → 点击"仍要打开"，之后便可以正常打开

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.0] - 2026-03-09

> Stream Check 回归，OpenAI Responses API 上线，OpenClaw 与 WebDAV 迎来一次大升级

### 概览

CC Switch v3.12.0 是一个功能版本，重点提升供应商兼容性、OpenClaw 配置编辑体验、通用配置功能使用体验，以及同步与数据维护能力。本次恢复了增强稳定性后的 **模型健康检查（Stream Check）** UI，新增 **OpenAI Responses API** 格式转换，扩展了 **Ucloud**、**Micu**、**X-Code API**、**Novita**、**Bailian For Coding** 等供应商预设，并为 **WebDAV 同步** 引入双层版本控制。

### 重点内容

- **Stream Check 回归**：恢复模型健康检查 UI，新增首次使用确认，并修复 `openai_chat` 供应商检测
- **OpenAI Responses API**：新增 `api_format = "openai_responses"`，支持双向格式转换并整理共享转换逻辑，只需要在添加供应商的时候选择 Response 接口格式并开启代理接管，您就可以在 Claude Code 中使用 gpt 系列模型了！
- **OpenClaw 面板升级**：引入 JSON5 round-trip 配置编辑、配置健康提示、改进后的 Agent Model 选择和 User-Agent 开关
- **预设扩展**：补充 Ucloud、Micu、X-Code API、Novita、Bailian For Coding 预设，并新增 SiliconFlow partner badge 与模型角色标识
- **同步与维护增强**：新增 WebDAV protocol v2 + db-v6 双层版本、daily rollups、增量 auto-vacuum 和 sync-aware backup
- **通用配置功能使用体验优化**：现在通用配置片段更新之后，会在切换供应商时自动同步到新的供应商，不需要再手动勾选。

### 主要功能

#### 模型健康检查 Stream Check

恢复 Stream Check 面板，用于实时验证供应商可用性，增强供应商管理的可靠性。

- 恢复 Stream Check UI 面板，支持单个或批量检测供应商可用性
- 新增首次使用确认对话框，避免不支持健康检查的供应商报错误导用户
- 修复 `openai_chat` API 格式供应商的检测兼容性

#### OpenAI Responses API

新增 `openai_responses` API 格式，为使用 OpenAI Responses API 的供应商提供原生支持。

- 新增 `api_format = "openai_responses"` 供应商格式选项
- 支持 Anthropic Messages <-> OpenAI Responses API 双向格式转换
- 整理共享转换逻辑，减少重复代码

#### Bedrock 请求优化器

为 AWS Bedrock 供应商新增 PRE-SEND 阶段请求优化器，提升兼容性和性能。

- PRE-SEND thinking + cache injection 优化器（#1301，感谢 @keithyt06）

#### OpenClaw 配置增强

OpenClaw 配置编辑体验全面升级，支持更丰富的配置管理。

- JSON5 round-trip 写回：编辑配置时保留注释和格式
- EnvPanel 支持 JSON 编辑模式和 `tools.profile` 选择
- 新增配置校验提示和配置健康状态检查
- Agent 模型下拉框改进，支持从供应商预设填充推荐模型
- User-Agent 开关：可选在请求中附加 User-Agent 标识（默认关闭）
- Legacy timeout 配置自动迁移

#### 供应商预设 Preset

新增和扩展多组供应商预设，覆盖更多供应商和使用场景。

- **Ucloud**：新增 `endpointCandidates` 以及 OpenClaw 默认值，刷新 `templateValues` / `suggestedDefaults`
- **Micu**：新增预设默认值及 OpenClaw 推荐模型
- **X-Code API**：新增 Claude 预设及 `endpointCandidates`
- **Novita**：新增供应商预设（#1192，感谢 @Alex-wuhu）
- **Bailian For Coding**：新增供应商预设（#1263，感谢 @suki135246）
- **SiliconFlow**：新增 partner badge 标识
- **模型角色标识**：供应商预设支持模型角色 badge 显示

#### WebDAV 同步增强

WebDAV 同步引入双层版本控制，提升同步可靠性和数据安全性。

- 新增 WebDAV protocol v2 + db-v6 双层版本控制
- 切换 WebDAV auto-sync 时弹出确认对话框，防止误操作
- sync-aware backup：WebDAV 同步时使用 sync 变体备份，跳过仅本地使用的表数据

#### 用量与数据

用量统计和数据维护能力增强，数据管理更精细，极大降低数据库增长速度。

- Daily rollups：按天汇总用量数据，减少存储占用
- Auto-vacuum：增量式数据库清理，保持数据库健康
- UsageFooter 新增额外统计字段（#1137，感谢 @bugparty）

#### 其他新功能

- **会话删除**：按供应商清理会话记录，带路径安全校验
- **Claude auth field selector 恢复**：恢复认证字段选择器
- **Failover 开关独立显示**：将 failover toggle 从设置面板移到主页独立展示，并新增首次确认对话框
- **通用配置自动抽取**：首次运行时自动从 live config 中抽取通用配置片段
- **新供应商页面改进**：优化新建供应商页面体验（#1155，感谢 @wugeer）

### 架构改进

#### Common Config 运行时叠加

通用配置片段（Common Config Snippet）改为运行时叠加方式应用，不再物化写入每个供应商配置。

**变更前**：Common Config 内容在保存或切换时直接合并写入每个供应商的 `settings_config`。这导致公共配置被复制到每个供应商条目中，修改时需要逐一同步。

**变更后**：Common Config 仅在切换供应商写入 live 文件时以 runtime overlay 方式注入，供应商条目本身不包含公共配置。这意味着修改 Common Config 后立即生效，无需逐一更新每个供应商。

#### 通用配置首次自动抽取

首次运行时，如果数据库中尚无 Common Config Snippet，会自动从当前 live config 中抽取通用配置。这确保了从旧版本升级的用户不会丢失已有的通用配置设置。

#### 定期维护定时器整合

将 daily rollups 和 auto-vacuum 整合到统一的定期维护定时器中，避免多个独立定时器带来的资源竞争和复杂度。

### Bug 修复

#### 代理与流式转换

- 修复 OpenAI ChatCompletion -> Anthropic Messages 流式转换问题
- 新增 Codex `/responses/compact` 路由支持（#1194，感谢 @Tsukumi233）
- 改进 TOML 配置合并逻辑，避免键值丢失
- 改进 proxy forwarder 失败日志，增加更多诊断信息

#### 供应商预设修复

- X-Code 更名为 X-Code API，统一品牌命名
- 修复 SSSAiCode `/v1` 路径问题
- 移除 AICoding URL 错误的 `www` 前缀
- 优化新建供应商页面换行删除问题（#1155，感谢 @wugeer）

#### 平台修复

- 修复 cache hit token 统计缺失（#1244，感谢 @a1398394385）
- 修复最小化到托盘后一段时间自动退出的问题（#1245，感谢 @YewFence）

#### i18n 修复

- 补齐 69 个缺失翻译 key，清理剩余硬编码中文
- 修复 model test panel 的 i18n 问题
- 规范 JSON5 slash escaping，避免国际化字符串解析异常

#### UI 修复

- 修复 Skills 计数显示问题（#1295，感谢 @fzzv）
- 移除 endpoint speed test 的 HTTP 状态码显示，减少视觉噪音
- 修复 outline button 样式问题（#1222，感谢 @Sube-py）

### 性能优化

- OpenClaw 配置未变化时跳过无意义写入，减少磁盘 I/O

### 文档

- 重构用户手册以支持国际化，补齐 EN/JA 完整内容
- 新增 OpenClaw 使用说明，补完设置章节
- 新增 UCloud 赞助商信息
- 重组 docs 目录结构，同步 EN/ZH/JA README 的功能说明

### 说明与注意事项

- **Common Config 改为运行时叠加**：通用配置片段不再物化写入每个供应商配置，而是在切换时动态叠加。修改 Common Config 后立即生效，无需逐一更新供应商。
- **Stream Check 首次使用需确认**：首次使用模型健康检查时会弹出确认对话框，确认后方可使用。
- **OpenClaw User-Agent 开关默认关闭**：需要在 OpenClaw 配置中手动开启 User-Agent 标识附加功能。

### 特别感谢

感谢以下贡献者为本版本做出的贡献！

@keithyt06 @bugparty @Alex-wuhu @suki135246 @Tsukumi233 @wugeer @fzzv @Sube-py @a1398394385 @YewFence

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 10.15 (Catalina) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.12.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.12.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                                      |
| -------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.12.0-macOS.zip`    | **推荐** - 解压后拖入 Applications 即可，Universal Binary |
| `CC-Switch-v3.12.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                              |

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告，请先关闭，然后前往"系统设置" → "隐私与安全性" → 点击"仍要打开"，之后便可以正常打开

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.11.1] - 2026-02-28

> 回退部分键值合并、恢复通用配置片段与多项修复

### 概览

CC Switch v3.11.1 是一个修复版本，回退了 v3.11.0 中引入的**部分键值合并**架构，恢复经过验证的「**全量配置覆写 + 通用配置片段**」机制，同时修复了多个 UI 和平台兼容性问题。

### 重点内容

- **恢复全量配置覆写 + 通用配置片段**：因关键数据丢失问题回退部分键值合并，恢复完整配置快照写入和通用配置片段 UI
- **代理面板交互优化**：代理开关移入面板内部，接管选项一目了然
- **主题与紧凑模式修复**：「跟随系统」主题现可正确自动更新，紧凑模式退出恢复正常
- **Windows 兼容性**：禁用环境检查和一键安装，防止协议处理程序副作用

### 回退

#### 恢复全量配置覆写 + 通用配置片段

回退了 v3.11.0 中引入的部分键值合并重构（revert 992dda5c）。

**回退原因**：部分键值合并方案存在三个关键缺陷：
1. **切换时数据丢失**：非白名单的自定义字段在供应商切换时被静默丢弃
2. **回填永久剥离**：回填操作永久移除数据库中的非键字段，造成不可逆的数据丢失
3. **维护成本高**：「键字段」白名单需要随新配置项不断维护，容易遗漏

**恢复的内容**：
- 供应商切换时的完整配置快照写入（可预测的全量覆写）
- 通用配置片段 UI 及后端命令
- 6 个前端文件（3 个组件 + 3 个 hooks）

**迁移说明**：
- 如果你在 v3.11.0 中切换供应商后丢失了自定义字段，请重新导入配置或手动补回缺失的字段
- 通用配置片段功能已恢复——用它来定义切换供应商时需要保留的共享配置

### 变更

- **代理面板交互优化**：将代理开关从折叠面板标题移入面板内部，紧邻应用接管选项。确保用户启用代理后能立即看到接管配置，避免「只开代理不接管」的常见误操作
- **OpenCode/OpenClaw 手动导入**：移除启动时自动导入供应商配置的行为，改为在空状态页显示「导入当前配置」按钮，与 Claude/Codex/Gemini 保持一致

### 修复

- **「跟随系统」主题不自动更新**：改用 Tauri 原生主题追踪（`set_window_theme(None)`），使 WebView 的 `prefers-color-scheme` 媒体查询能正确响应 OS 主题切换
- **紧凑模式无法退出**：恢复 `toolbarRef` 上的 `flex-1` class，修复 `useAutoCompact` 的退出条件因宽度计算错误而永远不触发的问题
- **代理接管 Toast 显示 {{app}}**：为 proxy takeover 的 i18next `t()` 调用补充缺失的 `app` 插值参数
- **Windows 协议处理副作用**：在 Windows 上禁用环境检查和一键安装功能，防止协议处理程序注册引发的意外副作用

### 说明与注意事项

- **通用配置片段已恢复**：如果你在 v3.10.x 及更早版本中使用了此功能，它的工作方式与之前完全一致。用它来定义切换供应商时需要保留的共享配置。
- **v3.11.0 部分键值合并用户**：如果你在 v3.11.0 中切换供应商后发现配置字段丢失，请重新导入配置以恢复。

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 10.15 (Catalina) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.11.1-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.11.1-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                                      |
| -------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.11.1-macOS.zip`    | **推荐** - 解压后拖入 Applications 即可，Universal Binary |
| `CC-Switch-v3.11.1-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                              |

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现「未知开发者」警告，请先关闭，然后前往「系统设置」→「隐私与安全性」→ 点击「仍要打开」，之后便可以正常打开

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.11.0] - 2026-02-26

> OpenClaw 支持、会话管理器、备份管理与 50+ 项改进

### 概览

CC Switch v3.11.0 是一次大规模更新，新增第五个应用 **OpenClaw** 的完整管理支持，同时带来全新的**会话管理器**和**备份管理**功能。此外，**Oh My OpenCode (OMO) 集成**、供应商切换的**部分键值合并**架构升级、**设置页面重构**等多项改进使整体体验更加完善。

### 重点内容

- **OpenClaw 支持**：第五个受管理应用，含 13 个供应商预设、Env/Tools/AgentsDefaults 配置编辑器、Workspace 文件管理
- **会话管理器**：浏览五个应用的历史会话，支持目录导航和会话内搜索
- **备份管理**：独立备份面板，可配置策略、定时备份、迁移前自动备份
- **Oh My OpenCode 集成**：完整 OMO 配置管理，支持 OMO Slim 轻量模式
- **部分键值合并（⚠️ 破坏性变更）**：供应商切换改为仅替换供应商相关字段，保留用户的其余设置；"通用配置片段"功能因此移除
- **设置页面重构**：5 标签页布局，代码量减少约 40%
- **6 组新供应商预设**：AWS Bedrock、SSAI Code、CrazyRouter、AICoding 等
- **Thinking Budget Rectifier**：代理矫正器，更精细的 thinking budget 控制
- **主题切换动画**：圆形揭示过渡动画，视觉体验升级
- **WebDAV 自动同步**：支持自动同步与大文件防护

### 主要功能

#### OpenClaw 支持（新增第五应用）

CC Switch 新增对 OpenClaw 的完整管理支持，这是继 Claude Code、Codex、Gemini CLI、OpenCode 之后的第五个受管理应用。

- **供应商管理**：新增、编辑、切换、删除 OpenClaw 供应商，含 13 个内置预设
- **配置编辑器**：Env（环境变量）、Tools（工具）、AgentsDefaults（代理默认值）三个专属配置面板
- **Workspace 面板**：支持 HEARTBEAT/BOOTSTRAP/BOOT 文件管理及每日记忆
- **Additive 叠加模式**：支持配置叠加而非覆盖
- **默认模型按钮**：一键填充推荐模型，添加供应商时自动将建议模型注册到 allowlist
- **品牌与交互**：专属品牌图标、应用切换淡入淡出过渡动画
- **深链接支持**：通过 URL 导入 OpenClaw 供应商配置
- **完整国际化**：中/英/日三语全面支持

#### 会话管理器 Sessions

全新的会话管理器，帮助你浏览和检索历史会话记录。

- 支持浏览 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 五个应用的历史会话（#867，感谢 @TinsFox）
- 目录导航和会话内搜索
- 进入会话页面时默认过滤为当前应用，快速定位
- 并行目录扫描 + 头尾 JSONL 读取，优化加载性能

#### 备份管理 Backup

独立的备份管理面板，让数据安全更有保障。

- 可配置备份策略：最大备份数量、自动清理规则
- 运行时每小时定期自动备份
- 数据库迁移前自动备份，带回填警告提示
- 支持备份重命名和删除（含确认对话框）
- 备份文件名使用本地时间，更直观

#### Oh My OpenCode (OMO) 集成

完整的 Oh My OpenCode 配置文件管理。

- Agent 模型选择、Category 配置、推荐模型填充（#972，感谢 @yovinchen）
- 改进 Agent 模型选择 UX，修复 lowercase key 问题（#1004，感谢 @yovinchen）
- OMO Slim 轻量模式支持
- OMO 与 OMO Slim 互斥切换（数据库层级强制保证一致性）

#### 工作空间 Workspace

- 每日记忆文件全文搜索，按日期排序
- 目录路径可点击跳转，快速打开文件位置

#### 工具栏 Toolbar

- AppSwitcher 根据窗口宽度自动折叠为紧凑模式
- 紧凑模式切换平滑过渡动画

#### 设置 Settings

- 代理和用量功能新增首次使用确认对话框，避免误操作
- 新增 `enableLocalProxy` 开关，控制主页代理 UI 显示
- 更精细的本地环境检查：CLI 工具版本检测（#870，感谢 @kv-chiu）、Volta 路径检测（#969，感谢 @myjustify）

#### 供应商预设 Preset

- **AWS Bedrock**：支持 AKSK 和 API Key 两种认证方式（#1047，感谢 @keithyt06）
- **SSAI Code**：合作伙伴预设，覆盖五端
- **CrazyRouter**：合作伙伴预设及专属图标
- **AICoding**：合作伙伴预设及推广文案
- 更新国内模型供应商预设至最新版本
- Qwen Coder 重命名为百炼 (Bailian)（#965，感谢 @zhu-jl18）

#### 其他新功能

- **Thinking Budget Rectifier**：代理矫正器，更精细地控制 thinking budget 分配（#1005，感谢 @yovinchen）
- **WebDAV 自动同步**：支持自动同步配置，并增加大文件防护（#923，感谢 @clx20000410；#1043，感谢 @SaladDay）
- **主题切换动画**：圆形揭示过渡动画，视觉体验更流畅（#905，感谢 @funnytime75）
- **Claude 配置编辑器快速开关**：快速切换常用配置项（#1012，感谢 @JIA-ss）
- **动态端点提示**：根据 API 格式选择动态显示端点提示文本（#860，感谢 @zhu-jl18）
- **用量仪表盘增强**：自动刷新、更强健的数据格式化（#942，感谢 @yovinchen）
- **新增定价数据**：claude-opus-4-6 和 gpt-5.3-codex（#943，感谢 @yovinchen）
- **静默启动优化**：静默启动选项仅在开机启动开启时显示

### 架构改进

#### 部分键值合并（⚠️ 破坏性变更）

供应商切换从全量配置覆写改为部分键值合并策略（#1098）。

**变更前**：切换供应商时，整个 `settings_config` 会覆写到 live 配置文件。这意味着用户在 live 文件中手动添加的非供应商设置（插件配置、MCP 配置、权限设置等）会在每次切换时丢失。为了弥补这个问题，之前版本提供了"通用配置片段"功能，让用户定义每次切换时都会合并的公共配置。

**变更后**：切换供应商时，仅替换供应商相关的键值（API Key、端点、模型等），用户的其余设置完整保留。因此"通用配置片段"功能不再需要，已被移除。

**影响与迁移**：
- 如果你之前**没有使用**通用配置片段功能，此变更对你完全透明，切换体验只会更好
- 如果你之前**使用了**通用配置片段功能来保留自定义设置（如 MCP 配置、权限等），升级后这些设置会在切换时自动保留，无需额外操作
- 如果你利用通用配置片段做其他用途（如在切换时注入额外配置），请在升级后手动将这些配置写入 live 配置文件中

此次重构删除了 6 个前端文件（3 个组件 + 3 个 hooks）、约 150 行后端死代码。

#### 手动导入替代自动导入

启动时不再自动导入外部配置，改为手动点击"导入当前配置"按钮，避免意外覆盖用户数据。

#### OMO Variant 参数化

通过 `OmoVariant` 结构体参数化消除 OMO 模块约 250 行重复代码。

#### OMO 公共配置移除

删除二层合并系统，减少约 1,733 行代码，简化架构。

#### ProviderForm 拆分

ProviderForm 组件从 2,227 行减至 1,526 行，提取 5 个独立模块（opencodeFormUtils、useOmoModelSource、useOpencodeFormState、useOmoDraftState、useOpenclawFormState），可维护性显著提升。

#### MCP/Skills 共享组件

提取 AppCountBar、AppToggleGroup、ListItemRow 等共享组件，减少 MCP 和 Skills 面板的重复代码（#897，感谢 @PeanutSplash）。

#### 设置页面重构

设置页面重构为 5 标签页布局（通用 | 代理 | 高级 | 用量 | 关于），SettingsPage 代码从约 716 行减至约 426 行。

#### 其他改进

- 终端统一：全局设置统一终端选择，新增 WezTerm 支持
- Claude 模型引用从 4.5 更新到 4.6

### Bug 修复

#### 严重修复

- **Windows 主目录回归**：恢复默认主目录解析，防止 Git/MSYS 环境下数据库路径变更导致数据"丢失"
- **Linux 白屏**：禁用 AMD GPU 的 WebKitGTK 硬件加速，解决部分 Linux 系统启动白屏问题（#986，感谢 @ThendCN）
- **OpenAI Beta 参数**：不再为 `/v1/chat/completions` 添加 `?beta=true`，修复 Nvidia 等使用 OpenAI Chat 格式的供应商请求失败（#1052，感谢 @jnorthrup）
- **健康检查认证**：尊重供应商 `auth_mode` 设置，避免仅支持 Bearer 认证的代理服务健康检查失败（#824，感谢 @Jassy930）

#### 供应商预设修复

- 修复 OpenClaw `/v1` 前缀双重路径问题
- Opus 定价修正（$15/$75 → $5/$25）并升级到 4.6
- AIGoCode URL 统一为 `https://api.aigocode.com`
- Zhipu GLM 移除过时合作伙伴状态
- 新建 Claude 供应商时 API Key 输入框可见性恢复
- 非活跃供应商隐藏快速开关，显示上下文感知的 JSON 编辑器提示

#### OMO 修复

- omo-slim 分类检查补齐（add/form/mutation 路径）
- OMO Slim 供应商变更后正确失效查询缓存
- OMO agent/category 推荐模型与上游源同步
- "填充推荐"按钮失败时增加 toast 反馈
- 移除 OMO/OMO Slim 最后一个供应商的删除限制
- OpenCode 未配置模型时拒绝保存（#932，感谢 @yovinchen）

#### OpenClaw 修复

- 修复 25 个缺失 i18n key、替换 key={index} 为稳定 ID、深链接 additive 合并等代码审查问题
- EnvPanel 健壮性增强（NaN 守卫、使用条目键名而非数组索引）
- i18n 重复键合并，恢复供应商表单翻译

#### 平台修复

- Windows 静默启动时窗口闪烁（#901，感谢 @funnytime75）
- 标题栏暗黑模式跟随主题（#903，感谢 @funnytime75）
- Windows Skills 路径分隔符匹配（#868，感谢 @stmoonar）
- WSL 辅助函数条件编译

#### UI 修复

- 工具栏高度裁切导致 AppSwitcher 被遮挡
- 有新版本时显示更新徽章而非绿色对勾
- 仅 Claude/Codex 应用显示会话管理器按钮
- SQL 导入/导出卡片暗黑模式样式统一（#1067，感谢 @SaladDay）

#### 其他修复

- 会话管理器硬编码中文字符串替换为 i18n key
- Skill 文档 URL 分支和路径修正（#977，感谢 @yovinchen）
- OpenCode install.sh 安装路径检测补齐（#988，感谢 @zhu-jl18）
- Skill ZIP 符号链接解析修复（#1040，感谢 @yovinchen）
- MCP 表单补齐 OpenCode 复选框（#1026，感谢 @yovinchen）
- useProvidersQuery 中自动导入副作用移除

### 性能优化

- 会话面板并行目录扫描 + 头尾 JSONL 读取，大幅提升会话列表加载速度
- 移除 Tauri 本地 IPC 不必要的 query cache，减少内存占用

### 文档

- 赞助商更新：SSSAiCode、Crazyrouter、AICoding、Right Code、MiniMax
- 新增用户手册（#979，感谢 @yovinchen）

### 说明与注意事项

- **OpenClaw 为新支持的应用**：需要先安装 OpenClaw CLI 才能使用相关功能。
- **⚠️ 通用配置片段功能已移除**：由于供应商切换改为部分键值合并（仅替换 API Key、端点、模型等字段），用户的其余设置会自动保留，"通用配置片段"功能不再需要。详见上方"架构改进"章节的迁移说明。
- **自动导入已改为手动**：启动时不再自动导入外部配置，请在需要时手动点击"导入当前配置"。
- **OMO 与 OMO Slim 互斥**：同一时间只能启用其中一个，切换时另一个会自动禁用。
- **备份功能默认开启**：运行时每小时自动备份，可在备份面板调整策略。

### 特别感谢

感谢以下贡献者为本版本做出的贡献！

@TinsFox @keithyt06 @kv-chiu @SaladDay @jnorthrup @JIA-ss @clx20000410 @ThendCN @yovinchen @zhu-jl18 @myjustify @funnytime75 @PeanutSplash @Jassy930 @stmoonar

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 10.15 (Catalina) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.11.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.11.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                                      |
| -------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.11.0-macOS.zip`    | **推荐** - 解压后拖入 Applications 即可，Universal Binary |
| `CC-Switch-v3.11.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                              |

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告，请先关闭，然后前往"系统设置" → "隐私与安全性" → 点击"仍要打开"，之后便可以正常打开

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.10.0] - 2026-01-21

> OpenCode 支持、全局代理、Claude Rectifier 与多应用体验增强

### 概览

CC Switch v3.10.0 新增 OpenCode 支持，成为第四个受管理的 CLI 应用。
同时带来全局代理设置、Claude Rectifier（thinking 签名修正器）、健康检查增强、按供应商配置等多项重要功能，并对多应用工作流与终端体验做了全面改进。

### 重点内容

- OpenCode 支持：供应商、MCP 服务器、Skills 全面管理，首次启动自动导入
- 全局代理：为出站网络请求统一配置代理
- Claude Rectifier：thinking 签名修正器，兼容更多第三方 API
- 健康检查增强：可配置提示词、CLI 兼容请求
- 按供应商配置：支持供应商特定配置的持久化
- 应用可见性控制：自由显示/隐藏应用，托盘菜单同步更新
- 终端改进：供应商专属终端按钮、fnm 路径支持、跨平台安全启动
- WSL 工具检测：在 WSL 环境检测工具版本，并增加安全加固

### 主要功能

#### OpenCode 支持（新增第四应用）

- 完整的 OpenCode 供应商管理：新增、编辑、切换、删除
- MCP 服务器管理：与 Claude/Codex/Gemini 统一架构
- Skills 支持：OpenCode 也可使用 Skills 功能
- 首次启动自动导入：检测到已有 OpenCode 配置时自动导入
- 完整国际化：中/英/日三语支持（#695）

#### 全局代理（Global Proxy）

- 为所有出站网络请求配置统一代理（#596，感谢 @yovinchen）
- 支持 HTTP/HTTPS 代理协议
- 适用于需要代理访问外部 API 的网络环境

#### Claude Rectifier（Thinking 签名修正器）

- 自动修正 Claude API 的 thinking 签名（#595，感谢 @yovinchen）
- 解决部分第三方 API 网关返回的 thinking 块格式不兼容问题
- 在高级设置中可开启/关闭

#### 健康检查增强

- 可配置自定义提示词（prompt）用于流式健康检查（#623，感谢 @yovinchen）
- 支持 CLI 兼容请求格式，更好地模拟真实使用场景
- 提升故障检测的准确性

#### 按供应商配置（Per-Provider Config）

- 支持为每个供应商单独保存配置（#663，感谢 @yovinchen）
- 配置持久化：重启后保留供应商专属设置
- 适用于不同供应商需要不同配置的场景

#### 应用可见性控制

- 自由显示/隐藏任意应用（Gemini 默认隐藏）
- 托盘菜单自动同步可见性设置
- 隐藏的应用不会出现在主界面和托盘菜单中

#### Takeover Compact Mode

- 当显示 3 个及以上可见应用时，自动使用紧凑布局
- 优化多应用场景下的空间利用

#### 终端改进

- 供应商专属终端按钮：一键在终端中使用当前供应商（#564，感谢 @kkkman22）
- `fnm` 路径支持：自动识别 fnm 管理的 Node.js 路径
- 跨平台安全启动：改进 Windows/macOS/Linux 的终端启动逻辑

#### WSL 工具检测

- 在 WSL 环境中检测工具版本（#627，感谢 @yovinchen）
- 增加安全加固，防止命令注入风险

#### Skills 预设增强

- 新增 `baoyu-skills` 预设仓库
- 自动补充缺失的默认仓库，确保开箱即用

### 体验优化

- 键盘快捷键：按 `ESC` 快速返回/关闭面板（#670，感谢 @xxk8）
- 代理日志简化：输出更清晰易读（#585，感谢 @yovinchen）
- 定价编辑器 UX：统一使用 `FullScreenPanel` 风格
- 高级设置布局：Rectifier 区块移至 Failover 下方，逻辑更顺畅
- OpenRouter 兼容模式：默认禁用，UI 开关隐藏（减少干扰）

### Bug 修复

#### 代理与故障切换

- 启用自动故障切换时立即切换到 P1（而非等待下次请求）

#### 供应商管理

- 修复供应商编辑对话框保存后重新打开时数据过时的问题（#654，感谢 @YangYongAn）
- 修复切换预设时 baseUrl 和 apiKey 状态未重置的问题
- 修复端点自动选择状态未持久化的问题（#611，感谢 @yovinchen）
- 未设置图标颜色时自动应用默认颜色

#### 深链接

- 支持多端点导入（#597，感谢 @yovinchen）
- 优先使用 `GOOGLE_GEMINI_BASE_URL` 而非 `GEMINI_BASE_URL`

#### MCP

- WSL 目标路径跳过 `cmd /c` 包裹（#592，感谢 @cxyfer）

#### 用量模板

- 新增变量提示，修复验证问题（#628，感谢 @YangYongAn）
- 防止配置在供应商之间泄漏
- 用量区块偏移量根据操作按钮宽度自动适应（#613，感谢 @yovinchen）

#### Gemini

- 超时参数转换为 Gemini CLI 格式（#580，感谢 @cxyfer）

#### UI

- 修复 `FullScreenPanel` 中 Select 下拉框渲染问题

### 说明与注意事项

- **OpenCode 为新支持的应用**：需要先安装 OpenCode CLI 才能使用相关功能。
- **全局代理会影响所有出站请求**：包括用量查询、健康检查等网络操作。
- **Rectifier 功能为实验性**：如遇问题可在高级设置中关闭。

### 特别感谢

感谢 @yovinchen @YangYongAn @cxyfer @xxk8 @kkkman22 @Shuimo03 为本版本做出的贡献！
感谢 @libukai 设计的故障转移相关 UI，非常优雅！

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 10.15 (Catalina) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.10.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.10.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                                      |
| -------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.10.0-macOS.zip`    | **推荐** - 解压后拖入 Applications 即可，Universal Binary |
| `CC-Switch-v3.10.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                              |

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告，请先关闭，然后前往"系统设置" → "隐私与安全性" → 点击"仍要打开"，之后便可以正常打开

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.9.0] - 2026-01-07

> 本地 API 代理、自动故障切换、统一供应商与多应用工作流增强

### 概览

CC Switch v3.9.0 是 v3.9 测试版序列（`3.9.0-1`、`3.9.0-2`、`3.9.0-3`）的稳定版。
本次更新带来本地 API 代理（支持按应用接管）、自动故障切换、统一供应商（Universal Provider），并对 Claude Code / Codex / Gemini CLI 的稳定性与使用体验做了大量改进。

### 重点内容

- 本地 API 代理：Claude Code / Codex / Gemini CLI 统一接入
- 自动故障切换：熔断保护 + 每个应用独立的 failover 队列
- 统一供应商：一份配置可同步到多个应用（适合 NewAPI 等网关）
- Skills 相关增强：支持多应用、管理架构统一（SSOT + React Query）
- 通用配置片段：支持从编辑器内容或当前供应商提取可复用片段
- MCP 导入：支持从已安装应用导入 MCP servers
- 用量增强：自动刷新、缓存命中/创建指标、时区修复
- Linux 打包：新增 RPM 与 Flatpak 制品

### 主要功能

#### 本地 API 代理（Local API Proxy）

- 运行一个本地高性能 HTTP 代理服务（基于 Axum）
- 统一代理 Claude Code、Codex、Gemini CLI 的 API 请求
- 按应用接管：你可以分别控制每个应用是否走本地代理
- Live 配置接管：启用接管时，会备份并重定向 CLI 的 live 配置到本地代理
- 监控能力：记录请求日志与用量统计，便于排错与成本分析
- 错误请求日志：代理会记录失败请求的详细信息，便于定位问题（#401，感谢 @yovinchen）

#### 自动故障切换（Auto Failover / 熔断）

- 自动检测供应商异常并触发熔断保护
- 当前供应商不可用时自动切换到备用供应商
- 每个应用维护独立的 failover 队列，并实时追踪健康状态
- 当关闭故障切换时，超时/重试相关配置不会影响正常请求流程

#### Skills 管理

- Skills 支持 Claude Code 与 Codex 多应用使用，并提供旧结构到新结构的平滑迁移（#365、#378，感谢 @yovinchen）
- Skills 管理架构统一（SSOT + React Query），状态刷新与数据一致性更稳定
- 发现（Discovery）体验与性能改进：
  - 扫描时跳过隐藏目录
  - Discoverable skills 使用长生命周期缓存提升性能
  - 增加加载状态提示，导入/刷新等操作入口更显眼
  - 修复 Skills 仓库分支配置错误（#505，感谢 @kjasn）

#### 统一供应商（Universal Provider）

- 新增“跨应用共享”的供应商配置，可同步到 Claude/Codex/Gemini（#348，感谢 @Calcium-Ion）
- 适配支持多协议的 API 网关（例如 NewAPI）
- 同一个供应商下可按应用分别设置默认模型映射

#### 通用配置片段（Claude/Codex/Gemini）

- 维护一段“通用配置片段”，并将其合并/追加到启用该功能的供应商配置中
- 新增“提取通用配置片段”工作流：
  - 优先从编辑器当前内容提取（你正在编辑的内容）
  - 若未提供编辑器内容，则从当前激活的供应商提取
- Codex 场景提取更安全：
  - 自动移除 `model_provider`、`model` 以及整个 `model_providers` 表等供应商相关内容
  - 会保留 `[mcp_servers.*]` 下的 `base_url`，避免误伤 MCP 配置

#### MCP 管理

- 支持从已安装应用导入 MCP servers
- 同步更稳健：目标 CLI 未安装则跳过；无效的 Codex `config.toml` 可更优雅处理（#461，感谢 @majiayu000）
- Windows 兼容性：MCP 导出相关的 npx/npm 调用使用 `cmd /c` 包裹

#### 用量与计费数据

- 用量与计费增强：自动刷新、缓存命中/创建指标、时区修复，以及内置价格表更新（#508，感谢 @yovinchen）
- 深链支持：可通过 deeplink 导入用量查询配置（#400，感谢 @qyinter）
- 用量统计支持提取模型信息（#455，感谢 @yovinchen）
- 用量查询凭证支持从供应商配置回退（#360，感谢 @Sirhexs）

### 体验优化

- 供应商搜索过滤：按名称快速查找（#435，感谢 @TinsFox）
- 供应商图标颜色：支持为供应商图标设置自定义颜色，便于快速区分（#385，感谢 @yovinchen）
- 快捷键：`Cmd/Ctrl + ,` 打开设置（#436，感谢 @TinsFox）
- 可跳过 Claude Code 首次确认弹窗（可选）
- Toast 通知可关闭：切换提示与成功提示都支持关闭按钮（#350，感谢 @ForteScarlet）
- 点击更新徽章会自动跳转到 About 标签页
- 设置页 Tab 样式改进（#342，感谢 @wenyuanw）
- 更顺滑的切换动效：应用/视图淡入淡出与面板退出动画
- 代理接管激活时应用翡翠绿主题，便于一眼识别当前状态
- 深色模式可读性增强（表单与标签对比度等）
- FullScreenPanel 的窗口拖拽区域优化（#525，感谢 @zerob13）

### 平台说明

#### Windows

- 版本检查不再弹出终端窗口
- 改进窗口尺寸默认值（最小宽高）
- 修复部分设备启动黑屏问题（使用系统标题栏方案）
- 兼容旧 WebView：为 `crypto.randomUUID()` 增加降级方案

#### macOS

- 自启动使用 `.app bundle` 路径，避免弹出终端窗口（#462，感谢 @majiayu000）
- 托盘与标题栏相关体验优化

### 打包

- Linux：新增 RPM 与 Flatpak 打包目标，用于生成发布制品

### 说明与注意事项

- 安全增强：修复 JavaScript 执行器与用量脚本相关的安全问题（#151，感谢 @luojiyin1987）。
- 为降低导入风险，SQL 导入被限制为仅允许导入 CC Switch 自己导出的备份。
- Proxy 接管会修改 CLI 的 live 配置；CC Switch 会在重定向前自动备份 live 配置。如需回退，可关闭接管/停止代理，并在必要时从备份恢复。

### 特别感谢

特别感谢 @xunyu @deijing @su-fen 做出的支持和贡献，没有你们就没有这个版本！

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                      | 架构                                |
| ------- | ----------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上             | x64                                 |
| macOS   | macOS 10.15 (Catalina) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                        | x64                                 |

#### Windows

| 文件                                    | 说明                                |
| --------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.9.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.9.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                            | 说明                                                      |
| ------------------------------- | --------------------------------------------------------- |
| `CC-Switch-v3.9.0-macOS.zip`    | **推荐** - 解压后拖入 Applications 即可，Universal Binary |
| `CC-Switch-v3.9.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                              |

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告，请先关闭，然后前往"系统设置" → "隐私与安全性" → 点击"仍要打开"，之后便可以正常打开

#### Homebrew（MacOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

#### Linux

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |
| 沙箱隔离需求                            | `.flatpak`  | `flatpak install CC-Switch-*.flatpak`                                  |

---

## [3.8.0] - 2025-11-28

> 持久化架构升级，为云同步奠定基础

### 概览

CC Switch v3.8.0 是一次重大的架构升级版本，重构了数据持久化层和用户界面，为未来的云同步和本地代理功能奠定基础。

**提交数量**：从 v3.7.1 开始 51 个提交
**代码变更**：207 个文件，+17,297 / -6,870 行

### 重大更新

#### 持久化架构升级

从单一 JSON 文件存储迁移到 SQLite + JSON 双层架构，实现数据分层管理。

**架构变更**：

```
v3.7.x (旧)                      v3.8.0 (新)
┌─────────────────┐              ┌─────────────────────────────────┐
│  config.json    │              │  SQLite (可同步数据)             │
│  ┌───────────┐  │              │  ├─ providers     供应商配置     │
│  │ providers │  │              │  ├─ mcp_servers   MCP 服务器     │
│  │ mcp       │  │     ──>      │  ├─ prompts       提示词         │
│  │ prompts   │  │              │  ├─ skills        技能           │
│  │ settings  │  │              │  └─ settings      通用设置       │
│  └───────────┘  │              ├─────────────────────────────────┤
└─────────────────┘              │  JSON (设备级数据)               │
                                 │  └─ settings.json 本地设置       │
                                 │     ├─ 窗口位置                  │
                                 │     ├─ 路径覆盖                  │
                                 │     └─ 当前选中供应商 ID          │
                                 └─────────────────────────────────┘
```

**双层结构设计**：

| 层级     | 存储方式 | 数据类型                     | 同步策略   |
| -------- | -------- | ---------------------------- | ---------- |
| 云同步层 | SQLite   | 供应商、MCP、Prompts、Skills | 未来可同步 |
| 设备层   | JSON     | 窗口状态、本地路径、当前选择 | 保持本地   |

**技术实现**：

- **Schema 版本管理** - 支持数据库结构升级迁移
- **SQL 导入导出** - `backup.rs` 支持 SQL dump，便于云端存储
- **事务支持** - SQLite 原生事务保证数据一致性
- **自动迁移** - 首次启动自动从 `config.json` 迁移数据

**模块化重构**：

```
database/
├── mod.rs              核心 Database 结构体和初始化
├── schema.rs           表结构定义、Schema 版本迁移
├── backup.rs           SQL 导入导出、二进制快照备份
├── migration.rs        JSON → SQLite 数据迁移引擎
└── dao/                数据访问对象层
    ├── providers.rs    供应商 CRUD
    ├── mcp.rs          MCP 服务器 CRUD
    ├── prompts.rs      提示词 CRUD
    ├── skills.rs       Skills CRUD
    └── settings.rs     键值对设置存储
```

#### 全新用户界面

完整重构的 UI 设计，提供更现代化的视觉体验。

**视觉改进**：

- 重新设计的界面布局
- 统一的组件样式
- 更流畅的过渡动画
- 优化的视觉层次

**交互优化**：

- Header toolbar 重新设计
- ConfirmDialog 样式统一
- 禁用主视图 overscroll 弹跳效果
- 改进的表单验证反馈

**兼容性调整**：

- Tailwind CSS 从 v4 降级到 v3.4，提升浏览器兼容性

#### 日语支持

新增日语（日本語）界面支持，国际化语言扩展到三种。

**支持语言**：

- 简体中文
- English
- 日本語（新增）

### 新增功能

#### Skills 递归扫描

Skills 管理系统支持递归扫描仓库目录，自动发现嵌套的技能文件。

**改进内容**：

- 支持多层目录结构
- 自动发现所有 `SKILL.md` 文件
- 允许不同仓库的同名技能（使用完整路径去重）

#### 供应商图标配置

供应商预设支持自定义图标配置。

**功能特性**：

- 预设供应商包含默认图标
- 复制供应商时保留图标设置
- 图标颜色自定义

#### 表单验证增强

供应商表单新增必填字段验证，提供更友好的错误提示。

**改进内容**：

- 必填字段实时校验
- 统一使用 Toast 通知显示验证错误
- 更清晰的错误信息

#### 开机自启

新增开机自动启动功能，支持 Windows、macOS 和 Linux 三个平台。

**功能特性**：

- 在设置中一键开启/关闭
- 使用平台原生 API 实现
- Windows 使用注册表、macOS 使用 LaunchAgent、Linux 使用 XDG autostart

#### 新增供应商预设

- **MiniMax** - 官方合作伙伴

### Bug 修复

#### 关键修复

**自定义端点丢失问题**

修复更新供应商时自定义请求地址意外丢失的问题。

- 根因：`INSERT OR REPLACE` 在 SQLite 底层执行 `DELETE + INSERT`，触发外键级联删除
- 修复：改用 `UPDATE` 语句更新已存在的供应商

**Gemini 配置问题**

- 修复自定义供应商环境变量未正确写入 `.env` 文件
- 修复安全认证配置错误写入到其他配置文件

**供应商验证问题**

- 修复当前供应商 ID 不存在时的验证错误
- 修复供应商复制时图标字段丢失

#### 平台兼容性

**Linux**

- 解决 WebKitGTK DMA-BUF 渲染问题
- 保留用户 `.desktop` 文件自定义

#### 其他修复

- 修复切换应用时的冗余用量查询
- 修复 DMXAPI 预设使用错误的认证令牌字段
- 修复深链接组件缺少翻译键
- 修复用量脚本模板初始化逻辑

### 技术改进

#### 架构重构

**供应商服务模块化**：

```
services/provider/
├── mod.rs          核心服务 - add/update/delete/switch/validate
├── live.rs         Live 配置文件操作
├── gemini_auth.rs  Gemini 认证类型检测
├── endpoints.rs    自定义端点管理
└── usage.rs        用量脚本执行
```

**深链接模块化**：

```
deeplink/
├── mod.rs       模块导出
├── parser.rs    URL 解析
├── provider.rs  供应商导入逻辑
├── mcp.rs       MCP 导入逻辑
├── prompt.rs    提示词导入
├── skill.rs     Skills 导入
└── utils.rs     工具函数
```

#### 代码质量

**清理工作**：

- 移除 JSON 时代遗留的导入导出死代码
- 移除未使用的 MCP 类型导出
- 统一错误处理方式

**测试更新**：

- 迁移测试到 SQLite 数据库架构
- 更新组件测试匹配当前实现
- 修复 MSW handlers 适配新 API

### 技术统计

```
总体变更：
- 提交数：51
- 文件数：207 个文件变更
- 新增：+17,297 行
- 删除：-6,870 行
- 净增：+10,427 行

提交类型分布：
- fix：25 个（Bug 修复）
- refactor：11 个（代码重构）
- feat：9 个（新功能）
- test：1 个（测试）
- 其他：5 个

改动区域分布：
- 前端源码：112 个文件
- Rust 后端：63 个文件
- 测试文件：20 个文件
- 国际化文件：3 个文件
```

### 迁移说明

#### 从 v3.7.x 升级

**自动迁移** - 首次启动时自动执行：

1. 检测 `config.json` 是否存在
2. 在事务中迁移所有数据到 SQLite
3. 设备级设置迁移到 `settings.json`
4. 显示迁移成功通知

**数据安全**：

- 原 `config.json` 文件保留不删除
- 迁移失败时显示错误对话框，保留`config.json`
- 支持 Dry-run 模式验证迁移逻辑

### 下载与安装

#### 系统要求

- **Windows**：Windows 10+
- **macOS**：macOS 10.15（Catalina）+
- **Linux**：Ubuntu 22.04+ / Debian 11+ / Fedora 34+

#### 下载链接

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载：

- **Windows**：`CC-Switch-v3.8.0-Windows.msi` 或 `-Portable.zip`
- **macOS**：`CC-Switch-v3.8.0-macOS.tar.gz` 或 `.zip`
- **Linux**：`CC-Switch-v3.8.0-Linux.AppImage` 或 `.deb`

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

### 致谢

#### 贡献者

感谢所有让这个版本成为可能的贡献者：

- [@YoVinchen](https://github.com/YoVinchen) - UI 和数据库重构
- [@farion1231](https://github.com/farion1231) - BUG 修复和功能增强
- 社区成员的测试和反馈

#### 赞助商

**智谱AI** - GLM CODING PLAN 赞助商
[使用此链接购买可享九折优惠](https://www.bigmodel.cn/claude-code?ic=RRVJPB5SII)

**PackyCode** - API 中转服务合作伙伴
[使用 "cc-switch" 优惠码注册享 9 折优惠](https://www.packyapi.com/register?aff=cc-switch)

**闪电说** - 本地优先的 AI 语音输入法
[免费下载](https://shandianshuo.cn) Mac/Win 双平台

**MiniMax** - MiniMax M2 CODING PLAN 赞助商
[黑五优惠进行中，套餐9.9元起](https://platform.minimaxi.com/subscribe/coding-plan)

### 反馈与支持

- **问题反馈**：[GitHub Issues](https://github.com/farion1231/cc-switch/issues)
- **讨论**：[GitHub Discussions](https://github.com/farion1231/cc-switch/discussions)
- **文档**：[README](../README_ZH.md)
- **更新日志**：[CHANGELOG.md](../CHANGELOG.md)

### 未来展望

**v3.9.0 预览**（暂定）：

- 本地代理功能

敬请期待更多更新！

**Happy Coding!**

---

## [3.7.1] - 2025-11-22

> 稳定性增强与用户体验改进

### v3.7.1 更新内容

**代码变更**：17 个文件，+524 / -81 行

#### Bug 修复

- **修复 Skills 第三方仓库安装失败** (#268)
  修复使用自定义子目录的 skills 仓库无法安装的问题，支持类似 `ComposioHQ/awesome-claude-skills` 这样带子目录的仓库

- **修复 Gemini 配置持久化问题**
  解决在 Gemini 表单中编辑 settings.json 后，切换供应商时修改丢失的问题

- **防止对话框意外关闭**
  添加点击遮罩时的保护，避免误操作导致表单数据丢失，影响所有 11 个对话框组件

#### 新增功能

- **Gemini 配置目录支持** (#255)
  在设置中添加 Gemini 配置目录选项，支持自定义 `~/.gemini/` 路径

- **ArchLinux 安装支持** (#259)
  添加 AUR 安装方式：`paru -S cc-switch-bin`

#### 改进

- **Skills 错误消息国际化增强**
  新增 28+ 条详细错误消息（中英文），提供具体的解决建议，下载超时从 15 秒延长到 60 秒

- **代码格式化**
  应用统一的 Rust 和 TypeScript 代码格式化标准

#### 下载

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载最新版本

### v3.7.0 完整更新说明

> 从供应商切换器到 AI CLI 一体化管理平台

**提交数量**：从 v3.6.0 开始 85 个提交
**代码变更**：152 个文件，+18,104 / -3,732 行

### 新增功能

#### Gemini CLI 集成

完整支持 Google Gemini CLI，成为第三个支持的应用（Claude Code、Codex、Gemini）。

**核心能力**：

- **双文件配置** - 同时支持 `.env` 和 `settings.json` 格式
- **自动检测** - 自动检测 `GOOGLE_GEMINI_BASE_URL`、`GEMINI_MODEL` 等环境变量
- **完整 MCP 支持** - 为 Gemini 提供完整的 MCP 服务器管理
- **深度链接集成** - 通过 `ccswitch://` 协议导入配置
- **系统托盘** - 从托盘菜单快速切换

**供应商预设**：

- **Google Official** - 支持 OAuth 认证
- **PackyCode** - 合作伙伴集成
- **自定义** - 完全自定义支持

**技术实现**：

- 新增后端模块：`gemini_config.rs`（20KB）、`gemini_mcp.rs`
- 表单与环境编辑器同步
- 双文件原子写入

#### MCP v3.7.0 统一架构

MCP 管理系统完整重构，实现跨应用统一管理。

**架构改进**：

- **统一管理面板** - 单一界面管理 Claude/Codex/Gemini MCP 服务器
- **SSE 传输类型** - 新增 Server-Sent Events 支持
- **智能解析器** - 容错性 JSON 解析
- **格式修正** - 自动修复 Codex `[mcp_servers]` 格式
- **扩展字段** - 保留自定义 TOML 字段

**用户体验**：

- 表单中的默认应用选择
- JSON 格式化器用于验证
- 改进的视觉层次
- 更好的错误消息

**导入/导出**：

- 统一从三个应用导入
- 双向同步
- 状态保持

#### Claude Skills 管理系统

**约 2,000 行代码** - 完整的技能生态平台。

**GitHub 集成**：

- 从 GitHub 仓库自动扫描技能
- 预配置仓库：
  - `ComposioHQ/awesome-claude-skills` - 精选集合
  - `anthropics/skills` - Anthropic 官方技能
  - `cexll/myclaude` - 社区贡献
- 添加自定义仓库
- 子目录扫描支持（`skillsPath`）

**生命周期管理**：

- **发现** - 自动检测 `SKILL.md` 文件
- **安装** - 一键安装到 `~/.claude/skills/`
- **卸载** - 安全移除并跟踪状态
- **更新** - 检查更新（基础设施已就绪）

**技术架构**：

- **后端**：`SkillService`（526 行）集成 GitHub API
- **前端**：SkillsPage、SkillCard、RepoManager
- **UI 组件**：Badge、Card、Table（shadcn/ui）
- **状态**：持久化存储在 `config.json`
- **国际化**：47+ 个翻译键

#### Prompts 管理系统

**约 1,300 行代码** - 完整的系统提示词管理。

**多预设管理**：

- 创建无限数量的提示词预设
- 快速在预设间切换
- 同时只能激活一个提示词
- 活动提示词删除保护

**跨应用支持**：

- **Claude**：`~/.claude/CLAUDE.md`
- **Codex**：`~/.codex/AGENTS.md`
- **Gemini**：`~/.gemini/GEMINI.md`

**Markdown 编辑器**：

- 完整的 CodeMirror 6 集成
- 语法高亮
- 暗色主题（One Dark）
- 实时预览

**智能同步**：

- **自动写入** - 立即写入 live 文件
- **回填保护** - 切换前保存当前内容
- **自动导入** - 首次启动从 live 文件导入
- **修改保护** - 保留手动修改

**技术实现**：

- **后端**：`PromptService`（213 行）
- **前端**：PromptPanel（177）、PromptFormModal（160）、MarkdownEditor（159）
- **Hooks**：usePromptActions（152 行）
- **国际化**：41+ 个翻译键

#### 深度链接协议（ccswitch://）

通过 URL 方案一键导入供应商配置。

**功能特性**：

- 所有平台的协议注册
- 从共享链接导入
- 生命周期集成
- 安全验证

#### 环境变量冲突检测

智能检测和管理配置冲突。

**检测范围**：

- **Claude & Codex** - 跨应用冲突
- **Gemini** - 自动发现
- **MCP** - 服务器配置冲突

**管理功能**：

- 可视化冲突指示器
- 解决建议
- 覆盖警告
- 更改前备份

### 改进优化

#### 供应商管理

**新增预设**：

- **DouBaoSeed** - 字节跳动的豆包
- **Kimi For Coding** - 月之暗面
- **BaiLing** - 百灵 AI
- **移除 AnyRouter** - 避免误导

**增强功能**：

- Codex 和 Gemini 的模型名称配置
- 供应商备注字段用于组织
- 增强的预设元数据

#### 配置管理

- **通用配置迁移** - 从 localStorage 迁移到 `config.json`
- **统一持久化** - 跨所有应用共享
- **自动导入** - 首次启动配置导入
- **回填优先级** - 正确处理 live 文件

#### UI/UX 改进

**设计系统**：

- **macOS 原生** - 与系统对齐的配色方案
- **窗口居中** - 默认居中位置
- **视觉优化** - 改进的间距和层次

**交互优化**：

- **密码输入** - 修复 Edge/IE 显示按钮
- **URL 溢出** - 修复卡片溢出
- **错误复制** - 可复制到剪贴板的错误
- **托盘同步** - 实时拖放同步

### Bug 修复

#### 关键修复

- **用量脚本验证** - 边界检查
- **Gemini 验证** - 放宽约束
- **TOML 解析** - CJK 引号处理
- **MCP 字段** - 自定义字段保留
- **白屏** - FormLabel 崩溃修复

#### 稳定性

- **托盘安全** - 模式匹配替代 unwrap
- **错误隔离** - 托盘失败不阻塞操作
- **导入分类** - 正确的类别分配

#### UI 修复

- **模型占位符** - 移除误导性提示
- **Base URL** - 第三方供应商自动填充
- **拖拽排序** - 托盘菜单同步

### 技术改进

#### 架构

**MCP v3.7.0**：

- 移除遗留代码（约 1,000 行）
- 统一初始化结构
- 保持向后兼容性
- 全面的代码格式化

**平台兼容性**：

- Windows winreg API 修复（v0.52）
- 安全模式匹配（无 `unwrap()`）
- 跨平台托盘处理

#### 配置

**同步机制**：

- 跨所有应用的 MCP 同步
- Gemini 表单-编辑器同步
- 双文件读取（.env + settings.json）

**验证增强**：

- 输入边界检查
- TOML 引号规范化（CJK）
- 自定义字段保留
- 增强的错误消息

#### 代码质量

**类型安全**：

- 完整的 TypeScript 覆盖
- Rust 类型改进
- API 契约验证

**测试**：

- 简化的断言
- 更好的测试覆盖
- 集成测试更新

**依赖项**：

- Tauri 2.8.x
- Rust：`anyhow`、`zip`、`serde_yaml`、`tempfile`
- 前端：CodeMirror 6 包
- winreg 0.52（Windows）

### 技术统计

```
总体变更：
- 提交数：85
- 文件数：152 个文件变更
- 新增：+18,104 行
- 删除：-3,732 行

新增模块：
- Skills 管理：2,034 行（21 个文件）
- Prompts 管理：1,302 行（20 个文件）
- Gemini 集成：约 1,000 行
- MCP 重构：约 3,000 行重构

代码分布：
- 后端（Rust）：约 4,500 行新增
- 前端（React）：约 3,000 行新增
- 配置：约 1,500 行重构
- 测试：约 500 行
```

### 战略定位

#### 从工具到平台

v3.7.0 代表了 CC Switch 定位的转变：

| 方面     | v3.6           | v3.7.0                  |
| -------- | -------------- | ----------------------- |
| **身份** | 供应商切换器   | AI CLI 管理平台         |
| **范围** | 配置管理       | 生态系统管理            |
| **应用** | Claude + Codex | Claude + Codex + Gemini |
| **能力** | 切换配置       | 扩展能力（Skills）      |
| **定制** | 手动编辑       | 可视化管理（Prompts）   |
| **集成** | 孤立应用       | 统一管理（MCP）         |

#### AI CLI 管理六大支柱

1. **配置管理** - 供应商切换和管理
2. **能力扩展** - Skills 安装和生命周期
3. **行为定制** - 系统提示词预设
4. **生态集成** - 深度链接和共享
5. **多 AI 支持** - Claude/Codex/Gemini
6. **智能检测** - 冲突预防

### 下载与安装

#### 系统要求

- **Windows**：Windows 10+
- **macOS**：macOS 10.15（Catalina）+
- **Linux**：Ubuntu 22.04+ / Debian 11+ / Fedora 34+ / ArchLinux

#### 下载链接

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载：

- **Windows**：`CC-Switch-Windows.msi` 或 `-Portable.zip`
- **macOS**：`CC-Switch-macOS.tar.gz` 或 `.zip`
- **Linux**：`CC-Switch-Linux.AppImage` 或 `.deb`
- **ArchLinux**：`paru -S cc-switch-bin`

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

### 迁移说明

#### 从 v3.6.x 升级

**自动迁移** - 无需任何操作，配置完全兼容

#### 从 v3.1.x 或更早版本升级

**需要两步迁移**：

1. 首先升级到 v3.2.x（执行一次性迁移）
2. 然后升级到 v3.7.0

#### 新功能

- **Skills**：无需迁移，全新开始
- **Prompts**：首次启动时从 live 文件自动导入
- **Gemini**：需要单独安装 Gemini CLI
- **MCP v3.7.0**：与之前的配置向后兼容

### 致谢

#### 贡献者

感谢所有让这个版本成为可能的贡献者：

- [@YoVinchen](https://github.com/YoVinchen) - Skills & Prompts & Gemini 集成实现
- [@farion1231](https://github.com/farion1231) - 从开发沦为 issue 回复机
- 社区成员的测试和反馈

#### 赞助商

**智谱AI** - GLM CODING PLAN 赞助商
[使用此链接购买可享九折优惠](https://www.bigmodel.cn/claude-code?ic=RRVJPB5SII)

**PackyCode** - API 中转服务合作伙伴
[使用 "cc-switch" 优惠码注册享 9 折优惠](https://www.packyapi.com/register?aff=cc-switch)

**闪电说** - 本地优先的 AI 语音输入法
[免费下载](https://shandianshuo.cn) Mac/Win 双平台

### 反馈与支持

- **问题反馈**：[GitHub Issues](https://github.com/farion1231/cc-switch/issues)
- **讨论**：[GitHub Discussions](https://github.com/farion1231/cc-switch/discussions)
- **文档**：[README](../README_ZH.md)
- **更新日志**：[CHANGELOG.md](../CHANGELOG.md)

### 未来展望

**v3.8.0 预览**（暂定）：

- 本地代理功能

敬请期待更多更新！

**Happy Coding!**

---

## [3.7.0] - 2025-11-19

> 从供应商切换器到 AI CLI 一体化管理平台

### 概览

CC Switch v3.7.0 新增六大核心功能，新增超过 18,000 行代码。

**提交数量**：从 v3.6.0 开始 85 个提交
**代码变更**：152 个文件，+18,104 / -3,732 行

### 新增功能

#### Gemini CLI 集成

完整支持 Google Gemini CLI，成为第三个支持的应用（Claude Code、Codex、Gemini）。

**核心能力**：

- **双文件配置** - 同时支持 `.env` 和 `settings.json` 格式
- **自动检测** - 自动检测 `GOOGLE_GEMINI_BASE_URL`、`GEMINI_MODEL` 等环境变量
- **完整 MCP 支持** - 为 Gemini 提供完整的 MCP 服务器管理
- **深度链接集成** - 通过 `ccswitch://` 协议导入配置
- **系统托盘** - 从托盘菜单快速切换

**供应商预设**：

- **Google Official** - 支持 OAuth 认证
- **PackyCode** - 合作伙伴集成
- **自定义** - 完全自定义支持

**技术实现**：

- 新增后端模块：`gemini_config.rs`（20KB）、`gemini_mcp.rs`
- 表单与环境编辑器同步
- 双文件原子写入

#### MCP v3.7.0 统一架构

MCP 管理系统完整重构，实现跨应用统一管理。

**架构改进**：

- **统一管理面板** - 单一界面管理 Claude/Codex/Gemini MCP 服务器
- **SSE 传输类型** - 新增 Server-Sent Events 支持
- **智能解析器** - 容错性 JSON 解析
- **格式修正** - 自动修复 Codex `[mcp_servers]` 格式
- **扩展字段** - 保留自定义 TOML 字段

**用户体验**：

- 表单中的默认应用选择
- JSON 格式化器用于验证
- 改进的视觉层次
- 更好的错误消息

**导入/导出**：

- 统一从三个应用导入
- 双向同步
- 状态保持

#### Claude Skills 管理系统

**约 2,000 行代码** - 完整的技能生态平台。

**GitHub 集成**：

- 从 GitHub 仓库自动扫描技能
- 预配置仓库：
  - `ComposioHQ/awesome-claude-skills` - 精选集合
  - `anthropics/skills` - Anthropic 官方技能
  - `cexll/myclaude` - 社区贡献
- 添加自定义仓库
- 子目录扫描支持（`skillsPath`）

**生命周期管理**：

- **发现** - 自动检测 `SKILL.md` 文件
- **安装** - 一键安装到 `~/.claude/skills/`
- **卸载** - 安全移除并跟踪状态
- **更新** - 检查更新（基础设施已就绪）

**技术架构**：

- **后端**：`SkillService`（526 行）集成 GitHub API
- **前端**：SkillsPage、SkillCard、RepoManager
- **UI 组件**：Badge、Card、Table（shadcn/ui）
- **状态**：持久化存储在 `skills.json`
- **国际化**：47+ 个翻译键

#### Prompts 管理系统

**约 1,300 行代码** - 完整的系统提示词管理。

**多预设管理**：

- 创建无限数量的提示词预设
- 快速在预设间切换
- 同时只能激活一个提示词
- 活动提示词删除保护

**跨应用支持**：

- **Claude**：`~/.claude/CLAUDE.md`
- **Codex**：`~/.codex/AGENTS.md`
- **Gemini**：`~/.gemini/GEMINI.md`

**Markdown 编辑器**：

- 完整的 CodeMirror 6 集成
- 语法高亮
- 暗色主题（One Dark）
- 实时预览

**智能同步**：

- **自动写入** - 立即写入 live 文件
- **回填保护** - 切换前保存当前内容
- **自动导入** - 首次启动从 live 文件导入
- **修改保护** - 保留手动修改

**技术实现**：

- **后端**：`PromptService`（213 行）
- **前端**：PromptPanel（177）、PromptFormModal（160）、MarkdownEditor（159）
- **Hooks**：usePromptActions（152 行）
- **国际化**：41+ 个翻译键

#### 深度链接协议（ccswitch://）

通过 URL 方案一键导入供应商配置。

**功能特性**：

- 所有平台的协议注册
- 从共享链接导入
- 生命周期集成
- 安全验证

#### 环境变量冲突检测

智能检测和管理配置冲突。

**检测范围**：

- **Claude & Codex** - 跨应用冲突
- **Gemini** - 自动发现
- **MCP** - 服务器配置冲突

**管理功能**：

- 可视化冲突指示器
- 解决建议
- 覆盖警告
- 更改前备份

### 改进优化

#### 供应商管理

**新增预设**：

- **DouBaoSeed** - 字节跳动的豆包
- **Kimi For Coding** - 月之暗面
- **BaiLing** - 百灵 AI
- **移除 AnyRouter** - 避免误导

**增强功能**：

- Codex 和 Gemini 的模型名称配置
- 供应商备注字段用于组织
- 增强的预设元数据

#### 配置管理

- **通用配置迁移** - 从 localStorage 迁移到 `config.json`
- **统一持久化** - 跨所有应用共享
- **自动导入** - 首次启动配置导入
- **回填优先级** - 正确处理 live 文件

#### UI/UX 改进

**设计系统**：

- **macOS 原生** - 与系统对齐的配色方案
- **窗口居中** - 默认居中位置
- **视觉优化** - 改进的间距和层次

**交互优化**：

- **密码输入** - 修复 Edge/IE 显示按钮
- **URL 溢出** - 修复卡片溢出
- **错误复制** - 可复制到剪贴板的错误
- **托盘同步** - 实时拖放同步

### Bug 修复

#### 关键修复

- **用量脚本验证** - 边界检查
- **Gemini 验证** - 放宽约束
- **TOML 解析** - CJK 引号处理
- **MCP 字段** - 自定义字段保留
- **白屏** - FormLabel 崩溃修复

#### 稳定性

- **托盘安全** - 模式匹配替代 unwrap
- **错误隔离** - 托盘失败不阻塞操作
- **导入分类** - 正确的类别分配

#### UI 修复

- **模型占位符** - 移除误导性提示
- **Base URL** - 第三方供应商自动填充
- **拖拽排序** - 托盘菜单同步

### 技术改进

#### 架构

**MCP v3.7.0**：

- 移除遗留代码（约 1,000 行）
- 统一初始化结构
- 保持向后兼容性
- 全面的代码格式化

**平台兼容性**：

- Windows winreg API 修复（v0.52）
- 安全模式匹配（无 `unwrap()`）
- 跨平台托盘处理

#### 配置

**同步机制**：

- 跨所有应用的 MCP 同步
- Gemini 表单-编辑器同步
- 双文件读取（.env + settings.json）

**验证增强**：

- 输入边界检查
- TOML 引号规范化（CJK）
- 自定义字段保留
- 增强的错误消息

#### 代码质量

**类型安全**：

- 完整的 TypeScript 覆盖
- Rust 类型改进
- API 契约验证

**测试**：

- 简化的断言
- 更好的测试覆盖
- 集成测试更新

**依赖项**：

- Tauri 2.8.x
- Rust：`anyhow`、`zip`、`serde_yaml`、`tempfile`
- 前端：CodeMirror 6 包
- winreg 0.52（Windows）

### 技术统计

```
总体变更：
- 提交数：85
- 文件数：152 个文件变更
- 新增：+18,104 行
- 删除：-3,732 行

新增模块：
- Skills 管理：2,034 行（21 个文件）
- Prompts 管理：1,302 行（20 个文件）
- Gemini 集成：约 1,000 行
- MCP 重构：约 3,000 行重构

代码分布：
- 后端（Rust）：约 4,500 行新增
- 前端（React）：约 3,000 行新增
- 配置：约 1,500 行重构
- 测试：约 500 行
```

### 战略定位

#### 从工具到平台

v3.7.0 代表了 CC Switch 定位的转变：

| 方面     | v3.6           | v3.7.0                  |
| -------- | -------------- | ----------------------- |
| **身份** | 供应商切换器   | AI CLI 管理平台         |
| **范围** | 配置管理       | 生态系统管理            |
| **应用** | Claude + Codex | Claude + Codex + Gemini |
| **能力** | 切换配置       | 扩展能力（Skills）      |
| **定制** | 手动编辑       | 可视化管理（Prompts）   |
| **集成** | 孤立应用       | 统一管理（MCP）         |

#### AI CLI 管理六大支柱

1. **配置管理** - 供应商切换和管理
2. **能力扩展** - Skills 安装和生命周期
3. **行为定制** - 系统提示词预设
4. **生态集成** - 深度链接和共享
5. **多 AI 支持** - Claude/Codex/Gemini
6. **智能检测** - 冲突预防

### 下载与安装

#### 系统要求

- **Windows**：Windows 10+
- **macOS**：macOS 10.15（Catalina）+
- **Linux**：Ubuntu 22.04+ / Debian 11+ / Fedora 34+

#### 下载链接

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载：

- **Windows**：`CC-Switch-v3.7.0-Windows.msi` 或 `-Portable.zip`
- **macOS**：`CC-Switch-v3.7.0-macOS.tar.gz` 或 `.zip`
- **Linux**：`CC-Switch-v3.7.0-Linux.AppImage` 或 `.deb`

#### Homebrew（macOS）

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

更新：

```bash
brew upgrade --cask cc-switch
```

### 迁移说明

#### 从 v3.6.x 升级

**自动迁移** - 无需任何操作，配置完全兼容

#### 从 v3.1.x 或更早版本升级

**需要两步迁移**：

1. 首先升级到 v3.2.x（执行一次性迁移）
2. 然后升级到 v3.7.0

#### 新功能

- **Skills**：无需迁移，全新开始
- **Prompts**：首次启动时从 live 文件自动导入
- **Gemini**：需要单独安装 Gemini CLI
- **MCP v3.7.0**：与之前的配置向后兼容

### 致谢

#### 贡献者

感谢所有让这个版本成为可能的贡献者：

- [@YoVinchen](https://github.com/YoVinchen) - Skills & Prompts & Geimini 集成实现
- [@farion1231](https://github.com/farion1231) - 从开发沦为 issue 回复机
- 社区成员的测试和反馈

#### 赞助商

**Z.ai** - GLM CODING PLAN 赞助商
[通过此链接获得 10% 折扣](https://z.ai/subscribe?ic=8JVLJQFSKB)

**PackyCode** - API 中继服务合作伙伴
[使用 "cc-switch" 代码注册可享受 10% 折扣](https://www.packyapi.com/register?aff=cc-switch)

### 反馈与支持

- **问题反馈**：[GitHub Issues](https://github.com/farion1231/cc-switch/issues)
- **讨论**：[GitHub Discussions](https://github.com/farion1231/cc-switch/discussions)
- **文档**：[README](../README_ZH.md)
- **更新日志**：[CHANGELOG.md](../CHANGELOG.md)

### 未来展望

**v3.8.0 预览**（暂定）：

- 本地代理功能

敬请期待更多更新！

---

## [3.6.1] - 1970-01-01

> 稳定性提升与用户体验优化（基于 v3.6.0）

### 📦 v3.6.1 新增内容 (2025-11-10)

本次更新主要聚焦于**用户体验优化**和**配置解析健壮性**，修复了多个关键 Bug，并增强了用量查询系统。

#### ✨ 新增功能

##### 用量查询系统增强

- **凭证解耦** - 用量查询可使用独立的 API Key 和 Base URL，不再依赖供应商配置
  - 支持不同的查询端点和认证方式
  - 根据模板类型自动显示对应的凭证输入框
  - General 模板：API Key + Base URL
  - NewAPI 模板：Base URL + Access Token + User ID
  - Custom 模板：完全自定义
- **UI 组件升级** - 使用 shadcn/ui Switch 替代原生 checkbox，体验更现代
- **表单统一化** - 统一使用 shadcn/ui 输入组件，样式与应用保持一致
- **密码显示切换** - 添加查看/隐藏密码功能（API Key、Access Token）

##### 表单验证基础设施

- **通用 Schema 库** - 新增 JSON/TOML 通用验证器，减少重复代码
  - `jsonConfigSchema`：通用 JSON 对象验证器
  - `tomlConfigSchema`：通用 TOML 格式验证器
  - `mcpJsonConfigSchema`：MCP 专用 JSON 验证器
- **MCP 条件字段验证** - 严格的类型检查
  - stdio 类型强制要求 `command` 字段
  - http 类型强制要求 `url` 字段

##### 合作伙伴集成

- **PackyCode** - 新增官方合作伙伴
  - 添加到 Claude 和 Codex 供应商预设
  - 支持 10% 折扣优惠（促销信息集成）
  - 新增 Logo 和合作伙伴标识

#### 🔧 改进优化

##### 用户体验

- **拖拽排序同步** - 托盘菜单顺序实时同步拖拽排序结果
- **错误通知增强** - 切换供应商失败时显示可复制的错误信息
- **移除误导性占位符** - 删除模型输入框的示例文本，避免用户混淆
- **Base URL 自动填充** - 所有非官方供应商类别自动填充 Base URL 输入框

##### 配置解析

- **中文引号规范化** - 自动处理 IME 输入的全角引号，防止 TOML 解析错误
  - 支持中文引号（" " ' '）自动转换为 ASCII 引号
  - 在 TOML 输入处理器中应用
  - Textarea 组件禁用浏览器自动纠正
- **自定义字段保留** - 编辑 Codex MCP TOML 配置时保留未知字段
  - 支持 timeout_ms、retry_count 等扩展字段
  - 向前兼容未来的 MCP 协议扩展

#### 🐛 Bug 修复

##### 关键修复

- **修复用量脚本面板白屏崩溃** - FormLabel 组件缺少 FormField context 导致整个应用崩溃
  - 替换为独立的 Label 组件
  - 根本原因：FormLabel 内部调用 useFormField() hook 需要 FormFieldContext
- **修复中文输入法引号解析失败** - IME 输入的全角引号导致 TOML 解析错误
  - 新增 textNormalization 工具函数
  - 在解析前自动规范化引号
- **修复拖拽排序托盘不同步** (#179) - 拖拽排序后托盘菜单顺序未更新
  - 在排序完成后自动调用 updateTrayMenu
  - 确保 UI 和托盘菜单保持一致
- **修复 MCP 自定义字段丢失** - 编辑 Codex MCP 配置时自定义字段被静默丢弃
  - 使用 spread 操作符保留所有字段
  - normalizeServerConfig 中保留未知字段

##### 稳定性改进

- **错误隔离** - 托盘菜单更新失败不再影响主操作流程
  - 将托盘更新错误与主操作解耦
  - 主操作成功但托盘更新失败时给出警告
- **安全模式匹配** - 替换 `unwrap()` 为安全的 pattern matching
  - 避免 panic 导致应用崩溃
  - 托盘菜单事件处理使用 match 模式
- **导入配置分类** - 从默认配置导入时自动设置 category 为 `custom`
  - 避免导入的配置被误认为官方预设
  - 提供更清晰的配置来源标识

#### 📊 技术统计

```
提交数: 17 commits
代码变更: 31 个文件
  - 新增: 1,163 行
  - 删除: 811 行
  - 净增长: +352 行
贡献者: Jason (16), ZyphrZero (1)
```

**按模块分类**：
- UI/用户界面：3 commits
- 用量查询系统：3 commits
- 配置解析：2 commits
- 表单验证：1 commit
- 其他改进：8 commits

#### 📥 安装方式

##### macOS

**通过 Homebrew 安装（推荐）：**

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

**手动下载：**

- 从下方 [Assets](#assets) 下载 `CC-Switch-v3.6.1-macOS.zip`

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告。请前往"系统设置" → "隐私与安全性" → 点击"仍要打开"

##### Windows

- **安装包**：`CC-Switch-v3.6.1-Windows.msi`
- **便携版**：`CC-Switch-v3.6.1-Windows-Portable.zip`

##### Linux

- **AppImage**：`CC-Switch-v3.6.1-Linux.AppImage`
- **Debian**：`CC-Switch-v3.6.1-Linux.deb`

#### 📚 文档

- [中文文档](https://github.com/farion1231/cc-switch/blob/main/README_ZH.md)
- [English Documentation](https://github.com/farion1231/cc-switch/blob/main/README.md)
- [完整更新日志](https://github.com/farion1231/cc-switch/blob/main/CHANGELOG.md)

#### 🙏 致谢

特别感谢：
- **智谱 AI** - 通过 GLM CODING PLAN 赞助本项目
- **PackyCode** - 新加入的官方合作伙伴
- **ZyphrZero** - 贡献托盘菜单同步修复 (#179)

**完整变更记录**: https://github.com/farion1231/cc-switch/compare/v3.6.0...v3.6.1

### 📜 v3.6.0 完整功能回顾

> 以下内容来自 v3.6.0 (2025-11-07)，帮助您了解完整的功能集

<details>
<summary><b>点击展开 v3.6.0 的详细内容 →</b></summary>

### 新增功能

#### 编辑模式与供应商管理

- **供应商复制功能** - 一键快速复制现有供应商配置，轻松创建变体配置
- **手动排序功能** - 通过拖拽对供应商进行重新排序，带有视觉推送效果动画
- **编辑模式切换** - 显示/隐藏拖拽手柄，优化编辑体验

#### 自定义端点管理

- **多端点配置** - 支持聚合类供应商的多 API 端点配置
- **端点输入可见性** - 为所有非官方供应商自动显示端点字段

#### 自定义配置目录（云同步）

- **自定义存储位置** - 自定义 CC Switch 的配置存储目录
- **云同步支持** - 指定到云同步文件夹（Dropbox、OneDrive、iCloud Drive、坚果云等）即可实现跨设备配置自动同步
- **独立管理** - 通过 Tauri Store 管理，更好的隔离性和可靠性

#### 使用量查询增强

- **自动刷新间隔** - 配置定时自动使用量查询，支持自定义间隔时间
- **测试脚本 API** - 在执行前验证 JavaScript 使用量查询脚本
- **增强模板系统** - 自定义空白模板，支持 access token 和 user ID 参数

#### 配置目录切换（WSL 支持）

- **目录变更自动同步** - 切换 Claude/Codex 配置目录（如 WSL 环境）时，自动同步当前供应商到新目录，无需手动操作
- **后置同步工具** - 统一的 `postChangeSync.ts` 工具，优雅处理错误而不阻塞主流程
- **导入配置自动同步** - 配置导入后自动同步，确保立即生效
- **智能冲突解决** - 区分"完全成功"和"部分成功"状态，提供精确的用户反馈

#### 配置编辑器改进

- **JSON 格式化按钮** - 配置编辑器中一键 JSON 格式化
- **实时 TOML 验证** - Codex 配置的实时语法验证，带有错误高亮

#### 编辑时加载 Live 配置

- **保护手动修改** - 编辑当前激活的供应商时，优先显示来自 live 文件的实际生效配置
- **双源策略** - 活动供应商自动从 live 配置加载，非活动供应商从 SSOT 加载

#### Claude 配置数据结构增强

- **细粒度模型配置** - 从双键系统升级到四键系统，以匹配官方最新数据结构
  - 新增字段：`ANTHROPIC_DEFAULT_HAIKU_MODEL`、`ANTHROPIC_DEFAULT_SONNET_MODEL`、`ANTHROPIC_DEFAULT_OPUS_MODEL`、`ANTHROPIC_MODEL`
  - 替换旧版 `ANTHROPIC_SMALL_FAST_MODEL`，支持自动迁移
  - 后端在首次读写时自动规范化旧配置，带有智能回退链
  - UI 从 2 个模型输入字段扩展到 4 个，具有智能默认值
- **ANTHROPIC_API_KEY 支持** - 供应商现可使用 `ANTHROPIC_API_KEY` 字段（除 `ANTHROPIC_AUTH_TOKEN` 外）
- **模板变量系统** - 支持动态配置替换（如 KAT-Coder 的 `ENDPOINT_ID` 参数）
- **端点候选列表** - 预定义端点列表，用于速度测试和端点管理
- **视觉主题配置** - 供应商卡片自定义图标和颜色

#### 供应商模型更新

- **Kimi k2** - 更新到最新的 `kimi-k2-thinking` 模型

#### 新增供应商预设

新增 5 个供应商预设：

- **DMXAPI** - 多模型聚合服务
- **Azure Codex** - 微软 Azure OpenAI 端点
- **AnyRouter** - API 路由服务
- **AiHubMix** - AI 模型集合
- **MiniMax** - 国产 AI 模型提供商

#### 合作伙伴推广机制

- 支持生态合作伙伴推广（智谱 GLM Z.ai）
- README 中集成赞助商横幅

### 改进优化

#### 配置与同步

- **统一错误处理** - 后端全面使用 AppError 与国际化错误消息
- **修复 apiKeyUrl 优先级** - 修正 API key URL 解析的优先级顺序
- **修复 MCP 同步问题** - 解决同步到另一端功能失效的问题
- **导入配置同步** - 修复配置导入后的同步问题
- **配置错误处理** - 配置错误时强制退出，防止静默回退和数据丢失

#### UI/UX 增强

- **独特的供应商图标** - 每个供应商卡片现在都有独特的图标和颜色识别
- **统一边框系统** - 所有组件采用一致的边框设计
- **拖拽交互** - 推送效果动画和改进的拖拽手柄图标
- **增强视觉反馈** - 更好的当前供应商视觉指示
- **对话框标准化** - 统一的对话框尺寸和布局一致性
- **表单改进** - 优化模型占位符，简化供应商提示，分类特定提示
- **使用量内联显示** - 使用量信息移至启用按钮旁边，更好地利用空间

#### 完整国际化

- **错误消息国际化** - 所有后端错误消息支持中英文
- **托盘菜单国际化** - 系统托盘菜单完全国际化
- **UI 组件国际化** - 所有面向用户的组件 100% 覆盖

### Bug 修复

#### 配置管理

- 修复 `apiKeyUrl` 优先级问题
- 修复 MCP 同步到另一端功能失效
- 修复配置导入后的同步问题
- 修复 Codex API Key 自动同步
- 修复端点速度测试功能
- 修复供应商复制插入位置（现在插入到原供应商旁边）
- 修复编辑模式下自定义端点保留问题
- 防止配置错误时的静默回退和数据丢失

#### 使用量查询

- 修复自动查询间隔时间问题
- 确保刷新按钮点击时显示加载动画

#### UI 问题

- 修复名称冲突错误（`get_init_error` 命令）
- 修复保存成功后语言设置回滚
- 修复语言切换状态重置（依赖循环）
- 修复编辑模式按钮对齐

#### 启动问题

- 配置错误时强制退出（不再静默回退）
- 消除导致初始化错误的代码重复

### 架构重构

#### 后端（Rust）- 5 阶段重构

1. **阶段 1**：统一错误处理（`AppError` + 国际化错误消息）
2. **阶段 2**：命令层按领域拆分（`commands/{provider,mcp,config,settings,plugin,misc}.rs`）
3. **阶段 3**：集成测试和事务机制（配置快照 + 失败回滚）
4. **阶段 4**：提取 Service 层（`services/{provider,mcp,config,speedtest}.rs`）
5. **阶段 5**：并发优化（`RwLock` 替代 `Mutex`，作用域 guard 避免死锁）

#### 前端（React + TypeScript）- 4 阶段重构

1. **阶段 1**：测试基础设施（vitest + MSW + @testing-library/react）
2. **阶段 2**：提取自定义 hooks（`useProviderActions`、`useMcpActions`、`useSettings`、`useImportExport` 等）
3. **阶段 3**：组件拆分和业务逻辑提取
4. **阶段 4**：代码清理和格式化统一

#### 测试体系

- **Hooks 单元测试** - 所有自定义 hooks 100% 覆盖
- **集成测试** - 关键流程覆盖（App、SettingsDialog、MCP 面板）
- **MSW 模拟** - 后端 API 模拟确保测试独立性
- **测试基础设施** - vitest + MSW + @testing-library/react

#### 代码质量

- **统一参数格式** - 所有 Tauri 命令迁移到 camelCase（Tauri 2 规范）
- **语义清晰** - `AppType` 重命名为 `AppId` 以获得更好的语义
- **集中解析** - 使用 `FromStr` trait 统一 `app` 参数解析
- **DRY 违规清理** - 消除整个代码库中的代码重复
- **死代码移除** - 移除未使用的 `missing_param` 辅助函数、废弃的 `tauri-api.ts`、冗余的 `KimiModelSelector`

### 内部优化（用户无感知）

#### 移除遗留迁移逻辑

v3.6.0 移除了 v1 配置自动迁移和副本文件扫描逻辑：

- **影响**：提升启动性能，代码更简洁
- **兼容性**：v2 格式配置完全兼容，无需任何操作
- **注意**：从 v3.1.0 或更早版本升级的用户，请先升级到 v3.2.x 或 v3.5.x 进行一次性迁移，然后再升级到 v3.6.0

#### 命令参数标准化

后端统一使用 `app` 参数（取值：`claude` 或 `codex`）：

- **影响**：代码更规范，错误提示更友好
- **兼容性**：前端已完全适配，用户无需关心此变更

### 依赖更新

- 更新到 **Tauri 2.8.x**
- 更新到 **TailwindCSS 4.x**
- 更新到 **TanStack Query v5.90.x**
- 保持 **React 18.2.x** 和 **TypeScript 5.3.x**

</details>

### 🌟 关于 CC Switch

CC Switch 是一个跨平台桌面应用，用于管理和切换 Claude Code 与 Codex 的不同供应商配置。基于 Tauri 2.0 + React 18 + TypeScript 构建，支持 Windows、macOS、Linux。

**核心特性**：
- 🔄 一键切换多个 AI 供应商
- 📦 支持 Claude Code 和 Codex 双应用
- 🎨 现代化 UI，完整的中英文国际化
- 🔐 本地存储，数据安全可靠
- ☁️ 支持云同步配置
- 🧩 MCP 服务器统一管理

**项目地址**: https://github.com/farion1231/cc-switch

---

## [3.6.0] - 2025-11-07

> 全栈架构重构，增强配置同步与数据保护

### 新增功能

#### 编辑模式与供应商管理

- **供应商复制功能** - 一键快速复制现有供应商配置，轻松创建变体配置
- **手动排序功能** - 通过拖拽对供应商进行重新排序，带有视觉推送效果动画
- **编辑模式切换** - 显示/隐藏拖拽手柄，优化编辑体验

#### 自定义端点管理

- **多端点配置** - 支持聚合类供应商的多 API 端点配置
- **端点输入可见性** - 为所有非官方供应商自动显示端点字段

#### 自定义配置目录（云同步）

- **自定义存储位置** - 自定义 CC Switch 的配置存储目录
- **云同步支持** - 指定到云同步文件夹（Dropbox、OneDrive、iCloud Drive、坚果云等）即可实现跨设备配置自动同步
- **独立管理** - 通过 Tauri Store 管理，更好的隔离性和可靠性

#### 使用量查询增强

- **自动刷新间隔** - 配置定时自动使用量查询，支持自定义间隔时间
- **测试脚本 API** - 在执行前验证 JavaScript 使用量查询脚本
- **增强模板系统** - 自定义空白模板，支持 access token 和 user ID 参数

#### 配置目录切换（WSL 支持）

- **目录变更自动同步** - 切换 Claude/Codex 配置目录（如 WSL 环境）时，自动同步当前供应商到新目录，无需手动操作
- **后置同步工具** - 统一的 `postChangeSync.ts` 工具，优雅处理错误而不阻塞主流程
- **导入配置自动同步** - 配置导入后自动同步，确保立即生效
- **智能冲突解决** - 区分"完全成功"和"部分成功"状态，提供精确的用户反馈

#### 配置编辑器改进

- **JSON 格式化按钮** - 配置编辑器中一键 JSON 格式化
- **实时 TOML 验证** - Codex 配置的实时语法验证，带有错误高亮

#### 编辑时加载 Live 配置

- **保护手动修改** - 编辑当前激活的供应商时，优先显示来自 live 文件的实际生效配置
- **双源策略** - 活动供应商自动从 live 配置加载，非活动供应商从 SSOT 加载

#### Claude 配置数据结构增强

- **细粒度模型配置** - 从双键系统升级到四键系统，以匹配官方最新数据结构
  - 新增字段：`ANTHROPIC_DEFAULT_HAIKU_MODEL`、`ANTHROPIC_DEFAULT_SONNET_MODEL`、`ANTHROPIC_DEFAULT_OPUS_MODEL`、`ANTHROPIC_MODEL`
  - 替换旧版 `ANTHROPIC_SMALL_FAST_MODEL`，支持自动迁移
  - 后端在首次读写时自动规范化旧配置，带有智能回退链
  - UI 从 2 个模型输入字段扩展到 4 个，具有智能默认值
- **ANTHROPIC_API_KEY 支持** - 供应商现可使用 `ANTHROPIC_API_KEY` 字段（除 `ANTHROPIC_AUTH_TOKEN` 外）
- **模板变量系统** - 支持动态配置替换（如 KAT-Coder 的 `ENDPOINT_ID` 参数）
- **端点候选列表** - 预定义端点列表，用于速度测试和端点管理
- **视觉主题配置** - 供应商卡片自定义图标和颜色

#### 供应商模型更新

- **Kimi k2** - 更新到最新的 `kimi-k2-thinking` 模型

#### 新增供应商预设

新增 5 个供应商预设：

- **DMXAPI** - 多模型聚合服务
- **Azure Codex** - 微软 Azure OpenAI 端点
- **AnyRouter** - API 路由服务
- **AiHubMix** - AI 模型集合
- **MiniMax** - 国产 AI 模型提供商

#### 合作伙伴推广机制

- 支持生态合作伙伴推广（智谱 GLM Z.ai）
- README 中集成赞助商横幅

### 改进优化

#### 配置与同步

- **统一错误处理** - 后端全面使用 AppError 与国际化错误消息
- **修复 apiKeyUrl 优先级** - 修正 API key URL 解析的优先级顺序
- **修复 MCP 同步问题** - 解决同步到另一端功能失效的问题
- **导入配置同步** - 修复配置导入后的同步问题
- **配置错误处理** - 配置错误时强制退出，防止静默回退和数据丢失

#### UI/UX 增强

- **独特的供应商图标** - 每个供应商卡片现在都有独特的图标和颜色识别
- **统一边框系统** - 所有组件采用一致的边框设计
- **拖拽交互** - 推送效果动画和改进的拖拽手柄图标
- **增强视觉反馈** - 更好的当前供应商视觉指示
- **对话框标准化** - 统一的对话框尺寸和布局一致性
- **表单改进** - 优化模型占位符，简化供应商提示，分类特定提示
- **使用量内联显示** - 使用量信息移至启用按钮旁边，更好地利用空间

#### 完整国际化

- **错误消息国际化** - 所有后端错误消息支持中英文
- **托盘菜单国际化** - 系统托盘菜单完全国际化
- **UI 组件国际化** - 所有面向用户的组件 100% 覆盖

### Bug 修复

#### 配置管理

- 修复 `apiKeyUrl` 优先级问题
- 修复 MCP 同步到另一端功能失效
- 修复配置导入后的同步问题
- 修复 Codex API Key 自动同步
- 修复端点速度测试功能
- 修复供应商复制插入位置（现在插入到原供应商旁边）
- 修复编辑模式下自定义端点保留问题
- 防止配置错误时的静默回退和数据丢失

#### 使用量查询

- 修复自动查询间隔时间问题
- 确保刷新按钮点击时显示加载动画

#### UI 问题

- 修复名称冲突错误（`get_init_error` 命令）
- 修复保存成功后语言设置回滚
- 修复语言切换状态重置（依赖循环）
- 修复编辑模式按钮对齐

#### 启动问题

- 配置错误时强制退出（不再静默回退）
- 消除导致初始化错误的代码重复

### 架构重构

#### 后端（Rust）- 5 阶段重构

1. **阶段 1**：统一错误处理（`AppError` + 国际化错误消息）
2. **阶段 2**：命令层按领域拆分（`commands/{provider,mcp,config,settings,plugin,misc}.rs`）
3. **阶段 3**：集成测试和事务机制（配置快照 + 失败回滚）
4. **阶段 4**：提取 Service 层（`services/{provider,mcp,config,speedtest}.rs`）
5. **阶段 5**：并发优化（`RwLock` 替代 `Mutex`，作用域 guard 避免死锁）

#### 前端（React + TypeScript）- 4 阶段重构

1. **阶段 1**：测试基础设施（vitest + MSW + @testing-library/react）
2. **阶段 2**：提取自定义 hooks（`useProviderActions`、`useMcpActions`、`useSettings`、`useImportExport` 等）
3. **阶段 3**：组件拆分和业务逻辑提取
4. **阶段 4**：代码清理和格式化统一

#### 测试体系

- **Hooks 单元测试** - 所有自定义 hooks 100% 覆盖
- **集成测试** - 关键流程覆盖（App、SettingsDialog、MCP 面板）
- **MSW 模拟** - 后端 API 模拟确保测试独立性
- **测试基础设施** - vitest + MSW + @testing-library/react

#### 代码质量

- **统一参数格式** - 所有 Tauri 命令迁移到 camelCase（Tauri 2 规范）
- **语义清晰** - `AppType` 重命名为 `AppId` 以获得更好的语义
- **集中解析** - 使用 `FromStr` trait 统一 `app` 参数解析
- **DRY 违规清理** - 消除整个代码库中的代码重复
- **死代码移除** - 移除未使用的 `missing_param` 辅助函数、废弃的 `tauri-api.ts`、冗余的 `KimiModelSelector`

### 内部优化（用户无感知）

#### 移除遗留迁移逻辑

v3.6.0 移除了 v1 配置自动迁移和副本文件扫描逻辑：

- **影响**：提升启动性能，代码更简洁
- **兼容性**：v2 格式配置完全兼容，无需任何操作
- **注意**：从 v3.1.0 或更早版本升级的用户，请先升级到 v3.2.x 或 v3.5.x 进行一次性迁移，然后再升级到 v3.6.0

#### 命令参数标准化

后端统一使用 `app` 参数（取值：`claude` 或 `codex`）：

- **影响**：代码更规范，错误提示更友好
- **兼容性**：前端已完全适配，用户无需关心此变更

### 依赖更新

- 更新到 **Tauri 2.8.x**
- 更新到 **TailwindCSS 4.x**
- 更新到 **TanStack Query v5.90.x**
- 保持 **React 18.2.x** 和 **TypeScript 5.3.x**

### 安装方式

#### macOS

**通过 Homebrew 安装（推荐）：**

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

**手动下载：**

- 从下方 [Assets](#assets) 下载 `CC-Switch-v3.6.0-macOS.zip`

> **注意**：由于作者没有苹果开发者账号，首次打开可能出现"未知开发者"警告。请前往"系统设置" → "隐私与安全性" → 点击"仍要打开"

#### Windows

- **安装包**：`CC-Switch-v3.6.0-Windows.msi`
- **便携版**：`CC-Switch-v3.6.0-Windows-Portable.zip`

#### Linux

- **AppImage**：`CC-Switch-v3.6.0-Linux.AppImage`
- **Debian**：`CC-Switch-v3.6.0-Linux.deb`

### 文档

- [中文文档](https://github.com/farion1231/cc-switch/blob/main/README_ZH.md)
- [English Documentation](https://github.com/farion1231/cc-switch/blob/main/README.md)
- [完整更新日志](https://github.com/farion1231/cc-switch/blob/main/CHANGELOG.md)

### 致谢

特别感谢**智谱 AI** 通过 GLM CODING PLAN 赞助本项目！

**完整变更记录**: https://github.com/farion1231/cc-switch/compare/v3.5.1...v3.6.0
