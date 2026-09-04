<template>
  <div class="hr-card" :class="['grade-' + grade]">
    <svg class="hr-svg" :viewBox="'0 0 ' + size + ' ' + size" :width="size" :height="size">
      <!-- 背景圆 -->
      <circle :cx="size/2" :cy="size/2" :r="r" fill="none"
        stroke="var(--v2-glass-border, rgba(255,255,255,0.10))" :stroke-width="stroke" />
      <!-- 进度圆 -->
      <circle :cx="size/2" :cy="size/2" :r="r" fill="none"
        :stroke="progressColor" :stroke-width="stroke" stroke-linecap="round"
        :stroke-dasharray="circ" :stroke-dashoffset="dashOffset"
        :transform="'rotate(-90 ' + (size/2) + ' ' + (size/2) + ')'" />
    </svg>
    <div class="hr-text">
      <div class="hr-num">
        <span class="hr-big">{{ Math.round(value) }}</span>
        <span v-if="unit" class="hr-unit">{{ unit }}</span>
      </div>
      <div class="hr-label">{{ label }}</div>
    </div>
    <div v-if="status" class="hr-status" :class="['sg-' + grade]">{{ status }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true }, // 0-100
  label: { type: String, default: '健康度' },
  unit: { type: String, default: '分' },
  status: { type: String, default: '' }, // 右上角状态标签，如"一般故障"
  size: { type: Number, default: 110 },
  stroke: { type: Number, default: 8 },
})

const r = computed(() => (props.size - props.stroke) / 2)
const circ = computed(() => 2 * Math.PI * r.value)
const dashOffset = computed(() => circ.value * (1 - Math.max(0, Math.min(100, props.value)) / 100))

const grade = computed(() => {
  const v = props.value
  if (v >= 80) return 'good'
  if (v >= 60) return 'warn'
  return 'danger'
})
const progressColor = computed(() => {
  const map = {
    good: 'var(--v2-success, #2BD89B)',
    warn: 'var(--v2-warning, #FF7A45)',
    danger: 'var(--v2-danger, #FF5C5C)',
  }
  return map[grade.value]
})
</script>

<style scoped>
.hr-card {
  position: relative;
  display: flex; align-items: center; gap: 14px;
  padding: 16px;
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: var(--v2-text-1);
}

.hr-svg { flex-shrink: 0; }

.hr-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex:1; }
.hr-num { display: flex; align-items: baseline; gap: 4px; }
.hr-big { font-size: 36px; font-weight: 800; line-height: 1; color: var(--v2-text-1); }
.hr-unit { font-size: 13px; font-weight: 400; color: var(--v2-text-3); }
.hr-label { font-size: 12px; color: var(--v2-text-2); }

.hr-status {
  position: absolute; top: 12px; right: 12px;
  padding: 4px 10px;
  border-radius: var(--v2-r-pill, 999px);
  font-size: 11px; font-weight: 600;
  color: #fff;
}
.hr-status.sg-good { background: var(--v2-success, #2BD89B); color: rgba(0, 0, 0, 0.85); }
.hr-status.sg-warn { background: var(--v2-warning, #FF7A45); }
.hr-status.sg-danger { background: var(--v2-danger, #FF5C5C); }
</style>