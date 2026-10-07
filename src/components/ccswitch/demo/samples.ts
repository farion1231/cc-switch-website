import type { Language } from '@/i18n/translations';
import type { AppId } from './apps';

/** Sample text in the three site languages. */
export type L = Record<Language, string>;

/* ---------- MCP & Skills ---------- */

/** MCP and Skills have columns for these apps, in this order (Claude Desktop and OpenClaw have none). */
export const MATRIX_APPS: AppId[] = ['claude', 'codex', 'gemini', 'grokbuild', 'opencode', 'hermes', 'pi', 'mcode'];

export interface SampleMcp {
  id: string;
  transport: 'stdio' | 'http';
  summary: string;
  apps: AppId[];
}

export const MCP_SERVERS: SampleMcp[] = [
  { id: 'context7', transport: 'http', summary: 'mcp.context7.com/mcp', apps: ['claude', 'codex', 'grokbuild', 'opencode'] },
  { id: 'fetch', transport: 'stdio', summary: 'uvx mcp-server-fetch', apps: ['claude', 'codex', 'gemini', 'hermes'] },
  { id: 'figma', transport: 'http', summary: '127.0.0.1:3845/mcp', apps: ['claude'] },
  { id: 'github', transport: 'http', summary: 'api.githubcopilot.com/mcp/', apps: ['claude', 'codex', 'opencode', 'mcode'] },
  { id: 'memory', transport: 'stdio', summary: 'npx -y @modelcontextprotocol/server-memory', apps: [] },
  { id: 'playwright', transport: 'stdio', summary: 'npx -y @playwright/mcp@latest', apps: ['claude', 'codex'] },
  {
    id: 'sequential-thinking',
    transport: 'stdio',
    summary: 'npx -y @modelcontextprotocol/server-sequential-thinking',
    apps: ['claude', 'codex', 'gemini'],
  },
  {
    id: 'serena',
    transport: 'stdio',
    summary: 'uvx --from git+https://github.com/oraios/serena serena start-mcp-server',
    apps: ['claude', 'codex', 'hermes', 'pi'],
  },
];

export interface SampleSkill {
  name: string;
  description: L;
  /** owner/repo, or null for a local Skill. */
  repo: string | null;
  apps: AppId[];
  update?: boolean;
}

export const INSTALLED_SKILLS: SampleSkill[] = [
  {
    name: 'baoyu-cover-image',
    description: { zh: '为文章生成封面图', en: 'Generate cover images for articles', ja: '記事のカバー画像を生成' },
    repo: 'JimLiu/baoyu-skills',
    apps: ['claude', 'codex', 'gemini'],
  },
  {
    name: 'brainstorming',
    description: { zh: '写代码前先把需求和方案聊清楚', en: 'Talk through requirements and the plan before coding', ja: 'コードを書く前に要件と方針を詰める' },
    repo: 'obra/superpowers',
    apps: ['claude', 'codex', 'opencode'],
  },
  {
    name: 'docx',
    description: { zh: '读写 Word 文档，保留修订和批注', en: 'Read and write Word documents, keeping tracked changes', ja: 'Word 文書を読み書きし、変更履歴を保持' },
    repo: 'anthropics/skills',
    apps: ['claude'],
  },
  {
    name: 'frontend-design',
    description: { zh: '设计并实现有辨识度的前端界面', en: 'Design and build distinctive front-end interfaces', ja: '個性のあるフロントエンド UI を設計・実装' },
    repo: 'anthropics/skills',
    apps: ['claude', 'codex', 'opencode'],
    update: true,
  },
  {
    name: 'mcp-builder',
    description: { zh: '编写高质量的 MCP 服务器', en: 'Build high-quality MCP servers', ja: '質の高い MCP サーバーを作る' },
    repo: 'anthropics/skills',
    apps: [],
  },
  {
    name: 'pdf',
    description: { zh: '提取、合并和填写 PDF', en: 'Extract, merge and fill in PDFs', ja: 'PDF の抽出・結合・フォーム入力' },
    repo: 'anthropics/skills',
    apps: ['claude', 'codex', 'gemini', 'hermes'],
    update: true,
  },
  {
    name: 'systematic-debugging',
    description: { zh: '先定位根因再动手修', en: 'Find the root cause before fixing', ja: '原因を突き止めてから修正する' },
    repo: 'obra/superpowers',
    apps: ['claude', 'codex', 'grokbuild', 'pi'],
    update: true,
  },
  {
    name: 'team-conventions',
    description: { zh: '团队的提交与代码规范', en: "Your team's commit and code conventions", ja: 'チームのコミットとコードの規約' },
    repo: null,
    apps: ['claude', 'codex', 'opencode', 'hermes', 'pi', 'mcode'],
  },
  {
    name: 'test-driven-development',
    description: { zh: '先写失败的测试，再写实现', en: 'Write a failing test first, then the code', ja: '失敗するテストを先に書き、実装する' },
    repo: 'obra/superpowers',
    apps: ['claude', 'mcode'],
  },
];

