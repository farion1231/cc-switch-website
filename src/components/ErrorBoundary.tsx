import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Per-session flag so we only auto-reload ONCE. If a chunk is permanently
// unavailable (e.g. a 404 that got long-cached), reloading again would loop —
// so the second failure falls through to the static fallback below.
const RELOAD_FLAG = "cc-switch-chunk-reload";

// Detect "a dynamically imported chunk failed to load" — the dominant real
// cause here: after a deploy the old index.html references a hashed chunk that
// no longer exists, or a stale/poisoned cache returns the wrong response.
function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Failed to load module script/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg)
  );
}

function shouldAutoReload(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const { sessionStorage } = window;
    if (sessionStorage.getItem(RELOAD_FLAG)) return false;
    sessionStorage.setItem(RELOAD_FLAG, "1");
    return true;
  } catch {
    return false;
  }
}

// Intentionally i18n-free: the fallback must not depend on the translation
// object or any lazy-loaded module, so it can still render when those are the
// very things that failed to load (e.g. a poisoned/missing JS chunk).
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error);
    // Self-heal a chunk-load failure by reloading once: index.html is served
    // with no-cache, so a reload pulls the latest HTML which points at the
    // current hashed chunks. Guarded by sessionStorage to avoid a reload loop.
    if (isChunkLoadError(error) && shouldAutoReload()) {
      window.location.reload();
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          background: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28 }}>
          页面加载失败 / Failed to load
        </h1>
        <p style={{ margin: 0, opacity: 0.7, lineHeight: 1.6 }}>
          可能是站点更新后缓存未刷新，请清除缓存后重试。
          <br />
          This may be a stale cache after a site update. Please clear your cache
          and reload.
        </p>
        <button
          type="button"
          onClick={() => location.reload()}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            border: "1px solid #e5e5e5",
            background: "#e5e5e5",
            color: "#0a0a0a",
            fontWeight: 600,
          }}
        >
          刷新 / Reload
        </button>
      </div>
    );
  }
}
