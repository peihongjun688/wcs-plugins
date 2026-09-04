<template>
  <!-- ============================================================
       页面模板 C · 趋势分析（桌面 / H5 v2.0 双形态）
       形态：桌面 = 范围控件 + 全宽趋势图 + 汇总柱状
             H5    = 分段胶囊 + 趋势大卡 + 合计 BigKpi + 汇总柱状
       数据：useMock（src/mock.js）演示；接真实 API 见 AI-GUIDE.md
       ============================================================ -->

  <!-- ▼▼▼ H5 视觉规范 v2.0 形态（≤768px）▼▼▼ -->
  <div v-if="isH5" class="h5-page h5-trend">
    <!-- 顶栏胶囊：标题 + 时间范围分段 -->
    <div class="h5-glass h5-toolbar">
      <span class="h5-toolbar-title">趋势分析</span>
      <div class="h5-seg">
        <button v-for="d in [7, 30, 90]" :key="d" class="h5-seg-btn"
          :class="{ on: range === d }" @click="range = d; load()">近 {{ d }} 天</button>
      </div>
    </div>

    <!-- 趋势大卡 -->
    <div class="h5-glass h5-chart-card">
      <div class="h5-card-hd">
        <span class="h5-card-bar"></span>
        <span class="h5-card-title">多系列趋势曲线</span>
        <span class="h5-card-tag">A · B · C</span>
      </div>
      <BaseChart :option="lineOpt" height="250px" />
    </div>

    <!-- 区间合计 BigKpi ×3（真实数据聚合） -->
    <div class="h5-kpis">
      <BigKpi title="A 系列合计" :value="sumArr(data.s1)" unit="单位" :max="sumArr(data.s1) || 1" />
      <BigKpi title="B 系列合计" :value="sumArr(data.s2)" unit="单位" :max="sumArr(data.s2) || 1" />
      <BigKpi title="C 系列合计" :value="sumArr(data.s3)" unit="单位" :max="sumArr(data.s3) || 1" />
    </div>

    <!-- 汇总柱状 -->
    <div class="h5-glass h5-chart-card">
      <div class="h5-card-hd">
        <span class="h5-card-bar"></span>
        <span class="h5-card-title">阶段汇总（求和）</span>
        <span class="h5-card-tag">近 {{ range }} 天</span>
      </div>
      <BaseChart :option="barOpt" height="220px" />
    </div>

    <div class="h5-glass h5-tip">
      <span class="h5-tip-ico"><SvgIcon name="shield" size="sm" :accent="5" /></span>
      <span class="h5-tip-txt">图表颜色随皮肤自动切换 · 接真实后端时把 mockTrend(range) 换成聚合接口即可</span>
    </div>
    <div class="h5-spacer" />
  </div>

  <!-- ▼▼▼ 桌面形态（>768px，v1.1.0 保持不动）▼▼▼ -->
  <div v-else class="trend">
    <PanelCard title="趋势分析（演示模板）" icon="TrendCharts">
      <template #extra>
        <el-radio-group v-model="range" size="small" @change="load">
          <el-radio-button :value="7">近 7 天</el-radio-button>
          <el-radio-button :value="30">近 30 天</el-radio-button>
          <el-radio-button :value="90">近 90 天</el-radio-button>
        </el-radio-group>
      </template>

      <BaseChart :option="lineOpt" height="280px" />

      <div class="legend-note muted">
        A 系列（主题色盘第 1 色）· B 系列（第 2 色）· C 系列（第 3 色）—— 颜色不写死，随皮肤自动切换
      </div>
    </PanelCard>

    <div class="row">
      <PanelCard title="阶段汇总（求和）" icon="Histogram" class="c1">
        <BaseChart :option="barOpt" height="280px" />
      </PanelCard>
      <PanelCard title="使用说明" icon="InfoFilled" class="c1">
        <div class="guide">
          <p>本页演示「趋势/大屏类」页面的标准写法：</p>
          <ol>
            <li>顶栏提供时间范围控件（7/30/90 天）</li>
            <li>主体为全宽多系列折线/面积图（<code>BaseChart</code>）</li>
            <li>同一份数据可复用于柱状汇总（<code>range</code> 联动）</li>
            <li>接真实后端：把 <code>mockTrend(range)</code> 换成你的聚合接口即可</li>
          </ol>
          <p class="muted">图表自适应容器尺寸，隐藏标签页切回后仍正常（ResizeObserver）。</p>
        </div>
      </PanelCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PanelCard from '@/components/PanelCard.vue'
import BaseChart from '@/components/BaseChart.vue'
import BigKpi from '@/components/BigKpi.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { USE_MOCK, mockTrend } from '@/mock'
import { useH5 } from '@/useH5'

