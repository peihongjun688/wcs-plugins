<template>
  <!-- ============================================================
       页面模板 E · 系统设置（桌面 / H5 v2.0 双形态）
       形态：桌面 = 桌面 4 套皮肤预览 + 账号/关于 descriptions
             H5    = H5 独立 6 套皮肤即时切换 + 账号/关于玻璃卡
       说明：H5 皮肤与桌面皮肤完全解耦（独立 localStorage + data-h5-skin）
       ============================================================ -->

  <!-- ▼▼▼ H5 视觉规范 v2.0 形态（≤768px）▼▼▼ -->
  <div v-if="isH5" class="h5-page h5-settings">
    <!-- 外观 · H5 皮肤 -->
    <div class="h5-glass h5-panel">
      <div class="h5-panel-hd">
        <span class="h5-card-bar"></span>
        <span class="h5-panel-title">外观 · 皮肤</span>
        <span class="h5-panel-sub">H5 独立 6 套</span>
      </div>
      <p class="h5-note">手机端皮肤与桌面完全独立，选择即生效并记忆。</p>
      <div class="h5-skin-grid">
        <button v-for="s in H5_SKIN_LIST" :key="s.key" class="h5-skin-card"
          :class="{ on: currentH5Skin === s.key }" @click="pickH5(s.key)">
          <span class="h5-skin-bar" :style="{ background: s.grad }"></span>
          <span class="h5-skin-name">{{ s.label }}</span>
          <span class="h5-skin-desc">{{ s.desc }}</span>
          <span v-if="currentH5Skin === s.key" class="h5-skin-ok"><SvgIcon name="check" size="xs" :accent="5" /></span>
        </button>
      </div>
    </div>

    <!-- 账号信息 -->
    <div class="h5-section-hd">账号</div>
    <ServerCard title="账号信息" :rows="accountRows" />

    <!-- 关于 -->
    <div class="h5-section-hd">关于</div>
    <ServerCard title="关于本模板" :rows="aboutRows" />

    <p class="h5-foot muted">修改密码 / 退出登录：右上角用户菜单</p>
    <div class="h5-spacer" />
  </div>

  <!-- ▼▼▼ 桌面形态（>768px，v1.1.0 结构保持不动）▼▼▼ -->
  <div v-else class="settings">
    <PanelCard title="外观 · 皮肤预览" icon="Brush">
      <p class="muted" style="margin: 0 0 12px;">
        换肤 = 切换 <code>themes/&lt;皮肤&gt;.css</code> 的 CSS 变量，组件与布局零改动。
        下方选择会保存并整页重载；也可直接在 app.config.js 改 <code>skin</code> 字段定稿。
      </p>
      <div class="skin-grid">
        <div v-for="(s, key) in SKINS" :key="key" class="skin-card"
          :class="{ active: current === key }" @click="pick(key)">
          <div class="skin-swatch" :style="swatchStyle(key)">
            <span>{{ key }}</span>
          </div>
          <div class="skin-meta">
            <div class="skin-name">{{ s }}</div>
            <div class="muted">{{ skinDesc(key) }}</div>
          </div>
          <el-icon v-if="current === key" class="skin-ok"><CircleCheckFilled /></el-icon>
        </div>
      </div>
    </PanelCard>

    <div class="row">
      <PanelCard title="账号信息" icon="User">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="登录名">{{ user?.username || 'admin' }}</el-descriptions-item>
          <el-descriptions-item label="显示名">{{ user?.name || '—' }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ roleLabel }}</el-descriptions-item>
        </el-descriptions>
        <div class="muted" style="margin-top: 10px;">修改密码 / 退出登录在右上角用户菜单。</div>
      </PanelCard>

      <PanelCard title="关于" icon="InfoFilled">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="模板">web-console-starter</el-descriptions-item>
          <el-descriptions-item label="版本">{{ VER }}</el-descriptions-item>
          <el-descriptions-item label="技术栈">Vue3 + Vite + Element Plus + ECharts + Express</el-descriptions-item>
          <el-descriptions-item label="许可">MIT</el-descriptions-item>
        </el-descriptions>
        <div class="muted" style="margin-top: 10px;">
          数据来源：当前为 mock 演示模式（src/mock.js）。接入真实后端后按 AI-GUIDE.md 关闭。
        </div>
      </PanelCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import PanelCard from '@/components/PanelCard.vue'
