# AI-GUIDE.md — 任何智能体照此开发新系统

> 你是来用 `web-console-starter` 开发一套业务系统的 AI。**先完整读完本文件再动手**，它包含：接入步骤、目录职责、页面写法、后端加模块法、硬性校验清单与踩坑表。
> 本模板沉淀自多套真实系统的工程经验，绝大多数 BUG 都能在本文件"踩坑表"里找到答案。

---

## 1. 这是谁

web-console-starter = **通用 Web 控制台模板**：Vue3 + Vite + ElementPlus + ECharts 前端 + Express + node:sqlite 后端。
用途：把模板复制成**任意名称**的业务系统（信息管理/监控/台账/审批…），前端 5 类页面、后端鉴权+模块 CRUD、4 套皮肤、一键启停、脱敏打包全部开箱即用。

能产出：一套能登录、能增删改查、能出统计图、能换肤、能一键启停、且**不含任何内部信息**的独立系统。

## 2. 30 秒开始

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File scripts/init-app.ps1 `
  -AppName my-orders -Title "订单管理系统" -Subtitle "..." -LogoText OD `
  -Skin light-pro -Port 8080 -Install
cd ..\my-orders\scripts; .\start.bat
# Linux/macOS：scripts/start.sh
```

`init-app` 已替你完成：目录拷贝、`app.config.js` 写入、前后端 package.json 改名、`index.html` 标题替换、`backend/.env` 生成（随机 JWT + 种子账号 + 指定端口）、可选 `npm install+build`。
默认账号占位：`admin/admin123`（生产首启必须改，见 .env）。

## 3. 定制三步

1. **改身份与观感**：`app.config.js` → `name/title/subtitle/logoText/skin/apiBase/devPort`。改 `skin` 换肤，组件零改动。
2. **写业务页面**：复制 `frontend/src/views/` 里 5 类页面模板（见 §5），去掉 mock 接真实 API。
3. **加后端业务**：复制 `backend/src/controllers/modules/items`（样例 CRUD）与路由注册（见 §6）。

## 4. 目录职责

| 路径 | 放什么 / 规矩 |
|---|---|
| `app.config.js` | 全站唯一身份源。**凡涉及名字/皮肤/端口的修改都改这里** |
| `frontend/src/themes/*.css` | 皮肤=CSS 变量。**不许改结构**；新增走 new-skin.ps1 |
| `frontend/src/style.base.css` | 基础层（滚动条/按钮/EP 覆盖）。所有颜色引用变量，**禁止硬编码** |
| `frontend/src/views/` | 你的业务页面（复制模板改） |
| `frontend/src/components/` | BaseChart/KpiRing/PanelCard 通用件，尽量复用 |
| `frontend/src/api/index.js` | axios 封装 + 401 拦截 + unwrap，新增接口加在对应 api 对象 |
| `frontend/src/mock.js` | `USE_MOCK` 开关与演示数据；开发期开着跑页面流 |
| `frontend/src/router/index.js` | 路由 + meta{title,icon} + 登录守卫 |
| `backend/src/routes/index.js` | 注册 API 到 `/api/v1`，写操作挂 `canAction` |
| `backend/src/controllers/` | 业务控制器（含 modules 样例抄写） |
| `backend/src/middleware/auth.js` | requireAuth/requireRole/canAction（admin=全权、operator=增改ack、viewer=只读） |
| `scripts/` | 启停/初始化/皮肤/校验/打包，勿手改名称 |
| `docs/` | 设计规范（桌面规格）/ **H5视觉规范v2.0**（★H5 视觉契约：6 皮肤/玻璃/图标/TabBar/验收）/ **H5移动端开发约束与指导**（适配层：断点/触控/兜底）/ 换肤指南 / 兼容分发 |

## 5. 页面写法（5 类模板 + mock）

| 模板 | 文件 | 什么时候用 |
|---|---|---|
| 登录 | `views/Login.vue` | 全站通用，通常不动 |
| 总览 | `views/Dashboard.vue` | 首页大屏：KPI 环形 + 趋势 + 占比 + 事项/服务 |
| 列表 | `views/CrudPage.vue` | 任何"查+增删改"主页面 |
| 趋势 | `views/TrendPage.vue` | 多系列趋势 + 区间合计 |
| 详情 | `views/DetailPage.vue` | 单对象详表 + 大图 |
| 设置 | `views/SettingsPage.vue` | 皮肤预览/账号信息/关于 |

规则：
- 每个页面模板内部都有 mock 分支（`mock.js` 的 `USE_MOCK` + 各生成函数）。开发期 `USE_MOCK=true` 直接跑；联调改 `false` 并让页面走 `api/`。
- 图表一律用 `<BaseChart>`（内部已注册主题与 resize 清理），**不要**裸 `echarts.init`。
- 统计/报表必须由真实数据聚合（接口算好返回），禁止预填静态桩。
- **手机 H5 v2.0 已内置且强制**：≤768px 视口下，总览路由 `/dashboard` 自动切到 `/h5`（EPDM 风玻璃总览 demo）；布局底部固定 `MobileTabBar`；**5 类业务模板页均自带桌面/H5 双形态**（`useH5()` 返回响应式 `isH5`，`v-if` 分支渲染各自 H5 布局，数据与逻辑与桌面共用）。新增页面的规范做法：
  1. `const { isH5 } = useH5()`（`@/useH5`，断点与布局一致 ≤768px，勿另写断点常量）。
  2. template 写 `<div v-if="isH5" class="h5-page">…H5 布局…</div><div v-else>…桌面…</div>`；H5 根节点必须加 `background: var(--v2-bg-deep)` + `background-attachment: fixed`（皮肤背景）。
  3. H5 布局只用 `--v2-*` token 与 v2 组件（SvgIcon/MobileTabBar/ModuleGrid/HealthRing/BigKpi/ServerCard），不要复用桌面 `--panel/--txt-*`。
  4. 视觉以 `docs/H5视觉规范v2.0.md` 为准；375×812 验收，桌面形态不受影响。
  - 完整约束见 `docs/H5移动端开发约束与指导.md`，收工前按 `docs/H5视觉规范v2.0.md` §15 验收清单在 375×812 视口逐项过。

## 6. 后端加业务模块（教科书式抄写）

以现有 `modules/items` 为例，加一套 `orders`：
1. `backend/src/db.js` `schema()` 加 `orders` 建表语句；`seedIfEmpty()` 加 ≥5 条**虚构、可编辑**种子（不要真实公司/品牌名）。
2. 复制 `controllers/items.controller.js` → `orders.controller.js`，把表名/字段/`nextCode` 前缀改成业务语义。
3. `routes/index.js` 挂 `/modules/orders/*`：list/meta/get/create/update/remove，写操作 `canAction('create'/'edit'/'delete')`。
4. 前端列表页把 api 指向 orders、表格列换成业务字段即可。

后端响应统一 `{code, msg, data}`：`code=0` 成功；前端 `api` 层已 unwrap，错误自动 `ElMessage`。401 由拦截器跳登录，业务代码无需处理。

## 7. 硬性校验清单（收工前逐项过，全绿才算完成）

- [ ] 五处名称一致：文件夹名 / `app.config.name` / frontend+backend `package.json` name / `index.html` title / 皮肤 css 存在 → 跑 `scripts/check-names.ps1`（0 diff）
- [ ] 种子数据：每模块 ≥5 条、可编辑、非真实品牌
- [ ] 报表/统计由真实数据聚合（页面无静态桩）
- [ ] 一键启停可用：`start.bat`（或 .sh）双击起、浏览器页面全通、`stop` 能停
- [ ] 换肤验收：当前皮肤 + light-pro 各页面截图，无文字/按钮/图表破版
- [ ] 权限矩阵抽查：viewer 账号写操作被拒（后端 403 语义）
- [ ] 脱敏：`scripts/scan-secrets.ps1` 0 命中
- [ ] 真机浏览器逐页实测（登录→各页→增删改→图表渲染），如实汇报失败项
- [ ] 交付物五件齐：目录 / 软著 docx / 设计文档 / 代码压缩包等按项目约定
- [ ] （声明手机可用时）H5 v2.0 验收：375×812 无横向溢出 / 底部 TabBar / 业务页走 H5 形态 / 6 套 H5 皮肤可切（见 docs/H5视觉规范v2.0.md §15 + H5移动端开发约束与指导.md §7）

## 8. 高频踩坑表（从真实系统沉淀）

| 症状 | 根因 | 处理 |
|---|---|---|
| 图表页面切走再回来白屏/内存涨 | echarts 未 dispose / resize 监听泄漏 | 用 `<BaseChart>`；手写实例务必 dispose + 移除监听 |
| 登录后刷新跳回登录 | token 失效/存储 key 不一致 | key 前缀 `${cfg.localKey||cfg.name}`，全站一致；401 只清当前站 key |
| 暗色弹窗叠穿/半透明 | 弹层用了半透明卡片底 | 弹窗/下拉/日历用 `--panel-solid` 不透明底 |
| 换肤后某页破版 | 该页硬编码了颜色 | grep `rgba(255,255,255` 等，改为 `var(--…)` |
| 手机上页面横向溢出 | 控件定宽/容器 min-width 超视口 | 工具条控件别写死宽；≤768 有全局兜底 `width:100%`；自查 `scrollWidth>innerWidth` |
| 手机上弹窗超出屏幕 | 弹层固定宽未收缩 | 全局已限 `max-width:calc(100vw - 24px)`；自定义浮层同样遵守 |
| iOS 点输入框页面放大 | 输入字号 <16px | ≤768 全局已设 16px；新增输入类保持 ≥16px |
| 启动后页面是旧包 | 浏览器缓存 / 后端 public 未重建 | `start.bat` 已内置"缺则构建+构建守卫(buildinfo)"; 仍旧则手动 `npm run build` |
| 后端 `node:sqlite` 报错 | Node < 22.13 | 升级 Node（engines 已声明 ≥22.13） |
| PowerShell 跑脚本报乱码语法错 | 脚本含中文且无 BOM，PS5.1 按 GBK 解析 | 本模板脚本一律 ASCII-only；你新写的 .ps1 也请遵守 |
| robocopy 排除不生效 | `/XD` 传了相对路径 `backend\public` | `/XD` 只认目录名或**完整路径** |
| 读含中文的 json/文件乱码 | PS5.1 `Get-Content` 按 GBK 解码 UTF-8 | 用 `[System.IO.File]::ReadAllText()`；写回用 `UTF8Encoding($false)` 无 BOM |

## 9. 禁止项

- 不写死名称/凭据/IP/内部路径（全走 `app.config` / `.env` / 占位符）。
- 不删 `mock.js` 的 `USE_MOCK` 开关（AI 联调期要靠它）。
- 不动 `themes/` 结构与 token 契约（新增皮肤只能加文件 + 登记 SKINS）。
- 不在组件里硬编码颜色（破版源头）。
- 不改 `scan-secrets`/`check-names` 的判定逻辑去"凑绿"（红线上限）。
- 不把真实品牌名/公司名放进种子数据。
