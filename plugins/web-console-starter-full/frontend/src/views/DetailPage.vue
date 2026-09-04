<template>
  <!-- ============================================================
       页面模板 D · 明细台账 / 详情（桌面 / H5 v2.0 双形态）
       形态：桌面 = 标题 + 指标网格(8) + 大图 + 明细表
             H5    = 品牌头卡 + 完成率圆环 + 8 指标格 + 走势 + 明细 top5
       数据：useMock（src/mock.js）演示；接真实 API 见 AI-GUIDE.md
       ============================================================ -->

  <!-- ▼▼▼ H5 视觉规范 v2.0 形态（≤768px）▼▼▼ -->
  <div v-if="isH5" class="h5-page h5-detail">
    <!-- 品牌头卡：标题 + 更新时间 + 刷新 -->
    <div class="h5-glass h5-head">
      <span class="h5-head-logo"><SvgIcon name="archive" size="md" :accent="1" /></span>
      <div class="h5-head-main">
        <div class="h5-head-title">{{ d?.title || '示例业务汇总' }}</div>
        <div class="h5-head-sub">更新于 {{ d?.time || '—' }} · 点击刷新可重载数据</div>
      </div>
      <button class="h5-head-btn" aria-label="刷新" @click="load"><SvgIcon name="refresh" size="sm" /></button>
    </div>

    <!-- 完成率圆环 + 关键 BigKpi -->
    <div class="h5-top-grid">
      <div class="h5-glass h5-ring-card">
        <HealthRing :value="ringVal" label="任务完成率" unit="%" :status="ringVal >= 80 ? '良好' : ringVal >= 60 ? '正常' : '关注'" />
      </div>
      <div class="h5-top-kpis">
        <BigKpi title="单据总数" :value="svNum(0)" unit="张" :show-bar="false" />
        <BigKpi title="涉及金额" :value="svNum(4, 1)" unit="万元" :show-bar="false" />
        <BigKpi title="平均周期" :value="svNum(2, 1)" unit="天" :show-bar="false" />
      </div>
    </div>

    <!-- 8 项全指标玻璃格（真实数据） -->
    <div class="h5-metrics">
      <div v-for="(s, i) in d?.summary || []" :key="i" class="h5-glass h5-metric">
        <div class="h5-metric-v" :class="{ hot: i === 3 || i === 7 }">{{ s.v }}</div>
        <div class="h5-metric-k">{{ s.k }}</div>
      </div>
    </div>

    <!-- 近 30 日走势 -->
    <div class="h5-glass h5-chart-card">
      <div class="h5-card-hd">
        <span class="h5-card-bar"></span>
        <span class="h5-card-title">近 30 日走势</span>
        <span class="h5-card-tag"><SvgIcon name="trend" size="xs" :accent="2" /> 数量</span>
      </div>
      <BaseChart :option="lineOpt" height="230px" />
    </div>

    <!-- 明细 TOP 5 -->
    <div class="h5-section-hd">明细列表 · TOP 5</div>
    <div class="h5-list">
      <article v-for="r in topRows" :key="r.id" class="h5-glass h5-row">
        <span class="h5-code">{{ r.code }}</span>
        <div class="h5-row-main">
          <div class="h5-row-name">{{ r.name }}</div>
          <div class="h5-row-meta">{{ r.category }} · {{ r.owner }}</div>
        </div>
        <div class="h5-row-right">
          <div class="h5-row-amt">¥ {{ r.amount.toLocaleString() }}</div>
          <span class="h5-st" :style="{ color: stColor(r.status), borderColor: stColor(r.status) }">{{ r.status }}</span>
        </div>
      </article>
      <div v-if="!topRows.length" class="h5-glass h5-empty">暂无明细</div>
    </div>
    <div class="h5-spacer" />
  </div>

  <!-- ▼▼▼ 桌面形态（>768px，v1.1.0 保持不动）▼▼▼ -->
  <div v-else class="detail">
    <PanelCard :title="d.title" icon="Document" :body-padding="'14px 18px'">
      <template #extra>
        <span class="muted">更新于 {{ d.time }}</span>
        <el-button size="small" :icon="Refresh" @click="load">刷新</el-button>
      </template>
      <div class="sum-grid">
        <div v-for="(s, i) in d.summary" :key="i" class="sum-cell">
          <div class="sum-v">{{ s.v }}</div>
          <div class="sum-k">{{ s.k }}</div>
        </div>
      </div>
    </PanelCard>

    <PanelCard title="近 30 日走势" icon="TrendCharts">
      <BaseChart :option="lineOpt" height="300px" />
    </PanelCard>

    <PanelCard title="明细列表（前 10 条演示）" icon="List">
      <el-table :data="d.rows" stripe size="default">
        <el-table-column prop="code" label="编号" width="120" />
        <el-table-column prop="name" label="名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" effect="dark" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额(元)" width="140" align="right">
          <template #default="{ row }">{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
      </el-table>
    </PanelCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import PanelCard from '@/components/PanelCard.vue'
import BaseChart from '@/components/BaseChart.vue'
import HealthRing from '@/components/HealthRing.vue'
import BigKpi from '@/components/BigKpi.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { USE_MOCK, mockDetail, mockRows, statusType } from '@/mock'
import { useH5 } from '@/useH5'
// 真实后端接入：import { detailApi } from '@/api'，把 load() 换成 API 调用

const { isH5 } = useH5()
const d = ref(null)

