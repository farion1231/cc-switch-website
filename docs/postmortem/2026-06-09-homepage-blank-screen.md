# 复盘:官网首页白屏(MIME 缓存中毒)

- **日期**:2026-06-09
- **影响**:部分用户打开 ccswitch.io 首页只见背景色、无内容
- **严重度**:高(首页不可用),但仅影响部分用户
- **状态**:代码层修复已落地并通过 `npm run check`(本地);**待部署 + Cloudflare Purge**

---

## 一、现象

部分用户打开 ccswitch.io 首页只看到背景色、没有任何内容(白屏)。F12 控制台报错:

```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html".

TypeError: Failed to fetch dynamically imported module:
https://ccswitch.io/assets/CCSwitchHome-16SBFQob.js
```

其中 `CCSwitchHome-*.js` 正是**首页组件的懒加载分片(lazy chunk)**,所以白的恰好是首页。

## 二、根因:两条配置组合成"毒药"

单看都合理、组合起来出事:

1. **`public/_redirects`** 有 SPA 兜底规则 `/* /index.html 200`——任何不存在的路径(**包括 `/assets/*.js`**)都会被兜底返回 `index.html`,状态码 `200`,`Content-Type: text/html`。
2. **`public/_headers`** 配了 `/assets/* → Cache-Control: public, max-age=31536000, immutable`——它按**请求路径**匹配,于是上面那个"其实是 HTML 的 200 响应"被打上了**一年长缓存 + immutable(永不重新验证)**。

结果:一个缺失的 JS 分片,拿到的是一份 HTML,却被当成 JS 缓存了一年。

## 三、完整因果链

```
部署切换窗口 / 某个 CF 边缘节点还没同步到新的 lazy chunk
   ↓
客户端 import() 请求该 chunk → 命中 SPA 兜底 → 拿到 200 + text/html(毒化响应)
   ↓
被 immutable 规则缓存一年(浏览器本地 + CF 边缘节点都缓存)
   ↓
浏览器因 nosniff + 严格 MIME 检查,拒绝把 text/html 当模块脚本执行
   ↓
首页组件 import() 失败,且整条 React 树没有任何 ErrorBoundary(放大器)
   ↓
异常未被局部捕获 → 直接清空 #root → 整页白屏,只剩背景色
```

## 四、为什么"只有个别用户、刷新也没用"

- **只影响个别用户**:只有在部署切换瞬间、或恰好命中某个尚未同步新分片的边缘节点的用户才会被"投毒"。
- **刷新无效**:毒化响应带 `immutable`,浏览器和边缘节点都不会重新验证。
- **服务器其实是好的**:排查时直接 curl 那个出错的分片,返回的是**正常 JS**。说明问题出在**用户侧浏览器缓存 / 离用户最近的某个 CF 边缘节点缓存**里残留的旧毒化响应,而非服务器文件本身损坏。这也是为什么开发/直连测试都正常、却有用户白屏。

## 五、排查证据(curl 生产环境)

| 请求 | 状态码 | Content-Type | Cache-Control |
|---|---|---|---|
| `/assets/不存在.js` | **200** ⚠️ | **text/html** ⚠️ | **immutable, 1年** ⚠️ |
| `/不存在的页面`(对照) | 200 | text/html | max-age=0(不缓存) |
| `/zh/` 首页(对照) | 200 | text/html | max-age=0 ✓ |

第一行就是毒药复现:一个不存在的 `.js`,被当成可永久缓存的 JS。对照组证明问题只出在 `/assets/*` 这个路径前缀上。

## 六、已落地的代码层修复(本地,待部署)

以下均已写入工作区并通过本地 `npm run check`(lint + typecheck + build,`exit 0`):

