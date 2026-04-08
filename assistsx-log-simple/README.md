# assistsx-log-simple

基于 **Vue 3**、**Vite** 与 **assistsx-js** 的日志示例前端：演示日志追加、监听、`uploadLogs` 上报，以及浮窗与页面内两种打开方式。

源码仓库：<https://github.com/ven-coder/assistsx-log-simple>

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
| 日志 SDK | `assistsx-js`（`package.json` 中默认为相邻目录 `../assistsx-js`，可按需改为 registry 版本） |

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

### assistsx-js 解析方式

- **默认**：若存在相邻仓库 `../assistsx-js` 且含 `src/index.ts`，开发模式会通过别名直连本地源码（便于联调）。
- **强制使用 node_modules**：`ASSISTSX_USE_NPM=1 npm run dev`（或使用脚本 `npm run dev:registry`）。
- **自定义本地路径**：设置环境变量 `ASSISTSX_JS_LOCAL` 指向 assistsx-js 根目录。

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

上传逻辑在 `src/views/log-panel.vue` 中调用 `log.uploadLogs`，`uploadKey` 需与宿主端 `uploadLogs` / 诊断配置一致；更换环境时请同步修改代码中的常量或改为可配置项。
