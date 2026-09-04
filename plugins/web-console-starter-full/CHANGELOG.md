# Changelog

Template-own version history. When a new system built from this template produces a better component or workflow, back-port it here and bump the version (the template is a living asset, not a one-off).

## [1.2.1] - 2026-09-04

Screenshot showcase package. H5 v2.0 visuals were approved by the author; 11 real-device shots (6 skins + 5 pages) are now shipped inside the package so installers can preview before/without running.

### Package
- New `assets/screenshots/` with 11 real-device H5 screenshots (375×812): `h5-{deep-blue,emerald,royal,ice,light-warm,light-fresh}.png` (skin overviews) + `h5-{crud,crud-light,trend,detail,settings}.png` (page templates).
- README adds an "界面预览（手机 H5）" table referencing the shots by relative path (visible in any markdown renderer); SKILL.md directory tree updated.
- Version bumped to 1.2.1 (root/backend/frontend package.json + SKILL.md frontmatter + Settings "About" shows v1.2.1). No UI/logic change vs 1.2.0.

## [1.2.0] - 2026-09-03

H5 visual rebirth v2.0 — every H5 page now matches the "external-page standard" (EPDM-style glassmorphism, colored inline SVG icons, bottom TabBar, 6 switchable skins). Desktop UI untouched.

### Frontend
- New H5 design contract `docs/H5视觉规范v2.0.md`: token palette for 6 H5 skins, type/space/radius/shadow/glass specs, TabBar & drawer rules, 30+ icon list, component specs, visual acceptance checklist.
- 6 independent H5 skins in `themes/h5-skins.css` (deep-blue-glass default / emerald-glass / royal-purple / ice-blue / light-warm / light-fresh), all `--v2-*` tokens under `html[data-h5-skin]` — fully decoupled from desktop skins (`data-skin`).
- H5 skin runtime: `main.js` resolves + applies `data-h5-skin` from its own localStorage key; `window.__setH5Skin(name)` switches instantly (no reload).
- Inline colored SVG icon system: `icons/index.js` (21 icons incl. monitor/trend/alert/sql/archive/network/disk/log/shield/wrench/gear/grid/search/plus/edit/trash/…), rendered by `SvgIcon.vue` with `--v2-accent-1..5` business-color mapping.
- New H5 components: `MobileTabBar` (fixed bottom, 5 tabs + raised center "全部", red-dot badge), `ModuleGrid` (colored 9-grid entrance), `HealthRing` (SVG progress ring), `BigKpi`, `ServerCard` (glass detail card).
- H5 home `views/HDashboard.vue` at route `/h5` (EPDM-style demo: pill header + brand card + 11-module grid + server card); `Layout.vue` auto-swaps `/dashboard` ↔ `/h5` on viewport crossing ≤768px.
- Page templates become desktop/H5 dual-form (shared data & logic, separate H5 render branch via new `useH5()` hook, no desktop regression):
  - CrudPage H5: glass search card + filter chips + BigKpi stats (aggregated) + record card list + FAB create + mini pager.
  - TrendPage H5: segmented range pills (7/30/90) + full-width trend card + A/B/C sum BigKpi + summary bar card.
  - DetailPage H5: brand header + HealthRing (completion %) + key BigKpi + 8-metric glass grid + trend chart + TOP5 detail rows.
  - SettingsPage H5: 6-skin instant switcher (own grid) + account/about glass cards (ServerCard).
- Version bumped to 1.2.0 in root/backend/frontend package.json (settings "About" renders the real version).

## [1.1.0] - 2026-09-03

Mobile H5 adaptation (≤768px), distilled per the web-version spec.

### Frontend
- Layout: `matchMedia('(max-width: 768px)')` drives `isMobile` — sidebar hidden, hamburger (`Expand`) opens a left `el-drawer` (240px, ltr) reusing the same menu data; auto-close on navigate & on widening back to desktop; skin preview hidden on small screens.
- `style.base.css` H5 section: dialogs/message-boxes capped at `calc(100vw - 24px)`; inputs ≥16px (prevents iOS zoom); table scroll-area keeps touch scrolling; page text 13px.
- Views: login card auto-shrinks (`max-width: calc(100vw - 32px)`); dashboard KPI single column + grade banner wraps; CRUD toolbar controls become full-width; panel headers wrap on narrow screens.
- TrendPage: line chart height 320 → 280px (fits the 220–280px H5 chart band; consistent with the summary chart on all breakpoints).
- New doc `docs/H5移动端开发约束与指导.md` — breakpoint system (768/1100), touch/typography rules, per-template mobile forms, chart constraints, H5 acceptance checklist; wired into SKILL.md / AI-GUIDE.md.

### Docs
- SKILL.md / AI-GUIDE.md / README / docs updated with mobile-H5 usage and acceptance gate.

## [1.0.0] - 2026-09-02

Initial public template release, distilled from multiple production consoles.

### Frontend
- Vue3 + Vite + ElementPlus + ECharts; 4 prebuilt skins driven by one CSS-variable token contract (`deep-blue` default / `light-pro` / `emerald-dark` / `royal-purple`); lazy skin loading via `import.meta.glob`; Element Plus dark class toggled from `--app-mode`; ECharts `app` theme re-registered from CSS vars on each skin.
- Generic shell: `app.skin.js` (skin resolution + runtime preview), `app.theme.js`, token-driven `style.base.css` (no hardcoded whites), single-point config `app.config.js`.
- 5 page templates with a `USE_MOCK` switch (login / dashboard / list-CRUD / trend / detail) + settings page, demo router with login guard.
- Components: `BaseChart` (unified ECharts lifecycle), `KpiRing`, `PanelCard`.
- Stale-bundle build guard via `buildinfo.json` timestamp.

### Backend
- Express + `node:sqlite` (`DatabaseSync`, Node >= 22.13) — no ORM, single-file SQLite with WAL.
- JWT auth + RBAC roles `admin / operator / viewer` with a `canAction(action)` permission matrix; unified `{code,msg,data}` responses; 401 handled by the frontend interceptor.
- Sample backend module (`modules/items` full CRUD) as the "how to add a business module" textbook; settings whitelist; seed accounts + ≥5 seed rows on first boot.
- SPA served from `backend/public` with non-API fallback to `index.html`.

### Scripts & gates
- Cross-platform one-key start/stop (`start.bat/stop.bat`, `start.sh/stop.sh`).
- `init-app.ps1` one-shot initializer: copy template -> write app.config -> sync package.json/index.html names -> generate `.env` (random JWT, free port) -> optional install/build.
- `new-skin.ps1`: generate a full coordinated skin from one accent hex.
- `check-names.ps1`: 5-point name-consistency gate.
- `scan-secrets.ps1`: privacy keyword gate (0 hits required) — packaging red line.
- `build-dist.ps1`: scan -> rebuild SPA -> stage clean copy (keeps `backend/public` so the zip runs out of the box; strips node_modules/.git/data/logs/db/.env/vite temp) -> zip.

### Docs
- README / AI-GUIDE (agent-facing) / CLAUDE.md / AGENTS.md (auto-load entry points) / docs (design spec, skin guide, compatibility & distribution), MIT license (no author info).
