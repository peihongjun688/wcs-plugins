<template>
  <div class="module-grid" :style="{ '--cols': cols }">
    <button
      v-for="(m, i) in modules"
      :key="i"
      class="mg-cell"
      :class="{ disabled: !m.to }"
      :aria-label="m.title"
      @click="onTap(m)"
    >
      <span class="mg-ico-wrap">
        <span class="mg-ico-bg" :class="['accent-' + (m.accent || 1)]">
          <SvgIcon :name="m.icon" size="lg" :accent="m.accent" />
        </span>
        <span v-if="m.badge" class="mg-badge">{{ m.badge }}</span>
      </span>
      <span class="mg-title">{{ m.title }}</span>
      <span v-if="m.desc" class="mg-desc">{{ m.desc }}</span>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'

const props = defineProps({
  modules: { type: Array, required: true }, // [{title,desc?,icon,accent?,badge?,to?}]
  cols: { type: Number, default: 3 },
})

const router = useRouter()
function onTap(m) {
  if (!m.to) return
  if (m.to.startsWith('http')) return window.open(m.to, '_blank')
  router.push(m.to)
}
</script>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), 1fr);
  gap: var(--v2-sp-3, 12px);
}

.mg-cell {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px;
  padding: var(--v2-sp-4, 16px) var(--v2-sp-3, 12px);
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: var(--v2-text-1, rgba(234, 242, 255, 0.92));
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  position: relative;
}
.mg-cell:active:not(.disabled) { transform: scale(0.96); }
.mg-cell.disabled { opacity: 0.55; cursor: not-allowed; }

.mg-ico-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.mg-ico-bg {
  width: 48px; height: 48px;
  border-radius: var(--v2-r-md, 12px);
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, currentColor 18%, transparent);
}
.mg-ico-bg.accent-1 { color: var(--v2-accent-1, #2BD4D4); background: color-mix(in srgb, var(--v2-accent-1, #2BD4D4) 18%, transparent); }
.mg-ico-bg.accent-2 { color: var(--v2-accent-2, #B968F0); background: color-mix(in srgb, var(--v2-accent-2, #B968F0) 18%, transparent); }
.mg-ico-bg.accent-3 { color: var(--v2-accent-3, #FF5C5C); background: color-mix(in srgb, var(--v2-accent-3, #FF5C5C) 18%, transparent); }
.mg-ico-bg.accent-4 { color: var(--v2-accent-4, #FF7A45); background: color-mix(in srgb, var(--v2-accent-4, #FF7A45) 18%, transparent); }
.mg-ico-bg.accent-5 { color: var(--v2-accent-5, #2BD89B); background: color-mix(in srgb, var(--v2-accent-5, #2BD89B) 18%, transparent); }

.mg-badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 16px; height: 16px;
  padding: 0 4px;
  border-radius: var(--v2-r-pill, 999px);
  background: var(--v2-danger, #FF5C5C);
  color: #fff;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 2px var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
}

.mg-title {
  font-size: 13px; font-weight: 600; color: var(--v2-text-1);
  text-align: center;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 100%;
}
.mg-desc {
  font-size: 10px; color: var(--v2-text-3);
  text-align: center;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 100%;
}
</style>