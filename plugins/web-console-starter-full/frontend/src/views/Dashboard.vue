<template>
  <!-- ============================================================
       页面模板 A · 总览 Dashboard
       形态：状态横幅 → KPI 环形格 → 图表栅格(双线/占比) → 列表
       数据：useMock（src/mock.js）演示；接真实后端见 AI-GUIDE.md
       ============================================================ -->
  <div v-if="!d" class="page-empty">
    <el-empty description="暂无数据">
      <el-button type="primary" :loading="loading" @click="load">加载演示数据</el-button>
    </el-empty>
  </div>

  <div v-else class="dash">
    <!-- 状态横幅：总分 + 计数徽章（参考源系统 grade banner 模式） -->
    <div class="grade" :style="{ borderColor: gradeColor }">
      <div class="grade-score" :style="{ color: gradeColor }">92.4</div>
      <div class="grade-main">
        <div class="grade-text" :style="{ color: gradeColor }">综合健康度 · 良好</div>
        <div class="grade-sub">
          严重 <b class="c-al">{{ alertCount('ALERT') }}</b>
          · 警告 <b class="c-wn">{{ alertCount('WARN') }}</b>
          · 提示 <b>{{ alertCount('INFO') }}</b>
        </div>
      </div>
      <div class="grade-note muted">数据为模板演示（mock）；刷新周期 60s</div>
    </div>

    <!-- KPI 环形格 -->
    <div class="kpi-grid">
      <div v-for="k in d.kpis" :key="k.key" class="kpi-cell">
        <PanelCard :body-padding="'14px'">
          <KpiRing :label="k.label" :value="k.value" :unit="k.unit" :ring="k.ring"
            :icon="k.icon" :color="ringColor(k.ring)" :sub="k.sub" />
        </PanelCard>
      </div>
    </div>

    <!-- 图表行：双线趋势 + 类型占比 -->
    <div class="row">
      <PanelCard title="近 7 日销售趋势（演示）" icon="TrendCharts" class="c2">
        <BaseChart :option="trendOpt" height="260px" />
      </PanelCard>
      <PanelCard title="业务类型占比（演示）" icon="PieChart" class="c2">
        <BaseChart :option="pieOpt" height="260px" />
      </PanelCard>
    </div>

    <!-- 列表行：事项提醒 + 服务状态 -->
    <div class="row">
      <PanelCard title="事项提醒（TOP 5）" icon="Warning" class="c1">
        <div class="notice-list">
          <div v-for="(n, i) in d.notices" :key="i" class="notice-row" :class="lv(n.level)">
            <el-tag size="small" :type="tagType(n.level)" effect="dark">{{ n.code }}</el-tag>
            <span class="nr-title">{{ n.title }}</span>
          </div>
          <div v-if="!d.notices?.length" class="muted">暂无事项 🎉</div>
        </div>
      </PanelCard>
      <PanelCard title="服务状态" icon="SetUp" class="c1">
        <div class="svc-list">
          <div v-for="s in d.services" :key="s.name" class="svc" :class="{ down: !s.ok }">
            <span class="dot" :style="{ background: s.ok ? '#34d399' : '#f87171' }"></span>
            <span class="svc-name">{{ s.name }}</span>
            <span class="svc-st" :style="{ color: s.ok ? '#34d399' : '#f87171' }">{{ s.st }}</span>
          </div>
          <div v-if="!d.services?.length" class="muted">无服务数据</div>
        </div>
      </PanelCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PanelCard from '@/components/PanelCard.vue'
import KpiRing from '@/components/KpiRing.vue'
import BaseChart from '@/components/BaseChart.vue'
import { USE_MOCK, mockDashboard } from '@/mock'
// 真实后端接入时：import { dashApi } from '@/api'，并把 load() 换成 API 调用
import { ElMessage } from 'element-plus'

const d = ref(null)
const loading = ref(false)

const gradeColor = '#34d399'
function ringColor(r) { return r >= 75 ? '#f87171' : r >= 50 ? '#fbbf24' : '' } // '' → 主题 --accent
function alertCount(lv) { return (d.value?.notices || []).filter((n) => n.level === lv).length }
function lv(x) { return x === 'ALERT' ? 'al' : x === 'WARN' ? 'wn' : '' }
function tagType(x) { return x === 'ALERT' ? 'danger' : x === 'WARN' ? 'warning' : 'info' }

