# ヘッドレスサーバーで cc-switch を使いこなす

# TL;DR

cc-switch には 2 つのバージョンがあります: デスクトップ GUI 版（オリジナル、[farion1231/cc-switch](https://github.com/farion1231/cc-switch)、グラフィカルインターフェース付き）と CLI 版（このガイド、[SaladDay/cc-switch-cli](https://github.com/SaladDay/cc-switch-cli)、単一バイナリ）です。

CLI 版はグラフィカルデスクトップのない環境 — SSH サーバー、Docker コンテナ、WSL など — 向けに作られています。

**インストール後は 2 つの操作方法があります: フルスクリーン TUI（キーボード操作）か、一行 CLI コマンドか。どちらの方法でも同じ結果が得られます。** WebDAV 同期を使えば、デスクトップで設定してサーバーにプルするだけです。

# インストール

前述のとおり、cc-switch-cli には TUI と CLI の 2 つのモードがあります。

どちらを後で選ぶにしても、インストールは 1 ステップです:

```bash
curl -fsSL https://github.com/SaladDay/cc-switch-cli/releases/latest/download/install.sh | bash
```

バイナリは `~/.local/bin/cc-switch` に配置されます。`~/.local/bin` が `PATH` に含まれていることを確認してください:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

arm64 マシン（Raspberry Pi、一部のクラウドサーバー）では手動インストールも可能です:

```bash
curl -LO https://github.com/saladday/cc-switch-cli/releases/latest/download/cc-switch-cli-linux-arm64-musl.tar.gz
tar -xzf cc-switch-cli-linux-arm64-musl.tar.gz
chmod +x cc-switch
mv cc-switch ~/.local/bin/
```

インストール確認:

```bash
cc-switch --version
```

![cc-switch --version](/docs/assets/cc-switch-cli-headless-guide/01-version-check.png)

> 以降、TUI と CLI の 2 つのパートに分けて解説します。必要な方にジャンプしてください。

# Part 1: TUI を使う

TUI は端末内で動作するフルスクリーンキーボードインターフェースです。「端末の中のアプリ」と考えてください。SSH で対話セッションに接続していれば、そのまま使えます。

## 画面の概要

起動すると、左側にサイドバー、右側にコンテンツ領域が表示されます。← → キーでサイドバーとコンテンツを切り替え、↑ ↓ キーでリスト内を移動、Enter で確定、Esc で戻ります。

`[` `]` キーで対象アプリを切り替えます: Claude / Codex / Gemini / OpenCode / Hermes / OpenClaw。選択したアプリに対して後続の操作が適用されます。

サイドバーの各ページ:

| ページ | 用途 |
|------|---------|
| **ホーム** | セットアップのダッシュボード概要 |
| **プロバイダー** | プロバイダーの一覧、追加、編集、削除、切り替え、速度テスト、ストリームチェック |
| **MCP** | MCP サーバーの管理 — 有効化、無効化、各アプリへの同期 |
| **Skills** | インストール済みスキルの閲覧、新規発見、スキルリポジトリの管理 |
| **セッション** | セッション履歴とメッセージ詳細の表示 |
| **使用統計** | プロバイダー・モデルごとのトークン使用量、リクエスト数、コストの表示 |
| **Prompts** | プロンプトプリセットの管理 — 有効化、編集、作成 |
| **設定** | バックアップ/復元、インポート/エクスポート、共通設定スニペット、WebDAV 同期、OpenClaw ワークスペース（OpenClaw モードのみ） |
| **環境設定** | 言語、プロキシ設定、管理アカウント、表示アプリモード |

> 注: OpenClaw モードでは「ワークスペース」「環境」「ツール」「エージェント」の 4 つの追加エントリがサイドバーに表示されます。Hermes モードでは「Hermes メモリ」が追加されます。

![TUI ホーム](/docs/assets/cc-switch-cli-headless-guide/02-tui-home.png)

## プロバイダーの追加と切り替え

まず、対象の CLI が少なくとも 1 回実行されていることを確認してください（例: `claude --help` / `codex --help`）。そうしないと cc-switch がライブ設定ファイルを書き込めません。

次に端末で以下を入力します:

```bash
cc-switch
```

フルスクリーン TUI が起動します。

↓ キーでプロバイダーページに移動し、Enter を押します。

プロバイダー管理画面で `a` を押してプロバイダーを追加します:

![プロバイダーの追加](/docs/assets/cc-switch-cli-headless-guide/03-tui-add-provider.png)

テンプレートを選びます — ← → キーで切り替え、Enter で選択します。

必要事項を入力します。

Claude モデル設定セクションでは各モデルを個別に設定できます:

![Claude モデル設定](/docs/assets/cc-switch-cli-headless-guide/04-tui-model-config.png)

右側の JSON プレビューパネルでは、ハイライト表示された項目が共通設定スニペットです。左側の「共通設定を追加」から追加できます:

![JSON プレビューと共通設定](/docs/assets/cc-switch-cli-headless-guide/05-tui-json-preview.png)

完了したら Ctrl + S で保存します。

**プロバイダーの切り替え:**

メイン画面で切り替えたいプロバイダーを選び、Enter を押します。アクティブなプロバイダーにはマークが付きます。

![プロバイダー切り替え後](/docs/assets/cc-switch-cli-headless-guide/06-tui-provider-switched.png)

---

## 設定の同期（WebDAV）

複数のマシンがある場合や、デスクトップで GUI 版を使ってプロバイダーを設定した場合、WebDAV 同期を使えば認証情報を再入力せずにすべてをプルできます。

TUI で 設定 → WebDAV 同期 → 坚果云ワンクリック設定（または他の WebDAV サービス）に進み、坚果云の**アプリ専用パスワード**（アカウントパスワードではありません）を入力します。

> アプリパスワードは坚果云のアカウントセンター → セキュリティ → サードパーティアプリ管理で生成できます。

![WebDAV 設定](/docs/assets/cc-switch-cli-headless-guide/07-tui-webdav-config.png)

設定はこれだけです。あとはアップロードとダウンロードができます。GUI で設定して TUI でプルする — とても便利です。

---

## 便利なページ

プロバイダーの追加と切り替え以外にも、以下のページは見ておく価値があります:

**ホーム** — 現在の状態が一目でわかります: どのプロバイダーがアクティブか、API URL、MCP サーバーとスキルの数、WebDAV 接続状態、各 CLI ツールの準備状況。プロキシが動作中の場合はリクエストトラフィックのスパークラインも表示されます（プロキシの詳細は別途チュートリアルで解説します）。

![TUI ホーム概要](/docs/assets/cc-switch-cli-headless-guide/08-tui-home-overview.png)

**使用統計** — プロバイダーごとの使用統計（モデル別のトークン消費量とリクエスト数）を表示します。コスト最適化に非常に役立ちます。

![使用統計ページ](/docs/assets/cc-switch-cli-headless-guide/09-tui-usage-stats.png)

**Skills** — コミュニティスキルをここで発見、インストール、管理、有効化し、ワンステップで対象アプリのディレクトリに同期します。

![Skills ページ](/docs/assets/cc-switch-cli-headless-guide/10-tui-skills.png)

**セッション** — 左側にセッションリスト、右側にメッセージ詳細。アプリとプロバイダーでフィルタして過去の会話を閲覧できます。

![セッションページ](/docs/assets/cc-switch-cli-headless-guide/11-tui-sessions.png)

---

# Part 2: CLI を使う

TUI を使いたくない場合、スクリプト化したい場合、または TTY のない環境（Dockerfile / cron）では、コマンドを直接使います。

## プロバイダーの追加と切り替え

**プロバイダーの追加（対話式 — 同じ質問をしますが、フルスクリーン TUI を使わないだけです）:**

```bash
cc-switch provider add
```

端末が順に質問します: 名前 → ベース URL → API キー → モデル。入力すれば完了です。

![provider add](/docs/assets/cc-switch-cli-headless-guide/12-cli-provider-add.png)

テンプレートから始めることもできます:

```bash
cc-switch provider add --template openai
```

**表示と切り替え:**

```bash
cc-switch provider list      # すべてのプロバイダーを一覧
cc-switch provider current   # 現在アクティブなものを表示
cc-switch provider switch <id>   # 切り替え
```

![provider list](/docs/assets/cc-switch-cli-headless-guide/13-cli-provider-list.png)

![provider current](/docs/assets/cc-switch-cli-headless-guide/14-cli-provider-current.png)

**`--app` を省略するとデフォルトで Claude が対象になります。他のアプリを管理するには:**

```bash
cc-switch --app codex provider list
cc-switch --app codex provider switch <id>
cc-switch --app gemini provider list
```

---

## 設定の同期（WebDAV）

TUI と同じ流れです。

**WebDAV の設定（坚果云）:**

```bash
cc-switch config webdav jianguoyun --username your-email --password app-specific-password
```

**汎用 WebDAV:**

```bash
cc-switch config webdav set --base-url https://dav.example.com --username xxx --password xxx --enable
```

**接続確認:**

```bash
cc-switch config webdav check-connection
```

**アップロード / ダウンロード:**

```bash
cc-switch config webdav upload
cc-switch config webdav download
```

---

## 問題の確認

```bash
cc-switch env check   # 環境変数の競合をチェック
cc-switch env tools   # インストール済み CLI ツールを確認
```

![env check + env tools](/docs/assets/cc-switch-cli-headless-guide/15-cli-env-check-tools.png)

---

## コマンドリファレンス

TUI でできることはすべて CLI にも対応するコマンドがあります。よく使うものを紹介します:

**プロバイダー**

| コマンド | 説明 |
|------|------|
| `provider list` | 全プロバイダーを一覧表示 |
| `provider current` | 現在のアクティブプロバイダーを表示 |
| `provider switch <id>` | プロバイダーを切り替え |
| `provider add` | プロバイダーを追加（対話式） |
| `provider add --template openai` | プリセットテンプレートから追加 |
| `provider edit <id>` | プロバイダーを編集 |
| `provider delete <id>` | プロバイダーを削除 |
| `provider duplicate <id>` | プロバイダーを複製 |
| `provider export <id>` | Claude 設定ファイルとしてエクスポート |
| `provider speedtest <id>` | API レイテンシをテスト |
| `provider stream-check <id>` | ストリームヘルスチェック |
| `provider fetch-models <id>` | リモートモデルリストを取得 |
| `provider quota <id>` | 使用量クォータを確認 |
| `provider import-live` | アプリの現在の設定からプロバイダーをインポート |

**MCP**

| コマンド | 説明 |
|------|------|
| `mcp list` | 全 MCP サーバーを一覧表示 |
| `mcp add` | MCP サーバーを追加 |
| `mcp edit <id>` | MCP サーバーを編集 |
| `mcp delete <id>` | MCP サーバーを削除 |
| `mcp enable <id> --app claude` | 特定アプリで有効化 |
| `mcp disable <id> --app claude` | 特定アプリで無効化 |
| `mcp sync` | アプリ設定ファイルに同期 |
| `mcp import` | アプリ設定からインポート |

**Prompts**

| コマンド | 説明 |
|------|------|
| `prompts list` | プロンプトプリセットを一覧表示 |
| `prompts current` | 現在アクティブなプロンプトを表示 |
| `prompts activate <id>` | プロンプトを有効化 |
| `prompts deactivate` | 現在のプロンプトを無効化 |
| `prompts create [name]` | 新しいプロンプトを作成 |
| `prompts edit <id>` | プロンプトを編集 |
| `prompts show <id>` | 全文を表示 |
| `prompts delete <id>` | プロンプトを削除 |

**Skills**

| コマンド | 説明 |
|------|------|
| `skills list` | インストール済みスキルを一覧表示 |
| `skills discover <キーワード>` | スキルを検索 |
| `skills install <name>` | スキルをインストール |
| `skills uninstall <name>` | スキルをアンインストール |
| `skills enable <name>` | 現在のアプリで有効化 |
| `skills disable <name>` | 現在のアプリで無効化 |
| `skills sync` | アプリディレクトリに同期 |
| `skills repos list` | スキルリポジトリを一覧表示 |

**設定**

| コマンド | 説明 |
|------|------|
| `config show` | 現在の設定を表示 |
| `config path` | 設定ファイルのパスを表示 |
| `config backup` | バックアップを作成 |
| `config restore` | バックアップから復元 |
| `config export <path>` | 設定をエクスポート |
| `config import <path>` | 設定をインポート |
| `config webdav show` | WebDAV 設定を表示 |
| `config webdav jianguoyun --username xxx --password xxx` | 坚果云ワンクリック設定 |
| `config webdav upload/download` | 設定のアップロード / ダウンロード |
| `config reset` | 設定をデフォルトにリセット |

**プロキシ**

| コマンド | 説明 |
|------|------|
| `proxy show` | プロキシ状態を表示 |
| `proxy enable` | プロキシを有効化 |
| `proxy disable` | プロキシを無効化 |
| `proxy config --listen-port 15721` | リッスンポートを設定 |

**環境**

| コマンド | 説明 |
|------|------|
| `env check` | 環境変数の競合をチェック |
| `env list` | 関連する環境変数を一覧表示 |
| `env tools` | インストール済み CLI ツールを確認 |

**その他**

| コマンド | 説明 |
|------|------|
| `daemon start/stop/status` | デーモン管理 |
| `completions install --activate` | シェル補完をインストール |
| `update` | cc-switch 自身を更新 |
| `sessions` | セッション履歴を表示 |

> すべてのコマンドは `--app` で対象を指定できます: `--app claude`（デフォルト）、`--app codex`、`--app gemini`、`--app opencode`、`--app hermes`、`--app openclaw`。

---

## 小技

**プロバイダーを一時的に使用（グローバル切り替えなし）:**

普段は DeepSeek を使っているけど、今回は Claude に OpenAI を使わせたい、でもグローバル設定は変えたくない場合:

```bash
cc-switch start claude <provider-id>
```

`start` はそのプロバイダーを一時的にライブ設定に書き込み、Claude を起動します。Claude を終了してもグローバル設定はそのままです。Codex でも同様:

```bash
cc-switch start codex <provider-id>
```

`--` を使って対象 CLI に引数を渡すこともできます:

```bash
cc-switch start claude deepseek -- --dangerously-skip-permissions
```

**シェルエイリアス — タイプ量を減らす:**

`~/.bashrc` に以下を追加:

```bash
alias ccpl='cc-switch provider list'
alias ccps='cc-switch provider switch'
alias ccpc='cc-switch provider current'
alias ccpw='cc-switch config webdav'
```

これで `ccpl` でプロバイダー一覧、`ccps abc123` で切り替え — フルコマンドよりずっと速いです。

**以前のセッションを再開:**

```bash
cc-switch sessions list       # 続けたいセッションを見つける
cc-switch sessions resume <id>  # 中断したところから再開
```

**プロバイダーを保存せずに API をテスト:**

```bash
cc-switch provider fetch-models --base-url https://api.example.com --api-key sk-xxx
```

エンドポイントが使えるか確かめたいときは、まずこれを試してください。プロバイダーは不要です。

**単一プロバイダーを Claude 用にエクスポート:**

```bash
cc-switch provider export deepseek
```

現在のディレクトリに `.claude/settings.local.json` を生成し、Claude 起動時に自動読み込みされます。プロジェクト固有の API キーに便利です。

**シェル補完（キーストローク節約）:**

```bash
cc-switch completions install --activate
```

新しい端末を開いて `cc-switch pr` と入力し Tab を押すと `cc-switch provider` に補完されます。

**`CC_SWITCH_CONFIG_DIR` でプロジェクトを分離:**

```bash
export CC_SWITCH_CONFIG_DIR=/opt/my-project/.cc-switch
cc-switch provider list   # /opt/my-project/.cc-switch/cc-switch.db を使用
```

1 台のマシンで複数のプロジェクトやユーザーが独立して管理できます。

## 邪道技

codex、claude code、その他諸々の設定を cc-switch-cli で一元管理できます。

---

# cc-switch-cli と cc-switch の違い

現在 CLI 版はオリジナルの機能の大部分をカバーしており、活発に開発が続けられています。足りない機能やアイデアがあれば、[GitHub Issues](https://github.com/SaladDay/cc-switch-cli/issues) で issue を作成してください。PR はさらに歓迎です — 何しろ CLI 版は PR の積み重ねでできていますから。