export interface SampleDiscoverSkill {
  name: string;
  description: L;
  repo: string;
  /** skills.sh install count. */
  installs: string;
}

export const DISCOVER_SKILLS: SampleDiscoverSkill[] = [
  { name: 'canvas-design', repo: 'anthropics/skills', installs: '18.4K', description: { zh: '用设计原则做海报和视觉稿', en: 'Make posters and visuals with design principles', ja: 'デザインの原則でポスターやビジュアルを作る' } },
  { name: 'docx', repo: 'anthropics/skills', installs: '31.2K', description: { zh: '读写 Word 文档，保留修订和批注', en: 'Read and write Word documents, keeping tracked changes', ja: 'Word 文書を読み書きし、変更履歴を保持' } },
  { name: 'pptx', repo: 'anthropics/skills', installs: '27.9K', description: { zh: '生成和编辑演示文稿', en: 'Create and edit presentations', ja: 'プレゼン資料を作成・編集' } },
  { name: 'skill-creator', repo: 'anthropics/skills', installs: '22.6K', description: { zh: '帮你写一个新的 Skill', en: 'Helps you write a new Skill', ja: '新しい Skill の作成を手伝う' } },
  { name: 'webapp-testing', repo: 'anthropics/skills', installs: '15.1K', description: { zh: '用 Playwright 测试本地网页应用', en: 'Test local web apps with Playwright', ja: 'Playwright でローカルの Web アプリをテスト' } },
  { name: 'xlsx', repo: 'anthropics/skills', installs: '24.3K', description: { zh: '读写表格，保留公式', en: 'Read and write spreadsheets, keeping formulas', ja: '数式を保ったまま表計算を読み書き' } },
  { name: 'brainstorming', repo: 'obra/superpowers', installs: '19.8K', description: { zh: '写代码前先把需求和方案聊清楚', en: 'Talk through requirements and the plan before coding', ja: 'コードを書く前に要件と方針を詰める' } },
  { name: 'writing-plans', repo: 'obra/superpowers', installs: '12.7K', description: { zh: '把需求拆成可执行的实现计划', en: 'Turn requirements into an implementation plan', ja: '要件を実装計画に分解する' } },
];

/* ---------- Prompts ---------- */

/** Prompts have no Claude Desktop (it uses Claude Code's) and no OpenClaw (its own Workspace). */
export const PROMPT_APPS: AppId[] = ['claude', 'codex', 'gemini', 'grokbuild', 'opencode', 'hermes', 'pi', 'mcode'];

export const PROMPT_TARGET: Record<string, { file: string; path: string }> = {
  claude: { file: 'CLAUDE.md', path: '~/.claude/CLAUDE.md' },
  codex: { file: 'AGENTS.md', path: '~/.codex/AGENTS.md' },
  gemini: { file: 'GEMINI.md', path: '~/.gemini/GEMINI.md' },
  grokbuild: { file: 'AGENTS.md', path: '~/.grok/AGENTS.md' },
  opencode: { file: 'AGENTS.md', path: '~/.config/opencode/AGENTS.md' },
  hermes: { file: 'SOUL.md', path: '~/.hermes/SOUL.md' },
  pi: { file: 'AGENTS.md', path: '~/.pi/agent/AGENTS.md' },
  mcode: { file: 'AGENTS.md', path: '~/.minimax/AGENTS.md' },
};

export interface SamplePrompt {
  id: string;
  name: L;
  description: L;
  size: string;
  updated: L;
}

