// ============================================================
// web-console-starter · 皮肤解析（供 main.js / 设置页使用）
// ------------------------------------------------------------
// 皮肤名唯一来源：app.config.js 的 skin 字段。
// 若开启 cfg.skinPreview，用户可在运行时用 localStorage 覆盖
// （记录在 ${localKey}_skin），用于"定稿前肉眼挑皮肤"。
// 新增皮肤：跑 scripts/new-skin.ps1 生成 themes/<新名>.css，
// 并在本文件 SKINS 中登记（否则设置页下拉不会出现）。
// ============================================================
import cfg from '@app'

export const SKINS = {
  'deep-blue': '深蓝玻璃（默认）',
  'light-pro': '浅色专业',
  'emerald-dark': '墨绿玻璃',
  'royal-purple': '紫金玻璃',
}

const KEY = (cfg.localKey || cfg.name || 'wcs') + '_skin'

// 当前生效皮肤：localStorage 覆盖 > app.config.skin > deep-blue
export function resolveSkin() {
  const def = SKINS[cfg.skin] ? cfg.skin : 'deep-blue'
  try {
    const saved = localStorage.getItem(KEY)
    if (saved && SKINS[saved]) return saved
  } catch (e) { /* ignore */ }
  return def
}

// 运行时切换（设置页/顶栏预览用）：写入后整页重载以统一应用
export function setSkin(name) {
  if (!SKINS[name]) return
  try { localStorage.setItem(KEY, name) } catch (e) { /* ignore */ }
  location.reload()
}