const { isH5 } = useH5()
const range = ref(30)
const data = ref(mockTrend(30))

function load() {
  // 真实后端：data.value = await trendApi.series({ days: range.value })
  if (!USE_MOCK) return
  data.value = mockTrend(range.value)
}

const sumArr = (arr) => (arr || []).reduce((a, b) => a + b, 0)

/* 折线：三段取 label 取最后 10 个点防拥挤 */
const lineOpt = computed(() => {
  const t = data.value
  const labels = t.days.slice(-Math.min(10, t.days.length))
  const pick = (arr) => arr.slice(-labels.length)
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['A 系列', 'B 系列', 'C 系列'] },
    grid: { left: 48, right: 20, top: 44, bottom: 30 },
    xAxis: { type: 'category', data: labels, boundaryGap: false },
    yAxis: { type: 'value', name: '数值' },
    series: [
      { name: 'A 系列', type: 'line', smooth: true, showSymbol: false, data: pick(t.s1), lineStyle: { width: 2.5 }, areaStyle: { opacity: 0.14 } },
      { name: 'B 系列', type: 'line', smooth: true, showSymbol: false, data: pick(t.s2), lineStyle: { width: 2 } },
      { name: 'C 系列', type: 'line', smooth: true, showSymbol: false, data: pick(t.s3), lineStyle: { width: 2, type: 'dashed' } },
    ],
  }
})

const barOpt = computed(() => {
  const t = data.value
  const sum = (arr) => arr.reduce((a, b) => a + b, 0)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 48, right: 20, top: 24, bottom: 30 },
    xAxis: { type: 'category', data: ['A 系列', 'B 系列', 'C 系列'] },
    yAxis: { type: 'value' },
    series: [{
      name: '区间合计', type: 'bar', barWidth: 48,
      data: [
        { value: sum(t.s1), itemStyle: { borderRadius: [6, 6, 0, 0] } },
        { value: sum(t.s2), itemStyle: { borderRadius: [6, 6, 0, 0] } },
        { value: sum(t.s3), itemStyle: { borderRadius: [6, 6, 0, 0] } },
      ],
      label: { show: true, position: 'top', color: 'inherit', fontSize: 12 },
    }],
  }
})
</script>

<style scoped>
.trend { display: flex; flex-direction: column; gap: 16px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.c1 { min-width: 0; }
.legend-note { margin-top: 8px; font-size: 12px; }
.guide { font-size: 13px; color: var(--txt); line-height: 1.9; }
.guide ol { padding-left: 20px; margin: 8px 0; }
.guide code {
  background: var(--hover-bg); border-radius: 4px;
  padding: 1px 6px; font-size: 12px; color: var(--txt-strong);
}
@media (max-width: 1100px) { .row { grid-template-columns: 1fr; } }

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

/* ---- 顶栏胶囊：标题 + 分段 ---- */
.h5-toolbar { padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
.h5-toolbar-title { font-size: 15px; font-weight: 700; color: var(--v2-text-1); flex-shrink: 0; }
.h5-seg {
  flex: 1;
  display: flex;
  padding: 3px;
  background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 55%, transparent);
  border-radius: var(--v2-r-pill, 999px);
}
.h5-seg-btn {
  flex: 1;
  padding: 6px 0;
  background: transparent; border: none;
  color: var(--v2-text-2);
  font-size: 12px;
  border-radius: var(--v2-r-pill, 999px);
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}
.h5-seg-btn.on {
  background: linear-gradient(135deg, var(--v2-primary, #4F8AFF), var(--v2-accent-2, #B968F0));
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--v2-primary, #4F8AFF) 40%, transparent);
}

/* ---- 图表卡 ---- */
.h5-chart-card { padding: 14px 12px 8px; display: flex; flex-direction: column; gap: 6px; }
.h5-card-hd { display: flex; align-items: center; gap: 8px; }
.h5-card-bar { width: 3px; height: 14px; border-radius: 2px; background: var(--v2-primary, #4F8AFF); }
.h5-card-title { font-size: 14px; font-weight: 600; color: var(--v2-text-1); flex: 1; }
.h5-card-tag {
  font-size: 11px; color: var(--v2-accent-2, #B968F0);
  background: color-mix(in srgb, var(--v2-accent-2, #B968F0) 16%, transparent);
  padding: 2px 8px; border-radius: var(--v2-r-pill, 999px);
}

/* ---- 合计 KPI ---- */
.h5-kpis { display: flex; flex-direction: column; gap: 10px; }

/* ---- 提示条 ---- */
.h5-tip {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
}
.h5-tip-ico { flex-shrink: 0; display: flex; }
.h5-tip-txt { font-size: 12px; color: var(--v2-text-2); line-height: 1.6; }
.h5-spacer { height: 8px; }
</style>