import ServerCard from '@/components/ServerCard.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import cfg from '@app'
import { auth, role } from '@/store'
import { SKINS, resolveSkin, setSkin } from '@/app.skin'
import { useH5 } from '@/useH5'

const { isH5 } = useH5()
const VER = 'v1.2.1'

/* ---- 桌面皮肤（4 套）---- */
const current = ref(resolveSkin())
const user = computed(() => auth.user)
const roleLabel = computed(() => {
  const map = { admin: '管理员（全权）', operator: '操作员（可写）', viewer: '观察员（只读）' }
  return map[role.value] || role.value
})

// 每套皮肤的主色预览（展示卡片配色用，实际皮肤色以 themes/*.css 为准）
const ACCENTS = {
  'deep-blue': 'linear-gradient(135deg, #22d3ee, #a78bfa)',
  'light-pro': 'linear-gradient(135deg, #ffffff, #dbe7f6)',
  'emerald-dark': 'linear-gradient(135deg, #34d399, #5eead4)',
  'royal-purple': 'linear-gradient(135deg, #a78bfa, #fbbf24)',
}
function swatchStyle(key) {
  const bg = ACCENTS[key] || ACCENTS['deep-blue']
  const darkTxt = ['deep-blue', 'emerald-dark'].includes(key) ? '#06121f' : (key === 'royal-purple' ? '#170d33' : '#1c2c4a')
  return { background: bg, color: key === 'light-pro' ? '#1c2c4a' : darkTxt }
}
function skinDesc(key) {
  return { 'deep-blue': '深蓝玻璃（默认）', 'light-pro': '浅色专业', 'emerald-dark': '墨绿玻璃', 'royal-purple': '紫金玻璃' }[key] || ''
}
function pick(key) {
  if (key === current.value) return
  current.value = key
  setSkin(key)
}

/* ---- H5 皮肤（6 套，与桌面完全独立）---- */
const H5_SKIN_LIST = [
  { key: 'deep-blue-glass', label: '深蓝玻璃', desc: '默认 · 沉稳蓝紫', grad: 'linear-gradient(90deg, #4F8AFF, #B968F0)' },
  { key: 'emerald-glass', label: '墨绿玻璃', desc: '翡翠 · 清新绿', grad: 'linear-gradient(90deg, #2BD89B, #FFC53D)' },
  { key: 'royal-purple', label: '紫金玻璃', desc: '皇室 · 紫金', grad: 'linear-gradient(90deg, #B968F0, #FF7A45)' },
  { key: 'ice-blue', label: '冰蓝玻璃', desc: '冰川 · 通透蓝', grad: 'linear-gradient(90deg, #5BB8FF, #2BD89B)' },
  { key: 'light-warm', label: '暖阳浅', desc: '暖橙 · 浅色', grad: 'linear-gradient(90deg, #FF8A45, #FFC53D)' },
  { key: 'light-fresh', label: '清新浅', desc: '薄荷 · 浅色', grad: 'linear-gradient(90deg, #2BD89B, #4F8AFF)' },
]
const h5StoreKey = (cfg.localKey || cfg.name || 'wcs') + '_h5_skin'
const currentH5Skin = ref(readH5Skin())
function readH5Skin() {
  try {
    const attr = document.documentElement.getAttribute('data-h5-skin')
    if (attr) return attr
    return localStorage.getItem(h5StoreKey) || 'deep-blue-glass'
  } catch (e) { return 'deep-blue-glass' }
}
function pickH5(key) {
  if (key === currentH5Skin.value) return
  currentH5Skin.value = key
  // main.js 暴露的即时切换（写 localStorage + 更新 <html data-h5-skin>，无需整页重载）
  if (window.__setH5Skin) window.__setH5Skin(key)
}

