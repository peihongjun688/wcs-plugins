// ============================================================
// web-console-starter · 应用入口（通用版，无业务耦合）
// ------------------------------------------------------------
// 启动顺序：
//   1. 解析皮肤（app.config.skin，可被 localStorage 覆盖预览）
//   2. 给 <html> 挂 data-skin，懒加载该皮肤 CSS
//   3. 依据皮肤 --app-mode 决定是否启用 Element Plus dark
//   4. 注册 EP 图标/组件 → 挂载 → 构建守卫（旧包自动刷新）
// ============================================================
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import cfg from '@app'
import { resolveSkin } from './app.skin'
import './style.base.css'

// 皮肤 CSS 采用 import.meta.glob 懒加载（新增皮肤无需改 main）
const themeModules = import.meta.glob('./themes/*.css')

// H5 视觉规范 v2.0：H5 独立皮肤解析（与桌面完全解耦，单独存 localStorage）
const H5_SKINS = ['deep-blue-glass', 'emerald-glass', 'royal-purple', 'ice-blue', 'light-warm', 'light-fresh']
function resolveH5Skin() {
  const def = 'deep-blue-glass'
  try {
    const saved = localStorage.getItem((cfg.localKey || cfg.name || 'wcs') + '_h5_skin')
    if (saved && H5_SKINS.includes(saved)) return saved
  } catch (e) { /* ignore */ }
  return def
}
// 暴露到 window 便于 H5 切换按钮使用（设置页/TabBar 可调用）
window.__setH5Skin = function(name) {
  if (!H5_SKINS.includes(name)) return
  try { localStorage.setItem((cfg.localKey || cfg.name || 'wcs') + '_h5_skin', name) } catch (e) { /* ignore */ }
  document.documentElement.setAttribute('data-h5-skin', name)
}

const BUILD = typeof __APP_BUILD__ !== 'undefined' ? __APP_BUILD__ : null
const RELOAD_KEY = (cfg.localKey || cfg.name || 'wcs') + '_build_reloaded'

// 构建守卫：后端 public 下 buildinfo.json 的 build 时间戳与本包不一致
// （说明有新版本已部署、当前是缓存旧包）→ 强制刷新一次，避免"没数据"假象。
let guardActive = false
async function guardStaleBuild() {
  if (!BUILD || guardActive) return
  try {
    const r = await fetch('/buildinfo.json', { cache: 'no-store' })
    if (!r.ok) return
    const info = await r.json()
    if (info.build && info.build !== BUILD && !sessionStorage.getItem(RELOAD_KEY)) {
      sessionStorage.setItem(RELOAD_KEY, '1')
      guardActive = true
      location.reload(true)
    }
  } catch (e) { /* ignore，下轮重试 */ }
}

async function boot() {
  // 1~2. 皮肤
  const skin = resolveSkin()
  document.documentElement.setAttribute('data-skin', skin)
  try {
    const loader = themeModules[`./themes/${skin}.css`]
    if (loader) await loader()
    else await themeModules['./themes/deep-blue.css']()
  } catch (e) {
    console.warn('[wcs] 皮肤 CSS 加载失败，回退 deep-blue：', e)
    try { await themeModules['./themes/deep-blue.css']() } catch (e2) { /* ignore */ }
  }

  // H5 视觉规范 v2.0：H5 独立皮肤（与桌面完全解耦）
  try {
    await themeModules['./themes/h5-skins.css']()
    const h5Skin = resolveH5Skin()
    document.documentElement.setAttribute('data-h5-skin', h5Skin)
  } catch (e) {
    console.warn('[wcs] H5 皮肤 CSS 加载失败：', e)
  }

  // 3. Element Plus dark 跟随皮肤
  const mode = getComputedStyle(document.documentElement).getPropertyValue('--app-mode').trim() || 'dark'
  document.documentElement.classList.toggle('dark', mode !== 'light')

  // 运行时兜底标题（init-app 已写死的 title 优先；此处防止 config 变更后不同步）
  if (cfg.title) document.title = cfg.title

  const app = createApp(App)
  for (const [key, comp] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, comp)
  }
  app.use(ElementPlus)
  app.use(router)
  app.mount('#app')

  // 4. 构建守卫：挂载后先查一次，再 30s 轮询（长驻标签页也能感知新部署）
  guardStaleBuild()
  setInterval(guardStaleBuild, 30000)
}

boot()
