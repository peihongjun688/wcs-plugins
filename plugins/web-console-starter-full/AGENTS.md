# AGENTS.md

This directory is a reusable **Web console engineering template** (web-console-starter, Vue3 + ElementPlus + ECharts frontend, Express + node:sqlite backend).

Before touching any code, **read `AI-GUIDE.md` at the repo root first**. It contains: onboarding steps, directory responsibilities, the 5 page templates, how to add a backend module, the mandatory pre-delivery checklist (5-point name sync / privacy scan), a pitfalls table, and forbidden actions.

Quick pointers:
- Humans: `README.md` · Design spec: `docs/设计规范.md` · Skins: `docs/换肤指南.md` · Distribution: `docs/兼容与分发.md`
- One-shot new system: `scripts/init-app.ps1`, then always run `scripts/check-names.ps1` and `scripts/scan-secrets.ps1`.

Rules: identity lives only in `app.config.js`; colors only via CSS variables; stats must be aggregated from real data; keep new `.ps1` ASCII-only.