function load() {
  if (!USE_MOCK) return
  const base = mockDetail()
  d.value = { ...base, time: '2026-09-02 15:00', rows: mockRows(10) }
}
load()

/* ---- H5 取值（summary 字符串 → 数值，真实数据）---- */
const sv = (i) => d.value?.summary?.[i]?.v || ''
const svNum = (i, dec = 0) => {
  const n = Number(String(sv(i)).replace(/[^0-9.]/g, '')) || 0
  return dec ? Number(n.toFixed(dec)) : n
}
const ringVal = computed(() => svNum(1, 1)) // 完成率
const topRows = computed(() => (d.value?.rows || []).slice(0, 5))

/* ---- 状态色（H5 自绘胶囊）---- */
const ST_COLOR = { 进行中: 'var(--v2-warning, #FF7A45)', 已完成: 'var(--v2-success, #2BD89B)', 已暂停: 'var(--v2-text-3)' }
function stColor(s) { return ST_COLOR[s] || 'var(--v2-text-3)' }

const lineOpt = computed(() => {
  const t = d.value?.trend || { days: [], s1: [] }
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['数量'] },
    grid: { left: 44, right: 20, top: 40, bottom: 28 },
    xAxis: { type: 'category', data: t.days, boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      { name: '数量', type: 'line', smooth: true, showSymbol: false, data: t.s1, lineStyle: { width: 2.5 }, areaStyle: { opacity: 0.15 } },
    ],
  }
})
</script>

<style scoped>
.detail { display: flex; flex-direction: column; gap: 16px; }

/* 指标网格 */
.sum-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 4px;
}
.sum-cell {
  text-align: center;
  padding: 12px 6px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--line);
}
.sum-v { font-size: 20px; font-weight: 700; color: var(--txt-strong); }
.sum-k { font-size: 11px; color: var(--txt-dim); margin-top: 3px; }

@media (max-width: 1100px) {
  .sum-grid { grid-template-columns: repeat(2, 1fr); }
}

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

/* ---- 品牌头卡 ---- */
.h5-head { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
.h5-head-logo {
  width: 40px; height: 40px;
  border-radius: var(--v2-r-md, 12px);
  background: color-mix(in srgb, var(--v2-accent-1, #2BD4D4) 18%, transparent);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.h5-head-main { flex: 1; min-width: 0; }
.h5-head-title { font-size: 16px; font-weight: 700; color: var(--v2-text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.h5-head-sub { font-size: 11px; color: var(--v2-text-3); margin-top: 2px; }
.h5-head-btn {
  width: 34px; height: 34px;
  background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 60%, transparent);
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-sm, 8px);
  color: var(--v2-text-2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}

/* ---- 圆环 + 关键 KPI ---- */
.h5-top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.h5-ring-card { padding: 10px; display: flex; align-items: center; justify-content: center; }
.h5-ring-card :deep(.hr-card) {
  padding: 8px; gap: 10px; background: transparent; border: none;
  box-shadow: none; backdrop-filter: none;
}
.h5-top-kpis { display: flex; flex-direction: column; gap: 10px; }
.h5-top-kpis .bkp { padding: 10px 12px; }

/* ---- 8 指标格 ---- */
.h5-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.h5-metric { padding: 10px 4px; text-align: center; display: flex; flex-direction: column; gap: 2px; }
.h5-metric-v { font-size: 15px; font-weight: 700; color: var(--v2-text-1); }
.h5-metric-v.hot { color: var(--v2-accent-3, #FF5C5C); }
.h5-metric-k { font-size: 10px; color: var(--v2-text-3); }

/* ---- 走势卡 ---- */
.h5-chart-card { padding: 14px 12px 8px; display: flex; flex-direction: column; gap: 6px; }
.h5-card-hd { display: flex; align-items: center; gap: 8px; }
.h5-card-bar { width: 3px; height: 14px; border-radius: 2px; background: var(--v2-primary, #4F8AFF); }
.h5-card-title { font-size: 14px; font-weight: 600; color: var(--v2-text-1); flex: 1; }
.h5-card-tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--v2-accent-2, #B968F0);
  background: color-mix(in srgb, var(--v2-accent-2, #B968F0) 16%, transparent);
  padding: 2px 8px; border-radius: var(--v2-r-pill, 999px);
}

/* ---- 明细 top5 ---- */
.h5-section-hd { font-size: 12px; font-weight: 600; color: var(--v2-text-2); padding-left: 4px; }
.h5-list { display: flex; flex-direction: column; gap: 10px; }
.h5-row { display: flex; align-items: center; gap: 10px; padding: 12px 14px; }
.h5-code {
  flex-shrink: 0;
  padding: 3px 8px;
  border-radius: var(--v2-r-sm, 8px);
  background: color-mix(in srgb, var(--v2-accent-1, #2BD4D4) 18%, transparent);
  color: var(--v2-accent-1, #2BD4D4);
  font-size: 11px; font-weight: 700;
}
.h5-row-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.h5-row-name { font-size: 14px; font-weight: 600; color: var(--v2-text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.h5-row-meta { font-size: 11px; color: var(--v2-text-3); }
.h5-row-right { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.h5-row-amt { font-size: 13px; font-weight: 700; color: var(--v2-text-1); }
.h5-st { font-size: 10px; font-weight: 600; border: 1px solid; border-radius: var(--v2-r-pill, 999px); padding: 1px 7px; }
.h5-empty { padding: 24px; text-align: center; font-size: 13px; color: var(--v2-text-3); }
.h5-spacer { height: 8px; }
</style>
