<template>
  <div ref="el" :style="{ width: '100%', height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { echarts, registerAppTheme } from '@/app.theme'

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: String, default: '320px' },
})

const el = ref(null)
let chart = null
let ro = null

function render() {
  if (chart) chart.setOption(props.option, true)
}
function resize() {
  if (chart) chart.resize()
}

onMounted(() => {
  // 以当前皮肤注册/重注册主题后初始化（换肤后整页重载，主题自然最新）
  registerAppTheme()
  chart = echarts.init(el.value, 'app', { renderer: 'canvas' })
  render()
  if (window.ResizeObserver) {
    ro = new ResizeObserver(() => resize())
    ro.observe(el.value)
  } else {
    window.addEventListener('resize', resize)
  }
})

watch(() => props.option, render, { deep: true })

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  window.removeEventListener('resize', resize)
  if (chart) chart.dispose()
})
</script>