const P = {
  team: {
    name: { zh: '团队编码规范', en: 'Team coding rules', ja: 'チームのコーディング規約' },
    description: { zh: '所有仓库通用：提交、测试、依赖', en: 'For every repo: commits, tests, dependencies', ja: '全リポジトリ共通：コミット・テスト・依存関係' },
  },
  review: {
    name: { zh: '只读审查模式', en: 'Read-only review', ja: '読み取り専用レビュー' },
    description: { zh: '只审查，不改文件', en: 'Review only, never edit files', ja: 'レビューのみ、ファイルは変更しない' },
  },
  chinese: {
    name: { zh: '中文回复', en: 'Reply in Chinese', ja: '中国語で返信' },
    description: { zh: '回复语言', en: 'Reply language', ja: '返信の言語' },
  },
  frontend: {
    name: { zh: '前端项目约定', en: 'Front-end project rules', ja: 'フロントエンドの規約' },
    description: { zh: 'React + Tailwind 的仓库用', en: 'For React + Tailwind repos', ja: 'React + Tailwind のリポジトリ用' },
  },
  rust: {
    name: { zh: 'Rust 后端约定', en: 'Rust back-end rules', ja: 'Rust バックエンドの規約' },
    description: { zh: 'cargo fmt、clippy 零警告', en: 'cargo fmt, zero clippy warnings', ja: 'cargo fmt、clippy 警告ゼロ' },
  },
  careful: {
    name: { zh: '严谨的助手', en: 'Careful assistant', ja: '慎重なアシスタント' },
    description: { zh: '先问清楚再动手', en: 'Asks before acting', ja: '確認してから動く' },
  },
  casual: {
    name: { zh: '轻松闲聊', en: 'Casual chat', ja: '気軽な雑談' },
    description: { zh: '语气随意，回答简短', en: 'Relaxed tone, short answers', ja: 'くだけた口調で短く答える' },
  },
};

const day = (month: number, date: number, enMonth: string): L => ({
  zh: `${month} 月 ${date} 日更新`,
  en: `Updated ${enMonth} ${date}`,
  ja: `${month}月${date}日に更新`,
});
const today: L = { zh: '今天 18:40 更新', en: 'Updated today 18:40', ja: '今日 18:40 に更新' };

export const PROMPTS: Record<string, { items: SamplePrompt[]; enabled: string | null }> = {
  claude: {
    enabled: 'team',
    items: [
      { id: 'team', ...P.team, size: '718 B', updated: day(9, 28, 'Sep') },
      { id: 'review', ...P.review, size: '312 B', updated: day(9, 20, 'Sep') },
      { id: 'chinese', ...P.chinese, size: '113 B', updated: day(8, 30, 'Aug') },
      { id: 'frontend', ...P.frontend, size: '250 B', updated: day(9, 12, 'Sep') },
    ],
  },
  codex: {
    enabled: 'team',
    items: [
      { id: 'team', ...P.team, size: '702 B', updated: today },
      { id: 'review', ...P.review, size: '312 B', updated: day(9, 20, 'Sep') },
      { id: 'rust', ...P.rust, size: '1.2 KB', updated: day(10, 2, 'Oct') },
    ],
  },
  gemini: {
    enabled: 'team',
    items: [
      { id: 'team', ...P.team, size: '718 B', updated: day(9, 28, 'Sep') },
      { id: 'chinese', ...P.chinese, size: '113 B', updated: day(8, 30, 'Aug') },
    ],
  },
  grokbuild: { enabled: null, items: [{ id: 'team', ...P.team, size: '718 B', updated: day(9, 28, 'Sep') }] },
  opencode: {
    enabled: 'frontend',
    items: [
      { id: 'team', ...P.team, size: '718 B', updated: day(9, 28, 'Sep') },
      { id: 'frontend', ...P.frontend, size: '250 B', updated: day(9, 12, 'Sep') },
    ],
  },
  hermes: {
    enabled: 'careful',
    items: [
      { id: 'careful', ...P.careful, size: '1.6 KB', updated: day(9, 24, 'Sep') },
      { id: 'casual', ...P.casual, size: '420 B', updated: day(9, 3, 'Sep') },
    ],
  },
  pi: { enabled: 'team', items: [{ id: 'team', ...P.team, size: '718 B', updated: day(9, 28, 'Sep') }] },
  mcode: { enabled: null, items: [{ id: 'team', ...P.team, size: '718 B', updated: day(9, 28, 'Sep') }] },
};

/* ---------- Sessions ---------- */

/** The session picker includes OpenClaw; Claude Desktop shows Claude Code's sessions. */
export const SESSION_APPS: AppId[] = ['claude', 'codex', 'opencode', 'hermes', 'gemini', 'pi', 'grokbuild', 'openclaw', 'mcode'];

