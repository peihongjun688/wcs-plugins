// ============================================================
// web-console-starter · H5 业务图标字典（v2.0）
// ------------------------------------------------------------
// 内联 SVG（24x24 viewBox），零网络依赖。
// 颜色由父元素 currentColor + SvgIcon 组件的 color prop 驱动，
// color 映射业务语义（accent-1=青/2=紫/3=红/4=橙/5=绿）。
// ============================================================

const COMMON_PROPS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'

// 12 核心业务图标（每个都是简洁一致的线条风格）
export const ICONS = {
  // 监测 / 数据采集 —— 心电图脉搏
  monitor: `<svg ${COMMON_PROPS}><polyline points="3 12 7 12 10 5 14 19 17 12 21 12"/></svg>`,
  // 趋势 / 折线图
  trend: `<svg ${COMMON_PROPS}><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>`,
  // 告警 / 铃铛
  alert: `<svg ${COMMON_PROPS}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.21 21a1.94 1.94 0 0 0 3.58 0"/></svg>`,
  // SQL / 数据库
  sql: `<svg ${COMMON_PROPS}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>`,
  // Archive / 文件柜
  archive: `<svg ${COMMON_PROPS}><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="5" y="10" width="14" height="10" rx="1"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
  // 网络 / 地球
  network: `<svg ${COMMON_PROPS}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  // 磁盘 / 硬盘
  disk: `<svg ${COMMON_PROPS}><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><line x1="7" y1="7" x2="7.01" y2="7"/><line x1="7" y1="17" x2="7.01" y2="17"/></svg>`,
  // 日志 / 文档
  log: `<svg ${COMMON_PROPS}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="14 3 14 9 20 9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`,
  // 巡检 / 盾牌
  shield: `<svg ${COMMON_PROPS}><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  // 运维 / 扳手
  wrench: `<svg ${COMMON_PROPS}><path d="M14.7 6.3a4 4 0 1 1-5.6 5.6L4 17v3h3l5.1-5.1a4 4 0 0 1 5.6-5.6l-3 3-2-2 3-3z"/></svg>`,
  // 设置 / 齿轮
  gear: `<svg ${COMMON_PROPS}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  // 全部 / 九宫格
  grid: `<svg ${COMMON_PROPS}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  // 通用：刷新
  refresh: `<svg ${COMMON_PROPS}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  // 通用：用户
  user: `<svg ${COMMON_PROPS}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  // 通用：搜索
  search: `<svg ${COMMON_PROPS}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>`,
  // 通用：新建（加号）
  plus: `<svg ${COMMON_PROPS}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  // 通用：编辑（铅笔）
  edit: `<svg ${COMMON_PROPS}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`,
  // 通用：删除（垃圾桶）
  trash: `<svg ${COMMON_PROPS}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  // 通用：箭头（右）
  arrow: `<svg ${COMMON_PROPS}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></svg>`,
  // 通用：完成（对勾）
  check: `<svg ${COMMON_PROPS}><polyline points="20 6 9 17 4 12"/></svg>`,
}

// 业务域图标映射（按规范稿 §11 业务语义映射 accent）
export const ICON_ACCENT = {
  monitor: 1, trend: 2, alert: 3, sql: 1, archive: 1, network: 2,
  disk: 1, log: 2, shield: 5, wrench: 4, gear: 1, grid: 1,
  refresh: 1, user: 1, search: 1, plus: 5, edit: 2, trash: 3, arrow: 1, check: 5,
}