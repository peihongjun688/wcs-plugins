---
name: web-console-starter-full
slug: web-console-starter-full
displayName: Web Console Starter · 多皮肤中后台脚手架
version: 1.2.1
description: 用 web-console-starter 脚手架搭建/扩展一个带多皮肤的中后台 Web 系统（Vue3 + ElementPlus + ECharts + Express + SQLite）。触发词：用 wcs 模板建系统、脚手架一套新控制台、给控制台换皮肤/加皮肤、做软件著作权演示系统、批量产出多套业务系统、系统要支持手机访问/H5/移动端。技能内自带：桌面 4 套皮肤 + 移动 **H5 独立 6 套皮肤**（玻璃视觉、底部 TabBar、彩色 SVG 图标、设置页即时切换）、5 类示范页面模板且**全部桌面/H5 双形态**（`useH5()` + `v-if`，≤768px 自动切 H5 布局，总览自动进 `/h5` 玻璃总览）、Express+SQLite 后端底座、换肤/命名/脱敏/打包四件套工程脚本、多智能体引导（README/AI-GUIDE/CLAUDE/AGENTS）、4 套桌面皮肤真机演示图 + H5 v2.0 六皮肤/五页面真机截图。桌面视觉规范见 docs/设计规范.md，H5 视觉契约见 docs/H5视觉规范v2.0.md（★），移动端布局适配见 docs/H5移动端开发约束与指导.md。产出物是「能直接跑、可直接改、可一键打包发布」的完整可运行工程。
category: 开发编程
tags: [web-console-starter, wcs, 脚手架, 中后台, Vue3, ElementPlus, ECharts, Express, SQLite, 多皮肤, 低代码, 软件著作权, H5, 移动端, 响应式, 玻璃拟态, TabBar]
license: MIT
---

# web-console-starter-full · 多皮肤中后台系统脚手架（完整技能包）

## 这是什么

一套把「Vue3 + ElementPlus + ECharts + Express + SQLite」拼好的**可运行中后台模板**：
- **换肤靠纯 CSS 变量 token 契约**，组件零硬编码颜色；4 套皮肤开箱即用（深色/浅色/墨绿/紫金），加皮肤跑一条命令。
- **5 类示范页面**（登录/总览/数据列表/趋势分析/明细台账/系统设置）含 mock 开关，无后端也能先跑前端。
- **手机 H5 v2.0 开箱即用（玻璃视觉）**：≤768px 自动切换——总览路由 `/dashboard` 自动进 `/h5`（EPDM 风玻璃总览 HDashboard），底部固定 `MobileTabBar`（5 项+中间凸起"全部"），5 类业务模板页均为**桌面/H5 双形态分支**（`useH5()` 返回响应式 `isH5`，数据逻辑共用一份，桌面形态零改动），H5 走独立 `--v2-*` token 的 **6 套皮肤**（深蓝玻璃默认/墨绿/紫金/冰蓝/暖阳浅/清新浅），设置页可即时切换无需重载。视觉契约见 `docs/H5视觉规范v2.0.md`，布局/断点/兜底见 `docs/H5移动端开发约束与指导.md`（v1.2.0 起已降为该适配层）。
- **后端底座** Express + SQLite（Node ≥22.13 内置 `node:sqlite`，零原生依赖），含鉴权/角色权限/错误处理/健康检查。
- **工程脚本四件套**：脚手架、加皮肤、命名一致性校验、脱敏门禁、一键打包发布。
- **多智能体友好**：README（人读）、AI-GUIDE（任何智能体）、CLAUDE/AGENTS（自动加载引导）。

## 包内结构

```
web-console-starter-full/
├── SKILL.md                 本文件（技能入口）
├── README.md                人读快速开始
├── AI-GUIDE.md              给任何智能体的完整开发规范（必读）
├── CLAUDE.md / AGENTS.md    各智能体自动加载引导（指路 AI-GUIDE）
├── CHANGELOG.md / LICENSE   MIT
├── app.config.example.js    单点配置示例（复制为 app.config.js）
├── app.config.js            当前生效配置（脚手架会复制并按参数改写）
├── package.json             根声明（app.config.js 为 ESM）
├── scripts/                 init-app / new-skin / check-names / scan-secrets / build-dist + 启停
├── frontend/                Vue3 前端（src/views 五类页面模板 + themes/ 皮肤）
├── backend/                 Express 后端（src/controllers·middleware·routes + 种子库）
├── docs/                    设计规范 / H5视觉规范v2.0（★H5 视觉契约）/ H5移动端适配层 / 换肤指南 / 兼容与分发
├── assets/screenshots/      11 张 H5 真机截图（6 皮肤 + 5 页面，README「界面预览」表引用，安装后本地可看）
└── examples/skins/          4 套桌面皮肤 × 6 页面演示图——仅本机真源/演示实例保留；发布包为控制文件数（≤100）不携带，桌面视觉参考以实际运行效果为准
```