/* ---- 图表：颜色尽量不写死，走主题色盘（series 不设 color 即自动取 palette） ---- */
const trendOpt = computed(() => {
  const t = d.value.trend || {}
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['销售额(万)', '订单量(单)'] },
    grid: { left: 48, right: 18, top: 40, bottom: 28 },
    xAxis: { type: 'category', data: t.days || [], boundaryGap: false },
    yAxis: [{ type: 'value', name: '万' }, { type: 'value', name: '单', splitLine: { show: false } }],
    series: [
      { name: '销售额(万)', type: 'line', smooth: true, showSymbol: false, data: t.sales || [],
        yAxisIndex: 0, lineStyle: { width: 2.5 }, areaStyle: { opacity: 0.16 } },
      { name: '订单量(单)', type: 'line', smooth: true, showSymbol: false, data: t.orders || [],
        yAxisIndex: 1, lineStyle: { width: 2, type: 'dashed' } },
    ],
  }
})

const pieOpt = computed(() => {
  const cs = d.value.category || []
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
    legend: { orient: 'vertical', right: 8, top: 'center', itemGap: 12 },
    series: [{
      name: '占比', type: 'pie', radius: ['46%', '68%'],
      center: ['38%', '50%'], avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderWidth: 2 },
      label: { show: false }, emphasis: { label: { show: true, fontWeight: 700 } },
      data: cs.map((c) => ({ name: c.name, value: c.value })),
    }],
  }
})

async function load() {
  loading.value = true
  try {
    if (USE_MOCK) {
      d.value = mockDashboard()
    } else {
      // 真实后端示例（替换为你的总览接口）：
      // const r = await dashApi.overview()
      // if (!r) return
      // d.value = r
    }
  } catch (e) {
    ElMessage.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

let timer = null
onMounted(() => { load(); timer = setInterval(load, 60000) })
onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<style scoped>
.dash { display: flex; flex-direction: column; gap: 16px; }
.page-empty { height: 70vh; display: flex; align-items: center; justify-content: center; }

/* 状态横幅 */
.grade {
  display: flex; align-items: center; gap: 20px;
  padding: 14px 22px; border-radius: 14px;
  border: 1px solid;
  background: var(--panel);
  backdrop-filter: blur(6px);
}
.grade-score { font-size: 38px; font-weight: 800; line-height: 1; }
.grade-main { display: flex; flex-direction: column; }
.grade-text { font-size: 22px; font-weight: 700; }
.grade-sub { font-size: 13px; color: var(--txt-dim); margin-top: 4px; }
.grade-sub .c-al { color: #f87171; }
.grade-sub .c-wn { color: #fbbf24; }
.grade-note { margin-left: auto; }

/* KPI */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.kpi-cell { min-width: 0; }

/* 图表/列表栅格 */
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.c1, .c2 { min-width: 0; }

/* 事项 */
.notice-list { display: flex; flex-direction: column; gap: 8px; }
.notice-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 8px;
  background: var(--panel);
  border-left: 3px solid transparent;
}
.notice-row.al { border-left-color: #f87171; }
.notice-row.wn { border-left-color: #fbbf24; }
.nr-title { flex: 1; font-size: 13px; color: var(--txt-strong); }

/* 服务 */
.svc-list { display: flex; flex-direction: column; gap: 10px; }
.svc { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.svc .dot { width: 8px; height: 8px; border-radius: 50%; }
.svc-name { flex: 1; color: var(--txt-strong); }

@media (max-width: 1100px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .row { grid-template-columns: 1fr; }
}

/* H5 移动端（≤768px）：状态横幅换行、KPI 单列大卡、正文收紧 */
@media (max-width: 768px) {
  .grade { flex-wrap: wrap; gap: 10px; padding: 12px 14px; }
  .grade-score { font-size: 30px; }
  .grade-text { font-size: 18px; }
  .grade-note { margin-left: 0; width: 100%; }
  .kpi-grid { grid-template-columns: 1fr; gap: 12px; }
  .dash { gap: 12px; }
}
</style>
