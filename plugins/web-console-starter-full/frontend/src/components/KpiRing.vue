<template>
  <div class="kpi">
    <div class="kpi-ring" :style="{ background: ringBg }">
      <div class="kpi-ic"><el-icon :size="22"><component :is="iconComp" /></el-icon></div>
      <div class="kpi-pct">{{ Math.round(animPct) }}%</div>
    </div>
    <div class="kpi-meta">
      <div class="kpi-label">{{ label }}</div>
      <div class="kpi-value">{{ displayValue }}<span class="kpi-unit">{{ unit }}</span></div>
      <div class="kpi-sub" v-if="sub">{{ sub }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps({
  label: String,
  value: { type: [Number, String], default: 0 },
  unit: { type: String, default: '' },
  max: { type: Number, default: 100 },
  ring: { type: Number, default: 0 },
  icon: { type: String, default: 'DataLine' },
  color: { type: String, default: '' }, // 缺省读 --accent
  sub: String,
})

const iconComp = computed(() => Icons[props.icon] || Icons.DataLine)
const color = computed(() => props.color || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#22d3ee')
const animPct = ref(0)
const displayValue = ref(0)
const ringBg = computed(
  () => `conic-gradient(${color.value} ${animPct.value}%, var(--track) 0)`
)

let raf = null
function animate() {
  const targetPct = Math.max(0, Math.min(100, props.ring || 0))
  const targetVal = Number(props.value) || 0
  const start = performance.now()
  const dur = 900
  cancelAnimationFrame(raf)
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur)
    const ease = 1 - Math.pow(1 - t, 3)
    animPct.value = Math.round(targetPct * ease * 10) / 10
    displayValue.value = Math.round(targetVal * ease * 10) / 10
    if (t < 1) raf = requestAnimationFrame(step)
    else {
      animPct.value = targetPct
      displayValue.value = targetVal
    }
  }
  raf = requestAnimationFrame(step)
}

onMounted(animate)
watch(() => [props.value, props.ring], animate)
</script>

<style scoped>
.kpi { display: flex; align-items: center; gap: 14px; }
.kpi-ring {
  position: relative;
  width: 72px; height: 72px;
  border-radius: 50%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  box-shadow: inset 0 0 0 6px var(--track);
  transition: background 0.2s linear;
  flex-shrink: 0;
}
.kpi-ic { color: var(--txt-strong); }
.kpi-pct { font-size: 11px; color: var(--txt-dim); margin-top: 2px; }
.kpi-meta { flex: 1; min-width: 0; }
.kpi-label { font-size: 12px; color: var(--txt-dim); }
.kpi-value { font-size: 22px; font-weight: 700; color: var(--txt-strong); line-height: 1.15; }
.kpi-unit { font-size: 12px; color: var(--txt-dim); margin-left: 3px; font-weight: 400; }
.kpi-sub {
  font-size: 11px; color: var(--txt-dim); margin-top: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
</style>
