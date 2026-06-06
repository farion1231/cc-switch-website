# Using cc-switch on Headless Servers

# TL;DR

cc-switch comes in two flavors: the desktop GUI edition (original, [farion1231/cc-switch](https://github.com/farion1231/cc-switch), with a graphical interface) and the CLI edition (this guide, [SaladDay/cc-switch-cli](https://github.com/SaladDay/cc-switch-cli), a single binary).

The CLI edition is built for environments without a graphical desktop — SSH servers, Docker containers, WSL, and the like.

**Once installed, you have two ways to operate: the full-screen TUI (keyboard-driven), or one-liner CLI commands. Both paths achieve the exact same result.** Use WebDAV sync across machines — configure on your desktop, pull down on your server, and you're good to go.

# Installation

As mentioned, cc-switch-cli has two modes: TUI and CLI.

Whichever you choose later, installation is a single step:

```bash
curl -fsSL https://github.com/SaladDay/cc-switch-cli/releases/latest/download/install.sh | bash
```

The binary lands at `~/.local/bin/cc-switch`. Make sure `~/.local/bin` is in your `PATH`:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

On arm64 machines (Raspberry Pi, some cloud servers), you can also install manually:

```bash
curl -LO https://github.com/saladday/cc-switch-cli/releases/latest/download/cc-switch-cli-linux-arm64-musl.tar.gz
tar -xzf cc-switch-cli-linux-arm64-musl.tar.gz
chmod +x cc-switch
mv cc-switch ~/.local/bin/
```

Verify:

```bash
cc-switch --version
```

![cc-switch --version](/docs/assets/cc-switch-cli-headless-guide/01-version-check.png)

> The rest of this guide is split into TUI and CLI paths — jump to whichever you need.

# Part 1: I Use TUI

The TUI is a full-screen keyboard interface that runs in your terminal — think of it as "an app inside your terminal." As long as you're connected via SSH with an interactive session, it just works.

## Page Overview

Once inside, the left sidebar lists pages and the right pane shows content. Use ← → to switch between sidebar and content, ↑ ↓ to navigate lists, Enter to confirm, and Esc to go back.

Use the `[` `]` keys to switch the target app: Claude / Codex / Gemini / OpenCode / Hermes / OpenClaw. Whichever you select, all subsequent actions apply to that app.

Here's what each page does:

| Page | Purpose |
|------|---------|
| **Home** | Dashboard overview of your setup |
| **Providers** | List, add, edit, delete, switch, speed-test, and stream-check providers |
| **MCP** | Manage MCP servers — enable, disable, sync to each app |
| **Skills** | Browse installed skills, discover new ones, manage skill repos |
| **Sessions** | View session history and message details |
| **Usage Stats** | View token usage, request counts, and costs per provider and model |
| **Prompts** | Manage prompt presets — activate, edit, create |
| **Config** | Backup/restore, import/export, common config snippets, WebDAV sync, OpenClaw workspace (OpenClaw mode only) |
| **Settings** | Language, proxy settings, managed accounts, visible app mode |

> Note: OpenClaw mode adds four extra sidebar entries — Workspace, Environment, Tools, and Agents. Hermes mode adds Hermes Memory.

![TUI Home](/docs/assets/cc-switch-cli-headless-guide/02-tui-home.png)

## Add a Provider & Switch

First, make sure the target CLI has been run at least once (e.g. `claude --help` / `codex --help`), otherwise cc-switch won't be able to write live config files.

Then just type:

```bash
cc-switch
```

This drops you into the full-screen TUI.

Press ↓ to move to the Providers page and hit Enter.

On the provider management screen, press `a` to add a provider:

![Add a provider](/docs/assets/cc-switch-cli-headless-guide/03-tui-add-provider.png)

Pick your template — use ← → to switch between templates and Enter to select.

Fill in the details.

The Claude model config section lets you configure individual models:

![Claude model config](/docs/assets/cc-switch-cli-headless-guide/04-tui-model-config.png)

In the JSON preview panel on the right, highlighted entries are common config snippets. You can add these via "Add Common Config" on the left:

![JSON preview and common config](/docs/assets/cc-switch-cli-headless-guide/05-tui-json-preview.png)

When done, press Ctrl + S to save.

**Switching providers:**

Select the provider you want on the main screen and hit Enter. The active provider will show a marker.

![Provider switched](/docs/assets/cc-switch-cli-headless-guide/06-tui-provider-switched.png)

---

## Sync Config (WebDAV)

If you have multiple machines, or you've set up providers on your desktop with the GUI edition, WebDAV sync lets you pull everything across without re-entering credentials.

In the TUI, go to Config → WebDAV Sync → Jianguoyun one-click setup (or another WebDAV service), and enter your Jianguoyun **app-specific password** (not your account password).

> Generate an app password at Jianguoyun: Account Center → Security → Third-party App Management.

![WebDAV config](/docs/assets/cc-switch-cli-headless-guide/07-tui-webdav-config.png)

That's it — you can now upload and download. Set up on the GUI, pull down on the TUI. Very convenient.

---

## Handy Pages

Beyond adding and switching providers, these pages are worth exploring:

**Home** — an at-a-glance dashboard: which provider is active, the API URL, how many MCP servers and skills are configured, WebDAV connection status, and which local CLI tools are ready. If the proxy is running, you'll also see a traffic sparkline. (We'll cover the proxy in a separate tutorial.)

![TUI Home overview](/docs/assets/cc-switch-cli-headless-guide/08-tui-home-overview.png)

**Usage Stats** — view per-provider usage statistics: token consumption and request counts by model. Very useful for cost optimization.

![Usage stats page](/docs/assets/cc-switch-cli-headless-guide/09-tui-usage-stats.png)

**Skills** — discover, install, manage, and enable community skills from here, then sync them to the target app directory in one step.

![Skills page](/docs/assets/cc-switch-cli-headless-guide/10-tui-skills.png)

**Sessions** — session list on the left, message details on the right. Browse past conversations filtered by app and provider.

![Sessions page](/docs/assets/cc-switch-cli-headless-guide/11-tui-sessions.png)

---

# Part 2: I Use CLI

If you don't want the TUI, need to script things, or are in a non-TTY environment (Dockerfile / cron), just use the commands directly.

## Add a Provider & Switch

**Add a provider (interactive — it asks the same questions, just without the full-screen TUI):**

```bash
cc-switch provider add
```

The terminal walks you through: Name → Base URL → API Key → Models. Fill them in and you're done.

![provider add](/docs/assets/cc-switch-cli-headless-guide/12-cli-provider-add.png)

You can also start from a template:

```bash
cc-switch provider add --template openai
```

**View and switch:**

```bash
cc-switch provider list      # list all providers
cc-switch provider current   # show which one is active
cc-switch provider switch <id>   # switch to it
```

![provider list](/docs/assets/cc-switch-cli-headless-guide/13-cli-provider-list.png)

![provider current](/docs/assets/cc-switch-cli-headless-guide/14-cli-provider-current.png)

**Omitting `--app` defaults to Claude. To manage other apps:**

```bash
cc-switch --app codex provider list
cc-switch --app codex provider switch <id>
cc-switch --app gemini provider list
```

---

## Sync Config (WebDAV)

Same flow as the TUI.

**Set up WebDAV (Jianguoyun):**

```bash
cc-switch config webdav jianguoyun --username your-email --password app-specific-password
```

**Generic WebDAV:**

```bash
cc-switch config webdav set --base-url https://dav.example.com --username xxx --password xxx --enable
```

**Test connection:**

```bash
cc-switch config webdav check-connection
```

**Upload / Download:**

```bash
cc-switch config webdav upload
cc-switch config webdav download
```

---

## Check for Issues

```bash
cc-switch env check   # check for conflicting environment variables
cc-switch env tools   # check which CLI tools are installed
```

![env check + env tools](/docs/assets/cc-switch-cli-headless-guide/15-cli-env-check-tools.png)

---

## Command Reference

Everything you can do in the TUI has a matching CLI command. Here are the most common ones:

**Providers**

| Command | Description |
|------|------|
| `provider list` | List all providers |
| `provider current` | Show active provider |
| `provider switch <id>` | Switch provider |
| `provider add` | Add a provider (interactive) |
| `provider add --template openai` | Add from a preset template |
| `provider edit <id>` | Edit a provider |
| `provider delete <id>` | Delete a provider |
| `provider duplicate <id>` | Duplicate a provider |
| `provider export <id>` | Export to a Claude settings file |
| `provider speedtest <id>` | Test API latency |
| `provider stream-check <id>` | Stream health check |
| `provider fetch-models <id>` | Fetch remote model list |
| `provider quota <id>` | Check usage quota |
| `provider import-live` | Import providers from live app config |

**MCP**

| Command | Description |
|------|------|
| `mcp list` | List all MCP servers |
| `mcp add` | Add an MCP server |
| `mcp edit <id>` | Edit an MCP server |
| `mcp delete <id>` | Delete an MCP server |
| `mcp enable <id> --app claude` | Enable for a specific app |
| `mcp disable <id> --app claude` | Disable for a specific app |
| `mcp sync` | Sync to app config files |
| `mcp import` | Import from app config |

**Prompts**

| Command | Description |
|------|------|
| `prompts list` | List prompt presets |
| `prompts current` | Show active prompt |
| `prompts activate <id>` | Activate a prompt |
| `prompts deactivate` | Deactivate the current prompt |
| `prompts create [name]` | Create a new prompt |
| `prompts edit <id>` | Edit a prompt |
| `prompts show <id>` | Display full content |
| `prompts delete <id>` | Delete a prompt |

**Skills**

| Command | Description |
|------|------|
| `skills list` | List installed skills |
| `skills discover <keyword>` | Search for skills |
| `skills install <name>` | Install a skill |
| `skills uninstall <name>` | Uninstall a skill |
| `skills enable <name>` | Enable for the current app |
| `skills disable <name>` | Disable for the current app |
| `skills sync` | Sync to the app directory |
| `skills repos list` | List skill repositories |

**Config**

| Command | Description |
|------|------|
| `config show` | View current config |
| `config path` | Show config file path |
| `config backup` | Create a backup |
| `config restore` | Restore from backup |
| `config export <path>` | Export config |
| `config import <path>` | Import config |
| `config webdav show` | View WebDAV settings |
| `config webdav jianguoyun --username xxx --password xxx` | Jianguoyun one-click setup |
| `config webdav upload/download` | Upload / download config |
| `config reset` | Reset config to defaults |

**Proxy**

| Command | Description |
|------|------|
| `proxy show` | View proxy status |
| `proxy enable` | Enable proxy |
| `proxy disable` | Disable proxy |
| `proxy config --listen-port 15721` | Set listen port |

**Environment**

| Command | Description |
|------|------|
| `env check` | Check for env variable conflicts |
| `env list` | List relevant env variables |
| `env tools` | Check installed CLI tools |

**Other**

| Command | Description |
|------|------|
| `daemon start/stop/status` | Daemon management |
| `completions install --activate` | Install shell completions |
| `update` | Update cc-switch itself |
| `sessions` | View session history |

> All commands support `--app` to specify the target: `--app claude` (default), `--app codex`, `--app gemini`, `--app opencode`, `--app hermes`, `--app openclaw`.

---

## Tips & Tricks

**Use a provider temporarily without switching globally:**

Say you normally use DeepSeek, but this time you want Claude to go through OpenAI without touching the global setting:

```bash
cc-switch start claude <provider-id>
```

`start` temporarily writes that provider to the live config, launches Claude, and leaves the global setting untouched when you exit. Same for Codex:

```bash
cc-switch start codex <provider-id>
```

You can also pass arguments through to the target CLI with `--`:

```bash
cc-switch start claude deepseek -- --dangerously-skip-permissions
```

**Shell aliases — type less:**

Add these to `~/.bashrc`:

```bash
alias ccpl='cc-switch provider list'
alias ccps='cc-switch provider switch'
alias ccpc='cc-switch provider current'
alias ccpw='cc-switch config webdav'
```

Now `ccpl` lists providers and `ccps abc123` switches — much faster than typing the full commands.

**Resume a previous session:**

```bash
cc-switch sessions list       # find the session you want
cc-switch sessions resume <id>  # pick up where you left off
```

**Test an API without saving a provider:**

```bash
cc-switch provider fetch-models --base-url https://api.example.com --api-key sk-xxx
```

Not sure if an endpoint works? Try this first — no provider needed.

**Export a single provider for Claude:**

```bash
cc-switch provider export deepseek
```

Generates `.claude/settings.local.json` in the current directory, which Claude auto-loads on startup. Handy for project-specific API keys.

**Shell completions (save keystrokes):**

```bash
cc-switch completions install --activate
```

Open a new terminal, type `cc-switch pr`, hit Tab, and it completes to `cc-switch provider`.

**Isolate projects with `CC_SWITCH_CONFIG_DIR`:**

```bash
export CC_SWITCH_CONFIG_DIR=/opt/my-project/.cc-switch
cc-switch provider list   # uses /opt/my-project/.cc-switch/cc-switch.db
```

Multiple projects, multiple users — each with their own independent config on a single machine.

## The Dark Arts

You can let codex, claude code, and friends all use cc-switch-cli to manage their configurations.

---

# cc-switch-cli vs. cc-switch

Right now the CLI already covers most of the original feature set and is under active development. Missing a feature or have an idea? Open an issue at [GitHub Issues](https://github.com/SaladDay/cc-switch-cli/issues) — PRs are even more welcome. After all, the CLI edition was built from a pile of PRs.