1. **`public/_redirects`** 移除全局 `/* /index.html 200` 兜底,改为只对真实客户端路由 rewrite 到 `index.html`:

   ```
   /zh  /index.html  200
   /zh/*  /index.html  200
   /en  /index.html  200
   /en/*  /index.html  200
   /ja  /index.html  200
   /ja/*  /index.html  200
   /docs  /index.html  200
   /changelog/*  /index.html  200
   /tutorials/*  /index.html  200
   ```

   这样 `/assets/*.js`、`/docs/<lang>/**/*.md` 等静态资源不会再被 SPA 兜底规则劫持。缺失资源返回真正的 404,而不是 200 HTML。

2. **`public/_headers`** 移除 `/assets/* → immutable` 自定义长缓存。Pages 默认缓存仍可服务静态资源,但不会因为路径匹配把缺失资源或错误响应长缓存一年。

3. **`public/_headers`** 显式给 `index.html` 和所有 SPA HTML 入口设置 `Cache-Control: no-cache`。chunk 加载失败后的自愈链条依赖 reload 能重新验证 HTML 并拿到最新 hash 引用,因此不再把这个前提隐含地交给 Cloudflare Pages 默认行为。

4. **`public/404.html`** 新建纯静态错误页。因为仓库现在显式提供了顶层 `404.html`,未知路径会进入 Cloudflare Pages 的正常 404 行为,而不是默认 SPA fallback。

5. **`src/components/ErrorBoundary.tsx` + `src/main.tsx`** 新建顶层 `ErrorBoundary`(不依赖 i18n 的静态 fallback + 刷新按钮),并在 `main.tsx` 最外层包裹。今后任何渲染/加载异常都降级为可刷新的错误页,而不是整页白屏。

6. **chunk 加载失败自愈**:`ErrorBoundary` 识别 "Failed to fetch dynamically imported module / Failed to load module script" 这类错误,自动 reload 一次。reload flag 使用 `sessionStorage`,但读写已做 `try/catch`,隐私模式或禁用存储时会跳过自动 reload 并保留 fallback UI。

## 七、还需运维/部署侧执行

1. 部署上述改动。
2. Cloudflare 控制台 **Purge Everything**,清掉已中毒的边缘节点缓存。
3. 部署 + Purge 后,因 `index.html` 是 `max-age=0`,中毒用户下次访问会重新验证、被引导到新 hash 的分片,从而绕开旧毒缓存自愈。

**部署后验证**:

```bash
curl -sI "https://ccswitch.io/assets/does-not-exist-probe.js" | grep -iE "HTTP|content-type|cache-control"
```

预期结果:

- 状态码是 `404`,不是 `200`
- `Content-Type` 不再是可被当作 JS module 的响应
- `Cache-Control` 不再包含 `immutable`
- `/zh/`、`/en/`、`/ja/` 等 HTML 入口返回 `Cache-Control: no-cache`

## 八、一句话总结

> SPA 的 `/* → index.html 200` 兜底 + `/assets/* → immutable` 长缓存,两条配置组合后会把"缺失的 JS 分片"投毒成"被永久缓存的 HTML",叠加前端缺少 ErrorBoundary,最终在部署切换期把个别用户的首页打成白屏。修复:限定 SPA rewrite 范围,移除 assets 路径级 immutable,显式 no-cache HTML 入口,补上静态 404 与顶层 ErrorBoundary 自愈。

## 九、经验教训 / 后续

- **缓存规则按请求路径匹配,与"文件是否真实存在 / 响应状态码"无关**——给某个前缀配长缓存时,要考虑该前缀下"缺失文件被兜底"的情况。`immutable` 尤其危险:命中错误内容时极其顽固(刷新无效,只能 Purge)。
- **SPA fallback 应该精确匹配客户端路由**:不要用全局 `/*` 覆盖静态资源命名空间。
- **SPA 必须有顶层 ErrorBoundary**:否则任何局部异常(一次 import 失败、一处取值崩溃)都会被放大成整页白屏。
- 后续 action item:① 部署 + Purge;② 部署后实测缺失 assets 返回 404 且不带 immutable;③ 把"缺失 assets 应返回 404 且不被长缓存"纳入部署回归检查。