/* ---- 账号/关于（两形态共用）---- */
const accountRows = computed(() => [
  { key: '登录名', val: user.value?.username || 'admin' },
  { key: '显示名', val: user.value?.name || '—' },
  { key: '角色', val: roleLabel.value },
])
const aboutRows = [
  { key: '模板', val: 'web-console-starter' },
  { key: '版本', val: VER },
  { key: '技术栈', val: 'Vue3 + Vite + Element Plus + ECharts + Express' },
  { key: '许可', val: 'MIT' },
]
</script>

<style scoped>
.settings { display: flex; flex-direction: column; gap: 16px; }
.skin-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.skin-card {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--panel);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.skin-card:hover { border-color: var(--accent); }
.skin-card.active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 6px 18px color-mix(in srgb, var(--accent) 25%, transparent);
}
.skin-swatch {
  width: 92px; height: 56px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: flex-end; justify-content: center;
  font-size: 10px; font-weight: 700; padding-bottom: 4px;
  border: 1px solid var(--line);
}
.skin-meta { flex: 1; min-width: 0; }
.skin-name { font-size: 14px; font-weight: 600; color: var(--txt-strong); }
.skin-ok { color: var(--accent); font-size: 18px; flex-shrink: 0; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
code {
  background: var(--hover-bg); border-radius: 4px;
  padding: 1px 6px; font-size: 12px; color: var(--txt-strong);
}
@media (max-width: 1100px) { .skin-grid, .row { grid-template-columns: 1fr; } }

/* ============================================================
   H5 视觉规范 v2.0 形态（≤768px，useH5 控制渲染分支）
   ============================================================ */
.h5-page { display: flex; flex-direction: column; gap: 14px;
  /* H5 皮肤背景（随 data-h5-skin 切换，与桌面主题解耦） */
  background: var(--v2-bg-deep, linear-gradient(135deg, #0B1F3A 0%, #0A1124 100%));
  background-attachment: fixed;
}
.h5-glass {
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: var(--v2-text-1);
}
.h5-panel { padding: 14px 16px; }
.h5-panel-hd { display: flex; align-items: center; gap: 8px; }
.h5-card-bar { width: 3px; height: 14px; border-radius: 2px; background: var(--v2-primary, #4F8AFF); }
.h5-panel-title { font-size: 15px; font-weight: 700; color: var(--v2-text-1); }
.h5-panel-sub {
  margin-left: auto;
  font-size: 11px; color: var(--v2-accent-2, #B968F0);
  background: color-mix(in srgb, var(--v2-accent-2, #B968F0) 16%, transparent);
  padding: 2px 8px; border-radius: var(--v2-r-pill, 999px);
}
.h5-note { font-size: 11px; color: var(--v2-text-3); margin: 8px 0 12px; }

/* 皮肤卡 grid */
.h5-skin-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.h5-skin-card {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 10px 12px;
  background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 45%, transparent);
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  color: var(--v2-text-1);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.h5-skin-card:active { transform: scale(0.97); }
.h5-skin-card.on {
  border-color: var(--v2-primary, #4F8AFF);
  box-shadow: 0 0 0 1px var(--v2-primary, #4F8AFF), 0 6px 18px color-mix(in srgb, var(--v2-primary, #4F8AFF) 25%, transparent);
}
.h5-skin-bar { width: 100%; height: 10px; border-radius: var(--v2-r-pill, 999px); margin-bottom: 4px; }
.h5-skin-name { font-size: 13px; font-weight: 700; }
.h5-skin-desc { font-size: 10px; color: var(--v2-text-3); }
.h5-skin-ok { position: absolute; top: 8px; right: 8px; }

/* 区块标题 / 脚注 */
.h5-section-hd { font-size: 12px; font-weight: 600; color: var(--v2-text-2); padding-left: 4px; }
.h5-foot { font-size: 11px; text-align: center; margin: 2px 0 0; }
.h5-spacer { height: 8px; }
</style>
