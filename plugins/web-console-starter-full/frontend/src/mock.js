// ============================================================
// web-console-starter · 页面模板演示数据源（mock）
// ------------------------------------------------------------
// 每个页面模板都有一个 useMock 开关：无后端时靠本文件跑通
// 页面流；接入真实业务时：USE_MOCK=false + 让页面调真实 API
// （见 AI-GUIDE.md「mock → 真实 API 切换」）。
// 演示数据全部为虚构，不涉及任何真实品牌/公司。
// ============================================================

export const USE_MOCK = true

// 近 N 天日期标签（yyyy-MM-dd / MM-dd）
function days(n, sliceLen = 5) {
  const out = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    out.push(s.slice(sliceLen))
  }
  return out
}

// 简单伪随机（同 seed 结果稳定，方便截图复现）
function rnd(seed) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

/* ---------------- Dashboard 总览 ---------------- */
export function mockDashboard() {
  const trendDays = days(7)
  const sales = trendDays.map((_, i) => Math.round(28 + rnd(i + 1) * 22 + i * 1.8))
  const orders = trendDays.map((_, i) => Math.round(120 + rnd(i + 3) * 90 + i * 3))
  return {
    collectTime: '2026-09-02 15:00:00',
    kpis: [
      { key: 'order', label: '本月订单', value: 1842, unit: '单', ring: 74, icon: 'Tickets', sub: '环比 +12.4%' },
      { key: 'sales', label: '本月销售额', value: 368.5, unit: '万元', ring: 58, icon: 'Money', sub: '环比 +8.1%' },
      { key: 'customer', label: '活跃客户', value: 96, unit: '家', ring: 42, icon: 'OfficeBuilding', sub: '本月新增 7 家' },
      { key: 'todo', label: '待办事项', value: 23, unit: '项', ring: 18, icon: 'AlarmClock', sub: '其中紧急 5 项' },
    ],
    trend: { days: trendDays, sales, orders },
    category: [
      { name: 'A 类', value: 46 },
      { name: 'B 类', value: 28 },
      { name: 'C 类', value: 15 },
      { name: 'D 类', value: 11 },
    ],
    notices: [
      { code: 'N-101', title: '演示事项：周报待提交 3 份', level: 'ALERT' },
      { code: 'N-102', title: '演示事项：库存预警商品 6 个', level: 'WARN' },
      { code: 'N-103', title: '演示事项：本周回款计划 12 笔', level: 'INFO' },
    ],
    services: [
      { name: '订单服务', ok: true, st: '运行中' },
      { name: '支付网关', ok: true, st: '运行中' },
      { name: '消息队列', ok: true, st: '运行中' },
      { name: '报表服务', ok: false, st: '已停止' },
    ],
  }
}

/* ---------------- CrudPage 列表 CRUD ---------------- */
const STOCK_NAMES = ['演示记录', '业务样本', '流程实例', '归档文档', '统计模板']
const CATEGORIES = ['采购', '销售', '库存', '财务', '人事']
const STATUSES = ['进行中', '已完成', '已暂停']
export function mockRows(total = 35) {
  const rows = []
  for (let i = 1; i <= total; i++) {
    rows.push({
      id: 1000 + i,
      code: `S-${String(i).padStart(4, '0')}`,
      name: `${STOCK_NAMES[i % STOCK_NAMES.length]} #${i}`,
      category: CATEGORIES[i % CATEGORIES.length],
      status: STATUSES[i % 3],
      owner: `演示用户${(i % 5) + 1}`,
      amount: Math.round((rnd(i) * 9000 + 1000) * 100) / 100,
      createdAt: `2026-0${(i % 8) + 1}-${String((i * 3) % 27 + 1).padStart(2, '0')} 09:3${i % 10}`,
      remark: '模板演示数据，可编辑',
    })
  }
  return rows
}

/* ---------------- TrendPage 趋势 ---------------- */
export function mockTrend(rangeDays) {
  const d = days(rangeDays)
  const s1 = d.map((_, i) => Math.round(40 + rnd(i + 5) * 40))
  const s2 = d.map((_, i) => Math.round(60 + rnd(i + 9) * 25))
  const s3 = d.map((_, i) => Math.round(20 + rnd(i + 13) * 30))
  return { days: d, s1, s2, s3 }
}

/* ---------------- DetailPage 明细/详情 ---------------- */
export function mockDetail() {
  return {
    title: '示例业务汇总 · 2026 年 8 月',
    summary: [
      { k: '单据总数', v: '1,286 张' },
      { k: '完成率', v: '92.4%' },
      { k: '平均周期', v: '2.3 天' },
      { k: '异常单', v: '37 张' },
      { k: '涉及金额', v: '¥ 428.6 万' },
      { k: '负责人数', v: '18 人' },
      { k: '归档数', v: '1,102 张' },
      { k: '跨月单据', v: '26 张' },
    ],
    trend: mockTrend(30),
  }
}

/* ---------------- 通用状态 → el-tag type ---------------- */
export function statusType(s) {
  if (s === '已完成') return 'success'
  if (s === '已暂停') return 'info'
  return 'warning'
}