export type Bucket = 'today' | 'yesterday' | 'thisWeek' | 'earlier';

export interface SampleStep {
  kind: 'read' | 'run' | 'edit';
  target: string;
  /** run: exit code; edit: lines added / removed. */
  failed?: boolean;
  added?: number;
  removed?: number;
}

export interface SampleTurn {
  question: L;
  steps: SampleStep[];
  reply: L;
  time: string;
  duration: string;
}

export interface SampleSession {
  id: string;
  app: AppId;
  /** Project folder, or null for the unknown directory. */
  project: string | null;
  title: L;
  last: L;
  /** Relative time of the last activity. */
  ago: { unit: 'minutes' | 'hours' | 'days'; count: number };
  bucket: Bucket;
  archived?: boolean;
  turns: SampleTurn[];
}

export const AGENT_MODEL: Partial<Record<AppId, string>> = {
  claude: 'claude-sonnet-5-5',
  codex: 'gpt-5.6-sol',
  gemini: 'gemini-3.6-flash',
  opencode: 'kimi-k3',
  grokbuild: 'grok-4.5',
  pi: 'deepseek-v4-pro',
  hermes: 'kimi-k3',
};

const turn = (question: L, steps: SampleStep[], reply: L, time: string, duration: string): SampleTurn => ({
  question,
  steps,
  reply,
  time,
  duration,
});

