# assistsx-log-simple

基于 **Vue 3**、**Vite** 与 **assistsx-js** 的日志示例前端：演示日志追加、监听、`uploadLogs` 上报，以及浮窗与页面内两种打开方式。

源码目录：<https://github.com/assists-pro/assists-examples/tree/main/assistsx-log-simple>

## 功能概览

- **首页**：介绍 assistsx-js 日志能力；入口「浮窗」通过 `float.open` 打开日志面板路由；「页面内」进入全屏内联日志页（`inline=1`）。
- **日志面板**（`/examples/log-panel`）：展示 `LogStream` 文本、**添加日志** / **清空** / **上传日志**；监听 `log.addLogUpdateListener`；无 `inline=1` 时视为浮窗场景（样式与根节点透明策略由路由配合 `App.vue`）。
- **运行时配置**：`public/config.json` 供 AssistsX 等宿主读取，并可覆盖首页展示的 **源码链接**（`sourceUrl`）。

## 技术栈

| 项 | 说明 |
| --- | --- |
| 框架 | Vue 3、vue-router 4 |
| 构建 | Vite 8、`@vitejs/plugin-vue` |
| 语言 | TypeScript、vue-tsc |
| 日志 SDK | `assistsx-js`（从 npm 安装，当前为 `^0.2.0`，与 registry 能力一致；本地联调见下文） |

## 路由

| 路径 | 说明 |
| --- | --- |
| `/` | 首页 |
| `/examples/floating` | 浮窗说明子页（占位） |
| `/examples/inline` | 内联说明子页（占位） |
| `/examples/log-panel` | 日志面板；查询参数 `inline=1` 为内联全屏模式 |

## 本地开发

```bash
npm install
npm run dev
```

默认开发服务器：<http://localhost:5173>（见 `vite.config.js`）。

**环境变量**：`vite.config.js` 将 `envDir` 设为 **本项目目录**（`assistsx-log-simple/`，与 `vite.config.js` 同级）。在 **`assistsx-log-simple/.env`** 或 **`.env.local`** 中配置即可（见 `.env.example`）。

### assistsx-js：公开仓库与本地联调

- **克隆本仓库后**：执行 `npm install` 即可从 npm 安装 `assistsx-js`（与 lockfile 一致），无需在旁再放一份 assistsx-js 源码。
- **开发时联调本机 assistsx-js 源码**（推荐）：将 `.env.example` 中的 `ASSISTSX_JS_LOCAL` 复制到 **`.env.local`**（已被 `*.local` 忽略，勿提交），设为本机 assistsx-js 仓库根目录绝对路径；再 `npm run dev`。开发模式下 Vite 会把 `assistsx-js` 解析到该目录的 `src/index.ts`。
- **未设置 `ASSISTSX_JS_LOCAL` 时**：若存在相邻目录 `../assistsx-js` 且含 `src/index.ts`，仍会走该路径的别名；否则使用 `node_modules` 中的包（与 npm 安装或 `npm link` 一致）。
- **强制与 npm 包一致（不走本地别名）**：`npm run dev:registry` 或 `ASSISTSX_USE_NPM=1 npm run dev`。
- **npm link**：在 assistsx-js 仓库执行 `npm link`，在本项目执行 `npm link assistsx-js`，可在不设 `ASSISTSX_JS_LOCAL`、且不存在可用的 `../assistsx-js` 时，让 `node_modules` 指向本地包（适合验证链接后的构建产物）。

### 其他命令

```bash
npm run build      # 生产构建
npm run preview    # 预览构建结果（默认端口 4173）
npm run lint
npm run typecheck
```

## `public/config.json`

宿主或静态部署可修改该文件，无需重新打包即可调整展示信息，例如：

- `sourceUrl`：首页「源码」链接与复制内容（默认指向本仓库）。
- `name`、`versionName`、`packageName`、`icon` 等：与 AssistsX 应用元数据一致时可一并维护。

## 上传日志说明

上传逻辑在 `src/views/log-panel.vue` 中调用 `log.uploadLogs`。`uploadKey` 与日志服务地址需与宿主端 `uploadLogs` / 诊断配置一致。

可通过 **环境变量** 覆盖（在本项目目录复制 `.env.example` 为 `.env` 或 `.env.local`，见其中 `VITE_LOG_*` 注释）：

- `VITE_LOG_UPLOAD_KEY`：未设置时使用示例内置默认密钥。
- `VITE_LOG_SERVICE_BASE_URL`：完整 origin（优先）；或 `VITE_LOG_SERVICE_HOST` + `VITE_LOG_SERVICE_PORT`，可选 `VITE_LOG_SERVICE_PROTOCOL`（默认 `https`）。未配置 **baseUrl** 时，与原先一致：不传 `baseUrl`，由宿主诊断配置决定。

解析逻辑见 `src/config/log-upload-env.ts`。
