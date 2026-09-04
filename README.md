<p align="center">
  <b>Web Console Starter · 多皮肤中后台脚手架</b><br/>
  <span>Vue3 + ElementPlus + ECharts + Express + SQLite · 桌面 4 皮肤 + 手机 H5 独立 6 皮肤</span>
</p>

<p align="center">
  <a href="https://github.com/"><img alt="platform" src="https://img.shields.io/badge/platform-Claude%20Code-6b7280"/></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-green"/></a>
  <a href="https://github.com/"><img alt="version" src="https://img.shields.io/badge/version-1.2.1-blue"/></a>
  <img alt="files" src="https://img.shields.io/badge/files-86-brightgreen"/>
</p>

# wcs-plugins · Claude Code 插件市场

> 一个能**直接跑、可直接改、可一键打包**的多皮肤中后台脚手架，作为 Claude Code 插件一键安装。

## ✨ 这个插件能做什么

一套把「Vue3 + ElementPlus + ECharts + Express + SQLite」拼好的**可运行中后台模板**：

- 🎨 **4 套桌面皮肤 + 6 套手机 H5 皮肤**（玻璃视觉 + 底部 TabBar + 设置页即时切换）
- 📱 **5 类示范页面全部"桌面/H5 双形态"**（≤768px 自动切 H5 布局）
- ⚙️ **Express + SQLite 后端底座**（Node ≥22.13 内置 node:sqlite，零原生依赖）
- 🔧 **工程脚本四件套**：脚手架 / 加皮肤 / 命名一致性 / 一键打包
- 📌 做**软件著作权演示系统**、批量产出多套业务系统的利器

### 手机 H5 界面预览（11 张真机截图）

| 深蓝玻璃（默认·总览） | 墨绿玻璃 | 紫金 | 冰蓝 |
|---|---|---|---|
| ![h5-deep-blue](plugins/web-console-starter-full/assets/screenshots/h5-deep-blue.png) | ![h5-emerald](plugins/web-console-starter-full/assets/screenshots/h5-emerald.png) | ![h5-royal](plugins/web-console-starter-full/assets/screenshots/h5-royal.png) | ![h5-ice](plugins/web-console-starter-full/assets/screenshots/h5-ice.png) |

| 暖阳浅 | 清新浅 | 数据列表 | 趋势分析 |
|---|---|---|---|
| ![h5-light-warm](plugins/web-console-starter-full/assets/screenshots/h5-light-warm.png) | ![h5-light-fresh](plugins/web-console-starter-full/assets/screenshots/h5-light-fresh.png) | ![h5-crud](plugins/web-console-starter-full/assets/screenshots/h5-crud.png) | ![h5-trend](plugins/web-console-starter-full/assets/screenshots/h5-trend.png) |

## 安装（Claude Code 用户）

```bash
# 一行添加市场 + 安装插件
/plugin marketplace add <owner>/wcs-plugins
/plugin install web-console-starter-full@wcs-plugins
/plugin reload-plugins
```

装好后直接描述任务（"用 wcs 模板建一套多皮肤管理系统"）即可自动触发；或在 Claude Code 里显式 `/plugin` 查看。

## 使用示例

```
@web-console-starter-full 用 wcs 模板搭一套订单管理系统
@web-console-starter-full 给现有系统加一套暖阳浅皮肤
```

## 目录结构

```
wcs-plugins/
├── .claude-plugin/
│   └── marketplace.json            # 市场目录
└── plugins/
    └── web-console-starter-full/  # 插件本体
        ├── .claude-plugin/plugin.json   # manifest
        ├── SKILL.md / README.md / AI-GUIDE.md / CHANGELOG.md
        ├── assets/screenshots/    # 11 张 H5 真机截图
        ├── docs/  scripts/  frontend/  backend/  app.config.js
        └── ...
```

## 做软件著作权演示系统

脚手架 → 真实运行 → 5 类页面全通 → 一键打包。技能内置命名一致性校验（五处名称同步）、种子数据真实可编辑、报表由真实数据聚合（禁止静态桩），符合软著材料要求。

## License

MIT — 自由使用、修改、再分发。