export const SESSIONS: SampleSession[] = [
  {
    id: '3f2a9c1e-7b40-4d2e-9a61-5c8f0e7d2b14',
    app: 'claude',
    project: '~/Code/cc-switch',
    title: { zh: '重构会话管理页的布局', en: 'Rework the session manager layout', ja: 'セッション管理ページのレイアウトを見直す' },
    last: { zh: '已把列表改成单栏，下一步是阅读页。', en: 'The list is a single column now; the reader is next.', ja: '一覧を 1 列にしました。次は閲覧ページです。' },
    ago: { unit: 'minutes', count: 3 },
    bucket: 'today',
    turns: [
      turn(
        {
          zh: '会话管理页现在是左右两栏，窄窗口里很挤。改成单栏列表，点开再进阅读页。',
          en: 'The session manager is two columns and cramped in narrow windows. Make it a single list that opens a reader.',
          ja: 'セッション管理ページは 2 列で、狭いウィンドウだと窮屈です。1 列の一覧にして、開くと閲覧ページに入るようにしてください。',
        },
        [
          { kind: 'read', target: 'src/components/sessions/SessionManagerPage.tsx' },
          { kind: 'read', target: 'src/components/sessions/SessionItem.tsx' },
          { kind: 'edit', target: 'src/components/sessions/SessionManagerPage.tsx', added: 86, removed: 141 },
          { kind: 'edit', target: 'src/components/sessions/SessionItem.tsx', added: 24, removed: 9 },
          { kind: 'run', target: 'pnpm typecheck' },
          { kind: 'run', target: 'pnpm test:unit sessions', failed: true },
          { kind: 'edit', target: 'tests/components/SessionManagerPage.test.tsx', added: 12, removed: 4 },
          { kind: 'run', target: 'pnpm test:unit sessions' },
        ],
        {
          zh: '列表已经改成单栏：按项目分组，每行显示标题、最后一条消息和时间，悬停时出现恢复和复制按钮。测试里有一条还在找旧的右栏，已经改掉，现在全部通过。',
          en: 'The list is a single column now, grouped by project. Each row shows the title, the last message and the time, with resume and copy buttons on hover. One test still looked for the old right pane; I fixed it and everything passes.',
          ja: '一覧を 1 列にし、プロジェクトごとにまとめました。各行にタイトル・最後のメッセージ・時刻を表示し、ホバーで再開とコピーのボタンが出ます。古い右ペインを探していたテストを 1 件直し、すべて通っています。',
        },
        '15:25',
        '4m12s',
      ),
      turn(
        {
          zh: '好。阅读页先做个骨架：顶部返回和恢复按钮，右边一个对话目录。',
          en: 'Good. Sketch the reader next: back and resume at the top, a conversation outline on the right.',
          ja: 'いいですね。次は閲覧ページの骨組みを。上に戻ると再開のボタン、右に会話の目次を置いてください。',
        },
        [
          { kind: 'read', target: 'src/components/shell/AppPageHeader.tsx' },
          { kind: 'edit', target: 'src/components/sessions/reader/SessionReader.tsx', added: 132, removed: 0 },
          { kind: 'edit', target: 'src/components/sessions/reader/SessionOutline.tsx', added: 58, removed: 0 },
          { kind: 'run', target: 'pnpm typecheck' },
        ],
        {
          zh: '阅读页的骨架已经搭好：页头有返回、上一个 / 下一个和「在 Terminal 中恢复」，右侧是对话目录，点目录会跳到对应的那一轮。',
          en: 'The reader skeleton is in: the header has back, previous / next and "Resume in Terminal", and the outline on the right jumps to the matching turn.',
          ja: '閲覧ページの骨組みができました。ヘッダーに戻る・前へ / 次へ・「Terminal で再開」があり、右の目次をクリックすると該当のターンに移動します。',
        },
        '15:41',
        '2m03s',
      ),
    ],
  },
  {
    id: '9b17e2d4-1c3a-4f58-8e20-7a6d5f4c3b21',
    app: 'grokbuild',
    project: '~/Code/cc-switch',
    title: { zh: '给 Grok 会话加用量导入', en: 'Import usage from Grok sessions', ja: 'Grok セッションから使用量を取り込む' },
    last: { zh: '导入间隔改为 60 秒。', en: 'The import interval is 60 seconds now.', ja: '取り込み間隔を 60 秒にしました。' },
    ago: { unit: 'hours', count: 2 },
    bucket: 'today',
    turns: [
      turn(
        { zh: 'Grok Build 的用量要等十分钟才进统计，能不能快一点？', en: "Grok Build usage takes ten minutes to show up in stats. Can it be faster?", ja: 'Grok Build の使用量が統計に出るまで 10 分かかります。速くできますか？' },
        [
          { kind: 'read', target: 'src-tauri/src/services/session_usage_grok.rs' },
          { kind: 'edit', target: 'src-tauri/src/services/session_usage_grok.rs', added: 3, removed: 3 },
          { kind: 'run', target: 'cargo test session_usage_grok' },
        ],
        { zh: '导入间隔改为 60 秒，游标照旧按行号续读，不会重复计数。', en: 'The import interval is 60 seconds now; the cursor still resumes by line, so nothing is counted twice.', ja: '取り込み間隔を 60 秒にしました。カーソルは引き続き行番号で再開するため、二重に数えません。' },
        '12:08',
        '1m40s',
      ),
    ],
  },
  {
    id: 'c4d81a3f-5e62-4b97-a0d3-2f1e8c7b6a59',
    app: 'codex',
    project: '~/Code/cc-switch',
    title: { zh: '修复 Hermes 消息查询的列名', en: 'Fix the column name in the Hermes message query', ja: 'Hermes メッセージ取得の列名を修正' },
    last: { zh: 'messages 表的时间列叫 timestamp。', en: 'The time column in messages is called timestamp.', ja: 'messages テーブルの時刻列は timestamp です。' },
    ago: { unit: 'hours', count: 5 },
    bucket: 'today',
    turns: [
      turn(
        { zh: 'Hermes 会话打不开，报 no such column: created_at。', en: "Hermes sessions won't open: no such column: created_at.", ja: 'Hermes のセッションが開けません。no such column: created_at と出ます。' },
        [
          { kind: 'run', target: 'sqlite3 ~/.hermes/state.db ".schema messages"' },
          { kind: 'edit', target: 'src-tauri/src/session_manager/providers/hermes.rs', added: 2, removed: 2 },
          { kind: 'run', target: 'cargo test hermes' },
        ],
        { zh: 'messages 表的时间列叫 timestamp，查询已改过来，测试通过。', en: 'The time column in messages is called timestamp. The query uses it now and the tests pass.', ja: 'messages テーブルの時刻列は timestamp でした。クエリを直し、テストも通っています。' },
        '09:52',
        '58s',
      ),
    ],
  },
  {
    id: '71e3b9a2-8d4c-4e15-b6f0-9c2a1d3e4f57',
    app: 'claude',
    project: '~/Code/cc-switch',
    title: { zh: '给 MCP 面板加写入失败提示', en: 'Show write failures on the MCP page', ja: 'MCP ページに書き込み失敗の表示を追加' },
    last: { zh: '失败时在面板顶部写明哪个应用没写进去。', en: "When a write fails, the top of the page names the app it didn't reach.", ja: '失敗時はページ上部に書き込めなかったアプリを表示します。' },
    ago: { unit: 'days', count: 1 },
    bucket: 'yesterday',
    turns: [
      turn(
        { zh: '某个应用的配置写不进去时，MCP 页上看不出来。', en: "When one app's config can't be written, the MCP page doesn't show it.", ja: 'あるアプリの設定に書き込めないとき、MCP ページでは分かりません。' },
        [
          { kind: 'read', target: 'src/components/mcp/UnifiedMcpPanel.tsx' },
          { kind: 'edit', target: 'src/components/mcp/UnifiedMcpPanel.tsx', added: 41, removed: 6 },
          { kind: 'edit', target: 'src/components/mcp/AppMatrix.tsx', added: 18, removed: 2 },
          { kind: 'run', target: 'pnpm test:unit mcp' },
        ],
        { zh: '失败时在面板顶部写明哪个应用没写进去，对应的格子变成黄色警告，点一下就重试。', en: "When a write fails, the top of the page names the app it didn't reach, and the cell turns into a yellow warning you can click to retry.", ja: '失敗時はページ上部に書き込めなかったアプリを表示し、該当のセルが黄色の警告になります。クリックで再試行できます。' },
        '18:30',
        '3m21s',
      ),
    ],
  },
  {
    id: 'a8c5d2e1-3f74-4a69-9b80-1e2d3c4b5a68',
    app: 'claude',
    project: '~/Code/cc-switch-website',
    title: { zh: '首页赞助商区改成两列', en: 'Two columns for the home-page sponsors', ja: 'トップのスポンサー欄を 2 列に' },
    last: { zh: '两列网格，窄屏回落到一列。', en: 'A two-column grid that falls back to one on narrow screens.', ja: '2 列のグリッドで、狭い画面では 1 列に戻ります。' },
    ago: { unit: 'days', count: 2 },
    bucket: 'thisWeek',
    turns: [
      turn(
        { zh: '赞助商卡片一列太长了，改成两列。', en: 'The sponsor list is too long in one column. Make it two.', ja: 'スポンサーの一覧が 1 列だと長すぎます。2 列にしてください。' },
        [
          { kind: 'read', target: 'src/components/ccswitch/SponsorsSection.tsx' },
          { kind: 'edit', target: 'src/components/ccswitch/SponsorsSection.tsx', added: 9, removed: 4 },
          { kind: 'run', target: 'npm run check' },
        ],
        { zh: '改成了两列网格，窄屏回落到一列，npm run check 通过。', en: 'It is a two-column grid now and falls back to one column on narrow screens; npm run check passes.', ja: '2 列のグリッドにし、狭い画面では 1 列に戻ります。npm run check も通っています。' },
        '20:14',
        '1m12s',
      ),
    ],
  },
  {
    id: 'e2f4a6c8-0b1d-4e3f-8a5c-7d9e1f2a3b4c',
    app: 'gemini',
    project: '~/Code/cc-switch',
    title: { zh: '整理预设排序', en: 'Tidy up preset order', ja: 'プリセットの並びを整理' },
    last: { zh: '一律按显示名排序，中文按拼音。', en: 'Everything is sorted by display name now.', ja: 'すべて表示名順に並べました。' },
    ago: { unit: 'days', count: 3 },
    bucket: 'thisWeek',
    turns: [
      turn(
        { zh: '添加供应商的列表顺序有点乱。', en: 'The add-provider list order is a bit random.', ja: 'プロバイダー追加の一覧の順番がばらばらです。' },
        [
          { kind: 'read', target: 'src/components/providers/presetGroups.ts' },
          { kind: 'edit', target: 'src/components/providers/presetGroups.ts', added: 14, removed: 22 },
          { kind: 'run', target: 'pnpm test:unit presets' },
        ],
        { zh: '一律按显示名排序，中文按拼音，不再置顶。', en: 'Everything is sorted by display name now, with no pinned entries.', ja: 'すべて表示名順に並べ、固定表示はなくしました。' },
        '16:02',
        '2m45s',
      ),
    ],
  },
  {
    id: '5d6e7f80-9a1b-4c2d-be3f-4a5b6c7d8e90',
    app: 'codex',
    project: '~/Code/opencode-go-probe',
    title: { zh: '抓 OpenCode Go 网关的请求头', en: 'Capture OpenCode Go gateway headers', ja: 'OpenCode Go ゲートウェイのヘッダーを取得' },
    last: { zh: '网关只认 x-api-key。', en: 'The gateway only accepts x-api-key.', ja: 'ゲートウェイは x-api-key しか受け付けません。' },
    ago: { unit: 'days', count: 4 },
    bucket: 'earlier',
    archived: true,
    turns: [
      turn(
        { zh: '看看 OpenCode Go 网关认哪个鉴权头。', en: 'Find out which auth header the OpenCode Go gateway accepts.', ja: 'OpenCode Go ゲートウェイがどの認証ヘッダーを受け付けるか調べてください。' },
        [
          { kind: 'run', target: 'curl -sI -H "Authorization: Bearer $KEY" $GATEWAY/v1/messages', failed: true },
          { kind: 'run', target: 'curl -sI -H "x-api-key: $KEY" $GATEWAY/v1/messages' },
        ],
        { zh: '网关只认 x-api-key，Bearer 会返回 401。', en: 'The gateway only accepts x-api-key; Bearer returns 401.', ja: 'ゲートウェイは x-api-key だけを受け付け、Bearer では 401 が返ります。' },
        '11:37',
        '46s',
      ),
    ],
  },
  {
    id: 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
    app: 'pi',
    project: '~/Code/cc-switch-website',
    title: { zh: '压缩首页图片', en: 'Compress home-page images', ja: 'トップページの画像を圧縮' },
    last: { zh: '转成 WebP 后总大小少了 61%。', en: 'WebP cut the total size by 61%.', ja: 'WebP にして合計サイズが 61% 減りました。' },
    ago: { unit: 'days', count: 8 },
    bucket: 'earlier',
    turns: [
      turn(
        { zh: '首页图片太大，转成 WebP。', en: 'The home-page images are too big; convert them to WebP.', ja: 'トップページの画像が大きすぎるので WebP にしてください。' },
        [
          { kind: 'run', target: 'npx sharp-cli -i src/assets/*.png -o src/assets -f webp' },
          { kind: 'edit', target: 'src/components/ccswitch/HeroSection.tsx', added: 4, removed: 4 },
        ],
        { zh: '转成 WebP 后总大小少了 61%，引用都换好了。', en: 'WebP cut the total size by 61%, and the imports are updated.', ja: 'WebP にして合計サイズが 61% 減り、参照も差し替えました。' },
        '10:05',
        '1m58s',
      ),
    ],
  },
  {
    id: 'f0e1d2c3-b4a5-4968-8776-5a4b3c2d1e0f',
    app: 'opencode',
    project: '~/Code/cc-switch-website',
    title: { zh: '修复手册里的死链', en: 'Fix dead links in the manual', ja: 'マニュアルのリンク切れを修正' },
    last: { zh: '已提交 fix(docs): 修正 12 处死链。', en: 'Committed fix(docs): 12 dead links.', ja: 'fix(docs): リンク切れ 12 件を修正、をコミットしました。' },
    ago: { unit: 'days', count: 9 },
    bucket: 'earlier',
    turns: [
      turn(
        { zh: '手册里有些链接打不开，查一遍。', en: 'Some links in the manual are broken; check them all.', ja: 'マニュアルに開けないリンクがあるので、全部確認してください。' },
        [
          { kind: 'run', target: 'npx lychee docs/**/*.md' },
          { kind: 'edit', target: 'docs/user-manual/zh/4-proxy/4.2-failover.md', added: 3, removed: 3 },
          { kind: 'run', target: 'git commit -m "fix(docs): 12 dead links"' },
        ],
        { zh: '已提交 fix(docs): 修正 12 处死链。', en: 'Committed fix(docs): 12 dead links.', ja: 'fix(docs): リンク切れ 12 件を修正、をコミットしました。' },
        '17:20',
        '3m05s',
      ),
    ],
  },
  {
    id: '0a9b8c7d-6e5f-4a3b-9c2d-1e0f9a8b7c6d',
    app: 'hermes',
    project: null,
    title: { zh: '周报草稿', en: 'Weekly report draft', ja: '週報の下書き' },
    last: { zh: '已按项目列出本周完成的事。', en: "Listed this week's work by project.", ja: '今週の作業をプロジェクトごとにまとめました。' },
    ago: { unit: 'days', count: 12 },
    bucket: 'earlier',
    turns: [
      turn(
        { zh: '帮我把这周的提交整理成周报。', en: "Turn this week's commits into a weekly report.", ja: '今週のコミットを週報にまとめてください。' },
        [{ kind: 'run', target: 'git log --since="1 week ago" --oneline' }],
        { zh: '已按项目列出本周完成的事，每项一句话。', en: "Listed this week's work by project, one line each.", ja: '今週の作業をプロジェクトごとに 1 行ずつまとめました。' },
        '19:48',
        '38s',
      ),
    ],
  },
];

