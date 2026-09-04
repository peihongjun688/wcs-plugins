# web-console-starter

一套 **Vue3 + ElementPlus + ECharts + Express** 的通用 Web 控制台模板：把多套业务系统中"一次性成功率最高、BUG 最少、美观度最高"的工程经验沉淀为可复用资产。**换肤、页面模板、后端底座、脱敏打包、多智能体引导**开箱即用。

## 快速开始（30 秒）

```bash
# 方式一：直接用本模板跑起来（Windows）
scripts/start.bat          # 自动装依赖 → 构建 → 起服务 → 开浏览器（默认 :3000）

# 方式二：拷贝成一套新系统（推荐，一步到位）
powershell -ExecutionPolicy Bypass -File scripts/init-app.ps1 `
  -AppName my-orders -Title "订单管理系统" -LogoText OD -Skin light-pro -Install
# 生成在 ..\my-orders，进入 scripts 后 start.bat 即起
```

默认账号（`.env`/`.env.example` 占位，**首启请改**）：`admin / admin123`（另有 operator / viewer 角色演示权限矩阵）。

## 它解决什么

| 痛点 | 模板的做法 |
|---|---|
| 每套系统重复搭壳 | 前端骨架 + 后端底座 + 脚本一次拷全 |
| 换肤破版 | 纯 CSS 变量 token 契约，组件零硬编码 |
| 不知道怎么写页面 | 5 类示范页面模板（含 mock 开关，无后端也能跑） |
| 智能体不会给本项目加模块 | `AI-GUIDE.md`（后端照 modules 样例 CRUD 抄即可） |
| 手改遗漏 / 命名漂移 | `init-app` 一键初始化 + `check-names` 五处一致性校验 |
| 泄露内部信息 | `scan-secrets` 脱敏扫描零命中才允许打包 |
| 发布不便 | `build-dist` 一条命令出"拷贝即跑"的 zip |
| 手机访问 / 要 H5 | 内置 ≤768px 双形态：总览自动进 `/h5` 玻璃总览 + 底部 TabBar，业务页桌面/H5 双形态分支，6 套 H5 皮肤设置页即时切换。视觉见 `docs/H5视觉规范v2.0.md`，布局见 `docs/H5移动端开发约束与指导.md` |

## 目录结构

```
├── app.config.js / .example     # ★ 全站单点配置（名称/标题/皮肤/端口/账号提示）
├── README.md · AI-GUIDE.md      # 人读全景 / ★AI 完整开发规范
├── CLAUDE.md · AGENTS.md        # Claude Code / Codex 自动引导入口
├── CHANGELOG.md · LICENSE       # 版本演进 · MIT(无作者)
├── assets/screenshots/          # H5 真机截图（6 皮肤 + 5 页面，README 预览表引用）
├── docs/
│   ├── 设计规范.md               # 具体规格：token/hex/字号/图表色
│   ├── H5视觉规范v2.0.md        # ★ H5 视觉规格：6 皮肤/玻璃/图标/TabBar/验收清单
│   ├── H5移动端开发约束与指导.md  # H5 适配层：断点/触控/页面形态/验收
│   ├── 换肤指南.md               # token 机制 + 新增皮肤 + 验收
│   └── 兼容与分发.md             # 三层形态 + 四入口 + 发布门禁
├── frontend/                    # Vue3+Vite+ElementPlus+ECharts
│   ├── src/themes/              # 4 套预置皮肤（CSS 变量）
│   ├── src/views/               # 5 类页面模板（登录/总览/列表/趋势/详情/设置）
│   ├── src/components/          # BaseChart / KpiRing / PanelCard
│   └── src/mock.js              # USE_MOCK 开关（无后端跑通页面流）
├── backend/                     # Express + node:sqlite（Node ≥22.13）
│   └── src/                     # auth(JWT+RBAC)/settings/modules 样例 CRUD
└── scripts/
    ├── start/stop(.bat/.sh)     # 跨平台一键启停
    ├── init-app.ps1             # 拷模板→改名→生成 .env（一键新系统）
    ├── new-skin.ps1             # 给主色生成新皮肤
    ├── check-names.ps1          # 五处名称一致性
    ├── scan-secrets.ps1         # 隐私脱敏（发布红线）
    └── build-dist.ps1           # 出发布 zip（先扫密后打包）
```

## 内置 4 套皮肤

`deep-blue`（默认·深蓝玻璃）/ `light-pro`（浅色专业）/ `emerald-dark`（墨绿玻璃）/ `royal-purple`（紫金玻璃）——切换 = 改 `app.config.js` 的 `skin` 字段；设置页可选运行时预览下拉。新增皮肤跑 `scripts/new-skin.ps1`。

## 界面预览（手机 H5 · 375×812 真机）

手机端（≤768px）总览自动进 `/h5` 玻璃总览 + 底部 TabBar，业务页全部桌面/H5 双形态，H5 独立 6 套皮肤（设置页即时切换）。真机截图见 `assets/screenshots/`（markdown 预览可直接看图）：

| 皮肤 | 截图 | | 页面 | 截图 |
|---|---|---|---|---|
| 深蓝玻璃（默认·总览） | `assets/screenshots/h5-deep-blue.png` | | 数据列表 | `assets/screenshots/h5-crud.png` |
| 墨绿玻璃 | `assets/screenshots/h5-emerald.png` | | 列表·浅色皮肤 | `assets/screenshots/h5-crud-light.png` |
| 紫金 | `assets/screenshots/h5-royal.png` | | 趋势分析 | `assets/screenshots/h5-trend.png` |
| 冰蓝 | `assets/screenshots/h5-ice.png` | | 明细台账 | `assets/screenshots/h5-detail.png` |
| 暖阳浅 | `assets/screenshots/h5-light-warm.png` | | 系统设置（6 皮肤墙） | `assets/screenshots/h5-settings.png` |
| 清新浅 | `assets/screenshots/h5-light-fresh.png` | | | |

## 给不同角色的入口

- **人**：读本 README + `docs/设计规范.md`。
- **任何 AI 智能体**：读 `AI-GUIDE.md`（Claude Code 会自动读 CLAUDE.md、Codex 读 AGENTS.md，都指向它）。
- **新系统开发**：`init-app.ps1` → 按模板写业务页/加模块 → `check-names` / `scan-secrets` 复核 → `build-dist` 发布。

## License

MIT — 无作者、无内部信息，可自由使用于内部与公开项目。
