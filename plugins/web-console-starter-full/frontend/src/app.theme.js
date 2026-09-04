// ============================================================
// web-console-starter · ECharts 主题注册（皮肤联动版）
// ------------------------------------------------------------
// 图表颜色不写死，而是运行时从 <html> 的 CSS 变量读取
// (--chart-1..10 / --accent / --txt 等)—— 换肤后图表自动跟随。
// 组件里使用：mount 时先 registerAppTheme() 再 echarts.init(el,'app')。
// ============================================================
import * as echarts from 'echarts'

function cssVar(name, fallback) {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return v || fallback
  } catch (e) {
    return fallback
  }
}

function palette() {
  const cs = []
  for (let i = 1; i <= 10; i++) cs.push(cssVar(`--chart-${i}`, '#22d3ee'))
  return cs
}

function buildTheme() {
  const accent = cssVar('--accent', '#22d3ee')
  const txt = cssVar('--txt', '#cfe3ff')
  const txtDim = cssVar('--txt-dim', '#9fb6d6')
  const txtStrong = cssVar('--txt-strong', '#eaf2ff')
  const panelSolid = cssVar('--panel-solid', '#0e1d38')
  const panelBd = cssVar('--panel-bd', 'rgba(255,255,255,0.09)')
  const line = cssVar('--line', 'rgba(255,255,255,0.08)')
  const isLight = cssVar('--app-mode', 'dark') === 'light'

  return {
    color: palette(),
    backgroundColor: 'transparent',
    textStyle: { color: txt, fontFamily: 'inherit' },
    title: { textStyle: { color: txtStrong, fontSize: 14 }, subtextStyle: { color: txtDim } },
    legend: { textStyle: { color: txtDim }, inactiveColor: isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.25)' },
    tooltip: {
      backgroundColor: panelSolid,
      borderColor: panelBd,
      borderWidth: 1,
      textStyle: { color: txtStrong, fontSize: 12 },
      extraCssText: 'box-shadow:0 8px 28px rgba(0,0,0,0.18);border-radius:10px;',
      animation: true,
      animationDuration: 300,
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: line } },
      axisTick: { show: false },
      axisLabel: { color: txtDim },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: txtDim },
      splitLine: { lineStyle: { color: line } },
    },
    timeAxis: {
      axisLine: { lineStyle: { color: line } },
      axisLabel: { color: txtDim },
      splitLine: { show: false },
    },
    line: { symbol: 'circle', symbolSize: 6, smooth: true, showSymbol: true },
    bar: { itemStyle: { borderRadius: [4, 4, 0, 0] } },
    pie: { itemStyle: { borderColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(10,17,36,0.6)', borderWidth: 2 } },
    gauge: {
      axisLine: { lineStyle: { width: 10 } },
      axisLabel: { color: txtDim },
      axisTick: { show: false },
      splitLine: { show: false },
      detail: { color: txtStrong },
      title: { color: txtDim },
    },
  }
}

// 以当前皮肤（重新）注册默认主题 'app'
export function registerAppTheme() {
  echarts.registerTheme('app', buildTheme())
  return palette()
}

export { echarts }