/* ---------- Accounts ---------- */

export interface SampleAccount {
  login: string;
  host?: string;
  signedIn: L;
  usedBy: number;
  isDefault?: boolean;
  needsReauth?: boolean;
  quota: Array<{ tier: 'premium' | 'fiveHour' | 'weekly'; left: number }>;
  /** ChatGPT's saved limit resets, grouped by expiry day (earliest first). */
  resetCredits?: Array<{ date: L; inTime: string; count: number; expiringSoon?: boolean }>;
  /** Codex Credits balance bought on the ChatGPT plan. */
  credits?: number;
  checkedMinutesAgo: number;
}

export type AuthService = 'copilot' | 'chatgpt' | 'xai';

export const ACCOUNTS: Record<AuthService, SampleAccount[]> = {
  copilot: [
    {
      login: 'octocat',
      host: 'github.com',
      signedIn: { zh: '9月12日', en: 'Sep 12', ja: '9月12日' },
      usedBy: 2,
      isDefault: true,
      quota: [{ tier: 'premium', left: 72 }],
      checkedMinutesAgo: 3,
    },
  ],
  chatgpt: [
    {
      login: 'dev@example.com',
      signedIn: { zh: '9月30日', en: 'Sep 30', ja: '9月30日' },
      usedBy: 3,
      isDefault: true,
      quota: [
        { tier: 'fiveHour', left: 64 },
        { tier: 'weekly', left: 81 },
      ],
      resetCredits: [
        { date: { zh: '10月12日', en: 'Oct 12', ja: '10月12日' }, inTime: '4d6h', count: 2 },
        { date: { zh: '11月2日', en: 'Nov 2', ja: '11月2日' }, inTime: '25d', count: 1 },
      ],
      credits: 62500,
      checkedMinutesAgo: 1,
    },
    {
      login: 'team@example.com',
      signedIn: { zh: '10月3日', en: 'Oct 3', ja: '10月3日' },
      usedBy: 1,
      quota: [
        { tier: 'fiveHour', left: 8 },
        { tier: 'weekly', left: 40 },
      ],
      resetCredits: [{ date: { zh: '10月9日', en: 'Oct 9', ja: '10月9日' }, inTime: '1d20h', count: 1, expiringSoon: true }],
      checkedMinutesAgo: 6,
    },
  ],
  xai: [
    {
      login: 'grok-builder',
      signedIn: { zh: '8月21日', en: 'Aug 21', ja: '8月21日' },
      usedBy: 1,
      isDefault: true,
      needsReauth: true,
      quota: [{ tier: 'weekly', left: 55 }],
      checkedMinutesAgo: 0,
    },
  ],
};

