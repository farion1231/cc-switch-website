# Changelog

Important release updates for CC Switch.

## [3.18.0] - 2026-07-21

> This release lets you do two brand-new things: **hand xAI's Grok CLI (Grok Build) over to CC Switch** — it becomes the eighth managed app, with one-click provider switching, MCP / Skills sync, proxy takeover, and usage statistics all included; and **connect Grok to Claude Code, Claude Desktop, and Codex** — either by signing in with your xAI Grok account directly (device-code authorization, no API key, running on your Grok subscription, with a strict-gateway compatibility layer on the Codex side so codex 0.142+ works too), or with an xAI API key (Codex gets a native Responses direct-connection preset; Claude Code can go through local routing). Just as important is a wave of fixes: the **Codex usage double count introduced in v3.17.0 is fixed**, with an automatic data rebuild after upgrading so the dashboard numbers become real again; **codex 0.144.5+ failing to start because of the model catalog is fixed**; and switching providers on Windows no longer flashes a console window or freezes the UI. Diagnostic logs also move from "wiped on every startup" to persistent across restarts, size-rotated, and fully redacted — and a UI crash now leaves an on-disk report instead of just a blank white window.

### Highlights: What You Can Do Now

- **Manage Grok Build (xAI's Grok CLI)**: add, import, and one-click switch Grok Build providers just like Claude Code / Codex; MCP servers and Skills sync bidirectionally, prompts auto-import on first launch, and session management plus the usage dashboard cover it fully; you can also route it through the local proxy for independent routing, failover, and billing.
- **Connect Grok with your account or an API key — both paths work**: subscription users complete an xAI device-code sign-in under Settings → OAuth Auth Center (multiple accounts supported), and all three clients — Claude Code, Claude Desktop, Codex — run straight on your Grok subscription with no API key anywhere; pay-as-you-go users connect with an xAI API key instead — Codex has a ready-made "xAI (Grok)" preset connecting natively to `api.x.ai`, and Claude Code can connect through local routing following this release's new guide. The default model is `grok-4.5` throughout.
- **Get your Codex usage numbers back to reality**: the v3.17.0 fork / sub-agent double count is rooted out at the parser level; the first launch after upgrading automatically backs up the database and rebuilds Codex usage, and the usage page gains a manual "Rebuild Codex Usage" button. Note that on first launch the history is repaired **progressively** — the dashboard numbers first shrink, then fill back in as the background re-import proceeds; this is expected (see "Upgrade Notes").
- **Upgrade the codex CLI without fear**: the "fails to start" problem caused by codex 0.144.5's strict model-catalog parsing is fixed — generated catalogs now backfill the parser-required fields automatically.
- **Switch smoothly on Windows**: switching providers or toggling takeover no longer flashes a black console window, and no longer freezes the UI for ~2 seconds (the freeze fix benefits all platforms).
- **Troubleshoot and share logs with more confidence**: diagnostic logs persist across restarts (20 MB × 4 rotation) and every egress is uniformly redacted — URL credentials, request/response bodies, and sensitive headers never reach disk anymore; a UI crash shows an error card with a Reload button, with the details written to disk.
- **Multi-turn reasoning and parallel tool calls no longer fall over**: the Responses↔Chat bridge fixes three classes of problems — reasoning content attached to the wrong message, parallel tool calls losing their IDs or their order, and tools with a null schema getting the whole request rejected by strict upstreams.
- **Use Kimi K3**: the Kimi open-platform presets for Codex / Hermes / OpenClaw / OpenCode gain K3 (1M context), with built-in pricing seeded so its usage no longer shows $0.

---

### Usage Guides

The new capabilities in this release land mainly in the provider presets, Settings → OAuth Auth Center, and the usage dashboard. The following docs are worth reading alongside it:

- **[xAI Grok Account Sign-In (Settings → OAuth Auth Center)](/en/docs?section=getting-started&item=settings)**: the device-code login flow, multi-account management, and the integration's boundaries; please read the client-identity disclosure under "Risk Notice" below before use.
- **[Using GPT Models in Claude Code (local routing guide)](/en/tutorials/claude-codex-routing-guide)** (now in Chinese / English / Japanese): a new step-by-step guide added in this release. Claude Code always speaks Anthropic Messages to the local `/v1/messages` route, and the local proxy converts each request to the upstream's Responses protocol — a gateway API key, a native Responses endpoint like xAI, or a ChatGPT subscription's Codex service all fit.
- **[Using Claude Models in Codex (local routing guide)](/en/tutorials/codex-claude-routing-guide)**: a new step-by-step guide in three languages, pairing with v3.17.0's native Anthropic Messages upstream to connect Codex to any Claude-family gateway that only offers `/v1/messages`.
- **[Usage Statistics](/en/docs?section=proxy&item=usage)**: understand the Usage Dashboard's data sources and how the statistics are counted. This release fixes the usage double count and adds the "Rebuild Codex Usage" maintenance action.

---

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues.

---

### Overview

Both main threads of CC Switch v3.18.0 revolve around xAI Grok. The first is **Grok Build joining the managed apps**: xAI's Grok CLI (live config `~/.grok/config.toml`) becomes the eighth managed app alongside Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes — provider add / import / one-click switch, bidirectional MCP and Skills sync, deep-link import, a standalone preset list, and proxy takeover with its own route namespace; the companion "Grok Official" entry supports official-login-state detection and import, and CC Switch never touches the official credentials. The second is **xAI Grok account OAuth sign-in**: device-code authorization replaces the API key, the local proxy injects the access token per request, and on the Claude Code / Claude Desktop side it performs the Anthropic Messages → xAI Responses conversion; the Codex side gets a managed OAuth preset with its own compatibility layer — the ChatGPT-backend-private shapes emitted by codex 0.142+ (namespace tool declarations, private fields) are deterministically flattened and stripped, so the strictly parsing xAI gateway no longer returns 422; API-key users get a separate "xAI (Grok)" native Responses direct-connection preset that goes through no conversion at all.

On correctness, this release concentrates on **the Codex usage double count from v3.17.0**: the replay of the parent thread's history at the start of fork / sub-agent logs is no longer imported as new usage (the parser now only trusts explicit parent identity plus token-signature alignment), a one-time automatic usage rebuild runs after upgrading (schema v16), and the usage page gains a manual rebuild button; proxy-side usage logging becomes idempotent (replays of the same response no longer stack duplicate rows), and the usage page no longer freezes during large session imports. The **Codex conversion layer** gets four more fixes: tool schemas normalized to object type, reasoning attached forward across turns, streamed parallel tool calls keeping their IDs and order, and generated model catalogs backfilling the fields codex 0.144.5+ requires. The diagnostics story matures too: logs persist across restarts, rotate by size, and redact at every egress, and UI crashes are captured by an error boundary and written to disk. Rounding things out: Kimi K3 presets and pricing, corrected OpenClaw preset costs, SudoCode.us restored, and the first-run tray language following the system locale.

**Release date**: 2026-07-21

**Stats**: 52 commits | 217 files changed | +21,452 / -6,285 lines

---

### Added

#### Grok Build: The Eighth Managed App

xAI's Grok CLI ("Grok Build", live config `~/.grok/config.toml`) is now a first-class citizen in CC Switch: provider add / import / one-click switch (with a "restart Grok Build to apply" toast), app visibility and config-directory override settings, session manager and usage dashboard coverage, prompts with first-launch auto-import, `ccswitch://` deep-link provider import, and local proxy takeover — with its own `/grokbuild/v1/responses` route namespace, an independent failover queue, and per-app proxy settings; forwarding reuses Codex's Responses path but never shares Codex's provider namespace or circuit-breaker state.

MCP servers sync bidirectionally with Grok's `[mcp_servers]` table, with the dialect differences smoothed over: Grok infers the transport from `command` / `url` and uses a `headers` field, so exports strip the explicit `type` and rename `http_headers` to `headers`, while imports infer the transport back. Skills gain a Grok Build enable flag too.

On presets, the Codex list was deliberately **not** borrowed (an early cut leaked China-direct providers and Codex default models into the Grok form); instead Grok Build ships its own curated list: only aggregators and relays that actually carry Grok models, with the default model normalized to `grok-4.5` (`x-ai/grok-4.5` on namespaced routers). The tools panel installs Grok via the official xAI installer first (`x.ai/cli/install.sh` / `install.ps1`), with the npm package `@xai-official/grok` as fallback; installs confirmed as native self-update via `grok update`, while npm installs keep npm-anchored updates — the self-update is gated on positive native detection, so it can never touch a different kind of install. UI copy is in sync across all four locales. ([#5453](https://github.com/farion1231/cc-switch/pull/5453))

#### Grok Official Login: Detection, Import, and Protection

A new "Grok Official" provider entry maps to the Grok CLI's own built-in xAI OAuth login: selecting it hides the connection fields and writes an empty `~/.grok/config.toml`, and CC Switch never stores or touches the official credentials. Live-config reads, backups, and official-state writes now use syntax-only TOML validation, so an official-login (empty) config round-trips normally; importing the live config while Grok is in official login state yields "Grok Official set as current" instead of an error, matching Codex behavior. Official-state detection is deliberately wired only into the manual import command — the startup auto-importer still rejects official-state configs, so a "Grok Official" entry you deleted never comes back on the next launch. Proxy takeover of an official-login Grok config is skipped automatically, with a clear rejection on the manual path, consistent with the existing "never proxy official providers" policy.

#### Sign In with Your xAI Grok Account: Claude Code and Claude Desktop

Claude Code and Claude Desktop gain an "xAI (Grok)" preset that replaces the API key with an OAuth device-code login: requests go through the local proxy, which performs the Anthropic Messages → xAI Responses API conversion and injects the access token per request, with `grok-4.5` as the default model on every tier (the Claude Desktop preset maps the `claude-*`-style role IDs to `grok-4.5` upstream so it passes Desktop's third-party model validation).

Settings → OAuth Auth Center gains an xAI section: device-code login (user code with a copy button, verification link, waiting / cancel / retry), multiple accounts with a default-account picker, per-account removal, and re-auth badges — an account whose refresh token was revoked stays visible as "expired" instead of disappearing, and auth status refetches every 15 seconds so a server-side revocation surfaces on its own.

The integration's boundaries are pinned shut: no matter what the endpoint / format fields in the form say, the upstream is always `https://api.x.ai/v1/responses` (Responses format); OAuth endpoints are resolved via OIDC discovery but strictly validated to `auth.x.ai` over https; refresh tokens live in `~/.cc-switch/xai_oauth_auth.json` (`0600` on Unix; access tokens are memory-only); and OAuth error bodies never enter error messages or logs. Pricing for `grok-4.5` ($2 input / $6 output / $0.50 cache read per million tokens) is seeded in sync so its usage no longer records $0, with existing databases picking the row up automatically on next launch. Four-locale copy included. Please read the client-identity disclosure under "Risk Notice" before use.

Not using OAuth and only have a pay-as-you-go xAI API key? You can still connect it to Claude Code: xAI's API endpoint is standard Responses protocol, so add it as an ordinary Responses provider — a custom provider with `https://api.x.ai/v1` and your API key, upstream format set to Responses, converted between Anthropic Messages ↔ Responses by local routing; it's the same recipe as the [Using GPT Models in Claude Code](/en/tutorials/claude-codex-routing-guide) guide. On the Codex side there's a ready-made API-key preset — see the next section.

#### Codex Straight to xAI: Managed OAuth and Native API-Key Presets

Codex gets two ways to talk to xAI directly — OAuth managed if you have a Grok subscription, native direct connection if you have an API key:

- **The "xAI (Grok) OAuth" managed preset** runs Codex on a Grok subscription. The form hides the key / endpoint / format fields and shows the account picker, "fetch models" uses the signed-in account, and the provider is pinned to native Responses with the base URL and per-request token enforced by the proxy — edits are ignored, so the managed route cannot be redirected. Because codex 0.142+ emits ChatGPT-backend-private request shapes (`type:"namespace"` tool declarations make xAI's strict parser return a straight 422, plus private fields like `prompt_cache_retention`, `safety_identifier`, `external_web_access`, the `additional_tools` carrier, and sampling knobs grok-4.5 doesn't support), the OAuth route adds a compatibility layer on top of the native passthrough: namespace tools are flattened to top-level function tools (with the same sha256-truncated naming as the Chat path) and restored to namespaced form on the response side for both streaming and non-streaming, and unsupported fields are stripped — all deterministic field removals / structural lifts, never semantic rewrites, so prompt-cache prefixes stay stable. The layer is gated exclusively on the xAI OAuth provider type; no other provider's traffic is touched.
- **The "xAI (Grok)" API-key preset** connects natively to Responses at `api.x.ai/v1`, with a 500K-context `grok-4.5` catalog entry built in. This preset does **not** receive the xAI-specific compatibility transforms above — API-key users on codex 0.142+ can still hit xAI's strict parser, and the OAuth preset is the fully compatible path.

xAI OAuth token failures are classified as non-retryable, so failover never quietly moves your conversation onto a different Grok account.

#### UI Crash Capture: On-Disk Reports and a Reload Screen

A React error boundary now wraps the entire UI (including the database-recovery screen): a renderer crash shows a "Something went wrong in the interface" card with a Reload button instead of a blank white window, and global `error` / `unhandledrejection` handlers persist renderer errors to disk — previously a JS crash left zero on-disk evidence. Everything the frontend logs passes two redaction layers: a structured serializer that redacts by sensitive property name (`tokens` / `apiKeys` / `credentials` variants all normalized to match, hiding the entire value including nested objects) and by value shape (token prefixes, PEM headers, high-entropy opaque strings), then a single text egress whose ordered regex chain covers URL query values and credentials, auth headers and schemes, and named secret containers — even in double-encoded JSON. JSON arriving as a string is re-parsed and redacted structurally, and oversized structured input is dropped entirely rather than truncated — a truncated JSON string would fall back to the weaker text regexes and could leak. The settings toggles were also relabeled to say what they actually control: "Application Diagnostic Logs" (cc-switch.log) versus the proxy's "Record Request Usage" (the stats database, which never was a text log). Four locales in sync.

#### "Rebuild Codex Usage" Maintenance Button

The usage dashboard's maintenance section gains "Rebuild Codex Usage": after backing up the database, it wipes only `codex_session`-sourced detail rows, their `_codex_session` daily rollups, and the Codex sync cursors, then re-imports every rollout file from scratch with the corrected parser — the recovery path for databases already inflated by the double-count bug below, and the retry path for deferred fork files whose parent log has since been restored. The manual rebuild fails hard when the pre-rebuild backup cannot be written (the automatic migration variant only warns, since blocking startup on an unwritable backup directory would be the worse outcome after an upgrade); the whole backup → reset → re-import sequence holds the session-sync lock, so the 60-second background sync cannot interleave with the wipe; and completion always sends exactly one frontend refresh notification — including when the re-import returns zero rows or fails — so the dashboard never keeps showing pre-reset numbers. Cursor cleanup matches rollout paths purely by shape (a `rollout-{uuid}` filename under a `sessions` / `archived_sessions` segment), so cursors recorded under an old `CODEX_HOME` are cleaned too. Four locales in sync.

#### Session Import Observability: Deferred Files and Suspected Duplicates

Session sync results now report `filesScanned`, `deferredFiles` — fork rollouts whose parent log is missing or whose parent markers conflict are held back without writing a cursor, so a later sync or a manual rebuild retries them instead of importing on a guess — and `suspectedDuplicates`: a post-insert probe checks each imported row for a pre-existing same-fingerprint row (via the `idx_request_logs_dedup_lookup_expr` expression index) and logs a warning per hit. If the double-count bug ever regresses, it will announce itself in the logs instead of silently inflating the totals.

#### Kimi K3 in Presets and Built-In Pricing

The Kimi open-platform presets for Codex / Hermes / OpenClaw / OpenCode gain Kimi K3 (1M context window), appended after K2.7 Code so existing default-model behavior is unchanged. The built-in pricing table gains `kimi-k3` (official list price: $3 input / $15 output / $0.30 cache read per million tokens) plus a bare `k3` alias — the Kimi For Coding subscription reports its model under the short id `k3`, which would otherwise match no pricing row (same precedent as the existing `hunyuan-hy3` / `hy3` pair). Existing databases pick both rows up automatically on next launch, without touching user-edited pricing.

#### SudoCode.us Returns, Coexisting with SudoCode.chat

The two unrelated companies that happen to share the "SudoCode" name are now two separate presets: the sponsor is renamed "SudoCode.chat", and the previously replaced-in-place "SudoCode.us" returns with its original endpoints, models, and icon, plus a distinct Hermes slug so both can coexist in the additive `~/.hermes/config.yaml`. Counting the new Grok Build preset list, SudoCode.chat ships in seven apps and SudoCode.us in all eight.

---

### Changed

#### Diagnostic Logs: Persistent Across Restarts, Size-Rotated, and Never Recording Secrets

`cc-switch.log` is no longer wiped on every startup — the log that could have explained a crash used to be gone by the time the app reopened — and instead rotates at 20 MB with 4 archives kept (~100 MB cap, versus a single file that could balloon to 1 GB before); the previously unbounded `crash.log` rotates at 5 MB with 2 archives, with the check / rotate / append sequence under one lock so concurrent panics cannot lose an archive.

Persistent logs make verbatim secrets a real exposure (users attach these files to public issues), so the same change scrubs every backend log egress: upstream URLs are logged with userinfo / query / fragment stripped (origin-only when no known secret is available to substitute, since a credential could be embedded in the path); request and response bodies are never logged — replaced by byte counts, a short hash, or a safe classification (`sse` / `html` / `json-like` / `binary-or-encoded`, …) that keeps the transform-debugging signal without the content; response headers go through an allowlist (unlisted headers log name-only); the secret values currently in use (API key, access token) are substituted out of any logged URL that carries them; and MCP custom-field values are omitted. The log plugin also registers earlier (updater / startup failures become diagnosable), the persisted log level applies as soon as the database opens and fails closed to Info, and the "Enable Diagnostic Logs" switch now gates frontend-originated log writes too. **Log files written by earlier versions are not retroactively scrubbed** — see "Upgrade Notes".

#### Preset Picker: Sponsors Grouped, Everything Else Alphabetized

The preset picker's default order becomes four tiers: official first, then the prime partner, then sponsor presets (in the same order as the README sponsor table, which the preset files were physically reordered to match), then all remaining presets sorted alphabetically by display name instead of file order. An entry matching multiple tiers lands only in the earliest one, so nothing shows up twice.

#### Preset "Get API Key" Links Updated

The key-application links on the RunAPI, ClaudeCN, ZetaAPI, and APINebula presets now open each provider's current registration / referral page (ClaudeCN also moved domains: claudecn.top → claudecn.ai). Referral tags remain confined to these links and the README — website links and API endpoints stay untouched.

---

### Fixed

#### Codex Fork / Sub-Agent Replayed Parent History No Longer Counted as New Usage (the v3.17.0 Double Count)

Fixes the v3.17.0 usage inflation: forking a Codex task or spawning a sub-agent in copy mode re-counted the parent conversation's token history as new usage — users reported single days jumping by billions of tokens, byte-identical parent/child rows, and empty forks carrying usage they never consumed. Fork / sub-agent rollout files begin by replaying the parent thread's history, and the old parser located the takeover boundary heuristically (the first `thread_settings_applied` event, object-shaped `subagent` source markers): the boundary landed too early when the parent's own settings changes appeared in the replay, and the current string-shaped source markers weren't recognized at all, importing the entire replayed parent history verbatim. The new parser trusts only explicit parent identity — `forked_from_id` on the child's `session_meta`, or `source.subagent.thread_spawn.parent_thread_id`, with a conflict between the two deferring the file — anchors each thread's identity to the rollout filename UUID, loads the parent rollout's own pre-fork token-count sequence, and strips the child's replayed prefix by aligning token signatures against it: replayed events only restore the cumulative baseline and are never inserted as rows. Sub-agent logs that carry no replayed history are now counted as live usage, also fixing the opposite-direction undercount where real sub-agent consumption was skipped as suspected replay. ([#5335](https://github.com/farion1231/cc-switch/issues/5335), [#5433](https://github.com/farion1231/cc-switch/issues/5433), [#5381](https://github.com/farion1231/cc-switch/issues/5381))

#### Proxy Usage Logging Is Now Idempotent: Response-Scoped Stable Keys

When a terminal usage event carried no message id — the norm for Codex `/responses` traffic through the local proxy — the dedup key fell back to a random UUID, so every retry / replay of the same upstream response minted a fresh key and `INSERT OR REPLACE` stacked a new row each time; one reporter's database held the same usage combination 2,078 times. The parser now takes the key from the response envelope itself — the Codex `response.completed` event's `response.id` (ids from `response.created` are discarded), Chat Completions `chatcmpl` ids, and the Gemini `responseId` — scoped as `session:{app_type}:{provider_id}:{id}`: the same response replayed against a different provider during failover still bills once per provider without cross-provider collisions (Claude keeps the bare `session:{id}` shape so proxy rows continue to converge with session-log imports). When no envelope id exists at all, the fallback is a deterministic SHA-256 over the response's usage semantics rather than a random UUID — an identical replay must collide into the same key for dedup to work — and the final database write becomes a guarded insert-if-absent within the dedup window instead of an unconditional REPLACE. ([#5496](https://github.com/farion1231/cc-switch/issues/5496))

#### Usage Page No Longer Freezes During Large Session Imports

Opening the usage page while a big import ran could lock the whole UI up: every inserted row fired a refresh notification, each notification made the frontend re-run all ~10 usage queries, and those queries contended with the importer for the single database connection while it parsed rollout files tens of megabytes large, line by line — on duplicate-inflated databases the three compounded each other. Session sync now notifies the frontend once per completed pass; all session importers are serialized behind a single-flight lock (a manual "sync now" queues behind the running pass instead of racing it); the blocking parse work runs on a dedicated blocking thread so it no longer starves the async runtime driving the UI's commands; and the 60-second background tick skips missed runs instead of bursting to catch up.

#### codex 0.144.5+ No Longer Fails to Start on CC Switch-Generated Model Catalogs

codex ≥ 0.144.5 parses external model catalogs strictly and rejects the whole file when an entry is missing `supports_reasoning_summaries` — both the Codex CLI and the desktop app failed to launch, and deleting the generated catalog didn't help because any provider save regenerated it the same way. The root cause: CC Switch clones its catalog template from the machine-shared `models_cache.json`, whose field set is whatever the last-writing codex process produced — a coexisting older codex build kept rewriting the cache without the field the newer parser requires. Generated catalogs now backfill parser-required fields from the bundled static template, and only when absent (dynamic values always win); optional capability fields whose "missing = parser default" semantics must survive are deliberately not backfilled.

#### Windows: No More Console Flash or UI Freeze When Switching Providers

Switching providers or toggling takeover on Windows flashed a transient console window and froze the UI for up to ~2 seconds. Three causes, three fixes: the `codex debug models --bundled` probe launches `codex.cmd` through `cmd.exe`, which in a GUI-subsystem app spawns its own console — the child process is now created with `CREATE_NO_WINDOW`; the model-catalog template was regenerated on every switch — it's now cached process-wide after the first successful load (failures stay retryable, so a bad first probe cannot poison the cache), and the Codex CLI starts at most once per app run; and `switch_provider` was a synchronous command on the main thread — it's now async with the real work on a blocking thread, still serialized by the per-app switch lock. The freeze fix benefits all platforms; the console-flash fix is Windows-specific.

#### Tool Schemas with Null, Missing, or Union Parameter Types Accepted by Strict Upstreams

Built-in Codex tools such as `codex_app__automation_update` declare `parameters: null` (or `type: null`), which strict OpenAI-compatible upstreams like DeepSeek reject with a 400 for the entire request — killing tool-using sessions routed through the proxy. The Responses→Chat bridge now normalizes every tool's parameters to a `type:"object"` schema: null or missing parameters (including the nested-form missing case) become `{"type":"object","properties":{}}`, a non-object `type` (including `type: null`) is corrected to `"object"` in place, and top-level `oneOf` union schemas get a root `type:"object"` added with their branches preserved untouched. The same object-type guarantee was extended to the Codex→Anthropic tool path's `input_schema`. Existing `properties` / `required` are never dropped. ([#4706](https://github.com/farion1231/cc-switch/pull/4706), [#5315](https://github.com/farion1231/cc-switch/pull/5315), fixes #4705, #4783)

#### Reasoning Models Keep Their Thinking Across Multi-Turn Codex Chat Conversations

With a reasoning model (e.g. kimi-k2-thinking) behind the proxy's Responses→Chat bridge, multi-turn history mangled the thinking: each turn's `reasoning` item got glued onto the tail of the **previous** assistant message, leaving the following assistant turn with no `reasoning_content` — models would visibly break off mid-conversation. Responses semantics place reasoning **before** the message it belongs to, so the bridge now attaches reasoning forward to the assistant message or tool call that follows it; genuine trailing reasoning back-attaches only at a confirmed tail (end of input, or a turn boundary such as an incoming user message — where it was previously silently discarded), appending to any embedded reasoning already present; and pending reasoning is always consumed at boundaries, so it can never leak across a user turn into a later assistant message. ([#5508](https://github.com/farion1231/cc-switch/pull/5508))

#### Streamed Parallel Tool Calls Keep Their IDs and Their Order

Two bugs in the Chat→Responses streaming bridge corrupted parallel tool calls from upstreams that split identity across chunks: a continuation delta carrying an empty `id` overwrote the real `call_id` (the Codex client then saw `call_id:""` and couldn't match tool results to calls), and tool calls were emitted the moment they individually became ready, so a later index whose name arrived early could jump ahead of an earlier one — reordering parallel calls. Empty ids are now ignored, and emission goes through a consecutive-index gate that releases tool calls strictly in Chat `index` order, waiting on any not-yet-identified earlier index; no fake call id is ever synthesized mid-stream (only as a last resort at stream finalization, which also skips nameless calls defensively and still emits sparse indexes). ([#5310](https://github.com/farion1231/cc-switch/pull/5310))

#### Managed-OAuth Providers Reliably Flagged as "Needs Local Routing"

The "needs routing" badge and switch-time warning were derived from the provider's API format — the wrong signal for managed-OAuth providers (Copilot, Codex OAuth, xAI), whose credential is injected by the proxy regardless of upstream format: a managed provider on a native format got no warning and failed silently without takeover. Routing need is now decided by a single shared predicate: official providers never need routing, managed-OAuth providers always do, and format-based rules apply only to the remaining cases. The switch-time gate also checks the right readiness signal per app: per-app takeover status for most apps (the old gate looked only at a global proxy-running flag, missing "the proxy runs but this app isn't taken over"), while Claude Desktop keeps watching the proxy process itself — the backend's takeover status has no Claude Desktop field, so a uniform per-app gate would have left Desktop warning forever. Claude Desktop provider forms now force proxy mode and lock the model-mapping toggle for every managed-OAuth type, not just xAI. Four locales in sync.

#### Tool Updates Work When Node Lives in nvm / fnm / mise

Anchored npm update and repair commands invoked npm by absolute path, but npm's launcher resolves `node` via its `#!/usr/bin/env node` shebang against PATH — and a GUI-launched app inherits only the system PATH, without the version-manager directories, so updates for tools installed via nvm / fnm / mise silently failed. Every anchored npm invocation now prefixes PATH with npm's own sibling `bin` directory, so npm and its shebang resolve to the same Node install; the Codex self-repair (uninstall + reinstall) path is covered too.

#### Deleted Default Skill Repositories Stay Deleted

Default Skill repositories were re-seeded on every startup by a "supplement missing defaults" pass, so a default repo you deleted silently returned on the next launch. Seeding is now one-time per database, tracked by a settings flag; databases that already contain repositories at upgrade time get the flag set without any re-seeding, so existing selections are untouched. ([#5356](https://github.com/farion1231/cc-switch/pull/5356))

#### First-Run Tray Language Follows the System Locale

Before any language was chosen in settings, the tray menu was hardcoded to Simplified Chinese — on English / Japanese / Traditional-Chinese systems the main UI correctly followed the OS locale while the tray disagreed, until the user switched language once. The tray now derives its first-run language from the OS locale with the same precedence rules as the frontend (including `zh-TW` / `zh-HK` / `zh-Hant` → Traditional Chinese); an explicitly chosen language always wins, and unreadable locales fall back to Chinese as before. ([#4355](https://github.com/farion1231/cc-switch/pull/4355))

#### Failed Imports Show the Real Error and Refresh the List

Every failed "import from live config" produced an empty error toast, because Tauri's `invoke` rejects with the backend's error **string** while the handler read `.message` off it. The backend's actual message is now shown (with a localized generic fallback), and the provider list refreshes even on failure, so side effects committed before the error are visible immediately.

#### OpenClaw Preset Model Costs Corrected to Official List Prices

Fifteen OpenClaw preset entries carried cost values in the wrong unit or unconverted currency — the `cost` field is USD per million tokens, but e.g. `glm-5.1` was listed at `0.001/0.001` (≈1000× undervalued, so its usage showed near-zero cost) while `deepseek-v4-pro` carried unconverted CNY values (overvalued). All entries now carry official list prices in $/M; subscription-plan and free-tier endpoints deliberately show list prices too, so plan users see the standard value of their usage. Providers created from these presets going forward get the corrected values; previously added providers keep the config they were created with.

#### A Batch of Small UI Fixes

- **AiHubMix icon**: the Codex app's AiHubMix preset was the only one missing its brand-icon fields and rendered a generic icon; it now matches the other apps.
- **Two missing locale keys backfilled**: the reason fragment in Codex's "needs routing because it uses Anthropic Messages format" toast rendered in Chinese inside an otherwise-localized sentence (`proxyReasonAnthropicMessages` existed in no locale file), and the provider form's key-status loading label had shipped only as a hardcoded default since April; both now exist in zh / en / ja / zh-TW.

---

### Documentation

#### Codex ↔ Claude Routing Guides, Both Directions

Two new guides complete the pair — "Claude models inside the Codex client" and "Responses providers inside the Claude Code client":

- **[Using Claude Models in Codex](/en/tutorials/codex-claude-routing-guide)** (Chinese / English / Japanese, with screenshots): pairs with v3.17.0's native Anthropic Messages upstream to connect Codex to a Claude-family `/v1/messages` gateway; the v3.17.0 release notes now link to it.
- **[Using GPT Models in Claude Code](/en/tutorials/claude-codex-routing-guide)** (Chinese / English / Japanese, with screenshots): drive Claude Code with Responses-speaking providers (a gateway API key, or a ChatGPT subscription's Codex service) — Claude Code always speaks Anthropic Messages to the local `/v1/messages` route, and the proxy converts each request to the upstream's Responses protocol.

#### README Sponsor Updates

SubRouter joins the sponsor table across the four README languages; the pinned Kimi sponsor copy is refreshed to K3 with banners served from the Moonshot CDN; RunAPI benefit copy is refreshed, and sponsor rows are reordered to match the in-app preset order.

---

### Upgrade Notes

#### Automatic Database Migration and the One-Time Codex Usage Rebuild

Upgrading from v3.17.0 runs three schema migrations in sequence (v13 → v16): v14 rebuilds the `proxy_config` table to admit Grok Build (existing per-app proxy settings are all carried over, and a `grokbuild` row is added); v15 adds Grok Build enablement columns to the MCP-server and Skills tables; and v16 triggers the one-time automatic Codex usage rebuild — the database is first backed up under `backups/`, `codex_session` data and cursors are reset, and the normal startup sync re-imports everything with the corrected parser. Typical datasets take seconds; the heaviest dataset measured (1,801 rollout files / 1.5 GB) took about 65 seconds. Later launches are incremental as before. If you're in the habit of rolling back to older versions, back up `~/.cc-switch/cc-switch.db` yourself first.

**Please note on first launch**: the history repair completes **progressively** — the rebuild proceeds in the background with the startup sync, and during that window the Codex history numbers on the usage dashboard first drop to zero and then fill back in step by step. This is expected behavior, not data loss. The post-rebuild total will usually be **smaller** than before the upgrade: the part inflated by double counting is squeezed out, and what remains is your real usage.

#### Boundaries of the Rebuild

- The rebuild recomputes usage from the rollout JSONL files, so **history whose source log was already deleted cannot be reconstructed**.
- Fork files whose parent rollout is missing are deferred and reported instead of imported on a guess; restore the parent log and run "Rebuild Codex Usage" to import them later.
- Historical proxy-source duplicate rows are permanently retained — the migration rebuilds only session-sourced data, and no cleanup pass for past proxy inflation exists; the idempotent logger only guarantees no new duplicates from this point on.

#### Old Log Files Are Not Retroactively Scrubbed

From this release on, diagnostic logs are no longer cleared at startup and persist across restarts (up to ~100 MB of rotated runtime logs plus ~15 MB of crash logs). **Log files written by earlier versions are not retroactively scrubbed** and may contain API keys, tokens, or URLs with credentials — review pre-upgrade logs before sharing them publicly.

#### Grok Build Installs via the Official Installer Script

Installing or reinstalling Grok Build now prefers the official xAI installer, fetching `x.ai/cli/install.sh` (or `install.ps1` on Windows) at install time, with npm as fallback; existing npm installs keep updating via npm.

#### Built-In Pricing Rows Auto-Appended

New pricing rows (`grok-4.5`, `kimi-k3`, `k3`) are appended automatically on next launch via insert-if-absent; user-edited pricing rows are never overwritten.

---

### Risk Notice

#### xAI Grok OAuth Sign-In (New in This Release — Please Read)

This release's xAI Grok OAuth integration **reuses the public OAuth client identity and scopes registered for the official Grok CLI** (`client_id b1a00492-073a-47ea-816f-4c329264a828`, scope including `grok-cli:access`), rather than an application identity registered by CC Switch. xAI may not support this use, and **it could lead to account restriction or suspension — use at your own risk**. The feature is entirely opt-in: if you don't add an xAI provider, nothing changes. On first login it creates `~/.cc-switch/xai_oauth_auth.json` (refresh tokens only, `0600` on Unix; access tokens are held in memory) and contacts `auth.x.ai` and `api.x.ai` through your configured outbound proxy, with no local callback port.

#### Carried-Over Reverse-Proxy Notices

**Codex OAuth reverse proxy**: using a ChatGPT subscription's Codex OAuth through a reverse proxy may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Third-party provider routing**: when CC Switch's local proxy converts and forwards Codex, Claude Desktop, or Grok Build requests to third-party providers, each provider may have different requirements for billing, compliance, and data retention. Read the target provider's terms before use.

By enabling these features, users accept the related risks. CC Switch is not responsible for account restrictions, warnings, or service suspensions caused by using these features.

---

### Thanks

Thanks to the following contributors for the features and fixes in v3.18.0:

- [#5453](https://github.com/farion1231/cc-switch/pull/5453): first-class Grok Build support (the core of the eighth managed app), thanks @YUZHEthefool.
- [#5508](https://github.com/farion1231/cc-switch/pull/5508): attach reasoning forward across the Responses→Chat bridge, thanks @ka79376046.
- [#5310](https://github.com/farion1231/cc-switch/pull/5310): preserve streamed parallel tool-call identity and order, thanks @SaladDay.
- [#5315](https://github.com/farion1231/cc-switch/pull/5315): default Codex tool parameters to an object schema, thanks @Komikawayi.
- [#4706](https://github.com/farion1231/cc-switch/pull/4706): normalize tool parameter types for strict OpenAI-compatible providers, thanks @Ryan2128.
- [#5356](https://github.com/farion1231/cc-switch/pull/5356): keep deleted default Skill repositories deleted, thanks @allenxu09.
- [#4355](https://github.com/farion1231/cc-switch/pull/4355): first-run tray language follows the system locale, thanks @LaiYueTing.
- [#5138](https://github.com/farion1231/cc-switch/pull/5138): extend backend CI to Linux / Windows / macOS, thanks @zayokami.

Thanks also to everyone who reported Codex usage anomalies, new-codex startup failures, and tool-call problems — this release's most important fixes came directly from reproduction clues in those real-world reports.

---

### Download & Install

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) and download the build for your system.

#### System Requirements

| System  | Minimum Version      | Architecture                        |
| ------- | -------------------- | ----------------------------------- |
| Windows | Windows 10 and later | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey)+ | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below      | x64 / ARM64                         |

#### Windows

| File                                     | Description                                      |
| ---------------------------------------- | ------------------------------------------------ |
| `CC-Switch-v3.18.0-Windows.msi`          | **Recommended** - MSI installer with auto-update |
| `CC-Switch-v3.18.0-Windows-Portable.zip` | Portable build, unzip and run                    |

Windows ARM64 devices should pick the artifact whose file name carries the `arm64` tag.

#### macOS

| File                             | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.18.0-macOS.dmg`    | **Recommended** - DMG installer, drag to Applications |
| `CC-Switch-v3.18.0-macOS.zip`    | Unzip and drag to Applications, Universal Binary      |
| `CC-Switch-v3.18.0-macOS.tar.gz` | For Homebrew install and auto-update                  |

Homebrew install:

```bash
brew install --cask cc-switch
```

Upgrade:

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux assets are available for both **x86_64** and **ARM64** (`aarch64`). Choose the file whose architecture tag matches your machine's `uname -m` output:

- `CC-Switch-v3.18.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.18.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended Format | Install Command                                                        |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Make executable and run directly, or use AUR                           |
| Other distributions / unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.17.0] - 2026-07-13

> This release brings a long-awaited capability: **one-click "Projects" switching** — save your current provider, MCP, Skills, and memory files as a single named snapshot, swap the whole set for another one from the title bar or tray with a single click, and have the state of the project you're leaving automatically saved back on the way out. The Codex side gets plenty too: **your official ChatGPT subscription account can now route through the local proxy as well**, getting the same routing and usage statistics as third-party providers; the GPT-5.6 family's context window and Sol / Terra / Luna three-tier pricing land in one step; and a native Anthropic Messages upstream format is added — is Claude Code banned at your company but the Claude API isn't? You can now **use Claude-family models directly inside Codex**. On top of that comes a big wave of correctness fixes: upstream failures no longer turn into "empty replies", cache-write tokens are no longer double-billed, deleted MCP servers no longer come back from the dead, and Kimi For Coding's 256K window finally takes effect for real.

### Usage Guides

The new capabilities in this release land mainly in the project switcher at the top of the home page, the Codex provider form, and the usage dashboard. The following docs are worth reading alongside it:

- **[Using Claude in Codex (local routing guide)](/en/tutorials/codex-claude-routing-guide)**: a new step-by-step guide for this release's native Anthropic Messages upstream. It walks through setting a Codex provider's upstream format to `anthropic` to connect to any Claude-family gateway that only offers `/v1/messages`, and use Claude-family models inside Codex.
- **[Using Kimi inside Codex (local routing guide)](/en/tutorials/codex-kimi-routing-guide)**: a new step-by-step guide added in this release. Newer Codex CLI speaks the OpenAI Responses protocol, while the Kimi Open Platform and Kimi For Coding expose Chat Completions endpoints, so a direct connection usually 404s; the guide walks through using the built-in `Kimi` / `Kimi For Coding` presets together with local routing to handle the protocol conversion.
- **[Codex Official Login Preservation](/en/tutorials/codex-official-auth-preservation-guide)**: understand how CC Switch preserves your official ChatGPT login when you switch to a third-party provider. This release goes a step further — the official account itself can now route through the proxy too (see "Added" below).
- **[Usage Statistics](/en/docs?section=proxy&item=usage)**: understand the Usage Dashboard's data sources and how the statistics are counted. This release fixes cache-write billing, fills in Codex subagent session accounting, and adds GPT-5.6 and Hunyuan Hy3 pricing.

---

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues.

---

### Overview

CC Switch v3.17.0 is a major feature release following v3.16.5, centered on **Projects**: you can save the current provider, MCP, Skills, and memory-file state of Claude Code / Claude Desktop / Codex as a named snapshot — say a "Development" set for a coding directory and a "Drawing" set for a writing-and-drawing directory — and swap the whole set with one click from the switcher at the top of the home page or the "Projects" tray submenu. Before you switch, the state of the project you're about to leave is automatically saved back, so a project always holds exactly what you last left it as. The second main thread is Codex: **your official ChatGPT subscription account can now be taken over by the local proxy route** (no API key needed — Codex's own login credentials are passed through verbatim and your official login is never overwritten); paired with a corrected client identity, the latest subscription models like `gpt-5.6-luna` no longer falsely 404; GPT-5.6's 372K context-window injection, Sol / Terra / Luna three-tier pricing (including the 1.25× cache-write rate), and preset default models all land together; and the Codex upstream format gains a native Anthropic Messages protocol — which targets a very real scenario: plenty of companies ban the Claude Code client but do **not** ban the Claude API, and those users can now point Codex directly at the Claude API (or any gateway that only offers `/v1/messages`) and keep using Claude-family models inside Codex.

For everyday-use correctness, this release makes three concentrated waves of fixes. **Proxy bridge**: semantic failures returned inside a 2xx are no longer turned into an empty reply but trigger failover instead; reasoning content, tool results, and the system role round-trip losslessly across the Responses↔Anthropic bridge; prompt-cache breakpoint injection is more thorough, so long conversations no longer resend everything at full price each turn. **Usage billing**: cache-write tokens were previously billed twice — once at the input rate and once at the cache-creation rate — and are now corrected (the database is upgraded to schema v13 so historical data stays consistent); usage and quota queries automatically retry on transient network failures and no longer cache a failure body as real data. **Codex `config.toml`**: MCP servers you deleted in the app no longer come back on provider switch; when parsing a live file fails, sync errors out rather than blanking the whole file; and the "Apply Common Config" merge is moved to the backend so comments and key order are no longer scrambled. Also included: Kimi For Coding's 256K window finally taking effect, Codex subagent and free-tier quota accounting filled in, Zhipu team-plan quota queries, OpenCode form enhancements, and a batch of preset updates.

**Release date**: 2026-07-13

**Stats**: 69 commits | 172 files changed | +21,067 / -2,464 lines

---

### Highlights

- **One-click "Projects" switching**: save your provider, MCP, Skills, and memory files as a single named snapshot (say one set for coding, another for writing and drawing) and swap the whole thing with one click from the top of the home page or the tray; the state of the project you leave is saved back automatically on switch. Covers three scopes — Claude Code, Claude Desktop, and Codex — that don't interfere with one another.
- **Official Codex account can route through the proxy too**: a Codex session logged in with a ChatGPT subscription can now route through the local proxy, getting routing and usage statistics identical to third-party providers; the official login credentials are never overwritten or stored.
- **GPT-5.6 fully in place**: a 372K context window is auto-injected when Claude Code routes through Codex takeover; Sol / Terra / Luna three-tier pricing is seeded (cache writes billed at 1.25× the input rate); the relevant presets' default models are bumped to the gpt-5.6 family; and, with the client identity corrected, `gpt-5.6-luna` no longer falsely 404s.
- **Use Claude-family models inside Codex (native Anthropic Messages upstream)**: plenty of companies ban the Claude Code client but not the Claude API — now, by setting a Codex provider's upstream format to `anthropic`, you can connect directly to the Claude API or any gateway that only offers `/v1/messages`, with the local proxy handling the two-way Responses↔Anthropic conversion and standard 5-minute prompt-cache injection built in.
- **Proxy bridge correctness fixes**: upstream failures fail closed and trigger failover instead of an empty reply; reasoning / tool results / the system role survive the bridge losslessly; cache writes are no longer double-billed; breakpoint injection is more thorough.
- **Codex config.toml hardening**: deleted MCP servers no longer come back; MCP sync errors out rather than blanking the file on a parse failure; common-config merges preserve comments and key order.
- **Kimi For Coding 256K finally works**: the previous 262144 compaction window never actually took effect (clamped back to Claude Code's 200K default); this release fills in the model-alias routing and window injection; existing providers need to re-apply the preset (see "Upgrade Notes").

---

### Added

#### Projects: Named Snapshots of a Whole Configuration, Switched in One Click

This is the headline feature of the release. You can save your current provider, MCP, Skills, and memory-file state as a named "project", then swap the whole set with one click from the project switcher at the top of the home page or the "Projects" tray submenu, instead of toggling each piece by hand.

Here's a typical scenario: you have one directory for coding and another for writing or drawing. Coding wants one provider, plus MCP like filesystem / GitHub, code-review Skills, and a memory file spelling out your engineering conventions; writing or drawing often wants a different provider, a different set of MCP, and completely different prompts. Bouncing between the two used to mean switching providers, toggling MCP and Skills one by one, and then editing the memory file; now you save the two states as two projects — "Development" and "Drawing" — and when you switch directories to work, one click in CC Switch puts the whole configuration in place.

Projects span three scopes — Claude Code, Claude Desktop, and Codex (the only dimension CC Switch manages for Claude Desktop is the provider, so its snapshots contain only the provider and applying one touches no other dimension).

A few design points worth knowing:

- **Projects are global entities, switched per scope**: the same project records its own current project and snapshot slot separately on the Claude Code / Claude Desktop / Codex sides, so switching projects on the Codex tab never touches Claude's configuration.
- **Switching auto-saves**: before you switch projects, the state of the project you're about to leave in the current scope is first saved back automatically — so a project always holds exactly what you last left it as, with no (and no need for a) manual "update snapshot" button.
- **Applying is best-effort**: applying a snapshot reuses the existing switch primitives (switch the provider first, then do the minimal MCP / Skills diff toggles, then enable memory files); if something a snapshot references has been deleted, it's only warned and skipped, never rolled back wholesale.
- **Auto-disables proxy takeover**: before applying a project, proxy takeover for each app in that scope is disabled first, to avoid the snapshot state fighting with the routing state.

If you don't use Projects, you can turn off "Show project switcher" under Settings → Home Display, which only hides the home-page entry — the tray submenu and project data are unaffected. It's backed by a new `profiles` table (the database migrates automatically, no manual steps), with UI copy in sync across all four locales.

#### Proxy Route Takeover for the Official Codex ChatGPT Account

A Codex session using a ChatGPT subscription (OAuth or API-key login) can now route through CC Switch's local proxy too — official-account traffic gets routing, format conversion, and usage statistics identical to third-party providers. Just pick the built-in "OpenAI Official" entry in the provider panel or tray to take it over (if you deleted it before, it's restored automatically when you add a provider); the card badge shows "Official account routing" while routing.

The implementation deliberately achieves **zero credential storage**: instead of writing any placeholder key to `auth.json`, it projects a dedicated `model_provider` pointing at the local proxy into `config.toml`, and Codex sends its own ChatGPT authorization header to the proxy, which passes it through verbatim to the official endpoint — the credentials on the `codex-official` line are always empty. The official login itself is never overwritten: on takeover, OAuth / API-key material is preserved into the backup, and a 401 / 403 from the official side is treated as a non-retryable error, so failover never quietly moves your conversation to another account. Accordingly, the copy for the "Preserve Codex official login on switch" setting has been updated — under route takeover the official login is always preserved, so that toggle now only governs third-party direct switches that don't route through the proxy.

#### GPT-5.6: Context Window, Preset Defaults, and Three-Tier Pricing

Three things were done around the GPT-5.6 family:

- **372K context-window injection**: when Claude Code routes to the ChatGPT Codex (Codex OAuth) backend through proxy takeover, `CLAUDE_CODE_MAX_CONTEXT_TOKENS` and `CLAUDE_CODE_AUTO_COMPACT_WINDOW` (both 372000) are auto-injected into the live `settings.json`, so Claude Code no longer auto-compacts prematurely at its default 200K window nor overflows the upstream. The injection is strictly gated: it only injects when every configured model key points at the gpt-5.6 family (gpt-5.5's catalog window swings between 272K and 372K, so it's deliberately not inherited); your manually set values always win; and it's stripped on switch-away under mirrored conditions, so a program default is never baked into your provider config.
- **Preset default-model bump**: the Codex OAuth presets for Claude Code and Claude Desktop bump their default routes to the gpt-5.6 family (haiku → `gpt-5.6-luna`, main model / sonnet / opus → `gpt-5.6`), and the custom Codex `config.toml` template's default model follows suit.
- **Sol / Terra / Luna three-tier pricing**: the usage dashboard seeds all three tiers at official rates — Sol 5 / 30 / 0.50, Terra 2.50 / 15 / 0.25, Luna 1 / 6 / 0.10 (USD per million tokens, input / output / cache read). Unlike 5.5 and earlier, the 5.6 family bills **prompt-cache writes at 1.25× the input rate** (Sol 6.25 / Terra 3.125 / Luna 1.25), seeded accordingly, with existing rows previously billed at 0 auto-repaired; bare `gpt-5.6` and its per-effort suffix variants align to the Sol rate.

#### Use Claude-Family Models inside Codex: Native Anthropic Messages Upstream

This feature comes from a very real need: **plenty of companies ban the Claude Code client for compliance reasons, but do not ban the Claude API.** For those users the model itself is available; what's missing is a permitted client — and Codex can now fill that slot. Pick the new `anthropic` option in a Codex provider's upstream-format selector, and you can connect directly to the Claude API or any gateway offering the native Anthropic Messages protocol (`/v1/messages`); the local proxy handles the two-way conversion of requests, responses, and streaming between Responses and Anthropic, and you chat and use tools inside Codex as usual while Claude-family models run behind the scenes. The form provides the supporting pieces: an auth-field selector (`ANTHROPIC_AUTH_TOKEN` sends `Authorization: Bearer`, the default; or `ANTHROPIC_API_KEY` sends `x-api-key`), an optional Claude Code client-impersonation toggle (off by default), and a per-provider max-output-token override (Codex doesn't send `model_max_output_tokens`, and when unset it falls back to a conservative 8192, which may truncate long or heavy-reasoning replies). The conversion bridge auto-injects standard 5-minute prompt-cache markers (system prompt, tools, and history go through the cache instead of being resent at full price each turn), supports the `[1m]` long-context marker with the corresponding beta header, and reports a truncated stream faithfully as incomplete rather than disguising it as success. ([#5071](https://github.com/farion1231/cc-switch/pull/5071))

#### "Default Model" Field Added to the Codex Provider Form

The top-level `model` key in `config.toml` is now an editable field in the form: when a new model (e.g. `gpt-5.6`) ships, you can point an existing provider at it directly without waiting for a preset update (presets only affect newly added providers). The field is two-way synced with the TOML editor, its candidate list is the union of the model-mapping catalog and the provider's `/models` endpoint, and when a value isn't in the catalog it offers a one-click "Add to mapping". An explicitly entered value always wins over the implicit backfill from the mapping's first row; model names and `base_url` are TOML-escaped on write, eliminating any chance that remote data from `/models` injects a forged config line.

#### Common-Config Switch Auto-Sync Extended to Codex

The "on switch-away, write shared preferences from the live config back to the common config" behavior v3.16.5 added for Claude now covers Codex: when you switch away from a Codex provider that has the common config enabled, the shareable portion is first re-extracted from its live `config.toml` to update the common config and then carried to the next provider — the preferences you edited directly in the running Codex config are no longer lost on switch, and deleted keys aren't quietly re-injected. The extractor strictly strips provider-specific and injected content (`model` / `model_provider` / `base_url` / `wire_api`, the entire `[model_providers]` table, the MCP projection, the API-key fallback field, the model-catalog pointer, and the injected `web_search` sentinel), so secrets never enter the shared snippet. All failures only warn and never block the switch.

#### Claude Subagent Model Configuration

The Claude provider form gains a "subagent" model row that writes `CLAUDE_CODE_SUBAGENT_MODEL`, letting subagents spawned by Claude Code run on a model you specify (usually a cheaper or faster one). It supports the `[1M]` marker; since the subagent model never appears in the `/model` menu, the row shows a "not shown in /model" placeholder with no display-name field. The proxy takeover path and the model mapper support it too: when the request model matches the configured subagent model it's passed through as-is instead of being folded to the default model; the key is also excluded from the shared common config so it doesn't leak across providers. ([#4830](https://github.com/farion1231/cc-switch/pull/4830))

#### 1M Context Checkbox for the Fallback Model Field

The Claude form's fallback model field (`ANTHROPIC_MODEL`) now carries the same 1M checkbox that the Sonnet / Opus / Fable tiers have long had: when the fallback model is backed by a 1M window you can declare it faithfully, instead of it being silently treated as 200K. Checking it appends the `[1M]` marker to the model id, unchecking strips it. ([#5124](https://github.com/farion1231/cc-switch/pull/5124), fixes #3679)

#### Zhipu Team-Plan Quota Query

Zhipu's team plan (team-edition Coding Plan) uses the same quota endpoint but requires `?type=2` and two extra request headers (`bigmodel-organization` / `bigmodel-project`), which the personal-edition query can't reach. The usage-script dialog gains a "Zhipu GLM Team" template; fill in the API key + organization ID + project ID to query team quota, and if any of the three is missing you get a clear prompt to complete it. Copy is in sync across all four locales. ([#5128](https://github.com/farion1231/cc-switch/pull/5128))

#### OpenCode Form: Headers and Per-Model Token-Limit Editors

The OpenCode provider form fills in two pieces of config that previously required hand-editing JSON: a **Headers editor** (provider-level `options.headers`, such as the `HTTP-Referer` / `X-Title` that OpenRouter's leaderboard wants, with add/remove rows and case-insensitive deduplication) and **per-model token limits** (`model.limit.context` / `model.limit.output` numeric inputs, cleared to remove). The "extra options" block becomes a collapsible section that auto-expands when it has content; along the way, a fix stops the old placeholder filter from wrongly deleting genuine option keys that start with `option-`. ([#2907](https://github.com/farion1231/cc-switch/pull/2907))

#### New Model Pricing: Tencent Hunyuan Hy3

Seeded pricing for Tencent Hunyuan Hy3 (256K context), released 2026-07-06 (converted from the launch-day list price of CNY 1 / 4 / 0.25 per million tokens); both the `hunyuan-hy3` and `hy3` ids now hit, so their usage no longer shows $0. Note that Hy3 is actually tiered by input length, and the current price table is seeded at the lowest tier, so long-context requests will underestimate cost — to be corrected once the official billing page is clear.

---

### Changed

#### Codex Chat Routing Injects prompt_cache_key to Improve Cache Hits

When Codex routes through the local proxy and converts to a Chat Completions upstream, it now injects `prompt_cache_key` in a provider-aware way: auto-enabled for Kimi Coding and the OpenAI official endpoint, explicitly on for the Kimi preset, and left off for unknown OpenAI-compatible gateways to avoid a 400 from strict-schema gateways. The key value only ever takes an explicit client value or a real client session ID, and never generates a random UUID (which would drop every request into a different cache bucket, defeating the purpose). Advanced options offer an auto / enabled / disabled tri-state override.

#### Codex Image Capability Auto-Inferred, Manual Toggle Removed

The generated Codex model catalog now only declares `input_modalities = ["text"]` for models on CC Switch's confirmed **exact text-only roster**; GPT, aliases, new suffix variants, and any unknown model all fail open to `["text", "image"]` — fixing GPT-family models being falsely reported as "images not supported" in the Codex IDE extension. The rectifier's "text-only model precheck" toggle continues to govern only the proxy-side active request rewriting, not the catalog declaration; catalog reverse-import also collapses the inferable capability away, so a future roster correction or a model upgrading to multimodal takes effect automatically.

#### Context-Window Parameters Pinned into Presets, No Longer Form Fields

The `Codex` (ChatGPT / GPT-5.6) and `Kimi For Coding` presets no longer show the "Max Context Tokens" and "Auto-Compact Window" inputs in the form; the values are pinned directly in the preset env (Codex 372000 / 372000, Kimi For Coding 262144 / 262144) — the vast majority of users never need to touch these two numbers. The two keys are kept in env on purpose: pinning them explicitly makes the local compaction trigger point immune to a remote experimental config dialing it down. The rare users who do want to change the numbers can still edit both keys directly in the provider's JSON editor.

#### Provider Connectivity Configuration Simplified

Removed the obsolete per-provider `testConfig` overrides (timeout, retry count, degradation delay threshold): the lightweight `base_url` probe now always uses the global connectivity-check config, while automatic failover remains fully driven by the proxy's separate timeout and circuit-breaker settings. The settings UI and interface naming also migrate from "model test" terminology to "connectivity check".

#### Universal (Multi-App) Provider Auto-Synced After Adding

After adding a universal (multi-app) provider through the "Add Provider" dialog, it's now immediately pushed to each live target config, no longer requiring a manual sync afterward. A sync failure doesn't block the add — the provider is saved, with a non-blocking warning shown if the sync fails. ([#2811](https://github.com/farion1231/cc-switch/pull/2811))

#### Preset Updates

- **LongCat-2.0**: the Meituan LongCat presets across the board (Claude Code / Claude Desktop / Codex / Hermes / OpenClaw / OpenCode) upgrade from the retired `LongCat-Flash-Chat` / `LongCat-2.0-Preview` to `LongCat-2.0`, declaring the real 1M (1048576) context window. LongCat-2.0 is a text-only model, and the proxy's media-scrub whitelist is updated in sync — images pasted into a conversation are replaced with an unsupported marker rather than hard-rejected upstream. ([#4838](https://github.com/farion1231/cc-switch/pull/4838))
- **SudoCode**: the old `sudocode.us` preset is replaced in place by the new sponsor SudoCode at `sudocode.chat`, covering six clients (the Claude family connects directly to Anthropic passthrough; Codex / OpenCode / OpenClaw / Hermes default to `gpt-5.6-sol`).
- **Volcengine / Doubao / BytePlus website links**: reverted v3.16.5's change of these three presets' `websiteUrl` to product homepages, restoring the attribution-parameter campaign / invite links (this is by design).
- **Code0.ai**: the invite link is updated to the new agent signup link; the API endpoint is unchanged.
- **Removed duplicate OpenAI Compatible presets**: the `OpenAI Compatible` custom-template entry was removed from the OpenCode and OpenClaw preset lists — the built-in `custom` provider flow already offers the same starting point, so the selector no longer shows two entries pointing at the same place. Existing providers are unaffected.

---

### Fixed

#### Codex OAuth Client Identity Aligned: Fixes 404 on Latest ChatGPT Models

When routing through local proxy takeover with an official Codex OAuth account, the latest subscription models (e.g. `gpt-5.6-luna`) previously returned a misleading `404 Model not found` — even though the account had access. The root cause is that ChatGPT's Codex backend does model-group routing by the `originator` + `version` headers, and cc-switch previously self-reported `originator: cc-switch` with no version, which routed it to a group where luna wasn't yet deployed. Takeover requests now send the same `originator: codex_cli_rs` + `version: 0.144.1` as the real Codex CLI, satisfying luna's minimum client-version requirement — confirmed fixed by A/B testing against the real backend.

#### Responses Upstream Failures No Longer Turn into Empty Replies

When the proxy bridges an Anthropic-format client (Claude Code / Claude Desktop) to an OpenAI Responses upstream, a semantic failure hidden inside an HTTP 2xx body (a `status:"failed"` object, an `error` envelope, or a `response.failed` SSE event before the first output) was previously converted into a silent empty turn. These failures are now recognized as real errors inside the retry loop, so failover can retry with a different provider; a stream that ends cleanly but with incomplete content is faithfully marked truncated rather than complete; a gateway that ignores `stream:true` and returns the whole JSON document is recognized and expanded into a full streaming lifecycle; and when the client history itself is malformed, it errors immediately instead of retrying a guaranteed-to-fail request against every provider.

#### Reasoning, Tool Results, and the System Role Preserved Across the Responses/Anthropic Bridge

Content crossing the Responses↔Anthropic bridge in multi-turn tool loops is no longer lost or corrupted: encrypted reasoning entries round-trip losslessly (also eliminating the problem where a failed round-trip got the next request rejected upstream); the streaming converter supports the official reasoning event vocabulary and recovers tool arguments from the terminal event when a gateway skips the deltas; a structured tool result's `is_error` flag, images, and PDF documents are fully preserved in both directions instead of being flattened into a single JSON string; and `system` / `developer` messages in history are correctly promoted to Anthropic `system` instead of being silently demoted to user turns. On billing, when the upstream request succeeds but the subsequent conversion fails, usage is still recorded rather than dropped.

#### Cache-Write Tokens No Longer Double-Billed

The `input_tokens` reported by Codex / Gemini-style providers include both cache reads and cache writes, but the cost calculation previously only subtracted cache reads — so cache-write tokens were **billed twice**, once at the input rate and once at the cache-creation rate. Both are now deducted first, and the cache-write number is no longer lost across format conversions (Chat↔Responses↔Anthropic). To keep historical data consistent, the database adds a column recording the storage semantics of each row's `input_tokens` (schema v12→v13 auto-migration): old rows are recomputed under the old semantics, new rows under the new, and Claude-style rows are unaffected.

#### Stronger Prompt-Cache Breakpoint Injection

On the proxy paths that inject Anthropic `cache_control` breakpoints (the Codex takeover bridge and the Bedrock native optimizer), the injector now uses the four-breakpoint budget more thoroughly: beyond the tail of tools, the tail of the system prompt, and the latest cacheable message, when budget remains it also anchors an earlier user message, keeping the stable prefix within Anthropic's 20-block lookback window — so long, tool-heavy conversations keep hitting the prompt cache instead of resending the system prompt, tools, and history at full price each turn. Caller-supplied breakpoints are preserved as-is (never removed, reordered, or rewritten); injected markers all use the standard 5-minute TTL.

#### Kimi For Coding's 256K Context Window Actually Takes Effect

The `CLAUDE_CODE_AUTO_COMPACT_WINDOW=262144` added to the Kimi For Coding preset in 3.16.4 in fact **never took effect**: Claude Code caps unrecognized model ids at a 200K window and takes the compaction window as `min(model window, configured value)`, so 262144 got clamped back to 200K. This release fills in the two missing pieces — the preset now also pins `CLAUDE_CODE_MAX_CONTEXT_TOKENS`, and it explicitly routes each tier's model to the endpoint's `kimi-for-coding` alias (a `claude-` prefixed id makes Claude Code ignore both window parameters; a non-Claude alias is the key to unlocking the large window). Saved providers also get these two window defaults auto-injected on switch, but **the alias routing only lives in the preset** — a provider saved from the old preset is still effectively 200K and needs a one-time re-apply of the preset (see "Upgrade Notes").

#### Deleted Codex MCP Servers No Longer Come Back

The authoritative MCP-server data lives in the database, and the `[mcp_servers]` in the Codex live `config.toml` is only a projection re-synced after every write — but on switch-away this projection was baked into the provider snapshot, so a server you deleted in the app came back to life the next time you activated that provider, and per-entry reconciliation could never clear the orphan. On switch-away, `[mcp_servers]` (including the legacy `[mcp.servers]`) is now stripped from the stored snapshot, and an already-polluted snapshot self-heals on its next switch-away. One visible side effect: a hand-written `[mcp_servers.*]` section in a Codex provider config is stripped out of the snapshot on its first switch-away — from now on, define Codex's MCP servers through the MCP manager (see "Upgrade Notes").

#### More Robust MCP Sync: No File-Blanking on Parse Failure, Per-App Errors

Two fixes. First, when writing a single MCP server to Codex, if the existing `config.toml` fails to parse, the old logic fell back to an empty document and wrote the whole thing back — **the entire file was blanked** down to that one MCP entry; it now returns a validation error and leaves the file untouched. Second, "Import from App" previously swallowed each importer's error as 0, so a broken Codex config would only show "imported 0 servers"; it now imports best-effort per app and, on failure, reports exactly which app failed. The projection on switch and save is also scoped to the target app only, so one app's live-file parse failure no longer blocks the others by association, nor falsely reports an already-successful switch as a failure.

#### Codex Common-Config Merge Preserves Comments and Key Order

Checking / unchecking "Apply Common Config" in the Codex provider form previously went through a front-end TOML implementation that reformatted the whole file (parse → merge → serialize): comments were dropped, keys were reordered, and empty table headers like `[model_providers]` appeared out of nowhere — the culprit behind "config.toml keeps getting reordered". The merge now goes through a backend command sharing the same merge semantics as writing the live config, so hand-written formatting fully survives the mid-edit merge; a double guard (operation sequence number + config baseline check) was also added for the fast-switch race introduced by going async, so an earlier-issued-but-later-arriving stale result doesn't overwrite newer state.

#### Managed Claude Takeover Injects Only a Single Auth Placeholder

When switching from a third-party endpoint to a Codex-managed provider, `~/.claude/settings.json` had both `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` placeholders written, causing Claude Code to warn "Both ANTHROPIC_AUTH_TOKEN and ANTHROPIC_API_KEY set" on every launch. It now injects only one: Codex-managed uses `ANTHROPIC_AUTH_TOKEN`, Copilot uses `ANTHROPIC_API_KEY`, and any other token key is cleared. Note: after upgrading, if the live config already carries both keys, the "skip rewrite if config unchanged" short-circuit means the warning may persist — toggle the Claude route off and on once (or switch providers once) to trigger a rewrite (see "Upgrade Notes"). ([#5095](https://github.com/farion1231/cc-switch/pull/5095), fixes #4919)

#### Usage and Quota Queries: Auto-Retry on Transient Failures, No Longer Poison the Cache

Usage and quota queries frequently showed a "query failed" that a manual refresh couldn't clear, because all transport-layer failures (including a mid-read timeout while reading the response body) were folded into "succeeded, but the result is a failure" — so the front-end's auto-retry never fired, and the failure body was cached as real data. Transport failures now return an error faithfully: react-query's auto-retry kicks in, HTTP 429 is treated as transient like 5xx, retained last-good data expires normally on a 10-minute window, and the footer keeps a retry entry and the real error message in the failure state. (fixes [#3820](https://github.com/farion1231/cc-switch/issues/3820))

#### Codex Subagent Session Usage Counted in Local Statistics

The token usage of Codex subagent (spawned agent) sessions previously never made it into local statistics: subagent logs carry the parent thread's `session_id`, so multiple subagents' records collided and were discarded as duplicates. The parser now builds a unique identity from each file's own `thread_id`, and recognizes the replay of the parent thread's history at the start of a subagent log — using it only to recover the cumulative baseline, not to double-bill; archived logs also inherit the sync cursor by filename, so re-parsing only imports the new portion. ([#5187](https://github.com/farion1231/cc-switch/pull/5187))

#### Codex Free-Tier 30-Day Quota Window Displays Correctly

Codex free accounts are metered on a rolling 30-day window (rather than the paid tier's weekly window), but the front-end whitelist and tray grouping didn't recognize the `30_day` tier — with a free account's only tier filtered out, the quota footer went entirely blank and the tray showed no quota at all. The 30-day tier now renders correctly in both the footer and the tray, with labels in sync across all four locales. ([#4886](https://github.com/farion1231/cc-switch/pull/4886), fixes #3651)

#### Usage Dashboard Refresh Interval Persisted

The usage dashboard's auto-refresh interval was previously component-local state that reset to 30 seconds on every restart. It's now persisted via a new app setting, with changes applied optimistically and rolled back automatically on save failure. ([#5057](https://github.com/farion1231/cc-switch/pull/5057))

#### Fable-Tier Model Keys No Longer Leak into the Common Config

Fable is the fourth Claude model-mapping tier added in v3.16.3, but its two keys `ANTHROPIC_DEFAULT_FABLE_MODEL(_NAME)` were left off the provider-specific exclusion list — so one provider's Fable model pin could leak into the shared common config and then be injected into other providers. It's now stripped like the haiku / sonnet / opus tiers, and Fable-tier proxy takeover support was filled in along the way (writing a stable role alias on takeover, cleaning up stale values on switch-away). ([#5206](https://github.com/farion1231/cc-switch/pull/5206), fixes #4272)

#### Tool-Schema Default-Type Fallback and API Key Input for Uncategorized Providers

Two provider-side fixes: when a client-sent tool's `input_schema` lacks a top-level `type` (or is an empty `{}`), the proxy conversion would be rejected by a strict gateway; the root schema now auto-fills `type: "object"` (only the root, leaving nested subschemas untouched); and the issue where an uncategorized provider imported from history or hand-built showed no Claude API Key input on edit is fixed — the field now shows for any provider that isn't an official / cloud-vendor category. ([#5069](https://github.com/farion1231/cc-switch/pull/5069))

#### Image-Request Fallback for the Text-Only GLM 5.2 Model

When the local proxy takes over Volcengine Coding Plan running GLM 5.2, image blocks in a request no longer produce an unrecoverable 400: the text-only roster exactly includes `glm-5.2` (deliberately not prefix-matching, so a future multimodal `glm-5.2v` isn't caught), and the preventive path strips images before the request goes out; the gateway's error message that doesn't contain the word image (`Model only support text input`) is also recognized by the reactive path's self-identifying-phrase roster, triggering the media fallback. (fixes [#5025](https://github.com/farion1231/cc-switch/issues/5025))

#### A Batch of Small Session and Live-Config Sync Fixes

- **Show renamed Codex session titles**: a session you renamed inside Codex now shows the new title in the session manager instead of falling back to the first message text; reads during concurrent writes no longer fail immediately. ([#4927](https://github.com/farion1231/cc-switch/pull/4927))
- **OpenCode / OpenClaw / Hermes live edits synced into the store on startup**: editing a live config file directly (changing the base URL, adding a model) was previously never picked up after the first import; it's now diffed against the store on every startup and updated on difference, all non-fatal. ([#4712](https://github.com/farion1231/cc-switch/pull/4712), [#5098](https://github.com/farion1231/cc-switch/pull/5098))
- **OpenCode session-resume command updated**: the resume command the session manager shows and copies is corrected from the outdated `opencode session resume <id>` to the current CLI's `opencode -s <id>`. ([#2359](https://github.com/farion1231/cc-switch/pull/2359))
- **Official providers skip the connectivity probe**: the connectivity check no longer derives a guaranteed-to-fail credential-less first-party endpoint probe for official-category providers (e.g. hitting `chatgpt.com/backend-api/codex` bare); batch checks skip it, and an individual resolve reports a clear error.

---

### Documentation

#### Codex + Kimi Local Routing Guide

A new step-by-step guide (in Chinese / English / Japanese, with UI screenshots) explaining how to use Kimi inside Codex CLI via CC Switch's local routing: newer Codex CLI speaks the OpenAI Responses protocol, while the Kimi Open Platform (pay-as-you-go, `kimi-k2.7-code`) and Kimi For Coding (membership, `kimi-for-coding`) both expose Chat Completions endpoints, so a direct connection usually 404s on `/responses`. The guide covers the whole flow from adding a provider from the built-in preset to the four-step protocol-conversion chain.

#### README Sponsor Update

The open-source AI infrastructure project `new-api` joins the sponsor table in the four-language READMEs.

---

### Upgrade Notes

#### Kimi For Coding Providers Need a Preset Re-Apply

If you're using a provider created from the Kimi For Coding preset, please **re-pick it from the preset and save once**: the key to the 256K window — routing each tier's model to the `kimi-for-coding` alias — only lives in the new preset, so a provider saved from the old preset still compacts prematurely at 200K even after upgrading.

#### Hand-Written Codex `[mcp_servers.*]` Will Be Stripped from the Snapshot

To root out "deleted MCP servers coming back", switching away from a Codex provider strips the `[mcp_servers]` section from the stored snapshot. If you have an MCP server hand-written directly in a Codex provider config, it will disappear from the snapshot on the first switch-away from that provider — please instead define Codex's MCP servers through the MCP manager (MCP tab), where the entries are authoritative and get projected into the live config automatically.

#### The Dual-Auth-Key Warning May Need a One-Time Manual Rewrite

If Claude Code still warns "Both ANTHROPIC_AUTH_TOKEN and ANTHROPIC_API_KEY set" after upgrading, it's because the takeover logic short-circuits and skips the rewrite when the live config is unchanged. Toggle Claude's route off and on once (or switch providers once) to write the corrected single-placeholder config, and the warning goes away.

#### Automatic Database Migration

On the first launch of v3.17.0, the database automatically migrates from schema v11 to v13 (adding the projects table and the usage-semantics column), with no manual steps. If you're in the habit of rolling back to an older version, back up `~/.cc-switch/cc-switch.db` first.

---

### Risk Notice

This release continues the risk notices from previous versions for reverse-proxy-style features.

**Codex OAuth reverse proxy**: using a ChatGPT subscription's Codex OAuth through a reverse proxy may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details. The "official ChatGPT account proxy route takeover" added in this release is the same class of usage, so please be aware of the same risk.

**Codex third-party provider Chat routing**: when CC Switch local proxy converts and forwards Codex requests to third-party providers, each provider may have different requirements for billing, compliance, and data retention. Read the target provider's terms before use.

**Claude Desktop third-party provider proxy switching**: when CC Switch's built-in proxy gateway forwards Claude Desktop requests to third-party providers, you must also follow the target provider's billing, compliance, and data-retention terms.

By enabling these features, users accept the related risks. CC Switch is not responsible for account restrictions, warnings, or service suspensions caused by using these features.

---

### Thanks

Thanks to the following contributors for the features and fixes in v3.17.0:

- [#5071](https://github.com/farion1231/cc-switch/pull/5071): add the native Anthropic Messages protocol as a Codex upstream, thanks @yeeyzy.
- [#4830](https://github.com/farion1231/cc-switch/pull/4830): add Claude subagent model configuration, thanks @AkimioJR.
- [#5124](https://github.com/farion1231/cc-switch/pull/5124): add the 1M checkbox to the fallback model field, thanks @salarkhannn.
- [#5128](https://github.com/farion1231/cc-switch/pull/5128): add Zhipu team-plan quota queries, thanks @zhanxin-xu.
- [#2907](https://github.com/farion1231/cc-switch/pull/2907): add the Headers and token-limit editors to the OpenCode form, thanks @git1677967754.
- [#2811](https://github.com/farion1231/cc-switch/pull/2811): auto-sync universal providers after adding, thanks @hubutui.
- [#4838](https://github.com/farion1231/cc-switch/pull/4838): upgrade the LongCat presets to LongCat-2.0, thanks @solthx.
- [#5095](https://github.com/farion1231/cc-switch/pull/5095): inject only a single auth placeholder on managed Claude takeover, thanks @fengshao1227.
- [#5187](https://github.com/farion1231/cc-switch/pull/5187): count Codex subagent session usage in statistics, thanks @starmiaoa.
- [#4886](https://github.com/farion1231/cc-switch/pull/4886): fix the Codex free-tier 30-day quota window not showing, thanks @SaladDay.
- [#5057](https://github.com/farion1231/cc-switch/pull/5057), [#4927](https://github.com/farion1231/cc-switch/pull/4927), [#2359](https://github.com/farion1231/cc-switch/pull/2359): persist the refresh interval, show renamed session titles, and correct the OpenCode resume command, thanks @makoMakoGo.
- [#5206](https://github.com/farion1231/cc-switch/pull/5206): exclude Fable model keys from the common config, thanks @fzh365.
- [#5069](https://github.com/farion1231/cc-switch/pull/5069): tool-schema default-type fallback and API Key input restoration, thanks @Komikawayi.
- [#4712](https://github.com/farion1231/cc-switch/pull/4712), [#5098](https://github.com/farion1231/cc-switch/pull/5098): sync OpenCode / OpenClaw / Hermes live config on startup, thanks @allenxu09.

Thanks also to everyone who reported Codex official routing, cache billing, MCP sync, and quota query issues — a good portion of this release's fixes came directly from reproduction clues in these real-world scenarios.

---

### Download & Install

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) and download the build for your system.

#### System Requirements

| System  | Minimum Version      | Architecture                        |
| ------- | -------------------- | ----------------------------------- |
| Windows | Windows 10 and later | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey)+ | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below      | x64 / ARM64                         |

#### Windows

| File                                     | Description                                      |
| ---------------------------------------- | ------------------------------------------------ |
| `CC-Switch-v3.17.0-Windows.msi`          | **Recommended** - MSI installer with auto-update |
| `CC-Switch-v3.17.0-Windows-Portable.zip` | Portable build, unzip and run                    |

Windows ARM64 devices should pick the artifact whose file name carries the `arm64` tag.

#### macOS

| File                             | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.17.0-macOS.dmg`    | **Recommended** - DMG installer, drag to Applications |
| `CC-Switch-v3.17.0-macOS.zip`    | Unzip and drag to Applications, Universal Binary      |
| `CC-Switch-v3.17.0-macOS.tar.gz` | For Homebrew install and auto-update                  |

Homebrew install:

```bash
brew install --cask cc-switch
```

Upgrade:

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux assets are available for both **x86_64** and **ARM64** (`aarch64`). Choose the file whose architecture tag matches your machine's `uname -m` output:

- `CC-Switch-v3.17.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.17.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended Format | Install Command                                                        |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Make executable and run directly, or use AUR                           |
| Other distributions / unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

</content>
</invoke>

## [3.16.5] - 2026-07-01

> The centerpiece of this release is **getting native-Responses direct-connect properly adapted for domestic (Chinese) model providers** — generating Codex model catalogs for providers with native Responses endpoints (Xiaomi MiMo, Volcengine Doubao, Qwen3-Coder, Meituan LongCat, MiniMax) so the Codex desktop app can actually see these models and their built-in tools work, and automatically disabling `web_search` for the few domestic gateways that reject it so requests are no longer hard-rejected. Two other important improvements: when you switch providers, the plugins, environment variables, etc. you added inside the app are **automatically written back to the common config and carried over to the next provider**; and Linux (Wayland + NVIDIA) users hitting the "title bar clicks, page is dead, black screen on resize" problem now have an environment-variable escape hatch. This release also brings Claude Sonnet 5 pricing and a default-tier bump, a two-level grouped session view, and a batch of credential-safety and platform-compatibility fixes.

### Usage Guides

The new capabilities in this release land mainly in the Codex provider form, the session panel, and usage / common config. The following docs are worth reading alongside it:

- **[Can't see custom models in the Codex desktop app?](/en/tutorials/codex-desktop-custom-model-visibility)**: this release reworks **model-catalog generation for native direct-connect** — when a Codex provider connects directly via native Responses (`openai_responses`), CC Switch generates `~/.codex/cc-switch-model-catalog.json` so the Codex desktop app can display the configured custom models and their tools work. If you previously configured a native Codex provider, **re-save it once** to regenerate the catalog (see "Upgrade Notes" below).
- **[Usage Statistics](/en/docs?section=proxy&item=usage)**: understand the Usage Dashboard's data sources and how the statistics are counted. This release adds Claude Sonnet 5 pricing and fixes usage-script credentials being persisted as "explicit overrides".
- **[Settings](/en/docs?section=getting-started&item=settings)**: the Codex upstream-format selector and local routing toggle, and Claude's common config (now renamed "Apply Common Config" and auto-synced on switch) all live in the provider form's advanced options.

---

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues.

---

### Overview

CC Switch v3.16.5 is a maintenance update following v3.16.4, centered on **making native Codex direct-connect work end-to-end for domestic model providers**. v3.16.4 already switched Qwen / DashScope, Xiaomi MiMo, Volcengine Doubao, Meituan LongCat, and MiniMax to native Responses endpoints; this release goes a step further and generates the **model catalog** Codex needs (`~/.codex/cc-switch-model-catalog.json`), so the Codex desktop app can really see these custom models and invoke their built-in tools, and it fully decouples model mapping from the "local routing" toggle. For the few domestic gateways whose first-party models don't support OpenAI's built-in `web_search` (MiMo, LongCat, MiniMax, Qwen3-Coder), this release also disables that tool automatically, so Codex's default doesn't trigger a hard 400.

For everyday use, this release makes Claude's **common config auto-sync and carry over when you switch providers** — the plugins, environment variables, theme, etc. you added inside the running app are first written back to the common config and then handed to the next provider, so they're not lost on switch; it adds an escape-hatch environment variable for Linux (Wayland + NVIDIA) users hitting click-dead / black-screen issues; it adds Claude Sonnet 5 pricing and bumps the default Sonnet tier to it; it brings a two-level "provider → project directory" grouped session view; and it fixes a string of credential-safety (the common-config snippet now strips all secrets, usage-script credentials are only kept as explicit overrides), platform-compatibility (Hermes Windows config directory, Windows Codex npm shims), and UI (long dropdown scrolling, narrow-window date-range picker) issues. It also adds several new provider presets, ready to pick out of the box.

**Release date**: 2026-07-01

**Stats**: 36 commits | 93 files changed | +5,678 / -2,804 lines

---

### Highlights

- **Native Codex direct-connect actually works for domestic model providers**: CC Switch generates a Codex model catalog (`~/.codex/cc-switch-model-catalog.json`) for domestic providers like Xiaomi MiMo, Volcengine Doubao, Qwen3-Coder, Meituan LongCat, and MiniMax, so the Codex desktop app can see these models and their built-in tools work; and it auto-disables `web_search` for the domestic gateways that reject it (MiMo, LongCat, MiniMax, Qwen3-Coder) to avoid hard 400s. **Existing native providers need a one-time re-save** to regenerate the catalog.
- **Common config auto-synced and carried over on switch**: when you switch away from a Claude provider that has the common config enabled, the plugins, environment variables, theme, and hooks you added inside the app are first written back to the common config and then handed to the next provider — no longer overwritten and lost on switch.
- **Escape hatch for Linux Wayland click-dead / black-screen**: when you hit "title bar clicks, page doesn't, black screen on resize" on Wayland + NVIDIA, launch with `CC_SWITCH_GDK_BACKEND=wayland` to switch back to native Wayland (set it to `x11` for the inverse problem on tiling compositors).
- **Claude Sonnet 5**: adds Sonnet 5 pricing and bumps each preset's default Sonnet tier to `claude-sonnet-5`.
- **Categorized session view with grouping**: the session panel gains a two-level "provider → project directory" grouped view, with a tri-state checkbox on each group header for one-click batch selection.
- **New provider presets**: adds Qiniu, FennoAI, ZetaAPI, TeamoRouter, NekoCode, Code0.ai, and Amux presets across the managed apps, ready to pick out of the box.

---

### Added

#### Native Codex Direct-Connect for Domestic Model Providers (Generated Model Catalog)

This release makes native Codex direct-connect work for domestic providers. After v3.16.4 switched Xiaomi MiMo, Volcengine Doubao, Qwen3-Coder, Meituan LongCat, and MiniMax to native Responses (`apiFormat: "openai_responses"`), this release reverses the then-current "drop the model catalog on native direct-connect" approach: when these providers connect directly without the local proxy, CC Switch generates `~/.codex/cc-switch-model-catalog.json` for them, so the Codex desktop app really shows these custom models and their built-in tools work — without triggering the freeform `apply_patch` (`type=custom`) tool that native gateways like MiMo reject (editing falls back to `shell_command`). Catalog generation is keyed on `apiFormat` and decoupled from the "local routing" toggle, so a native provider persists a catalog without turning on local route mapping, while `openai_chat` keeps the existing Responses↔Chat proxy conversion unchanged. Because Codex's parser requires `base_instructions` on every entry, the native template carries a neutral default that each vendor's official copy overrides (MiMo, MiniMax). **Existing native providers need a one-time re-save to generate a valid catalog** (no database migration).

Alongside that, for the few domestic gateways whose first-party models don't support OpenAI's built-in `web_search` tool (MiMo, LongCat, MiniMax, Qwen3-Coder), this release auto-disables the tool on switch, so Codex's default doesn't include it and get hard-rejected with a 400 (see "Fixed" below).

#### Categorized Session View with Grouping

The Session Manager panel gains a grouped view alongside the existing flat list, toggled via a List / ListTree selector in the toolbar, with view mode and expansion state persisted to `localStorage`. Grouping builds a two-level "provider → project directory" hierarchy: sessions are grouped by project directory name, and sessions with no project directory fall into an "unknown directory" bucket. Both levels are collapsible sections, with a "collapse all" button; in batch mode, each group header shows a tri-state checkbox that selects / deselects every selectable session in that group at once, along with a selected / selectable count badge. Copy across all four locales (zh / en / ja / zh-TW) is in sync. The change is entirely front-end, with no backend commands or data-access changes. ([#4776](https://github.com/farion1231/cc-switch/pull/4776))

#### Claude Sonnet 5 Model Pricing

Added a `claude-sonnet-5` pricing row in `schema.rs` at Anthropic list pricing — \$3 / \$15 per million input / output tokens and \$0.30 / \$3.75 cache read / write, matching Sonnet 4.6. The introductory \$2 / \$10 promotion (valid through 2026-08-31) is deliberately not seeded, so accounting reflects steady-state list pricing rather than a temporary discount. The row is applied on the app's next start via `ensure_model_pricing_seeded`, with no `SCHEMA_VERSION` bump.

#### New Provider Presets

This release adds a batch of provider presets; pick one and fill in your own API key to use it:

- **Qiniu**: covers all seven managed apps (including Gemini), relaying native Claude / GPT / Gemini.
- **FennoAI / ZetaAPI / TeamoRouter / NekoCode**: each covers six apps (Claude, Claude Desktop, Codex, OpenCode, OpenClaw, Hermes).
- **Code0.ai**: covers all seven apps (including Gemini).
- **Amux**: covers six apps.

Each preset's endpoints and default models are configured for the corresponding app — the Claude family connects directly to an Anthropic-compatible host, Codex uses native Responses, and the rest use the OpenAI-compatible `/v1`.

---

### Changed

#### Common Config Auto-Synced and Carried Over on Provider Switch

This is a very practical change in this release: when you switch away from a Claude provider that has the common config enabled, the service first **re-extracts the shareable portion from its live `settings.json` and updates the common config**, then hands it to the next provider, instead of only writing one way. As a result, the plugins (`enabledPlugins`), hooks, environment variables (`env`), theme (`theme`), and other shared config you added directly in the running app are not silently lost on switch, but automatically follow along to the next provider; deletions sync too (a removed key is not re-injected). This sync is strictly scoped to Claude providers that have the common config enabled, is skipped when it was explicitly cleared, and all failures are non-fatal (warn only) and never block the switch.

#### Codex Model Mapping Decoupled from the "Local Routing" Toggle

The Codex provider form aligns with Claude Code — the model-mapping catalog is now independent of route takeover, because native Responses providers (MiMo, Doubao, MiniMax) need it for proxy-less direct-connect, while Chat providers go through the proxy regardless. The "needs local routing" toggle is removed (it had no backend field and only gated catalog / reasoning persistence, which is equivalent to whether the mapping is filled in). Model mapping is now always shown for non-official providers and persisted whenever it's non-empty, while reasoning visibility / persistence is gated on the Chat format instead. Copy across all four locales (zh / en / ja / zh-TW) was rewritten accordingly. As a side fix, `useCodexConfigState` no longer drops `supportsParallelToolCalls` / `inputModalities` / `baseInstructions` when loading a saved provider (which used to silently lose parallel tools, image input, and the official base instructions on edit).

#### Default Sonnet Tier Bumped to Claude Sonnet 5

Bumped the default Sonnet tier in each provider preset from `claude-sonnet-4-6` to `claude-sonnet-5` (across the claude / claude-desktop / hermes / openclaw / opencode presets and the universal `NEWAPI_DEFAULT_MODELS`), covering keys like `ANTHROPIC_MODEL` / `ANTHROPIC_DEFAULT_SONNET_MODEL` / `ANTHROPIC_DEFAULT_OPUS_MODEL` and their prefixed variants. Claude Desktop's default-route sonnet `route_id` also migrates to `claude-sonnet-5`. Non-Anthropic pins (gpt / gemini / glm / sonnet-4-5) are left unchanged.

#### Doubao Dated Model Id and Pricing Normalization

The Doubao (DouBaoSeed) preset's model id switches to the dated form `doubao-seed-2-1-pro-260628` (across all apps), because Volcengine Ark rejects the bare `doubao-seed-2-1-pro` with a 404 and only accepts the full dated id. Since real usage now carries a date suffix, `strip_model_date_suffix` was extended to also strip Volcengine's 6-digit YYMMDD form (validating month 01-12 and day 01-31 to avoid eating non-date version suffixes like `-123456`), so it normalizes back to hit the bare-name seed row in the pricing table, fixing the \$0-cost display for Doubao models.

#### "Write Common Config" Renamed to "Apply Common Config"

The original label "Write Common Config" was ambiguous about data-flow direction (it read like "write the current config into the common config"), whereas the actual behavior is the reverse — it merges the saved common-config snippet into this provider's config. The checkbox is renamed to "Apply Common Config" across all four locales (zh / en / ja / zh-TW), including every hint / guide / notice reference, with the Japanese user manual and `README_JA.md` synced too. ([#4829](https://github.com/farion1231/cc-switch/pull/4829))

#### Other Preset and Asset Adjustments

- **OpenClaw Doubao context aligned to 262144**: OpenClaw's DouBaoSeed preset previously hardcoded 128000 while the Codex side used 262144 for the same model, giving OpenClaw users too small a window; the two are now aligned, with a cross-preset consistency test to prevent drift.
- **Volcengine / Doubao / BytePlus website links corrected**: the "visit website" links on these three presets had been mistakenly set to console / signup links, and are restored to clean product homepages.
- **Downscale oversized provider icons to 256px**: a batch of bundled icons were far larger than their ~32px on-screen render size; downscaling significantly reduces their size with no code / filename / import changes (e.g. ZetaAPI 940KB→40KB, relaxcode 1.16MB→42KB), and the never-referenced 1.4MB `dds.svg` orphan was removed.

---

### Fixed

#### Disable web_search for Native Codex Gateways That Reject It

Some native `/responses` gateways whose first-party models lack OpenAI's hosted `web_search` tool reject it with "tool type 'web_search' is not supported", and Codex sends the tool by default, producing a hard 400. CC Switch now writes the top-level TOML line `web_search = "disabled"` for those vendors on switch. The scope is a blacklist (default-on): only providers matched by `base_url` host (`xiaomimimo.com`, `longcat.chat`, `minimax.io`, `minimaxi.com`) or by model brand prefix (`mimo`, `longcat`, `minimax`, `qwen3-coder`) are disabled, so relays serving real GPT, Doubao, general Qwen, and any unknown provider keep Codex's default. The `qwen3-coder` prefix only suppresses native `qwen3-coder-plus` (Bailian / DashScope marks built-in tools unsupported for the coder series), while general Qwen sharing the same host stays enabled; matching is on the model axis (stripping any aggregator `vendor/` path segment), so it also catches cases like SiliconFlow fronting a reject vendor's model. A blacklist was chosen over a fuzzy "is this GPT?" whitelist because wrongly keeping `web_search` on fails with a hard 400; an ownership sentinel ensures CC Switch only ever removes a `disabled` value it wrote itself, so existing providers need no re-save and switching back re-enables it. As a side fix, the LongCat-2.0-Preview preset's context window is corrected from 131072 (128K) to the real 1048576 (1M).

#### Strip All Credential-Like Keys from the Shared Claude Common-Config Snippet

`extract_claude_common_config` previously only redacted `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN`, but Claude providers legitimately carry other credentials (`OPENROUTER_API_KEY`, `GOOGLE_API_KEY`, and possibly OpenAI / Gemini / AWS Bedrock / Vertex secrets), which could leak into the shared snippet and then be injected into other providers. Extraction now pattern-matches and strips any credential-shaped env key (`*_API_KEY` / `*_AUTH_TOKEN` / `*secret*` / `*token*`, etc.), while preserving legitimately shareable plural `*_TOKENS` values like `MAX_OUTPUT_TOKENS`. This also closes the same leak on the manual "Extract" and one-time auto-extract paths.

#### Usage-Script Credentials Persisted Only as Explicit Overrides

Provider usage scripts store optional `api_key` / `base_url` fields that override the live credentials when querying quota, but they used to silently mirror the provider's own credentials — so copying a provider or editing its main API key / base URL left the usage script pinned to the old endpoint and key, and quota queries kept hitting a stale target. `ProviderService` now normalizes before persisting: if the script's `api_key` or `base_url` matches the provider's resolved usage credentials (or is blank), it is cleared to `None` so queries fall back to the live config; genuinely different overrides are kept (`token_plan` scripts are left alone). The deeplink import path gets matching normalization too, and the front-end invalidates the relevant cache keys on update so the home page re-queries with the corrected config. ([#4654](https://github.com/farion1231/cc-switch/pull/4654))

#### Hermes Config Directory Resolves Correctly on Windows

CC Switch hardcoded `~/.hermes` as the Hermes config directory, but Hermes itself resolves it via the `HERMES_HOME` environment variable, then a platform default (`%LOCALAPPDATA%\hermes` on Windows). On Windows this meant CC Switch wrote provider configs to a path Hermes never reads, so provider switches had no effect. `get_hermes_dir()` now mirrors Hermes' own resolution order — explicit override, then `HERMES_HOME` (taken verbatim, no `~` expansion), then the platform default — re-honoring the `HERMES_HOME` that #3470 had dropped (Hermes' Windows installer sets it as the first-class mechanism for relocated installs). ([#4680](https://github.com/farion1231/cc-switch/pull/4680), see #3178, #3470)

#### Linux Wayland: Override the AppImage's Forced `GDK_BACKEND=x11`

The AppImage's GTK launch hook unconditionally exports `GDK_BACKEND=x11` to dodge a historical native-Wayland crash. On newer Wayland + NVIDIA setups, this forced XWayland leaves the WebKitGTK web content unable to receive pointer events (the title bar clicks, the page is dead) and black-screens on resize, and the existing `WEBKIT_DISABLE_*` mitigations don't help because the root cause is the forced window backend, not rendering. `main.rs` now reads an optional `CC_SWITCH_GDK_BACKEND` escape hatch before GTK init (the AppImage's launch hook never touches it): leaving it unset keeps current behavior (zero regression). When you hit the problem above, launch with it set to switch back to native Wayland:

```bash
CC_SWITCH_GDK_BACKEND=wayland ./CC-Switch-*.AppImage
```

The override is generic — if you're on a tiling Wayland compositor hitting the inverse input problem, set `CC_SWITCH_GDK_BACKEND=x11` instead. ([#4351](https://github.com/farion1231/cc-switch/pull/4351), fixes #4350)

#### "Get API Key" Link Now Shows in Claude Desktop, OpenClaw, and Hermes Forms

The "Get API Key" link and partner-promotion block below the API key input was only wired for claude / codex / gemini / opencode. Claude Desktop rendered a bare input that never showed it, and OpenClaw / Hermes were blocked by two gaps (the whitelist only listed those four appIds, and category parsing only recognized those four preset-id patterns). Claude Desktop now uses the shared `ApiKeySection`, and both the whitelist and category parsing were extended to claude-desktop / openclaw / hermes; additionally, the Hermes / OpenClaw forms no longer let an "official" category disable the key input (these apps have no OAuth-only official providers — e.g. Hermes' Nous Research is official but still needs a user-supplied key).

#### Deduplicate Windows Codex npm Shims

On Windows, npm installs a tool as three sibling files — `codex.cmd`, `codex.exe`, and an extensionless Unix shim `codex` — and CC Switch previously listed all three as candidates, so the non-executable extensionless shim was probed as a redundant / failing candidate. It now appends the extensionless path only when there's no runnable `.cmd` / `.exe` sibling adjacent, and path resolution prefers the runnable `.cmd` / `.exe`, anchoring version detection and launch to the actually-runnable Windows shim. ([#4782](https://github.com/farion1231/cc-switch/pull/4782))

#### Scroll Bounds for Long Select Dropdowns

`SelectContent` previously used `overflow-hidden` with no height cap, so dropdowns with many options (e.g. long model / provider lists) rendered taller than the viewport and clipped their overflow with no way to reach it. It now sets `max-h-[min(24rem,var(--radix-select-content-available-height))]` and `overflow-y-auto`, bounding the content to 24rem or the Radix-computed available height and allowing vertical scrolling. ([#4798](https://github.com/farion1231/cc-switch/pull/4798))

#### Date-Range Picker Calendar Stays On-Screen in Narrow Popovers

The custom date-range picker previously switched to its two-column layout (date fields | calendar) based on the **viewport** width (Tailwind's `sm:` 640px breakpoint), but the popover is clamped to `100vw - 2rem` and anchored to its trigger, so its real available width is narrower than the viewport. On narrow windows the two-column layout could activate while the popover only had room for one column, pushing the calendar column off the right edge where it was clipped (the month header and 4 of 7 weekday columns cut off and unreachable). The layout now keys off the popover's own inline size via a CSS container query, so it collapses to one column exactly when the popover itself is narrow, keeping the calendar fully visible at any window width. ([#4860](https://github.com/farion1231/cc-switch/pull/4860))

---

### Documentation

#### `CC_SWITCH_GDK_BACKEND` Escape Hatch Documented

Added an FAQ entry for the optional `CC_SWITCH_GDK_BACKEND` environment variable across all four README languages and the zh / en / ja user-manual troubleshooting pages, explaining how Wayland + NVIDIA users can switch back to native Wayland when the web content goes "click-dead + black screen on resize", and how tiling-Wayland users can set it to `x11` for the inverse input problem.

#### Overseas Kimi READMEs Point to platform.kimi.ai

The Kimi K2.7 Code partner section in the English, German, and Japanese READMEs now points its banner and inline calls to action at `https://platform.kimi.ai?aff=cc-switch` (keeping the referral tag), and all four READMEs gained a line promoting the Kimi For Coding subscription linked to `https://www.kimi.com/code/?aff=cc-switch`.

---

### Upgrade Notes

#### Existing Native Codex Providers Need a One-Time Re-Save

This release reworks model-catalog generation for native Responses direct-connect. If you previously configured a Codex provider using native Responses (`openai_responses`), **re-pick the preset or open the provider and save it once** to generate the new `~/.codex/cc-switch-model-catalog.json` — that's what lets the Codex desktop app show the custom models and makes the tools work. This requires no database migration and does not affect providers on the `openai_chat` format.

#### web_search Blacklist Is Default Behavior

For known-to-reject-`web_search` domestic native gateways (Xiaomi MiMo, Meituan LongCat, MiniMax, Qwen3-Coder), this release automatically writes `web_search = "disabled"` on switch. Relays serving real GPT, Doubao, general Qwen, and unknown providers are unaffected and keep Codex's default. The switch is managed by CC Switch with an ownership sentinel, so switching back to a provider not on the blacklist restores it automatically, with no manual intervention.

#### Default Sonnet Tier Change

Claude-family providers newly created from a preset now have their default Sonnet tier pointing to `claude-sonnet-5`. Existing configured providers are unaffected and keep their configuration as-is; to switch to Sonnet 5, re-pick the preset and save.

---

### Risk Notice

This release continues the risk notices from previous versions for reverse-proxy-style features.

**Codex OAuth reverse proxy**: using a ChatGPT subscription's Codex OAuth through a reverse proxy may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Codex third-party provider Chat routing**: when CC Switch local proxy converts and forwards Codex requests to third-party providers, each provider may have different requirements for billing, compliance, and data retention. Read the target provider's terms before use.

**Claude Desktop third-party provider proxy switching**: when CC Switch's built-in proxy gateway forwards Claude Desktop requests to third-party providers, you must also follow the target provider's billing, compliance, and data-retention terms.

By enabling these features, users accept the related risks. CC Switch is not responsible for account restrictions, warnings, or service suspensions caused by using these features.

---

### Thanks

Thanks to the following contributors for the features and fixes in v3.16.5:

- [#4776](https://github.com/farion1231/cc-switch/pull/4776): add the categorized session view and group management, thanks @alkaid616.
- [#4829](https://github.com/farion1231/cc-switch/pull/4829): rename "Write Common Config" to "Apply Common Config", thanks @arichyx.
- [#4654](https://github.com/farion1231/cc-switch/pull/4654): persist usage-script credentials only as explicit overrides, thanks @yyhhyyyyyy.
- [#4680](https://github.com/farion1231/cc-switch/pull/4680): fix Hermes provider config not taking effect on Windows, thanks @thisTom.
- [#4782](https://github.com/farion1231/cc-switch/pull/4782): deduplicate Windows Codex npm shims, thanks @justjavac.
- [#4798](https://github.com/farion1231/cc-switch/pull/4798): fix long dropdown lists not being scrollable, thanks @xwil1.
- [#4351](https://github.com/farion1231/cc-switch/pull/4351): allow overriding the AppImage's forced `GDK_BACKEND=x11` via `CC_SWITCH_GDK_BACKEND`, thanks @BoneLiu.
- [#4860](https://github.com/farion1231/cc-switch/pull/4860): keep the date-range picker calendar on-screen in narrow popovers, thanks @SaladDay.

Thanks also to everyone who reported native Codex direct-connect, common config, credential reuse, and platform compatibility issues after the v3.16.4 release. Many of these patches came directly from real-world reproduction clues.

---

### Download & Install

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) and download the build for your system.

#### System Requirements

| System  | Minimum Version          | Architecture                        |
| ------- | ------------------------ | ----------------------------------- |
| Windows | Windows 10 and later     | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey)+     | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below          | x64 / ARM64                         |

#### Windows

| File                                     | Description                                      |
| ---------------------------------------- | ------------------------------------------------ |
| `CC-Switch-v3.16.5-Windows.msi`          | **Recommended** - MSI installer with auto-update |
| `CC-Switch-v3.16.5-Windows-Portable.zip` | Portable build, unzip and run                    |

Windows ARM64 devices should pick the artifact whose file name carries the `arm64` tag.

#### macOS

| File                             | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.16.5-macOS.dmg`    | **Recommended** - DMG installer, drag to Applications |
| `CC-Switch-v3.16.5-macOS.zip`    | Unzip and drag to Applications, Universal Binary      |
| `CC-Switch-v3.16.5-macOS.tar.gz` | For Homebrew install and auto-update                  |

Homebrew install:

```bash
brew install --cask cc-switch
```

Upgrade:

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux assets are available for both **x86_64** and **ARM64** (`aarch64`). Choose the file whose architecture tag matches your machine's `uname -m` output:

- `CC-Switch-v3.16.5-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.5-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended Format | Install Command                                                        |
| --------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Make executable and run directly, or use AUR                          |
| Other distributions / unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`             |

## [3.16.4] - 2026-06-27

> 🎉 **CC Switch is now in the global top 100 on GitHub by stars!**
> Thank you to every user, contributor, and Star — you brought it here. 🙏

> After v3.16.3 made usage billing accurate, this release shifts the focus to polishing the Codex proxy chain and enriching the usage / pricing tooling — migrating Chinese providers to native Responses, decoupling the upstream-format selector from model mapping, decompressing zstd request / error bodies, and a batch of tool-call and OAuth-through-proxy fixes — while also adding local proxy request overrides, an in-app recovery screen when the database version is too new, native Windows ARM64 builds, and a wave of preset and branding updates (SubRouter, OpenCode Go, the CTok→ETok rename, the Kimi brand refresh, and a prime-partner badge).

### Usage Guides

This release is mostly polish and expansion, with the new capabilities landing mainly in the usage dashboard and the provider form's advanced options. The following docs are worth reading alongside it:

- **[Can't see custom models in the Codex desktop app?](/en/tutorials/codex-desktop-custom-model-visibility)**: many users report that their configured third-party / custom models do not show up in the Codex desktop app's model picker. This is the Codex desktop app's **own upstream gating behavior** (it gates the model picker by official login state), not a CC Switch local-config problem, and **this release (v3.16.4) does not change it**. The doc explains the cause and the available mitigation (keep official login + route takeover).
- **[Usage Statistics](/en/docs?section=proxy&item=usage)**: understand the Usage Dashboard's data sources and how the statistics are counted. This release adds bulk import of model pricing from models.dev, AK/SK usage queries for Volcengine Ark Coding / Agent Plan, and a live end time for custom date ranges.
- **[Settings](/en/docs?section=getting-started&item=settings)**: local proxy request overrides (custom headers / request body), the Codex upstream-format selector, the local routing toggle, and more live in the provider form's advanced options.

---

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues.

---

### Overview

CC Switch v3.16.4 is a maintenance update following v3.16.3. This release tightens the Codex proxy chain — switching several Chinese providers that have native OpenAI Responses endpoints to the native format (dropping the Responses→Chat route-takeover conversion), promoting "upstream format" out of the "local routing" toggle into its own control, adding decompression for zstd request and error response bodies, and fixing a string of tool-call and "OAuth module bypassing the global proxy" issues.

Alongside that, this release enriches the usage and pricing tooling (import pricing from models.dev, AK/SK usage queries for Volcengine Ark Coding / Agent Plan, a live end time for custom date ranges, GLM-5.2 and Doubao Seed 2.1 pricing), adds a batch of proxy and resilience capabilities (custom header / request-body overrides, an in-app recovery screen when the database version is too new, native Windows ARM64 builds), and brings a wave of preset and branding updates (SubRouter and OpenCode Go subscriptions, the CTok→ETok rename, the Kimi brand refresh and prime-partner badge, and a Kimi K2.7 Code sponsor banner).

**Release date**: 2026-06-27

**Stats**: 53 commits | 126 files changed | +8,149 / -1,016 lines

---

### Highlights

- **Native Responses for Chinese Codex providers**: Qwen / DashScope, Xiaomi MiMo, Volcengine Doubao, Meituan LongCat, and MiniMax (domestic / international) now connect directly to their native Responses endpoints instead of going through the Responses→Chat format-conversion takeover, for a shorter and more stable chain.
- **Local proxy request overrides**: providers can configure custom header and request-body overrides, applied by the local proxy when forwarding, with interception validation that blocks protected security headers.
- **In-app recovery screen for a too-new database**: when the SQLite version is newer than the current app supports, you no longer get stuck in a native dialog where "retry just fails again"; instead you are guided to a recovery screen that can upgrade the app in one click.
- **Richer usage / pricing tooling**: bulk import of model pricing from models.dev, AK/SK usage queries for Volcengine Ark Coding / Agent Plan, a live end time for custom date ranges, and pricing for GLM-5.2 and Doubao Seed 2.1.
- **New presets and branding updates**: added SubRouter and OpenCode Go subscription presets, renamed CTok to ETok, refreshed the Kimi brand mark, and added a prime-partner heart badge to the official Kimi presets.
- **Native Windows ARM64 builds**: release artifacts now include native ARM64 builds, so ARM Windows devices no longer depend on x64 emulation.

---

### Added

#### In-App Recovery Screen for a Too-New Database

When the SQLite `user_version` is newer than the current app's supported `SCHEMA_VERSION` (for example after downgrading to an older release, or because a third-party client wrote the file), startup used to die in a native "retry / quit" dialog — where "retry" just fails again. The app now routes to a dedicated recovery screen: when an update is available it offers a one-click "Upgrade App" button (download + install + restart, with a progress bar), and when none is available it explains that even the latest version cannot read this database. The "too new" check runs before any write to the database, so the app never runs DDL against a database it cannot understand; a native close in recovery mode exits cleanly (the tray has not been created yet). ([#4575](https://github.com/farion1231/cc-switch/pull/4575))

#### Local Proxy Request Overrides (Custom Headers and Request Body)

Provider configs can now define custom header and request-body overrides that the local proxy applies when forwarding, exposed via new fields in the Claude and Codex provider forms. Input is validated against a protected-header list that blocks overriding security-sensitive headers. ([#4589](https://github.com/farion1231/cc-switch/pull/4589))

#### Volcengine Ark Coding / Agent Plan Usage Queries

The usage panel can now query Volcengine Ark's Coding Plan and Agent Plan quotas. Because the Ark control-plane OpenAPI (`open.volcengineapi.com`) requires an account-level AccessKey signature rather than an inference API key, the usage script gains a dedicated AK/SK input area with a clickable link straight to the Volcengine IAM key-management console (`https://console.volcengine.com/iam/keymanage`); the proxy implements Volcengine Signature V4 (an AWS SigV4 variant: a fixed canonical-header order, the `HMAC-SHA256` algorithm, and the `ark` service scope). It first probes `GetAFPUsage` (the Agent Plan's 5-hour / weekly / monthly quotas) to auto-detect the plan and falls back to `GetCodingPlanUsage`, parsing the window label from the `Level` field (with a guard for `ResetTimestamp <= 0`), and adds the `monthly` tier label across the usage footer, the tray menu, and all four locales.

#### Import Model Pricing from models.dev

The "Add Pricing" panel gains an "Import from models.dev" button: it fetches `https://models.dev/api.json`, supports full-text search across the entire catalog, and imports the selected entries through the same `update_model_pricing` path as manual entry. Imported model ids are normalized by the backend's `clean_model_id_for_pricing` rules (strip the provider prefix, lowercase, truncate the `:` suffix, map `@` to `-`, drop the `[1m]` marker) so the persisted rows actually match cost-attribution queries. A companion fix changes "backfill zero-cost over a range" to match in Rust by raw model alias (route prefixes, `:free` variants, date suffixes) rather than by exact SQL string match, so newly priced alias rows are priced immediately instead of waiting for the next startup backfill (fixes [#4017](https://github.com/farion1231/cc-switch/issues/4017)). ([#4079](https://github.com/farion1231/cc-switch/pull/4079))

#### Native Windows ARM64 Builds

Release artifacts now include native Windows ARM64 builds, so ARM Windows devices can grab the matching native build instead of relying on x64 emulation. The release matrix now also runs each platform independently (fail-fast disabled), so a job that fails for a missing secret (e.g. macOS signing in a fork) no longer cancels its still-running siblings. ([#3950](https://github.com/farion1231/cc-switch/pull/3950))

#### Live End Time for Custom Date Ranges

The custom date-range picker gains a "follow the current time as the end time" checkbox; when enabled, the end time becomes read-only and tracks now, so usage data always reflects the live consumption from the chosen start to the present moment. This is especially useful within the Coding Plan's 5-hour quota window. `liveEndTime` is now part of the React Query cache key, so a live range and a fixed range with the same endpoint no longer share the same stale cache entry. ([#4438](https://github.com/farion1231/cc-switch/pull/4438))

#### Source File Name in the Session Detail Header

The session detail header now shows the session log's file name next to the project directory (hover for the full path, click to copy), so you can locate and open the underlying JSONL file directly from the UI. For long file names without spaces, such as the ~70-character Codex rollout names, it truncates at `max-w-[200px]` to avoid overflowing into the action buttons in a narrow window. ([#4113](https://github.com/farion1231/cc-switch/pull/4113))

#### Unmanaged-Skill Hint on the Import Button

The Skills import button in the top bar now shows a green dot and a tooltip when there are unmanaged Skills on disk available to import, so you can tell at a glance that a Skill on disk hasn't been brought under management yet. The scan runs once on mount and is shared across navigations (30s `staleTime` + `keepPreviousData`) to avoid redundant disk IO.

#### OpenCode Go Subscription Presets

Added the OpenCode Go (`opencode.ai/zen/go`) preset, covering Claude, Codex, and OpenCode, using a paste-ready bare API key (no OAuth). The Codex preset uses `openai_chat` conversion with a GLM / Kimi / DeepSeek / MiMo model catalog (and without a static `codexChatReasoning`, inferring each model's capabilities), while OpenCode points at `/zen/go/v1` via `@ai-sdk/openai-compatible`. All four OpenCode Go presets — Claude, Claude Desktop, Codex, and OpenCode — carry the referral link and in-app promotion copy; the promotion banner now shows on `partnerPromotionKey` alone (no longer bound to `isPartner`), so a preset can surface a referral promotion without earning the gold paid-partner star (which incidentally brings the existing MiniMax promotion back into view).

#### Prime-Partner Preset Badge and Sorting

The first-party Moonshot Kimi presets (Kimi / Kimi For Coding / Kimi K2.7 Code) are now marked as prime partners: instead of the gold star they render a solid gold heart (no badge border) and, in the default (Original) sort, float to just after the official-category presets and before the rest. The grouping is done with a three-way partition that keeps each group's internal order, and an official preset that is also marked prime-partner stays only in the official group.

#### GLM-5.2 and Doubao Seed 2.1 Pricing

The seed model pricing now includes GLM-5.2 ([#4385](https://github.com/farion1231/cc-switch/pull/4385)) and Doubao Seed 2.1 Pro / Turbo, so these models' usage is priced correctly instead of being recorded at zero cost. Doubao prices use Volcengine's official list pricing (converted at roughly 7.14); `cache_creation` stays at 0 because Doubao bills cache storage by time rather than by token writes, and the existing 2.0 rows are retained for historical accounting.

#### Kimi For Coding Auto-Compact Window

The Kimi For Coding preset now defaults `CLAUDE_CODE_AUTO_COMPACT_WINDOW` to 262144, matching Kimi's official documentation, and exposes it via `templateValues` so users can customize the value for future models or performance tuning. ([#4401](https://github.com/farion1231/cc-switch/pull/4401))

#### SubRouter Partner Provider

Added SubRouter (`subrouter.ai`, an AI relay aggregator that lets one key reach many models across many providers) as a preset covering all seven managed apps — an Anthropic-format endpoint for Claude Code / Claude Desktop / OpenClaw / Hermes, an OpenAI-compatible `/v1` endpoint (`gpt-5.5`) for Codex and OpenCode, and a Gemini-compatible `/v1beta` endpoint (`gemini-3.5-flash`) for Gemini CLI — with its own brand icon, a gold partner star, four-language promotion copy, and a referral signup link prefilled to the API-key registration page (`?aff=l3ri`). ([#4522](https://github.com/farion1231/cc-switch/pull/4522))

---

### Changed

#### Chinese Codex Providers Use the Native Responses API

Several Chinese providers (Qwen / DashScope, Xiaomi MiMo, Volcengine Doubao, Meituan LongCat, MiniMax domestic / international) now expose native OpenAI Responses endpoints, so their Codex presets switch to `apiFormat: "openai_responses"`, connecting directly to the upstream instead of going through the Responses→Chat route-takeover conversion. Dropping the no-longer-needed `codexChatReasoning` and `modelCatalog` also keeps the "local routing mapping" toggle unchecked by default. SiliconFlow-hosted MiniMax stays on `openai_chat` because that is a third-party endpoint, not MiniMax's own base_url. The remaining chat-based providers also refreshed stale model ids (GLM 5.1→5.2, StepFun 3.5-flash-2603→3.7-flash, Ling 2.5-1T→2.6-1T).

#### Upstream-Format Selector Decoupled from the Model-Mapping Toggle

The Codex provider form previously bound Chat format conversion and route takeover (model mapping) to the same toggle, which meant a provider offering a native Responses API couldn't use model mapping without forcing Chat Completions conversion. "Upstream format" (Chat Completions / Responses) is now a separate, always-visible selector, while the local routing toggle only controls the advanced subsection (the model-mapping catalog, plus reasoning capabilities when the format is Chat). Its initial state is derived from whether a saved catalog exists, adding no new persisted field; the four-language (zh / en / ja / zh-TW) `codexConfig` copy was rewritten to match.

#### Doubao Seed 2.1 Pro Preset

The DouBaoSeed preset now points to `doubao-seed-2-1-pro` (replacing `doubao-seed-2-0-code-preview-latest`) across all six clients (claude, claude-desktop, codex, opencode, openclaw, hermes), updates the display name to "Doubao Seed 2.1 Pro", and corrects the OpenClaw cost fields from 0.002 / 0.006 to 0.84 / 4.2 USD per million tokens to match the new model.

#### CTok Renamed to ETok

Following the vendor's domain, endpoint, and trademark rename, all user-facing branding migrates from CTok to ETok (`ctok.ai`→`etok.ai`, `api.ctok.ai`→`api.etok.ai`, plus the internal id, display name, icon, and README partner banner), across every client preset. The Codex history-migration whitelist still keeps `ctok` as a legacy id alongside the new `etok`, so existing users' local session history stays correctly bucketed after the rename.

#### Kimi Preset Naming Unified

The Kimi presets that OpenCode and OpenClaw previously labeled "Kimi K2.7 Code" are renamed to "Kimi" to match the other apps (OpenCode's provider display name is renamed too); the model label still keeps "Kimi K2.7 Code" because it describes the actual model.

#### JSON Editor Dark Mode

The CodeMirror `JsonEditor` in the usage-script dialog, the provider form, and the universal provider form now follows the app theme via `useDarkMode()`, switching to the `oneDark` editor theme instead of staying light while the rest of the app is already dark. ([#4556](https://github.com/farion1231/cc-switch/pull/4556))

#### More Compact "Add Provider" Header and Footer Hint

The "Add Provider" dialog tightens the vertical spacing from the title to the tabs and from the tabs to the cards from 24px to 12px, and adds an always-visible fixed footer hint guiding users to fill in the fields below after choosing a preset. `FullScreenPanel` gains an optional `contentClassName` prop so the padding override applies only to this panel without affecting other panels that share it.

#### Theme-Adaptive Kimi Mark

The inline Kimi placeholder mark is replaced with the vendor's refreshed mark. The K glyph uses `currentColor` so it follows the theme text color (dark in light mode, white in dark mode), while the brand accent color is fixed to the new `#1783FF`, with the metadata fallback color aligned accordingly.

#### Removed the Fable 5 Verified Banner

The Settings About page no longer shows the Fable 5 Verified commemorative banner that 3.16.3 added beside the app name to mark a special build; the banner image and its marker are removed, and the About panel returns to the standard version-badge layout.

---

### Fixed

#### Copilot / Codex OAuth Requests Now Honor the Global Proxy

`CopilotAuthManager` and `CodexOAuthManager` hardcoded `Client::new()` at construction, so their auth flows (token exchange, fetching the `/models` list, determining model vendor, device-code and OAuth refresh requests) ignored the configured global proxy and connected directly to the target services. On Copilot, a direct connection made `/models` return 0 Claude models, breaking live model resolution, and the upstream rejected requests with `400 model_not_supported`. Both managers now pull from the shared client on each request (`crate::proxy::http_client::get()`), honoring the global proxy URL and supporting runtime hot reload. Fixes [#2016](https://github.com/farion1231/cc-switch/issues/2016) and [#2931](https://github.com/farion1231/cc-switch/issues/2931). ([#4583](https://github.com/farion1231/cc-switch/pull/4583))

#### Decompressing Compressed Request and Error Bodies

Codex Desktop sends zstd-compressed request bodies when authenticating to the Codex backend, which broke local proxy routing because the handlers parsed the raw compressed bytes directly with `serde_json`. The proxy now decompresses the request body before JSON parsing (gzip / br / deflate, plus the newly added zstd support, including stacked encodings like `gzip, zstd`), across three Codex handlers, and strips the stale `content-encoding` / `content-length` / `transfer-encoding` request headers so the forwarder regenerates them. Upstream non-2xx error bodies are decompressed the same way, so compressed rate-limit and auth details are no longer dropped and hidden from the client. Fixes [#3764](https://github.com/farion1231/cc-switch/issues/3764) and [#3696](https://github.com/farion1231/cc-switch/issues/3696). ([#3817](https://github.com/farion1231/cc-switch/pull/3817))

#### DeepSeek Endpoint 400 with `thinking: disabled`

DeepSeek's Anthropic-compatible endpoint rejects requests where `thinking.type=disabled` coexists with an effort parameter, returning HTTP 400, which broke Claude Code 2.1.166+ sub-agents (Workflow / Dynamic Workflow) that hardcode `thinking: disabled`. Rather than overriding the client's intent, the proxy now strips the conflicting `output_config.effort` / `reasoning_effort` parameters for the official DeepSeek endpoint, since sub-agents don't need to surface reasoning anyway. ([#4239](https://github.com/farion1231/cc-switch/pull/4239))

#### Reverted Hoisting Anthropic system Messages

Reverted the [#3775](https://github.com/farion1231/cc-switch/pull/3775) change that hoisted `role=system` messages on Anthropic-compatible providers from `messages[]` up to the top-level `system` field. The DeepSeek endpoint natively accepts inline system messages, and the rewrite changed the request prefix; keeping messages in place preserves the prompt prefix and avoids a suspected cache-hit-rate regression (see [#4297](https://github.com/farion1231/cc-switch/issues/4297)). The unrelated Windows test fix and the tool-thinking-history normalization from #3775 are retained.

#### Chat Tool Calls Missing Function Names

Some upstreams send empty or missing function names in streaming tool-call deltas, which used to produce invalid Codex Chat output items (or an `unknown_tool` fallback). Accumulated tool-call state is no longer overwritten by an empty delta, and tool calls that never receive a `call_id` and a valid name are skipped at finalization, across the streaming, non-streaming, and legacy `function_call` paths. ([#4159](https://github.com/farion1231/cc-switch/pull/4159))

#### Restore Cached Codex Tool-Call Fields

When Codex makes a follow-up Chat request that references a `previous_response_id`, its `function_call` items may carry only the `call_id`. History enhancement previously backfilled only `reasoning` / `reasoning_content`, leaving the function's `name`, `arguments`, `status`, and other fields empty; it now restores all cached tool-call fields from history so the call can be correctly reconstructed for the Chat upstream. ([#4160](https://github.com/farion1231/cc-switch/pull/4160))

#### Duplicate Codex base_url Entries in config.toml

Writing Codex's `base_url` into `config.toml` previously replaced or removed only one matching assignment per section, so a section that already contained multiple `base_url` lines kept the extras and accumulated duplicates. `setCodexBaseUrl` now collapses all matches in the target section or at the top level (replacing the first, removing the rest), and the TOML `base_url` regex now handles escaped quotes. ([#4316](https://github.com/farion1231/cc-switch/pull/4316))

#### History Migration Probes the CODEX_SQLITE_HOME State DB

Codex session-history migration previously scanned only `~/.codex/state_5.sqlite` and the `sqlite_home` location in `config.toml`, so when Codex's SQLite state was relocated via the `CODEX_SQLITE_HOME` environment variable, the state DB was never scanned and its threads stayed in the old provider bucket. The `codex_state_db_paths` helper shared by both the third-party and unified-session migrations now falls back to `CODEX_SQLITE_HOME` (the `sqlite_home` in `config` still takes precedence).

#### Provider Terminal Honors the User Shell

Launching a provider terminal on macOS / Linux previously hardcoded `bash`, so zsh / fish users' rc files weren't loaded. The launcher now detects the user's default shell from `$SHELL` (falling back to `/bin/zsh` on macOS, `/bin/bash` on Linux) and execs into it with the clean-start flag, while the launch script itself now uses POSIX `sh` for portability (e.g. fish, and NixOS where `/bin/sh` may not exist). ([#4140](https://github.com/farion1231/cc-switch/pull/4140), fixes [#1546](https://github.com/farion1231/cc-switch/issues/1546))

#### Claude MCP Paths Honor the Custom Config Directory

When a custom Claude config directory is configured, MCP server reads and writes now resolve to the MCP file under that directory instead of the default location, isolating MCP state per profile. The old "copy on access" migration of the legacy file was removed in favor of resolving the override path directly. ([#3431](https://github.com/farion1231/cc-switch/pull/3431))

#### Preset Results Clickable After Search

After searching in the "Add Provider" preset selector, results briefly couldn't be clicked or selected. The `requestAnimationFrame` `select()` that fought the input and swallowed the first character (e.g. "gateway" → "ateway") was removed, input auto-focus on the open-and-click path was restored, and pressing Ctrl/Cmd+F while the search box is already open now refocuses it. The provider list's typing guard was also narrowed to the Ctrl/Cmd+F branch so Escape can still close the search panel. ([#4315](https://github.com/farion1231/cc-switch/pull/4315))

#### Skills Browsing and Provider Card Display Fixes

Fixed several display and interaction issues: repository management actions stay available while browsing skills.sh, and refresh stays available when a repository returns empty results; overly long provider names and website URLs on provider cards now truncate instead of overflowing; the OMO model-variant dropdown truncates the selected label with a full-text tooltip; and Select menu items show a checkmark on the currently selected item. ([#4323](https://github.com/farion1231/cc-switch/pull/4323))

#### Reset Scroll When Switching Settings Tabs

Switching tabs in the Settings dialog used to keep the previous tab's scroll position, sometimes landing halfway down the new tab; the scroll container now resets to the top whenever the active tab changes. ([#4165](https://github.com/farion1231/cc-switch/pull/4165))

---

### Documentation

#### Kimi Pinned Sponsor Banner

The pinned sponsor banner at the top of all four README languages (en / zh / ja / de) is now Kimi K2.7 Code, replacing the previous MiniMax M2.7 banner. The copy reflects the K2.7 Code release (a coding-oriented agentic model with thinking-token usage down roughly 30% from K2.6), the banner is now served from in-repo assets (`assets/partners/banners/kimi-banner-en.png` / `kimi-banner-zh.png`) instead of the Moonshot CDN, and it carries a clickable call to action pointing at the `aff=cc-switch` Moonshot console.

#### Codex Unified Session History Guide

Added a three-language (zh / en / ja) guide explaining what the unified Codex session history toggle's enable-time migration (when enabled) and ledger-based restore (when disabled) actually do, why session data is never truly deleted (only re-tagged + auto-backed-up), and how to verify whether files really are on disk or were just filed into another provider's drawer. It includes a symptom table for the common "my sessions are gone" misunderstanding and disk-verification commands for macOS / Linux / Windows, and is linked as the first item in the v3.16.3 release notes' "Usage Guides".

#### Simplified Homebrew Install Instructions

The install guide no longer asks users to run `brew tap farion1231/ccswitch` before `brew install --cask cc-switch`; this deprecated tap step is removed from the en / ja / zh user manuals, and the cask now installs directly. ([#4319](https://github.com/farion1231/cc-switch/pull/4319))

#### Star-History Global Ranking Badge

Added a star-history global ranking badge next to the existing Trendshift badge across all four README languages, with light / dark theme variants.

#### Volcengine Ark Coding Plan Activity Link

The "developers in mainland China click here" link in the ByteDance / Volcengine Ark sponsor entry now points to Volcengine's `ai618` activity page, replacing the previous `codingplan` referral URL, across all four README languages.

#### CCSub Sponsor Banner Vector Asset

Replaced the low-resolution `ccsub.jpg` sponsor logo with the vector `ccsub.svg`, letterboxed from 2046x648 to 2046x850 (roughly 2.406:1) so it matches the other sponsor-table banners and renders at the same 62px height. All four README languages point to the new asset.

---

### Upgrade Notes

#### Chinese Codex Providers' Native Responses Migration

This release switches the Codex presets of several Chinese providers with native Responses endpoints (Qwen / DashScope, Xiaomi MiMo, Volcengine Doubao, Meituan LongCat, MiniMax domestic / international) to `openai_responses` and removes their `modelCatalog`. Existing providers already configured from these presets are unaffected and keep their configuration as-is; if you want to switch to native Responses (dropping the format-conversion takeover), re-pick the preset once and save. SiliconFlow-hosted MiniMax stays on `openai_chat` and is not part of this migration.

#### Recovery from a Too-New Database

If you opened the database with a higher version of CC Switch and then switched back to an older version, the older version will enter the new "database version too new" recovery screen on startup and guide you to upgrade to a version that can read the database. This is expected behavior — upgrading to the latest version restores normal operation.

---

### Risk Notice

This release continues the risk notices from previous versions for reverse-proxy-style features.

**Codex OAuth reverse proxy**: using a ChatGPT subscription's Codex OAuth through a reverse proxy may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Codex third-party provider Chat routing**: when CC Switch local proxy converts and forwards Codex requests to third-party providers, each provider may have different requirements for billing, compliance, and data retention. Read the target provider's terms before use.

**Claude Desktop third-party provider proxy switching**: when CC Switch's built-in proxy gateway forwards Claude Desktop requests to third-party providers, you must also follow the target provider's billing, compliance, and data-retention terms.

By enabling these features, users accept the related risks. CC Switch is not responsible for account restrictions, warnings, or service suspensions caused by using these features.

---

### Thanks

Thanks to the following contributors for the features and fixes in v3.16.4:

- [#3817](https://github.com/farion1231/cc-switch/pull/3817): decompress the request body before forwarding and add zstd support, thanks @chenx-dust.
- [#4583](https://github.com/farion1231/cc-switch/pull/4583): fix the Copilot / Codex OAuth modules bypassing the global proxy and causing Claude model 400s, thanks @zymouse.
- [#4589](https://github.com/farion1231/cc-switch/pull/4589): add local proxy request overrides (custom headers and request body), thanks @mfzzf.
- [#4575](https://github.com/farion1231/cc-switch/pull/4575): add an in-app recovery screen for a too-new database version, thanks @SaladDay.
- [#4556](https://github.com/farion1231/cc-switch/pull/4556): wire dark mode into the JsonEditor in several places, thanks @TanKimzeg.
- [#4438](https://github.com/farion1231/cc-switch/pull/4438): add a live end time for custom date ranges, thanks @arichyx.
- [#3950](https://github.com/farion1231/cc-switch/pull/3950): add Windows ARM64 release support, thanks @MOON-DREAM-STARS.
- [#4401](https://github.com/farion1231/cc-switch/pull/4401): add CLAUDE_CODE_AUTO_COMPACT_WINDOW to the Kimi For Coding preset, thanks @cyijun.
- [#4323](https://github.com/farion1231/cc-switch/pull/4323): fix the Skills management and model-config interaction display, thanks @thisTom.
- [#3431](https://github.com/farion1231/cc-switch/pull/3431): align Claude MCP paths to the custom config directory, thanks @makoMakoGo.
- [#4159](https://github.com/farion1231/cc-switch/pull/4159): skip Chat tool calls missing function names, thanks @hueifeng.
- [#4385](https://github.com/farion1231/cc-switch/pull/4385): add glm-5.2 pricing, thanks @arichyx.
- [#4079](https://github.com/farion1231/cc-switch/pull/4079): support importing model pricing from models.dev, thanks @kingcanfish.
- [#4315](https://github.com/farion1231/cc-switch/pull/4315): fix preset results not being clickable / selectable after search, thanks @RuixeWolf.
- [#4316](https://github.com/farion1231/cc-switch/pull/4316): prevent duplicate Codex base_url entries, thanks @jeffwcx.
- [#4140](https://github.com/farion1231/cc-switch/pull/4140): make the provider terminal honor the user shell, thanks @zkforge.
- [#4113](https://github.com/farion1231/cc-switch/pull/4113): show the source file name in the session detail header, thanks @xu-song.
- [#4160](https://github.com/farion1231/cc-switch/pull/4160): restore cached Codex tool-call fields, thanks @chen-985211.
- [#4239](https://github.com/farion1231/cc-switch/pull/4239): strip the effort parameter when thinking:disabled on DeepSeek endpoints, thanks @maskshell.
- [#4165](https://github.com/farion1231/cc-switch/pull/4165): reset scroll when switching settings tabs, thanks @Muleizhang.
- [#4319](https://github.com/farion1231/cc-switch/pull/4319): remove the deprecated Homebrew tap step, thanks @tianpeng-dev.
- [#4522](https://github.com/farion1231/cc-switch/pull/4522): add the SubRouter provider preset, thanks @abingyyds.

Thanks also to everyone who reported Codex proxy chain, usage billing, local proxy robustness, and platform compatibility issues after the v3.16.3 release. Many of these patches came directly from real-world reproduction clues.

---

### Download & Install

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) and download the build for your system.

#### System Requirements

| System  | Minimum Version          | Architecture                        |
| ------- | ------------------------ | ----------------------------------- |
| Windows | Windows 10 and later     | x64 / ARM64                         |
| macOS   | macOS 12 (Monterey)+     | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below          | x64 / ARM64                         |

#### Windows

| File                                     | Description                                      |
| ---------------------------------------- | ------------------------------------------------ |
| `CC-Switch-v3.16.4-Windows.msi`          | **Recommended** - MSI installer with auto-update |
| `CC-Switch-v3.16.4-Windows-Portable.zip` | Portable build, unzip and run                    |

Windows ARM64 devices should pick the artifact whose file name carries the `arm64` tag.

#### macOS

| File                             | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.16.4-macOS.dmg`    | **Recommended** - DMG installer, drag to Applications |
| `CC-Switch-v3.16.4-macOS.zip`    | Unzip and drag to Applications, Universal Binary      |
| `CC-Switch-v3.16.4-macOS.tar.gz` | For Homebrew install and auto-update                  |

Homebrew install:

```bash
brew install --cask cc-switch
```

Upgrade:

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux assets are available for both **x86_64** and **ARM64** (`aarch64`). Choose the file whose architecture tag matches your machine's `uname -m` output:

- `CC-Switch-v3.16.4-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.4-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended Format | Install Command                                                        |
| --------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Make executable and run directly, or use AUR                          |
| Other distributions / unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`             |

## [3.16.3] - 2026-06-14

> 🎉 **CC Switch has passed 100,000 Stars!**
> Thank you to every user, contributor, and Star — you are the reason it has come this far. 🙏

> 💎 **This release was developed with help from the Claude Fable 5 model** — it helped untangle several critical, error-prone pieces of logic: the attribution chain that bills route-takeover traffic by the real upstream model, the metering and de-duplication of cache tokens on format-conversion paths, the in-app update restart deadlock, and the migration / restore invariants of Codex unified session history. This is also why this release adds a **Fable 5 Verified** badge to the About page.

> After v3.16.2 broadened data portability and usage observability, this release puts the focus on "making usage billing truly accurate" — billing by the real upstream model, fixing cache double-counting on format-conversion paths, counting Claude Code Workflow sub-agent usage (schema v11), and a round of redesign for the usage dashboard (dashboard-wide provider / model filters, a brand-icon toolbar, and more resilient quota queries) — while also hardening a batch of local proxy and platform issues, adding a custom User-Agent override, a Codex unified session history toggle, and a Claude Fable 5 tier.

### Usage Guides

This release adds a **Codex unified session history** toggle — it migrates / restores sessions, and if used without care it can make you think sessions were "lost," so it is well worth reading its guide first. This release also changes how usage is counted and reworks the dashboard quite a bit, so both are worth starting with:

- **[Codex Unified Session History: Feature Overview and Usage Guide](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-unified-session-history-guide-en.md)**: what "unify / migrate / restore" actually changes, why your data is never truly lost, and how to verify and precisely restore sessions when you can't see them. **If you used this toggle or worry a session is gone, read this first.**
- **[Usage Statistics](/en/docs?section=proxy&item=usage)**: understand the Usage Dashboard's data sources (proxy logs, session sync) and how the statistics are counted. This release adds dashboard-wide provider / model filters and surfaces the real pricing model for route-takeover traffic.
- **[Settings](/en/docs?section=getting-started&item=settings)**: the custom User-Agent override, the Codex unified session history toggle, and other switches live in the provider form's advanced options and on the settings page.

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues.

### Overview

CC Switch v3.16.3 is a maintenance update following v3.16.2. After the previous release concentrated on broadening data portability and usage observability, this release puts the focus on "making usage billing truly accurate" — billing by the real upstream model rather than whatever the upstream echoes back, fixing the cache-token double-counting on format-conversion paths (Chat / Responses / Gemini converted to Anthropic), folding Claude Code Workflow sub-agent usage into the local statistics, and persisting the actual pricing basis used by each record as schema v11. The usage dashboard was reworked along with it, adding dashboard-wide provider / model filters, a brand-icon toolbar, and more resilient quota queries (retry on failure plus keeping the last successful result).

In addition, this release hardens a batch of local proxy robustness issues (aggregating SSE responses returned under a mislabeled Content-Type, Codex `/responses` image rectification for text-only models, recovery of Codex OAuth credentials and takeover residue, duplicate YAML keys in Hermes config), reworks the provider configuration experience (a custom User-Agent override, a unified Codex advanced section, searchable and sortable presets, a Claude Fable 5 tier), adds a Codex unified session history toggle, and fixes the in-app update hang, the Codex upgrade that broke the install, duplicate macOS terminal windows, and more.

### Highlights

- **More accurate usage billing**: route-takeover traffic is now billed by the real upstream model (not the alias the upstream echoes back), format-conversion paths no longer count cache tokens into input twice, and Claude Code Workflow sub-agent usage is now counted — with the pricing basis persisted as schema v11.
- **Usage dashboard redesign**: provider / model filters are promoted from inside the request-log table up to dashboard-wide filters, the app filter switches to brand icons, and quota queries gain retry-on-failure plus "keep the last successful result" so a single network blip no longer turns cards red.
- **Custom User-Agent override**: providers can set a custom UA that applies consistently across forwarding, connectivity detection, and model listing, getting past coding-plan upstreams that gate on a UA whitelist (which is how the Codex "Kimi For Coding" preset was restored).
- **Codex unified session history**: a new opt-in toggle lets official Codex sessions share a single resume-history bucket with third-party sessions, with optional migration of existing sessions and precise ledger-based restore.
- **Proxy and platform hardening**: aggregating mislabeled SSE responses, Codex image rectification, takeover-residue recovery, Hermes YAML de-duplication; in-app updates no longer hang on "restarting", and Codex upgrades no longer break the install.

### Added

#### Custom User-Agent Override

Provider configs can now set a custom User-Agent that the proxy applies consistently across request forwarding, stream check, and model listing (`GET /v1/models`), so coding-plan upstreams that gate on UA no longer fail detection or return 403 while the proxy itself works. The Claude and Codex forms expose it in advanced settings with a curated presets dropdown (Claude Code / Kilo Code families that pass UA whitelists) and live non-blocking validation; stale custom UAs are dropped when switching to an official preset to avoid silently altering headers (#3671).

#### Unified Codex Session History

Official Codex sessions can now share a single resume-history bucket with cc-switch third-party sessions via an opt-in toggle under Settings → Codex App Enhancements, so the resume picker no longer hides them from each other. When enabled, the live `config.toml` routes official runs through a shared `custom` model_provider that mirrors the built-in OpenAI provider (`auth.json` is untouched); the toggle is forward-only by default but the enable dialog offers a checkbox to migrate existing official sessions (with per-generation backups), and the disable dialog offers a precise ledger-based restore that only reverts sessions originally recorded as `openai` while leaving sessions created during the toggle untouched.

#### Dashboard-Wide Provider / Model Filters

The provider and model filters move from inside the request-log table up to the top bar, applying globally to the hero summary, trend chart, request logs, and both stats tabs so you can scope the whole dashboard to a given source and model. Sources match by exact display name (so session placeholder rows like "Claude (Session)" are selectable) and models match by effective pricing model, with the model dropdown cascading from the selected source and both lists showing only options that have data in the current range.

#### Refreshed Model Pricing Seed

Added pricing for 9 models including Claude Fable 5, Grok 4.3, Mistral Medium 3.5 / Small 4, and Qwen 3.7 Max/Plus, and corrected 28 existing prices against current official vendor list pricing (GLM, Grok, MiMo, Doubao, Kimi, MiniMax, Mistral, Qwen) so usage cost estimates are accurate. Each change updates the seed for fresh installs and adds a guarded repair for existing databases without clobbering user-edited rows.

#### Claude Fable 5 Model Tier

Provider forms now expose `claude-fable-5` as a fourth model-mapping tier on both the Claude Code and Claude Desktop proxy paths, with a fable → opus → default fallback mirroring the official downgrade and the `fable-` prefix whitelisted for the Desktop 1.12603.1+ validator. A clarified four-language fallback hint warns that leaving a tier blank on third-party endpoints forwards the literal model name and 404s (#3980, #4026, #4049).

#### Unity2.ai Partner Provider

Added Unity2.ai, an AI API relay partner, as a preset across all seven managed apps (Claude Code, Codex, Gemini, OpenCode, OpenClaw, Claude Desktop, Hermes), each carrying the referral signup link and partner promotion copy in all four locales. Codex uses the bare base URL (the gateway exposes `/responses` at root) while OpenCode / OpenClaw / Hermes use the `/v1` chat-completions endpoint with `gpt-5.5`.

#### Kimi K2.7 Code Model

Added the `kimi-k2.7-code` model (in $0.95 / out $4.00 / cache-read $0.19 per 1M tokens, 256K context) and pointed all six official Moonshot Kimi presets (Claude Code, Codex, Claude Desktop, Hermes, OpenCode, OpenClaw) at it, renaming the OpenCode / OpenClaw presets to "Kimi K2.7 Code". The pricing seed applies on startup via the idempotent insert path, so existing users pick up the new pricing without a migration.

#### Codex "Kimi For Coding" Preset Restored

Re-added the Codex "Kimi For Coding" preset (`openai_chat`, `kimi-for-coding`, 256K context) with thinking mode enabled by default; it was previously removed because the coding endpoint rejects Codex's default `codex-cli` User-Agent with 403. It now works via proxy takeover combined with the custom User-Agent override (set to a whitelisted UA such as `claude-cli/*`).

#### Pricing-Model Audit in Request Detail

The request detail panel now shows the requested model and the pricing model when they differ from the response model, making route-takeover bills auditable directly from the usage UI.

#### Preset Provider Search & Sorting

The provider preset selector gains a searchable, sorted list with an inline search box (toggled via a magnifier icon, dismissed on ESC or outside click). Buttons use a responsive grid with consistent sizing and default icons, and search matches only provider display/raw names so URL fragments and shared category labels no longer produce noisy matches (#3975, #4183).

#### Claude Mythos 5 Pricing

Registered the `claude-mythos-5` model in the bundled model/pricing table (in $10 / out $50 per 1M tokens, cache read $1.00, cache write $12.50), so usage metering prices and displays it correctly (#4077).

#### Fable 5 Verified Banner

The Settings About page now displays a Fable 5 Verified banner beside the app name and version, marking this as a special build, with the version badge centered under the app name.

### Changed

#### Claude Desktop Usage Folded Into Claude

The dashboard no longer shows a standalone "Claude Desktop" bucket, which only ever displayed a partial number (Desktop chat usage never passes through the proxy and its Code-tab sessions write into the shared `~/.claude/projects` tree). Desktop proxy traffic is now folded into the `claude` view for display while still recorded under its own `app_type` for route-takeover billing audit, with the real value visible in the request detail panel.

#### Lightweight Provider Health Check

The provider health check no longer sends a real streaming model request (which many third-party providers blocked with 401/403/WAF, causing false negatives); it now performs a lightweight HTTP reachability probe of the provider `base_url`, treating any HTTP response as reachable and counting only DNS/connect/TLS/timeout as failure. The connectivity button is hidden for official providers (which use OAuth with an empty base URL and no reliable reachability target), the real-request confirmation dialog and test model/prompt fields are removed, and the degraded-latency threshold is set to 6s with an 8s timeout. The reachability check never resets the circuit breaker, so failover detection stays driven solely by real proxy traffic.

#### Codex Advanced Options Section

The Codex provider form now folds local routing, model mapping, reasoning overrides, and custom User-Agent into a single collapsible advanced section mirroring the Claude form (auto-expanding when a UA is set or local routing is on). Custom User-Agent is now also configurable for native Responses providers, where it was previously reachable only with `openai_chat` routing enabled.

#### Usage Toolbar Refresh and Layout

The app filter now renders brand icons (via ProviderIcon, with a grid icon for "All") instead of text tabs that wrapped awkwardly in narrow windows, and the usage hero shows the selected app's brand icon with Codex recolored to a neutral gray matching OpenAI's monochrome branding. The click-to-cycle refresh button becomes a Select with a localized "off" label, and the top-bar controls are compacted and aligned into consistent width groups with truncated long date-range labels.

#### Faster About Panel Loading

The Settings About panel now loads progressively: the app version badge appears the instant it resolves instead of waiting for tool probes, each tool card updates the moment its own version check finishes (probes run concurrently rather than sequentially), and results are cached for the app session with a 10-minute TTL so reopening the About tab reuses cached values and revalidates stale ones in the background instead of re-probing all six tools every time.

#### Volcengine Ark Coding Plan Promo

Updated the Volcengine Ark preset across all six apps with the new Coding Plan invite link (replacing the old Agent Plan / activity links) and refreshed the partner promotion copy in all four locales (two-month 75% off plus invite code 6J6FV5N2), correcting the product name from Agent Plan to Coding Plan.

#### MiniMax Demoted to Regular Provider

Removed the gold partner star badge and the API-key promotion banner for MiniMax by dropping the `isPartner` flag from all its presets; it stays as a regular `cn_official` provider keeping its icon and theme. The promotion copy is kept dormant so the partnership can be re-enabled with a single line.

#### LemonData Removed, SudoCode Demoted

Removed the LemonData provider preset entirely from all apps along with its promotion copy, icons, and sponsor listings, and demoted SudoCode from a partner to a regular `third_party` provider by dropping its `isPartner` flag and promotion copy (it keeps its icon).

#### AtlasCloud Codex GLM 5.1 Context Window

Declared the 200,000-token context window for the `zai-org/glm-5.1` model in the AtlasCloud Codex preset, matching the other GLM 5.1 preset entries.

### Fixed

#### Route-Takeover Traffic Billed by the Real Upstream Model

When a request was routed to a different upstream (env model mapping, Claude Desktop routes, Copilot normalization, Codex chat override), the proxy used to attribute and price usage by whatever model the upstream echoed back, recording kimi/glm tokens as `claude-*` and overstating cost roughly 5–25×. The forwarder now captures the real outbound model, attributes usage by upstream-echo then outbound then client alias, persists the actual pricing basis on every row (schema v11), and keeps that basis through cost backfill and 30-day rollup pruning; Claude Desktop traffic is now logged under its own `app_type` so its pricing overrides apply.

#### Usage Metering on Format-Conversion Proxy Paths

Audited and fixed token/cache accounting across the proxy's format-conversion paths (Chat, Responses, and Gemini converted to Anthropic). The proxy now records the actually returned model, injects `stream_options.include_usage` so OpenAI-compatible upstreams emit usage in streaming, excludes `cache_read` and `cache_creation` from input on Claude←OpenAI paths to stop double-billing cache tokens, subtracts cached Gemini prompt tokens, still records fully-cached requests, and skips synthetic all-zero usage that previously inflated request counts (#2774).

#### In-App Update No Longer Hangs on Restart

Installing an update from within the app no longer freezes on the "restarting" screen, leaving the new version installed but requiring a manual force-quit. The download-install-restart chain now runs entirely in the backend (a new `install_update_and_restart` command) with platform-aware install ordering and single-instance-lock teardown before re-exec, instead of depending on the old WebView to keep running JS after the app bundle was already swapped; exit requests are also classified so restart requests fall through to Tauri's default flow rather than deadlocking on the window-state plugin mutex (#4069, #4074).

#### Codex Upgrade No Longer Breaks the Install

Upgrading Codex from the Settings "About" tab no longer leaves it throwing "Missing optional dependency @openai/codex-…" errors. The upgrade chain previously ran `codex update` first, which on an npm install is a bare reinstall that reports success even when the per-platform binary fails to land; Codex is now removed from the self-update-first path and a runnable check triggers an uninstall+reinstall self-heal (scoped to npm-managed installs) that actually re-lands the missing platform binary.

#### Codex OAuth Auth Token Preserved on Proxy Takeover

Enabling proxy takeover for a Codex provider no longer strips the `ANTHROPIC_AUTH_TOKEN` placeholder, which previously broke Claude Code's login on hot-switches, fresh installs, and configs already stripped by older releases. The placeholder is now injected unconditionally for managed (non-Copilot) Codex providers, including URL-only ones; GitHub Copilot behavior (API_KEY only) is unchanged (#3789, #3784).

#### Takeover-Residue Recovery Across Config-Dir Switches

Restarting the app after changing the config directory while proxy takeover is active no longer leaves Claude/Codex/Gemini pointed at a dead local proxy. The old instance now restores the taken-over live files before restarting, the first-run import refuses to persist a takeover placeholder as a provider, and SSOT restore validates that the current provider's config is free of placeholders before writing it back (#4076).

#### Mislabeled SSE Bodies in Format-Transform Fallback

Requests routed through Claude/Codex format conversion no longer fail with an opaque 422 "Failed to parse upstream response" when a MaaS gateway force-streams a `stream:false` request and returns an SSE body under a non-SSE Content-Type. The proxy now sniffs for SSE on parse failure, aggregates the chunks into a single JSON, and runs the existing converter so clients still get a valid non-stream response; remaining parse failures are enriched with content-type, encoding, and body-snippet diagnostics, and deflate decoding now tries zlib before raw (#2234).

#### Duplicate YAML Keys in Hermes Config

Hermes config writes no longer accumulate duplicate top-level keys (e.g. `mcp_servers`) that caused "Failed to parse Hermes config as YAML: duplicate entry with key" errors. Section replacement now strips all stale occurrences from the remainder instead of degrading into appends, the dedup safety net handles both LF and CRLF line endings, and healing keeps the last (newest) occurrence to match Hermes's own last-wins PyYAML semantics (#3267, #3633, #2973, #2529, #3310, #3762).

#### Usage Query Resilience and Error Clarity

Usage cards no longer flip to red on a single transient blip: queries now retry once and keep showing the last successful result for up to 10 minutes on network/timeout/5xx failures, while deterministic failures (auth, empty key, unknown provider, 4xx) surface immediately and clear the snapshot so a stale quota can't resurface after credentials change. Native balance/coding-plan/subscription timeouts were raised from 10s to 15s for slow cross-border endpoints, and coding-plan now returns explicit "API key is empty" / "Unknown coding plan provider" errors instead of a blank failure.

#### Usage Script Provider Credential Resolution

Custom JS-script usage queries resolved `{{apiKey}}` / `{{baseUrl}}` by guessing env fields only, so providers that store credentials elsewhere (e.g. Codex's `auth.OPENAI_API_KEY` plus `config.toml` base_url) always got empty values and failed despite being fully configured. Script queries and the test/preview now reuse the same per-app credential resolver as the native balance path, with explicit non-empty script values still taking precedence (#1479).

#### Claude Code Workflow Sub-Agent Usage Counted

Local (no-proxy) session-log usage accounting missed Claude Code Workflow sub-agent traffic, under-counting overall usage by roughly 4.1% (concentrated in workflow/subagent transcripts). The scanner now descends into the deeper `subagents/workflows/wf_*/` transcript directories, and the parser no longer drops billable assistant messages that lack a `stop_reason` but already incurred input/cache token cost; dedup is unchanged so no usage is double-counted.

#### Codex Image Rectifier for /responses Text-Only Upstreams

Codex `/responses` requests carrying images and routed to text-only OpenAI-chat models (e.g. DeepSeek `deepseek-v4-flash`) no longer fail with HTTP 400 "unknown variant `image_url`". The media rectifier now also covers the Codex adapter, scanning the responses `input` for `input_image` blocks so it can proactively strip images for known text-only models and reactively retry with images replaced on upstream image-unsupported errors.

#### Zhipu Coding-Plan Quota Window Mislabeling

The Zhipu coding-plan view no longer swaps the 5-hour and weekly quota buckets in the final hours of each weekly cycle. The two windows are now classified by the explicit `unit` field (3 = 5-hour, 6 = weekly) instead of by sorting reset-time ascending, which mislabeled them exactly when users check their weekly quota most; the old reset-time heuristic remains as a fallback (#3036).

#### Duplicate Provider Terminal Sessions on macOS

Launching a provider terminal on macOS no longer opens an extra empty window alongside the command session; Terminal.app uses `launch` (not `activate`) on cold start and Ghostty uses an initial-command so a single session opens, with a fallback retained if the AppleScript path fails (#4156).

#### Claude Desktop Model-Mapping Placeholders

The Claude Desktop model-mapping form previously showed mismatched example brands across the menu display name and request model columns (DeepSeek vs Kimi), implying a display name maps to an unrelated model. Both placeholders are now derived from each row's role so they stay brand-consistent, with the lightweight Haiku tier using a flash example.

#### Popovers Behind Fullscreen Panels

Popovers and tooltips such as the provider preset search no longer render behind fullscreen panels and appear unresponsive on click; their z-index is raised above the fullscreen overlay while staying below modal dialogs.

#### ToggleRow Icon Shrinking

Toggle row icons no longer shrink or distort when paired with long descriptions, keeping the icon at a fixed size next to multi-line text.

### Documentation

#### Release Notes Contributor Mentions

Restored contributor mentions in the v3.16.1 and v3.16.2 release notes across all three locales.

### Upgrade Notes

#### Pricing Database schema v11 Auto-Migration

This release adds a `pricing_model` column to `proxy_request_logs` and rebuilds the rollup by `request_model` + `pricing_model`, migrating automatically on startup with no manual action required. Historical rows have their cost frozen at write time and are not recalculated (rows with `app_type="claude"` mix native and converted sources); only real but previously un-priced takeover rows stay at zero cost until pricing is supplied and then backfilled.

#### Model Mapping Adds a Fourth Tier (Fable 5)

The Claude Code and Claude Desktop model mappings now have four tiers (Sonnet / Opus / Fable / Haiku). Older three-tier providers pick up the `claude-fable-5` tier after being reopened and saved; leaving that tier blank means it inherits Sonnet. Note: leaving any tier blank on third-party endpoints forwards the literal model name of that tier and may 404, so fill it in as needed.

#### The "Kimi For Coding" Preset Needs Proxy Takeover + a Whitelisted UA

The restored Codex "Kimi For Coding" preset is still rejected with 403 if used with the default `codex-cli` User-Agent. To use it, enable proxy takeover and set the custom User-Agent in the provider's advanced options to a whitelisted UA (such as `claude-cli/*`).

#### Provider Health Check Semantics Changed

The health check changed from "send a real model request" to "HTTP reachability probe". Note that reachable ≠ usable: a host that returns 403 is reachable but may be broken for real traffic. Failover decisions remain driven solely by real proxy traffic and are unaffected by the health check.

### Risk Notice

This release continues the risk notices from previous versions for reverse-proxy-style features.

**Codex OAuth reverse proxy**: using a ChatGPT subscription's Codex OAuth through a reverse proxy may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Codex third-party provider Chat routing**: when CC Switch local proxy converts and forwards Codex requests to third-party providers, each provider may have different requirements for billing, compliance, and data retention. Read the target provider's terms before use.

**Claude Desktop third-party provider proxy switching**: when CC Switch's built-in proxy gateway forwards Claude Desktop requests to third-party providers, you must also follow the target provider's billing, compliance, and data-retention terms.

By enabling these features, users accept the related risks. CC Switch is not responsible for account restrictions, warnings, or service suspensions caused by using these features.

### Thanks

Thanks to the following contributors for the features and fixes in v3.16.3:

- [#3789](https://github.com/farion1231/cc-switch/pull/3789): preserve Codex OAuth auth token on takeover, thanks @codeasier.
- [#2774](https://github.com/farion1231/cc-switch/pull/2774): fix model / input-token recording on Completions→Anthropic, thanks @LaoYueHanNi.
- [#4069](https://github.com/farion1231/cc-switch/pull/4069): fix the deadlock on relaunch after an in-app update, thanks @thisTom.
- [#4156](https://github.com/farion1231/cc-switch/pull/4156): fix duplicate provider terminal sessions on macOS, thanks @thisTom.
- [#3267](https://github.com/farion1231/cc-switch/pull/3267): fix duplicate YAML keys in the Hermes config, thanks @que3sui.
- [#1479](https://github.com/farion1231/cc-switch/pull/1479): fix usage script provider credential resolution, thanks @pa001024.
- [#3975](https://github.com/farion1231/cc-switch/pull/3975): add preset search and sorting, thanks @Nastem.
- [#4183](https://github.com/farion1231/cc-switch/pull/4183): adjust the preset-provider button appearance and search-box position, thanks @WangJiati.
- [#4077](https://github.com/farion1231/cc-switch/pull/4077): add claude-mythos-5 model pricing, thanks @osscv.

Thanks also to everyone who reported usage billing, local proxy robustness, Codex upgrade, and platform compatibility issues after v3.16.2. Many of these fixes came directly from real-world reproduction details.

### Download & Install

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) and download the build for your system.

#### System Requirements

| System  | Minimum Version          | Architecture                        |
| ------- | ------------------------ | ----------------------------------- |
| Windows | Windows 10 and later     | x64                                 |
| macOS   | macOS 12 (Monterey)+     | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below          | x64 / ARM64                         |

#### Windows

| File                                     | Description                                      |
| ---------------------------------------- | ------------------------------------------------ |
| `CC-Switch-v3.16.3-Windows.msi`          | **Recommended** - MSI installer with auto-update |
| `CC-Switch-v3.16.3-Windows-Portable.zip` | Portable build, unzip and run                    |

#### macOS

| File                             | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.16.3-macOS.dmg`    | **Recommended** - DMG installer, drag to Applications |
| `CC-Switch-v3.16.3-macOS.zip`    | Unzip and drag to Applications, Universal Binary      |
| `CC-Switch-v3.16.3-macOS.tar.gz` | For Homebrew install and auto-update                  |

Homebrew install:

```bash
brew install --cask cc-switch
```

Upgrade:

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux assets are available for both **x86_64** and **ARM64** (`aarch64`). Choose the file whose architecture tag matches your machine's `uname -m` output:

- `CC-Switch-v3.16.3-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.3-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended Format | Install Command                                                        |
| --------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Make executable and run directly, or use AUR                          |
| Other distributions / unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`             |

## [3.16.2] - 2026-06-07

> Following the v3.16.1 Codex stability patch, this release mainly broadens data portability and usage observability — adding S3-compatible cloud sync, OpenCode session usage sync, and an official-subscription quota template — while continuing to harden Codex's Chat Completions routing for third-party providers, fixing a batch of Windows / macOS platform issues, adding the CherryIN and ZenMux providers, and fully refreshing the trilingual user manual.

### Usage Guides

This release adds an S3 backend for cloud sync and more usage data sources. If you want to use them, start with these docs:

- **[Settings](/en/docs?section=getting-started&item=settings)**: configure cloud sync (WebDAV / S3-compatible storage) on the settings page to back up and restore providers, MCP, prompts, skills, and other config across multiple devices.
- **[Usage Statistics](/en/docs?section=proxy&item=usage)**: understand the Usage Dashboard's data sources (proxy logs, Codex / Gemini / OpenCode session sync) and how the statistics are counted.

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues.

### Overview

CC Switch v3.16.2 is a maintenance update following v3.16.1. After the previous release focused on the security of Codex official authentication and local routing takeover, this release concentrates on two things. First, broadening data portability and usage observability — adding S3-compatible cloud sync (a second cloud-backup backend alongside WebDAV), OpenCode session usage sync, and a quota-statistics template for official subscriptions. Second, continuing to polish the edges exposed when Codex routes third-party providers through Chat Completions — stream-truncation detection, `tool_choice` when tools is empty, custom-tool metadata, reasoning-token statistics, file / audio attachment conversion, and more.

This release also fixes a batch of local proxy robustness issues (ephemeral port resolution, the takeover placeholder restore loop, Anthropic `system` message normalization, the upstream 413 message, and Claude Desktop's `[1m]` model routing), addresses several Windows / macOS platform experience issues, adds the CherryIN and ZenMux providers, and fully refreshes the trilingual user manual.

### Highlights

- **S3-compatible cloud sync**: adds S3-compatible object storage as a second cloud-backup backend alongside WebDAV, with one-click presets for AWS S3, MinIO, Cloudflare R2, Alibaba Cloud OSS, Tencent Cloud COS, Huawei OBS, and more.
- **More usage data sources**: added OpenCode session usage sync, plus an official-subscription quota template for Claude / Codex / Gemini official providers (explicit toggle, off by default).
- **Continued Codex Chat Completions routing hardening**: fixed stream-truncation misdetection, `tool_choice` rejection when tools is empty, custom-tool metadata loss, and missing reasoning-token stats, and added file / audio attachment conversion plus a `/v1/models` reachability endpoint.
- **A more robust local proxy**: fixed ephemeral port (port 0) resolution, the takeover placeholder restore loop, Anthropic `system` message normalization, the upstream 413 message, and Claude Desktop 1M-context model routing.
- **Platform and providers**: fixed Windows tray / taskbar icons, subdirectory skill updates, and macOS input auto-capitalization, and added the CherryIN and ZenMux providers.

### Added

#### S3-Compatible Cloud Sync

Cloud Sync now supports S3-compatible object storage as a second backend alongside WebDAV, signing requests with a self-implemented AWS Signature V4 for the broadest possible compatibility. The settings page offers one-click presets for AWS S3, MinIO, Cloudflare R2, Alibaba Cloud OSS, Tencent Cloud COS, Huawei OBS, and a custom endpoint, with connection testing, manual upload / download, and auto-sync on configuration changes (the providers, endpoint, MCP, prompt, skill, settings, and proxy tables — **not** high-frequency data like usage logs). Enabling S3 sync disables a running WebDAV sync and vice versa (#1351).

#### OpenCode Session Usage Sync

Added OpenCode as a usage-statistics source that reads per-message token, cost, and model data from OpenCode's local SQLite database and imports it into the usage records, with a dedicated "OpenCode" app filter tab and an "OpenCode Session" data-source label. The database path respects `OPENCODE_DB` and `XDG_DATA_HOME` (defaulting to `~/.local/share/opencode` on all platforms), only finalized messages are imported, and the freshness check includes the WAL file so just-written sessions are not skipped (#3215).

#### Official Subscription Quota Template

Because some users were concerned that the IP issuing the usage query could differ from the IP issuing in-app requests, risking an account ban, the official-subscription usage template for Claude / Codex / Gemini official providers is now an explicit, opt-in template that queries plan quota via CLI / OAuth credentials, replacing the previous implicit auto-query for official providers. The template is off by default, is enabled from the usage-script modal, and supports a configurable refresh interval. When using this feature, enabling the proxy's TUN mode is recommended.

#### Text-Only Model Image Fallback Rectifier

Added a proxy rectifier that replaces Anthropic image blocks with an `[Unsupported Image]` placeholder when the routed model is text-only (declared, or detected by a built-in model-name heuristic) or the upstream rejects image input, so conversations are not interrupted. The settings page provides a toggle for this fallback, plus a separate toggle for the heuristic detection (which can be turned off to avoid misjudging multimodal models).

#### ZenMux Token Plan Provider

Added ZenMux as a Token Plan Coding Plan provider. You can manually enter its API key and base URL in the usage-script modal, and it renders used / quota in USD (#2709).

#### CherryIN Preset

Added the CherryIN aggregator gateway as a quick-config preset across all 7 managed apps — Claude Code / Claude Desktop / OpenClaw / Hermes use the Anthropic-format endpoint (open.cherryin.net), OpenCode uses `@ai-sdk/anthropic` (`/v1`), Codex uses the OpenAI-compatible endpoint, and Gemini CLI uses the Gemini-compatible endpoint — with the official brand icon, placed next to AiHubMix (#3643).

#### Codex CLI Reachability Endpoint `/v1/models`

The local proxy now responds to `GET /v1/models`, which Codex CLI probes at startup, returning the CC Switch-managed Codex model catalog. A stale-catalog guard was added: it parses the live `config.toml` and only serves the catalog when `model_catalog_json` still points at the CC Switch-owned catalog file, avoiding exposing a previous provider's leftover catalog to Codex (#3818).

#### Codex Chat File and Audio Attachments

Codex's Responses→Chat conversion now maps `input_file` parts (carrying `file_id` or inline `file_data`) and `input_audio` parts into their Chat Completions equivalents, and emits top-level `input_*` items that were previously dropped, so file and audio attachments reach Chat-only Codex upstreams.

### Changed

#### Usage Dashboard Hero Redesign

Rearranged the Usage Dashboard hero and summary cards into a more compact layout, consolidating the real-token total, request count, and cost into a single top row (#3426).

#### SSSAiCode Endpoint Refresh

Updated the SSSAiCode preset's website, signup, and API base URLs to the `sssaicodeapi.com` domain, and refreshed its candidate endpoint nodes (default `node-hk.sssaicodeapi.com`, plus `node-hk.sssaiapi.com` and `node-cf.sssaicodeapi.com`) across all 7 app presets.

### Fixed

#### Codex Chat Stream Truncation Detection

When a Chat Completions upstream ends a stream without a `finish_reason` or `[DONE]`, CC Switch no longer treats it as a normal completion: it finalizes normally only when the stream truly ended; emits an incomplete (`max_output_tokens`) response when partial output was produced; and emits a failed `stream_truncated` event when nothing was produced. Late-arriving reasoning is also backfilled onto still-active streaming tool calls.

#### Codex Chat `tool_choice` Without Tools

The Responses→Chat conversion now drops `tool_choice` and `parallel_tool_calls` when the final tools array is missing or empty (including when all tools are filtered out), avoiding 503/400 errors from strict OpenAI-compatible upstreams (vLLM, enterprise gateways) with "When using `tool_choice`, `tools` must be set." (#3640).

#### Codex Custom Tool Metadata Preserved

Custom Codex tools (such as the freeform `apply_patch` tool) now embed their full original definition — including format and grammar metadata — as a compact, order-stable JSON block in the generated Chat function description, instead of being replaced with a generic placeholder, so they remain usable on Chat Completions upstreams (#3644).

#### Codex Chat Usage Missing `reasoning_tokens`

The Chat→Responses usage conversion now always includes `output_tokens_details.reasoning_tokens` (defaulting to 0), even when a provider omits `completion_tokens_details` or returns a non-object, satisfying Codex CLI's strict requirement and avoiding repeated response-parse failures and retries (#3514).

#### Cross-Turn Reasoning for Codex Custom / Search Tools

The cross-turn reasoning cache in Codex Chat history now covers the full tool-call set (`function_call`, `custom_tool_call`, `tool_search_call`) and their outputs, not just plain function calls, so `apply_patch` and tool-search calls keep their own `reasoning_content` when restored via `previous_response_id`.

#### Ephemeral Port (port 0) Resolution

When the proxy is configured to listen on port 0 (OS-assigned), takeover now starts the proxy first to obtain the real port before writing live configs and the database, avoiding client URLs pointing at an invalid `:0` address; if no concrete port has been resolved yet, the Claude Desktop gateway URL is rejected outright.

#### Proxy Placeholder Backup / Restore Loop

If a previous proxy stop failed to restore the original live config and left proxy placeholders in live, taking over again no longer overwrites the good backup with the proxy config, and restore no longer writes the placeholder back to live: both paths detect the placeholder state and rebuild live from the current provider as the source of truth, fixing cases where the proxy toggle became a no-op and the client was pinned to the local proxy address (#3689).

#### Provider Switching Wrongly Blocked During Proxy Takeover

During local routing takeover, only providers explicitly classified as official are now blocked from switching, instead of also disabling custom providers whose endpoint lives in meta or whose fields are simply unfilled. The disabled "Enable" button now shows a lighter hint tooltip instead of the previous red "Blocked" badge.

#### localhost Listen Address Normalization

When saving the proxy with a listen address of `localhost`, it is now normalized to `127.0.0.1` before persisting, avoiding binding inconsistencies (#3016).

#### Anthropic `system` Message Normalization

For Anthropic-format providers, system-role entries inside the `messages` array are now collapsed and merged into the top-level `system` field (preserving original order and any existing top-level system), avoiding strict upstreams rejecting non-leading system messages; OpenAI Chat routing is unaffected (#3775).

#### Claude Desktop 1M-Context Model Routing

Claude Desktop appends a `[1m]` marker to the model name when the 1M-context beta is active (e.g. `claude-opus-4-8[1m]`). The proxy now strips that suffix before route matching so exact, alias, legacy, and role-keyword matching all resolve correctly, fixing `route_unknown` (HTTP 400) failures when switching to a 1M model mid-conversation; the original model name is still kept in the `route_unknown` error for diagnostics.

#### Codex 413 Error Message

When a Codex upstream gateway rejects an oversized request body with HTTP 413, the proxy now returns a dedicated message explaining that this is the provider's server-side body-size limit (not a CC Switch local limit), with actionable recovery steps (run `/compact`, remove large logs or inline images, or ask the provider to raise the limit), instead of echoing the upstream's raw HTML error page.

#### Proxy Panel Error Detail

When toggling proxy takeover fails, the proxy panel toast now includes the specific error detail returned by the backend, instead of only a generic failure message (#3656).

#### Copilot Infinite-Whitespace Threshold

Raised the streaming infinite-whitespace abort threshold from 20 to 500 consecutive whitespace characters, avoiding false aborts of legitimate tool calls whose arguments contain deeply indented code (Python, YAML, Rust, Markdown), while still catching the real Copilot infinite-whitespace bug (#2647).

#### Subscription Tier Tray Rendering

Via a unified tier-to-label mapping, fixed rendering of official subscription tiers in the tray and quota display: Claude / Codex no longer drop the 7-day window, Gemini Pro / Flash / Flash-Lite tiers no longer leak raw machine names, and multi-window plans (e.g. Opus + Sonnet) now show the worst utilization instead of the first match.

#### Inflated Claude Stream input_tokens

Some Anthropic-compatible streaming providers (e.g. Qwen, MiniMax) report the full context as `input_tokens` in `message_start`, double-counting the cached portion already reported separately and artificially lowering the displayed cache hit rate. The parser now prefers the smaller positive `input_tokens` from `message_delta` and adopts the paired cache counts from the same usage block; native Claude and OpenRouter-converted paths are unchanged.

#### Zhipu Quota Query Endpoint Routing

The Zhipu Coding Plan quota query was hard-coded to `api.z.ai`, so users on the mainland preset (`open.bigmodel.cn`) could not retrieve usage when the international endpoint was unreachable. The quota request now routes to the host matching the user's configured base URL (#3702).

#### MiniMax Balance API and Pricing

Adapted MiniMax Coding Plan quota to its new balance API (which returns remaining-percent fields instead of the usage counts the old parser relied on, which left tiers empty and the tray showing no usage), filtered out non-coding models (such as video), handled plans without a weekly limit, and added default pricing for the MiniMax M3 model (#3518).

#### GLM Coding Plan Endpoints and Model Fetch

Fixed the Zhipu / Z.AI GLM Coding Plan presets to the `/api/coding/paas/v4` endpoints (covering Codex, OpenCode, OpenClaw, Hermes), and made the model-list probe query `{base}/models` first for base URLs that already end in a `/v{N}` version segment (keeping `/v1/models` as a fallback), so the "Fetch models" button no longer 404s on versioned endpoints (#3524).

#### Codex Model Catalog Path Portability

Codex now writes only the relative filename `cc-switch-model-catalog.json` to `config.toml` instead of an absolute path (Codex CLI resolves it from the config directory), fixing the model catalog breaking on WSL and symlinked setups where the absolute path could not be translated (#3614).

#### APINebula's OpenCode SDK

The APINebula OpenCode preset now loads `@ai-sdk/openai-compatible` instead of `@ai-sdk/openai`, so requests use the OpenAI Chat Completions format the relay expects, rather than the Responses API that fails against chat-completions-only upstreams.

#### Windows Tray Icon Residue After Exit

On Windows, quitting CC Switch could leave a dead tray icon behind until the mouse passed over it. The app now explicitly removes the tray icon before exiting, so it disappears cleanly when the process ends (#3797).

#### Windows Taskbar Icon

Sets an explicit Windows AppUserModelID at runtime and writes the same ID and product icon onto the installer's desktop and start-menu shortcuts, so CC Switch shows the correct icon and groups properly in the taskbar (#3457).

#### Windows Update Check for Subdirectory Skills

When scanning installed skills on Windows, backslash path separators are now normalized to forward slashes, so skills nested in subdirectories (e.g. `skills/my-skill`) are matched by the update check instead of being silently skipped (#3430).

#### macOS Input Auto-Capitalization

Disabled autocomplete, autocorrect, autocapitalize, and spellcheck on the shared text Input component, so macOS no longer auto-capitalizes or auto-corrects the first letter typed into configuration fields (#3626).

#### Codex VS Code Session Previews

For Codex requests sent from VS Code, the session preview could show selection or open-file content instead of the real prompt when a markdown heading preceded the injected request. The backend title and frontend preview now both match the last "## My request for Codex:" heading (the IDE injects the real request as the final section), so the preview reflects the user's prompt (#3593).

#### VS Code Wording in the Chinese UI

Corrected the "Apply to Claude Code plugin" description in Simplified and Traditional Chinese to write "VS Code" properly instead of "Vscode", aligning with the English and Japanese strings (#3228).

### Documentation

#### User Manual Refresh

Refreshed the README localizations and the en / zh / ja user manuals to reflect all 7 managed apps (adding Claude Desktop and Hermes to the intro and overview copy), corrected the OpenCode config path to `~/.config/opencode/` (`opencode.json`), documented Hermes config files, updated the language docs to four languages, corrected per-app MCP / prompt / skill support, noted that export now produces a timestamped SQL backup that includes usage logs, and documented the pricing model-ID matching rules (#3411).

#### Codex Official Auth Preservation Guide

Added a Chinese / English / Japanese guide explaining how to keep Codex official remote control and official plugins working while routing model traffic to third-party APIs, and linked it from the v3.16.1 release notes.

#### README Links and Sponsor Markup

Updated the Release Notes links in each language README to v3.16.1, and fixed broken curly-quote characters in the README_ZH sponsor blocks so their HTML attributes render correctly (#3772).

### Upgrade Notes

#### S3 and WebDAV Cloud Sync Are Mutually Exclusive

Cloud Sync runs only one backend at a time. Enabling S3 auto-sync disables a running WebDAV auto-sync and vice versa. If you previously used WebDAV, make sure both ends are aligned before switching to S3, so you don't assume the old backend is still backing up.

#### Restart Codex After Editing Model Mappings

Codex reads `model_catalog_json` at startup. Even though this release rewrites the model catalog to a relative path and adds the `/v1/models` reachability endpoint, you still need to restart Codex after editing the model mapping table for the `/model` menu to refresh.

### Risk Notice

This release continues the risk notices from previous versions for reverse-proxy-style features.

**Codex OAuth reverse proxy**: using a ChatGPT subscription's Codex OAuth through a reverse proxy may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Codex third-party provider Chat routing**: when CC Switch local proxy converts and forwards Codex requests to third-party providers, each provider may have different requirements for billing, compliance, and data retention. Read the target provider's terms before use.

**Claude Desktop third-party provider proxy switching**: when CC Switch's built-in proxy gateway forwards Claude Desktop requests to third-party providers, you must also follow the target provider's billing, compliance, and data-retention terms.

By enabling these features, users accept the related risks. CC Switch is not responsible for account restrictions, warnings, or service suspensions caused by using these features.

### Thanks

Thanks to the following contributors for the features and fixes in v3.16.2:

- [#1351](https://github.com/farion1231/cc-switch/pull/1351): add S3-compatible cloud storage sync, thanks @keithyt06.
- [#3215](https://github.com/farion1231/cc-switch/pull/3215): add OpenCode session usage sync, thanks @nothingness0db.
- [#2709](https://github.com/farion1231/cc-switch/pull/2709): add the ZenMux Token Plan provider, thanks @Eter365.
- [#3643](https://github.com/farion1231/cc-switch/pull/3643): add the CherryIN preset provider, thanks @zhibisora.
- [#3818](https://github.com/farion1231/cc-switch/pull/3818): add the Codex CLI reachability `GET /v1/models` endpoint, thanks @CSberlin.
- [#3426](https://github.com/farion1231/cc-switch/pull/3426): Usage Dashboard hero redesign, thanks @allenxu09.
- [#3640](https://github.com/farion1231/cc-switch/pull/3640): drop `tool_choice` when tools is empty, thanks @Postroggy.
- [#3644](https://github.com/farion1231/cc-switch/pull/3644): preserve Codex custom tool metadata in chat routing, thanks @LanternCX.
- [#3514](https://github.com/farion1231/cc-switch/pull/3514): always include `reasoning_tokens` in Chat→Responses, thanks @yeeyzy.
- [#3689](https://github.com/farion1231/cc-switch/pull/3689): skip backup / restore when live is already a proxy placeholder, thanks @YongmaoLuo.
- [#3016](https://github.com/farion1231/cc-switch/pull/3016): normalize the localhost listen address, thanks @Alexlangl.
- [#3775](https://github.com/farion1231/cc-switch/pull/3775): normalize Anthropic `system` messages, thanks @Dearli666.
- [#3656](https://github.com/farion1231/cc-switch/pull/3656): improve error message display in the proxy panel, thanks @lzcndm.
- [#2647](https://github.com/farion1231/cc-switch/pull/2647): raise the infinite-whitespace threshold 20 → 500, thanks @NiuBlibing.
- [#3702](https://github.com/farion1231/cc-switch/pull/3702): route the Zhipu quota query to the configured base URL, thanks @YongmaoLuo.
- [#3518](https://github.com/farion1231/cc-switch/pull/3518): adapt to the MiniMax new balance API and default pricing, thanks @LaoYueHanNi.
- [#3524](https://github.com/farion1231/cc-switch/pull/3524): fix the Zhipu Coding Plan presets and model probing for versioned endpoints, thanks @makoMakoGo.
- [#3614](https://github.com/farion1231/cc-switch/pull/3614): use a relative filename for the model catalog, thanks @steponeerror.
- [#3797](https://github.com/farion1231/cc-switch/pull/3797): fix the Windows tray icon residue after exit, thanks @iAJue.
- [#3457](https://github.com/farion1231/cc-switch/pull/3457): fix the Windows taskbar icon, thanks @ZhangNanNan1018.
- [#3430](https://github.com/farion1231/cc-switch/pull/3430): normalize Windows path separators to match subdirectory skill updates, thanks @Ninthless.
- [#3626](https://github.com/farion1231/cc-switch/pull/3626): disable macOS input auto-capitalization, thanks @ZHLHZHU.
- [#3593](https://github.com/farion1231/cc-switch/pull/3593): fix Codex VS Code session previews, thanks @xwil1.
- [#3228](https://github.com/farion1231/cc-switch/pull/3228): align the VS Code wording in the Chinese UI, thanks @Games55k.
- [#3411](https://github.com/farion1231/cc-switch/pull/3411): refresh the user manual to reflect current app support, thanks @makoMakoGo.
- [#3772](https://github.com/farion1231/cc-switch/pull/3772): fix README release-note links and sponsor markup, thanks @null-easy.

Thanks also to everyone who reported Codex Chat routing, local proxy takeover, usage statistics, and platform compatibility issues after v3.16.1. Many of these fixes came directly from real-world reproduction details.

### Download & Install

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) and download the build for your system.

#### System Requirements

| System  | Minimum Version          | Architecture                        |
| ------- | ------------------------ | ----------------------------------- |
| Windows | Windows 10 and later     | x64                                 |
| macOS   | macOS 12 (Monterey)+     | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below          | x64 / ARM64                         |

#### Windows

| File                                     | Description                                      |
| ---------------------------------------- | ------------------------------------------------ |
| `CC-Switch-v3.16.2-Windows.msi`          | **Recommended** - MSI installer with auto-update |
| `CC-Switch-v3.16.2-Windows-Portable.zip` | Portable build, unzip and run                    |

#### macOS

| File                             | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.16.2-macOS.dmg`    | **Recommended** - DMG installer, drag to Applications |
| `CC-Switch-v3.16.2-macOS.zip`    | Unzip and drag to Applications, Universal Binary      |
| `CC-Switch-v3.16.2-macOS.tar.gz` | For Homebrew install and auto-update                  |

Homebrew install:

```bash
brew install --cask cc-switch
```

Upgrade:

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux assets are available for both **x86_64** and **ARM64** (`aarch64`). Choose the file whose architecture tag matches your machine's `uname -m` output:

- `CC-Switch-v3.16.2-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.2-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended Format | Install Command                                                        |
| --------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Make executable and run directly, or use AUR                          |
| Other distributions / unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`             |

## [3.16.1] - 2026-06-01

> Codex stability patch: because some users did not want CC Switch to change how Codex config files are written, Codex App Enhancements now has a switch and is off by default. After enabling it, you can keep using Codex mobile remote control, official plugins, and other official-app features while using third-party APIs; this release also includes a series of stability fixes.

### Usage Guides

If you want to unlock official-subscription-only Codex remote control and official plugins while using third-party APIs, or want to use DeepSeek / Kimi / GLM / MiniMax and other Chat Completions upstreams in Codex, start with these docs:

- **[Keep Codex remote control and official plugins while using third-party APIs](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-official-auth-preservation-guide-en.md)**: explains how to complete official login first, enable Codex App Enhancements, keep official login state in `auth.json`, and route model traffic to third-party APIs.
- **[Using DeepSeek in Codex: local routing hands-on guide](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-deepseek-routing-guide-en.md)**: walks through adding a Codex provider, enabling local routing, and verifying request forwarding.
- **[Add a Codex provider: Chat Completions routing and model mapping](/en/docs?section=providers&item=add)**: covers the "Needs Local Routing" option, model mapping table, and reasoning capability configuration.
- **[Local Proxy Service](/en/docs?section=proxy&item=service)** and **[Local Routing](/en/docs?section=proxy&item=routing)**: explain the proxy service, live-config takeover, and related risk notes.

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues.

### Overview

CC Switch v3.16.1 is a Codex stability patch following v3.16.0. v3.16.0 promoted third-party Codex providers to first-class citizens through Chat Completions routing; this release focuses on several high-risk edges discovered in real use: official ChatGPT / Codex OAuth login state could be overwritten while switching third-party providers or during local routing takeover, the Codex model catalog could be cleared during live backfill, hot switching, takeover shutdown restore, or editing the active provider, and Codex `tool_search`, plugin / connector namespace tools, and custom tools were not fully restored back into Responses events on the Chat Completions upstream path.

This release also hardens local routing takeover ownership checks. Provider switching and takeover toggles now run serially per app. When deciding whether the live files are proxy-managed, CC Switch no longer relies only on stale `enabled` state or whether the proxy service is currently running; it also checks backups and proxy placeholders in the live files. This prevents ordinary live writes from overwriting proxy-managed config immediately after takeover is enabled, while the proxy is temporarily stopped, or during hot switching.

### Highlights

- **Safer Codex OAuth and third-party provider switching**: added an optional official-auth preservation setting. When enabled, third-party provider tokens are written to `config.toml`, while official ChatGPT / Codex OAuth login stays in `auth.json`.
- **Codex model catalogs are no longer silently wiped**: `modelCatalog` now treats the database as the source of truth, avoiding overwrites from live configs with missing catalog projections during live backfill, provider switching, takeover shutdown restore, and provider editing.
- **Codex Chat tools / plugin routing restored**: `tool_search`, loaded namespace tools, and custom tools from Chat Completions upstreams are remapped back to Codex Responses shape; streaming custom tools now emit native `response.custom_tool_call_input.*` events.
- **More stable local routing takeover and hot switching**: provider switching and takeover toggles are serialized per app. Hot switching refreshes provider display information in Codex live config while keeping the endpoint pointed at the local proxy.
- **Diagnostics and platform compatibility fixes**: Codex proxy errors now include richer context; Codex CLI model-template discovery supports more platforms and falls back to a static GPT-5.5 template; Windows tool version detection fixes localized output and command quoting issues.

### Added

#### Codex Official Auth Preservation Setting

Added an optional setting for preserving official ChatGPT / Codex OAuth login state when switching to third-party Codex providers. When enabled, CC Switch stores third-party provider API keys in the provider-scoped `experimental_bearer_token` inside Codex `config.toml` instead of overwriting the official login cache in `auth.json`.

Because some users do not want this feature to change how config files are written, the setting is off by default and keeps the compatibility behavior from before v3.16.0. Users who need both official Codex login and third-party providers can manually enable it under Settings -> Codex App Enhancements.

#### Codex DeepSeek Routing Guide

Added Codex DeepSeek routing guides in Chinese, English, and Japanese, covering provider routing requirements, the DeepSeek Codex provider form, and screenshot-based local routing takeover instructions.

### Changed

#### Codex Auth Preservation Is Now Opt-In

Official auth preservation is off by default. Third-party Codex provider switching therefore keeps the old behavior unless the user opts in, avoiding surprise changes to how `auth.json` / `config.toml` are written.

#### Codex Restart Prompt After Provider Switching

Codex loads the model catalog and part of its config at startup. After successfully switching a Codex provider, the UI now reminds the user to restart Codex so model catalog and config changes actually take effect.

#### Provider Switching and Takeover Toggles Are Serialized

Codex / Claude / Gemini provider switching and local routing takeover toggles now share a per-app lock, avoiding concurrent writes to live config and backups. Ownership checks also prioritize live backups and the `PROXY_MANAGED` placeholder instead of relying only on whether the proxy service is running.

#### Codex Hot Switching Refreshes Display Info

When hot switching Codex providers during local routing takeover, CC Switch refreshes the provider id, model, and display name in the live config so the Codex client menu follows the active provider. The base URL still stays pointed at the local proxy, preventing the real upstream endpoint from leaking back into the live file.

### Fixed

#### Codex Provider Editor Showing Live OAuth During Takeover

When Codex is under local routing takeover, live `auth.json` / `config.toml` are temporarily rewritten by the proxy. Editing the active provider from those live files could incorrectly show proxy placeholders or official OAuth login as provider config. The editor now explicitly explains that it is showing the provider config stored in the database, not the proxy-managed live files; even if the proxy service is temporarily stopped, CC Switch still treats the app as under takeover when the takeover state indicates so.

#### Codex OAuth Cleared or Overwritten During Takeover

Fixed multiple preserve-mode takeover paths that could clear or overwrite official ChatGPT / Codex OAuth `auth.json`. Takeover detection now recognizes `PROXY_MANAGED` in `config.toml`, cleanup only removes proxy placeholder tokens, and third-party providers misclassified as official no longer enter the official-auth overwrite path. Provider sync and switching also treat live backups and placeholders as takeover ownership signals, preventing normal live writes from overwriting proxy config right after takeover or while the proxy is paused.

#### Codex Model Catalog Data Loss

Fixed cases where `modelCatalog` could be cleared during live backfill, active-provider editing, provider switching, and takeover shutdown restore. Snapshot backups preserve existing `model_catalog_json` pointers; backups rebuilt from providers regenerate catalog projections from the database source of truth; editing the active provider now prefers the database model catalog instead of trusting a live reverse-parse result that may have lost its projection.

Provider switching also now always refreshes the generated Codex model catalog JSON ([#3360](https://github.com/farion1231/cc-switch/pull/3360), thanks [@Postroggy](https://github.com/Postroggy)).

#### Codex Chat Tools, Plugins, and Custom Tools Restored

Fixed Chat Completions routing for third-party Codex providers so `tool_search`, loaded MCP / connector namespace tools, and custom tools are fully restored back into Codex Responses shape. Non-streaming and streaming Chat responses now recover the correct tool type, namespace, call id, and arguments from the original Responses request; custom-tool streaming now emits native `response.custom_tool_call_input.delta` and `response.custom_tool_call_input.done` events.

#### Fuller Codex Proxy Error Diagnostics

When Codex forwarding fails, CC Switch now returns JSON errors that include provider, model, endpoint, upstream HTTP status, stable `cc_switch_*` error codes, and normalized HTTP status. This makes it much clearer which provider, endpoint, and upstream error caused the failure.

#### Codex Native Balance / Coding Plan Credential Lookup

Fixed native balance and Coding Plan queries using credentials from the wrong app. Each app now resolves its own provider credentials instead of carrying authentication assumptions from another app surface into the query flow ([#3355](https://github.com/farion1231/cc-switch/pull/3355), thanks [@SiskonEmilia](https://github.com/SiskonEmilia)).

#### Codex CLI Discovery and Model Catalog Template Fallback

Fixed a too-narrow Codex CLI discovery path for third-party Codex model catalog projection. The backend now searches common Codex CLI install locations across platforms, and falls back to a built-in GPT-5.5 model catalog template if no template can be found ([#3382](https://github.com/farion1231/cc-switch/pull/3382), thanks [@chofuhoyu](https://github.com/chofuhoyu)).

#### Claude Desktop Official Provider Add Failure

Fixed an error when adding the Claude Desktop Official provider ([#3405](https://github.com/farion1231/cc-switch/pull/3405), thanks [@Eunknight](https://github.com/Eunknight)).

#### Kimi / Moonshot Tool-Thinking History Normalization

Added Kimi / Moonshot to the Anthropic-compatible tool-thinking history normalizer. Later turns can now correctly replay reasoning and tool-call context, avoiding failures caused by history messages that do not match upstream requirements ([#3377](https://github.com/farion1231/cc-switch/pull/3377), thanks [@Neon-Wang](https://github.com/Neon-Wang)).

#### Windows Tool Version Detection

Fixed incorrect quoting for `.cmd` / `.bat` version commands on Windows, and fixed localized command output being decoded as mojibake. Previously, these issues could make runnable tools appear as "installed but not runnable."

### Upgrade Notes

#### Official OAuth Preservation Must Be Enabled Manually

If you want official ChatGPT / Codex OAuth login to stay in `auth.json` while you frequently switch third-party Codex providers, enable Codex official auth preservation in Settings. It is off by default to keep compatibility for existing users.

#### Restart Codex After Editing Model Mappings

Codex reads `model_catalog_json` at startup. Even though v3.16.1 fixes model catalog wiping, Codex still needs to be restarted after you edit the model mapping table so the `/model` menu refreshes.

#### During Takeover, the Editor Shows Stored Config, Not Live Files

When local routing takeover is enabled, live `auth.json` / `config.toml` temporarily point to the CC Switch proxy. The provider editor therefore shows the provider config saved in the database. This is expected; after takeover is disabled, CC Switch restores live config from backups or the database source of truth.

### Risk Notice

This release continues the risk notices from previous versions for reverse-proxy-style features.

**Codex OAuth reverse proxy**: using a ChatGPT subscription's Codex OAuth through a reverse proxy may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Codex third-party provider Chat routing**: when CC Switch local proxy converts and forwards Codex requests to third-party providers, each provider may have different requirements for billing, compliance, and data retention. Read the target provider's terms before use.

**Claude Desktop third-party provider proxy switching**: when CC Switch's built-in proxy gateway forwards Claude Desktop requests to third-party providers, you must also follow the target provider's billing, compliance, and data-retention terms.

By enabling these features, users accept the related risks. CC Switch is not responsible for account restrictions, warnings, or service suspensions caused by using these features.

### Thanks

Thanks to the following contributors for fixes in v3.16.1:

- [#3360](https://github.com/farion1231/cc-switch/pull/3360): always update Codex model catalog JSON when switching providers, thanks [@Postroggy](https://github.com/Postroggy).
- [#3355](https://github.com/farion1231/cc-switch/pull/3355): resolve native balance / Coding Plan credentials per app, thanks [@SiskonEmilia](https://github.com/SiskonEmilia).
- [#3405](https://github.com/farion1231/cc-switch/pull/3405): fix Claude Desktop Official provider add failure, thanks [@Eunknight](https://github.com/Eunknight).
- [#3382](https://github.com/farion1231/cc-switch/pull/3382): Codex CLI multi-platform discovery and GPT-5.5 model template fallback, thanks [@chofuhoyu](https://github.com/chofuhoyu).
- [#3377](https://github.com/farion1231/cc-switch/pull/3377): Kimi / Moonshot tool-thinking history normalization, thanks [@Neon-Wang](https://github.com/Neon-Wang).

Thanks also to everyone who reported Codex OAuth, model catalog, local routing takeover, and Chat Completions tool-call issues after v3.16.0. Many of these fixes came directly from real-world reproduction details.

### Download & Install

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) and download the build for your system.

#### System Requirements

| System  | Minimum Version          | Architecture                        |
| ------- | ------------------------ | ----------------------------------- |
| Windows | Windows 10 and later     | x64                                 |
| macOS   | macOS 12 (Monterey)+     | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below          | x64 / ARM64                         |

#### Windows

| File                                     | Description                                     |
| ---------------------------------------- | ----------------------------------------------- |
| `CC-Switch-v3.16.1-Windows.msi`          | **Recommended** - MSI installer with auto-update |
| `CC-Switch-v3.16.1-Windows-Portable.zip` | Portable build, unzip and run                   |

#### macOS

| File                             | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.16.1-macOS.dmg`    | **Recommended** - DMG installer, drag to Applications |
| `CC-Switch-v3.16.1-macOS.zip`    | Unzip and drag to Applications, Universal Binary      |
| `CC-Switch-v3.16.1-macOS.tar.gz` | For Homebrew install and auto-update                  |

Homebrew install:

```bash
brew install --cask cc-switch
```

Upgrade:

```bash
brew upgrade --cask cc-switch
```

#### Linux

Linux assets are available for both **x86_64** and **ARM64** (`aarch64`). Choose the file whose architecture tag matches your machine's `uname -m` output:

- `CC-Switch-v3.16.1-Linux-x86_64.AppImage` / `.deb` / `.rpm`
- `CC-Switch-v3.16.1-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                             | Recommended Format | Install Command                                                        |
| ---------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS  | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux     | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                 | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                     | `.AppImage`        | Make executable and run directly, or use AUR                           |
| Other distributions / unsure             | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.16.0] - 2026-05-29

> Chat Completions → Responses format conversion for Codex (you can now use DeepSeek, Kimi, GLM in Codex!), unified Codex provider identity and history, an all-around upgraded app management surface, partner preset expansion, default model / pricing matrix upgraded to GPT-5.5 and Claude Opus 4.8, and proxy / format-conversion robustness hardening

### Usage Guide

The two headline capabilities in this release are **Codex third-party provider Chat Completions routing** and **in-app managed CLI tool management**. If you want providers that only speak the OpenAI Chat protocol (DeepSeek, Kimi, MiniMax, etc.) to work directly in Codex, or want to install / upgrade CLI tools from one place inside the app, start with these guides:

- **[Using DeepSeek in Codex: local routing hands-on guide](https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-deepseek-routing-guide-en.md)** — uses the built-in DeepSeek preset to walk through adding a Codex provider, enabling local routing, and verifying request forwarding.
- **[Add a Codex provider: Chat Completions routing and model mapping](/en/docs?section=providers&item=add)** — covers the "Needs Local Routing" toggle, the model mapping table, and reasoning (thinking) auto-detection.
- **[Settings → About: managed CLI tool management](/en/docs?section=getting-started&item=settings)** — covers version detection, per-tool / update-all upgrades, conflict diagnostics, and source-anchored upgrade commands.

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Multiple imposter websites have recently been spotted impersonating CC Switch to solicit payments and harvest account credentials, with some users already reporting financial losses. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues so we can take down the imposter site as quickly as possible.

### Overview

CC Switch v3.16.0's development since v3.15.0 centers on **promoting third-party Codex providers to first-class citizens through Chat Completions routing**. Codex natively only speaks the OpenAI Responses API and GPT-family models; this release lets CC Switch's local proxy convert Codex's outgoing Responses requests into Chat Completions and rebuild the JSON and SSE streaming responses back into Responses shape, preserving `reasoning_content` / inline `<think>` blocks / streamed reasoning summaries / tool calls / `previous_response_id` follow-ups along the way, normalizing error envelopes, and probing Chat-format providers correctly in Stream Check. It ships 22 Chat-routing presets with explicit model catalogs (DeepSeek, Zhipu GLM, Kimi, MiniMax, StepFun, Baidu Qianfan, Bailian, ModelScope, Longcat, BaiLing, Xiaomi MiMo, Volcengine Agentplan, BytePlus, DouBao Seed, SiliconFlow, Novita AI, Nvidia, and more).

Codex third-party providers' **identity and history** are unified and hardened this release: all third-party providers now normalize to the stable `custom` model-provider bucket, with a one-shot device migration that rewrites historical JSONL sessions and the `state_5.sqlite` threads table (originals backed up under `~/.cc-switch/backups/`), preventing past sessions from appearing to vanish when provider ids change. It also fixes OAuth login state, user-selected catalog models, and user-authored provider ids being overwritten during live reads / switches.

This release also adds an **in-app managed CLI tool lifecycle**: the Settings / About tab becomes a tool management panel for Claude / Codex / Gemini / OpenCode / OpenClaw / Hermes, with silent install / update, update-all, conflict diagnostics, source-aware anchored upgrades, WSL handling, and visible "installed but not runnable" states.

The provider ecosystem and model matrix are refreshed in tandem: added APIKEY.FUN, APINebula, AtlasCloud, SudoCode, Xiaomi MiMo Token Plan, and Claude Desktop Official presets; refreshed partner links and default models / pricing across apps; upgraded the default Claude Opus line to **4.8** and GPT defaults to **5.5** where applicable. Plus extensive polish and fixes across usage observability, Traditional Chinese localization, docs, and proxy / format-conversion robustness.

### Highlights

- **Codex Chat Completions routing**: Codex providers can now be served by OpenAI-compatible Chat Completions upstreams. CC Switch converts Codex Responses requests into Chat Completions, rebuilds JSON and SSE responses back into Responses shape, preserves reasoning / `<think>` / tool-call state, normalizes error envelopes, and probes Chat-format providers correctly in Stream Check.
- **Codex third-party provider state is unified and safer**: third-party Codex providers now share the stable `custom` model-provider bucket, with a one-shot migration for historical JSONL sessions and `state_5.sqlite` threads, plus fixes that preserve OAuth login state, user-selected catalog models, and user-authored provider ids during live reads / switches.
- **Managed CLI tool management**: the About page is now a tool management panel for Claude, Codex, Gemini, OpenCode, OpenClaw, and Hermes, with install / update actions, update-all, conflict diagnostics, source-aware anchored upgrades, WSL handling, and visible "installed but not runnable" states.
- **Provider ecosystem and model matrix refresh**: added APIKEY.FUN, APINebula, AtlasCloud, SudoCode, Xiaomi MiMo Token Plan, and Claude Desktop Official presets; refreshed partner links and default models / pricing across apps; upgraded the default Claude Opus model line to 4.8 and GPT defaults to 5.5 where applicable.
- **Usage and docs polish**: Usage Dashboard updates now react immediately when logs are written, custom usage-script summaries and subagent session-log accounting were fixed, Traditional Chinese UI localization landed, and a German README plus expanded Claude Desktop / Codex Chat / tool-management manuals were added.
- **Proxy and conversion hardening**: fixed Codex Chat reasoning / cache / usage edge cases, DeepSeek Anthropic tool-thinking history, Claude-compatible empty `tool_calls` streams, managed-account takeover auth, MiMo reasoning output, Gemini Native tool-call replay, and several panic-prone proxy paths.

### Added

#### Codex Chat Completions Routing

Codex providers can now be served by upstreams that only speak the OpenAI Chat Completions API. CC Switch's local proxy converts Codex's outgoing Responses requests into Chat Completions and rebuilds the Chat response (both JSON and SSE) back into Responses shape, preserving `reasoning_content`, inline `<think>` blocks, streamed reasoning summaries, tool calls, and `previous_response_id` follow-ups. A bounded Codex Chat history cache restores tool calls before their tool outputs.

> 💡 Special thanks to [@EldenPdx](https://github.com/EldenPdx) for PR [#2804](https://github.com/farion1231/cc-switch/pull/2804): this feature's Chat ↔ Responses format conversion references the implementation in his PR.

#### 22 Codex Third-Party Provider Presets with Chat Routing

Enabled Chat Completions routing with explicit model catalogs for major Chinese/Asian providers — DeepSeek, Zhipu GLM (+ en), Kimi, MiniMax (+ en), StepFun (+ en), Baidu Qianfan Coding Plan, Bailian, ModelScope, Longcat, BaiLing, Xiaomi MiMo (+ Token Plan), Volcengine Agentplan, BytePlus, DouBao Seed, SiliconFlow (+ en), Novita AI, and Nvidia. Each preset declares its context window so the UI can size the model-mapping rows.

#### Codex Model Mapping Table

Codex provider forms now expose a model catalog (model + display name + context window per row) that is the single source of truth for the upstream model list, projected to `~/.codex/cc-switch-model-catalog.json`.

#### Codex Chat Providers in Stream Check

Stream Check now probes Chat-format Codex providers against `/chat/completions` with a Chat-shaped body instead of `/v1/responses`, and aligns its URL fallback order with the production `CodexAdapter` (origin-only base URLs hit `/v1/<endpoint>` first) so a non-404 error on the bare path no longer flags a working provider as down.

#### Codex Chat Reasoning Auto-Detection

When a Codex provider is served through Chat Completions routing, CC Switch now auto-detects the upstream's reasoning interface from its name, base URL, and model — injecting the correct thinking parameter (`thinking:{type}`, `enable_thinking`, `reasoning_split`, top-level `reasoning_effort`, or OpenRouter's native `reasoning:{effort}` object) with no manual setup. Aggregator/hosting platforms (OpenRouter, SiliconFlow) are matched platform-first, since the same model can expose different reasoning controls on different platforms. Providers that only expose a thinking on/off switch (Kimi, GLM, Qwen, MiniMax, MiMo, SiliconFlow) drop the effort _level_ instead of forwarding an unsupported field — so changing Codex's reasoning effort has no effect for them — while providers with real effort tiers (DeepSeek, OpenRouter, and StepFun's `step-3.5-flash-2603` only) pass the level through. OpenRouter specifically uses the native `reasoning:{effort}` object, clamps `max` to `xhigh` (its enum has no `max`), and forwards an explicit `effort:"none"` so reasoning can be turned off.

#### Codex Goal Mode and Remote Compaction Controls

Codex config editing now exposes a Goal Mode toggle and a Remote Compaction toggle for third-party providers; new Codex templates default to `disable_response_storage = true` while still allowing explicit goal support.

#### Xiaomi MiMo Token Plan Presets

Added Xiaomi MiMo Token Plan presets with specs aligned to the official documentation (#2803, thanks @BlueOcean223).

#### Claude Desktop Official Preset

Added a Claude Desktop Official preset that restores the native Claude Desktop login, plus a localized Claude Desktop user guide (en / zh / ja).

#### Managed CLI Tool Lifecycle

Added silent install / update commands for managed CLI tools, latest-version checks, per-tool and batch actions, update-all, and diagnostics for multiple installations across PATH, Homebrew, npm, pnpm, bun, volta, fnm, nvm, scoop, WinGet, Windows native paths, and WSL.

#### Source-Aware Tool Diagnostics

The Settings / About surface can now diagnose conflicting tool installations, show the concrete install source and version for each path, and generate backend-planned upgrade commands anchored to the actual installation source.

#### Real-Time Usage Refresh

The backend now emits `usage-log-recorded` when proxy logs, session-log syncs, or rollups write usage data; Usage Dashboard listens for that event and invalidates its queries immediately instead of waiting for the next polling interval (#3027, thanks @in30mn1a).

#### Traditional Chinese Localization

Added `zh-TW` UI localization and a settings language option (#3093, thanks @LaiYueTing).

#### German README

Added `README_DE.md` and linked it from the existing README language switchers (#2994, thanks @flitzrrr).

#### New Partner Presets

Added APIKEY.FUN, APINebula, AtlasCloud, and SudoCode partner presets across the supported app surfaces, with partner copy, icons, and README entries.

### Changed

#### Codex Third-Party Providers Unified into a "custom" History Bucket

Codex filters resume history by `model_provider`, so switching between provider-specific ids made past sessions appear to vanish. All third-party providers now normalize to a single stable `custom` bucket (reserved built-in ids like `openai` / `ollama` are preserved), with a one-shot device migration that rewrites historical JSONL sessions and the `state_5.sqlite` threads table and backs up originals under `~/.cc-switch/backups/codex-history-provider-migration-v1/`.

#### Codex Provider Form Simplified

Removed the API Format selector from the Codex form (`wire_api` is always `responses`, so the selector misleadingly implied a protocol change); the model mapping table is now the only source of truth with no hidden default entries, and the form notes that a Codex restart is required after catalog changes since `model_catalog_json` is loaded at startup. Only the "Needs Local Routing" toggle remains.

#### Codex Local Routing Toggle Hints Rewritten

Reframed the OFF / ON hints as action guidance (when to enable) rather than scenario descriptions, synced across zh / en / ja.

#### Codex Live Config Preservation

Live Codex config reads no longer force-rewrite a user's `model_provider` field, and provider-scoped `experimental_bearer_token` handling now preserves OAuth login state when switching between third-party providers.

#### Tool Install / Upgrade Strategy

Managed tool installation now prefers official native installers where available, falls back to package managers when appropriate, runs self-update first for compatible tools, anchors upgrades to the detected install source, and locks duplicate batch actions while work is in flight.

#### About Page Becomes Tool Management

The About settings page now presents installed / latest versions, install and update actions, conflict diagnostics, WSL shell preferences, and clearer status for broken or unrunnable tools.

#### Default Models and Pricing Refreshed

Upgraded the default Claude Opus model to 4.8, moved GPT-based presets and templates to GPT-5.5 where applicable, refreshed pricing seeds, aligned Claude Desktop model mapping with Claude Code's three-role tiers, and renamed the OpenCode Go preset to drop a stale model suffix.

#### Partner Links Refreshed

Updated ShengSuanYun referral links, Atlas Cloud UTM links, and partner copy across README locales and provider metadata.

#### Homebrew Official Cask Installation

Installation simplified to `brew install --cask cc-switch` now that CC Switch is in the official Homebrew repository; the personal-tap requirement was removed from all READMEs.

#### Shared Frontend Utilities

Replaced JSON stringify / parse deep-copy patterns with a shared `deepClone` helper and extracted a shared `useTauriEvent` hook (#3140, thanks @ChongBiaoZhang).

### Fixed

#### Codex Chat Error Responses Converted to Responses Envelope

The Codex Chat-to-Responses bridge previously passed upstream error bodies through untouched, leaving Codex clients unable to recognize MiniMax `base_resp`, raw OpenAI Chat errors, or plain-text / HTML error pages. Errors are now regularized into the standard `{error: {message, type, code, param}}` envelope with the original HTTP status preserved; non-JSON bodies are wrapped and truncated to 1KB at a UTF-8 char boundary. Also fixed a pre-existing append-vs-insert bug that emitted a duplicate `Content-Type` header on rewritten JSON bodies.

#### Codex Mid-Stream System Messages Collapsed

MiniMax's OpenAI-compatible endpoint strict-rejects any non-leading `system` message (error 2013). All `system` fragments are now collapsed into a single leading message (joined in original order), losslessly for permissive backends too.

#### Codex Model Catalog Wiped After Restart

Editing the active Codex provider triggered a live read that omitted `modelCatalog`, so a subsequent save silently destroyed user-configured model mappings. Live reads now reverse-parse the on-disk catalog projection to round-trip the same shape the save path writes.

#### Codex Model Catalog Infinite Render Loop

Broke a bidirectional sync cycle between the catalog table and its parent state that caused severe UI jittering when adding or editing entries.

#### Codex Chat Preserves User-Selected Catalog Model

A model the client selects from the catalog (e.g. via `/model`) is no longer overwritten by `config.toml`'s default model.

#### Codex Chat Reasoning and Cache Stability

Restored a unique call-id fallback when Codex omits or rewrites `previous_response_id`, stopped deriving cache identity from `previous_response_id`, and canonicalized parseable JSON string payloads in tool conversions for stable prefix-cache reuse.

#### Codex Chat Streaming Usage Recovered

The Responses-to-Chat conversion now injects `stream_options.include_usage` (merging into any client-provided `stream_options`) when a request is streaming, so OpenAI-compatible upstreams like Kimi and MiniMax emit the trailing usage chunk again. Previously their streamed token / cost / cache stats were recorded as zero on the Codex Chat path.

#### Codex Chat Tool-Call Reasoning Backfill

Thinking models like Kimi/Moonshot and DeepSeek reject an assistant message that carries `tool_calls` without a non-empty `reasoning_content`. When cross-turn history recovery misses (proxy restart, ambiguous `call_id`, or a turn with no upstream reasoning), a placeholder `reasoning_content` is now backfilled in a final pass — genuine trailing reasoning still attaches first — so the request no longer fails with `reasoning_content is missing in assistant tool call message`.

#### Managed-Account Claude Takeover Auth

Managed-account providers (GitHub Copilot / Codex OAuth) now drop token env keys and write only the `ANTHROPIC_API_KEY` placeholder when taking over Claude Live config, with an outbound guard that refuses to send the `PROXY_MANAGED` placeholder upstream.

#### Claude Desktop Profile Sync During Takeover

Claude Desktop profile data is now synced during proxy takeover, model routes align with the Claude Code three-role tiers, and the Cowork egress profile has been corrected (#3157, #3172, thanks @MelorTang, @JGSphaela).

#### Managed-Account Takeover Model Fields

Local Routing now sources takeover model fields from the target provider on managed accounts instead of carrying stale model values.

#### DeepSeek Anthropic Tool Thinking History

Normalized DeepSeek Anthropic-compatible tool-thinking history so later turns can replay reasoning / tool-call context without malformed messages (#3203, thanks @Q3yp).

#### Claude-Compatible Empty Tool Calls in Streams

Fixed a Claude-compatible streaming edge case where an empty `tool_calls` array reset block state and broke streamed responses (#2915, thanks @zhizhuowq).

#### MiMo Reasoning for Claude Code Proxy

Added MiMo `reasoning_content` support on the Claude Code proxy path (#2990, thanks @zhangyapu1).

#### Gemini Native Tool-Call Robustness

Fixed `functionResponse.name` resolution (422) and `thought_signature` replay (400) for synthesized tool-call IDs in long multi-turn sessions (#2814, thanks @Tiancrimson).

#### Session Log Subagent Token Accounting

`collect_jsonl_files()` now scans subagent JSONL logs that were previously missed, so subagent token usage is counted in session cost (session-log mode only) (#2821, thanks @LaoYueHanNi).

#### Usage Dashboard / Sync Stability

Fixed a Codex usage-sync panic on non-ASCII model names, custom usage-script summaries, and missing real-time refresh after usage rollups (#3027, #3129, thanks @in30mn1a, @hanhan3344).

#### ZhiPu Coding-Plan Quota Tier Ordering

When the 5-hour bucket is at 0% utilization, ZhiPu's API omits `nextResetTime`; the old `i64::MAX` sentinel sorted those entries last, letting the weekly bucket incorrectly claim the five-hour slot. Tiers now sort so a missing `nextResetTime` maps to the five-hour bucket, so tray and usage quota display stays correct for ZhiPu coding plans.

#### Skills Install by Key

Installing from skills.sh search results now uses the unique key instead of the directory name, so skills that share a directory name install the correct one (#2784, thanks @zhaomoran); also fixed a skill sync copy fallback (#2791, thanks @rogerdigital).

#### Usage Price Input Precision

Reduced the price input step to 0.0001 so sub-cent costs like DeepSeek cache reads can be entered (#2793, closes #2503, thanks @rogerdigital).

#### Ghostty Clean Window Launch

Ghostty now opens a single clean window instead of cloning existing tabs, and other terminals open a new window via `open -na` (#2801, closes #2798, thanks @luw2007).

#### Tool Version and Update Reliability

Version probing no longer masks unrunnable installs, prerelease tools are handled correctly in version checks, batch updates run per tool, install / update buttons stay locked during preflight, anchored upgrade branches enforce absolute paths, and WSL installer paths use native Unix installers when needed.

#### Codex mise Detection

Fixed Codex mise environment detection (#2822, thanks @iambinlin).

#### Codex Archived Sessions

Codex archived sessions are now included in session discovery (#2861, thanks @nanmen2).

#### Codex Chat Empty Tool Arguments

Empty tool-call argument payloads are coerced to `{}` during Codex Chat conversion so upstreams and clients receive valid JSON.

#### Claude Provider Deeplink Imports

Importing Claude providers through deeplinks now preserves custom environment fields (#2928, thanks @doutuifei).

#### OMO Recommended Models

Synced OMO recommended models with upstream defaults and improved Fill Recommended feedback.

#### ShengSuanYun Model IDs Prefixed for Routing

ShengSuanYun (胜算云) presets now carry the vendor prefixes the upstream gateway requires — `anthropic/…`, `google/…`, and `openai/…` (e.g. `anthropic/claude-sonnet-4.6`, `google/gemini-3.1-pro-preview`) — across the Claude Code, Claude Desktop, Codex, Gemini, OpenCode, and OpenClaw presets, including the Claude Code routing env (`ANTHROPIC_MODEL` / `ANTHROPIC_DEFAULT_{HAIKU,SONNET,OPUS}_MODEL`), so they resolve to valid upstream models instead of failing to route.

#### ClaudeAPI Model Test Re-Enabled

Reclassified the ClaudeAPI preset (Claude Code and Claude Desktop) from `third_party` to `aggregator` so its model test button is no longer disabled by the third-party Claude gate; the partner star is unaffected since it is driven by `isPartner`, not category.

#### About Version Check

Version checks now handle prerelease tool versions without misclassifying update state.

#### App Switcher Text Clipping

Removed a fixed width constraint that clipped app-switcher text (#3161, thanks @loocor).

#### useEffect Race Condition

Added an active-flag pattern to App.tsx effects to prevent listener leaks on unmount, and guarded against storing `undefined` language in localStorage (#2827, thanks @Zylo206).

### Removed

#### LionCC Sponsor and Presets

Removed the LionCC sponsor entry and LionCCAPI presets across READMEs, provider configs, and locales (icon asset retained).

#### AICoding Partner Entry

Removed the AICoding partner from README sponsor listings, provider presets, and i18n metadata.

#### Kimi For Coding Codex Preset

Removed the Kimi For Coding preset from the Codex preset catalog.

#### CLI Uninstall Command Hints

Dropped generated CLI uninstall command hints from the tool-management UI while keeping conflict diagnostics visible.

### Docs

#### Codex Chat Provider Support

Documented Chat Completions routing, provider support, reasoning auto-detection, and Local Routing guidance in the changelog and user manual.

#### Settings Manual Refresh

Updated settings documentation for the new managed tool lifecycle and Hermes installer behavior.

#### Claude Desktop Guide

Added localized Claude Desktop guide pages and screenshots for provider setup, import, model mapping, and Local Routing context.

#### Installation Docs

Updated installation docs and READMEs to recommend the official Homebrew cask and refreshed the v3.15.0 release-note imposter-site warning wording across locales.

### ⚠️ Upgrade Notes

#### One-Shot Codex History Migration

The first launch after upgrading runs a one-shot migration of Codex history: third-party providers are normalized into the `custom` bucket and historical JSONL sessions plus the `state_5.sqlite` threads table are rewritten. Originals are backed up under `~/.cc-switch/backups/codex-history-provider-migration-v1/`. This step fixes the "past sessions vanish after switching provider" problem — history resumes correctly after the migration.

#### Codex Catalog Changes Require a Restart

Codex loads `model_catalog_json` at startup, so after editing the model mapping table in CC Switch you must **restart Codex** for the new catalog to take effect.

#### Reasoning Effort May Have No Effect for Chat-Routing Providers

For providers that only expose a thinking on/off switch (Kimi, GLM, Qwen, MiniMax, MiMo, SiliconFlow), changing the reasoning effort in Codex (`model_reasoning_effort`: low / medium / high) **has no effect** — CC Switch will not forward an unsupported effort field to them. Only providers with real effort tiers (DeepSeek, OpenRouter, and StepFun's `step-3.5-flash-2603` only) actually honor the level.

#### Default Models Upgraded to Opus 4.8 / GPT-5.5

The default Claude Opus model line is upgraded to 4.8 and GPT defaults to 5.5 where applicable. If you rely on a pinned older default model, check the model fields of the relevant presets / templates after upgrading.

### ⚠️ Risk Notice

This release inherits the risk notices originally introduced in v3.12.3 / v3.13.0 / v3.15.0 for reverse-proxy-style features.

**GitHub Copilot Reverse Proxy**: Using Copilot's reverse-proxy path may violate GitHub / Microsoft's terms of service. See the [v3.12.3 release notes](v3.12.3-en.md#️-risk-notice) for details.

**Codex OAuth Reverse Proxy**: Using the Codex OAuth reverse proxy with a ChatGPT subscription may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Codex Third-Party Provider Chat Routing**: Converting and forwarding Codex requests through CC Switch's local proxy to a third-party provider exposes those requests to that provider's billing, compliance, and data-retention policies — read the target provider's terms of service before using.

**Claude Desktop Third-Party Provider Switching via Proxy Gateway**: Routing Claude Desktop traffic through CC Switch's in-app proxy gateway to a third-party provider exposes those requests to that provider's billing, compliance, and data-retention policies — read the target provider's terms of service before using.

By enabling these features, users **accept all associated risks**. CC Switch is not responsible for any account restrictions, warnings, or service suspensions that result from using these features.

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| OS      | Minimum Version              | Architecture                        |
| ------- | ---------------------------- | ----------------------------------- |
| Windows | Windows 10 or later          | x64                                 |
| macOS   | macOS 12 (Monterey) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below              | x64 / ARM64                         |

#### Windows

| File                                     | Description                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.16.0-Windows.msi`          | **Recommended** - MSI installer, supports auto-update |
| `CC-Switch-v3.16.0-Windows-Portable.zip` | Portable, extract and run, no registry writes         |

#### macOS

| File                             | Description                                             |
| -------------------------------- | ------------------------------------------------------- |
| `CC-Switch-v3.16.0-macOS.dmg`    | **Recommended** - DMG installer, drag into Applications |
| `CC-Switch-v3.16.0-macOS.zip`    | Extract and drag into Applications, Universal Binary    |
| `CC-Switch-v3.16.0-macOS.tar.gz` | For Homebrew installation and auto-update               |

> macOS builds are Apple code-signed and notarized — install directly.

#### Homebrew (macOS)

> 🎉 CC Switch is now available in the official Homebrew cask repository — no need to add a custom tap!

```bash
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

> Linux artifacts are published for both **x86_64** and **ARM64** (`aarch64`). The architecture is included in the asset filename — pick the one matching your machine's `uname -m` output:
>
> - `CC-Switch-v3.16.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
> - `CC-Switch-v3.16.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended | Installation                                                           |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | Add execute permission and run, or use AUR                             |
| Other distros / not sure                | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

## [3.15.0] - 2026-05-16

> Claude Desktop becomes a first-class managed surface with third-party provider switching via proxy gateway, role-based model mapping, major reverse-proxy hardening, Codex OAuth live model discovery, and a filter-driven usage dashboard Hero card

> [!WARNING]
>
> ## Only Official Channels (Please Read)
>
> CC Switch is a **fully free and open-source** desktop app, and we **do not charge users any fees**. Multiple imposter websites have recently been spotted impersonating CC Switch to solicit payments and harvest account credentials, with some users already reporting financial losses. Please only obtain the software through the official channels listed below:
>
> | Channel            | Only Official                                                                  |
> | ------------------ | ------------------------------------------------------------------------------ |
> | Website            | **[ccswitch.io](https://ccswitch.io)**                                         |
> | Source             | **[github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)** |
> | Downloads          | **[GitHub Releases](https://github.com/farion1231/cc-switch/releases)**        |
> | Author             | **[@farion1231](https://github.com/farion1231)**                               |
> | Report an Imposter | **[GitHub Issues](https://github.com/farion1231/cc-switch/issues)**            |
>
> **Any "CC Switch" website or client that asks you for payment, top-ups, or login credentials is fake.** If you have been tricked into paying, stop the transaction immediately and file a report through GitHub Issues so we can take down the imposter site as quickly as possible.

### Claude Desktop Guide

The headline feature in this release is the **first-class Claude Desktop management panel**. If you already have many providers configured for Claude Code, start here:

**[Use CC Switch to configure, manage, and switch Claude Desktop providers in one place](/en/docs?section=providers&item=claude-desktop)**

The guide walks through one-click import from Claude Code, adding Claude Desktop-specific providers, direct mode vs. model-mapping mode, showing the hidden local-routing toggle, and returning to Claude Desktop's official sign-in mode.

### Overview

CC Switch v3.15.0 is a major release following the v3.14.x line, centered on **promoting Claude Desktop to a first-class managed surface**. It ships third-party provider switching through the in-app proxy gateway, role-based model mapping (`sonnet` / `opus` / `haiku`) with a `supports1m` long-context flag, Copilot/Codex OAuth provider reuse, a redesigned Claude Code import flow, app-switcher differentiation between "Claude Code" and "Claude Desktop", and 44 provider presets translated from the Claude Code catalog into the new Claude Desktop surface.

Around proxy reliability, this release performs a systematic hardening pass: P0–P3 patches across routing / lifecycle / retry / failover / rectifier paths; pooled HTTPS connection reuse for non-Anthropic backends to cut per-request latency; cache hit-rate improvements for Codex and OpenAI Responses (emit `prompt_cache_key` only when a real client-provided session identity exists, canonicalize JSON keys in outgoing request bodies plus `tool_call` arguments and `tool_result` content, and thread `session_id` into the usage logger); correct Anthropic ↔ OpenAI `tool_choice` mapping; Vertex AI full URLs are no longer truncated; Gemini request models are now extracted from the URI path; takeover detection is tightened; and IPv6 listen addresses are supported. ChatGPT Codex OAuth providers no longer depend on hardcoded model lists — CC Switch now fetches a live model list from the ChatGPT backend on demand.

Claude Code's model mapping is now role-based (`sonnet` / `opus` / `haiku`) with display names and a new `supports1m` boolean flag, replacing the legacy `[1M]` suffix and decoupling routing decisions from raw model IDs. The usage dashboard adds a **filter-driven Hero card** that exposes cache-normalized real total tokens and cache hit rate, updated live as the active date range / provider / model filters change; paired with a fix for cache-cost semantics and the noisy pricing warning storm that fired on every request. Robustness improvements in the OpenAI Responses API usage parsing path mean missing or malformed upstream `usage` no longer crashes the VSCode Claude Code extension with a `null` output.

The provider ecosystem expands further: new BytePlus, Volcengine Agentplan, ClaudeAPI, ClaudeCN, RunAPI, RelaxyCode, PatewayAI, and Baidu Qianfan Coding Plan partner presets; DouBao Seed is promoted to partner status; and provider cards now surface a "routing support" badge so users can tell at a glance which providers can be served through Local Routing. This release also fixes a long tail of issues across Codex sessions, OAuth, Claude Desktop forms, Linux segfaults, terminal fallbacks, and ships several GitHub Actions dependency bumps.

### Highlights

- **Claude Desktop Becomes a First-Class Managed Surface**: Third-party provider switching through the in-app proxy gateway, role-based model mapping (`sonnet` / `opus` / `haiku`) with a `supports1m` long-context flag, Copilot/Codex OAuth provider reuse, and 44 provider presets translated from the Claude Code catalog. Note: 20 Claude Desktop presets now default to direct mode instead of proxy mode — verify connectivity after upgrade if you previously relied on proxy routing.
- **Major Reverse-Proxy Hardening**: P0–P3 lifecycle / retry / failover / rectifier patches; pooled HTTPS reuse for non-Anthropic backends; Codex / Responses cache hit-rate improvements; correct Anthropic ↔ OpenAI `tool_choice` mapping; Vertex AI URL preservation; Gemini path-based model extraction; refined takeover detection; IPv6 listen address support.
- **Provider Ecosystem Expansion**: New BytePlus, Volcengine Agentplan, ClaudeAPI, ClaudeCN, RunAPI, RelaxyCode, PatewayAI, and Baidu Qianfan Coding Plan partner presets; DouBao Seed promoted to partner status; routing-support badges on provider cards.
- **Role-Based Model Mapping with 1M Flag**: Role-based `sonnet` / `opus` / `haiku` routing with display names and a `supports1m` flag replaces the legacy `[1M]` suffix.
- **Codex OAuth Live Model Discovery**: ChatGPT Codex providers fetch the live model list from the ChatGPT backend on demand.
- **Usage Dashboard Filter-Driven Hero**: Surfaces cache-normalized real total tokens and cache hit rate, updated live as date / provider / model filters change.
- **DeepSeek Tool Calls + Zero-Usage Final Delta**: DeepSeek tool calls now return `reasoning_content` alongside `tool_calls` (#2543, thanks @bling-yshs); the final `message_delta` always includes a usage block (even when zero) so strict Anthropic clients no longer crash on `null` (#2485, thanks @Myoontyee).
- **OpenAI Responses API Usage Parsing Robustness**: Missing or malformed upstream `usage` no longer crashes the VSCode Claude Code extension (#2422, thanks @magucas).

### Added

#### Claude Desktop Third-Party Provider Switching via Proxy Gateway

CC Switch now treats **Claude Desktop** as a first-class managed surface alongside Claude Code / Codex / Gemini / OpenCode / OpenClaw / Hermes.

- New dedicated Claude Desktop panel that brokers third-party providers to Claude Desktop through CC Switch's in-app proxy gateway
- Routing-support badge on cards for providers that need Local Routing
- Role-based model route mapping locked to `sonnet` / `opus` / `haiku`
- Copilot / Codex OAuth providers can be reused in the Claude Desktop panel
- Redesigned Claude Code settings import flow
- App switcher visually distinguishes "Claude Code" from "Claude Desktop", and the app visibility settings use the "Claude Code" label
- 44 Claude Desktop provider presets translated from the Claude Code preset catalog

#### Routing Support Badges on Provider Cards

Provider cards in both the Claude Code and Codex panels now show a routing-support badge so users can tell at a glance which providers can be served through Local Routing.

#### Codex OAuth Live Model List

ChatGPT Codex providers no longer rely on a hardcoded model selection — CC Switch fetches a **live model list** from the ChatGPT backend on demand.

#### Role-Based Model Mapping with 1M Flag

Claude Code model mapping is now role-based (`sonnet` / `opus` / `haiku`) with display names and a `supports1m` boolean flag, replacing the legacy `[1M]` suffix and decoupling routing from raw model IDs.

#### Filter-Driven Usage Hero

The usage dashboard's Hero summary is now filter-driven, updating live as the active date range / provider / model filters change; it surfaces **cache-normalized real total tokens** and cache hit rate so the Hero figures line up with the detail list below.

#### Provider Form "Save Anyway" Prompt

Softened provider form input validation by turning non-blocking input issues into a "save anyway" prompt, so a harmless field issue no longer blocks saving (#2307, thanks @allenxln).

#### Universal Provider Duplicate Action

Added a "duplicate" button for universal providers from the provider list (#2416, thanks @hubutui).

#### Persisted Tauri Window State

Window position and size now persist across launches (#2377, thanks @BillSaul).

#### Tray Icon Tooltip

The system tray icon now surfaces a status tooltip on hover (#2417, thanks @Coconut-Fish).

#### Warp Terminal Session Launch

Added support for launching Warp and executing a saved session inside it (#2466, thanks @tisonkun).

#### DeepSeek `reasoning_content` for Tool Calls

DeepSeek tool-call responses now return `reasoning_content` and `tool_calls` together, so callers can render both (#2543, thanks @bling-yshs).

#### Baidu Qianfan Coding Plan (Claude Code)

Added a Baidu Qianfan Coding Plan preset (#2322, thanks @jimmyzhuu).

#### Compshare Coding Plan Preset (Cross-App)

The Compshare Coding Plan preset now lands across claude / codex / hermes / openclaw.

#### Partner Provider Presets

Added **BytePlus**, **Volcengine Agentplan**, **ClaudeAPI**, **ClaudeCN**, **RunAPI**, **RelaxyCode**, and **PatewayAI** partner presets; promoted **DouBao Seed** to partner status (refreshed endpoint and links).

#### 44 Claude Desktop Provider Presets

Translated 44 provider presets from the Claude Code preset catalog into the new Claude Desktop panel.

### Changed

#### 20 Claude Desktop Presets Default to Direct Mode

20 Claude Desktop presets now ship in direct mode instead of routing through the proxy by default, reducing setup friction for users who don't need proxy-specific compatibility shims. If you previously relied on proxy routing for these presets, verify connectivity after upgrading.

#### Claude Desktop Operational Notes

Switching a Claude Desktop provider writes CC Switch's managed 3P profile and **requires restarting Claude Desktop** to take effect; proxy-mode providers require CC Switch's Local Routing to stay running while in use.

#### Failover / Local Routing Guardrails

Failover controls now require the target app's Local Routing takeover to be enabled before they can be turned on; stopping only the proxy service is blocked while any app still depends on takeover state, preventing the "proxy stopped but the app still thinks takeover is running" inconsistency.

#### Usage Accounting Semantics Changed

Usage summaries now report **cache-normalized real total tokens** and **cache hit rate**. Historical token and cost figures may **shift** after deduplication and pricing recalculation — the new numbers are more accurate but will not equal the values reported in earlier versions.

#### Provider Preset Rendering Order

Preset lists now render in the author-defined array order, with partners prioritized first, replacing the previous implicit sort.

#### Model Mapping Hint Copy Simplified

`modelMappingOffHint` was rewritten as action-oriented copy across zh / en / ja.

#### CC Switch Brand Surface Unified to ccswitch.io

All in-app and README "official website" references now point at ccswitch.io as the sole official site; the release notes template also surfaces ccswitch.io.

#### Theme Switch Simplified

Removed the circular reveal animation during theme switches; theme changes are now an instant cross-fade.

#### Claude Code App Switcher Differentiation

The app switcher visually distinguishes "Claude Code" from "Claude Desktop", and the app visibility settings use the "Claude Code" label.

#### CI: Claude Review Upgraded to Opus 4.7

The Claude review GitHub Action is upgraded to Opus 4.7; the prompt is tuned to reduce nitpick noise; a new `@claude` review-only Code Action is added; PR head SHA is pinned for checkout; the `--max-turns 5` limit is removed.

#### GitHub Actions Dependency Bumps

- `actions/checkout` 4 → 6 (#2517)
- `pnpm/action-setup` 5 → 6 (#2518)
- `softprops/action-gh-release` 2 → 3 (#2519)
- `actions/stale` 9 → 10 (#2520)

#### DeepSeek Presets Switched to V4

DeepSeek presets now ship V4 (flash / pro) with refreshed pricing seeds.

#### Codex 1M Context Toggle Hidden in Edit Form

The 1M context-window toggle is no longer surfaced in the Codex provider edit form, reducing the density of knobs that have no effect in current Codex deployments.

#### OpenClaudeCode Migrated to MicuAPI Domain

The OpenClaudeCode preset is migrated to the MicuAPI domain; Micu API links are refreshed to `micuapi.ai`.

#### CrazyRouter Endpoints Switched to `cn` Subdomain

CrazyRouter preset endpoints now use the `cn` subdomain.

#### RelaxyCode Custom Icon

The RelaxyCode preset icon is switched to a custom `relaxcode.png` asset.

#### Kimi For Coding Doc URL

The Kimi For Coding website URL is updated to the `/code/docs/` path.

#### SiliconFlow International Site Shows USD

The SiliconFlow international site now correctly shows USD for balance display (it previously displayed CNY incorrectly).

### Fixed

#### OpenAI Responses API Usage Parsing Robustness

Hardened `build_anthropic_usage_from_responses()` and the Responses → Anthropic SSE translator so a missing or malformed upstream `usage` no longer produces `"usage": null` in `message_delta`. This unblocks strict Anthropic clients (notably the VSCode Claude Code extension) that crashed with `Cannot read properties of null (reading 'output_tokens')` against providers such as Codex OAuth and DashScope's `compatible-mode/v1/responses` endpoint. Added OpenAI field-name fallbacks (`prompt_tokens` / `completion_tokens`), null / empty / partial object handling, and preserved cache token fields even when input/output tokens are missing (#2422, thanks @magucas).

#### Proxy Reliability Patches (P0–P3)

Multiple rounds of routing / lifecycle / retry / rectifier patches across the request-forwarder paths; extracted a shared `handle_rectifier_retry_failure` helper and a shared `auth_header_value` helper.

#### Proxy: Pooled HTTPS Connection Reuse for Non-Anthropic Backends

Non-Anthropic backends now reuse pooled HTTPS connections instead of opening a fresh TLS session per request, materially reducing per-request latency.

#### Proxy: Forward Client's Actual HTTP Method

The proxy no longer hard-codes `POST` — it forwards the client's actual HTTP method, so non-POST upstream endpoints (e.g. GET `/v1/models`) now work correctly.

#### Proxy: Per-Attempt Counters and `max_retries` Wiring

Client-request counters are moved out of the per-attempt loop; `AppProxyConfig.max_retries` is now correctly wired into the request forwarder.

#### Proxy: Failover Decision Refinements

Refined retryable vs. unretryable error classification in the request forwarder.

#### Proxy: Takeover Detection Tightening

Takeover detection is tightened; disabling takeover uses fallback restore, so leftover state no longer strands a provider.

#### Proxy: Anthropic ↔ OpenAI `tool_choice` Mapping

During format conversion, Anthropic's `tool_choice` is now correctly mapped to the OpenAI Chat nested form.

#### Proxy: Gemini Request Model Extracted from URI Path

Gemini request models are now extracted from the URI path (instead of the body), so transformed traffic reports the right model name.

#### Proxy: Auth Header Error Handling

`get_auth_headers` now returns `Result` instead of panicking on bad credentials.

#### Proxy: IPv6 Listen Address Validation

The Proxy panel now accepts IPv6 listen addresses.

#### Proxy: Codex / Responses Cache Hit Rate

Improved cache hit rate for Codex and OpenAI Responses requests by stabilizing cache key derivation: emit `prompt_cache_key` only when the client actually carries a session identity, so unrelated conversations no longer collapse onto a single key; canonicalize (sort) JSON keys in outgoing request bodies and in `tool_call` arguments / `tool_result` content for byte-identical prefix-cache reuse; thread `session_id` into the usage logger for request correlation.

#### Proxy: JSON Schema Underscore Fields Preserved

Private-parameter filtering now preserves underscore-prefixed field names inside JSON Schema name maps (`properties`, `patternProperties`, `definitions`, `$defs`), so user-defined schema keys like `_id` and `_meta` pass through the filter intact.

#### Proxy: Read Tool Empty Pages

Drop empty pages from `Read` tool inputs so providers no longer reject the request (#2472, thanks @Kwensiu).

#### Proxy: Per-Request Hot-Path Trim

Trimmed per-request hot-path work and database wait time.

#### Proxy: Real Provider Model Names Under Takeover

Under takeover, the Claude Code menu now exposes the real provider model names instead of a stale alias.

#### Proxy: Zero Usage in Final `message_delta`

The final `message_delta` event now always includes a usage block (even when zero) so strict Anthropic clients no longer crash on `null` (#2485, thanks @Myoontyee).

#### Proxy: Streaming `message_delta` Deduplication

Deduplicated `message_delta` events that some upstreams emit twice (#2366, thanks @codeasier).

#### Proxy: Scoped `reasoning_content` Preserved for Tool Calls

Tool-call paths now correctly preserve the scoped `reasoning_content` field during transformation; Kimi / Moonshot's OpenAI Chat compatibility path keeps the field while generic OpenAI-compatible requests stay free of it (#2367, thanks @codeasier).

#### Proxy: Vertex AI Full URL Preserved

Full Vertex AI URLs are no longer truncated during proxy forwarding (#2415, thanks @xpfo-go).

#### Proxy: Leading Billing Header Stripped from System Content

Some upstreams prepend a billing-header chunk to the system message; this content is now stripped (#2350).

#### Proxy: Claude Auth Strategy Derived from `ANTHROPIC_*` Env Var

The Claude auth strategy is now derived from the actual `ANTHROPIC_*` env variable name rather than an opaque heuristic.

#### Third-Party Claude Providers: Disable Model Test

Model probing is disabled for third-party Claude gateways that don't implement `/v1/models` consistently.

#### Model-Fetch: `/models` for Anthropic-Compatible Subpath Providers

`/models` discovery now works for Anthropic-compatible subpath providers.

#### Copilot: Claude Model IDs Resolved Against Live `/models`

Copilot-backed providers now resolve Claude model IDs against the live `/models` list to avoid stale ID mismatches.

#### Codex: Session Title No Longer Pulls in `environment_context`

Codex session title extraction no longer pulls in the `environment_context` noise (#2439, thanks @eclipsehx).

#### Codex: Subagent Sessions Hidden

Codex subagent sessions are now hidden from the main session list (#2445, thanks @LanternCX).

#### Codex Startup Live Import Duplication

Fixed a duplicate-import bug in the Codex startup live-import path (#2590, thanks @DhruvShankpal).

#### Codex Provider Switch No Longer Disturbs History

Switching the active Codex provider no longer changes existing session history (#2349, thanks @SaladDay).

#### Codex Usage Log Wording

Corrected a misleading log message for Codex session usage (#2473, thanks @tisonkun).

#### Claude: Persist `max` Effort via Env

`max` effort now correctly persists across restart via the env variable (#2493, thanks @makoMakoGo).

#### Claude Desktop: Model Route Matching Without `[1M]` Suffix

Route matching no longer requires the legacy `[1M]` suffix.

#### Claude Desktop: Provider Form Input Focus Loss

Fixed an input in the Claude Desktop provider form that lost focus while being edited.

#### Claude Desktop: Spurious Proxy-Stopped Status Alert

Removed an alert that fired spuriously when the proxy was intentionally stopped.

#### Claude Desktop: Empty Toolbar Capsule Hidden

The empty toolbar capsule is now hidden when Claude Desktop is the active app.

#### UI: Monitor Badge Icon Centering

Centered the Monitor badge icon in the app switcher.

#### Linux: Theme Selection Segfault

Prevented a segfault triggered by selecting a theme on Linux (#2502, thanks @definfo).

#### Terminal: iTerm Fallback on Cold Launch

Prevented iTerm from being selected as a fallback on cold launch when it isn't actually installed (#2448, thanks @hulkbig).

#### Config: JSON Keys Sorted Alphabetically

Config writes now sort JSON keys alphabetically for deterministic output (#2469, thanks @fuleinist).

#### "Import Existing" Made Side-Effect Free

The "import existing" action is now side-effect free (#2429, thanks @xwil1).

#### Coding Plan: Zhipu Weekly Tier Named by Reset Time

Corrected the Zhipu weekly tier name to match the actual reset time (#2420, thanks @TuYv).

#### DashScope: Usage Parsing Robustness

Hardened DashScope usage parsing so a malformed payload no longer crashes the VSCode Claude Code extension (#2425, thanks @magucas).

#### Usage: Deduplicate Proxy and Session-Log Sources

Deduplicated usage records sourced from both the proxy and session logs.

#### Usage: Cache Cost Semantics + Pricing Warn Storm

Corrected cache-cost semantics and silenced the noisy pricing warning that fired on every request.

#### CI: Frontend Formatting + Linux Clippy Restored

Restored frontend formatting and Linux clippy checks in CI.

#### Proxy Test Helper Clippy Warning

Fixed a clippy warning in the proxy test helper.

### Removed

#### Hermes Agent Usage Tracking Integration

Removed the Hermes Agent usage tracking integration originally planned for this cycle — upstream behavior changes made the integration impractical to maintain. The integration was **never enabled in any released version**; the "zero-cost rendering" bug discovered during its development was fixed before the integration was rolled back.

#### Theme Switch Circular Reveal Animation

Removed the circular reveal animation used during theme switches — it stuttered on slower compositors and added little visible value.

#### DDSHub Partner Integration

Removed DDSHub as a partner preset and dropped the cross-link blurbs from the READMEs.

### Docs

#### README Sponsor Refresh (zh / en / ja)

Added BytePlus, ClaudeCN, RunAPI, and PatewayAI sponsor entries; cross-linked BytePlus and Volcengine entries; refreshed the CrazyRouter $2 credit claim flow, the Compshare blurb, the Right Code blurb, and other sponsor logos and listings; flattened the LionCC logo onto a white background; switched the Chinese README's sponsor logo to the Volcengine artwork; added Hermes Agent to the README subtitles.

#### Release Notes Template

The release notes template now surfaces `ccswitch.io`.

#### Brand Surface

Documented `ccswitch.io` as the sole official website across READMEs and in-app references.

### ⚠️ Upgrade Notes

#### 20 Claude Desktop Presets Default to Direct Mode

These 20 presets previously routed through the proxy by default and now default to direct mode. If you were using one of these presets pre-upgrade and depended on the proxy path for connectivity (for example because the proxy applies a special rectifier or transformation layer), verify connectivity after upgrading; you can manually switch them back to proxy mode from the CC Switch panel if needed.

#### Claude Desktop Operational Constraints

Switching a Claude Desktop provider **requires restarting Claude Desktop** to take effect; proxy-mode providers require CC Switch's Local Routing to stay running while in use — quitting CC Switch or stopping Local Routing will cut off any proxy-mode Claude Desktop providers.

#### Failover Requires Takeover Enabled

Before enabling Failover, make sure the target app's Local Routing takeover is enabled, otherwise the Failover control will refuse to start; stopping the proxy service while any app still depends on takeover state is blocked, so you need to disable takeover at the app layer first before stopping the proxy.

#### Usage Figures May Diverge from History

Usage summaries now use cache-normalized real total tokens + cache hit rate. Historical token and cost figures may **shift** after deduplication and pricing recalculation — the new numbers are more accurate but will not equal what earlier versions reported.

### ⚠️ Risk Notice

This release inherits the risk notices originally introduced in v3.12.3 / v3.13.0 for reverse-proxy-style features.

**GitHub Copilot Reverse Proxy**: Using Copilot's reverse-proxy path may violate GitHub / Microsoft's terms of service. See the [v3.12.3 release notes](v3.12.3-en.md#️-risk-notice) for details.

**Codex OAuth Reverse Proxy**: Using the Codex OAuth reverse proxy with a ChatGPT subscription may violate OpenAI's terms of service. See the [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice) for details.

**Claude Desktop Third-Party Provider Switching via Proxy Gateway**: Routing Claude Desktop traffic through CC Switch's in-app proxy gateway to a third-party provider exposes those requests to that provider's billing, compliance, and data-retention policies — read the target provider's terms of service before using.

By enabling these features, users **accept all associated risks**. CC Switch is not responsible for any account restrictions, warnings, or service suspensions that result from using these features.

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| OS      | Minimum Version              | Architecture                        |
| ------- | ---------------------------- | ----------------------------------- |
| Windows | Windows 10 or later          | x64                                 |
| macOS   | macOS 12 (Monterey) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below              | x64 / ARM64                         |

#### Windows

| File                                     | Description                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.15.0-Windows.msi`          | **Recommended** - MSI installer, supports auto-update |
| `CC-Switch-v3.15.0-Windows-Portable.zip` | Portable, extract and run, no registry writes         |

#### macOS

| File                             | Description                                             |
| -------------------------------- | ------------------------------------------------------- |
| `CC-Switch-v3.15.0-macOS.dmg`    | **Recommended** - DMG installer, drag into Applications |
| `CC-Switch-v3.15.0-macOS.zip`    | Extract and drag into Applications, Universal Binary    |
| `CC-Switch-v3.15.0-macOS.tar.gz` | For Homebrew installation and auto-update               |

> macOS builds are Apple code-signed and notarized — install directly.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

> Linux artifacts are published for both **x86_64** and **ARM64** (`aarch64`). The architecture is included in the asset filename — pick the one matching your machine's `uname -m` output:
>
> - `CC-Switch-v3.15.0-Linux-x86_64.AppImage` / `.deb` / `.rpm`
> - `CC-Switch-v3.15.0-Linux-arm64.AppImage` / `.deb` / `.rpm`

| Distribution                            | Recommended | Installation                                                           |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | Add execute permission and run, or use AUR                             |
| Other distros / not sure                | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.14.1] - 2026-04-23

> Tray usage visibility, Codex OAuth stability fixes, Skills import/install reliability, and removal of the Hermes config health scanner

### Overview

CC Switch v3.14.1 is a patch release following v3.14.0, focused on **Codex OAuth reverse-proxy stability**, **tray usage visibility**, **Skills import / install reliability**, **Gemini session restore paths**, and **simplifying Hermes configuration health handling**.

For the first time, the system tray surfaces **cached usage** for the current Claude / Codex / Gemini provider directly in its submenus — including subscription summaries and usage-script summaries with color-coded utilization markers. For Chinese coding-plan providers like Kimi / Zhipu / MiniMax, the tray additionally renders a **5-hour + weekly window** layout in the `🟢 h12% w80%` style (worst utilization drives the emoji), semantically identical to the official subscription badges. Creating a Claude provider whose `ANTHROPIC_BASE_URL` matches a known coding-plan host now auto-injects `meta.usage_script` so the tray lights up without opening the Usage Script modal.

Several Codex OAuth reverse-proxy stability issues are addressed this release: client-provided session IDs are now used as both `prompt_cache_key` and the Codex session header to avoid UUID-driven cache churn; non-streaming Anthropic clients receive proper JSON responses even when the ChatGPT Codex upstream forces OpenAI Responses SSE; and Stream Check now builds probes with the same `store: false`, encrypted reasoning include, and provider FAST mode setting as production requests, eliminating the "check fails but it actually works" mismatch. Paired with a new explicit **FAST mode toggle**, users can now opt into `service_tier="priority"` on Codex OAuth-backed Claude providers, trading latency against ChatGPT quota consumption on their own terms.

Additionally, the in-app **Hermes config health scanner** and its warning banner are removed (along with the `scan_hermes_config_health` command, `HermesHealthWarning` type, and `HermesWriteOutcome.warnings` payload), refocusing the Hermes surface on active provider display, switching defaults, memory editing, and launching the Hermes Web UI — deep configuration health is now Hermes's own responsibility.

### Highlights

- **Tray Usage Visibility**: Claude / Codex / Gemini tray submenus show cached usage for the current provider, including subscription and script-based summaries with color markers; refreshes are throttled, limited to visible apps, and synchronized back into React Query (#2184, thanks @TuYv)
- **Tray Coding-Plan Usage (Kimi / Zhipu / MiniMax)**: The tray renders 5-hour + weekly window usage using the `🟢 h12% w80%` layout; Claude providers whose base URL matches a known host auto-inject `meta.usage_script`
- **Codex OAuth FAST Mode**: New explicit FAST mode toggle for Codex OAuth-backed Claude providers; when enabled, converted Responses requests send `service_tier="priority"`. Off by default (#2210, thanks @JesusDR01)
- **Codex OAuth Stability**: Fixed reverse-proxy cache routing (#2218, thanks @majiayu000), Responses SSE aggregation (#2235, thanks @xpfo-go), and Stream Check parity with production (#2210, thanks @JesusDR01)
- **Hermes Config Health Scanner Removed**: Refocuses the Hermes surface on provider management, memory editing, and launching the Web UI — no longer duplicates deep configuration health judgments
- **Skills Import / Install Reliability**: Import dialog disables actions while pending and deduplicates results by ID (#2211, thanks @TuYv); model quick-set / one-click config applies against the latest form state (#2249, thanks @Coconut-Fish); root-level `SKILL.md` repo installs are stable (#2231, thanks @santugege)
- **Gemini Session Restore Paths**: Session scanning reads `.project_root` metadata and passes the original project directory back into restore flows (#2240, thanks @tisonkun)
- **Session / Settings Layout Polish**: Hardened the scroll-area viewport with width containment to fix horizontal overflow; tightened app bottom and settings footer spacing (#2201, thanks @Coconut-Fish)

### Added

#### Tray Usage Visibility

- System tray submenus now show **cached usage** for the current Claude / Codex / Gemini provider (#2184, thanks @TuYv)
- Includes subscription quota summaries and usage-script summaries with color-coded utilization markers
- Tray-triggered refreshes are **throttled**, **limited to visible apps**, and synchronized back into React Query so the main window and tray share the same usage data

#### Tray Coding-Plan Usage (Kimi / Zhipu / MiniMax)

- The tray renders **5-hour + weekly window** usage for Chinese coding-plan providers
- Uses the same `🟢 h12% w80%` two-window layout as official subscription badges (worst utilization drives the emoji color)
- Creating a Claude provider whose `ANTHROPIC_BASE_URL` matches a known coding-plan host **auto-injects** `meta.usage_script`, so the tray lights up without opening the Usage Script modal
- Existing `usage_script` values are **preserved on update**, never clobbering user customizations

#### Codex OAuth FAST Mode

- New explicit FAST mode toggle for Codex OAuth-backed Claude providers (#2210, thanks @JesusDR01)
- When enabled, converted Responses requests send `service_tier="priority"` for lower latency
- Off by default to avoid unexpectedly increasing ChatGPT quota consumption

### Changed

#### Session and Settings Layout Polish

- Hardened the scroll-area viewport with width containment to fix horizontal overflow (#2201, thanks @Coconut-Fish)
- Tightened app bottom and settings footer spacing so long session / settings views fit more cleanly

### Removed

#### Hermes Config Health Scanner

- Removed the in-app Hermes config health scanner and its warning banner
- Removed the `scan_hermes_config_health` command, `HermesHealthWarning` type, and `HermesWriteOutcome.warnings` payload
- The CC Switch Hermes surface now focuses on its core job: active provider display, default provider switching, memory editing, and launching the Hermes Web UI for deep configuration

### Fixed

#### Codex OAuth Cache Routing

- Use the client-provided session ID as both `prompt_cache_key` and the Codex session header, preserving explicit cache keys (#2218, thanks @majiayu000)
- Stop generating UUIDs that caused cache-identity churn, stabilizing the ChatGPT Codex reverse-proxy cache identity

#### Codex OAuth Responses SSE Aggregation

- Non-streaming Anthropic clients now receive proper JSON even when the ChatGPT Codex upstream forces OpenAI Responses SSE (#2235, thanks @xpfo-go)
- CC Switch aggregates the upstream SSE events before running the non-streaming transform

#### Codex OAuth Stream Check Parity

- Stream Check now builds Codex OAuth probe requests with the same `store: false`, encrypted reasoning include, and provider FAST mode setting as production proxy traffic (#2210, thanks @JesusDR01)
- Eliminates the "check fails but it actually works" mismatch

#### Codex Model Extraction

- Reading the `model` field from Codex config now uses TOML parsing instead of first-line regex matching (#2227, thanks @nmsn)
- Multiline TOML is handled correctly

#### Model Quick-Set / One-Click Config

- Model quick-set now applies against the **latest** provider form config (#2249, thanks @Coconut-Fish)
- Fixes stale form state preventing one-click configuration from succeeding

#### Skills Import Duplicates

- The Skills import dialog disables actions while import is pending (#2211, thanks @TuYv)
- The installed-skills cache deduplicates imported results by ID, preventing double-clicks from adding duplicate installed entries (#2139)

#### Root-Level Skill Repos

- Skill install and update flows now consistently resolve three source patterns: direct nested paths, install-name recursive search, and repository-root `SKILL.md` sources (#2231, thanks @santugege)

#### Gemini Session Restore Paths

- Gemini session scanning now reads `.project_root` metadata (#2240, thanks @tisonkun)
- Restore flows can pass the original project directory when available

#### Provider Hover Names

- Provider icons now expose the provider name on hover for inline SVG, image URL, and fallback initials render paths (#2237, thanks @tisonkun)

### Notes & Caveats

- **Hermes Health Scanner Removed**: If you were relying on CC Switch to surface deep Hermes YAML configuration issues, switch to the "Launch Hermes Web UI" toolbar button and inspect them in Hermes's own panel. Day-to-day provider management, switching, memory editing, and MCP / Skills sync continue to be handled by CC Switch.
- **Codex OAuth FAST Mode Off by Default**: Only turn it on if you accept potentially increased ChatGPT quota consumption in exchange for lower latency.
- **Tray Cached Usage**: Refreshes are throttled and limited to the currently visible app to avoid unnecessary upstream API calls; values are synchronized into React Query so the main window and tray stay in sync.

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| OS      | Minimum Version              | Architecture                        |
| ------- | ---------------------------- | ----------------------------------- |
| Windows | Windows 10 or later          | x64                                 |
| macOS   | macOS 12 (Monterey) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below              | x64                                 |

#### Windows

| File                                     | Description                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| `CC-Switch-v3.14.1-Windows.msi`          | **Recommended** - MSI installer, supports auto-update |
| `CC-Switch-v3.14.1-Windows-Portable.zip` | Portable, extract and run, no registry writes         |

#### macOS

| File                             | Description                                             |
| -------------------------------- | ------------------------------------------------------- |
| `CC-Switch-v3.14.1-macOS.dmg`    | **Recommended** - DMG installer, drag into Applications |
| `CC-Switch-v3.14.1-macOS.zip`    | Extract and drag into Applications, Universal Binary    |
| `CC-Switch-v3.14.1-macOS.tar.gz` | For Homebrew installation and auto-update               |

> macOS builds are Apple code-signed and notarized — install directly.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended | Installation                                                           |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | Add execute permission and run, or use AUR                             |
| Other distros / not sure                | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.14.0] - 2026-04-21

> Hermes Agent becomes the 6th managed app, Claude Opus 4.7 rolls out across the preset matrix, Gemini Native API proxy, "Local Routing" rename, and application-level window controls

### Overview

CC Switch v3.14.0 is a major release centered on onboarding **Hermes Agent as the 6th first-class managed app** and rolling out **Claude Opus 4.7** across the full aggregator and Bedrock preset matrix. Hermes support covers a database v9 → v10 migration, a complete Rust command surface, YAML-backed `~/.hermes/config.yaml` read/write with atomic backups, MCP sync, Skills sync, SQLite + JSONL session management, and dedicated frontend panels including a Memory editor. All four API protocols aligned with Hermes Agent 0.10.0 (`chat_completions`, `anthropic_messages`, `codex_responses`, `bedrock_converse`) are selectable. Providers owned by the user-authored `providers:` dict are rendered as read-only cards, and deep YAML configuration is delegated directly to the Hermes Web UI.

Beyond Hermes, this release adds a **Gemini Native API proxy** (`api_format = "gemini_native"`) so the proxy can forward directly to Google's `generateContent` endpoint with full streaming, schema conversion, and shadow request support; renames the legacy "Local Proxy Takeover" to **Local Routing** across UI copy, README, and docs in all three locales; introduces **application-level window controls**, an opt-in setting that materially improves the experience on Linux Wayland where compositor-drawn buttons can become inert; and bundles late additions for launching `hermes dashboard` from the toolbar, a LemonData preset across all six apps, a DDSHub Codex endpoint, plus several Hermes health-check and Usage modal fixes.

On the session side, the message list is **virtualized** via `@tanstack/react-virtual` so conversations with thousands of records scroll smoothly and long messages collapse by default; the Usage dashboard adds a **date range picker** (Today / 1d / 7d / 14d / 30d + custom date-time calendar) and a page-jump input; **Stream Check error classification** now surfaces color-coded toasts with refreshed default probe models and an explicit "model not found" branch; and switching to official providers is **blocked while Local Routing is active** to avoid account-suspension risk. The pricing database is reseeded from v8 → v9 with ~50 new model entries (Claude 4.7, Opus 4.7 Adaptive Thinking, Grok 4, Qwen 3.5/3.6, MiniMax M2.5/M2.7, Doubao Seed 2.0 series, GLM-5/5.1 and others) and corrected stale prices.

### Highlights

- **Hermes Agent Support (6th Managed App)**: Database v9 → v10 migration, full Rust command surface, YAML read/write with atomic backups, MCP sync, Skills sync, SQLite + JSONL session management, dedicated frontend panels, and four API protocols (`chat_completions` / `anthropic_messages` / `codex_responses` / `bedrock_converse`)
- **Claude Opus 4.7 Rollout**: Adaptive thinking whitelisting, per-million pricing seed, Bedrock SKU (`anthropic.claude-opus-4-7` / `global.anthropic.claude-opus-4-7`, dropping the legacy `-v1` suffix); all aggregator and Bedrock presets migrated to Opus 4.7 as the default Opus model
- **Claude `max` Effort Tier**: Effort dropdown upgraded from `high` to `max`
- **Gemini Native API Proxy**: New `api_format = "gemini_native"` forwards directly to Google's `generateContent` with full streaming / schema conversion / shadow request support
- **GitHub Copilot Enterprise Server**: GHES authentication and endpoint configuration for Copilot-backed Claude providers
- **Copilot Premium Consumption Deep Optimization**: Proactive thinking-block stripping before forwarding, `tool_result` classification fix, subagent detection, `x-interaction-id` billing merge, orphan `tool_result` sanitization, and default warmup downgrade — a systematic reduction in premium interaction consumption
- **Session List Virtualization**: Long conversations scroll smoothly and long messages collapse by default to reduce text layout cost
- **Codex / OpenClaw Session Title Extraction**: Meaningful title extraction with 2-line display; strips OpenClaw `message_id` suffix noise
- **Usage Date Range Picker**: Today / 1d / 7d / 14d / 30d preset tabs + custom date-time calendar; page-jump input on paginated lists
- **Stream Check Error Classification**: Color-coded error toasts; refreshed default probe models; explicit "model not found" detection
- **Block Official Provider Switching During Local Routing**: Routing official API traffic through the local proxy carries account-suspension risk — switches are blocked with a warning toast
- **Pricing Database Refresh (v8 → v9)**: ~50 new model entries and corrected stale prices
- **Application-Level Window Controls**: Opt-in setting to render CC Switch's own min/max/close buttons, materially improving Linux Wayland experience
- **Hermes in Unified Skills Management**: Skill install, enable, and filter now cover Hermes
- **Hermes / OpenClaw Config Directory Override**: Point CC Switch at a custom `~/.hermes/config.yaml` or `openclaw.json` location
- **Launch Hermes Dashboard from Toolbar**: When the Hermes Web UI probe fails, the toolbar entry offers to run `hermes dashboard` in the user's preferred terminal
- **New Partner Presets**: LemonData across all six apps; DDSHub Codex endpoint; StepFun Step Plan

### Added

#### Hermes Agent Support (6th Managed App)

CC Switch now treats Hermes Agent as a first-class managed app alongside Claude / Codex / Gemini / OpenCode / OpenClaw.

- **Database Migration v9 → v10**: Adds `enabled_hermes` columns to `mcp_servers` and `skills` tables (`DEFAULT 0`, auto-migrated, no data loss)
- **YAML Configuration Read/Write**: `~/.hermes/config.yaml` read/write with atomic backups; `tests/hermes_roundtrip.rs` guards against dropped OAuth MCP `auth` blocks or pollution of unrelated YAML keys
- **Four API Protocols**: Aligned with Hermes Agent 0.10.0 — `chat_completions` / `anthropic_messages` / `codex_responses` / `bedrock_converse`; new deeplinks default to `chat_completions`
- **User `providers:` Dict Read-Only Rendering**: User-authored providers in the YAML appear as read-only cards in CC Switch; deep configuration delegates to the Hermes Web UI
- **Additive Switching**: Unlike Claude / Codex's "override" style, all Hermes providers coexist in the same YAML

#### Hermes Memory Panel

- New Memory panel for editing `MEMORY.md` / `USER.md` directly, with an enable switch, character-count limits, and a live save flow
- Replaces the Prompts entry for Hermes

#### Hermes Provider Presets (~50)

- Covers Nous Research, Shengsuanyun, OpenRouter, DeepSeek, Together AI, StepFun, Zhipu GLM, Bailian, Kimi, MiniMax, DouBao, BaiLing, ModelScope, KAT-Coder, PackyCode, Cubence, AIGoCode, RightCode, AICodeMirror, AICoding, CrazyRouter, SSSAiCode, Micu, CTok.ai, DDSHub, E-FlowCode, LionCCAPI, PIPELLM, Compshare, SiliconFlow, AiHubMix, DMXAPI, TheRouter, Novita, Nvidia, and Xiaomi MiMo

#### Launch Hermes Dashboard from Toolbar

- When the Hermes Web UI probe fails, the toolbar entry opens a confirm dialog offering to run `hermes dashboard` in the user's preferred terminal
- Spawned via a temp bash / batch script; `hermes dashboard` opens the browser itself once ready, so no polling is required
- The Memory panel and Health banner keep the existing toast behavior
- Also corrects the stale `hermes web` hint in the offline toast (the real command is `hermes dashboard`)
- Linux terminal detection reordered to try `which` before stat'ing `/usr/bin`, `/bin`, `/usr/local/bin`

#### Claude Opus 4.7 Support

- New Claude Opus 4.7 with adaptive thinking whitelisting, per-million pricing seed, and Bedrock SKU (`anthropic.claude-opus-4-7` / `global.anthropic.claude-opus-4-7`, dropping the legacy `-v1` suffix)
- All aggregator and Bedrock presets migrated to Opus 4.7 as the default Opus model

#### Claude `max` Effort Tier

- Claude effort dropdown upgraded from `high` to `max` for extended reasoning capacity

#### Gemini Native API Proxy

- New `api_format = "gemini_native"` so the proxy can forward directly to Google's `generateContent` API (#1918, thanks @yovinchen)
- Full streaming, schema conversion, and shadow request support
- Adds `gemini_url.rs`, `gemini_schema.rs`, `gemini_shadow.rs`, `streaming_gemini.rs`, and `transform_gemini.rs` under the proxy providers module

#### GitHub Copilot Enterprise Server (GHES)

- GHES authentication and endpoint configuration for Copilot-backed Claude providers (#2175, thanks @hotelbe)

#### Session List Virtualization

- Virtualized the session list via `@tanstack/react-virtual` so long conversations (thousands of records) scroll smoothly
- Long session messages are collapsed by default to reduce text layout cost

#### Codex / OpenClaw Session Title Extraction

- Meaningful title auto-extraction for Codex and OpenClaw sessions with 2-line display
- Strips OpenClaw `message_id` suffix noise

#### Usage Date Range Picker

- New date range selector on the usage dashboard with preset tabs (Today / 1d / 7d / 14d / 30d) + custom date + time calendar (#2002, thanks @yovinchen)
- Page-jump input added on paginated lists

#### Model Mapping Quick-Set

- New quick-set button next to model mapping fields in provider forms for faster edits (#2179, thanks @lispking)

#### Stream Check Error Classification

- Stream Check errors are classified and surfaced as color-coded toasts
- Refreshed default probe models to match each vendor's current lineup
- Explicit detection for "model not found" responses

#### Block Official Provider Switching During Local Routing

- Switching to official providers is blocked while Local Routing is active, with a warning toast
- Reason: routing official API traffic through the local proxy carries account-suspension risk

#### Pricing Database Refresh (v8 → v9)

- Reseed-on-migration pricing table
- ~50 new model pricing entries including Claude 4.7, Opus 4.7 Adaptive Thinking, Grok 4, Qwen 3.5/3.6, MiniMax M2.5/M2.7, Doubao Seed 2.0 series, GLM-5/5.1
- Corrected stale prices for DeepSeek, Kimi K2.5, and others

#### Application-Level Window Controls

- Opt-in setting to render CC Switch's own minimize / toggle-maximize / close buttons instead of system decorations (#1119, thanks @git1677967754)
- Materially improves the experience on Linux Wayland where compositor-drawn buttons can become inert

#### Hermes in Unified Skills Management

- Hermes is added to the unified Skills surface
- Skill install, enable, and filter now cover the Hermes app alongside Claude / Codex / Gemini / OpenCode / OpenClaw

#### OpenClaw Config Directory Override

- New settings option to point CC Switch at a custom `openclaw.json` location (#1518, thanks @mrFranklin)

#### Hermes Config Directory Override

- New settings option to point CC Switch at a custom `~/.hermes/config.yaml` location, backed by data-driven dispatch

#### StepFun Step Plan Preset

- StepFun Step Plan (EN / ZH) provider presets (#2155, thanks @hengm3467)

#### New API Usage Script Template

- Added a User-Agent header to the New API usage script template for better upstream compatibility

#### LemonData Provider Preset (All Six Apps)

- LemonData registered as a third-party partner preset across Claude, Codex, Gemini, OpenCode, OpenClaw, and Hermes
- Icon assets and zh / en / ja partner-promotion copy
- Claude preset uses `ANTHROPIC_API_KEY` auth; OpenAI-compatible apps target `gpt-5.4`

#### DDSHub Codex Preset

- Added a Codex-compatible endpoint for DDSHub at the same host as its Claude service
- Base URL omits the `/v1` suffix because the gateway auto-routes OpenAI SDK paths

### Changed

#### "Local Proxy Takeover" → "Local Routing"

- Unified the terminology across UI copy, README, and docs in all three locales
- Functional behavior is unchanged

#### Hermes `Auto` api_mode Removed

- Users must pick an explicit protocol; new deeplinks default to `chat_completions`
- Eliminates URL-based heuristic surprises

#### Hermes Provider Form

- Added an API mode dropdown and per-provider model editor
- Binds per-provider models to the top-level `model:` when switching active providers

#### Hermes Deep Config Delegation

- Deep YAML knobs are no longer duplicated in the CC Switch form — they are delegated to the Hermes Web UI via a direct launch action

#### Hermes Toolbar Layout

- Swapped the Hermes Web UI button from `ExternalLink` to `LayoutDashboard` (clicking may spawn `hermes dashboard` rather than just opening a URL)
- Moved MCP to the final toolbar slot so Hermes matches the Claude / Codex / Gemini / OpenCode layout

#### `ANTHROPIC_REASONING_MODEL` Removed from Claude Quick-Set

- Decoupled the reasoning capability from model selection; the legacy field is no longer surfaced in the quick-set form

#### Per-Provider Proxy Config Removed

- Consolidated into global Local Routing
- Provider-level proxy toggle and associated storage are gone

#### Unified Toolbar Icon Button Width

- Normalized icon-button widths across Claude / Codex / Gemini / OpenCode / OpenClaw / Hermes panels for a consistent header look

#### Rust Toolchain Pinned to 1.95

- Adopted clippy 1.95 suggestions across the workspace and pinned the toolchain to prevent nightly drift

#### Tray Menu ID Constant

- The tray identifier moved from the hardcoded string `"main"` to a `TRAY_ID` constant (`"cc-switch"`) across all call sites (#1978, thanks @lidaxian121)

#### Copilot Premium Consumption Deep Optimization

A systematic overhaul to reduce Copilot reverse-proxy premium interaction consumption across multiple dimensions:

- **Proactive Thinking Block Stripping Before Forwarding**: Anthropic's `thinking` / `redacted_thinking` blocks are rejected by OpenAI-compatible endpoints. Previously, the request failed upstream, burning one premium interaction before the `thinking_rectifier` could retry. A new proactive strip step (Copilot optimization pipeline step 3.5, after `tool_result` merging) eliminates that wasted interaction
- **Request Classification Fix**: Messages containing `tool_result` are now classified as agent continuation instead of user-initiated, preventing every tool call from being falsely counted as a premium interaction
- **Subagent Detection**: Identifies subagents via `__SUBAGENT_MARKER__` with `metadata._agent_` fallback, setting `x-interaction-type=conversation-subagent`
- **Deterministic `x-interaction-id` Billing Merge**: Derives `x-interaction-id` from the session ID so multiple requests within the same session collapse into a single billing interaction
- **Orphan `tool_result` Sanitization**: Cleans up orphan `tool_result` entries to prevent upstream errors that would trigger retries and duplicate billing
- **Warmup Downgrade Enabled by Default**: Uses `gpt-5-mini` as the default downgrade model
- **Optimization Pipeline Reorder**: classify → sanitize → merge → warmup, so classification sees raw `tool_result` semantics
- Fixed a `CopilotOptimizerConfig` default-value inconsistency (unified to `gpt-5-mini`)

#### Usage Script Intranet Support

- Removed private-IP / suspicious-hostname blocking from usage scripts, unblocking enterprise intranet, Docker, and self-hosted API endpoints
- Built-in templates still enforce HTTPS (except localhost) and same-origin checks; custom templates remain user-controlled with those request-URL checks skipped

#### Failover Queue Notes

- Provider notes now appear in failover queue selectors and queue rows for easier identification across multi-provider queues (#2138, thanks @Coconut-Fish)

### Fixed

#### Header Auto-Compact Latching After Maximize

- The toolbar no longer stays compacted after maximize/restore; compaction now reevaluates on size changes

#### Hermes YAML Pollution & OAuth MCP `auth` Drop

- Round-tripping through CC Switch no longer drops OAuth MCP `auth` blocks or pollutes unrelated YAML keys
- Guard tests added via `tests/hermes_roundtrip.rs`

#### Hermes Active Provider Display

- Hermes UI now correctly surfaces the active provider and wires add / enable / remove actions

#### Hermes Provider Persistence

- Providers persist under `custom_providers:` so `api_mode` and `model` survive restarts and config reloads

#### Hermes Health Check Borrowing OpenClaw Schema

- Hermes providers were routed through `check_additive_app_stream` (the OpenClaw dispatcher), which reads camelCase `baseUrl` / `apiKey` / `api` and surfaced "OpenClaw provider is missing baseUrl" even when every Hermes field was filled
- Introduced `check_hermes_stream` with Hermes-specific extractors that map `api_mode` (`chat_completions` / `anthropic_messages` / `codex_responses`) to the matching `check_claude_stream` `api_format`; `bedrock_converse` returns as unsupported
- `api_mode` is now resolved before URL / API key extraction, so `bedrock_converse` users see the real cause rather than a misleading "missing base_url"

#### Usage Query Modal for Hermes & OpenClaw

- `getProviderCredentials` now reads flat `settingsConfig` fields for Hermes (snake_case `base_url` / `api_key`) and OpenClaw (camelCase `baseUrl` / `apiKey`), so the "official balance" template auto-selects for matching providers like SiliconFlow
- Refactored the BALANCE and TOKEN_PLAN test paths to reuse the precomputed `providerCredentials` instead of re-reading `env.ANTHROPIC_*` directly, fixing the "empty key" error for non-Claude apps even when the key was configured

#### Codex `cache_control` Preservation

- Preserve `cache_control` when merging system prompts during Codex format conversion (#1946, thanks @yovinchen)

#### Claude Prompt Cache Key Leak

- Stopped sending prompt cache keys during Claude chat conversions (#2003, thanks @yovinchen)

#### Proxy Hop-by-Hop Header Stripping

- Strip hop-by-hop response headers (Connection, Keep-Alive, Transfer-Encoding, etc.) per RFC 7230 (#2060, thanks @yovinchen)

#### Permissive Proxy CORS Removed

- Removed the permissive CORS layer from the proxy (#1915, thanks @zerone0x)

#### Backend Error Details in Proxy Toast

- Surface backend error payload details in proxy-related toast messages instead of a generic failure string

#### Usage Log Deduplication

- Deduplicated proxy and session-log usage records so the same request is no longer double-counted
- Synced the request log time range with the dashboard's 1d / 7d / 30d selector

#### Common Config Checkbox Persistence

- Checkbox state for Claude / Codex / Gemini common-config toggles now persists correctly across reopens (#2191, thanks @zxZeng)

#### Claude Plugin `settings.json` Sync

- Editing the current provider now syncs back to `settings.json` for the Claude plugin path (#1905, thanks @chengww5217)

#### Google Official Gemini Env Preservation

- Saving the Google Official Gemini provider no longer clobbers the `env` block

#### OpenCode JSON5 Parser for Trailing Commas

- OpenCode config reads now tolerate trailing commas via a JSON5 parser (#2023, thanks @wwminger)

#### Preset Refreshes

- Refreshed stale context windows for DeepSeek and Claude 1M
- Refreshed stale model IDs; backfilled Hermes model lists
- Fixed the Nous endpoint and replaced the Hermes placeholder icon with Nous brand artwork
- Pruned unused official Hermes presets

#### Auto-Expand Collapsed Messages on Search Hit

- Collapsed messages now auto-expand when a search match lands inside hidden content

#### Unknown Subscription Quota Tiers Hidden

- Provider cards no longer render unknown subscription quota tiers

#### Weekly Limit Label Unified

- Aligned the `weekly_limit` tier label with the official 7-day naming across locales

#### Root-Level Skill Repo Install

- Fixed skill installation when the repository root itself is a skill

#### Session ID Parsing Clippy

- Removed a redundant closure in session ID parsing (clippy warning)

#### Stream Check Default Models Refresh

- Updated stream-check default probe models to match each vendor's current lineup

#### Skills Import Sync

- Imported Skills are now immediately synced into enabled app directories instead of only being recorded in the database (#2101, thanks @yaoguohh)
- The UI no longer shows "installed" while the target app directory is missing the skill

#### Ghostty Session Restore

- Fixed Ghostty session restore launch by using shell execution with `--working-directory` (#1976, thanks @Suda202)
- Avoids `cwd` escaping issues when the path contains spaces or special characters

### Docs

#### README Sponsor Updates

- Updated SiliconFlow signup bonus to ¥16
- Trimmed the SSSAiCode sponsor blurb
- Updated partner logos
- Added LemonData as a new sponsor

#### Global Proxy Hint Clarified

- Clarified the global proxy hint about local routing across all three locales

#### Takeover → Routing Rename

- Renamed takeover docs to routing and updated anchors across all languages

#### PIPELLM Website URL

- Updated the PIPELLM sponsor website URL to `code.pipellm.ai`

### ⚠️ Breaking Changes

#### Hermes requires explicit `api_mode`

- The `Auto` mode is gone; imported or deeplinked providers default to `chat_completions`
- Users with prior `Auto` configs will be prompted to pick a protocol

#### `ANTHROPIC_REASONING_MODEL` removed from Claude quick-set

- The legacy field is no longer exposed; existing settings are cleaned up automatically

#### Per-provider proxy configuration removed

- Migrate to the global Local Routing setting
- Existing per-provider proxy values are ignored

#### Database schema v9 → v10

- Adds `enabled_hermes` columns to `mcp_servers` and `skills`
- Auto-migrated with `DEFAULT 0`; no data loss

#### Pricing table reseeded (v8 → v9)

- The `model_pricing` table is cleared and reseeded on first launch to pick up new models and corrected prices

#### XCodeAPI preset removed

- Users of the XCodeAPI preset should switch to another provider

### ⚠️ Risk Notice

This release inherits the risk notices originally introduced in v3.12.3 / v3.13.0 for reverse-proxy-style features.

**GitHub Copilot Reverse Proxy**: Using Copilot's reverse-proxy path may violate GitHub / Microsoft's terms of service. See [v3.12.3 release notes](v3.12.3-en.md#️-risk-notice).

**Codex OAuth Reverse Proxy**: Using the Codex OAuth reverse proxy with a ChatGPT subscription may violate OpenAI's terms of service. See [v3.13.0 release notes](v3.13.0-en.md#️-risk-notice).

By enabling these features, users **accept all associated risks**. CC Switch is not responsible for any account restrictions, warnings, or service suspensions that result from using these features.

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| OS      | Minimum Version         | Architecture                        |
| ------- | ----------------------- | ----------------------------------- |
| Windows | Windows 10 or later     | x64                                 |
| macOS   | macOS 12 (Monterey) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below         | x64                                 |

#### Windows

| File                                     | Description                                     |
| ---------------------------------------- | ----------------------------------------------- |
| `CC-Switch-v3.14.0-Windows.msi`          | **Recommended** - MSI installer, supports auto-update |
| `CC-Switch-v3.14.0-Windows-Portable.zip` | Portable, extract and run, no registry writes   |

#### macOS

| File                             | Description                                              |
| -------------------------------- | -------------------------------------------------------- |
| `CC-Switch-v3.14.0-macOS.dmg`    | **Recommended** - DMG installer, drag into Applications  |
| `CC-Switch-v3.14.0-macOS.zip`    | Extract and drag into Applications, Universal Binary     |
| `CC-Switch-v3.14.0-macOS.tar.gz` | For Homebrew installation and auto-update                |

> macOS builds are Apple code-signed and notarized — install directly.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended | Installation                                                           |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`      | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`      | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`      | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage` | Add execute permission and run, or use AUR                             |
| Other distros / not sure                | `.AppImage` | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.13.0] - 2026-04-10

> Lightweight Mode, Quota & Balance Visibility, Provider Model Auto-Fetch, Codex OAuth Reverse Proxy, and Tray Per-App Submenus

### Overview

CC Switch v3.13.0 is a major feature release centered on observability, provider workflow ergonomics, and proxy compatibility. It adds inline **quota and balance displays** across official Claude / Codex / Gemini providers plus Token Plan, Copilot, and third-party balance APIs; introduces a **Lightweight Mode** that keeps CC Switch running from the system tray without a main window; delivers **automatic model discovery** via OpenAI-compatible `/v1/models` across all five supported applications; ships a **Codex OAuth reverse proxy** for ChatGPT subscribers; reorganizes the tray menu into **per-app submenus**; rebuilds the proxy forwarding stack on a **Hyper-based client**; and overhauls the **Skills workflow** with discovery, batch updates, storage-location toggling, and built-in skills.sh search and install. Additional improvements include full URL endpoint mode, enhanced token usage tracking, the Copilot interaction optimizer, a UTF-8 streaming chunk boundary fix for multi-byte output, a Linux startup UI responsiveness fix, and a friendlier new-user onboarding experience.

### Highlights

- **Lightweight Mode**: Tray-only operating mode that destroys the main window on exit to tray and recreates it on demand, reducing CC Switch's desktop footprint to near zero when idle
- **Quota & Balance Visibility**: Inline quota or balance readout across provider cards — official Claude / Codex / Gemini subscriptions, GitHub Copilot premium interactions, Codex OAuth, Token Plan providers (Kimi / Zhipu GLM / MiniMax), plus official balance queries for DeepSeek, StepFun, SiliconFlow, OpenRouter, and Novita AI
- **Provider Model Auto-Fetch**: OpenAI-compatible `/v1/models` discovery across Claude, Codex, Gemini, OpenCode, and OpenClaw provider forms, with grouped dropdown selection and failure-specific error messages
- **Codex OAuth Reverse Proxy**: ChatGPT Codex reverse proxy exposed as a new Claude provider card type, allowing users to use their ChatGPT subscription in Claude Code. Includes managed OAuth login and inline subscription quota display ([⚠️ Risk Notice](#️-risk-notice))
- **Tray Per-App Submenus**: Reworked the tray menu into per-application submenus so it never overflows the screen and background provider switching scales to dozens of providers per app
- **Skills Discovery & Batch Updates**: SHA-256-based skill update detection, per-skill and "Update All" batch actions, `skills.sh` search integration, and a storage-location toggle between CC Switch storage and `~/.agents/skills`
- **Session Workflow Upgrades**: Batch session deletion, a directory picker before launching Claude terminal restore, usage import from Claude / Codex / Gemini session logs without proxy interception, precise Codex JSONL parsing, and per-app usage filtering
- **OpenCode / OpenClaw Stream Check Coverage**: OpenCode detection via npm package mapping, OpenClaw `openai-completions` support, and the remaining OpenClaw protocol variants — with custom-header passthrough and auth-header detection fixes
- **Full URL Endpoint Mode**: Provider option that treats `base_url` as a complete upstream endpoint, unblocking vendors that require nonstandard URL layouts
- **Hyper-based Proxy Forwarding Stack**: Refactored proxy forwarding onto a Hyper-based client with transparent header forwarding, improved endpoint rewriting, and better support for dynamic upstream endpoints
- **Copilot Interaction Optimizer**: Request classification and routing logic that reduces unnecessary GitHub Copilot premium interaction consumption
- **UTF-8 Stream Chunk Boundary Fix**: All four SSE streaming paths now preserve incomplete multi-byte UTF-8 sequences across TCP chunks, eliminating intermittent U+FFFD garbled output via the Copilot reverse proxy
- **Linux Startup UI Fix**: Fixed the long-standing issue where the window UI couldn't receive clicks on Linux until the user manually maximized and restored the window
- **First-Run Onboarding**: One-time welcome dialog on fresh installs, automatic seeding of Claude / OpenAI / Google official presets, and auto-import of OpenCode / OpenClaw live configurations on startup
- **Claude Session Titles & Search Highlighting**: Meaningful title extraction for Claude sessions using a priority chain (custom-title metadata → first user message → directory basename), plus keyword highlighting in Session Manager search results
- **URL-Based Provider Icons**: Dual rendering mode supporting Vite URL imports for large SVGs and raster images (PNG, JPG, WebP), keeping small SVGs inlined
- **New Provider Presets**: TheRouter, DDSHub, LionCCAPI, Shengsuanyun (胜算云), PIPELLM, and E-FlowCode across supported applications

### New Features

#### Lightweight Mode

A tray-only operating mode that dramatically reduces CC Switch's desktop footprint when idle.

- Destroys the main window on exit-to-tray instead of hiding it, freeing UI resources and memory
- Recreates the window on demand when the user reopens CC Switch from the tray, a deeplink, or single-instance activation
- Integrated into every window-re-show path: normal startup, deeplink, single_instance, tray `show_main`, and the lightweight-exit round-trip

#### Quota & Balance Visibility

Added inline quota and balance readouts to provider cards so users can see remaining capacity without leaving the card.

- **Official subscriptions**: Inline quota display for Claude, Codex, and Gemini official providers
- **GitHub Copilot**: Premium interactions quota display on the Copilot provider card
- **Codex OAuth**: ChatGPT subscription quota inline with the Codex OAuth provider card
- **Token Plan providers**: Kimi, Zhipu GLM, and MiniMax usage progression display (requires manual activation to avoid confusion)
- **Third-party balances**: Official balance queries for DeepSeek, StepFun, SiliconFlow, OpenRouter, and Novita AI (requires manual activation to avoid confusion)
- Health-check and usage-config buttons are hidden for official providers to keep the card clean

#### Provider Model Auto-Fetch

Added OpenAI-compatible model discovery to every provider form, removing the manual copy-paste loop for model IDs.

- Queries the configured provider endpoint's `/v1/models`
- Groups models in the dropdown by category for easier selection
- Failure-specific error messages distinguish network / authentication / endpoint issues
- Supported across all five applications: Claude, Codex, Gemini, OpenCode, and OpenClaw

#### Codex OAuth Reverse Proxy

Added a reverse proxy path for ChatGPT subscribers who want to use their ChatGPT subscription in Claude Code.

- Managed OAuth login flow with ChatGPT authentication
- Surfaces as a new Claude provider card type alongside API-key providers
- Inline subscription quota display
- Integrated into the Auth Center for unified token management
- See the [⚠️ Risk Notice](#️-risk-notice) below before enabling

#### Tray Per-App Submenus

Reorganized the tray menu so providers are grouped under each application instead of living in a flat list.

- Per-application submenus for Claude, Codex, Gemini, OpenCode, and OpenClaw
- Prevents the tray menu from overflowing the screen when users have many providers
- Background provider switching scales cleanly to long provider lists

#### Skills Discovery & Batch Updates

Upgraded the Skills management panel into a complete discovery plus maintenance workflow.

- **SHA-256 update detection**: Skills are content-hashed so the UI knows exactly which ones have upstream changes
- **Per-skill and batch updates**: Individual "Update" buttons plus an animated "Update All" batch action
- **Storage-location toggle**: Switch between CC Switch storage and `~/.agents/skills` without losing skill state
- **Public registry search**: `skills.sh` search integrated directly into the dialog for discovering community skills

#### Session Workflow Upgrades

Multiple session management improvements that reduce friction when working with Claude / Codex / Gemini sessions.

- **Batch session deletion**: Select and delete multiple sessions at once from Session Manager (#1693, thanks @Alexlangl)
- **Directory picker before restore**: Claude terminal restore now prompts for the working directory up front (#1752, thanks @yovinchen)
- **Usage from session logs without proxy**: Usage data imported directly from Claude / Codex / Gemini session logs — no proxy interception required
- **Precise Codex JSONL parsing**: Replaced estimated Codex usage with precise JSONL session-log parsing plus Codex model name normalization for consistent pricing lookup
- **Gemini CLI session log integration**: Gemini usage now syncs accurately from Gemini CLI session logs
- **Per-app usage filtering**: Filter the usage dashboard by Claude, Codex, or Gemini independently

#### OpenCode / OpenClaw Stream Check Coverage

Extended the Stream Check panel to cover the full OpenCode and OpenClaw surface area.

- OpenCode detection via npm package mapping
- Support for the OpenClaw `openai-completions` protocol
- Support for the remaining three OpenClaw protocol variants
- Edge-case handling for custom-header passthrough, OpenClaw custom auth-header detection, Bedrock error messaging, and OpenCode default `baseURL` fallback

#### Full URL Endpoint Mode

Added a provider option that treats `base_url` as a complete upstream endpoint instead of a base URL with path appending (#1561, thanks @yovinchen).

- Proxy forwarding and Stream Check both honor the full-URL mode
- Unblocks vendors that require nonstandard URL layouts
- Configurable per-provider on the provider form

#### OpenCode StepFun Step Plan Preset

- Added a StepFun Step Plan provider preset for OpenCode with sensible defaults (#1668, thanks @sky-wang-salvation)

#### Copilot Interaction Optimizer

Added request classification and routing logic that reduces unnecessary GitHub Copilot premium interaction consumption.

- Classifies incoming requests by intent and weight
- Routes low-value requests away from premium interaction consumption paths
- Designed to extend the usable lifetime of a Copilot subscription
- Note: Even with optimized consumption, using the Copilot API outside of Copilot still consumes more than using it within Copilot.

#### First-Run Welcome Dialog

Added a one-time welcome dialog on fresh installs to guide new users through the CC Switch workflow.

- Explains how existing live configuration is preserved as a default provider
- Introduces the bundled official preset that enables one-click revert to official endpoints
- Upgrade users are automatically excluded via empty provider check

#### Official Provider Seeding

- Added automatic seeding of Claude Official, OpenAI Official, and Google Official provider entries on startup, giving every user a one-click path back to the official endpoint

#### OpenCode / OpenClaw Auto-Import

- Added automatic startup import of live OpenCode and OpenClaw provider configurations, matching the auto-import behavior already present for Claude, Codex, and Gemini

#### Common Config Editor Guidance

- Added an informational guide and empty-state prompt to the Common Config snippet editor modal for Claude, Codex, and Gemini
- Added a one-time informational dialog explaining Common Config Snippets when users first open the provider add/edit form

#### Claude Session Titles & Search Highlighting

- Added meaningful title extraction for Claude sessions using a priority chain: custom-title metadata, first real user message, then directory basename fallback
- Added keyword highlighting in session titles and messages during Session Manager search

#### URL-Based Provider Icons

- Added a dual rendering mode to the icon system: small SVGs are inlined as React components, while large SVGs and raster images (PNG, JPG, WebP) are loaded via Vite URL imports as `<img>` tags

#### Kaku Terminal Support

- Added Kaku as a selectable terminal for session launch on macOS, reusing the WezTerm-compatible launch path (#1983, thanks @yovinchen)

#### OMO Slim Council Support

- Restored first-class council support as a built-in oh-my-opencode-slim agent with updated metadata and UI copy (#1982, thanks @yovinchen)

#### New Provider Presets

- **TheRouter**: Added across Claude, Codex, Gemini, OpenCode, and OpenClaw (#1891, #1892, thanks @cmzz)
- **DDSHub**: Added as a third-party partner provider for Claude with icon and partner promotion text
- **LionCCAPI**: Added across all five apps with anthropic-messages protocol for OpenCode and OpenClaw
- **Shengsuanyun (胜算云)**: Added as an aggregator partner provider across all five apps with URL-based icon and localized display name
- **PIPELLM**: Added across Claude, Codex, OpenCode, and OpenClaw with full model definitions and icon
- **E-FlowCode**: Added across all five apps with per-app protocol configuration

### Changes

#### Tray Menu Organization

- Reworked the tray menu into per-application submenus (Claude / Codex / Gemini / OpenCode / OpenClaw)
- Prevents overflow and scales to long provider lists

#### Proxy Forwarding Stack

Rebuilt the proxy forwarding layer on a Hyper-based HTTP client (#1714, thanks @yovinchen).

- Transparent header forwarding: headers are forwarded without aggressive filtering
- Improved endpoint rewriting logic
- Better support for dynamic upstream endpoints
- Paired with the new Full URL Endpoint Mode to unblock vendors with nonstandard URL layouts

#### OAuth Auth Center UI Polish

- Tightened the Auth Center copy, layout, and icon presentation so the Codex OAuth login flow feels cleaner and less cluttered

#### Provider Key Lifecycle & Live Sync

Reworked the additive provider create / rename / duplicate flows so live config writes, cleanup, and rollback stay consistent across OpenCode / OpenClaw and takeover scenarios (#1724, thanks @yovinchen).

- Additive-mode highlight behavior made persistent across refreshes (#1747, thanks @yovinchen)
- Consistent live config writes across OpenCode / OpenClaw
- Rollback behavior preserved when operations fail

#### Codex OAuth Defaults

- Updated the Codex OAuth preset to the GPT-5.4 model family

### Bug Fixes

#### Copilot Authentication & Proxy Compatibility

- Fixed GitHub Copilot authentication regressions (#1854, thanks @Mason-mengze)
- Corrected enterprise and dynamic endpoint handling
- Repaired clipboard verification-code copying on macOS and Linux
- Fixed Responses routing when Copilot-backed Claude providers target OpenAI models (#1735, thanks @Mason-mengze)

#### UTF-8 Stream Chunk Boundaries

Fixed intermittent garbled output (U+FFFD replacement characters) in Claude Code when multi-byte UTF-8 sequences such as Chinese characters and emoji were split across TCP stream chunks via the Copilot reverse proxy (#1923, thanks @Cod1ng).

- Replaced `String::from_utf8_lossy` with a new `append_utf8_safe` helper across all four SSE streaming paths
- Preserves incomplete trailing bytes in a remainder buffer and merges them with the next chunk before decoding
- Not reproducible with direct Copilot connections that pass through raw bytes without format conversion

#### Fragmented System Prompt Normalization

Fixed strict OpenAI-compatible chat backends (Nvidia, Qwen-style) rejecting requests when converted Claude payloads contained multiple system messages (#1942, thanks @yovinchen).

- Normalized system content into a single leading system message during the Anthropic → OpenAI chat transformation
- Leaves the rest of the message stream unchanged

#### Streaming Parser Compatibility

- Fixed SSE parsing to accept fields with optional spaces, improving compatibility with non-strict streaming implementations (#1664, thanks @Alexlangl)

#### Provider Switch State Corruption

- Serialized per-app provider switches to prevent concurrent failover or hot-switch operations from leaving `is_current`, settings state, and live backup state out of sync

#### Claude Takeover Live Config Drift

- Fixed provider edits while Claude takeover is active so live settings remain aligned with the latest provider state without breaking takeover restore behavior (#1828, thanks @geekdada)

#### WebDAV Password Retention & Validation

- Fixed the WebDAV password field so saved credentials remain visible after refresh
- Treated `MKCOL 405` responses correctly during connection validation (#1685, thanks @Alexlangl)

#### Provider Card Action States

- Fixed additive-mode highlight behavior (#1747, thanks @yovinchen)
- Aligned usage display layout across provider cards by always rendering action buttons
- Replaced hard proxy-switch blocking with a warning path
- Disabled unsupported test and usage actions for Copilot and Codex OAuth cards
- Hid usage-config and health-check buttons for official providers
- Removed the hover-push animation from provider cards

#### Usage Accuracy & Pricing

- Fixed MiniMax quota math and 0% → 100% progression
- Corrected CNY → USD pricing plus missing model definitions
- Improved Gemini session-log syncing accuracy
- Resolved session-based usage entries being shown as unknown providers

#### Usage Editor & Skills UI Regressions

- Fixed usage query fields being reset while editing extractor code (#1771, thanks @if-nil)
- Corrected broken `skills.sh` links and empty descriptions
- Fixed auto-query default interval (5 min) and number-input clearing in usage configuration

#### Chinese Skills Terminology

- Unified Skills-related labels across settings panels in the `zh` locale so storage and sync options use consistent wording

#### Environment & Preset Compatibility

- Added Bun global bin detection in CLI scan (#1742, thanks @makoMakoGo)
- Adapted to the oh-my-openagent rename with backward compatibility (#1746, thanks @yovinchen)
- Corrected the OpenCode `kimi-for-coding` preset (#1738, thanks @makoMakoGo)
- Gated Gemini keychain parsing to macOS only
- Fixed an OpenClaw serializer panic on empty collections (#1724, thanks @yovinchen)

#### Linux UI Unresponsive on Startup

Fixed a long-standing Linux bug where the window UI (including native title bar buttons) couldn't receive clicks until the user manually maximized and restored the window.

- **Root causes**: (1) Tauri webview did not acquire keyboard focus after `show()` on Linux, so the first click was consumed by X11/Wayland click-to-activate (Tauri #10746, wry #637); (2) GTK surface's input region failed to renegotiate on the `visible:false → show()` path under some WebKitGTK/compositor combinations, leaving the entire window unresponsive
- **Mitigations**: Set `WEBKIT_DISABLE_COMPOSITING_MODE=1` at startup, and added a new `linux_fix::nudge_main_window` helper that performs `set_focus` + a ±1px no-op resize ~200ms after show, equivalent to a visually invisible "maximize-and-restore"
- **Coverage**: Wired into all window-re-show paths — normal startup, deeplink, single_instance, tray `show_main`, and lightweight-mode exit

#### Linux Drag Region on Header

- Removed `data-tauri-drag-region` from the top header bar on Linux to avoid triggering `gtk_window_begin_move_drag` paths affected by Tauri #13440 under Wayland
- macOS drag behavior is preserved

#### OpenCode / OpenClaw Stream Check Edge Cases

- Fixed custom-header passthrough
- OpenClaw custom auth-header detection
- Bedrock error messaging
- OpenCode default `baseURL` fallback handling

#### Duplicate Toast on Provider Switch

- Fixed double toast notifications (proxy-required warning followed by switch-success) when switching to Copilot, ChatGPT, or OpenAI-format providers with the proxy not running

#### Session Search Accuracy & Chinese Support

- Fixed session search result truncation across providers
- Switched FlexSearch tokenizer to full mode for proper Chinese substring matching

#### Adaptive Thinking Reasoning Effort

- Fixed `resolve_reasoning_effort()` mapping adaptive thinking to `xhigh` instead of incorrectly using `high` in OpenAI format conversions

#### Thinking Model Fallback Display

- Fixed the Claude provider form showing an empty Thinking model field after saving only a main model by applying read-only fallback to ANTHROPIC_MODEL (#1984, thanks @yovinchen)

#### Auth Tab Localization

- Fixed missing i18n translation keys for the settings auth tab label across all locale bundles (#1985, thanks @yovinchen)

#### Schema Migration Guard

- Fixed database migrations failing when skills or model_pricing tables did not exist by adding table-existence checks before ALTER and UPDATE operations

### Documentation

#### User Manual Refresh

- Updated the EN / ZH / JA user manuals to cover tray submenus, lightweight mode, provider model fetching, session management, workspace files, WebDAV v2 behavior, OpenCode / OpenClaw activation, and other provider workflow improvements

#### Community & Contribution Docs

- Added `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md`
- Added bilingual GitHub issue and PR templates
- Added Dependabot configuration (#1829, thanks @bengbengbalabalabeng) and a stale-bot workflow for inactive issues
- Added a PR / push quality-checks CI workflow

#### Release Notes Risk Notice Backport

- Added a Copilot reverse proxy risk notice and anchored highlight links in the v3.12.3 release notes across all three languages

#### Sponsor Partners

- Added Shengsuanyun, LionCC, and DDS as sponsor partners in README across all languages

### ⚠️ Risk Notice

**Codex OAuth Reverse Proxy Disclaimer**

The Codex OAuth reverse proxy introduced in this release accesses ChatGPT Codex services through reverse-engineered OAuth flows. Please be aware of the following risks before enabling this feature:

1. **Terms of Service**: Using reverse-engineered OAuth flows to access OpenAI services may violate OpenAI's terms of service, which prohibit unauthorized automated access, service reproduction, and circumventing intended access paths.
2. **Account Risk**: OpenAI may flag unusual usage patterns as suspicious automated activity, potentially resulting in temporary or permanent restrictions on ChatGPT access.
3. **No Guarantee**: OpenAI may update its authentication and detection mechanisms at any time, and usage patterns that work today may be flagged in the future.

The **GitHub Copilot reverse proxy** introduced in v3.12.3 also remains subject to its existing risk notice — see the [v3.12.3 release notes](v3.12.3-en.md#️-risk-notice) for the full disclosure.

Users enable these features **at their own risk**. CC Switch is not responsible for any account restrictions, warnings, or service suspensions resulting from the use of these features.

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 12 (Monterey) or later    | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                       | Description                                          |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.13.0-Windows.msi`            | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.13.0-Windows-Portable.zip`   | Portable version, extract and run, no registry write |

#### macOS

| File                               | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `CC-Switch-v3.13.0-macOS.dmg`     | **Recommended** - DMG installer, drag to Applications, Universal Binary |
| `CC-Switch-v3.13.0-macOS.zip`     | ZIP archive, extract and drag to Applications, Universal Binary      |
| `CC-Switch-v3.13.0-macOS.tar.gz`  | For Homebrew installation and auto-update                            |

> macOS builds are code-signed and notarized by Apple for a seamless install experience.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.3] - 2026-03-24

> GitHub Copilot Reverse Proxy, macOS Code Signing & Notarization, Reasoning Effort Mapping, OpenCode SQLite Backend

### Overview

CC Switch v3.12.3 is a major feature release that adds GitHub Copilot reverse proxy support with a dedicated Auth Center, introduces macOS code signing and Apple notarization for a seamless install experience, maps reasoning effort levels across providers, migrates OpenCode to a SQLite backend, enables Tool Search via the native `ENABLE_TOOL_SEARCH` environment variable toggle, and delivers a full skill backup/restore lifecycle. Additional improvements include proxy gzip compression, o-series model compatibility, Skills import rework, Ghostty terminal fix, Skills cache strategy optimization, Claude 4.6 context window update, and multiple bug fixes.

### Highlights

- **GitHub Copilot reverse proxy**: Full Copilot proxy support with OAuth device flow authentication, token refresh, and request fingerprint emulation ([⚠️ Risk Notice](#️-risk-notice))
- **Copilot Auth Center**: Dedicated authentication management UI for GitHub Copilot OAuth flow with token status display and one-click refresh
- **macOS code signing & notarization**: macOS builds are now code-signed and notarized by Apple, eliminating the "unidentified developer" warning entirely
- **Reasoning Effort mapping**: Proxy-layer auto-mapping — explicit `output_config.effort` takes priority, falling back to `budget_tokens` thresholds (<4 000→low, 4 000–16 000→medium, ≥16 000→high) for o-series and GPT-5+ models
- **OpenCode SQLite backend**: Added SQLite session storage for OpenCode alongside existing JSON backend; dual-backend scan with SQLite priority on ID conflicts
- **Codex 1M context window toggle**: One-click checkbox to set `model_context_window = 1000000` with auto-populated `model_auto_compact_token_limit`
- **Disable Auto-Upgrade toggle**: Added `DISABLE_AUTOUPDATER` env var checkbox in the Claude Common Config editor to prevent Claude Code from auto-upgrading
- **Tool Search env var toggle**: Tool Search enabled via Claude 2.1.76+ native `ENABLE_TOOL_SEARCH` environment variable in the Common Config editor — no binary patching required
- **Skill backup/restore lifecycle**: Skills are automatically backed up before uninstall; backup list with restore and delete management added
- **Proxy gzip compression**: Non-streaming proxy requests now auto-negotiate gzip compression, reducing bandwidth usage
- **o-series model compatibility**: Chat Completions proxy correctly uses `max_completion_tokens` for o1/o3/o4-mini models; Responses API kept on the correct `max_output_tokens` field
- **Skills import rework**: Replaced implicit filesystem-based app inference with explicit `ImportSkillSelection` to prevent incorrect multi-app activation
- **Ghostty terminal support**: Fixed Claude session restore in Ghostty terminal

### New Features

#### GitHub Copilot Reverse Proxy

Added full reverse proxy support for GitHub Copilot, enabling Copilot-authenticated requests to be forwarded through CC Switch.

- Implements OAuth device flow authentication for GitHub Copilot
- Automatic token refresh and session management
- Request fingerprint emulation for seamless compatibility
- Integrated into the existing proxy infrastructure alongside Claude, Codex, and Gemini handlers

#### Copilot Auth Center

A dedicated authentication management UI for GitHub Copilot.

- OAuth device flow with code display and browser-based authorization
- Token status display showing expiration and validity
- One-click token refresh without re-authentication
- Integrated into the settings panel for easy access

#### Reasoning Effort Mapping

Proxy-layer auto-mapping of reasoning effort for OpenAI o-series and GPT-5+ models.

- Two-tier resolution: explicit `output_config.effort` takes priority, falling back to thinking `budget_tokens` thresholds (<4 000→low, 4 000–16 000→medium, ≥16 000→high)
- Covers both Chat Completions and Responses API paths with 17 unit tests

#### OpenCode SQLite Backend

Added SQLite session storage support for OpenCode alongside the existing JSON backend.

- Dual-backend scan with SQLite priority on ID conflicts
- Atomic session deletion and path validation
- JSON backend remains functional for backwards compatibility

#### Codex 1M Context Window Toggle

Added a one-click toggle for Codex 1M context window in the config editor.

- Checkbox sets `model_context_window = 1000000` in `config.toml`
- Auto-populates `model_auto_compact_token_limit = 900000` when enabled
- Unchecking removes both fields cleanly

#### Disable Auto-Upgrade Toggle

Added a checkbox in the Claude Common Config editor to disable Claude Code auto-upgrades.

- Sets `DISABLE_AUTOUPDATER=1` in the environment configuration when enabled
- Displayed alongside Teammates mode, Tool Search, and High Effort toggles

#### Tool Search Environment Variable Toggle

Tool Search is now enabled via the native `ENABLE_TOOL_SEARCH` environment variable introduced in Claude 2.1.76+.

- Toggle available in the Common Config editor under environment variables
- Sets `ENABLE_TOOL_SEARCH=1` in the Claude environment configuration
- No binary patching required — uses Claude's built-in support

#### macOS Code Signing & Notarization

macOS builds are now code-signed and notarized by Apple.

- Application signed with a valid Apple Developer certificate
- Notarized through Apple's notarization service for Gatekeeper approval
- DMG installer also signed and notarized
- Eliminates the "unidentified developer" warning on first launch

#### Skill Auto-Backup on Uninstall

Skill files are now automatically backed up before uninstall to prevent accidental data loss.

- Backups stored in `~/.cc-switch/skill-backups/` with all skill files and a `meta.json` containing original metadata
- Old backups are automatically pruned to keep at most 20
- Backup path is returned to the frontend and shown in the success toast

#### Skill Backup Restore & Delete

Added management commands for skill backups created during uninstall.

- List all available skill backups with metadata
- Restore copies files back to SSOT, saves the DB record, and syncs to the current app with rollback on failure
- Delete removes the backup directory after a confirmation dialog
- ConfirmDialog gains a configurable zIndex prop to support nested dialog stacking

### Changes

#### Skills Cache Strategy Optimization

Optimized the Skills cache invalidation strategy for better performance.

- Reduced unnecessary cache refreshes during skill operations
- Improved cache coherence between skill install/uninstall and list queries

#### Claude 4.6 Context Window Update

Updated Claude 4.6 model preset with the latest context window size.

- Reflects the expanded context window for Claude 4.6 models
- Updated in provider presets for accurate model information display

#### MiniMax M2.7 Upgrade

- Updated MiniMax provider preset to M2.7 model variant

#### Xiaomi MiMo Upgrade

- Updated Xiaomi MiMo provider preset to the latest model version

#### AddProviderDialog Simplification

- Removed redundant OAuth tab, reducing dialog from 3 tabs to 2 (app-specific + universal)

#### Provider Form Advanced Options Collapse

- Model mapping, API format, and other advanced fields in the Claude provider form now auto-collapse when empty
- Auto-expands when any value is set or when a preset fills them in; does not auto-collapse when manually cleared

#### Proxy Gzip Compression

Non-streaming proxy requests now support gzip compression for reduced bandwidth usage.

- Non-streaming requests let reqwest auto-negotiate gzip and transparently decompress responses
- Streaming requests conservatively keep `Accept-Encoding: identity` to avoid decompression errors on interrupted SSE streams

#### o1/o3 Model Compatibility

Proxy forwarding now handles OpenAI o-series model token parameters correctly.

- Chat Completions path uses `max_completion_tokens` instead of `max_tokens` for o1/o3/o4-mini models (#1451, thanks @Hemilt0n)
- Responses API path kept on the correct `max_output_tokens` field instead of incorrectly injecting `max_completion_tokens`

#### OpenCode Model Variants

- Placed OpenCode model variants at top level instead of inside options for better discoverability (#1317)

#### Skills Import Flow

The Skills import flow has been reworked for correctness and cleanup.

- Replaced implicit filesystem-based app inference with explicit `ImportSkillSelection` to prevent incorrect multi-app activation when the same skill directory exists under multiple app paths
- Added reconciliation to `sync_to_app` to remove disabled/orphaned symlinks
- MCP `sync_all_enabled` now removes disabled servers from live config
- Schema migration preserves a snapshot of legacy app mappings to avoid lossy reconstruction

### Bug Fixes

#### WebDAV Password Clearing

- Fixed an issue where the WebDAV password was silently cleared when saving unrelated settings

#### Tool Message Parsing

- Fixed incorrect parsing of tool-use messages in certain proxy response formats

#### Dark Mode Styling

- Fixed dark mode rendering inconsistencies in UI components

#### Copilot Request Fingerprint

- Fixed request fingerprint generation for Copilot proxy to match expected format

#### Provider Form Double Submit

- Prevented duplicate submissions on rapid button clicks in provider add/edit forms (#1352, thanks @Hexi1997)

#### Ghostty Session Restore

- Fixed Claude session restore in Ghostty terminal (#1506, thanks @canyonsehun)

#### Skill ZIP Import Extension

- Added `.skill` file extension support in ZIP import dialog (#1240, #1455, thanks @yovinchen)

#### Skill ZIP Install Target App

- ZIP skill installs now use the currently active app instead of always defaulting to Claude

#### OpenClaw Active Card Highlight

- Fixed active OpenClaw provider card not being highlighted (#1419, thanks @funnytime75)

#### Responsive Layout with TOC

- Improved responsive design when TOC title exists (#1491, thanks @West-Pavilion)

#### Import Skills Dialog White Screen

- Added missing TooltipProvider in ImportSkillsDialog to prevent runtime crash when opening the dialog

#### Panel Bottom Blank Area

- Replaced hardcoded `h-[calc(100vh-8rem)]` with `flex-1 min-h-0` across all content panels to eliminate bottom gap caused by mismatched offset values on different platforms

### Documentation

#### Pricing Model ID Normalization

- Added documentation section explaining model ID normalization rules (prefix stripping, suffix trimming, `@`→`-` replacement) in EN/ZH/JA user manuals (#1591, thanks @makoMakoGo)

#### macOS Signed Build Messaging

- Removed all `xattr` workaround instructions and "unidentified developer" warnings from README, README_ZH, installation guides (EN/ZH/JA), and FAQ pages (EN/ZH/JA); replaced with "signed and notarized by Apple" messaging

### ⚠️ Risk Notice

**GitHub Copilot Reverse Proxy Disclaimer**

The Copilot reverse proxy feature introduced in this release accesses GitHub Copilot services through reverse-engineered, unofficial APIs. Please be aware of the following risks before enabling this feature:

1. **Terms of Service**: This feature may violate [GitHub's Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) and [Terms for Additional Products and Features](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features), which prohibit excessive automated bulk activity, unauthorized service reproduction, and placing undue burden on servers through automated means.
2. **Account Risk**: There are documented cases of GitHub issuing warning emails to users of similar tools, citing "scripted interactions or otherwise deliberately unusual or strenuous" usage patterns. Continued use after a warning may result in temporary or permanent suspension of Copilot access.
3. **No Guarantee**: GitHub may update its detection mechanisms at any time, and usage patterns that work today may be flagged in the future.

Users enable this feature **at their own risk**. CC Switch is not responsible for any account restrictions, warnings, or service suspensions resulting from the use of this feature.

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 12 (Monterey) or later    | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                       | Description                                          |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.12.3-Windows.msi`            | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.12.3-Windows-Portable.zip`   | Portable version, extract and run, no registry write |

#### macOS

| File                               | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `CC-Switch-v3.12.3-macOS.dmg`     | **Recommended** - DMG installer, drag to Applications, Universal Binary |
| `CC-Switch-v3.12.3-macOS.zip`     | ZIP archive, extract and drag to Applications, Universal Binary      |
| `CC-Switch-v3.12.3-macOS.tar.gz`  | For Homebrew installation and auto-update                            |

> macOS builds are code-signed and notarized by Apple for a seamless install experience.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.2] - 2026-03-12

> Common Config Protection During Proxy Takeover, Snippet Lifecycle Stability, Section-Aware Codex TOML Editing

### Overview

CC Switch v3.12.2 is a reliability-focused patch release that addresses Common Config loss during proxy takeover and improves Codex TOML editing accuracy. Proxy takeover hot-switches and provider sync now update the restore backup instead of overwriting live config files; the startup sequence has been reordered so snippets are extracted from clean live files before takeover state is restored; and Codex `base_url` editing has been refactored into a section-aware model that no longer appends to the end of the file.

### Highlights

- **Empty state guidance**: Provider list empty state now shows detailed import instructions with a conditional Common Config snippet hint for Claude/Codex/Gemini

- **Proxy takeover restore flow rework**: Hot-switches and provider sync now refresh the restore backup instead of overwriting live config files, preserving the full user configuration on rollback
- **Snippet lifecycle stability**: Introduced a `cleared` flag to prevent auto-extraction from resurrecting cleared snippets, and reordered startup to extract from clean state
- **Section-aware Codex TOML editing**: `base_url` and `model` field reads/writes now target the correct `[model_providers.<name>]` section
- **Codex MCP config protection**: Existing `mcp_servers` blocks in restore snapshots survive provider hot-switches via per-server-id merge instead of wholesale replacement, with provider/common-config definitions winning on conflict

### New Features

#### Empty State Guidance

Improved the first-run experience with helpful guidance when the provider list is empty.

- Empty state page shows step-by-step import instructions
- Conditionally displays a Common Config snippet hint for Claude/Codex/Gemini providers (not shown for OpenCode/OpenClaw)

### Changes

#### Proxy Takeover Restore Flow

The proxy takeover hot-switch and provider sync logic has been reworked to protect Common Config throughout the takeover lifecycle.

- Provider sync now updates the restore backup instead of writing directly to live config files when takeover is active
- Effective provider settings are rebuilt with Common Config applied before saving restore snapshots, so rollback restores the real user configuration
- Legacy providers with inferred common config usage are automatically marked with `commonConfigEnabled=true`

#### Codex TOML Editing Engine

Codex `config.toml` update logic has been refactored onto shared section-aware TOML helpers.

- New Rust module `codex_config.rs` with `update_codex_toml_field` and `remove_codex_toml_base_url_if`
- New frontend utilities `getTomlSectionRange` / `getCodexProviderSectionName` for section-aware operations
- Inline TOML editing logic scattered across `proxy.rs` now delegates to the new module

#### Common Config Initialization Lifecycle

The startup sequence has been reordered for more robust snippet extraction and migration.

- Startup now auto-extracts Common Config snippets from clean live files before restoring proxy takeover state
- Introduced a snippet `cleared` flag to track whether a user intentionally cleared a snippet
- Persisted a one-time legacy migration flag to avoid repeated `commonConfigEnabled` backfills

### Bug Fixes

#### Common Config Loss

- Fixed multiple scenarios where Common Config could be dropped during proxy takeover: sync overwriting live files, hot-switches producing incomplete restore snapshots, and provider switches losing config changes

#### Codex Restore Snapshot Preservation

- Fixed Codex takeover restore backups discarding existing `mcp_servers` blocks during provider hot-switches; changed MCP backup preservation from wholesale table replacement to per-server-id merge so provider/common-config MCP updates win on conflict while backup-only servers are retained

#### Cleared Snippet Resurrection

- Fixed startup auto-extraction recreating Common Config snippets that users had intentionally cleared

#### Codex `base_url` Misplacement

- Fixed Codex `base_url` extraction and editing not targeting the correct `[model_providers.<name>]` section, causing it to append to the file tail or confuse `mcp_servers.*.base_url` entries for provider endpoints

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 10.15 (Catalina) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                       | Description                                          |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.12.2-Windows.msi`            | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.12.2-Windows-Portable.zip`   | Portable version, extract and run, no registry write |

#### macOS

| File                               | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `CC-Switch-v3.12.2-macOS.zip`      | **Recommended** - Extract and drag to Applications, Universal Binary |
| `CC-Switch-v3.12.2-macOS.tar.gz`   | For Homebrew installation and auto-update                            |

> **Note**: Since the author doesn't have an Apple Developer account, you may see an "unidentified developer" warning on first launch. Please close it, then go to "System Settings" -> "Privacy & Security" -> click "Open Anyway", and it will open normally afterwards.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.1] - 2026-03-12

> Stability Fixes, StepFun Presets, OpenClaw authHeader, and New Sponsor Partners

### Overview

CC Switch v3.12.1 is a patch release focused on stability improvements and bug fixes. It resolves a Common Config modal infinite reopen loop, a WebDAV sync foreign key constraint failure, and several i18n interpolation issues. It also adds **StepFun** provider presets, **OpenClaw input type selection** and **authHeader** support, upgrades the default Gemini model to **3.1-pro**, and welcomes four new sponsor partners.

### Highlights

- **Common Config modal fix**: Resolved an infinite reopen loop in the Common Config modal and added draft editing support
- **WebDAV sync reliability**: Fixed a foreign key constraint failure when restoring `provider_health` during WebDAV sync
- **StepFun presets**: Added StepFun (阶跃星辰) provider presets including the step-3.5-flash model
- **OpenClaw enhancements**: Added input type selection for model Advanced Options and `authHeader` field for vendor-specific auth header support
- **Gemini model upgrade**: Upgraded default Gemini model to 3.1-pro in provider presets
- **New sponsors**: Welcomed Micu API, XCodeAPI, SiliconFlow, and CTok as sponsor partners

### New Features

#### StepFun Provider Presets

Added provider presets for StepFun (阶跃星辰), a leading Chinese AI model provider.

- New preset entries for StepFun across supported applications
- Includes the step-3.5-flash model (#1369, thanks @hengm3467)

#### OpenClaw Enhancements

Enhanced the OpenClaw configuration with more granular control and better vendor compatibility.

- Added input type selection dropdown for model Advanced Options (#1368, thanks @liuxxxu)
- Added optional `authHeader` boolean to `OpenClawProviderConfig` for vendor-specific auth header support (e.g. Longcat), and refactored form state to reuse the shared type

#### Sponsor Partners

- **Micu API**: Added Micu API as sponsor partner with affiliate links
- **XCodeAPI**: Added XCodeAPI as sponsor partner
- **SiliconFlow**: Added SiliconFlow (硅基流动) as sponsor partner with affiliate links
- **CTok**: Added CTok as sponsor partner

### Changes

- **UCloud → Compshare**: Renamed UCloud provider to Compshare (优云智算) with full i18n support across all three locales (EN/ZH/JA)
- **Compshare Links**: Updated Compshare sponsor registration links to coding-plan page
- **Gemini Model Upgrade**: Upgraded default Gemini model from 2.5-pro to 3.1-pro in provider presets

### Bug Fixes

#### Common Config & UI

- Fixed an infinite reopen loop in the Common Config modal and added draft editing support to prevent data loss during edits
- Fixed toolbar compact mode not triggering on Windows due to left-side overflow (#1375, thanks @zuoliangyu)
- Fixed session search index not syncing with query data, causing stale list display after session deletion

#### Sync & Data

- Fixed foreign key constraint failure when restoring `provider_health` table during WebDAV sync

#### Provider & Preset

- Added missing `authHeader: true` to Longcat provider preset (#1377, thanks @wavever)
- Aligned OpenClaw tool permission profiles with upstream schema (#1355, thanks @bigsongeth)
- Corrected X-Code API URL from `www.x-code.cn` to `x-code.cc`

#### i18n & Localization

- Fixed stream check toast i18n interpolation keys not matching translation placeholders
- Fixed proxy startup toast not interpolating address and port values (#1399, thanks @Mason-mengze)
- Renamed OpenCode API format label from "OpenAI" to "OpenAI Responses" for accuracy

### Special Thanks

Thanks to all contributors for their contributions to this release!

@hengm3467 @liuxxxu @bigsongeth @zuoliangyu @wavever @Mason-mengze

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 10.15 (Catalina) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                       | Description                                          |
| ------------------------------------------ | ---------------------------------------------------- |
| `CC-Switch-v3.12.1-Windows.msi`            | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.12.1-Windows-Portable.zip`   | Portable version, extract and run, no registry write |

#### macOS

| File                               | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `CC-Switch-v3.12.1-macOS.zip`      | **Recommended** - Extract and drag to Applications, Universal Binary |
| `CC-Switch-v3.12.1-macOS.tar.gz`   | For Homebrew installation and auto-update                            |

> **Note**: Since the author doesn't have an Apple Developer account, you may see an "unidentified developer" warning on first launch. Please close it, then go to "System Settings" -> "Privacy & Security" -> click "Open Anyway", and it will open normally afterwards.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.12.0] - 2026-03-09

> Stream Check Returns, OpenAI Responses API Arrives, and OpenClaw / WebDAV Get a Major Upgrade

### Overview

CC Switch v3.12.0 is a feature release focused on provider compatibility, OpenClaw editing, Common Config usability, and sync/data reliability. It restores the **Model Health Check (Stream Check)** UI with improved stability, adds **OpenAI Responses API** format conversion, expands provider presets for **Ucloud**, **Micu**, **X-Code API**, **Novita**, and **Bailian For Coding**, and upgrades **WebDAV sync** with dual-layer versioning.

### Highlights

- **Stream Check returns**: Restored the model health check UI, added first-run confirmation, and fixed `openai_chat` provider support
- **OpenAI Responses API**: Added `api_format = "openai_responses"` with bidirectional conversion and shared conversion cleanup — simply select the Responses API format when adding a provider and enable proxy takeover, and you can use GPT-series models in Claude Code!
- **OpenClaw overhaul**: Introduced JSON5 round-trip config editing, a config health banner, better agent model selection, and a User-Agent toggle
- **Preset expansion**: Added Ucloud, Micu, X-Code API, Novita, and Bailian For Coding updates, plus SiliconFlow partner badge and model-role badges
- **Sync and maintenance improvements**: Added WebDAV protocol v2 + db-v6 versioning, daily rollups, incremental auto-vacuum, and sync-aware backup
- **Common Config usability improvements**: After updating a Common Config Snippet, it is now automatically applied when switching providers — no more manual checkbox needed

### Main Features

#### Model Health Check (Stream Check)

Restored the Stream Check panel for live provider validation, improving the reliability of provider management.

- Restored Stream Check UI panel with single and batch provider availability testing
- Added first-run confirmation dialog to prevent unsupported providers from showing misleading errors
- Fixed detection compatibility for `openai_chat` API format providers

#### OpenAI Responses API

Added native support for providers using the OpenAI Responses API with a new `openai_responses` API format.

- New `api_format = "openai_responses"` provider format option
- Bidirectional Anthropic Messages <-> OpenAI Responses API format conversion
- Consolidated shared conversion logic to reduce code duplication

#### Bedrock Request Optimizer

Added a PRE-SEND phase request optimizer for AWS Bedrock providers to improve compatibility and performance.

- PRE-SEND thinking + cache injection optimizer (#1301, thanks @keithyt06)

#### OpenClaw Config Enhancements

Comprehensive upgrade to the OpenClaw configuration editing experience with richer management capabilities.

- JSON5 round-trip write-back: preserves comments and formatting when editing configs
- EnvPanel JSON editing mode and `tools.profile` selection support
- New config validation warnings and config health status checks
- Improved agent model dropdown with recommended model fill from provider presets
- User-Agent toggle: optionally append OpenClaw identifier to requests (defaults to off)
- Legacy timeout configuration auto-migration

#### Provider Presets

New and expanded provider presets covering more providers and use cases.

- **Ucloud**: Added `endpointCandidates` and OpenClaw defaults, refreshed `templateValues` / `suggestedDefaults`
- **Micu**: Added preset defaults and OpenClaw recommended models
- **X-Code API**: Added Claude presets and `endpointCandidates`
- **Novita**: New provider preset (#1192, thanks @Alex-wuhu)
- **Bailian For Coding**: New provider preset (#1263, thanks @suki135246)
- **SiliconFlow**: Added partner badge
- **Model Role Badges**: Provider presets now support model-role badge display

#### WebDAV Sync Enhancements

WebDAV sync introduces dual-layer versioning for improved sync reliability and data safety.

- New WebDAV protocol v2 + db-v6 dual-layer versioning
- Confirmation dialog when toggling WebDAV auto-sync on/off to prevent accidental changes
- Sync-aware backup: uses a sync-specific backup variant that skips local-only table data

#### Usage & Data

Enhanced usage statistics and data maintenance capabilities for finer-grained data management, significantly reducing database growth rate.

- Daily rollups: aggregate usage data by day to reduce storage overhead
- Auto-vacuum: incremental database cleanup to maintain database health
- UsageFooter extra statistics fields (#1137, thanks @bugparty)

#### Other New Features

- **Session Deletion**: Per-provider session cleanup with path safety validation
- **Claude Auth Field Selector**: Restored authentication field selector
- **Failover Toggle on Main Page**: Moved the failover toggle to display independently on the main page with a first-use confirmation dialog
- **Common Config Auto-Extract**: On first run, automatically extracts common config snippets from live config files
- **New Provider Page Improvements**: Improved new provider page experience (#1155, thanks @wugeer)

### Architecture Improvements

#### Common Config Runtime Overlay

Common Config Snippets are now applied as a runtime overlay instead of being materialized into stored provider configs.

**Before**: Common Config content was merged directly into each provider's `settings_config` on save or switch. This caused shared configuration to be duplicated across every provider entry, requiring manual sync when changes were needed.

**After**: Common Config is only injected as a runtime overlay when switching providers and writing to the live file — provider entries themselves no longer contain shared configuration. This means modifying Common Config takes effect immediately without updating each provider individually.

#### Common Config Auto-Extract

On first run, if no Common Config Snippet exists in the database, one is automatically extracted from the current live config. This ensures users upgrading from older versions do not lose their existing shared configuration settings.

#### Periodic Maintenance Timer Consolidation

Consolidated daily rollups and auto-vacuum into a unified periodic maintenance timer, eliminating resource contention and complexity from multiple independent timers.

### Bug Fixes

#### Proxy & Streaming

- Fixed OpenAI ChatCompletion -> Anthropic Messages streaming conversion
- Added Codex `/responses/compact` route support (#1194, thanks @Tsukumi233)
- Improved TOML config merge logic to prevent key-value loss
- Improved proxy forwarder failure logs with additional diagnostic information

#### Provider & Preset Fixes

- Renamed X-Code to X-Code API for consistent branding
- Fixed SSSAiCode `/v1` path issue
- Removed incorrect `www` prefix from AICoding URLs
- Fixed new provider page line-break deletion issue (#1155, thanks @wugeer)

#### Platform Fixes

- Fixed cache hit token statistics not being reported (#1244, thanks @a1398394385)
- Fixed minimize-to-tray causing auto exit after some time (#1245, thanks @YewFence)

#### i18n Fixes

- Added 69 missing translation keys and removed remaining hardcoded Chinese strings
- Fixed model test panel i18n issues
- Normalized JSON5 slash escaping to prevent i18n string parsing errors

#### UI Fixes

- Fixed Skills count display (#1295, thanks @fzzv)
- Removed HTTP status code display from endpoint speed test to reduce visual noise
- Fixed outline button styling (#1222, thanks @Sube-py)

### Performance

- Skip unnecessary OpenClaw config writes when config is unchanged, reducing disk I/O

### Documentation

- Restructured the user manual for i18n and added complete EN/JA coverage
- Added OpenClaw usage documentation and completed settings documentation
- Added UCloud sponsor information
- Reorganized the docs directory and synced README feature sections across EN/ZH/JA

### Notes & Considerations

- **Common Config now uses runtime overlay**: Common Config Snippets are no longer materialized into each provider's stored config. They are dynamically applied at switch time. Modifying Common Config takes effect immediately without updating each provider.
- **Stream Check requires first-use confirmation**: A confirmation dialog appears when using the model health check for the first time. Testing proceeds only after confirmation.
- **OpenClaw User-Agent toggle defaults to off**: The User-Agent identifier must be manually enabled in the OpenClaw configuration.

### Special Thanks

Thanks to all contributors for their contributions to this release!

@keithyt06 @bugparty @Alex-wuhu @suki135246 @Tsukumi233 @wugeer @fzzv @Sube-py @a1398394385 @YewFence

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 10.15 (Catalina) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                     | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.12.0-Windows.msi`          | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.12.0-Windows-Portable.zip` | Portable version, extract and run, no registry write |

#### macOS

| File                             | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| `CC-Switch-v3.12.0-macOS.zip`    | **Recommended** - Extract and drag to Applications, Universal Binary |
| `CC-Switch-v3.12.0-macOS.tar.gz` | For Homebrew installation and auto-update                            |

> **Note**: Since the author doesn't have an Apple Developer account, you may see an "unidentified developer" warning on first launch. Please close it, then go to "System Settings" -> "Privacy & Security" -> click "Open Anyway", and it will open normally afterwards.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.11.1] - 2026-02-28

> Revert Partial Key-Field Merging, Restore Common Config Snippet & Bug Fixes

### Overview

CC Switch v3.11.1 is a hotfix release that reverts the **Partial Key-Field Merging** architecture introduced in v3.11.0, restoring the proven "**full config overwrite + Common Config Snippet**" mechanism. It also includes several UI and platform compatibility fixes.

### Highlights

- **Restore Full Config Overwrite + Common Config Snippet**: Reverted partial key-field merging due to critical data loss issues; restores full config snapshot write and Common Config Snippet UI
- **Proxy Panel Improvements**: Proxy toggle moved into panel body for better discoverability of takeover options
- **Theme & Compact Mode Fixes**: "Follow System" theme now auto-updates; compact mode exit works correctly
- **Windows Compatibility**: Disabled env check and one-click install to prevent protocol handler side effects

### Reverted

#### Restore Full Config Overwrite + Common Config Snippet

Reverted the partial key-field merging refactoring introduced in v3.11.0 (revert 992dda5c).

**Why reverted**: The partial key-field merging approach had three critical issues:
1. **Data loss on switch**: Non-whitelisted custom fields were silently dropped during provider switching
2. **Permanent backfill stripping**: Backfill permanently removed non-key fields from the database, causing irreversible data loss
3. **Maintenance burden**: The whitelist of "key fields" required constant maintenance as new config keys were added

**What's restored**:
- Full config snapshot write on provider switch (predictable, complete overwrite)
- Common Config Snippet UI and backend commands
- 6 frontend components/hooks (3 components + 3 hooks)

**Migration**:
- If you upgraded to v3.11.0 and your providers lost custom fields, re-import your config or manually re-add the missing fields
- Common Config Snippet is available again — use it to define shared config that should persist across provider switches

### Changed

- **Proxy Panel Layout**: Moved proxy on/off toggle from accordion header into panel content area, placed directly above app takeover options. This ensures users see takeover configuration immediately after enabling the proxy, avoiding the common mistake of enabling the proxy without configuring takeover
- **Manual Import for OpenCode/OpenClaw**: Removed auto-import on startup; empty state now shows an "Import Current Config" button, consistent with Claude/Codex/Gemini behavior

### Fixed

- **"Follow System" Theme Not Auto-Updating**: Delegated to Tauri's native theme tracking (`set_window_theme(None)`) so the WebView's `prefers-color-scheme` media query stays in sync with OS theme changes
- **Compact Mode Cannot Exit**: Restored `flex-1` on `toolbarRef` so `useAutoCompact`'s exit condition triggers correctly based on available width instead of content width
- **Proxy Takeover Toast Shows {{app}}**: Added missing `app` interpolation parameter to i18next `t()` calls for proxy takeover enabled/disabled messages
- **Windows Protocol Handler Side Effects**: Disabled environment check and one-click install on Windows to prevent unintended protocol handler registration

### Notes & Considerations

- **Common Config Snippet is back**: If you relied on this feature in v3.10.x and earlier, it works the same way again. Define shared config that should persist across all provider switches.
- **v3.11.0 Partial Key-Field Merging users**: If you noticed missing config fields after switching providers in v3.11.0, re-import your config to restore them.

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 10.15 (Catalina) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                     | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.11.1-Windows.msi`          | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.11.1-Windows-Portable.zip` | Portable version, extract and run, no registry write |

#### macOS

| File                             | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| `CC-Switch-v3.11.1-macOS.zip`    | **Recommended** - Extract and drag to Applications, Universal Binary |
| `CC-Switch-v3.11.1-macOS.tar.gz` | For Homebrew installation and auto-update                            |

> **Note**: Since the author doesn't have an Apple Developer account, you may see an "unidentified developer" warning on first launch. Please close it, then go to "System Settings" → "Privacy & Security" → click "Open Anyway", and it will open normally afterwards.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.11.0] - 2026-02-26

> OpenClaw Support, Session Manager, Backup Management & 50+ Improvements

### Overview

CC Switch v3.11.0 is a major update that adds full management support for **OpenClaw** as the fifth application, introduces a new **Session Manager** and **Backup Management** feature. Additionally, **Oh My OpenCode (OMO) integration**, the **partial key-field merging** architecture upgrade for provider switching, **settings page refactoring**, and many other improvements make the overall experience more polished.

### Highlights

- **OpenClaw Support**: Fifth managed application with 13 provider presets, Env/Tools/AgentsDefaults config editors, and Workspace file management
- **Session Manager**: Browse conversation history across all five apps with table-of-contents navigation and in-session search
- **Backup Management**: Independent backup panel with configurable policies, periodic backups, and pre-migration auto-backup
- **Oh My OpenCode Integration**: Full OMO config management with OMO Slim lightweight mode support
- **Partial Key-Field Merging (⚠️ Breaking Change)**: Provider switching now only replaces provider-related fields, preserving all other settings; the "Common Config Snippet" feature has been removed
- **Settings Page Refactoring**: 5-tab layout with ~40% code reduction
- **6 New Provider Presets**: AWS Bedrock, SSAI Code, CrazyRouter, AICoding, and more
- **Thinking Budget Rectifier**: Fine-grained thinking budget control
- **Theme Switch Animation**: Circular reveal transition animation
- **WebDAV Auto Sync**: Automatic sync with large file protection

### Main Features

#### OpenClaw Support (New Fifth App)

Full management support for OpenClaw, the fifth managed application following Claude Code, Codex, Gemini CLI, and OpenCode.

- **Provider Management**: Add, edit, switch, and delete OpenClaw providers with 13 built-in presets
- **Config Editors**: Three dedicated panels for Env (environment variables), Tools, and AgentsDefaults
- **Workspace Panel**: HEARTBEAT/BOOTSTRAP/BOOT file management and daily memory
- **Additive Overlay Mode**: Support config overlay instead of overwrite
- **Default Model Button**: One-click to fill recommended models; auto-register suggested models to allowlist when adding providers
- **Brand & Interaction**: Dedicated brand icon, fade-in/fade-out transition animation when switching apps
- **Deep Link Support**: Import OpenClaw provider configurations via URL
- **Full Internationalization**: Complete Chinese/English/Japanese support

#### Session Manager

A brand-new session manager to browse and search conversation history.

- Browse conversation history across Claude Code, Codex, Gemini CLI, OpenCode, and OpenClaw (#867, thanks @TinsFox)
- Table-of-contents navigation and in-session search
- Auto-filter by current app when entering the session page
- Parallel directory scanning + head-tail JSONL reading for optimized loading performance

#### Backup Management

An independent backup management panel for better data safety.

- Configurable backup policy: maximum backup count and auto-cleanup rules
- Hourly automatic backup timer during runtime
- Auto-backup before database schema migrations with backfill warning
- Support backup rename and deletion (with confirmation dialog)
- Backup filenames use local time for better clarity

#### Oh My OpenCode (OMO) Integration

Full Oh My OpenCode config file management.

- Agent model selection, category configuration, and recommended model fill (#972, thanks @yovinchen)
- Improved agent model selection UX with lowercase key fix (#1004, thanks @yovinchen)
- OMO Slim lightweight mode support
- OMO ↔ OMO Slim mutual exclusion (enforced at database level)

#### Workspace

- Full-text search across daily memory files, sorted by date
- Clickable directory paths for quick file location access

#### Toolbar

- AppSwitcher auto-collapses to compact mode based on available width
- Smooth transition animation for compact mode toggle

#### Settings

- First-use confirmation dialogs for proxy and usage features to prevent accidental operations
- New `enableLocalProxy` switch to control proxy UI visibility on home page
- More granular local environment checks: CLI tool version detection (#870, thanks @kv-chiu), Volta path detection (#969, thanks @myjustify)

#### Provider Presets

- **AWS Bedrock**: Support for AKSK and API Key authentication modes (#1047, thanks @keithyt06)
- **SSAI Code**: Partner preset across all five apps
- **CrazyRouter**: Partner preset with dedicated icon
- **AICoding**: Partner preset with i18n promotion text
- Updated domestic model provider presets to latest versions
- Renamed Qwen Coder to Bailian (#965, thanks @zhu-jl18)

#### Other New Features

- **Thinking Budget Rectifier**: Fine-grained thinking budget allocation control (#1005, thanks @yovinchen)
- **WebDAV Auto Sync**: Automatic sync with large file protection (#923, thanks @clx20000410; #1043, thanks @SaladDay)
- **Theme Switch Animation**: Circular reveal transition for a smoother visual experience (#905, thanks @funnytime75)
- **Claude Config Editor Quick Toggles**: Quick toggle switches for common settings (#1012, thanks @JIA-ss)
- **Dynamic Endpoint Hint**: Context-aware hint text based on API format selection (#860, thanks @zhu-jl18)
- **Usage Dashboard Enhancement**: Auto-refresh control and robust formatting (#942, thanks @yovinchen)
- **New Pricing Data**: claude-opus-4-6 and gpt-5.3-codex (#943, thanks @yovinchen)
- **Silent Startup Optimization**: Silent startup option only shown when launch-on-startup is enabled

### Architecture Improvements

#### Partial Key-Field Merging (⚠️ Breaking Change)

Provider switching now uses partial key-field merging instead of full config overwrite (#1098).

**Before**: Switching providers overwrote the entire `settings_config` to the live config file. This meant that any non-provider settings the user manually added to the live file (plugins, MCP config, permissions, etc.) would be lost on every switch. To work around this, previous versions offered a "Common Config Snippet" feature that let users define shared config to be merged on every switch.

**After**: Switching providers now only replaces provider-related key-values (API keys, endpoints, models, etc.), leaving all other settings intact. The "Common Config Snippet" feature is therefore no longer needed and has been removed.

**Impact & Migration**:
- If you **didn't use** Common Config Snippets, this change is fully transparent — switching just works better now
- If you **used** Common Config Snippets to preserve custom settings (MCP config, permissions, etc.), those settings are now automatically preserved during switches — no action needed
- If you used Common Config Snippets for other purposes (e.g., injecting extra config on every switch), please manually add those settings to your live config file after upgrading

This refactoring removed 6 frontend files (3 components + 3 hooks) and ~150 lines of backend dead code.

#### Manual Import Replaces Auto-Import

Startup no longer auto-imports external configurations. Users now click "Import Current Config" manually, preventing accidental data overwrites.

#### OmoVariant Parameterization

Eliminated ~250 lines of duplicated code in the OMO module via `OmoVariant` struct parameterization.

#### OMO Common Config Removal

Removed the two-layer merge system, reducing ~1,733 lines of code and simplifying the architecture.

#### ProviderForm Decomposition

Reduced ProviderForm component from 2,227 lines to 1,526 lines by extracting 5 independent modules (opencodeFormUtils, useOmoModelSource, useOpencodeFormState, useOmoDraftState, useOpenclawFormState), significantly improving maintainability.

#### Shared MCP/Skills Components

Extracted AppCountBar, AppToggleGroup, and ListItemRow shared components to reduce duplication across MCP and Skills panels (#897, thanks @PeanutSplash).

#### Settings Page Refactoring

Refactored settings page to a 5-tab layout (General | Proxy | Advanced | Usage | About), reducing SettingsPage code from ~716 to ~426 lines.

#### Other Improvements

- Unified terminal selection via global settings with WezTerm support added
- Updated Claude model references from 4.5 to 4.6

### Bug Fixes

#### Critical Fixes

- **Windows Home Dir Regression**: Restored default home directory resolution to prevent providers/settings "disappearing" when `HOME` env var differs from the real user profile directory in Git/MSYS environments
- **Linux White Screen**: Disabled WebKitGTK hardware acceleration on AMD GPUs (Cezanne/Radeon Vega) to prevent blank screen on startup (#986, thanks @ThendCN)
- **OpenAI Beta Parameter**: Stopped appending `?beta=true` to `/v1/chat/completions` endpoints, fixing request failures for Nvidia and other `apiFormat="openai_chat"` providers (#1052, thanks @jnorthrup)
- **Health Check Auth**: Health check now respects provider's `auth_mode` setting, preventing failures for proxy services that only support Bearer authentication (#824, thanks @Jassy930)

#### Provider Preset Fixes

- Fixed OpenClaw `/v1` prefix causing double path (/v1/v1/messages)
- Corrected Opus pricing ($15/$75 → $5/$25) and upgraded to 4.6
- Unified AIGoCode URL to `https://api.aigocode.com` across all apps
- Removed outdated partner status from Zhipu GLM presets
- Restored API Key input visibility when creating new Claude providers
- Hide quick toggles for non-active providers, show context-aware JSON editor hints

#### OMO Fixes

- Added missing omo-slim category checks across add/form/mutation paths
- Fixed OMO Slim query cache invalidation after provider mutations
- Synced OMO agent/category recommended models with upstream sources
- Added toast feedback for "Fill Recommended" button silent failures
- Removed last-provider deletion restriction for OMO/OMO Slim
- Reject saving OpenCode providers without configured models (#932, thanks @yovinchen)

#### OpenClaw Fixes

- Fixed 25 missing i18n keys, replaced key={index} with stable IDs, added deep link additive merge, and other code review issues
- Enhanced EnvPanel robustness (NaN guards, entry key names instead of array indices)
- Merged duplicate i18n keys to restore provider form translations

#### Platform Fixes

- Windows silent startup window flicker (#901, thanks @funnytime75)
- Title bar dark mode theme following (#903, thanks @funnytime75)
- Windows Skills path separator matching (#868, thanks @stmoonar)
- WSL helper functions conditional compilation

#### UI Fixes

- Toolbar height clipping causing AppSwitcher to be obscured
- Show update badge instead of green checkmark when newer version available
- Session Manager button only visible for Claude/Codex apps
- Unified SQL import/export card dark mode styling (#1067, thanks @SaladDay)

#### Other Fixes

- Replaced hardcoded Chinese strings in Session Manager with i18n keys
- Fixed Skill documentation URL branch and path resolution (#977, thanks @yovinchen)
- Added missing OpenCode install.sh installation path detection (#988, thanks @zhu-jl18)
- Fixed Skill ZIP symlink resolution (#1040, thanks @yovinchen)
- Added missing OpenCode checkbox in MCP add/edit form (#1026, thanks @yovinchen)
- Removed auto-import side effect from useProvidersQuery queryFn

### Performance

- Parallel directory scanning + head-tail JSONL reading for session panel, significantly improving session list loading speed
- Removed unnecessary TanStack Query cache overhead for Tauri local IPC calls

### Documentation

- Sponsor updates: SSSAiCode, Crazyrouter, AICoding, Right Code, MiniMax
- Added user manual documentation (#979, thanks @yovinchen)

### Notes & Considerations

- **OpenClaw is a newly supported app**: OpenClaw CLI must be installed first to use related features.
- **⚠️ Common Config Snippet feature has been removed**: Since provider switching now uses partial key-field merging (only replacing API keys, endpoints, models, etc.), user's other settings are automatically preserved, making Common Config Snippets unnecessary. See the "Architecture Improvements" section above for migration details.
- **Auto-import changed to manual**: External configurations are no longer auto-imported on startup. Click "Import Current Config" manually when needed.
- **OMO and OMO Slim are mutually exclusive**: Only one can be active at a time. Switching to one automatically disables the other.
- **Backup is enabled by default**: Automatic hourly backup during runtime. Adjust the policy in the Backup panel.

### Special Thanks

Thanks to all contributors for their contributions to this release!

@TinsFox @keithyt06 @kv-chiu @SaladDay @jnorthrup @JIA-ss @clx20000410 @ThendCN @yovinchen @zhu-jl18 @myjustify @funnytime75 @PeanutSplash @Jassy930 @stmoonar

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 10.15 (Catalina) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                     | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.11.0-Windows.msi`          | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.11.0-Windows-Portable.zip` | Portable version, extract and run, no registry write |

#### macOS

| File                             | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| `CC-Switch-v3.11.0-macOS.zip`    | **Recommended** - Extract and drag to Applications, Universal Binary |
| `CC-Switch-v3.11.0-macOS.tar.gz` | For Homebrew installation and auto-update                            |

> **Note**: Since the author doesn't have an Apple Developer account, you may see an "unidentified developer" warning on first launch. Please close it, then go to "System Settings" → "Privacy & Security" → click "Open Anyway", and it will open normally afterwards.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.10.0] - 2026-01-21

> OpenCode Support, Global Proxy, Claude Rectifier & Multi-App Experience Enhancements

### Overview

CC Switch v3.10.0 introduces OpenCode support, becoming the fourth managed CLI application.
This release also brings global proxy settings, Claude Rectifier (thinking signature fixer), enhanced health checks, per-provider configuration, and many other important features, along with comprehensive improvements to multi-app workflows and terminal experience.

### Highlights

- OpenCode Support: Full management of providers, MCP servers, and Skills with auto-import on first launch
- Global Proxy: Configure a unified proxy for all outbound network requests
- Claude Rectifier: Thinking signature fixer for better compatibility with third-party APIs
- Enhanced Health Checks: Configurable prompts and CLI-compatible request format
- Per-Provider Config: Persistent provider-specific configuration support
- App Visibility Control: Freely show/hide apps with synchronized tray menu updates
- Terminal Improvements: Provider-specific terminal buttons, fnm path support, cross-platform safe launch
- WSL Tool Detection: Detect tool versions in WSL environment with security hardening

### Main Features

#### OpenCode Support (New Fourth App)

- Complete OpenCode provider management: add, edit, switch, delete
- MCP server management: unified architecture with Claude/Codex/Gemini
- Skills support: OpenCode can also use Skills functionality
- Auto-import on first launch: automatically imports existing OpenCode configuration when detected
- Full internationalization: Chinese/English/Japanese support (#695)

#### Global Proxy

- Configure a unified proxy for all outbound network requests (#596, thanks @yovinchen)
- Supports HTTP/HTTPS proxy protocols
- Suitable for network environments requiring proxy access to external APIs

#### Claude Rectifier (Thinking Signature Fixer)

- Automatically fixes Claude API thinking signatures (#595, thanks @yovinchen)
- Resolves incompatible thinking block formats returned by some third-party API gateways
- Can be enabled/disabled in Advanced Settings

#### Enhanced Health Checks

- Configurable custom prompts for streaming health checks (#623, thanks @yovinchen)
- Supports CLI-compatible request format for better simulation of real usage scenarios
- Improves fault detection accuracy

#### Per-Provider Config

- Support for saving configuration separately for each provider (#663, thanks @yovinchen)
- Persistent configuration: provider-specific settings retained after restart
- Suitable for scenarios where different providers require different configurations

#### App Visibility Control

- Freely show/hide any app (Gemini hidden by default)
- Tray menu automatically syncs visibility settings
- Hidden apps won't appear in the main interface or tray menu

#### Takeover Compact Mode

- Automatically uses compact layout when 3 or more visible apps are displayed
- Optimizes space utilization in multi-app scenarios

#### Terminal Improvements

- Provider-specific terminal button: one-click to use current provider in terminal (#564, thanks @kkkman22)
- `fnm` path support: automatically recognizes Node.js paths managed by fnm
- Cross-platform safe launch: improved terminal launch logic for Windows/macOS/Linux

#### WSL Tool Detection

- Detect tool versions in WSL environment (#627, thanks @yovinchen)
- Added security hardening to prevent command injection risks

#### Skills Preset Enhancements

- Added `baoyu-skills` preset repository
- Automatically supplements missing default repositories for out-of-the-box experience

### Experience Improvements

- Keyboard shortcuts: Press `ESC` to quickly return/close panels (#670, thanks @xxk8)
- Simplified proxy logs: cleaner and more readable output (#585, thanks @yovinchen)
- Pricing editor UX: unified `FullScreenPanel` style
- Advanced settings layout: Rectifier section moved below Failover for better logical flow
- OpenRouter compatibility mode: disabled by default, UI toggle hidden (reduces clutter)

### Bug Fixes

#### Proxy & Failover

- Immediately switch to P1 when auto-failover is enabled (instead of waiting for next request)

#### Provider Management

- Fixed stale data when reopening provider edit dialog after save (#654, thanks @YangYongAn)
- Fixed baseUrl and apiKey state not resetting when switching presets
- Fixed endpoint auto-selection state not persisting (#611, thanks @yovinchen)
- Automatically apply default color when icon color is not set

#### Deep Links

- Support multi-endpoint import (#597, thanks @yovinchen)
- Prefer `GOOGLE_GEMINI_BASE_URL` over `GEMINI_BASE_URL`

#### MCP

- Skip `cmd /c` wrapper for WSL target paths (#592, thanks @cxyfer)

#### Usage Templates

- Added variable hints, fixed validation issues (#628, thanks @YangYongAn)
- Prevent configuration leakage between providers
- Usage block offset automatically adapts to action button width (#613, thanks @yovinchen)

#### Gemini

- Convert timeout parameters to Gemini CLI format (#580, thanks @cxyfer)

#### UI

- Fixed Select dropdown rendering issues in `FullScreenPanel`

### Notes & Considerations

- **OpenCode is a newly supported app**: OpenCode CLI must be installed first to use related features.
- **Global proxy affects all outbound requests**: including usage queries, health checks, and other network operations.
- **Rectifier is experimental**: can be disabled in Advanced Settings if issues occur.

### Special Thanks

Thanks to @yovinchen @YangYongAn @cxyfer @xxk8 @kkkman22 @Shuimo03 for their contributions to this release!
Thanks to @libukai for designing the elegant failover-related UI!

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                | Architecture                        |
| ------- | ------------------------------ | ----------------------------------- |
| Windows | Windows 10 or later            | x64                                 |
| macOS   | macOS 10.15 (Catalina) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                | x64                                 |

#### Windows

| File                                     | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `CC-Switch-v3.10.0-Windows.msi`          | **Recommended** - MSI installer with auto-update     |
| `CC-Switch-v3.10.0-Windows-Portable.zip` | Portable version, extract and run, no registry write |

#### macOS

| File                             | Description                                                        |
| -------------------------------- | ------------------------------------------------------------------ |
| `CC-Switch-v3.10.0-macOS.zip`    | **Recommended** - Extract and drag to Applications, Universal Binary |
| `CC-Switch-v3.10.0-macOS.tar.gz` | For Homebrew installation and auto-update                          |

> **Note**: Since the author doesn't have an Apple Developer account, you may see an "unidentified developer" warning on first launch. Please close it, then go to "System Settings" → "Privacy & Security" → click "Open Anyway", and it will open normally afterwards.

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation Method                                                    |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Add execute permission and run directly, or use AUR                    |
| Other distributions / Unsure            | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |

---

## [3.9.0] - 2026-01-07

> Local API Proxy, Auto Failover, Universal Provider, and a more complete multi-app workflow

### Overview

CC Switch v3.9.0 is the stable release of the v3.9 beta series (`3.9.0-1`, `3.9.0-2`, `3.9.0-3`).
It introduces a local API proxy with per-app takeover, automatic failover, universal providers, and many stability and UX improvements across Claude Code, Codex, and Gemini CLI.

### Highlights

- Local API Proxy for Claude Code / Codex / Gemini CLI
- Auto Failover with circuit breaker and per-app failover queues
- Universal Provider: one shared config synced across apps (ideal for API gateways like NewAPI)
- Skills improvements: multi-app support, unified management with SSOT + React Query
- Common config snippets: extract reusable snippets from the editor or the current provider
- MCP import: import MCP servers from installed apps
- Usage improvements: auto-refresh, cache hit/creation metrics, and timezone fixes
- Linux packaging: RPM and Flatpak artifacts

### Major Features

#### Local API Proxy

- Runs a local high-performance HTTP proxy server (Axum-based)
- Supports Claude Code, Codex, and Gemini CLI with a unified proxy
- Per-app takeover: you can independently decide which app routes through the proxy
- Live config takeover: backs up and redirects the CLI live config to the local proxy when takeover is enabled
- Monitoring: request logging and usage statistics for easier debugging and cost tracking
- Error request logging: keep detailed logs for failed proxy requests to simplify debugging (#401, thanks @yovinchen)

#### Auto Failover (Circuit Breaker)

- Automatically detects provider failures and triggers protection (circuit breaker)
- Automatically switches to a backup provider when the current one is unhealthy
- Tracks provider health in real time, and keeps independent failover queues per app
- When failover is disabled, timeout/retry related settings no longer affect normal request flow

#### Skills Management

- Multi-app Skills support for Claude Code and Codex, with smoother migration from older skill layouts (#365, #378, thanks @yovinchen)
- Unified Skills management architecture (SSOT + React Query) for more consistent state and refresh behavior
- Better discovery UX and performance:
  - Skip hidden directories during discovery
  - Faster discovery with long-lived caching for discoverable skills
  - Clear loading indicators and more discoverable header actions (import/refresh)
  - Fix wrong skill repo branch (#505, thanks @kjasn)

#### Universal Provider

- Add a shared provider configuration that can sync to Claude/Codex/Gemini (#348, thanks @Calcium-Ion)
- Designed for API gateways that support multiple protocols (e.g., NewAPI)
- Allows per-app default model mapping under a single provider

#### Common Config Snippets (Claude/Codex/Gemini)

- Maintain a reusable "common config" snippet and merge/append it into providers that enable it
- New extraction workflow:
  - Extract from the editor content (what you are currently editing)
  - Or extract from the current active provider when the editor content is not provided
- Codex extraction is safer:
  - Removes provider-specific sections like `model_provider`, `model`, and the entire `model_providers` table
  - Preserves `base_url` under `[mcp_servers.*]` so MCP configs are not accidentally broken

#### MCP Management

- Import MCP servers from installed apps
- Improve robustness: skip sync when the target CLI app is not installed; handle invalid Codex `config.toml` gracefully (#461, thanks @majiayu000)
- Windows compatibility: wrap npx/npm commands with `cmd /c` for MCP export

#### Usage & Pricing

- Usage & pricing improvements: auto-refresh, cache hit/creation metrics, timezone handling fixes, and refreshed built-in pricing table (#508, thanks @yovinchen)
- DeepLink support: import usage query configuration via deeplink (#400, thanks @qyinter)
- Model extraction for usage statistics (#455, thanks @yovinchen)
- Usage query credentials can fall back to provider config (#360, thanks @Sirhexs)

### UX Improvements

- Provider search filter: quickly find providers by name (#435, thanks @TinsFox)
- Provider icon colors: customize provider icon colors for quicker visual identification (#385, thanks @yovinchen)
- Keyboard shortcut: `Cmd/Ctrl + ,` opens Settings (#436, thanks @TinsFox)
- Skip Claude Code first-run confirmation dialog (optional)
- Closable toasts: close buttons for switch toast and all success toasts (#350, thanks @ForteScarlet)
- Update badge navigation: clicking the update badge opens the About tab
- Settings page tab style improvements (#342, thanks @wenyuanw)
- Smoother transitions: fade transitions for app/view switching and exit animations for panels
- Proxy takeover active theme: apply an emerald theme while takeover is active
- Dark mode readability improvements for forms and labels
- Better window dragging area for full-screen panels (#525, thanks @zerob13)

### Platform Notes

#### Windows

- Prevent terminal windows from appearing during version checks
- Improve window sizing defaults (minimum width/height)
- Fix black screen on startup by using the system titlebar
- Add a fallback for `crypto.randomUUID()` on older WebViews

#### macOS

- Use `.app` bundle path for autostart to avoid terminal window popups (#462, thanks @majiayu000)
- Improve tray/icon behavior and header alignment

### Packaging

- Linux: RPM and Flatpak packaging targets are now available for building release artifacts

### Notes

- Security improvements for the JavaScript executor and usage script execution (#151, thanks @luojiyin1987).
- SQL import is restricted to CC Switch exported backups to reduce the risk of importing unsafe or incompatible SQL dumps.
- Proxy takeover modifies CLI live configs; CC Switch will back up the live config before redirecting it to the local proxy. If you want to revert, disable takeover/stop the proxy and restore from the backup when needed.

### Special Thanks

Special thanks to @xunyu @deijing @su-fen for their support and contributions. This release wouldn't be possible without you!

### Download & Installation

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the appropriate version.

#### System Requirements

| System  | Minimum Version                 | Architecture                        |
| ------- | ------------------------------- | ----------------------------------- |
| Windows | Windows 10 or later             | x64                                 |
| macOS   | macOS 10.15 (Catalina) or later | Intel (x64) / Apple Silicon (arm64) |
| Linux   | See table below                 | x64                                 |

#### Windows

| File                                    | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| `CC-Switch-v3.9.0-Windows.msi`          | **Recommended** - MSI installer with auto-update support |
| `CC-Switch-v3.9.0-Windows-Portable.zip` | Portable version, no installation required         |

#### macOS

| File                            | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| `CC-Switch-v3.9.0-macOS.zip`    | **Recommended** - Extract and drag to Applications, Universal Binary |
| `CC-Switch-v3.9.0-macOS.tar.gz` | For Homebrew installation and auto-update                         |

> **Note**: Since the author does not have an Apple Developer account, you may see an "unidentified developer" warning on first launch. Close the app, then go to "System Settings" → "Privacy & Security" → click "Open Anyway", and it will open normally afterwards.

#### Homebrew (MacOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

#### Linux

| Distribution                            | Recommended Format | Installation                                                           |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| Ubuntu / Debian / Linux Mint / Pop!\_OS | `.deb`             | `sudo dpkg -i CC-Switch-*.deb` or `sudo apt install ./CC-Switch-*.deb` |
| Fedora / RHEL / CentOS / Rocky Linux    | `.rpm`             | `sudo rpm -i CC-Switch-*.rpm` or `sudo dnf install ./CC-Switch-*.rpm`  |
| openSUSE                                | `.rpm`             | `sudo zypper install ./CC-Switch-*.rpm`                                |
| Arch Linux / Manjaro                    | `.AppImage`        | Make executable and run directly, or use AUR                           |
| Other distros / Unsure                  | `.AppImage`        | `chmod +x CC-Switch-*.AppImage && ./CC-Switch-*.AppImage`              |
| Sandboxed installation                  | `.flatpak`         | `flatpak install CC-Switch-*.flatpak`                                  |

---

## [3.8.0] - 2025-11-28

> Persistence Architecture Upgrade, Laying the Foundation for Cloud Sync

### Overview

CC Switch v3.8.0 is a major architectural upgrade that restructures the data persistence layer and user interface, laying the foundation for future cloud sync and local proxy features.

**Commits**: 51 commits since v3.7.1
**Code Changes**: 207 files, +17,297 / -6,870 lines

### Major Updates

#### Persistence Architecture Upgrade

Migrated from single JSON file storage to SQLite + JSON dual-layer architecture for hierarchical data management.

**Architecture Changes**:

```
v3.7.x (Old)                     v3.8.0 (New)
┌─────────────────┐              ┌─────────────────────────────────┐
│  config.json    │              │  SQLite (Syncable Data)         │
│  ┌───────────┐  │              │  ├─ providers     Provider cfg  │
│  │ providers │  │              │  ├─ mcp_servers   MCP servers   │
│  │ mcp       │  │     ──>      │  ├─ prompts       Prompts       │
│  │ prompts   │  │              │  ├─ skills        Skills        │
│  │ settings  │  │              │  └─ settings      General cfg   │
│  └───────────┘  │              ├─────────────────────────────────┤
└─────────────────┘              │  JSON (Device-level Data)       │
                                 │  └─ settings.json Local settings│
                                 │     ├─ Window position          │
                                 │     ├─ Path overrides           │
                                 │     └─ Current provider ID      │
                                 └─────────────────────────────────┘
```

**Dual-layer Structure Design**:

| Layer      | Storage | Data Types                      | Sync Strategy   |
| ---------- | ------- | ------------------------------- | --------------- |
| Cloud Sync | SQLite  | Providers, MCP, Prompts, Skills | Future syncable |
| Device     | JSON    | Window state, local paths       | Stays local     |

**Technical Implementation**:

- **Schema Version Management** - Supports database structure upgrade migrations
- **SQL Import/Export** - `backup.rs` supports SQL dump for cloud storage
- **Transaction Support** - SQLite native transactions ensure data consistency
- **Auto Migration** - Automatically migrates from `config.json` on first launch

**Modular Refactoring**:

```
database/
├── mod.rs              Core Database struct and initialization
├── schema.rs           Table definitions, schema version migrations
├── backup.rs           SQL import/export, binary snapshot backup
├── migration.rs        JSON → SQLite data migration engine
└── dao/                Data Access Object layer
    ├── providers.rs    Provider CRUD
    ├── mcp.rs          MCP server CRUD
    ├── prompts.rs      Prompts CRUD
    ├── skills.rs       Skills CRUD
    └── settings.rs     Key-value settings storage
```

#### Brand New User Interface

Completely redesigned UI providing a more modern visual experience.

**Visual Improvements**:

- Redesigned interface layout
- Unified component styles
- Smoother transition animations
- Optimized visual hierarchy

**Interaction Enhancements**:

- Redesigned header toolbar
- Unified ConfirmDialog styling
- Disabled overscroll bounce effect on main view
- Improved form validation feedback

**Compatibility Adjustments**:

- Downgraded Tailwind CSS from v4 to v3.4 for better browser compatibility

#### Japanese Language Support

Added Japanese interface support, expanding internationalization to three languages.

**Supported Languages**:

- Simplified Chinese
- English
- Japanese (New)

### New Features

#### Skills Recursive Scanning

Skills management system now supports recursive scanning of repository directories, automatically discovering nested skill files.

**Improvements**:

- Support for multi-level directory structures
- Automatic discovery of all `SKILL.md` files
- Allow same-named skills from different repositories (using full path for deduplication)

#### Provider Icon Configuration

Provider presets now support custom icon configuration.

**Features**:

- Preset providers include default icons
- Icon settings preserved when duplicating providers
- Custom icon colors

#### Enhanced Form Validation

Provider forms now include required field validation with friendlier error messages.

**Improvements**:

- Real-time validation for required fields
- Unified Toast notifications for validation errors
- Clearer error messages

#### Auto Launch on Startup

Added auto-launch functionality supporting Windows, macOS, and Linux platforms.

**Features**:

- One-click enable/disable in settings
- Implemented using platform-native APIs
- Windows uses Registry, macOS uses LaunchAgent, Linux uses XDG autostart

#### New Provider Presets

- **MiniMax** - Official partner

### Bug Fixes

#### Critical Fixes

**Custom Endpoints Lost Issue**

Fixed an issue where custom request URLs were unexpectedly lost when updating providers.

- Root Cause: `INSERT OR REPLACE` executes `DELETE + INSERT` under the hood in SQLite, triggering foreign key cascade deletion
- Fix: Changed to use `UPDATE` statement for existing providers

**Gemini Configuration Issues**

- Fixed custom provider environment variables not correctly written to `.env` file
- Fixed security auth config incorrectly written to other config files

**Provider Validation Issues**

- Fixed validation error when current provider ID doesn't exist
- Fixed icon fields lost when duplicating providers

#### Platform Compatibility

**Linux**

- Resolved WebKitGTK DMA-BUF rendering issue
- Preserve user `.desktop` file customizations

#### Other Fixes

- Fixed redundant usage queries when switching apps
- Fixed DMXAPI preset using wrong auth token field
- Fixed missing translation keys in deeplink components
- Fixed usage script template initialization logic

### Technical Improvements

#### Architecture Refactoring

**Provider Service Modularization**:

```
services/provider/
├── mod.rs          Core service - add/update/delete/switch/validate
├── live.rs         Live config file operations
├── gemini_auth.rs  Gemini auth type detection
├── endpoints.rs    Custom endpoint management
└── usage.rs        Usage script execution
```

**Deeplink Modularization**:

```
deeplink/
├── mod.rs       Module exports
├── parser.rs    URL parsing
├── provider.rs  Provider import logic
├── mcp.rs       MCP import logic
├── prompt.rs    Prompt import
├── skill.rs     Skills import
└── utils.rs     Utility functions
```

#### Code Quality

**Cleanup**:

- Removed legacy JSON-era import/export dead code
- Removed unused MCP type exports
- Unified error handling approach

**Test Updates**:

- Migrated tests to SQLite database architecture
- Updated component tests to match current implementation
- Fixed MSW handlers to adapt to new API

### Technical Statistics

```
Overall Changes:
- Commits: 51
- Files: 207 files changed
- Additions: +17,297 lines
- Deletions: -6,870 lines
- Net: +10,427 lines

Commit Type Distribution:
- fix: 25 (Bug fixes)
- refactor: 11 (Code refactoring)
- feat: 9 (New features)
- test: 1 (Testing)
- other: 5

Change Area Distribution:
- Frontend source: 112 files
- Rust backend: 63 files
- Test files: 20 files
- i18n files: 3 files
```

### Migration Guide

#### Upgrading from v3.7.x

**Auto Migration** - Executes automatically on first launch:

1. Detects if `config.json` exists
2. Migrates all data to SQLite within a transaction
3. Migrates device-level settings to `settings.json`
4. Shows migration success notification

**Data Safety**:

- Original `config.json` file is preserved (not deleted)
- Error dialog displayed on migration failure, `config.json` preserved
- Supports Dry-run mode to verify migration logic

### Download & Installation

#### System Requirements

- **Windows**: Windows 10+
- **macOS**: macOS 10.15 (Catalina)+
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+

#### Download Links

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download:

- **Windows**: `CC-Switch-v3.8.0-Windows.msi` or `-Portable.zip`
- **macOS**: `CC-Switch-v3.8.0-macOS.tar.gz` or `.zip`
- **Linux**: `CC-Switch-v3.8.0-Linux.AppImage` or `.deb`

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

### Acknowledgments

#### Contributors

Thanks to all contributors who made this release possible:

- [@YoVinchen](https://github.com/YoVinchen) - UI and database refactoring
- [@farion1231](https://github.com/farion1231) - Bug fixes and feature enhancements
- Community members for testing and feedback

#### Sponsors

**Zhipu AI** - GLM CODING PLAN Sponsor
[Get 10% off with this link](https://z.ai/subscribe?ic=8JVLJQFSKB)

**PackyCode** - API Relay Service Partner
[Use code "cc-switch" for 10% off registration](https://www.packyapi.com/register?aff=cc-switch)

**ShandianShuo** - Local-first AI Voice Input
[Free download](https://shandianshuo.cn) for Mac/Windows

**MiniMax** - MiniMax M2 CODING PLAN Sponsor
[Black Friday sale, plans starting at $2](https://platform.minimax.io/subscribe/coding-plan)

### Feedback & Support

- **Issue Reports**: [GitHub Issues](https://github.com/farion1231/cc-switch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/farion1231/cc-switch/discussions)
- **Documentation**: [README](../README.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)

### Future Roadmap

**v3.9.0 Preview** (Tentative):

- Local proxy feature

Stay tuned for more updates!

**Happy Coding!**

---

## [3.7.1] - 2025-11-22

> Stability Enhancements and User Experience Improvements

### v3.7.1 Updates

**Code Changes**: 17 files, +524 / -81 lines

#### Bug Fixes

- **Fix Third-Party Skills Installation Failure** (#268)
  Fixed installation issues for skills repositories with custom subdirectories, now supports repos like `ComposioHQ/awesome-claude-skills` with subdirectories

- **Fix Gemini Configuration Persistence Issue**
  Resolved the issue where settings.json edits in Gemini form were lost when switching providers

- **Prevent Dialogs from Closing on Overlay Click**
  Added protection against clicking overlay/backdrop, preventing accidental form data loss across all 11 dialog components

#### New Features

- **Gemini Configuration Directory Support** (#255)
  Added Gemini configuration directory option in settings, supports customizing `~/.gemini/` path

- **ArchLinux Installation Support** (#259)
  Added AUR installation method: `paru -S cc-switch-bin`

#### Improvements

- **Skills Error Message i18n Enhancement**
  Added 28+ detailed error messages (English & Chinese) with specific resolution suggestions, extended download timeout from 15s to 60s

- **Code Formatting**
  Applied unified Rust and TypeScript code formatting standards

#### Download

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download the latest version

### v3.7.0 Complete Release Notes

> From Provider Switcher to All-in-One AI CLI Management Platform

**Commits**: 85 from v3.6.0
**Code Changes**: 152 files, +18,104 / -3,732 lines

### New Features

#### Gemini CLI Integration

Complete support for Google Gemini CLI, becoming the third supported application (Claude Code, Codex, Gemini).

**Core Capabilities**:

- **Dual-file configuration** - Support for both `.env` and `settings.json` formats
- **Auto-detection** - Automatically detect `GOOGLE_GEMINI_BASE_URL`, `GEMINI_MODEL`, etc.
- **Full MCP support** - Complete MCP server management for Gemini
- **Deep link integration** - Import via `ccswitch://` protocol
- **System tray** - Quick-switch from tray menu

**Provider Presets**:

- **Google Official** - OAuth authentication support
- **PackyCode** - Partner integration
- **Custom** - Full customization support

**Technical Implementation**:

- New backend modules: `gemini_config.rs` (20KB), `gemini_mcp.rs`
- Form synchronization with environment editor
- Dual-file atomic writes

#### MCP v3.7.0 Unified Architecture

Complete refactoring of MCP management system for cross-application unification.

**Architecture Improvements**:

- **Unified panel** - Single interface for Claude/Codex/Gemini MCP servers
- **SSE transport** - New Server-Sent Events support
- **Smart parser** - Fault-tolerant JSON parsing
- **Format correction** - Auto-fix Codex `[mcp_servers]` format
- **Extended fields** - Preserve custom TOML fields

**User Experience**:

- Default app selection in forms
- JSON formatter for validation
- Improved visual hierarchy
- Better error messages

**Import/Export**:

- Unified import from all three apps
- Bidirectional synchronization
- State preservation

#### Claude Skills Management System

**Approximately 2,000 lines of code** - A complete skill ecosystem platform.

**GitHub Integration**:

- Auto-scan skills from GitHub repositories
- Pre-configured repos:
  - `ComposioHQ/awesome-claude-skills` - Curated collection
  - `anthropics/skills` - Official Anthropic skills
  - `cexll/myclaude` - Community contributions
- Add custom repositories
- Subdirectory scanning support (`skillsPath`)

**Lifecycle Management**:

- **Discover** - Auto-detect `SKILL.md` files
- **Install** - One-click to `~/.claude/skills/`
- **Uninstall** - Safe removal with tracking
- **Update** - Check for updates (infrastructure ready)

**Technical Architecture**:

- **Backend**: `SkillService` (526 lines) with GitHub API integration
- **Frontend**: SkillsPage, SkillCard, RepoManager
- **UI Components**: Badge, Card, Table (shadcn/ui)
- **State**: Persistent storage in `config.json`
- **i18n**: 47+ translation keys

#### Prompts Management System

**Approximately 1,300 lines of code** - Complete system prompt management.

**Multi-Preset Management**:

- Create unlimited prompt presets
- Quick switch between presets
- One active prompt at a time
- Delete protection for active prompts

**Cross-App Support**:

- **Claude**: `~/.claude/CLAUDE.md`
- **Codex**: `~/.codex/AGENTS.md`
- **Gemini**: `~/.gemini/GEMINI.md`

**Markdown Editor**:

- Full-featured CodeMirror 6 integration
- Syntax highlighting
- Dark theme (One Dark)
- Real-time preview

**Smart Synchronization**:

- **Auto-write** - Immediately write to live files
- **Backfill protection** - Save current content before switching
- **Auto-import** - Import from live files on first launch
- **Modification protection** - Preserve manual modifications

**Technical Implementation**:

- **Backend**: `PromptService` (213 lines)
- **Frontend**: PromptPanel (177), PromptFormModal (160), MarkdownEditor (159)
- **Hooks**: usePromptActions (152 lines)
- **i18n**: 41+ translation keys

#### Deep Link Protocol (ccswitch://)

One-click provider configuration import via URL scheme.

**Features**:

- Protocol registration on all platforms
- Import from shared links
- Lifecycle integration
- Security validation

#### Environment Variable Conflict Detection

Intelligent detection and management of configuration conflicts.

**Detection Scope**:

- **Claude & Codex** - Cross-app conflicts
- **Gemini** - Auto-discovery
- **MCP** - Server configuration conflicts

**Management Features**:

- Visual conflict indicators
- Resolution suggestions
- Override warnings
- Backup before changes

### Improvements

#### Provider Management

**New Presets**:

- **DouBaoSeed** - ByteDance's DouBao
- **Kimi For Coding** - Moonshot AI
- **BaiLing** - BaiLing AI
- **Removed AnyRouter** - To avoid confusion

**Enhancements**:

- Model name configuration for Codex and Gemini
- Provider notes field for organization
- Enhanced preset metadata

#### Configuration Management

- **Common config migration** - From localStorage to `config.json`
- **Unified persistence** - Shared across all apps
- **Auto-import** - First launch configuration import
- **Backfill priority** - Correct handling of live files

#### UI/UX Improvements

**Design System**:

- **macOS native** - System-aligned color scheme
- **Window centering** - Default centered position
- **Visual polish** - Improved spacing and hierarchy

**Interactions**:

- **Password input** - Fixed Edge/IE reveal buttons
- **URL overflow** - Fixed card overflow
- **Error copying** - Copy-to-clipboard errors
- **Tray sync** - Real-time drag-and-drop sync

### Bug Fixes

#### Critical Fixes

- **Usage script validation** - Boundary checks
- **Gemini validation** - Relaxed constraints
- **TOML parsing** - CJK quote handling
- **MCP fields** - Custom field preservation
- **White screen** - FormLabel crash fix

#### Stability

- **Tray safety** - Pattern matching instead of unwrap
- **Error isolation** - Tray failures don't block operations
- **Import classification** - Correct category assignment

#### UI Fixes

- **Model placeholders** - Removed misleading hints
- **Base URL** - Auto-fill for third-party providers
- **Drag sort** - Tray menu synchronization

### Technical Improvements

#### Architecture

**MCP v3.7.0**:

- Removed legacy code (~1,000 lines)
- Unified initialization structure
- Backward compatibility maintained
- Comprehensive code formatting

**Platform Compatibility**:

- Windows winreg API fix (v0.52)
- Safe pattern matching (no `unwrap()`)
- Cross-platform tray handling

#### Configuration

**Synchronization**:

- MCP sync across all apps
- Gemini form-editor sync
- Dual-file reading (.env + settings.json)

**Validation**:

- Input boundary checks
- TOML quote normalization (CJK)
- Custom field preservation
- Enhanced error messages

#### Code Quality

**Type Safety**:

- Complete TypeScript coverage
- Rust type refinements
- API contract validation

**Testing**:

- Simplified assertions
- Better test coverage
- Integration test updates

**Dependencies**:

- Tauri 2.8.x
- Rust: `anyhow`, `zip`, `serde_yaml`, `tempfile`
- Frontend: CodeMirror 6 packages
- winreg 0.52 (Windows)

### Technical Statistics

```
Total Changes:
- Commits: 85
- Files: 152 changed
- Additions: +18,104 lines
- Deletions: -3,732 lines

New Modules:
- Skills Management: 2,034 lines (21 files)
- Prompts Management: 1,302 lines (20 files)
- Gemini Integration: ~1,000 lines
- MCP Refactor: ~3,000 lines refactored

Code Distribution:
- Backend (Rust): ~4,500 lines new
- Frontend (React): ~3,000 lines new
- Configuration: ~1,500 lines refactored
- Tests: ~500 lines
```

### Strategic Positioning

#### From Tool to Platform

v3.7.0 represents a shift in CC Switch's positioning:

| Aspect            | v3.6                     | v3.7.0                       |
| ----------------- | ------------------------ | ---------------------------- |
| **Identity**      | Provider Switcher        | AI CLI Management Platform   |
| **Scope**         | Configuration Management | Ecosystem Management         |
| **Applications**  | Claude + Codex           | Claude + Codex + Gemini      |
| **Capabilities**  | Switch configs           | Extend capabilities (Skills) |
| **Customization** | Manual editing           | Visual management (Prompts)  |
| **Integration**   | Isolated apps            | Unified management (MCP)     |

#### Six Pillars of AI CLI Management

1. **Configuration Management** - Provider switching and management
2. **Capability Extension** - Skills installation and lifecycle
3. **Behavior Customization** - System prompt presets
4. **Ecosystem Integration** - Deep links and sharing
5. **Multi-AI Support** - Claude/Codex/Gemini
6. **Intelligent Detection** - Conflict prevention

### Download & Installation

#### System Requirements

- **Windows**: Windows 10+
- **macOS**: macOS 10.15 (Catalina)+
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+ / ArchLinux

#### Download Links

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download:

- **Windows**: `CC-Switch-Windows.msi` or `-Portable.zip`
- **macOS**: `CC-Switch-macOS.tar.gz` or `.zip`
- **Linux**: `CC-Switch-Linux.AppImage` or `.deb`
- **ArchLinux**: `paru -S cc-switch-bin`

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

### Migration Notes

#### From v3.6.x

**Automatic migration** - No action required, configs are fully compatible

#### From v3.1.x or Earlier

**Two-step migration required**:

1. First upgrade to v3.2.x (performs one-time migration)
2. Then upgrade to v3.7.0

#### New Features

- **Skills**: No migration needed, start fresh
- **Prompts**: Auto-import from live files on first launch
- **Gemini**: Install Gemini CLI separately if needed
- **MCP v3.7.0**: Backward compatible with previous configs

### Acknowledgments

#### Contributors

Thanks to all contributors who made this release possible:

- [@YoVinchen](https://github.com/YoVinchen) - Skills & Prompts & Gemini integration implementation
- [@farion1231](https://github.com/farion1231) - From developer to issue responder
- Community members for testing and feedback

#### Sponsors

**Z.ai** - GLM CODING PLAN sponsor
[Get 10% OFF with this link](https://z.ai/subscribe?ic=8JVLJQFSKB)

**PackyCode** - API relay service partner
[Register with "cc-switch" code for 10% discount](https://www.packyapi.com/register?aff=cc-switch)

**ShanDianShuo** - Local-first AI voice input
[Free download](https://shandianshuo.cn) for Mac/Win

### Feedback & Support

- **Issues**: [GitHub Issues](https://github.com/farion1231/cc-switch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/farion1231/cc-switch/discussions)
- **Documentation**: [README](../README.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)

### What's Next

**v3.8.0 Preview** (Tentative):

- Local proxy functionality

Stay tuned for more updates!

**Happy Coding!**

---

## [3.7.0] - 2025-11-19

> From Provider Switcher to All-in-One AI CLI Management Platform

### Overview

CC Switch v3.7.0 introduces six major features with over 18,000 lines of new code.

**Commits**: 85 from v3.6.0
**Code Changes**: 152 files, +18,104 / -3,732 lines

### New Features

#### Gemini CLI Integration

Complete support for Google Gemini CLI, becoming the third supported application (Claude Code, Codex, Gemini).

**Core Capabilities**:

- **Dual-file configuration** - Support for both `.env` and `settings.json` formats
- **Auto-detection** - Automatically detect `GOOGLE_GEMINI_BASE_URL`, `GEMINI_MODEL`, etc.
- **Full MCP support** - Complete MCP server management for Gemini
- **Deep link integration** - Import via `ccswitch://` protocol
- **System tray** - Quick-switch from tray menu

**Provider Presets**:

- **Google Official** - OAuth authentication support
- **PackyCode** - Partner integration
- **Custom** - Full customization support

**Technical Implementation**:

- New backend modules: `gemini_config.rs` (20KB), `gemini_mcp.rs`
- Form synchronization with environment editor
- Dual-file atomic writes

#### MCP v3.7.0 Unified Architecture

Complete refactoring of MCP management system for cross-application unification.

**Architecture Improvements**:

- **Unified panel** - Single interface for Claude/Codex/Gemini MCP servers
- **SSE transport** - New Server-Sent Events support
- **Smart parser** - Fault-tolerant JSON parsing
- **Format correction** - Auto-fix Codex `[mcp_servers]` format
- **Extended fields** - Preserve custom TOML fields

**User Experience**:

- Default app selection in forms
- JSON formatter for validation
- Improved visual hierarchy
- Better error messages

**Import/Export**:

- Unified import from all three apps
- Bidirectional synchronization
- State preservation

#### Claude Skills Management System

**Approximately 2,000 lines of code** - A complete skill ecosystem platform.

**GitHub Integration**:

- Auto-scan skills from GitHub repositories
- Pre-configured repos:
  - `ComposioHQ/awesome-claude-skills` - Curated collection
  - `anthropics/skills` - Official Anthropic skills
  - `cexll/myclaude` - Community contributions
- Add custom repositories
- Subdirectory scanning support (`skillsPath`)

**Lifecycle Management**:

- **Discover** - Auto-detect `SKILL.md` files
- **Install** - One-click to `~/.claude/skills/`
- **Uninstall** - Safe removal with tracking
- **Update** - Check for updates (infrastructure ready)

**Technical Architecture**:

- **Backend**: `SkillService` (526 lines) with GitHub API integration
- **Frontend**: SkillsPage, SkillCard, RepoManager
- **UI Components**: Badge, Card, Table (shadcn/ui)
- **State**: Persistent storage in `skills.json`
- **i18n**: 47+ translation keys

#### Prompts Management System

**Approximately 1,300 lines of code** - Complete system prompt management.

**Multi-Preset Management**:

- Create unlimited prompt presets
- Quick switch between presets
- One active prompt at a time
- Delete protection for active prompts

**Cross-App Support**:

- **Claude**: `~/.claude/CLAUDE.md`
- **Codex**: `~/.codex/AGENTS.md`
- **Gemini**: `~/.gemini/GEMINI.md`

**Markdown Editor**:

- Full-featured CodeMirror 6 integration
- Syntax highlighting
- Dark theme (One Dark)
- Real-time preview

**Smart Synchronization**:

- **Auto-write** - Immediately write to live files
- **Backfill protection** - Save current content before switching
- **Auto-import** - Import from live files on first launch
- **Modification protection** - Preserve manual modifications

**Technical Implementation**:

- **Backend**: `PromptService` (213 lines)
- **Frontend**: PromptPanel (177), PromptFormModal (160), MarkdownEditor (159)
- **Hooks**: usePromptActions (152 lines)
- **i18n**: 41+ translation keys

#### Deep Link Protocol (ccswitch://)

One-click provider configuration import via URL scheme.

**Features**:

- Protocol registration on all platforms
- Import from shared links
- Lifecycle integration
- Security validation

#### Environment Variable Conflict Detection

Intelligent detection and management of configuration conflicts.

**Detection Scope**:

- **Claude & Codex** - Cross-app conflicts
- **Gemini** - Auto-discovery
- **MCP** - Server configuration conflicts

**Management Features**:

- Visual conflict indicators
- Resolution suggestions
- Override warnings
- Backup before changes

### Improvements

#### Provider Management

**New Presets**:

- **DouBaoSeed** - ByteDance's DouBao
- **Kimi For Coding** - Moonshot AI
- **BaiLing** - BaiLing AI
- **Removed AnyRouter** - To avoid confusion

**Enhancements**:

- Model name configuration for Codex and Gemini
- Provider notes field for organization
- Enhanced preset metadata

#### Configuration Management

- **Common config migration** - From localStorage to `config.json`
- **Unified persistence** - Shared across all apps
- **Auto-import** - First launch configuration import
- **Backfill priority** - Correct handling of live files

#### UI/UX Improvements

**Design System**:

- **macOS native** - System-aligned color scheme
- **Window centering** - Default centered position
- **Visual polish** - Improved spacing and hierarchy

**Interactions**:

- **Password input** - Fixed Edge/IE reveal buttons
- **URL overflow** - Fixed card overflow
- **Error copying** - Copy-to-clipboard errors
- **Tray sync** - Real-time drag-and-drop sync

### Bug Fixes

#### Critical Fixes

- **Usage script validation** - Boundary checks
- **Gemini validation** - Relaxed constraints
- **TOML parsing** - CJK quote handling
- **MCP fields** - Custom field preservation
- **White screen** - FormLabel crash fix

#### Stability

- **Tray safety** - Pattern matching instead of unwrap
- **Error isolation** - Tray failures don't block operations
- **Import classification** - Correct category assignment

#### UI Fixes

- **Model placeholders** - Removed misleading hints
- **Base URL** - Auto-fill for third-party providers
- **Drag sort** - Tray menu synchronization

### Technical Improvements

#### Architecture

**MCP v3.7.0**:

- Removed legacy code (~1,000 lines)
- Unified initialization structure
- Backward compatibility maintained
- Comprehensive code formatting

**Platform Compatibility**:

- Windows winreg API fix (v0.52)
- Safe pattern matching (no `unwrap()`)
- Cross-platform tray handling

#### Configuration

**Synchronization**:

- MCP sync across all apps
- Gemini form-editor sync
- Dual-file reading (.env + settings.json)

**Validation**:

- Input boundary checks
- TOML quote normalization (CJK)
- Custom field preservation
- Enhanced error messages

#### Code Quality

**Type Safety**:

- Complete TypeScript coverage
- Rust type refinements
- API contract validation

**Testing**:

- Simplified assertions
- Better test coverage
- Integration test updates

**Dependencies**:

- Tauri 2.8.x
- Rust: `anyhow`, `zip`, `serde_yaml`, `tempfile`
- Frontend: CodeMirror 6 packages
- winreg 0.52 (Windows)

### Technical Statistics

```
Total Changes:
- Commits: 85
- Files: 152 changed
- Additions: +18,104 lines
- Deletions: -3,732 lines

New Modules:
- Skills Management: 2,034 lines (21 files)
- Prompts Management: 1,302 lines (20 files)
- Gemini Integration: ~1,000 lines
- MCP Refactor: ~3,000 lines refactored

Code Distribution:
- Backend (Rust): ~4,500 lines new
- Frontend (React): ~3,000 lines new
- Configuration: ~1,500 lines refactored
- Tests: ~500 lines
```

### Strategic Positioning

#### From Tool to Platform

v3.7.0 represents a shift in CC Switch's positioning:

| Aspect            | v3.6                     | v3.7.0                       |
| ----------------- | ------------------------ | ---------------------------- |
| **Identity**      | Provider Switcher        | AI CLI Management Platform   |
| **Scope**         | Configuration Management | Ecosystem Management         |
| **Applications**  | Claude + Codex           | Claude + Codex + Gemini      |
| **Capabilities**  | Switch configs           | Extend capabilities (Skills) |
| **Customization** | Manual editing           | Visual management (Prompts)  |
| **Integration**   | Isolated apps            | Unified management (MCP)     |

#### Six Pillars of AI CLI Management

1. **Configuration Management** - Provider switching and management
2. **Capability Extension** - Skills installation and lifecycle
3. **Behavior Customization** - System prompt presets
4. **Ecosystem Integration** - Deep links and sharing
5. **Multi-AI Support** - Claude/Codex/Gemini
6. **Intelligent Detection** - Conflict prevention

### Download & Installation

#### System Requirements

- **Windows**: Windows 10+
- **macOS**: macOS 10.15 (Catalina)+
- **Linux**: Ubuntu 22.04+ / Debian 11+ / Fedora 34+

#### Download Links

Visit [Releases](https://github.com/farion1231/cc-switch/releases/latest) to download:

- **Windows**: `CC-Switch-v3.7.0-Windows.msi` or `-Portable.zip`
- **macOS**: `CC-Switch-v3.7.0-macOS.tar.gz` or `.zip`
- **Linux**: `CC-Switch-v3.7.0-Linux.AppImage` or `.deb`

#### Homebrew (macOS)

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

Update:

```bash
brew upgrade --cask cc-switch
```

### Migration Notes

#### From v3.6.x

**Automatic migration** - No action required, configs are fully compatible

#### From v3.1.x or Earlier

**Two-step migration required**:

1. First upgrade to v3.2.x (performs one-time migration)
2. Then upgrade to v3.7.0

#### New Features

- **Skills**: No migration needed, start fresh
- **Prompts**: Auto-import from live files on first launch
- **Gemini**: Install Gemini CLI separately if needed
- **MCP v3.7.0**: Backward compatible with previous configs

### Acknowledgments

#### Contributors

Thanks to all contributors who made this release possible:

- [@YoVinchen](https://github.com/YoVinchen) - Skills & Prompts & Gemini integration implementation
- [@farion1231](https://github.com/farion1231) - From developer to issue responder
- Community members for testing and feedback

#### Sponsors

**Z.ai** - GLM CODING PLAN sponsor
[Get 10% OFF with this link](https://z.ai/subscribe?ic=8JVLJQFSKB)

**PackyCode** - API relay service partner
[Register with "cc-switch" code for 10% discount](https://www.packyapi.com/register?aff=cc-switch)

### Feedback & Support

- **Issues**: [GitHub Issues](https://github.com/farion1231/cc-switch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/farion1231/cc-switch/discussions)
- **Documentation**: [README](../README.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)

### What's Next

**v3.8.0 Preview** (Tentative):

- Local proxy functionality

Stay tuned for more updates!

**Happy Coding!**

---

## [3.6.1] - 1970-01-01

> Stability improvements and user experience optimization (based on v3.6.0)

### 📦 What's New in v3.6.1 (2025-11-10)

This release focuses on **user experience optimization** and **configuration parsing robustness**, fixing several critical bugs and enhancing the usage query system.

#### ✨ New Features

##### Usage Query System Enhancements

- **Credential Decoupling** - Usage queries can now use independent API Key and Base URL, no longer dependent on provider configuration
  - Support for different query endpoints and authentication methods
  - Automatically displays credential input fields based on template type
  - General template: API Key + Base URL
  - NewAPI template: Base URL + Access Token + User ID
  - Custom template: Fully customizable
- **UI Component Upgrade** - Replaced native checkbox with shadcn/ui Switch component for modern experience
- **Form Unification** - Unified use of shadcn/ui Input components, consistent styling with the application
- **Password Visibility Toggle** - Added show/hide password functionality (API Key, Access Token)

##### Form Validation Infrastructure

- **Common Schema Library** - New JSON/TOML generic validators to reduce code duplication
  - `jsonConfigSchema`: Generic JSON object validator
  - `tomlConfigSchema`: Generic TOML format validator
  - `mcpJsonConfigSchema`: MCP-specific JSON validator
- **MCP Conditional Field Validation** - Strict type checking
  - stdio type requires `command` field
  - http type requires `url` field

##### Partner Integration

- **PackyCode** - New official partner
  - Added to Claude and Codex provider presets
  - 10% discount promotion support
  - New logo and partner identification

#### 🔧 Improvements

##### User Experience

- **Drag Sort Sync** - Tray menu order now syncs with drag-and-drop sorting in real-time
- **Enhanced Error Notifications** - Provider switch failures now display copyable error messages
- **Removed Misleading Placeholders** - Deleted example text from model input fields to avoid user confusion
- **Auto-fill Base URL** - All non-official provider categories automatically populate the Base URL input field

##### Configuration Parsing

- **CJK Quote Normalization** - Automatically handles IME-input fullwidth quotes to prevent TOML parsing errors
  - Supports automatic conversion of Chinese quotes (" " ' ') to ASCII quotes
  - Applied in TOML input handlers
  - Disabled browser auto-correction in Textarea component
- **Preserve Custom Fields** - Editing Codex MCP TOML configuration now preserves unknown fields
  - Supports extension fields like timeout_ms, retry_count
  - Forward compatibility with future MCP protocol extensions

#### 🐛 Bug Fixes

##### Critical Fixes

- **Fixed usage script panel white screen crash** - FormLabel component missing FormField context caused entire app to crash
  - Replaced with standalone Label component
  - Root cause: FormLabel internally calls useFormField() hook which requires FormFieldContext
- **Fixed CJK input quote parsing failure** - IME-input fullwidth quotes caused TOML parsing errors
  - Added textNormalization utility function
  - Automatically normalizes quotes before parsing
- **Fixed drag sort tray desync** (#179) - Tray menu order not updated after drag-and-drop sorting
  - Automatically calls updateTrayMenu after sorting completes
  - Ensures UI and tray menu stay consistent
- **Fixed MCP custom field loss** - Custom fields silently dropped when editing Codex MCP configuration
  - Uses spread operator to retain all fields
  - Preserves unknown fields in normalizeServerConfig

##### Stability Improvements

- **Error Isolation** - Tray menu update failures no longer affect main operations
  - Decoupled tray update errors from main operations
  - Provides warning when main operation succeeds but tray update fails
- **Safe Pattern Matching** - Replaced `unwrap()` with safe pattern matching
  - Avoids panic-induced app crashes
  - Tray menu event handling uses match patterns
- **Import Config Classification** - Importing from default config now automatically sets category to `custom`
  - Avoids imported configs being mistaken for official presets
  - Provides clearer configuration source identification

#### 📊 Technical Statistics

```
Commits: 17 commits
Code Changes: 31 files
  - Additions: 1,163 lines
  - Deletions: 811 lines
  - Net Growth: +352 lines
Contributors: Jason (16), ZyphrZero (1)
```

**By Module**:
- UI/User Interface: 3 commits
- Usage Query System: 3 commits
- Configuration Parsing: 2 commits
- Form Validation: 1 commit
- Other Improvements: 8 commits

#### 📥 Installation

##### macOS

**Via Homebrew (Recommended):**

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

**Manual Download:**

- Download `CC-Switch-v3.6.1-macOS.zip` from [Assets](#assets) below

> **Note**: Due to lack of Apple Developer account, you may see "unidentified developer" warning. Go to System Settings → Privacy & Security → Click "Open Anyway"

##### Windows

- **Installer**: `CC-Switch-v3.6.1-Windows.msi`
- **Portable**: `CC-Switch-v3.6.1-Windows-Portable.zip`

##### Linux

- **AppImage**: `CC-Switch-v3.6.1-Linux.AppImage`
- **Debian**: `CC-Switch-v3.6.1-Linux.deb`

#### 📚 Documentation

- [中文文档 (Chinese)](https://github.com/farion1231/cc-switch/blob/main/README_ZH.md)
- [English Documentation](https://github.com/farion1231/cc-switch/blob/main/README.md)
- [完整更新日志 (Full Changelog)](https://github.com/farion1231/cc-switch/blob/main/CHANGELOG.md)

#### 🙏 Acknowledgments

Special thanks to:
- **Zhipu AI** - For sponsoring this project with GLM CODING PLAN
- **PackyCode** - New official partner
- **ZyphrZero** - For contributing tray menu sync fix (#179)

**Full Changelog**: https://github.com/farion1231/cc-switch/compare/v3.6.0...v3.6.1

### 📜 v3.6.0 Complete Feature Review

> Content below is from v3.6.0 (2025-11-07), helping you understand the complete feature set

<details>
<summary><b>Click to expand v3.6.0 detailed content →</b></summary>

### What's New

#### Edit Mode & Provider Management

- **Provider Duplication** - Quickly duplicate existing provider configurations to create variants with one click
- **Manual Sorting** - Drag and drop to reorder providers, with visual push effect animations. Thanks to @ZyphrZero
- **Edit Mode Toggle** - Show/hide drag handles to optimize editing experience

#### Custom Endpoint Management

- **Multi-Endpoint Configuration** - Support for aggregator providers with multiple API endpoints
- **Endpoint Input Visibility** - Shows endpoint field for all non-official providers automatically

#### Usage Query Enhancements

- **Auto-Refresh Interval** - Configure periodic automatic usage queries with customizable intervals
- **Test Script API** - Validate JavaScript usage query scripts before execution
- **Enhanced Templates** - Custom blank templates with access token and user ID parameter support
  Thanks to @Sirhexs

#### Custom Configuration Directory (Cloud Sync)

- **Customizable Storage Location** - Customize CC Switch's configuration storage directory
- **Cloud Sync Support** - Point to cloud sync folders (Dropbox, OneDrive, iCloud Drive, etc.) to enable automatic config synchronization across devices
- **Independent Management** - Managed via Tauri Store for better isolation and reliability
  Thanks to @ZyphrZero

#### Configuration Directory Switching (WSL Support)

- **Auto-Sync on Directory Change** - When switching Claude/Codex config directories (e.g., WSL environment), automatically sync current provider to the new directory without manual operation
- **Post-Change Sync Utility** - Unified `postChangeSync.ts` utility for graceful error handling without blocking main flow
- **Import Config Auto-Sync** - Automatically sync after config import to ensure immediate effectiveness
- **Smart Conflict Resolution** - Distinguishes "fully successful" and "partially successful" states for precise user feedback

#### Configuration Editor Improvements

- **JSON Format Button** - One-click JSON formatting in configuration editors
- **Real-Time TOML Validation** - Live syntax validation for Codex configuration with error highlighting

#### Load Live Config When Editing

- **Protect Manual Modifications** - When editing the currently active provider, prioritize displaying the actual effective configuration from live files
- **Dual-Source Strategy** - Automatically loads from live config for active provider, SSOT for inactive ones

#### Claude Configuration Data Structure Enhancements

- **Granular Model Configuration** - Migrated from dual-key to quad-key system for better model tier differentiation
  - New fields: `ANTHROPIC_DEFAULT_HAIKU_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_MODEL`
  - Replaces legacy `ANTHROPIC_SMALL_FAST_MODEL` with automatic migration
  - Backend normalizes old configs on first read/write with smart fallback chain
  - UI expanded from 2 to 4 model input fields with intelligent defaults
- **ANTHROPIC_API_KEY Support** - Providers can now use `ANTHROPIC_API_KEY` field in addition to `ANTHROPIC_AUTH_TOKEN`
- **Template Variable System** - Support for dynamic configuration replacement (e.g., KAT-Coder's `ENDPOINT_ID` parameter)
- **Endpoint Candidates** - Predefined endpoint list for speed testing and endpoint management
- **Visual Theme Configuration** - Custom icons and colors for provider cards

#### Updated Provider Models

- **Kimi k2** - Updated to latest `kimi-k2-thinking` model

#### New Provider Presets

Added 5 new provider presets:

- **DMXAPI** - Multi-model aggregation service
- **Azure Codex** - Microsoft Azure OpenAI endpoint
- **AnyRouter** - None-profit routing service
- **AiHubMix** - Multi-model aggregation service
- **MiniMax** - Open source AI model provider

#### Partner Promotion Mechanism

- Support for ecosystem partner promotion (Zhipu GLM Z.ai)
- Sponsored banner integration in README

### Improvements

#### Configuration & Sync

- **Unified Error Handling** - AppError with internationalized error messages throughout backend
- **Fixed apiKeyUrl Priority** - Correct priority order for API key URL resolution
- **Fixed MCP Sync Issues** - Resolved sync-to-other-side functionality failures
- **Import Config Sync** - Fixed sync issues after configuration import
- **Config Error Handling** - Force exit on config error to prevent silent fallback and data loss

#### UI/UX Enhancements

- **Unique Provider Icons** - Each provider card now has unique icons and color identification
- **Unified Border System** - Consistent border design across all components
- **Drag Interaction** - Push effect animation and improved drag handle icons
- **Enhanced Visual Feedback** - Better current provider visual indication
- **Dialog Standardization** - Unified dialog sizes and layout consistency
- **Form Improvements** - Optimized model placeholders, simplified provider hints, category-specific hints
- **Usage Display Inline** - Usage info moved next to enable button for better space utilization

#### Complete Internationalization

- **Error Messages i18n** - All backend error messages support Chinese/English
- **Tray Menu i18n** - System tray menu fully internationalized
- **UI Components i18n** - 100% coverage across all user-facing components

### Bug Fixes

#### Configuration Management

- Fixed `apiKeyUrl` priority issue
- Fixed MCP sync-to-other-side functionality failure
- Fixed sync issues after config import
- Fixed Codex API Key auto-sync
- Fixed endpoint speed test functionality
- Fixed provider duplicate insertion position (now inserts next to original)
- Fixed custom endpoint preservation in edit mode
- Prevent silent fallback and data loss on config error

#### Usage Query

- Fixed auto-query interval timing issue
- Ensured refresh button shows loading animation on click

#### UI Issues

- Fixed name collision error (`get_init_error` command)
- Fixed language setting rollback after successful save
- Fixed language switch state reset (dependency cycle)
- Fixed edit mode button alignment

#### Startup Issues

- Force exit on config error (no silent fallback)
- Eliminated code duplication causing initialization errors

### Architecture Refactoring

#### Backend (Rust) - 5 Phase Refactoring

1. **Phase 1**: Unified error handling (`AppError` + i18n error messages)
2. **Phase 2**: Command layer split by domain (`commands/{provider,mcp,config,settings,plugin,misc}.rs`)
3. **Phase 3**: Integration tests and transaction mechanism (config snapshot + failure rollback)
4. **Phase 4**: Extracted Service layer (`services/{provider,mcp,config,speedtest}.rs`)
5. **Phase 5**: Concurrency optimization (`RwLock` instead of `Mutex`, scoped guard to avoid deadlock)

#### Frontend (React + TypeScript) - 4 Stage Refactoring

1. **Stage 1**: Test infrastructure (vitest + MSW + @testing-library/react)
2. **Stage 2**: Extracted custom hooks (`useProviderActions`, `useMcpActions`, `useSettings`, `useImportExport`, etc.)
3. **Stage 3**: Component splitting and business logic extraction
4. **Stage 4**: Code cleanup and formatting unification

#### Testing System

- **Hooks Unit Tests** - 100% coverage for all custom hooks
- **Integration Tests** - Coverage for key processes (App, SettingsDialog, MCP Panel)
- **MSW Mocking** - Backend API mocking to ensure test independence
- **Test Infrastructure** - vitest + MSW + @testing-library/react

#### Code Quality

- **Unified Parameter Format** - All Tauri commands migrated to camelCase (Tauri 2 specification)
- **Semantic Clarity** - `AppType` renamed to `AppId` for better semantics
- **Centralized Parsing** - Unified `app` parameter parsing with `FromStr` trait
- **DRY Violations Cleanup** - Eliminated code duplication throughout codebase
- **Dead Code Removal** - Removed unused `missing_param` helper, deprecated `tauri-api.ts`, redundant `KimiModelSelector`

### Internal Optimizations (User Transparent)

#### Removed Legacy Migration Logic

v3.6.0 removed v1 config auto-migration and copy file scanning logic:

- **Impact**: Improved startup performance, cleaner codebase
- **Compatibility**: v2 format configs fully compatible, no action required
- **Note**: Users upgrading from v3.1.0 or earlier should first upgrade to v3.2.x or v3.5.x for one-time migration, then upgrade to v3.6.0

#### Command Parameter Standardization

Backend unified to use `app` parameter (values: `claude` or `codex`):

- **Impact**: More standardized code, friendlier error prompts
- **Compatibility**: Frontend fully adapted, users don't need to care about this change

### Dependencies

- Updated to **Tauri 2.8.x**
- Updated to **TailwindCSS 4.x**
- Updated to **TanStack Query v5.90.x**
- Maintained **React 18.2.x** and **TypeScript 5.3.x**

</details>

### 🌟 About CC Switch

CC Switch is a cross-platform desktop application for managing and switching between different provider configurations for Claude Code and Codex. Built with Tauri 2.0 + React 18 + TypeScript, supporting Windows, macOS, and Linux.

**Core Features**:
- 🔄 One-click switching between multiple AI providers
- 📦 Support for both Claude Code and Codex applications
- 🎨 Modern UI with complete Chinese/English internationalization
- 🔐 Local storage, secure and reliable data
- ☁️ Support for cloud sync configurations
- 🧩 Unified MCP server management

**Project Repository**: https://github.com/farion1231/cc-switch

---

## [3.6.0] - 2025-11-07

### Major architecture refactoring with enhanced config sync and data protection

### What's New

#### Edit Mode & Provider Management

- **Provider Duplication** - Quickly duplicate existing provider configurations to create variants with one click
- **Manual Sorting** - Drag and drop to reorder providers, with visual push effect animations. Thanks to @ZyphrZero
- **Edit Mode Toggle** - Show/hide drag handles to optimize editing experience

#### Custom Endpoint Management

- **Multi-Endpoint Configuration** - Support for aggregator providers with multiple API endpoints
- **Endpoint Input Visibility** - Shows endpoint field for all non-official providers automatically

#### Usage Query Enhancements

- **Auto-Refresh Interval** - Configure periodic automatic usage queries with customizable intervals
- **Test Script API** - Validate JavaScript usage query scripts before execution
- **Enhanced Templates** - Custom blank templates with access token and user ID parameter support
  Thanks to @Sirhexs

#### Custom Configuration Directory (Cloud Sync)

- **Customizable Storage Location** - Customize CC Switch's configuration storage directory
- **Cloud Sync Support** - Point to cloud sync folders (Dropbox, OneDrive, iCloud Drive, etc.) to enable automatic config synchronization across devices
- **Independent Management** - Managed via Tauri Store for better isolation and reliability
  Thanks to @ZyphrZero

#### Configuration Directory Switching (WSL Support)

- **Auto-Sync on Directory Change** - When switching Claude/Codex config directories (e.g., WSL environment), automatically sync current provider to the new directory without manual operation
- **Post-Change Sync Utility** - Unified `postChangeSync.ts` utility for graceful error handling without blocking main flow
- **Import Config Auto-Sync** - Automatically sync after config import to ensure immediate effectiveness
- **Smart Conflict Resolution** - Distinguishes "fully successful" and "partially successful" states for precise user feedback

#### Configuration Editor Improvements

- **JSON Format Button** - One-click JSON formatting in configuration editors
- **Real-Time TOML Validation** - Live syntax validation for Codex configuration with error highlighting

#### Load Live Config When Editing

- **Protect Manual Modifications** - When editing the currently active provider, prioritize displaying the actual effective configuration from live files
- **Dual-Source Strategy** - Automatically loads from live config for active provider, SSOT for inactive ones

#### Claude Configuration Data Structure Enhancements

- **Granular Model Configuration** - Migrated from dual-key to quad-key system for better model tier differentiation
  - New fields: `ANTHROPIC_DEFAULT_HAIKU_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_MODEL`
  - Replaces legacy `ANTHROPIC_SMALL_FAST_MODEL` with automatic migration
  - Backend normalizes old configs on first read/write with smart fallback chain
  - UI expanded from 2 to 4 model input fields with intelligent defaults
- **ANTHROPIC_API_KEY Support** - Providers can now use `ANTHROPIC_API_KEY` field in addition to `ANTHROPIC_AUTH_TOKEN`
- **Template Variable System** - Support for dynamic configuration replacement (e.g., KAT-Coder's `ENDPOINT_ID` parameter)
- **Endpoint Candidates** - Predefined endpoint list for speed testing and endpoint management
- **Visual Theme Configuration** - Custom icons and colors for provider cards

#### Updated Provider Models

- **Kimi k2** - Updated to latest `kimi-k2-thinking` model

#### New Provider Presets

Added 5 new provider presets:

- **DMXAPI** - Multi-model aggregation service
- **Azure Codex** - Microsoft Azure OpenAI endpoint
- **AnyRouter** - None-profit routing service
- **AiHubMix** - Multi-model aggregation service
- **MiniMax** - Open source AI model provider

#### Partner Promotion Mechanism

- Support for ecosystem partner promotion (Zhipu GLM Z.ai)
- Sponsored banner integration in README

### Improvements

#### Configuration & Sync

- **Unified Error Handling** - AppError with internationalized error messages throughout backend
- **Fixed apiKeyUrl Priority** - Correct priority order for API key URL resolution
- **Fixed MCP Sync Issues** - Resolved sync-to-other-side functionality failures
- **Import Config Sync** - Fixed sync issues after configuration import
- **Config Error Handling** - Force exit on config error to prevent silent fallback and data loss

#### UI/UX Enhancements

- **Unique Provider Icons** - Each provider card now has unique icons and color identification
- **Unified Border System** - Consistent border design across all components
- **Drag Interaction** - Push effect animation and improved drag handle icons
- **Enhanced Visual Feedback** - Better current provider visual indication
- **Dialog Standardization** - Unified dialog sizes and layout consistency
- **Form Improvements** - Optimized model placeholders, simplified provider hints, category-specific hints
- **Usage Display Inline** - Usage info moved next to enable button for better space utilization

#### Complete Internationalization

- **Error Messages i18n** - All backend error messages support Chinese/English
- **Tray Menu i18n** - System tray menu fully internationalized
- **UI Components i18n** - 100% coverage across all user-facing components

### Bug Fixes

#### Configuration Management

- Fixed `apiKeyUrl` priority issue
- Fixed MCP sync-to-other-side functionality failure
- Fixed sync issues after config import
- Fixed Codex API Key auto-sync
- Fixed endpoint speed test functionality
- Fixed provider duplicate insertion position (now inserts next to original)
- Fixed custom endpoint preservation in edit mode
- Prevent silent fallback and data loss on config error

#### Usage Query

- Fixed auto-query interval timing issue
- Ensured refresh button shows loading animation on click

#### UI Issues

- Fixed name collision error (`get_init_error` command)
- Fixed language setting rollback after successful save
- Fixed language switch state reset (dependency cycle)
- Fixed edit mode button alignment

#### Startup Issues

- Force exit on config error (no silent fallback)
- Eliminated code duplication causing initialization errors

### Architecture Refactoring

#### Backend (Rust) - 5 Phase Refactoring

1. **Phase 1**: Unified error handling (`AppError` + i18n error messages)
2. **Phase 2**: Command layer split by domain (`commands/{provider,mcp,config,settings,plugin,misc}.rs`)
3. **Phase 3**: Integration tests and transaction mechanism (config snapshot + failure rollback)
4. **Phase 4**: Extracted Service layer (`services/{provider,mcp,config,speedtest}.rs`)
5. **Phase 5**: Concurrency optimization (`RwLock` instead of `Mutex`, scoped guard to avoid deadlock)

#### Frontend (React + TypeScript) - 4 Stage Refactoring

1. **Stage 1**: Test infrastructure (vitest + MSW + @testing-library/react)
2. **Stage 2**: Extracted custom hooks (`useProviderActions`, `useMcpActions`, `useSettings`, `useImportExport`, etc.)
3. **Stage 3**: Component splitting and business logic extraction
4. **Stage 4**: Code cleanup and formatting unification

#### Testing System

- **Hooks Unit Tests** - 100% coverage for all custom hooks
- **Integration Tests** - Coverage for key processes (App, SettingsDialog, MCP Panel)
- **MSW Mocking** - Backend API mocking to ensure test independence
- **Test Infrastructure** - vitest + MSW + @testing-library/react

#### Code Quality

- **Unified Parameter Format** - All Tauri commands migrated to camelCase (Tauri 2 specification)
- **Semantic Clarity** - `AppType` renamed to `AppId` for better semantics
- **Centralized Parsing** - Unified `app` parameter parsing with `FromStr` trait
- **DRY Violations Cleanup** - Eliminated code duplication throughout codebase
- **Dead Code Removal** - Removed unused `missing_param` helper, deprecated `tauri-api.ts`, redundant `KimiModelSelector`

### Internal Optimizations (User Transparent)

#### Removed Legacy Migration Logic

v3.6.0 removed v1 config auto-migration and copy file scanning logic:

- **Impact**: Improved startup performance, cleaner codebase
- **Compatibility**: v2 format configs fully compatible, no action required
- **Note**: Users upgrading from v3.1.0 or earlier should first upgrade to v3.2.x or v3.5.x for one-time migration, then upgrade to v3.6.0

#### Command Parameter Standardization

Backend unified to use `app` parameter (values: `claude` or `codex`):

- **Impact**: More standardized code, friendlier error prompts
- **Compatibility**: Frontend fully adapted, users don't need to care about this change

### Dependencies

- Updated to **Tauri 2.8.x**
- Updated to **TailwindCSS 4.x**
- Updated to **TanStack Query v5.90.x**
- Maintained **React 18.2.x** and **TypeScript 5.3.x**

### Installation

#### macOS

**Via Homebrew (Recommended):**

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

**Manual Download:**

- Download `CC-Switch-v3.6.0-macOS.zip` from [Assets](#assets) below

> **Note**: Due to lack of Apple Developer account, you may see "unidentified developer" warning. Go to System Settings → Privacy & Security → Click "Open Anyway"

#### Windows

- **Installer**: `CC-Switch-v3.6.0-Windows.msi`
- **Portable**: `CC-Switch-v3.6.0-Windows-Portable.zip`

#### Linux

- **AppImage**: `CC-Switch-v3.6.0-Linux.AppImage`
- **Debian**: `CC-Switch-v3.6.0-Linux.deb`

### Documentation

- [中文文档 (Chinese)](https://github.com/farion1231/cc-switch/blob/main/README_ZH.md)
- [English Documentation](https://github.com/farion1231/cc-switch/blob/main/README.md)
- [完整更新日志 (Full Changelog)](https://github.com/farion1231/cc-switch/blob/main/CHANGELOG.md)

### Acknowledgments

Special thanks to **Zhipu AI** for sponsoring this project with their GLM CODING PLAN!

**Full Changelog**: https://github.com/farion1231/cc-switch/compare/v3.5.1...v3.6.0