## 快速开始（30 秒起一个）

```bash
# 方式一：原样跑起来（Windows，默认 :3000）
scripts/start.bat

# 方式二：脚手架一套新系统（推荐）
powershell -ExecutionPolicy Bypass -File scripts/init-app.ps1 `
  -AppName my-orders -Title "订单管理系统" -LogoText OD -Skin light-pro -Install
# 新系统生成在 ../../my-orders（可 -OutDir 指定），进目录跑 start.bat 即起
```

默认演示账号（见 backend/.env.example，首启请改）：`admin / admin123`，另有 operator / viewer 演示角色权限矩阵。

## 五步工作流（新系统开发）

1. **脚手架**：`scripts/init-app.ps1` → 输出新项目，**五处名称自动同步**（文件夹 / app.config / package.json / index.html / README 抬头）。生成后先跑通 1 次确认无破版，再批量。
2. **配置**：改根 `app.config.js`（name/title/subtitle/logoText/skin/apiBase/devPort/devProxyTarget）。`skinPreview:true` 时运行时皮肤下拉可预览覆盖。
3. **开发**：
   - 前端：`frontend/src/views/` 五类页面模板按业务替换；路由在 `router/index.js` 增删。**颜色只许用 CSS 变量**（详见 docs/设计规范.md 的 token 契约表），组件与内联样式零硬编码色值。
   - 后端：`backend/src/controllers/` 仿 auth/items/settings 三例新增 controller，在 `routes/index.js` 挂载；`db.js` 建表 + 种子。
   - 换肤：`scripts/new-skin.ps1 -Name <名> -Accent <主色hex>` → 自动生成 `frontend/src/themes/<名>.css` 并在 `app.skin.js` 登记。
4. **校验（每次交付前必过）**：
   - `scripts/check-names.ps1` → 五处名称 0 diff。
   - `scripts/scan-secrets.ps1` → 脱敏关键词 0 命中（**别在文档里字面写脱敏词，会自扫命中**）。
5. **打包**：`scripts/build-dist.ps1` → 自动 隐私扫描→构建→裁剪→zip，产出 `dist/<name>-v<ver>.zip`（含四皮肤内置 SPA）。

## 常见坑（详细见 AI-GUIDE 踩坑表）

- **换肤破版 90% 源于写死颜色**：一律走 `--bg-*/--panel/--txt-*/--accent/--chart-1..10` 变量；弹窗/抽屉属 body 层，暗色皮肤要一并处理。
- **ECharts 不随换肤变色**：用 `app.theme.js` 从 CSS 变量注册 'app' 主题，图表 init 时 `theme:'app'`，切肤后 dispose+重绘。
- **暗色皮肤下拉/日期面板叠穿**：ElementPlus 弹层默认浅色，需在皮肤文件里覆盖 `--el-bg-color` 等变量。
- **401 循环**：后端 401 前端要跳 `/login` 且清空 token（api 拦截器已有闭环，别自己写重复逻辑）。
- **图表容器隐藏时 init 尺寸为 0**：路由切换/折叠侧栏后调用 resize。
- **发布前脱敏**：包内不得含机器绝对路径/内部域名/账号；`build-dist` 已内置门禁，手动加文件后务必重跑。

## 硬性校验清单（"任务完成"判定）

- [ ] `scripts/init-app.ps1` dry-run 五处名称同步无 diff（或 `check-names.ps1` 0 diff）
- [ ] `scripts/scan-secrets.ps1` 输出 0 hits
- [ ] `npm run build` 通过（或 build-dist 全流程走通）
- [ ] `GET /api/v1/health` → 200（db ok）
- [ ] 4 套皮肤均登录可见且无破版（参考 `examples/skins/*/02-dashboard.png` 效果）
- [ ] 若生成新系统：五处名称与业务一致、种子数据 ≥5 条真实可编辑、报表由真实数据聚合（禁止静态桩）
- [ ] **移动 H5 v2.0 验收**（若声明支持手机访问）：375×812 无横向溢出；底部 TabBar 可见；总览自动进 `/h5`（EPDM 风）；业务页渲染各自 H5 形态（非桌面压扁）；6 套 H5 皮肤设置页可即时切换、玻璃/图标/圆角达标（详见 docs/H5视觉规范v2.0.md §15 验收清单 + H5移动端开发约束与指导.md §7）

## 许可与版本

MIT License；当前版本见 CHANGELOG.md。examples/skins 演示图仅作验收/参考展示。