/* ---------- Apps ---------- */

export interface SampleTool {
  app: AppId;
  /** Install source pill. */
  source?: string;
  path?: string;
  version?: string;
  latest?: string;
  installHint?: 'script' | 'npm';
  /** Another install found on PATH. */
  conflict?: { path: string; version: string; source: string };
}

export const TOOLS: SampleTool[] = [
  {
    app: 'claude',
    source: 'Homebrew',
    path: '/opt/homebrew/bin/claude',
    version: '2.4.1',
    latest: '2.4.3',
    conflict: { path: '~/.npm-global/bin/claude', version: '2.3.9', source: 'npm' },
  },
  { app: 'claude-desktop' },
  { app: 'codex', source: 'npm', path: '~/.npm-global/bin/codex', version: '0.142.0' },
  { app: 'gemini', source: 'npm', path: '~/.npm-global/bin/gemini', version: '0.31.2', latest: '0.32.0' },
  { app: 'grokbuild', source: 'npm', path: '~/.npm-global/bin/grok', version: '0.1.6' },
  { app: 'opencode', source: 'Homebrew', path: '/opt/homebrew/bin/opencode', version: '1.4.7' },
  { app: 'openclaw', installHint: 'npm' },
  { app: 'hermes', path: '~/.local/bin/hermes', version: '0.9.2' },
  { app: 'pi', source: 'npm', path: '~/.npm-global/bin/pi', version: '1.0.4' },
  { app: 'mcode', installHint: 'script' },
];
