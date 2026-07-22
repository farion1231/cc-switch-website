# 更新日志

CC Switch 的重要版本更新记录。

## [3.18.0] - 2026-07-21

> 这一版你可以做两件全新的事：**把 xAI 的 Grok CLI（Grok Build）交给 CC Switch 管理**——它成为第八个受管应用，供应商一键切换、MCP / Skills 同步、代理接管与用量统计一应俱全；以及**把 Grok 接进 Claude Code、Claude Desktop 和 Codex**——既可以直接用 xAI Grok 账号登录（设备码授权、无需 API Key，跑你的 Grok 订阅，Codex 侧自带严格网关兼容层，codex 0.142+ 也能跑通），也可以用 xAI API Key 接入（Codex 有原生 Responses 直连预设，Claude Code 可走本地路由）。同样重要的是一波修复：v3.17.0 引入的 **Codex 用量双计已修**，升级后自动重建数据，看板数字恢复真实；**codex 0.144.5+ 因模型目录无法启动的问题已修**；Windows 上切换供应商不再闪黑窗、不再卡住界面。诊断日志也从「每次启动清空」变为跨重启持久保留、按大小轮转、全面脱敏，界面崩溃会落盘留证而不再只剩一片白屏。

### 重点内容：你现在可以

- **管理 Grok Build（xAI 的 Grok CLI）**：像管理 Claude Code / Codex 一样添加、导入、一键切换 Grok Build 的供应商；MCP 服务器与 Skills 双向同步、提示词首启自动导入、会话管理与用量看板全覆盖；还可以走本地代理接管，获得独立的路由、failover 与计费。
- **把 Grok 接进 Claude Code / Claude Desktop / Codex——账号登录与 API Key 双路径**：订阅用户在「设置 → OAuth 授权中心」用设备码完成 xAI 账号登录（支持多账号），三个客户端直接跑你的 Grok 订阅、全程无需 API Key；按量付费用户则用 xAI API Key 接入——Codex 有现成的「xAI (Grok)」预设原生直连 `api.x.ai`，Claude Code 可按本版新攻略走本地路由接入。默认模型均为 `grok-4.5`。
- **把 Codex 的用量数字修回真实值**：v3.17.0 的 fork / 子代理双计问题已在解析器层根治；升级后首次启动自动备份并重建 Codex 用量，用量页里也新增了手动「重建 Codex 用量」按钮。注意首次启动时历史记录是**逐渐**修复的——看板数字先变少、再随后台重导逐步回填，属预期行为（见「升级提醒」）。
- **放心升级 codex CLI**：codex 0.144.5 起严格解析模型目录导致的「无法启动」已修复，生成目录会自动补齐解析器必需字段。
- **在 Windows 上顺滑切换**：切换供应商 / 开关接管不再闪过黑色控制台窗口，也不再卡住界面约 2 秒（卡顿修复对全平台生效）。
- **更放心地排查与分享日志**：诊断日志跨重启保留（20 MB × 4 轮转）、所有出口统一脱敏——URL 凭据、请求响应体、敏感请求头都不会再落盘；界面崩溃有错误卡片和重载按钮，错误详情写入磁盘。
- **多轮重推理、并行工具调用不再翻车**：Responses↔Chat 桥修复了推理内容错挂、并行工具调用 ID 丢失 / 乱序、工具 schema 为 null 被严格上游整单拒绝三类问题。
- **用上 Kimi K3**：Codex / Hermes / OpenClaw / OpenCode 的 Kimi 开放平台预设加入 K3（1M 上下文），内置定价同步入库，用量不再显示 $0。

---

### 使用攻略

本版新能力主要落在供应商预设、「设置 → OAuth 授权中心」与用量看板里，建议结合以下文档了解：

- **[xAI Grok 账号登录（设置 → OAuth 授权中心）](/zh/docs?section=getting-started&item=settings)**：设备码登录流程、多账号管理与集成边界说明；使用前请先阅读下方「风险提示」中的客户端身份披露。
- **[在 Claude Code 中使用 GPT 模型（本地路由攻略）](/zh/tutorials/claude-codex-routing-guide)**：本版新增的分步攻略，现已中 / 英 / 日三语齐全。Claude Code 始终对本地 `/v1/messages` 路由说 Anthropic Messages 协议，由本地代理把每个请求转换成上游的 Responses 协议——网关 API Key、xAI 这类原生 Responses 端点，或 ChatGPT 订阅的 Codex 服务都适用。
- **[在 Codex 中使用 Claude 模型（本地路由攻略）](/zh/tutorials/codex-claude-routing-guide)**：本版新增的三语分步攻略，配合 v3.17.0 的「原生 Anthropic Messages 上游」功能，把 Codex 接到任何只提供 `/v1/messages` 的 Claude 系网关。
- **[用量统计](/zh/docs?section=proxy&item=usage)**：了解用量看板的数据来源与统计口径。本版修复用量双计并新增「重建 Codex 用量」维护操作。

---

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

---

### 概览

CC Switch v3.18.0 的两条主线都围绕 xAI Grok。第一条是 **Grok Build 加入受管应用**：xAI 的 Grok CLI（live 配置 `~/.grok/config.toml`）成为与 Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes 并列的第八个受管应用——供应商添加 / 导入 / 一键切换、MCP 与 Skills 双向同步、深链导入、独立预设列表，以及带专属路由命名空间的代理接管；配套的「Grok 官方」条目支持官方登录态识别与导入，CC Switch 绝不触碰官方凭据。第二条是 **xAI Grok 账号 OAuth 登录**：设备码授权替代 API Key，本地代理逐请求注入访问令牌，Claude Code / Claude Desktop 侧完成 Anthropic Messages → xAI Responses 转换；Codex 侧则提供受管 OAuth 预设并自带兼容层——codex 0.142+ 发出的 ChatGPT 后端私有形态（namespace 工具声明、私有字段）会被确定性地展平与剥离，严格解析的 xAI 网关不再返回 422；API Key 用户则另有一条「xAI (Grok)」原生 Responses 直连预设，不经任何转换。

围绕正确性，本版集中修复了 **v3.17.0 的 Codex 用量双计**：fork / 子代理日志开头对父线程历史的重放不再被当作新用量导入（解析器改为只认显式父身份 + 令牌签名对齐），升级后自动执行一次性用量重建（schema v16），用量页新增手动重建按钮；代理侧用量记录改为幂等（同一响应重放不再堆叠重复行），大量会话导入时用量页不再卡死。**Codex 转换层**另有四处修复：工具 schema 归一为 object 类型、推理内容跨轮前向附挂、流式并行工具调用保 ID 保序、生成的模型目录补齐 codex 0.144.5+ 必需字段。诊断体系也走向成熟：日志跨重启持久、按大小轮转、所有出口脱敏，界面崩溃被错误边界捕获并落盘。此外还有 Kimi K3 预设与定价、OpenClaw 预设成本修正、SudoCode.us 回归、托盘首启语言跟随系统等一批改进。

**发布日期**：2026-07-21

**更新规模**：52 commits | 217 files changed | +21,452 / -6,285 lines

---

### 新功能

#### Grok Build：第八个受管应用

xAI 的 Grok CLI（Grok Build，live 配置 `~/.grok/config.toml`）现在是 CC Switch 的一等公民：供应商添加 / 导入 / 一键切换（切换后提示重启 Grok Build 生效）、应用显隐与配置目录覆盖设置、会话管理与用量看板覆盖、提示词首启自动导入、`ccswitch://` 深链导入供应商，以及本地代理接管——拥有专属的 `/grokbuild/v1/responses` 路由命名空间、独立的 failover 队列与按应用代理设置；转发复用 Codex 的 Responses 通路，但绝不与 Codex 共享供应商命名空间或熔断状态。

MCP 服务器与 Grok 的 `[mcp_servers]` 表双向同步，方言差异已被抹平：Grok 靠 `command` / `url` 推断传输类型且用 `headers` 字段，导出时会剥掉显式 `type` 并把 `http_headers` 重命名为 `headers`，导入时反向推断回来。Skills 也获得 Grok Build 启用开关。

