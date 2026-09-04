<template>
  <div class="bkp">
    <div class="bkp-title">{{ title }}</div>
    <div class="bkp-val">
      <span class="bkp-num">{{ display }}</span>
      <span v-if="unit" class="bkp-unit">{{ unit }}</span>
    </div>
    <div v-if="sub" class="bkp-sub">{{ sub }}</div>
    <div v-if="showBar" class="bkp-bar">
      <div class="bkp-bar-fill" :class="['g-' + grade]" :style="{ width: barWidth + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  value: { type: [Number, String], required: true },
  unit: { type: String, default: '' },
  sub: { type: String, default: '' }, // 副值，如"6.83 / 31.91 GB"
  max: { type: Number, default: 100 }, // 进度条满值
  showBar: { type: Boolean, default: true },
})

const display = computed(() => {
  if (typeof props.value === 'number') {
    if (props.value % 1 === 0) return props.value
    return Number(props.value.toFixed(2))
  }
  return props.value
})
const pct = computed(() => Math.max(0, Math.min(100, (Number(props.value) / props.max) * 100)))
const barWidth = computed(() => pct.value)
const grade = computed(() => {
  const v = pct.value
  if (v >= 80) return 'good'
  if (v >= 50) return 'warn'
  return 'danger'
})
</script>

<style scoped>
.bkp {
  padding: 14px 16px;
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: var(--v2-text-1);
  display: flex; flex-direction: column; gap: 4px;
}
.bkp-title { font-size: 11px; color: var(--v2-text-3); }
.bkp-val { display: flex; align-items: baseline; gap: 4px; }
.bkp-num { font-size: 22px; font-weight: 700; line-height: 1.1; color: var(--v2-text-1); }
.bkp-unit { font-size: 12px; font-weight: 400; color: var(--v2-text-3); }
.bkp-sub { font-size: 11px; color: var(--v2-text-3); }

.bkp-bar {
  margin-top: 6px;
  height: 2px;
  background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 80%, transparent);
  border-radius: 2px;
  overflow: hidden;
}
.bkp-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease;
}
.bkp-bar-fill.g-good { background: var(--v2-success, #2BD89B); }
.bkp-bar-fill.g-warn { background: var(--v2-warning, #FF7A45); }
.bkp-bar-fill.g-danger { background: var(--v2-danger, #FF5C5C); }
</style>