预设方面刻意**没有**借用 Codex 列表（早期版本曾把国产直连供应商和 Codex 默认模型漏进 Grok 表单），而是独立整理了一份：只收录真正承载 Grok 模型的聚合与中转站，默认模型归一为 `grok-4.5`（命名空间路由站为 `x-ai/grok-4.5`）。工具面板安装 Grok 优先走 xAI 官方安装器（`x.ai/cli/install.sh` / `install.ps1`），npm 包 `@xai-official/grok` 作为兜底；被确认是原生安装的走 `grok update` 自更新，npm 安装保持 npm 锚定更新——自更新门控在「确定检测为原生」上，绝不会误伤另一种安装。四语界面文案同步就位。（[#5453](https://github.com/farion1231/cc-switch/pull/5453)）

#### Grok 官方登录：识别、导入与保护

新增「Grok 官方」供应商条目，对应 Grok CLI 自带的 xAI OAuth 登录：选中它会隐藏连接字段并写入一个空的 `~/.grok/config.toml`，CC Switch 从不存储、也从不触碰官方凭据。live 配置的读取、备份与官方态写入改用仅语法级的 TOML 校验，官方登录态（空配置）可以正常往返；Grok 处于官方登录态时「从 live 导入」会得到「已设 Grok 官方为当前」而不是报错，与 Codex 行为一致。官方态识别刻意只接线到手动导入命令——启动时的自动导入器仍会拒绝官方态配置，所以你删掉的「Grok 官方」条目绝不会在下次启动时复活。对官方登录配置的代理接管会被自动跳过，手动路径给出明确拒绝，与现有「不代理官方供应商」的策略一致。

#### 用 xAI Grok 账号登录：Claude Code 与 Claude Desktop

Claude Code 与 Claude Desktop 新增「xAI (Grok)」预设，用 OAuth 设备码登录代替 API Key：请求经本地代理完成 Anthropic Messages → xAI Responses API 转换并逐请求注入访问令牌，各档默认模型都是 `grok-4.5`（Claude Desktop 预设把 `claude-*` 形式的角色 ID 映射到上游 `grok-4.5`，以通过 Desktop 的第三方模型校验）。

「设置 → OAuth 授权中心」新增 xAI 区块：设备码登录（用户码带复制按钮、验证链接、等待 / 取消 / 重试）、多账号与默认账号选择、按账号移除、重授权徽标——刷新令牌被吊销的账号会以「已过期」状态保留可见而不是消失，授权状态每 15 秒自动刷新，服务端吊销会自己浮现出来。

集成边界是钉死的：无论表单里的端点 / 格式字段怎么改，上游始终是 `https://api.x.ai/v1/responses`（Responses 格式）；OAuth 端点经 OIDC 发现解析，但强制校验为 https 的 `auth.x.ai`；刷新令牌存于 `~/.cc-switch/xai_oauth_auth.json`（Unix 上 `0600`；访问令牌只存内存）；OAuth 错误响应体绝不进入错误信息或日志。`grok-4.5` 定价（$2 输入 / $6 输出 / $0.50 缓存读，每百万 token）同步入库，用量不再记 $0，存量数据库下次启动自动补行。四语文案同步。使用前请阅读「风险提示」中的客户端身份披露。

不用 OAuth、只有按量付费的 xAI API Key？同样能接进 Claude Code：xAI 的 API 端点就是标准 Responses 协议，把它当作一个普通的 Responses 供应商添加——自定义供应商填 `https://api.x.ai/v1` 与 API Key、上游格式选 Responses，经本地路由完成 Anthropic Messages ↔ Responses 转换，与〈[在 Claude Code 中使用 GPT 模型](/zh/tutorials/claude-codex-routing-guide)〉攻略是同一套玩法。Codex 侧则有现成的 API Key 预设，见下一节。

#### Codex 直连 xAI：OAuth 受管与 API Key 原生双预设

Codex 获得两条直连 xAI 的路——有 Grok 订阅走 OAuth 受管，有 API Key 走原生直连：

- **「xAI (Grok) OAuth」受管预设**：让 Codex 跑在 Grok 订阅上。表单隐藏密钥 / 端点 / 格式字段、显示账号选择器，「获取模型」用已登录账号发起；供应商被钉死为原生 Responses，base URL 与逐请求令牌由代理强制执行——改了也会被忽略，受管路由无法被重定向。由于 codex 0.142+ 会发出 ChatGPT 后端私有的请求形态（`type:"namespace"` 工具声明会让 xAI 严格解析器直接 422，另有 `prompt_cache_retention`、`safety_identifier`、`external_web_access`、`additional_tools` 载体字段和 grok-4.5 不支持的采样参数），OAuth 路由在原生透传上加了一层兼容层：namespace 工具被展平为顶层 function 工具（与 Chat 路径同款 sha256 截断命名）、响应侧流式与非流式都还原回 namespace 形态，不支持的字段被剥除——全部是确定性的字段删除 / 结构提升，绝无语义改写，prompt 缓存前缀保持稳定。兼容层只门控在 xAI OAuth 供应商类型上，任何其它供应商的流量都不受影响。
- **「xAI (Grok)」API Key 预设**：直连 `api.x.ai/v1` 的原生 Responses，自带 500K 上下文的 `grok-4.5` 目录条目。该预设**不会**应用上述 xAI 专属兼容转换——codex 0.142+ 的 API Key 用户仍可能撞上 xAI 的严格解析器，OAuth 预设才是完全兼容的路径。

xAI OAuth 的令牌失败被归为不可重试错误，failover 绝不会把你的对话悄悄挪到另一个 Grok 账号上。

#### 界面崩溃捕获：错误落盘与重载页

React 错误边界现在包住整个界面（包括数据库恢复界面）：渲染进程崩溃时显示「界面出错了」卡片和重载按钮，而不是一片白屏；全局 `error` / `unhandledrejection` 处理器把渲染端错误持久化到磁盘——此前一次 JS 崩溃在盘上零证据。前端写出的所有日志经过两层脱敏：结构化序列化器按敏感属性名（`tokens` / `apiKeys` / `credentials` 等变体归一匹配，整值含嵌套对象一起隐藏）与值形态（令牌前缀、PEM 头、高熵不透明串）脱敏，再经唯一文本出口的有序正则链覆盖 URL 查询值与凭据、认证头与 scheme、命名密钥容器（双重编码的 JSON 也覆盖）。字符串形态到达的 JSON 会被重新解析后做结构化脱敏；超大结构化输入整体丢弃而非截断——截断的 JSON 串会退化到较弱的文本正则，可能泄漏。设置里的开关文案也改为名副其实：「应用诊断日志」（cc-switch.log）与代理的「记录请求用量」（统计数据库，本来就不是文本日志）。四语同步。

#### 「重建 Codex 用量」维护按钮

用量看板的维护区新增「重建 Codex 用量」：备份数据库后，只清除 `codex_session` 来源的明细行、对应的 `_codex_session` 日汇总与 Codex 同步游标，然后用修正后的解析器从头重导所有 rollout 文件——这是被下述双计 bug 污染的数据库的恢复路径，也是父日志恢复后延迟 fork 文件的重试路径。手动重建在备份写不出时会硬失败（自动迁移版只告警，因为在升级后因备份目录不可写而卡死启动是更糟的结局）；整个「备份 → 重置 → 重导」序列持有会话同步锁，60 秒后台同步无法与清除交错；完成时保证恰好发出一次前端刷新通知——包括重导为零行或失败的路径——看板绝不会停留在重置前的数字上。游标清理按路径形态匹配（`sessions` / `archived_sessions` 段下的 `rollout-{uuid}` 文件名），旧 `CODEX_HOME` 下记录的游标也能清到。四语同步。

#### 会话导入可观测性：延迟文件与疑似重复

会话同步结果现在报告 `filesScanned`、`deferredFiles`——父日志缺失或父标记冲突的 fork rollout 会被搁置且不写游标，等后续同步或手动重建重试，而不是靠猜导入——以及 `suspectedDuplicates`：插入后逐行探测是否已存在同指纹行（走 `idx_request_logs_dedup_lookup_expr` 表达式索引），每次命中记一条警告。双计 bug 未来若复发，会在日志里自己喊出来，而不是无声地吹大总数。

#### Kimi K3 预设与定价

Codex / Hermes / OpenClaw / OpenCode 的 Kimi 开放平台预设加入 Kimi K3（1M 上下文窗口），追加在 K2.7 Code 之后，现有默认模型行为不变。内置定价表新增 `kimi-k3`（官方牌价 $3 输入 / $15 输出 / $0.30 缓存读，每百万 token）与裸 `k3` 别名——Kimi For Coding 订阅上报的模型短 id 是 `k3`，否则匹配不到任何定价行（与现有 `hunyuan-hy3` / `hy3` 同款先例）。存量数据库下次启动自动补齐两行，不碰用户改过的定价。

#### SudoCode.us 回归，与 SudoCode.chat 并存

两家恰好同名「SudoCode」的无关公司现在是两个独立预设：赞助商更名为「SudoCode.chat」，此前被原位替换掉的「SudoCode.us」带着原有端点、模型与图标回归，Hermes slug 也做了区分，两者可在累加式的 `~/.hermes/config.yaml` 中共存。算上新的 Grok Build 预设列表，SudoCode.chat 覆盖七个应用、SudoCode.us 覆盖全部八个。

---

### 变更

#### 诊断日志：跨重启持久、按大小轮转、绝不记录密钥

`cc-switch.log` 不再在每次启动时被清空——过去能解释崩溃的日志，等应用重开时已经没了——改为 20 MB 轮转、保留 4 个归档（上限约 100 MB，对比过去单文件可膨胀到 1 GB）；此前无上限的 `crash.log` 改为 5 MB 轮转、保留 2 个归档，检查 / 轮转 / 追加序列在同一把锁下，并发 panic 不会丢归档。

日志持久化让明文密钥成为真实的暴露面（用户会把日志附到公开 issue 里），所以同一批改动里把后端所有日志出口都做了清洗：上游 URL 只记剥掉 userinfo / query / fragment 的形式（没有已知密钥可替换时只记 origin，因为凭据可能嵌在路径里）；请求与响应体一律不记——换成字节数、短哈希或安全分类（`sse` / `html` / `json-like` / `binary-or-encoded` 等），排查转换问题的信号还在、内容没了；响应头走白名单（名单外只记名字）；正在使用的密钥值（API Key、访问令牌）会从任何携带它的 URL 里被替换掉；MCP 自定义字段值一律省略。日志插件注册提前（更新器 / 启动期故障可诊断），持久化的日志级别在数据库打开后立即生效、故障时收敛到 Info，「启用诊断日志」开关现在也管前端发起的日志写入。**升级前的旧日志文件不会被追溯清洗**——见「升级提醒」。

#### 预设选择器：赞助商分组，其余按名称排序

预设选择器的默认顺序改为四层：官方最前，其次首要合作伙伴，然后是赞助商预设（与 README 赞助商表同序，预设文件已物理重排对齐），最后所有其余预设按显示名字母序排列，不再按文件序。命中多层的条目只落在最早一层，不会重复出现。

#### 预设「获取 API Key」链接更新

RunAPI、ClaudeCN、ZetaAPI、APINebula 预设的密钥申请链接更新为各家当前的注册 / 推荐页（ClaudeCN 同时迁移了域名：claudecn.top → claudecn.ai）。推荐标签仅限这些链接与 README——官网链接和 API 端点保持不动。

---

### 修复

#### Codex fork / 子代理不再把重放的父历史当新用量（v3.17.0 双计根治）

修复 v3.17.0 的用量膨胀：fork 一个 Codex 任务或以复制模式派生子代理时，父对话的 token 历史被当作新用量重复计入——有用户报告单日用量跳涨数十亿 token、父子行字节级相同、空 fork 背着从未消耗过的用量。fork / 子代理的 rollout 文件开头会重放父线程历史，旧解析器靠启发式找接管边界（第一个 `thread_settings_applied` 事件、对象形态的 `subagent` 来源标记）：父线程自己的设置变更出现在重放里时边界落得太早，而当前字符串形态的来源标记则完全识别不到，整段父历史被原样导入。新解析器只认显式父身份——子方 `session_meta` 上的 `forked_from_id` 或 `source.subagent.thread_spawn.parent_thread_id`，两者冲突时搁置该文件——线程身份锚定到 rollout 文件名 UUID，加载父 rollout 自己的 fork 前 token 计数序列，用令牌签名对齐剥掉子方的重放前缀：重放事件只用于恢复累计基线，绝不插行。不带重放历史的子代理日志现在按真实用量计入，反方向的漏计（真实子代理消耗被当作疑似重放跳过）同步修复。（[#5335](https://github.com/farion1231/cc-switch/issues/5335)、[#5433](https://github.com/farion1231/cc-switch/issues/5433)、[#5381](https://github.com/farion1231/cc-switch/issues/5381)）

#### 代理用量记录改为幂等：响应级稳定键

终态用量事件不带消息 id 时（经本地代理的 Codex `/responses` 流量是常态），去重键此前回退到随机 UUID——同一上游响应的每次重试 / 重放都造一个新键，`INSERT OR REPLACE` 每次都堆一行新的；有用户的数据库里同一用量组合出现了 2,078 次。解析器现在从响应信封本身取键——Codex `response.completed` 事件的 `response.id`（丢弃 `response.created` 的 id）、Chat Completions 的 `chatcmpl` id、Gemini 的 `responseId`——并按 `session:{app_type}:{provider_id}:{id}` 作用域化：failover 时同一响应打到不同供应商仍按供应商各记一次、互不碰撞（Claude 保持裸 `session:{id}` 形态，代理行继续与会话日志导入合流）。完全没有信封 id 时，兜底从响应的用量语义做确定性 SHA-256——相同重放必须撞进同一个键，去重才成立——最终写库也从无条件 REPLACE 改为去重窗口内的「不存在才插入」。（[#5496](https://github.com/farion1231/cc-switch/issues/5496)）

#### 大量会话导入时用量页不再卡死

导入大批会话时打开用量页可能整个卡住：每插入一行就发一次刷新通知，每次通知让前端重跑全部约 10 个用量查询，这些查询又与正在逐行解析几十 MB rollout 文件的导入器争抢唯一数据库连接——在被重复行吹大的数据库上三者互相放大。现在会话同步改为每轮完成只通知一次；所有会话导入器串行在单飞锁后（手动「立即同步」排队等待运行中的一轮，而不是与之竞争）；阻塞式解析挪到专用阻塞线程，不再饿死驱动界面命令的异步运行时；60 秒后台节拍错过就跳过，不再突发补跑。

#### codex 0.144.5+ 不再因 CC Switch 生成的模型目录无法启动

codex ≥ 0.144.5 严格解析外部模型目录，条目缺 `supports_reasoning_summaries` 时整个文件被拒——Codex CLI 和桌面端都起不来，删掉生成目录也没用，因为任何一次供应商保存都会按同样方式重新生成。根因是 CC Switch 从机器共享的 `models_cache.json` 克隆目录模板，而它的字段集取决于最后写它的那个 codex 进程——共存的旧版 codex 一直在用缺字段的形态重写缓存。生成目录现在会从内置静态模板回填解析器必需字段，且只在缺失时回填（动态值永远优先）；「缺失即解析器默认值」的可选能力字段刻意不回填，语义必须保留。

#### Windows：切换供应商不再闪黑窗、不再卡死

Windows 上切换供应商或开关接管会闪过一个控制台窗口、界面卡住约 2 秒。三个原因、三处修复：`codex debug models --bundled` 探测经 `cmd.exe` 启动 `codex.cmd`，GUI 子系统应用里这会弹出自己的控制台——子进程现在带 `CREATE_NO_WINDOW` 创建；模型目录模板此前每次切换都重新生成——现在首次成功加载后进程级缓存（失败保持可重试，坏的首次探测不会毒化缓存），Codex CLI 每次应用运行至多启动一次；`switch_provider` 此前是跑在主线程上的同步命令——现在异步化、真实工作在阻塞线程上，仍由按应用切换锁串行。卡顿修复对全平台生效，闪窗修复是 Windows 专属。

#### 工具 schema 为 null / 缺失 / 联合类型不再被严格上游整单拒绝

Codex 内置工具（如 `codex_app__automation_update`）声明 `parameters: null`（或 `type: null`），DeepSeek 这类严格的 OpenAI 兼容上游会对整个请求返回 400，经代理路由的工具会话直接被杀。Responses→Chat 桥现在把每个工具的 parameters 归一为 `type:"object"` schema：null 或缺失（含嵌套形态的缺失）变为 `{"type":"object","properties":{}}`，非 object 的 `type`（含 `type: null`）原位纠正为 `"object"`，顶层 `oneOf` 联合 schema 补根 `type:"object"`、分支原样保留。同样的 object 类型保证扩展到了 Codex→Anthropic 工具路径的 `input_schema`。已有的 `properties` / `required` 绝不丢弃。（[#4706](https://github.com/farion1231/cc-switch/pull/4706)、[#5315](https://github.com/farion1231/cc-switch/pull/5315)，修复 #4705、#4783）

#### 推理模型在多轮 Codex Chat 对话中保住思考

推理模型（如 kimi-k2-thinking）走代理的 Responses→Chat 桥时，多轮历史会弄坏思考内容：每轮的 `reasoning` 条目被粘到**上一条**助手消息的尾巴上，紧随的助手轮反而没有 `reasoning_content`——模型会肉眼可见地中途断片。Responses 语义里推理位于它所属消息**之前**，桥现在把推理前向附挂到其后的助手消息或工具调用上；真正的尾部推理只在确凿的尾部（输入结束，或用户消息这样的轮次边界——此前在这里会被静默丢弃）向后附挂，并追加到已内嵌的推理之后；悬挂中的推理在边界处必被消费，绝不会跨过用户轮泄漏进后面的助手消息。（[#5508](https://github.com/farion1231/cc-switch/pull/5508)）

#### 流式并行工具调用保住 ID 与顺序

Chat→Responses 流式桥的两个 bug 会弄坏「身份分散在多个 chunk」的上游发来的并行工具调用：携带空 `id` 的续传增量会覆盖真实 `call_id`（Codex 客户端看到 `call_id:""`，工具结果对不上调用）；工具调用各自就绪就立即发出，名字先到的靠后索引能插到靠前索引前面——并行调用被重排。现在空 id 一律忽略；发射经过连续索引闸门，严格按 Chat `index` 顺序放行，未识别的靠前索引没就绪就等待；流中途绝不合成假 call id（只在流终结时作为最后手段，且防御性跳过无名调用、稀疏索引照常发出）。（[#5310](https://github.com/farion1231/cc-switch/pull/5310)）

#### 受管 OAuth 供应商可靠地标记为「需本地路由」

「需路由」徽标与切换时警告此前由供应商的 API 格式推导，对受管 OAuth 供应商（Copilot、Codex OAuth、xAI）这是错误信号——它们的凭据由代理注入、与上游格式无关，原生格式的受管供应商拿不到警告、不开接管就静默失败。路由需求现在由唯一共享谓词决定：官方供应商永不需要路由，受管 OAuth 供应商恒需要，格式规则只适用于其余情况。切换时的门槛也按应用查对了就绪信号：多数应用查按应用接管状态（旧门槛只看全局代理运行标志，漏掉「代理在跑但当前应用没被接管」），Claude Desktop 继续看代理进程本身——后端接管状态没有 Claude Desktop 字段，统一按应用查会让 Desktop 永远弹警告。Claude Desktop 供应商表单对所有受管 OAuth 类型强制代理模式并锁定模型映射开关，不再只对 xAI。四语同步。

#### Node 装在 nvm / fnm / mise 里时工具更新可用

锚定的 npm 更新与修复命令按绝对路径调 npm，但 npm 启动器靠 `#!/usr/bin/env node` shebang 从 PATH 找 `node`——GUI 启动的应用只继承系统 PATH，不含版本管理器目录，nvm / fnm / mise 安装的工具更新静默失败。现在每个锚定 npm 调用都把 npm 自己的同级 `bin` 目录前置到 PATH，npm 与它的 shebang 解析到同一个 Node；Codex 自修复（卸载 + 重装）路径同样覆盖。

#### 删除的默认 Skill 仓库不再复活

默认 Skill 仓库此前每次启动被「补齐缺失默认项」逻辑重新播种，删掉的默认仓库下次启动又静默回来。播种改为按数据库一次性，用设置标志记录；升级时已有仓库的数据库直接置标志、不再补种，现有选择不受影响。（[#5356](https://github.com/farion1231/cc-switch/pull/5356)）

#### 托盘首启语言跟随系统

设置里还没选过语言时，托盘菜单被硬编码为简体中文——英文 / 日文 / 繁中系统上主界面正确跟随系统语言、托盘却不一致，直到用户手动切一次语言。托盘现在按与前端相同的优先级从系统 locale 推导首启语言（含 `zh-TW` / `zh-HK` / `zh-Hant` → 繁体中文）；显式选择的语言永远优先，locale 读不到时照旧回落中文。（[#4355](https://github.com/farion1231/cc-switch/pull/4355)）

#### 导入失败显示真实错误并刷新列表

每次「从 live 配置导入」失败都弹一个空错误提示，因为 Tauri 的 `invoke` 以后端错误**字符串**拒绝，而处理器从它上面读 `.message`。现在显示后端真实报错（带本地化的通用兜底），失败时也会刷新供应商列表——报错前已提交的副作用立即可见。

#### OpenClaw 预设模型成本修正为官方牌价

15 个 OpenClaw 预设条目的成本值单位错误或未换汇——`cost` 字段是美元每百万 token，例如 `glm-5.1` 记成 `0.001/0.001`（低估约 1000 倍，用量成本近乎 0），`deepseek-v4-pro` 则带着未换算的人民币值（高估）。所有条目改为官方牌价 $/M；订阅套餐与免费档端点也刻意展示牌价，套餐用户能看到自己用量的标准价值。今后从预设新建的供应商拿到修正值；已创建的供应商保持创建时的配置。

#### 界面小修一组

- **AiHubMix 图标**：Codex 应用的 AiHubMix 预设此前缺品牌图标字段、渲染成通用图标，现与其它应用一致。
- **两个缺失文案键补齐**：Codex「因使用 Anthropic Messages 格式需要路由」提示里的原因片段此前在非中文界面显示中文（`proxyReasonAnthropicMessages` 不存在于任何语言文件）；供应商表单的密钥状态加载标签自 4 月起只有硬编码默认值。两者已在 zh / en / ja / zh-TW 全部补齐。

---

### 文档

#### Codex ↔ Claude 双向路由攻略

两篇新攻略把「Codex 客户端用 Claude 模型」「Claude Code 客户端用 Responses 供应商」补成了双向：

- **[在 Codex 中使用 Claude 模型](/zh/tutorials/codex-claude-routing-guide)**（中 / 英 / 日三语，含截图）：配合 v3.17.0 的原生 Anthropic Messages 上游，把 Codex 接到 Claude 系 `/v1/messages` 网关；v3.17.0 的 release notes 已回链本攻略。
- **[在 Claude Code 中使用 GPT 模型](/zh/tutorials/claude-codex-routing-guide)**（中 / 英 / 日三语，含截图）：用 Responses 协议的供应商（网关 API Key，或 ChatGPT 订阅的 Codex 服务）驱动 Claude Code——Claude Code 始终对本地 `/v1/messages` 路由说 Anthropic Messages，由代理把每个请求转换成上游的 Responses 协议。

#### README 赞助商更新

SubRouter 加入四语 README 赞助商表；置顶的 Kimi 赞助文案更新到 K3、横幅改由 Moonshot CDN 提供；RunAPI 权益文案刷新，赞助商行序与应用内预设顺序对齐。

---

### 升级提醒

#### 数据库自动迁移与 Codex 用量一次性重建

从 v3.17.0 升级会连续执行三次 schema 迁移（v13 → v16）：v14 重建 `proxy_config` 表以纳入 Grok Build（现有按应用代理设置全部保留，并新增 `grokbuild` 行）；v15 给 MCP 服务器表与 Skills 表加 Grok Build 启用列；v16 触发一次性的 Codex 用量自动重建——数据库先备份到 `backups/` 下，`codex_session` 数据与游标被重置，随后正常的启动同步用修正后的解析器重导全部数据。典型数据量只需数秒；实测最重的数据集（1,801 个 rollout 文件 / 1.5 GB）约 65 秒。之后的启动照旧增量。若有回退旧版本的习惯，建议先自行备份 `~/.cc-switch/cc-switch.db`。

**首次启动时请留意**：历史记录的修复是**逐渐完成**的——重建随启动同步在后台进行，这段时间里用量看板的 Codex 历史数字会先清零、再逐步回填，属预期行为，不是数据丢失。重建完成后的总数通常会比升级前**更小**：被双计吹大的那部分被挤掉了，剩下的才是真实用量。

#### 重建的边界

- 重建从 rollout JSONL 文件重新计算用量，**源日志已被删除的历史无法重建**。
- 父 rollout 缺失的 fork 文件会被搁置并报告，而不是靠猜导入；恢复父日志后运行「重建 Codex 用量」可补导。
- 历史上代理来源的重复行会永久保留——迁移只重建会话来源的数据，不存在针对过往代理膨胀的清理逻辑；幂等记录只保证从此不再产生新重复。

#### 旧日志文件不会被追溯脱敏

诊断日志从本版起不再在启动时清空、跨重启持久保留（运行日志轮转上限约 100 MB，另有约 15 MB 崩溃日志）。**早期版本写下的日志文件不会被追溯清洗**，可能含有 API Key、令牌或带凭据的 URL——公开分享前请先检查升级前的旧日志。

#### Grok Build 安装走官方安装脚本

安装或重装 Grok Build 现在优先使用 xAI 官方安装器，安装时会外联获取 `x.ai/cli/install.sh`（Windows 为 `install.ps1`），npm 作为兜底；已有的 npm 安装继续经 npm 更新。

#### 内置定价自动补行

新定价行（`grok-4.5`、`kimi-k3`、`k3`）在下次启动时按「不存在才插入」自动追加；用户编辑过的定价行绝不被覆盖。

---

### 风险提示

#### xAI Grok OAuth 登录（本版新增，请阅读）

本版的 xAI Grok OAuth 集成**复用官方 Grok CLI 注册的公开 OAuth 客户端身份与权限范围**（`client_id b1a00492-073a-47ea-816f-4c329264a828`，scope 含 `grok-cli:access`），而不是 CC Switch 自己注册的应用身份。xAI 可能不支持这种用法，**使用可能导致账号被限制或封禁——风险自担**。该功能完全可选：不添加 xAI 供应商，一切照旧。首次登录会创建 `~/.cc-switch/xai_oauth_auth.json`（仅存刷新令牌，Unix 上权限 `0600`；访问令牌只存内存），并经你配置的出站代理访问 `auth.x.ai` 与 `api.x.ai`，无本地回调端口。

#### 沿用的反向代理类提示

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**第三方供应商路由**：通过 CC Switch 本地代理把 Codex、Claude Desktop 或 Grok Build 的请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束不同，请在使用前阅读目标供应商的服务条款。

用户启用上述功能即表示自行承担相关风险。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

---

### 致谢

感谢以下贡献者在 v3.18.0 中提交的功能与修复：

- [#5453](https://github.com/farion1231/cc-switch/pull/5453)：Grok Build 一等公民支持（第八个受管应用的主体实现），感谢 @YUZHEthefool。
- [#5508](https://github.com/farion1231/cc-switch/pull/5508)：Responses→Chat 桥推理内容前向附挂，感谢 @ka79376046。
- [#5310](https://github.com/farion1231/cc-switch/pull/5310)：流式并行工具调用保 ID 保序，感谢 @SaladDay。
- [#5315](https://github.com/farion1231/cc-switch/pull/5315)：Codex 工具 parameters 归一为 object schema，感谢 @Komikawayi。
- [#4706](https://github.com/farion1231/cc-switch/pull/4706)：严格 OpenAI 兼容上游的工具类型归一，感谢 @Ryan2128。
- [#5356](https://github.com/farion1231/cc-switch/pull/5356)：删除的默认 Skill 仓库不再复活，感谢 @allenxu09。
- [#4355](https://github.com/farion1231/cc-switch/pull/4355)：托盘首启语言跟随系统 locale，感谢 @LaiYueTing。
- [#5138](https://github.com/farion1231/cc-switch/pull/5138)：后端 CI 扩展到 Linux / Windows / macOS 三平台，感谢 @zayokami。

也感谢所有反馈 Codex 用量异常、codex 新版启动失败与工具调用问题的用户——本版最重要的几个修复都来自这些真实场景里的复现线索。

---

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.18.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.18.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

Windows ARM64 设备请选择文件名中带 `arm64` 标识的对应制品。

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.18.0-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.18.0-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.18.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

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

- `CC-Switch-v3.18.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.18.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.17.0] - 2026-07-13

> 这一版带来一个盼了很久的能力：**「项目」一键切换**——把当前的供应商、MCP、Skills、记忆文件整套保存为命名快照，在标题栏或托盘里一键换成另一套，切换时还会自动把你离开的项目当前状态存回去。Codex 侧同样收获颇丰：**官方 ChatGPT 订阅账号现在也能走本地代理路由**，享受与第三方供应商相同的路由与用量统计；GPT-5.6 全家的上下文窗口与 Sol / Terra / Luna 三档定价一步到位；还新增了原生 Anthropic Messages 上游格式——所在企业禁用了 Claude Code、但没有禁用 Claude API？现在可以**在 Codex 里直接用上 Claude 系列模型**。此外是一大波正确性修复：上游失败不再变成「空回复」、缓存写入不再被双重计费、删掉的 MCP 服务器不再复活、Kimi For Coding 的 256K 窗口终于真正生效。

### 使用攻略

本版的新能力主要落在主页顶部的项目切换器、Codex 供应商表单与用量看板里，建议结合以下文档了解：

- **[在 Codex 中用 Claude（本地路由攻略）](/zh/tutorials/codex-claude-routing-guide)**：本版新增的分步攻略，配合「原生 Anthropic Messages 上游」功能使用。攻略讲解如何把 Codex 供应商的上游格式选为 `anthropic`，接入任何只提供 `/v1/messages` 的 Claude 系网关，在 Codex 里用上 Claude 系列模型。
- **[在 Codex 里使用 Kimi（本地路由攻略）](/zh/tutorials/codex-kimi-routing-guide)**：本版新增的分步攻略。较新的 Codex CLI 走 OpenAI Responses 协议，而 Kimi 开放平台与 Kimi For Coding 暴露的是 Chat Completions 端点，直连通常 404；攻略讲解如何用内置的 `Kimi` / `Kimi For Coding` 预设配合本地路由完成协议转换。
- **[Codex 官方登录保留](/zh/tutorials/codex-official-auth-preservation-guide)**：了解 CC Switch 如何在切换第三方供应商时保留你的官方 ChatGPT 登录。本版在此基础上更进一步——官方账号本身也可以走代理路由（见下方「新功能」）。
- **[用量统计](/zh/docs?section=proxy&item=usage)**：了解用量看板的数据来源与统计口径。本版修正了缓存写入计费、补齐了 Codex 子代理会话统计，并新增 GPT-5.6 与混元 Hy3 定价。

---

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

---

### 概览

CC Switch v3.17.0 是 v3.16.5 之后的一个功能大版本，核心是**「项目」**：你可以把 Claude Code / Claude Desktop / Codex 当前的供应商、MCP、Skills、记忆文件状态保存为命名快照——比如编程目录一套「开发」、写作绘图目录一套「创作」——在主页顶部的切换器或托盘的「项目」子菜单里一键整套切换——切换前会自动把你正要离开的项目状态存回去，所以项目里保存的永远是你上次离开时的样子。第二条主线是 Codex：**官方 ChatGPT 订阅账号现在也能走本地代理路由接管**（不需要 API Key，Codex 自己的登录凭据原样透传，绝不覆盖你的官方登录）；配合修正后的客户端身份，`gpt-5.6-luna` 这类最新订阅模型不再误报 404；GPT-5.6 的 372K 上下文窗口注入、Sol / Terra / Luna 三档定价（含 1.25 倍缓存写入费率）与预设默认模型同步就位；Codex 上游格式还新增了原生 Anthropic Messages 协议——它瞄准一个很现实的场景：不少企业禁用了 Claude Code 客户端、但并没有禁用 Claude API，这些用户现在可以让 Codex 直连 Claude API（或任何只提供 `/v1/messages` 的网关），在 Codex 里照常使用 Claude 系列模型。

围绕日常使用的正确性，本版做了三波集中修复。**代理桥**：上游在 2xx 里返回的语义失败不再被转成空回复，而是触发 failover；推理内容、工具结果、system 角色跨 Responses↔Anthropic 桥无损往返；提示缓存断点注入更充分，长对话不再每轮全价重发。**用量计费**：缓存写入 token 此前被同时按输入价和缓存创建价双重计费，现已修正（数据库升级到 schema v13 以保证历史数据口径不乱）；用量与配额查询遇到网络瞬时失败会自动重试、不再把失败体当真实数据缓存。**Codex `config.toml`**：在应用里删掉的 MCP 服务器不再随供应商切换复活；live 文件解析失败时同步宁可报错也不再清空整个文件；「使用通用配置」的合并挪到后端执行，注释与键序不再被打乱。另有 Kimi For Coding 256K 窗口真正生效、Codex 子代理与免费版配额统计补齐、智谱团队套餐配额查询、OpenCode 表单增强与一批预设更新。

**发布日期**：2026-07-13

**更新规模**：69 commits | 172 files changed | +21,067 / -2,464 lines

---

### 重点内容

- **「项目」一键切换**：把供应商、MCP、Skills、记忆文件整套保存为命名快照（比如编程一套、写作绘图一套），从主页顶部或托盘一键切换；切换时自动保存离开项目的当前状态。覆盖 Claude Code、Claude Desktop、Codex 三个作用域，互不干扰。
- **Codex 官方账号也能走代理路由**：ChatGPT 订阅登录的 Codex 会话可通过本地代理路由，获得与第三方供应商一致的路由与用量统计；官方登录凭据绝不被覆盖或存储。
- **GPT-5.6 全面就位**：Claude Code 走 Codex 接管时自动注入 372K 上下文窗口；Sol / Terra / Luna 三档定价入库（缓存写入按 1.25 倍输入价计费）；相关预设默认模型升级到 gpt-5.6 家族；修正客户端身份后 `gpt-5.6-luna` 不再误报 404。
- **在 Codex 里使用 Claude 系列模型（原生 Anthropic Messages 上游）**：不少企业禁用了 Claude Code 客户端、但没有禁用 Claude API——现在把 Codex 供应商的上游格式选为 `anthropic`，即可直连 Claude API 或任何只提供 `/v1/messages` 的网关，本地代理完成 Responses↔Anthropic 双向转换，自带标准 5 分钟提示缓存注入。
- **代理桥正确性修复**：上游失败 fail-closed 触发 failover 而非空回复；推理 / 工具结果 / system 角色跨桥无损；缓存写入不再双重计费；断点注入更充分。
- **Codex config.toml 加固**：删掉的 MCP 服务器不再复活；解析失败时 MCP 同步宁可报错也不清空文件；通用配置合并保留注释与键序。
- **Kimi For Coding 256K 真正生效**：此前的 262144 压缩窗口从未实际生效（被 Claude Code 的 200K 默认钳回），本版补齐模型别名路由与窗口注入；存量供应商需重新套用预设（见「升级提醒」）。

---

### 新功能

#### 「项目」：整套配置的命名快照与一键切换

这是本版的头号功能。你可以把当前的供应商、MCP、Skills、记忆文件状态保存为一个命名「项目」，之后在主页顶部的项目切换器或托盘的「项目」子菜单里一键整套切换，不必再逐项手动勾选。

举个典型场景：你有一个目录用来编程、另一个目录用来写作或绘图。编程时要的是一套供应商，配上文件系统 / GitHub 这类 MCP、代码审查 Skills 和写着工程约定的记忆文件；写作或绘图时往往换另一家供应商、另一组 MCP 和完全不同的提示词。以前在两件事之间来回，意味着切供应商、逐个开关 MCP 和 Skills、再改记忆文件；现在把两套状态分别存成「开发」和「绘图」两个项目，换目录干活时在 CC Switch 里点一下，整套配置随之就位。

项目功能覆盖 Claude Code、Claude Desktop 与 Codex 三个作用域（Claude Desktop 由 CC Switch 管理的维度只有供应商，因此其快照只含供应商、应用时不动其它维度）。

几个值得了解的设计：

- **项目是全局实体、按作用域切换**：同一个项目在 Claude Code / Claude Desktop / Codex 三侧各自记录自己的当前项目与快照槽位，在 Codex 页签切换项目绝不会动到 Claude 的配置。
- **切换即自动保存**：切换项目前，会先把你正要离开的项目在当前作用域下的状态自动存回去——所以项目里保存的永远是你上次离开它时的样子，不需要（也没有）手动「更新快照」按钮。
- **应用是尽力而为的**：套用快照复用现有的切换原语（先切供应商，再做 MCP / Skills 的最小差异开关，最后启用记忆文件）；快照里引用的某项如果已被删除，只会告警跳过，不会整体回滚。
- **自动关闭代理接管**：套用项目前会先关闭该作用域内各应用的代理接管，避免快照状态和路由状态打架。

不用项目功能的用户可以在「设置 → 主页显示」里关闭「显示项目切换」，只隐藏主页入口，托盘子菜单与项目数据不受影响。底层由新的 `profiles` 表支撑（数据库自动迁移，无需手动操作），四语界面文案同步就位。

#### Codex 官方 ChatGPT 账号的代理路由接管

用 ChatGPT 订阅（OAuth 或 API-key 登录）的 Codex 会话，现在也可以走 CC Switch 的本地代理路由了——官方账号流量获得与第三方供应商一致的路由、格式转换与用量统计。在供应商面板或托盘里选择内置的「OpenAI Official」条目进行接管即可（如果你此前删掉过它，添加供应商时会自动恢复）；路由中的卡片徽标显示「官方账号路由中」。

实现上刻意做到**零凭据存储**：不向 `auth.json` 写任何占位密钥，而是往 `config.toml` 投影一个指向本地代理的专用 `model_provider`，Codex 把自己的 ChatGPT 授权头原样发给代理、代理原样透传给官方端点——`codex-official` 这一行的凭据永远是空的。官方登录本身绝不被覆盖：接管时 OAuth / API-key 材料会保留进备份；官方端返回的 401 / 403 被视为不可重试错误，failover 绝不会把你的对话悄悄挪到另一个账号上。相应地，「切换时保留 Codex 官方登录」这个设置项的文案已更新——路由接管场景下官方登录总是被保留，该开关现在只管不走路由的第三方直切。

#### GPT-5.6：上下文窗口、预设默认与三档定价

围绕 GPT-5.6 家族做了三件事：

- **372K 上下文窗口注入**：Claude Code 经代理接管路由到 ChatGPT Codex（Codex OAuth）后端时，自动往生效的 `settings.json` 注入 `CLAUDE_CODE_MAX_CONTEXT_TOKENS` 与 `CLAUDE_CODE_AUTO_COMPACT_WINDOW`（均为 372000），让 Claude Code 不再按默认 200K 窗口过早自动压缩、也不再撑爆上游。注入门控严格：只有当所有已配置的模型键都指向 gpt-5.6 家族时才注入（gpt-5.5 的目录窗口在 272K / 372K 间摇摆，故意不继承）；你手动设置的值永远优先；切走时按镜像条件剥离，程序默认永远不会固化进你的供应商配置。
- **预设默认模型升级**：Claude Code 与 Claude Desktop 的 Codex OAuth 预设默认路由升级到 gpt-5.6 家族（haiku → `gpt-5.6-luna`，主模型 / sonnet / opus → `gpt-5.6`），自定义 Codex `config.toml` 模板的默认模型同步跟进。
- **Sol / Terra / Luna 三档定价**：用量看板按官方价目为三档入库——Sol 5 / 30 / 0.50、Terra 2.50 / 15 / 0.25、Luna 1 / 6 / 0.10（美元每百万 token，输入 / 输出 / 缓存读）。与 5.5 及更早版本不同，5.6 家族的**提示缓存写入按 1.25 倍输入价计费**（Sol 6.25 / Terra 3.125 / Luna 1.25），已按此入库并自动修复此前按 0 计的存量行；裸 `gpt-5.6` 及各 effort 后缀变体按 Sol 价对齐。

#### 在 Codex 里使用 Claude 系列模型：原生 Anthropic Messages 上游

这个功能来自一个很现实的诉求：**不少企业出于合规策略禁用了 Claude Code 客户端，但并没有禁用 Claude API**。对这些用户来说，模型本身是可用的，缺的只是一个被允许的客户端——现在 Codex 可以补上这个位置。在 Codex 供应商的上游格式选择器里选新增的 `anthropic`，即可直连 Claude API 或任何只提供原生 Anthropic Messages 协议（`/v1/messages`）的网关，本地代理完成 Responses↔Anthropic 的请求、响应与流式双向转换，你在 Codex 里照常对话、照常用工具，背后跑的是 Claude 系列模型。表单配套提供：认证字段选择器（`ANTHROPIC_AUTH_TOKEN` 发 `Authorization: Bearer`，默认；或 `ANTHROPIC_API_KEY` 发 `x-api-key`）、可选的 Claude Code 客户端伪装开关（默认关闭）、以及按供应商的最大输出 token 覆盖（Codex 不发 `model_max_output_tokens`，不设置时回退到保守的 8192，可能截断长回复或重思考回复）。转换桥自动注入标准 5 分钟提示缓存标记（系统提示、工具与历史走缓存而非每轮全价重发），支持 `[1m]` 长上下文标记并补发对应 beta 头，截断的流会如实上报为未完成而不是伪装成功。（[#5071](https://github.com/farion1231/cc-switch/pull/5071)）

#### Codex 供应商表单新增「默认模型」输入框

`config.toml` 顶层的 `model` 键现在是表单里的一个可编辑字段：新模型（如 `gpt-5.6`）发布后，你可以直接把现有供应商指过去，不必等预设更新（预设只影响新添加的供应商）。字段与 TOML 编辑器双向同步，候选列表来自模型映射目录与供应商 `/models` 端点的并集，值不在目录里时提供一键「加入映射」。显式填写的值永远优先于映射第一行的隐式回填；模型名与 `base_url` 写入时做了 TOML 转义，杜绝 `/models` 返回的远端数据注入伪造配置行的可能。

#### 通用配置切换自动同步扩展到 Codex

v3.16.5 给 Claude 加的「切走时自动把 live 配置里的共享偏好回写到通用配置」现在覆盖 Codex 了：切走一个启用了通用配置的 Codex 供应商时，会先从它的 live `config.toml` 重新提取可共享部分更新到通用配置，再带给下一个供应商——你直接在运行中的 Codex 配置里改的偏好不再在切换时丢失，删掉的键也不会被悄悄注回。提取器会严格剥离供应商专属与注入内容（`model` / `model_provider` / `base_url` / `wire_api`、整个 `[model_providers]` 表、MCP 投影、API key 兜底字段、模型目录指针与注入的 `web_search` 哨兵），密钥永远不会进入共享片段。所有失败仅告警、绝不阻断切换。

#### Claude 子代理模型配置

Claude 供应商表单新增「子代理」模型行，写入 `CLAUDE_CODE_SUBAGENT_MODEL`，让 Claude Code 派生的子代理跑在你指定的（通常更便宜或更快的）模型上。支持 `[1M]` 标记；由于子代理模型不会出现在 `/model` 菜单里，该行显示「不在 /model 中展示」占位而没有显示名字段。代理接管路径与模型映射器已同步支持：请求模型与配置的子代理模型一致时原样放行，不再被折叠到默认模型；该键也被排除在共享通用配置之外，不会跨供应商泄漏。（[#4830](https://github.com/farion1231/cc-switch/pull/4830)）

#### 回退模型字段的 1M 上下文复选框

Claude 表单的回退模型字段（`ANTHROPIC_MODEL`）现在带上了 Sonnet / Opus / Fable 各档早已有的 1M 复选框：回退模型背后是 1M 窗口时可以如实声明，不再被静默当作 200K。勾选即在模型 id 后追加 `[1M]` 标记，取消即剥离。（[#5124](https://github.com/farion1231/cc-switch/pull/5124)，修复 #3679）

#### 智谱团队套餐配额查询

智谱的团队套餐（团队版 Coding Plan）走同一个配额端点但需要 `?type=2` 与两个额外请求头（`bigmodel-organization` / `bigmodel-project`），个人版查询够不到。用量脚本弹窗新增「Zhipu GLM Team（智谱团队）」模板，填入 API Key + 组织 ID + 项目 ID 即可查询团队配额；三项缺一会明确提示补全。四语文案同步。（[#5128](https://github.com/farion1231/cc-switch/pull/5128)）

#### OpenCode 表单：请求头与模型 Token 上限编辑器

OpenCode 供应商表单补上了两块此前只能手改 JSON 的配置：**Headers 编辑器**（供应商级 `options.headers`，如 OpenRouter 排行榜要求的 `HTTP-Referer` / `X-Title`，支持增删行、大小写不敏感去重）与**按模型 Token 上限**（`model.limit.context` / `model.limit.output` 数字输入，清空即移除）。「额外选项」块改为可折叠区，已有内容时自动展开；顺带修复了旧占位符过滤会误删真实以 `option-` 开头的选项键的问题。（[#2907](https://github.com/farion1231/cc-switch/pull/2907)）

#### 新增模型定价：腾讯混元 Hy3

为 2026-07-06 发布的腾讯混元 Hy3（256K 上下文）入库定价（按发布日牌价 CNY 1 / 4 / 0.25 每百万 token 折算），`hunyuan-hy3` 与 `hy3` 两个 id 都能命中，其用量不再显示 $0。注意 Hy3 实际是按输入长度分档计费，当前单价表按最低档入库，长上下文请求会低估成本，待官方计费页明确后再修正。

---

### 变更

#### Codex Chat 路由注入 prompt_cache_key，提升缓存命中

Codex 经本地路由转换到 Chat Completions 上游时，现在会按供应商感知地注入 `prompt_cache_key`：Kimi Coding 与 OpenAI 官方端点自动启用、Kimi 预设显式开启，未知的 OpenAI 兼容网关保持关闭以避免严格 schema 网关报 400。键值只取显式客户端值或真实的客户端会话 ID，绝不生成随机 UUID（那会让每个请求落到不同缓存桶、适得其反）。高级选项里提供自动 / 启用 / 禁用三态覆盖。

#### Codex 图片能力自动推断，去掉手动开关

生成的 Codex 模型目录现在只把 CC Switch 确认过的**精确文本-only 名录**内的模型声明为 `input_modalities = ["text"]`；GPT、别名、新后缀变体和一切未知模型一律 fail-open 到 `["text", "image"]`——修复了 GPT 系模型在 Codex IDE 扩展里被误报「不支持图片」的问题。整流器的「纯文本模型预检」开关继续只管代理侧的主动请求改写，不影响目录声明；目录反向导入也会把可推断的能力坍缩掉，未来名录修正或模型升级多模态时自动生效。

#### 上下文窗口参数钉进预设，不再作为表单字段

`Codex`（ChatGPT / GPT-5.6）与 `Kimi For Coding` 预设不再在表单里展示「最大上下文 Tokens」「自动压缩窗口」两个输入框，数值直接钉死在预设 env 里（Codex 372000 / 372000，Kimi For Coding 262144 / 262144）——绝大多数用户从不需要碰这两个数字。两个键刻意保留在 env 里：显式钉住能让本地压缩触发点免疫远端实验性配置的下调。极少数想改数字的用户仍可在供应商的 JSON 编辑器里直接编辑这两个键。

#### 供应商连通性配置简化

移除了过时的按供应商 `testConfig` 覆盖（超时、重试次数、降级延迟阈值）：轻量的 `base_url` 探测现在始终使用全局连通性检查配置，自动 failover 仍完全由代理超时与熔断器的独立设置驱动。设置界面与接口命名也从「模型测试」术语统一迁移到「连通性检查」。

#### 通用（多应用）供应商添加后自动同步

通过「添加供应商」弹窗添加通用（多应用）供应商后，现在会立即推送到各 live 目标配置，不再需要手动再点一次同步。同步失败不阻塞添加——供应商已保存但同步失败时给出非阻断的警告提示。（[#2811](https://github.com/farion1231/cc-switch/pull/2811)）

#### 预设更新

- **LongCat-2.0**：美团 LongCat 预设全线（Claude Code / Claude Desktop / Codex / Hermes / OpenClaw / OpenCode）从已退役的 `LongCat-Flash-Chat` / `LongCat-2.0-Preview` 升级到 `LongCat-2.0`，声明真实的 1M（1048576）上下文窗口。LongCat-2.0 是纯文本模型，代理的媒体清洗白名单已同步收录——粘贴进会话的图片会被替换为不支持标记而不是被上游硬拒。（[#4838](https://github.com/farion1231/cc-switch/pull/4838)）
- **SudoCode**：原 `sudocode.us` 预设原位替换为 `sudocode.chat` 的新赞助商 SudoCode，覆盖六个客户端（Claude 系直连 Anthropic 透传，Codex / OpenCode / OpenClaw / Hermes 默认 `gpt-5.6-sol`）。
- **火山 / 豆包 / BytePlus 官网链接**：撤销了 v3.16.5 把这三个预设 `websiteUrl` 改为产品主页的改动，恢复为带归因参数的活动 / 邀请链接（这是有意为之的设计）。
- **Code0.ai**：邀请链接更新为新的 agent 注册链接；API 端点不变。
- **删除重复的 OpenAI Compatible 预设**：OpenCode 与 OpenClaw 预设列表里的 `OpenAI Compatible` 自定义模板条目被移除——内置的 `custom` 供应商流程本就提供相同的起点，选择器里不再出现两个指向同一处的入口。存量供应商不受影响。

---

### 修复

#### Codex OAuth 客户端身份对齐：修复最新 ChatGPT 模型 404

用官方 Codex OAuth 账号经本地代理接管路由时，最新的订阅模型（如 `gpt-5.6-luna`）此前会返回误导性的 `404 Model not found`——明明账号有权限。根因是 ChatGPT 的 Codex 后端按 `originator` + `version` 头做模型分组路由，而 cc-switch 此前自报 `originator: cc-switch` 且不带版本号，被路由到一个 luna 尚未部署的分组。现在接管请求发送与真实 Codex CLI 一致的 `originator: codex_cli_rs` + `version: 0.144.1`，满足 luna 的最低客户端版本要求，经真实后端 A/B 实测确认修复。

#### Responses 上游失败不再变成空回复

代理把 Anthropic 格式客户端（Claude Code / Claude Desktop）桥接到 OpenAI Responses 上游时，上游藏在 HTTP 2xx 体里的语义失败（`status:"failed"` 对象、`error` 信封、首个输出前的 `response.failed` SSE 事件）此前会被转换成一个悄无声息的空回合。现在这些失败在重试循环内就被识别为真实错误，failover 能够换一个供应商重试；干净结束但内容不完整的流会如实标记为截断而非完成；无视 `stream:true` 直接返回整个 JSON 文档的网关也能被识别并展开为完整的流式生命周期；客户端历史本身格式错误时立即报错，不再拿着必败的请求把每个供应商都重试一遍。

#### 跨 Responses/Anthropic 桥保留推理、工具结果与 system 角色

多轮工具循环里跨 Responses↔Anthropic 桥的内容不再丢失或损坏：加密的推理（reasoning）条目无损往返（往返失败会导致下一轮请求被上游拒绝的问题同步消除）；流式转换器支持官方的推理事件词汇表并在网关跳过增量时从终结事件恢复工具参数；结构化工具结果的 `is_error` 标志、图片与 PDF 文档在两个方向都完整保留，不再被压平成一个 JSON 字符串；历史里的 `system` / `developer` 消息被正确提升为 Anthropic `system`，不再被静默降级成用户发言。计费上，上游请求成功但后续转换失败时用量照记，不再漏账。

#### 缓存写入 token 不再双重计费

Codex / Gemini 类供应商上报的 `input_tokens` 同时包含缓存读与缓存写，而成本计算此前只减掉了缓存读——缓存写入 token 被按输入价和缓存创建价**计了两次费**。现在两者都会先行扣除，并且缓存写入数字在跨格式转换（Chat↔Responses↔Anthropic）时不再丢失。为了让历史数据口径不乱，数据库新增一列记录每行 `input_tokens` 的存储语义（schema v12→v13 自动迁移）：旧行按旧口径回算、新行按新口径，Claude 类行不受影响。

#### 更强的提示缓存断点注入

在注入 Anthropic `cache_control` 断点的代理路径上（Codex 接管桥与 Bedrock 原生优化器），注入器现在会更充分地使用四个断点预算：除了工具尾、系统尾与最新可缓存消息外，预算有余时再给较早的用户消息加一个锚点，让稳定前缀保持在 Anthropic 20 块回看窗口内——长的、工具密集的对话能持续命中提示缓存，而不是每轮把系统提示、工具与历史全价重发。调用方自带的断点被原样保留（绝不删除、重排或改写）；注入的标记一律使用标准 5 分钟 TTL。

#### Kimi For Coding 的 256K 上下文窗口真正生效

Kimi For Coding 预设在 3.16.4 加的 `CLAUDE_CODE_AUTO_COMPACT_WINDOW=262144` 其实**从未生效**：Claude Code 对不认识的模型 id 按 200K 窗口封顶，且压缩窗口取 `min(模型窗口, 设定值)`，262144 被钳回 200K。本版补齐了缺失的两环——预设同时钉上 `CLAUDE_CODE_MAX_CONTEXT_TOKENS`，并把各档模型显式路由到端点的 `kimi-for-coding` 别名（`claude-` 前缀 id 会让 Claude Code 无视这两个窗口参数，非 Claude 别名才是解锁大窗口的关键）。已保存的供应商在切换时也会自动注入这两个窗口默认值，但**别名路由只存在于预设里**——旧预设存下来的供应商实际仍是 200K，需要重新套用一次预设（见「升级提醒」）。

#### 删除的 Codex MCP 服务器不再复活

MCP 服务器的权威数据在数据库里，Codex live `config.toml` 中的 `[mcp_servers]` 只是每次写入后重新同步的投影——但切走供应商时这份投影会被固化进供应商快照，导致你在应用里删掉的服务器在下次激活该供应商时死而复生，且逐条对账永远清不掉这个孤儿。现在切走时会把 `[mcp_servers]`（含旧式 `[mcp.servers]`）从存储快照中剥离，已被污染的快照在下次切走时自愈。一个可见的副作用：手写在 Codex 供应商配置里的 `[mcp_servers.*]` 段会在首次切走时被剥出快照——今后请通过 MCP 管理器定义 Codex 的 MCP 服务器（见「升级提醒」）。

#### MCP 同步更健壮：解析失败不清空文件、按应用报错

两处修复。其一，向 Codex 写入单个 MCP 服务器时，如果现有 `config.toml` 解析失败，旧逻辑会退到空文档再整体写回——**整个文件被清空**、只剩那一个 MCP 条目；现在直接返回校验错误并保持文件原样。其二，「从应用导入」此前把每个导入器的错误吞成 0，坏掉的 Codex 配置只会显示「导入了 0 个服务器」；现在逐应用尽力导入、失败时报出具体是哪个应用出了问题。切换与保存时的投影也改为只针对目标应用，一个应用的 live 文件解析失败不再连坐阻塞其它应用、也不再把已经成功的切换误报为失败。

#### Codex 通用配置合并保留注释与键序

Codex 供应商表单里勾选 / 取消「应用通用配置」此前走前端 TOML 实现整篇重排（解析 → 合并 → 序列化）：注释被丢弃、键被重排、还会凭空多出 `[model_providers]` 这类空表头——就是「config.toml 老被重排」的元凶。现在合并走后端命令、与写 live 配置共用同一套合并语义，手写格式在编辑期合并中完整幸存；针对异步化引入的快速切换竞态也加了双重守卫（操作序号 + 配置基线核对），先发后至的旧结果不会覆盖新状态。

#### 受管 Claude 接管只注入单个 auth 占位符

从第三方端点切到 Codex 受管供应商时，`~/.claude/settings.json` 里会同时写入 `ANTHROPIC_API_KEY` 和 `ANTHROPIC_AUTH_TOKEN` 两个占位符，导致 Claude Code 每次启动都警告「Both ANTHROPIC_AUTH_TOKEN and ANTHROPIC_API_KEY set」。现在只注入一个：Codex 受管走 `ANTHROPIC_AUTH_TOKEN`、Copilot 走 `ANTHROPIC_API_KEY`，其余 token 键一律清除。注意：升级后如果 live 配置已带着双键，由于「配置未变则跳过重写」的短路逻辑，警告可能仍在——把 Claude 路由开关关再开一次（或切换一次供应商）即可触发重写（见「升级提醒」）。（[#5095](https://github.com/farion1231/cc-switch/pull/5095)，修复 #4919）

#### 用量与配额查询：瞬时失败可自动重试、不再毒化缓存

用量与配额查询频繁出现手动刷新也清不掉的「查询失败」，根因是所有传输层失败（包括读响应体中途超时）都被折叠成了「成功但结果为失败」——前端的自动重试从不触发，失败体还被当作真实数据缓存。现在传输失败如实返回错误：react-query 自动重试生效，HTTP 429 与 5xx 一样按瞬时失败处理，保留的上次成功数据按 10 分钟窗口正常过期，失败状态下页脚保留重试入口与真实错误信息。（修复 [#3820](https://github.com/farion1231/cc-switch/issues/3820)）

#### Codex 子代理会话用量计入本地统计

Codex 子代理（spawned agent）会话的 token 用量此前完全没进本地统计：子代理日志里携带的是父线程的 `session_id`，多个子代理的记录互相碰撞、被当作重复丢弃。现在解析器按每个文件自己的 `thread_id` 建立唯一身份，并识别子代理日志开头对父线程历史的重放、只用它恢复累计基线而不重复计费；归档日志也按文件名继承同步游标，重新解析只导入新增部分。（[#5187](https://github.com/farion1231/cc-switch/pull/5187)）

#### Codex 免费版 30 天配额窗口正常显示

Codex 免费账号按 30 天滚动窗口计量（而非付费版的周窗口），但前端白名单和托盘分组都不认识 `30_day` 这个档位——免费账号唯一的档位被过滤掉后，配额页脚整个空白、托盘也不显示任何配额。现在 30 天档位在页脚和托盘都正常渲染，四语标签同步。（[#4886](https://github.com/farion1231/cc-switch/pull/4886)，修复 #3651）

#### 用量看板刷新间隔持久化

用量看板的自动刷新间隔此前是组件内状态，每次重启都重置回 30 秒。现在通过新的应用设置持久化，改动乐观生效、保存失败自动回滚。（[#5057](https://github.com/farion1231/cc-switch/pull/5057)）

#### Fable 档模型键不再泄漏进通用配置

Fable 是 v3.16.3 加入的第四个 Claude 模型映射档，但它的 `ANTHROPIC_DEFAULT_FABLE_MODEL(_NAME)` 两个键漏在了供应商专属排除名单之外——某个供应商的 Fable 模型钉选可能泄漏进共享通用配置、再被注入到其它供应商。现已与 haiku / sonnet / opus 三档一样剥离，并顺带补全了 Fable 档的代理接管支持（接管时写入稳定的角色别名、切走时清理陈旧值）。（[#5206](https://github.com/farion1231/cc-switch/pull/5206)，修复 #4272）

#### 工具 schema 缺省 type 兜底与无分类供应商的 API Key 输入框

两个供应商侧修复：客户端发来的工具如果 `input_schema` 缺顶层 `type`（或干脆是空 `{}`），代理转换后会被严格网关拒绝，现在根 schema 自动补 `type: "object"`（只补根、不动嵌套子 schema）；历史导入或手工构建的无分类供应商在编辑时看不到 Claude API Key 输入框的问题也已修复——现在只要不是官方 / 云厂商类供应商就显示该字段。（[#5069](https://github.com/farion1231/cc-switch/pull/5069)）

#### GLM 5.2 纯文本模型的图片请求兜底

本地代理接管火山 Coding Plan 跑 GLM 5.2 时，请求里的图片块不再产生一个无法恢复的 400：文本-only 名录精确收录 `glm-5.2`（刻意不用前缀匹配，未来的多模态 `glm-5.2v` 不受牵连），预防路径在请求到达前剥离图片；网关那句不含 image 字样的报错（`Model only support text input`）也被反应路径的自证短语名录识别，触发媒体兜底。（修复 [#5025](https://github.com/farion1231/cc-switch/issues/5025)）

#### 会话与 live 配置同步小修一组

- **显示重命名的 Codex 会话标题**：在 Codex 里重命名过的会话，会话管理器现在显示新标题而不是回退到首条消息文本；并发写入时的读取也不再立即失败。（[#4927](https://github.com/farion1231/cc-switch/pull/4927)）
- **OpenCode / OpenClaw / Hermes 的 live 编辑在启动时同步入库**：直接改 live 配置文件（换 base URL、加模型）此前在首次导入后就再也不会被拾取；现在每次启动时对比 live 与库存，差异即更新，全程非致命。（[#4712](https://github.com/farion1231/cc-switch/pull/4712)、[#5098](https://github.com/farion1231/cc-switch/pull/5098)）
- **OpenCode 会话恢复命令更新**：会话管理器展示与复制的恢复命令从过时的 `opencode session resume <id>` 更正为当前 CLI 的 `opencode -s <id>`。（[#2359](https://github.com/farion1231/cc-switch/pull/2359)）
- **官方供应商跳过连通性探测**：连通性检查不再对官方类供应商推导出一个无凭据必失败的第一方端点探测（例如裸打 `chatgpt.com/backend-api/codex`），批量检查直接跳过、单独解析明确报错。

---

### 文档

#### Codex + Kimi 本地路由攻略

新增分步攻略（中 / 英 / 日三语，含界面截图），讲解如何借助 CC Switch 的本地路由在 Codex CLI 里使用 Kimi：较新的 Codex CLI 走 OpenAI Responses 协议，而 Kimi 开放平台（按量付费，`kimi-k2.7-code`）与 Kimi For Coding（会员制，`kimi-for-coding`）暴露的都是 Chat Completions 端点，直连通常在 `/responses` 上 404。攻略覆盖从内置预设添加供应商到四步协议转换链的完整流程。

#### README 赞助商更新

开源 AI 基建项目 `new-api` 加入四语 README 的赞助商表。

---

### 升级提醒

#### Kimi For Coding 供应商需重新套用预设

如果你在用 Kimi For Coding 预设创建的供应商，请**重新从预设选择一次并保存**：256K 窗口的关键——把各档模型路由到 `kimi-for-coding` 别名——只存在于新版预设里，旧预设存下来的供应商即使升级后实际仍按 200K 窗口过早压缩。

#### 手写的 Codex `[mcp_servers.*]` 会被剥出快照

为了根治「删掉的 MCP 服务器复活」，切走 Codex 供应商时会把 `[mcp_servers]` 段从存储快照中剥离。如果你有直接手写在某个 Codex 供应商配置里的 MCP 服务器，它会在首次切走该供应商时从快照消失——请改用 MCP 管理器（MCP 页签）定义 Codex 的 MCP 服务器，那里的条目才是权威数据、会被自动投影到 live 配置。

#### 双 auth 键警告可能需要手动触发一次重写

如果升级后 Claude Code 仍提示「Both ANTHROPIC_AUTH_TOKEN and ANTHROPIC_API_KEY set」，这是因为 live 配置未变时接管逻辑会短路跳过重写。把 Claude 的路由开关关掉再打开一次（或切换一次供应商）即可写入修正后的单占位符配置，警告随之消失。

#### 数据库自动迁移

首次启动 v3.17.0 时数据库会自动从 schema v11 迁移到 v13（新增项目表与用量语义列），无需任何手动操作。如果你有回退到旧版本的习惯，建议先备份 `~/.cc-switch/cc-switch.db`。

---

### 风险提示

本版本继续沿用此前版本对反向代理类功能的风险提示。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。本版新增的「官方 ChatGPT 账号代理路由接管」同样属于此类用法，请知悉相同的风险。

**Codex 第三方供应商 Chat 路由**：通过 CC Switch 本地代理把 Codex 请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束不同，请在使用前阅读目标供应商的服务条款。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，同样需要遵守目标供应商的计费、合规与数据留存约束。

用户启用上述功能即表示自行承担相关风险。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

---

### 致谢

感谢以下贡献者在 v3.17.0 中提交的功能与修复：

- [#5071](https://github.com/farion1231/cc-switch/pull/5071)：新增原生 Anthropic Messages 协议作为 Codex 上游，感谢 @yeeyzy。
- [#4830](https://github.com/farion1231/cc-switch/pull/4830)：新增 Claude 子代理模型配置，感谢 @AkimioJR。
- [#5124](https://github.com/farion1231/cc-switch/pull/5124)：给回退模型字段加上 1M 复选框，感谢 @salarkhannn。
- [#5128](https://github.com/farion1231/cc-switch/pull/5128)：新增智谱团队套餐配额查询，感谢 @zhanxin-xu。
- [#2907](https://github.com/farion1231/cc-switch/pull/2907)：OpenCode 表单新增请求头与 Token 上限编辑器，感谢 @git1677967754。
- [#2811](https://github.com/farion1231/cc-switch/pull/2811)：通用供应商添加后自动同步，感谢 @hubutui。
- [#4838](https://github.com/farion1231/cc-switch/pull/4838)：LongCat 预设升级到 LongCat-2.0，感谢 @solthx。
- [#5095](https://github.com/farion1231/cc-switch/pull/5095)：受管 Claude 接管只注入单个 auth 占位符，感谢 @fengshao1227。
- [#5187](https://github.com/farion1231/cc-switch/pull/5187)：Codex 子代理会话用量计入统计，感谢 @starmiaoa。
- [#4886](https://github.com/farion1231/cc-switch/pull/4886)：修复 Codex 免费版 30 天配额窗口不显示，感谢 @SaladDay。
- [#5057](https://github.com/farion1231/cc-switch/pull/5057)、[#4927](https://github.com/farion1231/cc-switch/pull/4927)、[#2359](https://github.com/farion1231/cc-switch/pull/2359)：刷新间隔持久化、重命名会话标题显示与 OpenCode 恢复命令修正，感谢 @makoMakoGo。
- [#5206](https://github.com/farion1231/cc-switch/pull/5206)：Fable 模型键排除出通用配置，感谢 @fzh365。
- [#5069](https://github.com/farion1231/cc-switch/pull/5069)：工具 schema 缺省 type 兜底与 API Key 输入框恢复，感谢 @Komikawayi。
- [#4712](https://github.com/farion1231/cc-switch/pull/4712)、[#5098](https://github.com/farion1231/cc-switch/pull/5098)：OpenCode / OpenClaw / Hermes live 配置启动同步，感谢 @allenxu09。

也感谢所有反馈 Codex 官方路由、缓存计费、MCP 同步与配额查询问题的用户——本版相当一部分修复来自这些真实使用场景里的复现线索。

---

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.17.0-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.17.0-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

Windows ARM64 设备请选择文件名中带 `arm64` 标识的对应制品。

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.17.0-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.17.0-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.17.0-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

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

- `CC-Switch-v3.17.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.17.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.16.5] - 2026-07-01

> 这一版的重头戏是**让原生 Responses 格式的国产模型供应商真正适配到位**——为小米 MiMo、火山豆包、千问 Qwen3-Coder、美团 LongCat、MiniMax 等具备原生 Responses 端点的供应商生成 Codex 模型目录，让 Codex 桌面能看到这些模型、内置工具也能正常工作，并对少数拒收 `web_search` 的国产网关自动禁用该工具、避免请求被硬性拒绝。另有两处重要改进：切换供应商时，你在应用内新增的插件、环境变量等会**自动回写到通用配置并带给下一个供应商**；Linux（Wayland + NVIDIA）上「标题栏能点、页面点不动、缩放黑屏」的问题，现在也能用一个环境变量开关自救。本版还带来 Claude Sonnet 5 定价与默认档升级、两级分组的会话视图，以及一批凭据安全与平台兼容修复。

### 使用攻略

本版的新能力主要落在 Codex 供应商表单、会话面板与用量 / 通用配置里，建议结合以下文档了解：

- **[Codex 桌面看不到自定义模型？](/zh/tutorials/codex-desktop-custom-model-visibility)**：本版重做了**原生直连时的模型目录生成**——当 Codex 供应商使用原生 Responses（`openai_responses`）直连时，CC Switch 会生成 `~/.codex/cc-switch-model-catalog.json`，让 Codex 桌面能显示配置的自定义模型、工具也可用。若你此前配过原生 Codex 供应商，请**重新保存一次**以生成新目录（详见下方「升级提醒」）。
- **[用量统计](/zh/docs?section=proxy&item=usage)**：了解用量看板的数据来源与统计口径。本版新增了 Claude Sonnet 5 定价，并修复了用量脚本凭据被当作「显式覆盖」持久化的问题。
- **[设置](/zh/docs?section=getting-started&item=settings)**：Codex 上游格式选择器与本地路由开关、Claude 通用配置（现更名为「应用通用配置」并支持切换时自动同步）都在供应商表单的高级选项里。

---

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

---

### 概览

CC Switch v3.16.5 是 v3.16.4 之后的一版维护更新，核心是把**国产模型供应商的 Codex 原生直连做通**。v3.16.4 已经把千问 / 百炼、小米 MiMo、火山豆包、美团 LongCat、MiniMax 等供应商切到了原生 Responses 端点，本版进一步为它们生成 Codex 所需的**模型目录**（`~/.codex/cc-switch-model-catalog.json`），让 Codex 桌面真正能看到这些自定义模型、内置工具也能正常调用，并把模型映射从「本地路由」开关里彻底解耦。针对少数第一方模型不支持 OpenAI 内置 `web_search` 的国产网关（MiMo、LongCat、MiniMax、Qwen3-Coder），本版还会自动禁用该工具，避免 Codex 默认带上它触发硬 400。

围绕日常使用体验，本版让 Claude 的**通用配置在切换供应商时自动同步并传递**——你在应用内新增的插件、环境变量、主题等会先回写到通用配置、再带给下一个供应商，不会在切换时丢失；给 Linux（Wayland + NVIDIA）上点击失灵 / 黑屏的用户加了一个可自救的环境变量开关；补上 Claude Sonnet 5 定价并把默认 Sonnet 档升级到它；带来「供应商 → 项目目录」两级分组的会话视图；并修了一串凭据安全（通用配置片段剥离全部密钥、用量脚本凭据仅作显式覆盖）、平台兼容（Hermes Windows 配置目录、Windows Codex npm 影子命令）与界面（长下拉滚动、窄窗口日期选择器）的问题。此外也新增了若干供应商预设，开箱即可选用。

**发布日期**：2026-07-01

**更新规模**：36 commits | 93 files changed | +5,678 / -2,804 lines

---

### 重点内容

- **让国产模型供应商的 Codex 原生直连真正可用**：为小米 MiMo、火山豆包、千问 Qwen3-Coder、美团 LongCat、MiniMax 等国产供应商生成 Codex 模型目录（`~/.codex/cc-switch-model-catalog.json`），让 Codex 桌面能看到这些模型、内置工具可用；并对拒收 `web_search` 的国产网关（MiMo、LongCat、MiniMax、Qwen3-Coder）自动禁用该工具、避免硬 400。**存量原生供应商需重存一次**以生成新目录。
- **通用配置切换时自动同步并传递**：切走一个启用了通用配置的 Claude 供应商时，你在应用内新增的插件、环境变量、主题、hooks 会先自动回写到通用配置，再带给下一个供应商——不再在切换时被覆盖丢失。
- **Linux Wayland 点击失灵 / 黑屏的自救开关**：遇到 Wayland + NVIDIA 上「标题栏能点、页面点不动、缩放黑屏」时，用 `CC_SWITCH_GDK_BACKEND=wayland` 启动即可切回原生 Wayland（平铺式合成器上遇到反向问题可设为 `x11`）。
- **Claude Sonnet 5**：新增 Sonnet 5 定价，并把各预设的默认 Sonnet 档升级到 `claude-sonnet-5`。
- **会话分类视图与分组管理**：会话面板新增「供应商 → 项目目录」两级分组视图，分组头支持三态复选框一键批量选择。
- **新增供应商预设**：新增七牛云、FennoAI、ZetaAPI、TeamoRouter、NekoCode、Code0.ai、Amux 等供应商预设，覆盖各受管应用，开箱即可选用。

---

### 新功能

#### 国产模型供应商的 Codex 原生直连（生成模型目录）

本版把国产供应商的 Codex 原生直连做通了。继 v3.16.4 把小米 MiMo、火山豆包、千问 Qwen3-Coder、美团 LongCat、MiniMax 等供应商切换到原生 Responses（`apiFormat: "openai_responses"`）之后，本版推翻了当时「原生直连就删掉模型目录」的做法：这些供应商不经过本地代理直连时，CC Switch 会为它们生成 `~/.codex/cc-switch-model-catalog.json`，让 Codex 桌面真正显示这些自定义模型、内置工具也能用——不会触发像 MiMo 这类原生网关会拒绝的 freeform `apply_patch`（`type=custom`）工具（编辑回退到 `shell_command`）。目录生成按 `apiFormat` 判定、与「本地路由」开关解耦，因此一个原生供应商无需开启本地路由映射也会持久化目录；而 `openai_chat` 格式仍保持既有的 Responses↔Chat 代理转换不变。由于 Codex 解析器要求每个条目都带 `base_instructions`，原生模板携带一个中性默认值、由各厂商官方文案覆盖（MiMo、MiniMax）。**存量原生供应商需重新保存一次以生成有效目录**（无需数据库迁移）。

配套地，对少数第一方模型不支持 OpenAI 内置 `web_search` 工具的国产网关（MiMo、LongCat、MiniMax、Qwen3-Coder），本版会在切换时自动禁用该工具，避免 Codex 默认带上它、被网关以硬 400 拒绝（详见下方「修复」）。

#### 会话分类视图与分组管理

会话管理面板在原有平铺列表之外新增了分组视图，通过工具栏的 List / ListTree 选择器切换，视图模式与展开状态都持久化到 `localStorage`。分组构建「供应商 → 项目目录」两级层级：按项目目录名归组，缺少项目目录的会话落入「未知目录」桶。两级都是可折叠区块，并提供「全部折叠」按钮；在批量模式下，每个分组头会出现一个三态复选框，可一键选中 / 取消该组内全部可选会话，并显示已选 / 可选计数徽标。四语（zh / en / ja / zh-TW）文案已同步。该改动完全在前端，不涉及后端命令或数据访问层。（[#4776](https://github.com/farion1231/cc-switch/pull/4776)）

#### Claude Sonnet 5 模型定价

在 `schema.rs` 里按 Anthropic list 价新增 `claude-sonnet-5` 定价行——输入 / 输出 \$3 / \$15 每百万 token、缓存读写 \$0.30 / \$3.75，与 Sonnet 4.6 一致。介绍期 \$2 / \$10 促销（有效期至 2026-08-31）刻意不入表，让记账反映稳态 list 价而非临时折扣。该行在应用下次启动时通过 `ensure_model_pricing_seeded` 应用，无需 `SCHEMA_VERSION` 变更。

#### 新增供应商预设

本版新增了一批供应商预设，选中后填入自己的 API Key 即可使用：

- **七牛云（Qiniu）**：覆盖全部 7 个受管应用（含 Gemini），中转原生 Claude / GPT / Gemini。
- **FennoAI / ZetaAPI / TeamoRouter / NekoCode**：各覆盖 6 个应用（Claude、Claude Desktop、Codex、OpenCode、OpenClaw、Hermes）。
- **Code0.ai**：覆盖全部 7 个应用（含 Gemini）。
- **Amux**：覆盖 6 个应用。

各预设的端点与默认模型已按对应应用配好——Claude 类走 Anthropic 兼容主机直连、Codex 走原生 Responses、其余走 OpenAI 兼容 `/v1`。

---

### 变更

#### 切换供应商时自动同步并传递通用配置

这是本版一个很实用的改动：切走一个启用了通用配置的 Claude 供应商时，服务会先从它的 live `settings.json` 里**重新提取可共享部分、更新到通用配置**，再带给下一个供应商，而不再只是单向写入。这样一来，你在运行中的应用里直接新增的插件（`enabledPlugins`）、hooks、环境变量（`env`）、主题（`theme`）等共享配置就不会在切换时被静默丢失，而是自动跟着走到下一个供应商；删除也会同步（移除的键不会被再次注入）。该同步严格限定在启用了通用配置的 Claude 供应商，被显式清空时会跳过，且所有失败都是非致命（仅告警）、永不阻断切换。

#### Codex 模型映射与「本地路由」开关解耦

Codex 供应商表单向 Claude Code 对齐——模型映射目录现在独立于路由接管，因为原生 Responses 供应商（MiMo、豆包、MiniMax）需要它来做无代理直连，而 Chat 供应商无论如何都走代理。「需要本地路由」开关被移除（它没有后端字段，只是门控目录 / 推理的持久化，等价于「映射是否填了」）。模型映射现在对非官方供应商始终显示、非空即持久化，而推理能力的显示 / 持久化改由 Chat 格式门控。四语（zh / en / ja / zh-TW）文案随之重写。顺带修复了 `useCodexConfigState` 在加载已存供应商时丢掉 `supportsParallelToolCalls` / `inputModalities` / `baseInstructions` 的问题（会在编辑时静默丢失并行工具、图像输入与官方 base instructions）。

#### 默认 Sonnet 档升级到 Claude Sonnet 5

把各供应商预设里的默认 Sonnet 档从 `claude-sonnet-4-6` 升级到 `claude-sonnet-5`（覆盖 claude / claude-desktop / hermes / openclaw / opencode 预设与通用 `NEWAPI_DEFAULT_MODELS`），涉及 `ANTHROPIC_MODEL` / `ANTHROPIC_DEFAULT_SONNET_MODEL` / `ANTHROPIC_DEFAULT_OPUS_MODEL` 等键及其带前缀变体。Claude Desktop 的默认路由 sonnet `route_id` 也一并迁移到 `claude-sonnet-5`。非 Anthropic 的 pin（gpt / gemini / glm / sonnet-4-5）保持不变。

#### 豆包带日期 model id 与定价归一化

豆包（DouBaoSeed）预设的 model id 切换到带日期的 `doubao-seed-2-1-pro-260628`（覆盖各应用），因为火山方舟会以 404 拒绝裸名 `doubao-seed-2-1-pro`、只接受完整带日期 id。由于真实用量现在带日期后缀，`strip_model_date_suffix` 扩展为也能剥掉火山的 6 位 YYMMDD 形式（并校验月 01-12、日 01-31 以免误伤 `-123456` 这类非日期版本后缀），从而归一化命中定价表里的裸名 seed 行、修复豆包模型显示 \$0 成本的问题。

###「写入通用配置」更名为「应用通用配置」

原标签「写入通用配置」在数据流向上有歧义（读起来像「把当前配置写进通用配置」），而实际行为相反——是把已存的通用配置片段合并进本供应商配置。复选框在四语（zh / en / ja / zh-TW）里更名为「应用通用配置」，包括所有提示 / 攻略 / 说明引用，日文用户手册与 `README_JA.md` 也一并同步。（[#4829](https://github.com/farion1231/cc-switch/pull/4829)）

#### 其它预设与资源调整

- **OpenClaw 豆包上下文对齐 262144**：OpenClaw 的 DouBaoSeed 预设此前硬编码 128000，而 Codex 侧同模型用 262144，导致 OpenClaw 用户窗口偏小；已对齐并加了跨预设一致性测试防止再次漂移。
- **火山 / 豆包 / BytePlus 官网链接订正**：这三个预设的「访问官网」链接被误设成了控制台 / 注册链接，已恢复为干净的产品主页。
- **过大的供应商图标降采样到 256px**：一批捆绑图标此前远大于其 ~32px 的实际渲染尺寸，降采样后显著减小体积、无代码 / 文件名 / 导入改动（如 ZetaAPI 940KB→40KB、relaxcode 1.16MB→42KB），并删除了从未被引用的 1.4MB `dds.svg` 孤儿。

---

### 修复

#### 对拒收 `web_search` 的原生 Codex 网关禁用该工具

一些原生 `/responses` 网关的第一方模型不具备 OpenAI 内置的 `web_search` 工具，会以「tool type 'web_search' is not supported」拒绝，而 Codex 默认就会带上该工具，导致硬 400。CC Switch 现在会为这些厂商写入顶层 TOML 行 `web_search = "disabled"`。作用域是一份黑名单（默认开启）：仅命中 `base_url` 主机（`xiaomimimo.com`、`longcat.chat`、`minimax.io`、`minimaxi.com`）或模型品牌前缀（`mimo`、`longcat`、`minimax`、`qwen3-coder`）的供应商会被禁用，因此中转真 GPT、豆包、通用 Qwen 及任何未知供应商都保持 Codex 默认。其中 `qwen3-coder` 前缀只压制原生 `qwen3-coder-plus`（百炼 / DashScope 对 coder 系标记内置工具不支持），共享同一主机的通用 Qwen 保持开启；匹配走模型轴（会剥掉聚合器的 `vendor/` 路径段），因此也能兜住硅基流动这类中转拒收厂商模型的情形。选黑名单而非模糊的「是不是 GPT」白名单，是因为误让 `web_search` 保持开启会以硬 400 失败；同时用归属哨兵保证 CC Switch 只会移除由它自己写入的 `disabled` 值，因此存量供应商无需重存、切回也会重新启用。此外顺带把 LongCat-2.0-Preview 预设的上下文窗口从 131072（128K）订正为真实的 1048576（1M）。

#### 通用配置片段剥离全部凭据类键

`extract_claude_common_config` 此前只脱敏 `ANTHROPIC_API_KEY` 与 `ANTHROPIC_AUTH_TOKEN`，但 Claude 供应商合法地携带其它凭据（`OPENROUTER_API_KEY`、`GOOGLE_API_KEY`，可能还有 OpenAI / Gemini / AWS Bedrock / Vertex 密钥），这些可能泄漏进共享片段、再被注入到其它供应商。提取现在会按模式匹配并剥掉任何凭据形态的环境变量键（`*_API_KEY` / `*_AUTH_TOKEN` / `*secret*` / `*token*` 等），同时保留 `MAX_OUTPUT_TOKENS` 这类合法可共享的复数 `*_TOKENS` 值。手动「提取」与一次性自动提取路径的同一泄漏也一并堵上。

#### 用量脚本凭据仅作显式覆盖持久化

供应商用量脚本存有可选的 `api_key` / `base_url` 字段用于查询配额时覆盖 live 凭据，但它们此前会静默镜像供应商自身的凭据——因此复制供应商或修改主 API key / base URL 后，用量脚本仍 pin 在旧端点旧 key，配额查询一直打向陈旧目标。现在 `ProviderService` 在持久化前会归一化：若脚本的 `api_key` 或 `base_url` 与供应商解析出的用量凭据相同（或为空）就清为 `None`，让查询回退到 live 配置；真正不同的覆盖才保留（`token_plan` 类脚本不动）。deeplink 导入路径也加了对应的归一化，前端在更新时会失效相关缓存键让首页用修正后的配置重新查询。（[#4654](https://github.com/farion1231/cc-switch/pull/4654)）

#### Hermes 配置目录在 Windows 上正确解析

CC Switch 此前硬编码 `~/.hermes` 作为 Hermes 配置目录，但 Hermes 自身是按 `HERMES_HOME` 环境变量、再退到平台默认（Windows 上 `%LOCALAPPDATA%\hermes`）解析的。在 Windows 上这意味着 CC Switch 把供应商配置写到了 Hermes 根本不读的路径，导致供应商切换无效。`get_hermes_dir()` 现在镜像 Hermes 自己的解析顺序——显式覆盖、`HERMES_HOME`（原样取用、不做 `~` 展开）、平台默认——从而重新尊重被 #3470 丢掉的 `HERMES_HOME`（Hermes 的 Windows 安装器把它作为重定位安装的首要机制）。（[#4680](https://github.com/farion1231/cc-switch/pull/4680)，参见 #3178、#3470）

#### Linux Wayland：允许覆盖 AppImage 强制的 `GDK_BACKEND=x11`

AppImage 的 GTK 启动钩子无条件导出 `GDK_BACKEND=x11` 以规避一个历史上的原生 Wayland 崩溃。在较新的 Wayland + NVIDIA 环境上，这个被强制的 XWayland 会让 WebKitGTK 网页内容收不到指针事件（标题栏可点、页面却死了）、并在缩放时黑屏，而既有的 `WEBKIT_DISABLE_*` 缓解不起作用，因为根因是被强制的窗口后端而非渲染。`main.rs` 现在会在 GTK 初始化前读取一个可选的 `CC_SWITCH_GDK_BACKEND` 逃生开关（AppImage 的启动钩子从不改动它）：不设保持现状（零回归）。遇到上述问题时，用它切回原生 Wayland 启动即可：

```bash
CC_SWITCH_GDK_BACKEND=wayland ./CC-Switch-*.AppImage
```

该覆盖是通用的——若你在平铺式 Wayland 合成器上遇到的是反向的输入问题，则改设为 `CC_SWITCH_GDK_BACKEND=x11`。（[#4351](https://github.com/farion1231/cc-switch/pull/4351)，修复 #4350）

#### Claude Desktop / OpenClaw / Hermes 表单显示「获取 API Key」链接

API key 输入框下的「获取 API Key」链接与合作推广块此前只对 claude / codex / gemini / opencode 生效。Claude Desktop 渲染的是不显示它的裸输入框，而 OpenClaw / Hermes 则被两处遗漏挡住（白名单只列了那四个 appId、供应商分类解析只认那四类预设 id 模式）。现在 Claude Desktop 改用共享的 `ApiKeySection`，白名单与分类解析都补上了 claude-desktop / openclaw / hermes；此外 Hermes / OpenClaw 表单不再让「官方」分类禁用 key 输入（这两个应用没有只走 OAuth 的官方供应商，如 Hermes 的 Nous Research 虽是官方但仍需用户自填 key）。

#### 去重 Windows 上的 Codex npm 影子命令

在 Windows 上，npm 会把一个工具装成三个同名兄弟文件——`codex.cmd`、`codex.exe` 和一个无扩展名的 Unix shim `codex`——而 CC Switch 此前把三者都列为候选，导致无法直接执行的无扩展名 shim 被当作多余 / 失败候选去探测。现在仅当相邻没有可执行的 `.cmd` / `.exe` 兄弟时才追加无扩展名路径，路径解析也会优先选可执行的 `.cmd` / `.exe`，从而把版本探测与启动锚定到真正可运行的 Windows shim 上。（[#4782](https://github.com/farion1231/cc-switch/pull/4782)）

#### 长下拉列表的滚动边界

`SelectContent` 弹层此前用 `overflow-hidden` 且没有高度上限，因此选项很多的下拉（如长模型 / 供应商列表）会渲染得比视口还高、把溢出项裁掉且无法触及。现在它设了 `max-h-[min(24rem,var(--radix-select-content-available-height))]` 与 `overflow-y-auto`，把内容限制在 24rem 或 Radix 计算出的可用高度内并允许纵向滚动。（[#4798](https://github.com/farion1231/cc-switch/pull/4798)）

#### 日期范围选择器的日历在窄弹层里保持可见

自定义日期范围选择器此前按**视口宽度**（Tailwind `sm:` 640px 断点）切换两列布局（日期字段 | 日历），但弹层被夹在 `100vw - 2rem` 且锚定到触发器，实际可用宽度比视口窄。在窄窗口上，两列布局可能在弹层只放得下一列时被激活，把日历列挤出右边界裁掉（月份头与 7 列里的 4 列被切掉且无法触及）。现在布局改用 **CSS 容器查询**按弹层自身的行内尺寸切换，因此只有当弹层本身窄时才收成一列，让日历在任意窗口宽度下都完整可见。（[#4860](https://github.com/farion1231/cc-switch/pull/4860)）

---

### 文档

#### `CC_SWITCH_GDK_BACKEND` 逃生开关文档

为可选的 `CC_SWITCH_GDK_BACKEND` 环境变量新增了 FAQ 条目，覆盖全部四种 README 语言与 zh / en / ja 用户手册的排障页，说明 Wayland + NVIDIA 用户如何在网页内容「点击失灵 + 缩放黑屏」时切回原生 Wayland，以及平铺式 Wayland 用户如何设为 `x11` 处理反向输入问题。

#### Kimi 海外 README 指向 platform.kimi.ai

英语、德语、日语 README 的 Kimi K2.7 Code 合作段落的横幅与内联行动号召改指 `https://platform.kimi.ai?aff=cc-switch`（保留推荐标签），四语 README 也都新增了一行指向 `https://www.kimi.com/code/?aff=cc-switch` 的 Kimi For Coding 订阅推广。

---

### 升级提醒

#### 原生 Codex 供应商需重存一次

本版重做了原生 Responses 直连的模型目录生成。如果你此前配过使用原生 Responses（`openai_responses`）的 Codex 供应商，请**重新从预设选择或打开该供应商并保存一次**，以生成新的 `~/.codex/cc-switch-model-catalog.json`——这样 Codex 桌面才能显示自定义模型、工具才可用。此过程无需数据库迁移，也不影响走 `openai_chat` 格式的供应商。

#### `web_search` 黑名单是默认行为

对小米 MiMo、美团 LongCat、MiniMax、千问 Qwen3-Coder 这些已知拒收 `web_search` 的原生网关，本版会在切换时自动写入 `web_search = "disabled"`。中转真 GPT、豆包、通用 Qwen 及未知供应商不受影响、保持 Codex 默认。该开关由 CC Switch 用归属哨兵管理，切回到未命中黑名单的供应商会自动恢复，无需手动干预。

#### 默认 Sonnet 档变化

新从预设创建的 Claude 类供应商，其默认 Sonnet 档现在指向 `claude-sonnet-5`。已配置好的存量供应商不受影响、配置保持原样；如需改用 Sonnet 5，可重新从预设选择一次并保存。

---

### 风险提示

本版本继续沿用此前版本对反向代理类功能的风险提示。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**Codex 第三方供应商 Chat 路由**：通过 CC Switch 本地代理把 Codex 请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束不同，请在使用前阅读目标供应商的服务条款。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，同样需要遵守目标供应商的计费、合规与数据留存约束。

用户启用上述功能即表示自行承担相关风险。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

---

### 致谢

感谢以下贡献者在 v3.16.5 中提交的功能与修复：

- [#4776](https://github.com/farion1231/cc-switch/pull/4776)：新增会话分类视图与分组管理，感谢 @alkaid616。
- [#4829](https://github.com/farion1231/cc-switch/pull/4829)：把「写入通用配置」更名为「应用通用配置」，感谢 @arichyx。
- [#4654](https://github.com/farion1231/cc-switch/pull/4654)：让用量脚本凭据仅作显式覆盖持久化，感谢 @yyhhyyyyyy。
- [#4680](https://github.com/farion1231/cc-switch/pull/4680)：修复 Windows 上 Hermes 供应商配置不生效，感谢 @thisTom。
- [#4782](https://github.com/farion1231/cc-switch/pull/4782)：去重 Windows 上的 Codex npm 影子命令，感谢 @justjavac。
- [#4798](https://github.com/farion1231/cc-switch/pull/4798)：修复长下拉列表无法滚动，感谢 @xwil1。
- [#4351](https://github.com/farion1231/cc-switch/pull/4351)：允许通过 `CC_SWITCH_GDK_BACKEND` 覆盖 AppImage 强制的 `GDK_BACKEND=x11`，感谢 @BoneLiu。
- [#4860](https://github.com/farion1231/cc-switch/pull/4860)：让日期范围选择器的日历在窄弹层里保持可见，感谢 @SaladDay。

也感谢所有在 v3.16.4 发布后反馈 Codex 原生直连、通用配置、凭据复用与平台兼容性问题的用户，很多补丁都来自这些真实使用场景里的复现线索。

---

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.16.5-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.16.5-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

Windows ARM64 设备请选择文件名中带 `arm64` 标识的对应制品。

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.16.5-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.16.5-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.16.5-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

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

- `CC-Switch-v3.16.5-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.5-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.16.4] - 2026-06-27

> 🎉 **CC Switch 跻身 GitHub 全球 Star 排行榜前 100！**
> 感谢每一位用户、贡献者与 Star —— 是你们让它走到这里。🙏

> 继 v3.16.3 把「用量计费做准」之后，这一版把重心放在打磨 Codex 代理链路与丰富用量 / 定价工具上——国产供应商原生 Responses 迁移、上游格式选择器与模型映射解耦、zstd 请求 / 错误体解压，以及一批工具调用与 OAuth 走代理的修复；同时新增本地代理请求覆盖、数据库版本过新时的应用内恢复屏、原生 Windows ARM64 构建，并带来一波预设与品牌更新（SubRouter、OpenCode Go、CTok→ETok 改名、Kimi 品牌刷新与 prime-partner 徽标）。

### 使用攻略

本版以打磨与扩展为主，新增的能力主要落在用量面板与供应商表单的高级选项里，建议结合以下文档了解：

- **[Codex 桌面看不到自定义模型？](/zh/tutorials/codex-desktop-custom-model-visibility)**：不少用户反馈在 Codex 桌面应用里看不到配置的第三方 / 自定义模型。这是 Codex 桌面应用**上游自身的门控行为**（按官方登录状态放行模型选择器），并非 CC Switch 的本地配置问题，**本版（v3.16.4）未对此做改动**；文档里说明了原因，以及可用的缓解办法（保留官方登录 + 路由接管）。
- **[用量统计](/zh/docs?section=proxy&item=usage)**：了解用量看板的数据来源与统计口径。本版新增了从 models.dev 批量导入模型定价、火山方舟 Coding / Agent Plan 的 AK/SK 用量查询，以及自定义日期范围的「实时结束时间」。
- **[设置](/zh/docs?section=getting-started&item=settings)**：本地代理请求覆盖（自定义请求头 / 请求体）、Codex 上游格式选择器与本地路由开关等都在供应商表单的高级选项里。

---

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

---

### 概览

CC Switch v3.16.4 是 v3.16.3 之后的一版维护更新。这一版围绕 Codex 代理链路做了一轮收紧——为多家具备原生 OpenAI Responses 端点的国产供应商切换到原生格式（省去 Responses→Chat 的路由接管转换）、把「上游格式」从「本地路由」开关里独立出来、补上 zstd 请求与错误响应体的解压，并修了一串工具调用与「OAuth 模块绕过全局代理」的问题。

与此同时，本版还丰富了用量与定价工具（从 models.dev 导入定价、火山方舟 Coding / Agent Plan 的 AK/SK 用量查询、自定义日期范围的实时结束时间、GLM-5.2 与豆包 Seed 2.1 定价），新增了一批代理与韧性能力（自定义请求头 / 请求体覆盖、数据库版本过新时的应用内恢复屏、原生 Windows ARM64 构建），并带来一波预设与品牌更新（SubRouter 与 OpenCode Go 订阅、CTok→ETok 改名、Kimi 品牌刷新与 prime-partner 徽标、Kimi K2.7 Code 赞助横幅）。

**发布日期**：2026-06-27

**更新规模**：53 commits | 126 files changed | +8,149 / -1,016 lines

---

### 重点内容

- **国产 Codex 供应商走原生 Responses**：千问 / 百炼、小米 MiMo、火山豆包、美团 LongCat、MiniMax（国内 / 国际）现在直连各自的原生 Responses 端点，不再经过 Responses→Chat 的格式转换接管，链路更短、更稳。
- **本地代理请求覆盖**：供应商可配置自定义请求头与请求体覆盖，由本地代理在转发时应用，并对受保护的安全请求头做了拦截校验。
- **数据库版本过新的应用内恢复屏**：当 SQLite 版本比当前应用支持的更新时，不再死在「重试只会再次失败」的原生弹窗里，而是引导到一个可一键升级应用的恢复界面。
- **更丰富的用量 / 定价工具**：从 models.dev 批量导入模型定价、火山方舟 Coding / Agent Plan 的 AK/SK 用量查询、自定义日期范围的「实时结束时间」，以及 GLM-5.2 与豆包 Seed 2.1 的定价。
- **新预设与品牌更新**：新增 SubRouter 与 OpenCode Go 订阅预设，CTok 改名为 ETok，刷新 Kimi 品牌标识并为官方 Kimi 预设加上 prime-partner 心形徽标。
- **原生 Windows ARM64 构建**：发布产物新增原生 ARM64 版本，ARM 架构的 Windows 设备不再依赖 x64 模拟。

---

### 新功能

#### 数据库版本过新时的应用内恢复屏

当 SQLite 的 `user_version` 比当前应用支持的 `SCHEMA_VERSION` 更新时（例如降级回旧版、或被第三方客户端写过该文件），启动过去会死在一个原生的「重试 / 退出」弹窗里——而「重试」只会再次失败。现在应用会引导到一个专门的恢复界面：有可用更新时提供一键「升级应用」按钮（下载 + 安装 + 重启，带进度条），没有可用更新时则提示即便是最新版也读不了这个数据库。该「版本过新」检查在任何写库动作之前进行，因此应用永远不会对一个读不懂的数据库执行 DDL；恢复模式下的原生关闭会干净退出（此时托盘尚未创建）。（[#4575](https://github.com/farion1231/cc-switch/pull/4575)）

#### 本地代理请求覆盖（自定义请求头与请求体）

供应商配置现在可以定义自定义请求头与请求体覆盖，由本地代理在转发时应用，并通过 Claude 与 Codex 供应商表单里的新字段暴露。输入会经过校验，其中包含一份受保护的请求头名单，用于阻止覆盖安全敏感的请求头。（[#4589](https://github.com/farion1231/cc-switch/pull/4589)）

#### 火山方舟 Coding / Agent Plan 用量查询

用量面板现在可以查询火山方舟（Volcengine Ark）的 Coding Plan 与 Agent Plan 配额。由于方舟控制面 OpenAPI（`open.volcengineapi.com`）要求的是账号级 AccessKey 签名、而非推理 API key，用量脚本新增了独立的 AK/SK 输入区，并配有一个直达火山 IAM 密钥管理控制台（`https://console.volcengine.com/iam/keymanage`）的可点击链接；代理实现了火山签名 V4（一个 AWS SigV4 变体：固定的 canonical header 顺序、`HMAC-SHA256` 算法、`ark` 服务 scope）。它会先探测 `GetAFPUsage`（Agent Plan 的 5 小时 / 周 / 月配额）自动判定套餐，失败再回退到 `GetCodingPlanUsage`，从 `Level` 字段解析窗口标签（并对 `ResetTimestamp <= 0` 做守卫），同时在用量页脚、托盘菜单与四种语言里补上了 `monthly` 档标签。

#### 从 models.dev 导入模型定价

「添加定价」面板新增了一个「从 models.dev 导入」按钮：拉取 `https://models.dev/api.json`，支持全文搜索整个目录，并通过与手动录入相同的 `update_model_pricing` 路径导入所选条目。导入的 model id 会按后端的 `clean_model_id_for_pricing` 规则归一化（剥供应商前缀、转小写、截断 `:` 后缀、把 `@` 映射为 `-`、丢掉 `[1m]` 标记），让落库的行真正能匹配成本归因查询。配套修复让「按范围回填零成本」改用 Rust 端按原始 model 别名（路由前缀、`:free` 变体、日期后缀）匹配，而不再用精确 SQL 字符串匹配，从而新定价的别名行能立刻被计价、而不必等下次启动回填（修复 [#4017](https://github.com/farion1231/cc-switch/issues/4017)）。（[#4079](https://github.com/farion1231/cc-switch/pull/4079)）

#### 原生 Windows ARM64 构建

发布产物现在包含原生的 Windows ARM64 制品，ARM 架构的 Windows 设备可以拿到对应的原生构建，不必再依赖 x64 模拟。发布矩阵也改为各平台独立运行（关闭 fail-fast），因此某个任务缺少密钥而失败（例如 fork 里的 macOS 签名）不会再把尚未完成的同级任务一并取消。（[#3950](https://github.com/farion1231/cc-switch/pull/3950)）

#### 自定义日期范围的实时结束时间

自定义日期范围选择器新增了一个「结束时间跟随当前时间」勾选框；开启后结束时间变为只读并自动跟随此刻，因此用量数据始终反映从所选起点到当下的实时消耗。这在 Coding Plan 的 5 小时配额窗口里尤其有用。`liveEndTime` 已纳入 React Query 的缓存键，因此一个实时范围和一个端点相同的固定范围不会再共用同一个陈旧缓存项。（[#4438](https://github.com/farion1231/cc-switch/pull/4438)）

#### 会话详情头显示源文件名

会话详情头现在会在项目目录旁显示会话日志的文件名（悬停看完整路径、可点击复制），方便用户直接从界面定位并打开底层的 JSONL 文件。对于像 ~70 字符的 Codex rollout 这类没有空格的长文件名，会截断到 `max-w-[200px]`，避免在窄窗口里溢出到操作按钮区。（[#4113](https://github.com/farion1231/cc-switch/pull/4113)）

#### 导入按钮的未托管 Skill 提示

顶栏的 Skills 导入按钮现在会在本地存在未托管的 Skill 可导入时显示一个绿点与提示，让你一眼看出磁盘上的 Skill 还没被纳管。该扫描在挂载时执行一次，并在多次导航间共享（30s `staleTime` + `keepPreviousData`），避免重复磁盘 IO。

#### OpenCode Go 订阅预设

新增 OpenCode Go（`opencode.ai/zen/go`）预设，覆盖 Claude、Codex 与 OpenCode，使用可直接粘贴的纯 API key（无 OAuth）。Codex 预设走 `openai_chat` 转换并带 GLM / Kimi / DeepSeek / MiMo 模型目录（且不带静态 `codexChatReasoning`，按每个模型推断能力），OpenCode 则通过 `@ai-sdk/openai-compatible` 指向 `/zen/go/v1`。四个 OpenCode Go 预设——Claude、Claude Desktop、Codex、OpenCode——都带上了推荐链接与应用内推广文案；推广横幅现在仅凭 `partnerPromotionKey` 即可展示（不再绑定 `isPartner`），因此一个预设可以展示推荐推广却不获得金色付费合作伙伴星标（这也顺带让既有的 MiniMax 推广重新显示出来）。

#### Prime-Partner 预设徽标与排序

第一方 Moonshot Kimi 预设（Kimi / Kimi For Coding / Kimi K2.7 Code）现在被标记为 prime partner：不再显示金色星标，而是渲染一颗实心金色心形（无徽标边框），并在默认（Original）排序里浮到官方分类预设之后、其余之前。分组用三路 partition 实现，每组保持内部顺序，且一个同时被标为 prime-partner 的官方预设只会留在官方组里。

#### GLM-5.2 与豆包 Seed 2.1 定价

种子模型定价现在包含 GLM-5.2（[#4385](https://github.com/farion1231/cc-switch/pull/4385)）与豆包 Seed 2.1 Pro / Turbo，让这些模型的用量被正确计价、而不是记成零成本。豆包价格采用火山官方 list 价（按约 7.14 的汇率折算）；`cache_creation` 保持为 0，因为豆包按时间而非按 token 写入计费缓存存储，既有的 2.0 行也保留以供历史记账。

#### Kimi For Coding 自动压缩窗口

Kimi For Coding 预设现在把 `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 默认设为 262144，与 Kimi 官方文档一致，并通过 `templateValues` 暴露，方便用户为将来的模型或性能调优自定义该值。（[#4401](https://github.com/farion1231/cc-switch/pull/4401)）

#### SubRouter 合作伙伴供应商

新增 SubRouter（`subrouter.ai`，一个让一把 key 访问多模型多供应商的 AI 中转聚合商）作为预设，覆盖全部 7 个受管应用——Anthropic 格式端点用于 Claude Code / Claude Desktop / OpenClaw / Hermes，OpenAI 兼容的 `/v1` 端点（`gpt-5.5`）用于 Codex 与 OpenCode，Gemini 兼容的 `/v1beta` 端点（`gemini-3.5-flash`）用于 Gemini CLI——带上自有品牌图标、金色合作伙伴星标、四语推广文案，以及预填为 API key 注册地址的推荐注册链接（`?aff=l3ri`）。（[#4522](https://github.com/farion1231/cc-switch/pull/4522)）

---

### 变更

#### 国产 Codex 供应商走原生 Responses API

多家国产供应商（千问 / DashScope 百炼、小米 MiMo、火山豆包、美团 LongCat、MiniMax 国内 / 国际）现在暴露了原生的 OpenAI Responses 端点，因此它们的 Codex 预设切换到 `apiFormat: "openai_responses"`，直连上游而不再经过 Responses→Chat 的路由接管转换。丢掉不再需要的 `codexChatReasoning` 与 `modelCatalog` 也让「本地路由映射」开关默认保持未勾选。SiliconFlow 托管的 MiniMax 仍保持 `openai_chat`，因为那是第三方端点、并非 MiniMax 自家 base_url。其余仍走 chat 的供应商也刷新了过期的 model id（GLM 5.1→5.2、StepFun 3.5-flash-2603→3.7-flash、Ling 2.5-1T→2.6-1T）。

#### 上游格式选择器与模型映射开关解耦

Codex 供应商表单此前把 Chat 格式转换与路由接管（模型映射）绑在同一个开关上，导致一个提供原生 Responses API 的供应商无法在不强制 Chat Completions 转换的情况下使用模型映射。现在「上游格式」（Chat Completions / Responses）成了一个独立、始终可见的选择器，而本地路由开关只负责控制高级子区（模型映射目录，以及格式为 Chat 时的推理能力）。它的初始状态由已保存目录是否存在派生，不新增持久化字段；`codexConfig` 的四语（zh / en / ja / zh-TW）文案也随之重写。

#### 豆包 Seed 2.1 Pro 预设

DouBaoSeed 预设现在在全部 6 个客户端（claude、claude-desktop、codex、opencode、openclaw、hermes）指向 `doubao-seed-2-1-pro`（替换 `doubao-seed-2-0-code-preview-latest`），展示名更新为「Doubao Seed 2.1 Pro」，并把 OpenClaw 的成本字段从 0.002 / 0.006 订正为 0.84 / 4.2 美元每百万 token 以匹配新模型。

#### CTok 改名为 ETok

随着厂商对域名、端点与商标的更名，所有面向用户的品牌从 CTok 迁移到 ETok（`ctok.ai`→`etok.ai`、`api.ctok.ai`→`api.etok.ai`，以及内部 id、展示名、图标和 README 合作伙伴横幅），覆盖每一个客户端预设。Codex 历史迁移白名单里仍保留 `ctok` 作为旧 id、与新 `etok` 并存，以保证改名后存量用户的本地会话历史仍被正确分桶。

#### Kimi 预设命名统一

OpenCode 与 OpenClaw 此前被标为「Kimi K2.7 Code」的 Kimi 预设，更名为与其它应用一致的「Kimi」（OpenCode 的供应商展示名也一并更名）；模型标签仍保留「Kimi K2.7 Code」，因为它描述的是实际模型。

#### JSON 编辑器暗色模式

用量脚本弹窗、供应商表单与通用供应商表单里的 CodeMirror `JsonEditor` 现在会通过 `useDarkMode()` 跟随应用主题，切换到 `oneDark` 编辑器主题，而不再在应用其余部分已是暗色时仍停留在亮色。（[#4556](https://github.com/farion1231/cc-switch/pull/4556)）

#### 更紧凑的「添加供应商」标题与底部提示

「添加供应商」对话框把标题到页签、页签到卡片的纵向间距从 24px 收到 12px，并新增一个始终可见的固定底部提示，引导用户在选好预设后填写下方字段。`FullScreenPanel` 新增可选的 `contentClassName` 属性，让内边距覆盖只作用于此面板、不影响其它共用它的面板。

#### 主题自适应的 Kimi 标识

内联的 Kimi 占位标记替换为厂商刷新后的标识。K 字形使用 `currentColor`，因此会跟随主题文字色（亮色模式深、暗色模式白），而品牌点缀色固定为新的 `#1783FF`，元数据回退色也相应对齐。

#### 移除 Fable 5 Verified 纪念横幅

设置「关于」页不再显示 3.16.3 为标明特别构建而加在应用名旁的 Fable 5 Verified 纪念横幅；横幅图片及其标记被移除，「关于」面板回到标准的版本徽标布局。

---

### 修复

#### Copilot / Codex OAuth 请求现在遵循全局代理

`CopilotAuthManager` 与 `CodexOAuthManager` 在构造时写死了 `Client::new()`，导致它们的认证流程（换 token、拉 `/models` 列表、判定 model vendor、device-code 与 OAuth 刷新请求）无视配置的全局代理、直连目标服务。在 Copilot 上，直连会让 `/models` 返回 0 个 Claude 模型，使 live 模型解析失效，上游以 `400 model_not_supported` 拒绝请求。现在两个 manager 都改为每次请求从共享客户端现取（`crate::proxy::http_client::get()`），从而遵循全局代理 URL 并支持运行时热更新。修复 [#2016](https://github.com/farion1231/cc-switch/issues/2016)、[#2931](https://github.com/farion1231/cc-switch/issues/2931)。（[#4583](https://github.com/farion1231/cc-switch/pull/4583)）

#### 压缩请求体与错误体的解压

Codex Desktop 在对 Codex 后端认证时会发送 zstd 压缩的请求体，这会破坏本地代理路由，因为处理器直接用 `serde_json` 解析原始压缩字节。代理现在会在 JSON 解析前对请求体解压（gzip / br / deflate，外加新增的 zstd 支持，包括 `gzip, zstd` 这类堆叠编码），覆盖三个 Codex 处理器，并剥掉过期的 `content-encoding` / `content-length` / `transfer-encoding` 请求头让转发器重新生成。上游非 2xx 的错误体也以同样方式解压，因此压缩过的限流与鉴权细节不再被丢弃、对客户端隐藏。修复 [#3764](https://github.com/farion1231/cc-switch/issues/3764)、[#3696](https://github.com/farion1231/cc-switch/issues/3696)。（[#3817](https://github.com/farion1231/cc-switch/pull/3817)）

#### DeepSeek 端点 `thinking: disabled` 的 400 错误

DeepSeek 的 Anthropic 兼容端点会拒绝 `thinking.type=disabled` 与 effort 参数共存的请求、返回 HTTP 400，这会破坏 Claude Code 2.1.166+ 那些硬编码 `thinking: disabled` 的子 agent（Workflow / Dynamic Workflow）。代理现在不是去覆盖客户端的意图，而是对官方 DeepSeek 端点剥掉冲突的 `output_config.effort` / `reasoning_effort` 参数，因为子 agent 本就不需要展示推理。（[#4239](https://github.com/farion1231/cc-switch/pull/4239)）

#### 回滚 Anthropic system 消息上提

回滚了 [#3775](https://github.com/farion1231/cc-switch/pull/3775) 把 Anthropic 兼容供应商的 `role=system` 消息从 `messages[]` 上提到顶层 `system` 字段的改动。DeepSeek 端点本就原生接受内联的 system 消息，而该重写改变了请求前缀；保持消息原位能保留 prompt 前缀，避免一处疑似的缓存命中率回退（参见 [#4297](https://github.com/farion1231/cc-switch/issues/4297)）。来自 #3775 的、不相关的 Windows 测试修复以及 tool-thinking-history 归一化都保留。

#### Chat 工具调用缺函数名

一些上游会在流式工具调用增量里发送空的或缺失的函数名，过去这会产生无效的 Codex Chat 输出项（或一个 `unknown_tool` 回退）。现在累积的工具调用状态不会再被空增量覆盖，而那些始终没拿到 `call_id` 与有效名字的工具调用会在最终化阶段被跳过，覆盖流式、非流式与旧版 `function_call` 三条路径。（[#4159](https://github.com/farion1231/cc-switch/pull/4159)）

#### 恢复 Codex 缓存的工具调用字段

当 Codex 发起一个引用 `previous_response_id` 的后续 Chat 请求时，它的 `function_call` 项可能只携带 `call_id`。历史增强此前只回填 `reasoning` / `reasoning_content`，留空了函数的 `name`、`arguments`、`status` 等字段；现在它会从历史里恢复全部缓存的工具调用字段，让该调用能为 Chat 上游正确重建。（[#4160](https://github.com/farion1231/cc-switch/pull/4160)）

#### config.toml 里重复的 Codex base_url 条目

把 Codex 的 `base_url` 写入 `config.toml` 时此前每个区段只替换或移除一个匹配的赋值，因此一个已经含多行 `base_url` 的区段会留下多余项、累积重复。`setCodexBaseUrl` 现在会折叠目标区段或顶层的所有匹配（替换第一处、移除其余），TOML 的 `base_url` 正则也处理了转义引号。（[#4316](https://github.com/farion1231/cc-switch/pull/4316)）

#### 历史迁移探测 CODEX_SQLITE_HOME 的状态库

Codex 会话历史迁移此前只扫描 `~/.codex/state_5.sqlite` 与 `config.toml` 的 `sqlite_home` 位置，因此当 Codex 的 SQLite 状态通过 `CODEX_SQLITE_HOME` 环境变量被重定位时，状态库从未被扫描、其 threads 仍留在旧的供应商分桶里。第三方与统一会话两套迁移共用的 `codex_state_db_paths` 辅助函数现在会回退到 `CODEX_SQLITE_HOME`（`config` 里的 `sqlite_home` 仍优先）。

#### 供应商终端尊重用户 shell

在 macOS / Linux 上启动供应商终端时此前硬编码了 `bash`，导致 zsh / fish 用户的 rc 文件不会加载。启动器现在会从 `$SHELL` 检测用户默认 shell（macOS 回退 `/bin/zsh`、Linux 回退 `/bin/bash`）并以干净启动的 flag exec 进去，而启动脚本本身改走 POSIX `sh` 以保证可移植性（例如 fish，以及 `/bin/sh` 可能不存在的 NixOS）。（[#4140](https://github.com/farion1231/cc-switch/pull/4140)，修复 [#1546](https://github.com/farion1231/cc-switch/issues/1546)）

#### Claude MCP 路径尊重自定义配置目录

当配置了自定义的 Claude 配置目录时，MCP server 的读写现在会解析到该目录下的 MCP 文件、而非默认位置，让 MCP 状态按 profile 隔离。此前对旧文件的「访问即拷贝」迁移被移除，改为直接解析覆盖路径。（[#3431](https://github.com/farion1231/cc-switch/pull/3431)）

#### 搜索后预设结果可点击

在「添加供应商」预设选择器里搜索后，结果一度无法点击或选中。那个与输入打架、会吃掉首字符（如「gateway」→「ateway」）的 `requestAnimationFrame` `select()` 被移除，开箱即点路径的输入自动聚焦被恢复，当搜索框已打开时按 Ctrl/Cmd+F 也接上了重新聚焦。供应商列表的打字守卫也被收窄到 Ctrl/Cmd+F 分支，从而 Escape 仍能关闭搜索面板。（[#4315](https://github.com/farion1231/cc-switch/pull/4315)）

#### Skills 浏览与供应商卡片显示修复

修复了若干显示与交互问题：浏览 skills.sh 时仓库管理操作保持可用，仓库返回空结果时刷新也保持可用；供应商卡片上过长的供应商名与网站 URL 现在会截断而非溢出；OMO 模型变体下拉会截断所选标签并配全文提示；Select 菜单项会在当前选中项上显示对勾。（[#4323](https://github.com/farion1231/cc-switch/pull/4323)）

#### 切换设置页签时重置滚动

在设置对话框里切换页签会保留上一个页签的滚动位置，有时会停在新页签的中途；现在每当激活页签变化时，滚动容器都会重置到顶部。（[#4165](https://github.com/farion1231/cc-switch/pull/4165)）

---

### 文档

#### Kimi 置顶赞助横幅

全部四种 README 语言（en / zh / ja / de）顶部的置顶赞助横幅现在换成了 Kimi K2.7 Code，取代此前的 MiniMax M2.7 横幅。文案反映 K2.7 Code 发布（一个面向编程的 agentic 模型，思考 token 用量较 K2.6 降低约 30%），横幅改由仓库内资源（`assets/partners/banners/kimi-banner-en.png` / `kimi-banner-zh.png`）提供、不再走 Moonshot CDN，并附一个指向 `aff=cc-switch` Moonshot 控制台的可点击行动号召。

#### Codex 统一会话历史攻略

新增三语（zh / en / ja）攻略，讲清统一 Codex 会话历史开关的开启迁移（启用时）与按账本还原（禁用时）到底做了什么、为什么会话数据从不会真正删除（只改标记 + 自动备份），以及如何核对文件是真在磁盘上、还是只是被归到了另一个供应商抽屉里。它包含一张针对常见「我的会话不见了」误解的症状对照表，以及 macOS / Linux / Windows 的磁盘核对命令，并作为首项链入 v3.16.3 的「使用攻略」release notes。

#### 简化 Homebrew 安装说明

安装指南不再要求用户在 `brew install --cask cc-switch` 之前先运行 `brew tap farion1231/ccswitch`；这个已废弃的 tap 步骤已从 en / ja / zh 用户手册里移除，cask 现在可直接安装。（[#4319](https://github.com/farion1231/cc-switch/pull/4319)）

#### Star-History 全球排名徽标

在全部四种 README 语言里、既有的 Trendshift 徽标旁新增了一个 star-history 全球排名徽标，并带亮 / 暗主题变体。

#### 火山方舟 Coding Plan 活动链接

ByteDance / 火山方舟赞助条目里的「中国大陆地区的开发者请点击这里」链接现在指向火山的 `ai618` 活动页，取代此前的 `codingplan` 推荐 URL，覆盖全部四种 README 语言。

#### CCSub 赞助横幅矢量资源

把低分辨率的 `ccsub.jpg` 赞助 logo 替换为矢量的 `ccsub.svg`，并从 2046x648 letterbox 到 2046x850（约 2.406:1），使其与其它赞助表横幅匹配、以相同的 62px 高度渲染。全部四种 README 语言都指向新资源。

---

### 升级提醒

#### 国产 Codex 供应商原生 Responses 迁移

本版把多家具备原生 Responses 端点的国产供应商（千问 / 百炼、小米 MiMo、火山豆包、美团 LongCat、MiniMax 国内 / 国际）的 Codex 预设切换为 `openai_responses` 并移除了 `modelCatalog`。已经基于这些预设配置过的存量供应商不受影响、配置保持原样；如果你希望改用原生 Responses（省去格式转换接管），可以重新从预设选择一次并保存。SiliconFlow 托管的 MiniMax 仍走 `openai_chat`，不在此次迁移之列。

#### 数据库版本过新的恢复

如果你曾用更高版本的 CC Switch 打开过数据库、再切回旧版，旧版启动时会进入新的「数据库版本过新」恢复屏，并引导你升级到能读懂该数据库的版本。这是预期行为——升级到最新版即可恢复正常。

---

### 风险提示

本版本继续沿用此前版本对反向代理类功能的风险提示。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**Codex 第三方供应商 Chat 路由**：通过 CC Switch 本地代理把 Codex 请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束不同，请在使用前阅读目标供应商的服务条款。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，同样需要遵守目标供应商的计费、合规与数据留存约束。

用户启用上述功能即表示自行承担相关风险。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

---

### 致谢

感谢以下贡献者在 v3.16.4 中提交的功能与修复：

- [#3817](https://github.com/farion1231/cc-switch/pull/3817)：转发前解压请求体并支持 zstd，感谢 @chenx-dust。
- [#4583](https://github.com/farion1231/cc-switch/pull/4583)：修复 Copilot / Codex OAuth 模块绕过全局代理导致 Claude 模型 400，感谢 @zymouse。
- [#4589](https://github.com/farion1231/cc-switch/pull/4589)：新增本地代理请求覆盖（自定义请求头与请求体），感谢 @mfzzf。
- [#4575](https://github.com/farion1231/cc-switch/pull/4575)：新增数据库版本过新时的应用内恢复屏，感谢 @SaladDay。
- [#4556](https://github.com/farion1231/cc-switch/pull/4556)：为多处 JsonEditor 接入暗色模式，感谢 @TanKimzeg。
- [#4438](https://github.com/farion1231/cc-switch/pull/4438)：新增自定义日期范围的实时结束时间，感谢 @arichyx。
- [#3950](https://github.com/farion1231/cc-switch/pull/3950)：新增 Windows ARM64 发布支持，感谢 @MOON-DREAM-STARS。
- [#4401](https://github.com/farion1231/cc-switch/pull/4401)：为 Kimi For Coding 预设添加 CLAUDE_CODE_AUTO_COMPACT_WINDOW，感谢 @cyijun。
- [#4323](https://github.com/farion1231/cc-switch/pull/4323)：修复 Skills 管理与模型配置的交互展示，感谢 @thisTom。
- [#3431](https://github.com/farion1231/cc-switch/pull/3431)：对齐自定义配置目录的 Claude MCP 路径，感谢 @makoMakoGo。
- [#4159](https://github.com/farion1231/cc-switch/pull/4159)：跳过缺函数名的 Chat 工具调用，感谢 @hueifeng。
- [#4385](https://github.com/farion1231/cc-switch/pull/4385)：新增 glm-5.2 定价，感谢 @arichyx。
- [#4079](https://github.com/farion1231/cc-switch/pull/4079)：支持从 models.dev 导入模型定价，感谢 @kingcanfish。
- [#4315](https://github.com/farion1231/cc-switch/pull/4315)：修复搜索预设后结果无法点击选中，感谢 @RuixeWolf。
- [#4316](https://github.com/farion1231/cc-switch/pull/4316)：防止重复的 Codex base_url 条目，感谢 @jeffwcx。
- [#4140](https://github.com/farion1231/cc-switch/pull/4140)：让供应商终端尊重用户 shell，感谢 @zkforge。
- [#4113](https://github.com/farion1231/cc-switch/pull/4113)：在会话详情头显示源文件名，感谢 @xu-song。
- [#4160](https://github.com/farion1231/cc-switch/pull/4160)：恢复 Codex 缓存的工具调用字段，感谢 @chen-985211。
- [#4239](https://github.com/farion1231/cc-switch/pull/4239)：DeepSeek 端点 thinking:disabled 时剥掉 effort 参数，感谢 @maskshell。
- [#4165](https://github.com/farion1231/cc-switch/pull/4165)：切换设置页签时重置滚动，感谢 @Muleizhang。
- [#4319](https://github.com/farion1231/cc-switch/pull/4319)：移除已废弃的 Homebrew tap 步骤，感谢 @tianpeng-dev。
- [#4522](https://github.com/farion1231/cc-switch/pull/4522)：新增 SubRouter 供应商预设，感谢 @abingyyds。

也感谢所有在 v3.16.3 发布后反馈 Codex 代理链路、用量计费、本地代理稳健性与平台兼容性问题的用户，很多补丁都来自这些真实使用场景里的复现线索。

---

### 下载与安装

访问 [Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载对应版本。

#### 系统要求

| 系统    | 最低版本                   | 架构                                |
| ------- | -------------------------- | ----------------------------------- |
| Windows | Windows 10 及以上          | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey) 及以上 | Intel (x64) / Apple Silicon (arm64) |
| Linux   | 见下表                     | x64 / ARM64                         |

#### Windows

| 文件                                     | 说明                                |
| ---------------------------------------- | ----------------------------------- |
| `CC-Switch-v3.16.4-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.16.4-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

Windows ARM64 设备请选择文件名中带 `arm64` 标识的对应制品。

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.16.4-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.16.4-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.16.4-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

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

- `CC-Switch-v3.16.4-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.4-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.16.3] - 2026-06-14

> 🎉 **CC Switch 突破 100,000 Star！**
> 感谢每一位用户、贡献者与 Star —— 是你们让它走到这里。🙏

> 💎 **本版由 Claude Fable 5 模型协助开发**——它帮忙梳理清楚了多处关键且容易出错的逻辑：路由接管时按真实上游模型计费的归因链、格式转换路径上缓存 token 的计量与去重、应用内更新的重启死锁，以及 Codex 统一会话历史的迁移 / 还原不变量。这也是本版在「关于」页新增 **Fable 5 Verified** 标识的由来。

> 在 v3.16.2 拓宽数据可携带性与用量观测之后，这一版把重心放在「让用量计费真正准确」——按真实上游模型计费、修正格式转换路径上的缓存双算、把 Claude Code Workflow 子 agent 的用量纳入统计（schema v11），并对用量看板做了一轮改版（全局供应商 / 模型筛选、品牌图标工具栏、更稳的额度查询）；同时加固了一批本地代理与平台问题，新增自定义 User-Agent 覆盖、Codex 统一会话历史开关与 Claude Fable 5 档位。

### 使用攻略

本版新增了 **Codex 统一会话历史** 开关——它涉及会话的迁移 / 还原，操作不当时容易让人误以为"会话丢了"，强烈建议先读这篇攻略；用量统计的口径和看板这一版也做了较多调整，一并附上：

- **[Codex 统一会话历史：功能介绍与使用攻略](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-unified-session-history-guide-zh.md)**：讲清"统一 / 迁移 / 还原"到底改了什么、为什么数据不会真正丢失，以及看不到会话时如何自查与精确还原。**用过这个开关、或担心会话丢失，请务必先读。**
- **[用量统计](/zh/docs?section=proxy&item=usage)**：了解用量看板的数据来源（代理日志、会话同步）与统计口径，本版新增了全局的供应商 / 模型筛选，并把路由接管的真实计价模型展示了出来。
- **[设置](/zh/docs?section=getting-started&item=settings)**：自定义 User-Agent 覆盖、Codex 统一会话历史等开关都在供应商表单的高级选项与设置页里。

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

CC Switch v3.16.3 是 v3.16.2 之后的一版维护更新。在上一版集中拓宽数据可携带性与用量观测之后，这一版把重心放在「让用量计费真正准确」这件事上——按真实上游模型计费而非上游回显、修正格式转换（Chat / Responses / Gemini 转 Anthropic）路径上的缓存 token 双算、把 Claude Code Workflow 子 agent 的用量纳入本地统计，并以 schema v11 持久化每条记录实际使用的定价依据；用量看板也随之做了一轮改版，新增全局的供应商 / 模型筛选、品牌图标工具栏，以及更稳的额度查询（失败重试 + 保留上次成功结果）。

此外，本版还加固了一批本地代理的稳健性问题（错标 Content-Type 的 SSE 响应聚合、Codex `/responses` 文本模型图像整流、Codex OAuth 凭据与接管残留的恢复、Hermes 配置重复 YAML 键），重做了供应商配置体验（自定义 User-Agent 覆盖、Codex 表单统一进高级选项、预设搜索与排序、Claude Fable 5 档位），新增 Codex 统一会话历史开关，并修复了应用内更新卡死、Codex 升级损坏安装、macOS 重复终端窗口等问题。

### 重点内容

- **用量计费更准**：路由接管的流量现在按真实上游模型计费（而非上游回显的别名），格式转换路径不再把缓存 token 重复计入 input，Claude Code Workflow 子 agent 的用量也纳入了统计——以 schema v11 持久化定价依据。
- **用量看板改版**：供应商 / 模型筛选从请求日志表提升为全局筛选，应用筛选改用品牌图标，额度查询加入失败重试与「保留上次成功结果」，单次网络抖动不再让卡片变红。
- **自定义 User-Agent 覆盖**：供应商可设置自定义 UA，并在转发、连通性检测、模型列表三处一致生效，绕过按 UA 白名单放行的 Coding Plan 上游（借此恢复了 Codex「Kimi For Coding」预设）。
- **Codex 统一会话历史**：新增可选开关，让官方 Codex 会话与第三方会话共享同一份 resume 历史桶，附带可选的存量迁移与按账本精确还原。
- **代理与平台加固**：错标 SSE 响应聚合、Codex 图像整流、接管残留恢复、Hermes YAML 去重；应用内更新不再卡在「重启中」，Codex 升级不再把安装弄坏。

### 新功能

#### 自定义 User-Agent 覆盖

供应商配置现在可以设置自定义 User-Agent，并由代理在请求转发、连通性检测和模型列表（`GET /v1/models`）三条路径上一致应用，因此按 UA 白名单放行的 Coding Plan 上游不会再出现「检测失败 / 模型列表 403、但代理本身却能正常工作」的不一致。Claude 和 Codex 表单都在高级选项里暴露该字段，配有精选的 UA 预设下拉（Claude Code / Kilo Code 等能通过 UA 白名单的家族）和实时、非阻塞的格式校验；切换到官方预设时会丢弃残留的自定义 UA，避免悄悄改动请求头（[#3671](https://github.com/farion1231/cc-switch/pull/3671)）。

#### Codex 统一会话历史

新增一个可选开关（设置 → Codex 应用增强），让官方 Codex 会话与 CC Switch 的第三方会话共享同一份 resume 历史桶，resume 选择器不再把两者互相隐藏。开启后，live 的 `config.toml` 会把官方运行路由到一个镜像内建 OpenAI 供应商的共享 `custom` model_provider（`auth.json` 不动）。默认只对未来会话生效；开启弹窗提供一个勾选项，可把已有官方会话迁入共享桶（含逐代备份），关闭弹窗则提供按备份账本精确还原——只回退备份中记录为 `openai` 的会话，开启期间新建的会话永不被改动。

#### 用量看板全局供应商 / 模型筛选

供应商和模型筛选从请求日志表内部提升到了顶栏，对 Hero 汇总、趋势图、请求日志和两个统计页签全局生效，可以把整个看板按某个来源和模型缩小范围。来源按展示名精确匹配（因此像「Claude (Session)」这样的会话占位行也可选），模型按有效计价模型匹配，模型下拉会随所选来源级联，且两个列表只列出当前时间范围内有数据的选项。

#### 模型定价种子刷新

对 `seed_model_pricing` 做了一次全量核价：新增 9 个模型的定价（含 Claude Fable 5、Grok 4.3、Mistral Medium 3.5 / Small 4、Qwen 3.7 Max/Plus 等），并按各厂商官方 list 价订正了 28 处既有价格（GLM、Grok、MiMo、Doubao、Kimi、MiniMax、Mistral、Qwen），让用量成本估算更准确。每处改动都同时更新种子（影响全新安装）并向 `repair_current_model_pricing` 加一条旧→新守卫（修复存量数据库，且不覆盖用户手改过的行）。

#### Claude Fable 5 模型档位

供应商表单现在在 Claude Code 和 Claude Desktop 两条代理路径上都暴露 `claude-fable-5` 作为第四个模型映射档位，回落链为 fable → opus → default，与官方降级一致，并为 Claude Desktop 1.12603.1+ 的校验器放行了 `fable-` 前缀。四语回落提示也做了澄清：在第三方端点上把某一档留空，会原样透传该档的字面模型名并 404（[#3980](https://github.com/farion1231/cc-switch/issues/3980)、[#4026](https://github.com/farion1231/cc-switch/issues/4026)、[#4049](https://github.com/farion1231/cc-switch/issues/4049)）。

#### Unity2.ai 合作伙伴供应商

新增 Unity2.ai（一个 AI API 中转合作伙伴）作为预设，覆盖全部 7 个受管应用（Claude Code、Codex、Gemini、OpenCode、OpenClaw、Claude Desktop、Hermes），每个预设都带上推广注册链接，并在四种语言里补充了合作伙伴推广文案。Codex 使用裸 base URL（该网关在根路径暴露 `/responses`），OpenCode / OpenClaw / Hermes 使用 `/v1` chat-completions 端点并以 `gpt-5.5` 为预设模型。

#### Kimi K2.7 Code 模型

新增 `kimi-k2.7-code` 模型（输入 $0.95 / 输出 $4.00 / 缓存读取 $0.19，每百万 token，256K 上下文），并把全部 6 个官方 Moonshot Kimi 预设（Claude Code、Codex、Claude Desktop、Hermes、OpenCode、OpenClaw）指向它，OpenCode / OpenClaw 预设更名为「Kimi K2.7 Code」。定价种子通过启动时的幂等插入路径生效，存量用户无需迁移即可获得新价。

#### 恢复 Codex「Kimi For Coding」预设

重新加入 Codex「Kimi For Coding」预设（`openai_chat`、`kimi-for-coding`、256K 上下文），默认开启思考模式。此前它被移除是因为该编程端点会以 403 拒绝 Codex 默认的 `codex-cli` User-Agent；现在借助代理接管 + 自定义 User-Agent 覆盖（设为 `claude-cli/*` 等白名单 UA）即可正常使用。

#### 请求详情的计价模型审计

请求详情面板现在会在「请求的模型」「计价模型」与响应模型不一致时把它们都显示出来，让路由接管产生的账单可以直接在用量界面里核对。

#### 预设供应商搜索与排序

预设供应商选择器现在是一个可搜索、可排序的列表，配有内联搜索框（点放大镜图标切换，按 ESC 或点击外部收起）。按钮改为响应式网格、尺寸统一并显示默认图标，搜索只匹配供应商的展示名 / 原始名，因此 URL 片段和共享的分类标签不会再产生噪声匹配（[#3975](https://github.com/farion1231/cc-switch/pull/3975)、[#4183](https://github.com/farion1231/cc-switch/pull/4183)）。

#### Claude Mythos 5 定价

在内置模型 / 定价表里登记 `claude-mythos-5` 模型（输入 $10 / 输出 $50，每百万 token；缓存读取 $1.00、缓存写入 $12.50），让用量统计能正确计价并展示（[#4077](https://github.com/farion1231/cc-switch/pull/4077)）。

#### Fable 5 Verified 标识

设置「关于」页现在会在应用名与版本旁展示 Fable 5 Verified 标识，标明这是一个特别构建，版本徽标也居中到了应用名下方。

### 变更

#### Claude Desktop 用量折叠进 Claude

看板不再展示独立的「Claude Desktop」分桶——它一直只能显示一个不完整的数字（Desktop 聊天用量根本不经过代理，而其 Code 页签的会话只是内嵌的 Claude Code 运行时写进共享的 `~/.claude/projects` 目录）。Desktop 的代理流量现在在展示上折叠进 `claude`，但记账层仍按它自己的 `app_type` 记录以便路由接管计费审计，真实值可在请求详情面板看到。

#### 轻量化供应商健康检查

供应商健康检查不再发送真实的流式模型请求（很多第三方供应商会以 401/403/WAF 拦截，造成误报不可用），改为对供应商 `base_url` 做一次轻量的 HTTP 可达性探测：任何 HTTP 响应都视为可达，只有 DNS / 连接 / TLS / 超时才算失败。官方供应商（使用 OAuth、base_url 故意为空、没有可靠的可达性目标）会隐藏连通性按钮，原先「发送真实请求」的确认弹窗以及测试模型 / 提示词字段都被移除，降级延迟阈值设为 6s、超时 8s。该可达性检查永不重置熔断器——可达不等于可用（403 的 host 可达，但对真实流量是坏的），失败转移仍只由真实代理流量驱动。

#### Codex 高级选项区整合

Codex 供应商表单现在把本地路由、模型映射、推理覆盖和自定义 User-Agent 折叠进一个可展开的高级选项区，与 Claude 表单一致（设置了 UA 或开启本地路由时自动展开）。自定义 User-Agent 现在对原生 Responses 供应商也可配置，此前它只有在开启 `openai_chat` 路由时才能触及。

#### 用量工具栏与布局刷新

应用筛选改用品牌图标（经 ProviderIcon，「全部」用网格图标）渲染，取代在窄窗口下换行难看的文字页签；用量 Hero 也会显示所选应用的品牌图标，并把 Codex 的主题色从翠绿改为中性灰，贴合 OpenAI 的单色品牌。点击循环切换的刷新按钮改成了带本地化「关闭」标签的下拉选择，顶栏控件也压缩并对齐成统一的宽度分组，过长的日期范围标签做了截断处理。

#### 关于面板加载更快

设置「关于」面板现在渐进式加载：应用版本徽标在解析完成的瞬间就显示，不再等待工具探测；每张工具卡片在自己的版本检测完成时立即更新（探测并发执行而非串行）；探测结果在应用会话期内缓存并带 10 分钟 TTL，因此再次打开「关于」页签会复用缓存值、并在后台对过期项重新校验，而不是每次都把 6 个工具全部重探一遍。

#### 火山方舟 Coding Plan 推广更新

把火山方舟（Volcengine Ark）预设在全部 6 个应用里更新到新的 Coding Plan 邀请链接（替换旧的 Agent Plan / 活动链接），并在四种语言里刷新了合作伙伴推广文案（两个月 75% 折扣 + 邀请码 6J6FV5N2），把产品名从 Agent Plan 订正为 Coding Plan。

#### MiniMax 降为普通供应商

移除 MiniMax 的金色合作伙伴星标和 API key 推广横幅（从所有预设里删掉 `isPartner` 标志），它继续作为常规 `cn_official` 供应商保留图标与主题。推广文案保持休眠状态，必要时一行即可重新启用合作关系。

#### 移除 LemonData、SudoCode 降级

彻底移除 LemonData 供应商预设（连同其推广文案、图标和赞助商条目），并把 SudoCode 从合作伙伴降为常规 `third_party` 供应商（去掉 `isPartner` 标志和推广文案，保留图标）。

#### AtlasCloud Codex GLM 5.1 上下文窗口

为 AtlasCloud Codex 预设里的 `zai-org/glm-5.1` 模型声明 200,000 token 的上下文窗口，与其他 GLM 5.1 预设条目对齐。

### 修复

#### 路由接管流量按真实上游模型计费

当请求被路由到了不同的上游（env 模型映射、Claude Desktop 路由、Copilot 归一化、Codex chat 覆盖）时，代理过去会按上游回显的模型来归因和计价，把 kimi / glm 的 token 记成、并按 `claude-*` 计价，成本被高估约 5–25 倍。现在转发器会捕获真实的出站模型，按「上游回显 → 出站模型 → 客户端别名」的顺序归因，并在每行持久化实际使用的定价依据（schema v11），该依据会贯穿成本回填和 30 天 rollup 裁剪；Claude Desktop 流量现在也记在它自己的 `app_type` 下，使其定价覆盖能正确生效。

#### 格式转换路径的用量计量

审计并修复了代理各条格式转换路径（Chat、Responses、Gemini 转 Anthropic）上的 token / 缓存计量。代理现在会记录实际返回的模型，注入 `stream_options.include_usage` 让 OpenAI 兼容上游在流式时吐出 usage，在 Claude←OpenAI 路径上把 `cache_read` 和 `cache_creation` 从 input 中排除以阻止缓存 token 双计费，扣减 Gemini 的缓存提示 token，仍记录完全命中缓存的请求，并跳过过去会虚增请求数的合成全零 usage（[#2774](https://github.com/farion1231/cc-switch/pull/2774)）。

#### 应用内更新不再卡死

从应用内安装更新时不再卡在「重启中」界面——过去会出现新版已装好、却必须手动强制退出的情况。下载—安装—重启整条链路现在完全在后端执行（新增 `install_update_and_restart` 命令），按平台决定安装顺序，并在重新执行前先销毁单实例锁，而不再依赖旧 WebView 在应用包已被替换之后继续跑 JS；退出请求也做了分类，让重启请求落到 Tauri 默认流程，而不是在窗口状态插件的互斥锁上死锁（[#4069](https://github.com/farion1231/cc-switch/pull/4069)、[#4074](https://github.com/farion1231/cc-switch/pull/4074)）。

#### Codex 升级不再损坏安装

从设置「关于」页升级 Codex 不再让它抛出「Missing optional dependency @openai/codex-…」错误。升级链此前会先跑 `codex update`，而它在 npm 安装下其实是一次裸的重装、即便对应平台的二进制没装上也会报告成功；现在 Codex 已从「优先 self-update」路径里移除，并由一个 runnable 检测触发「卸载 + 重装」自愈（仅限 npm 管理的安装），这是唯一能真正补回缺失平台二进制的修复。

#### 接管时保留 Codex OAuth 凭据

为 Codex 供应商开启代理接管时不再剥掉 `ANTHROPIC_AUTH_TOKEN` 占位符——此前这会在热切换、全新安装、以及被旧版本已剥过的 live 配置上破坏 Claude Code 的登录。现在对受管（非 Copilot）的 Codex 供应商无条件注入该占位符，包括只有 URL 的供应商；GitHub Copilot 的行为（仅 API_KEY）不变（[#3789](https://github.com/farion1231/cc-switch/pull/3789)、[#3784](https://github.com/farion1231/cc-switch/issues/3784)）。

#### 跨配置目录切换的接管残留恢复

在代理接管激活时更改配置目录后重启应用，不再把 Claude / Codex / Gemini 留在指向已失效的本地代理上。现在旧实例会在重启前先还原被接管的 live 文件，首次运行的导入会拒绝把接管占位符当作供应商持久化，SSOT 还原也会在写回前校验当前供应商的配置里不含占位符（[#4076](https://github.com/farion1231/cc-switch/pull/4076)）。

#### 格式转换兜底里错标的 SSE 响应聚合

经 Claude / Codex 格式转换的请求，当 MaaS 网关把一个 `stream:false` 的请求强制流式、并以非 SSE 的 Content-Type 返回 SSE 响应体时，不再以一句晦涩的 422「Failed to parse upstream response」失败。代理现在会在解析失败时嗅探 SSE、把分片聚合成单个 JSON 再跑既有转换器，让客户端仍能拿到有效的非流式响应；剩余的解析失败会附带 content-type、编码和响应体片段等诊断信息，deflate 解码也改为先尝试 zlib 再尝试裸流（[#2234](https://github.com/farion1231/cc-switch/pull/2234)）。

#### Hermes 配置重复 YAML 键

Hermes 配置写入不再累积重复的顶层键（如 `mcp_servers`），那会导致「Failed to parse Hermes config as YAML: duplicate entry with key」错误。区段替换现在会从剩余文本里清除所有过期副本，而不是退化成追加；去重保护层同时处理 LF 和 CRLF 行尾；修复时保留最后（最新）的那份副本，与 Hermes 自身基于 PyYAML 的「后者胜」语义一致（[#3267](https://github.com/farion1231/cc-switch/pull/3267)、[#3633](https://github.com/farion1231/cc-switch/issues/3633)、[#2973](https://github.com/farion1231/cc-switch/issues/2973)、[#2529](https://github.com/farion1231/cc-switch/issues/2529)、[#3310](https://github.com/farion1231/cc-switch/issues/3310)、[#3762](https://github.com/farion1231/cc-switch/issues/3762)）。

#### 用量查询韧性与错误清晰度

用量卡片不再因为单次瞬时抖动就变红：查询现在会重试一次，并在网络 / 超时 / 5xx 这类瞬时失败下继续展示上次成功的结果最多 10 分钟；而确定性失败（鉴权、空 key、未知供应商、4xx）会立即暴露并清空快照，避免凭据变更后陈旧额度又冒出来。原生余额 / Coding Plan / 订阅查询的超时从 10s 提高到 15s 以适配跨境慢端点，Coding Plan 也会返回明确的「API key is empty」/「Unknown coding plan provider」错误，而不是一句空白的失败。

#### 用量脚本供应商凭据解析

自定义 JS 脚本的用量查询此前只靠猜测 env 字段来解析 `{{apiKey}}` / `{{baseUrl}}`，因此凭据存放在别处的应用（如 Codex 的 `auth.OPENAI_API_KEY` 加 `config.toml` 里的 base_url）总是拿到空值、即便供应商已完整配置也会失败。脚本查询及其测试 / 预览现在复用与原生余额路径相同的按应用凭据解析器，脚本里显式填写的非空值仍然优先（[#1479](https://github.com/farion1231/cc-switch/pull/1479)）。

#### Claude Code Workflow 子 agent 用量统计

本地（无代理）的会话日志用量统计此前漏掉了 Claude Code Workflow 子 agent 的流量，整体用量被低估约 4.1%（集中在 workflow / subagent 的会话记录里）。扫描器现在会深入更深一层的 `subagents/workflows/wf_*/` 记录目录，解析器也不再丢弃那些缺少 `stop_reason`、但已经产生 input / 缓存 token 成本的 assistant 消息；去重逻辑不变，因此不会重复计数。

#### Codex `/responses` 文本模型图像整流

携带图片、且被路由到只支持文本的 OpenAI-chat 模型（如 DeepSeek `deepseek-v4-flash`）的 Codex `/responses` 请求，不再以 HTTP 400「unknown variant `image_url`」失败。媒体整流器现在也覆盖 Codex 适配器，会扫描 responses 的 `input` 里的 `input_image` 块，从而既能为已知的纯文本模型主动剥掉图片，也能在上游报「不支持图片」时把图片替换后重试。

#### 智谱 Coding Plan 配额窗口误标

智谱 Coding Plan 视图不再在每个周周期的最后几个小时把 5 小时窗口和周窗口标反。两个窗口现在按显式的 `unit` 字段分类（3 = 5 小时、6 = 周），而不再靠按重置时间升序排序——后者恰好在用户最常查周额度的时候把两者标反；当字段缺失时仍回退到旧的重置时间启发式（[#3036](https://github.com/farion1231/cc-switch/pull/3036)）。

#### macOS 重复供应商终端窗口

在 macOS 上启动供应商终端时不再在命令会话旁多开一个空窗口；Terminal.app 在冷启动时改用 `launch`（而非 `activate`），Ghostty 使用初始命令，从而只打开单个会话，并在 AppleScript 路径失败时保留回退方案（[#4156](https://github.com/farion1231/cc-switch/pull/4156)）。

#### Claude Desktop 模型映射占位符

Claude Desktop 模型映射表单此前在「菜单展示名」和「请求模型」两列用了不一致的示例品牌（DeepSeek vs Kimi），暗示一个展示名会映射到不相关的模型。现在两个占位符都由每行的角色派生，从而保持品牌一致，轻量的 Haiku 档使用 flash 示例。

#### 弹层被全屏面板遮挡

像供应商预设搜索这样的弹层和提示气泡不再渲染到全屏面板后面、看起来点了没反应；它们的 z-index 被提到全屏遮罩之上，同时仍低于模态对话框。

#### ToggleRow 图标被挤压

开关行的图标在配上长描述时不再被压缩或变形，让图标在多行文字旁保持固定大小。

### 文档

#### Release Notes 贡献者致谢恢复

恢复了 v3.16.1 与 v3.16.2 release notes 在三种语言里的贡献者致谢。

### 升级提醒

#### 定价库 schema v11 自动迁移

本版给 `proxy_request_logs` 新增了 `pricing_model` 列、并按 `request_model` + `pricing_model` 重建了 rollup，启动时自动迁移、无需手动操作。历史行的成本在写入时已冻结、不会重算（`app_type="claude"` 的行混合了原生与转换两类来源）；只有真实但当时未计价的接管行会保持零成本、待定价补齐后再回填。

#### 模型映射新增第四档（Fable 5）

Claude Code 与 Claude Desktop 的模型映射现在是四档（Sonnet / Opus / Fable / Haiku）。老的三档供应商在重新打开并保存后会补上 `claude-fable-5` 档；该档留空表示继承 Sonnet。注意：在第三方端点上把任意一档留空，会原样透传该档的字面模型名并可能 404，请按需填写。

#### 「Kimi For Coding」预设需要代理接管 + 白名单 UA

恢复的 Codex「Kimi For Coding」预设直接用默认的 `codex-cli` User-Agent 仍会被 403。要使用它，请开启代理接管，并在供应商高级选项里把自定义 User-Agent 设为白名单 UA（如 `claude-cli/*`）。

#### 供应商健康检查语义变化

健康检查从「发送真实模型请求」改为「HTTP 可达性探测」。请注意可达 ≠ 可用：一个返回 403 的 host 是可达的，但对真实流量可能是坏的。失败转移的判定仍只由真实代理流量驱动，不受健康检查影响。

### 风险提示

本版本继续沿用此前版本对反向代理类功能的风险提示。

**Codex OAuth 反向代理**：使用 ChatGPT 订阅的 Codex OAuth 反代可能违反 OpenAI 服务条款，详情见 [v3.13.0 release notes](v3.13.0-zh.md#️-风险提示)。

**Codex 第三方供应商 Chat 路由**：通过 CC Switch 本地代理把 Codex 请求转换并转发到第三方供应商时，各供应商对计费、合规与数据留存的约束不同，请在使用前阅读目标供应商的服务条款。

**Claude Desktop 第三方供应商代理切换**：通过 CC Switch 内置代理网关把 Claude Desktop 的请求转到第三方供应商时，同样需要遵守目标供应商的计费、合规与数据留存约束。

用户启用上述功能即表示自行承担相关风险。CC Switch 不对因使用这些功能而导致的任何账号限制、警告或服务暂停承担责任。

### 致谢

感谢以下贡献者在 v3.16.3 中提交的功能与修复：

- [#3789](https://github.com/farion1231/cc-switch/pull/3789)：接管时保留 Codex OAuth 凭据，感谢 @codeasier。
- [#2774](https://github.com/farion1231/cc-switch/pull/2774)：修复 Completions 转 Anthropic 时不记录实际返回模型、input token 计算错误，感谢 @LaoYueHanNi。
- [#4069](https://github.com/farion1231/cc-switch/pull/4069)：修复应用内更新后重启死锁，感谢 @thisTom。
- [#4156](https://github.com/farion1231/cc-switch/pull/4156)：修复 macOS 重复供应商终端窗口，感谢 @thisTom。
- [#3267](https://github.com/farion1231/cc-switch/pull/3267)：修复 Hermes 配置重复 YAML 键，感谢 @que3sui。
- [#1479](https://github.com/farion1231/cc-switch/pull/1479)：修复用量脚本供应商凭据解析，感谢 @pa001024。
- [#3975](https://github.com/farion1231/cc-switch/pull/3975)：新增预设供应商搜索与排序，感谢 @Nastem。
- [#4183](https://github.com/farion1231/cc-switch/pull/4183)：调整预设供应商按钮外观与搜索框位置，感谢 @WangJiati。
- [#4077](https://github.com/farion1231/cc-switch/pull/4077)：新增 claude-mythos-5 模型定价，感谢 @osscv。

也感谢所有在 v3.16.2 发布后反馈用量计费、本地代理稳健性、Codex 升级与平台兼容性问题的用户，很多补丁都来自这些真实使用场景里的复现线索。

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
| `CC-Switch-v3.16.3-Windows.msi`          | **推荐** - MSI 安装包，支持自动更新 |
| `CC-Switch-v3.16.3-Windows-Portable.zip` | 便携版，解压即用，不写入注册表      |

#### macOS

| 文件                             | 说明                                          |
| -------------------------------- | --------------------------------------------- |
| `CC-Switch-v3.16.3-macOS.dmg`    | **推荐** - DMG 安装包，拖入 Applications 即可 |
| `CC-Switch-v3.16.3-macOS.zip`    | 解压后拖入 Applications，Universal Binary     |
| `CC-Switch-v3.16.3-macOS.tar.gz` | 用于 Homebrew 安装和自动更新                  |

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

- `CC-Switch-v3.16.3-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.3-Linux-arm64.AppImage` / `.deb` / `.rpm`

| 发行版                                  | 推荐格式    | 安装方式                                                               |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` 或 `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` 或 `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | 添加执行权限后直接运行，或使用 AUR                                     |
| 其他发行版 / 不确定                     | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

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
