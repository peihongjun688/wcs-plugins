<template>
  <div class="hd-page">
    <!-- 顶栏胶囊：标题 + 书签/刷新（参考 EPDM H5） -->
    <header class="hd-top">
      <div class="hd-pill">
        <span class="hd-brand-mini">⚡</span>
        <span class="hd-pill-title">{{ cfg.title }} · 移动端</span>
        <span class="hd-pill-actions">
          <button class="hd-pill-btn" aria-label="书签"><SvgIcon name="user" size="sm" /></button>
          <button class="hd-pill-btn" aria-label="刷新" @click="onRefresh"><SvgIcon name="refresh" size="sm" /></button>
        </span>
      </div>
    </header>

    <!-- 主体白卡片：品牌 + 大标题 -->
    <section class="hd-head">
      <div class="hd-brand-logo">EPDM</div>
      <div class="hd-head-main">
        <div class="hd-head-title">{{ activeTab === 'all' ? '全部模块' : '总览大屏' }}</div>
        <div class="hd-head-sub">{{ activeTab === 'all' ? '运维模块入口' : '健康评分与核心指标' }}</div>
      </div>
      <button class="hd-refresh-btn" @click="onRefresh" aria-label="刷新">
        <SvgIcon name="refresh" size="sm" />
      </button>
    </section>

    <!-- 模块入口区 -->
    <section class="hd-section">
      <div class="hd-section-hd">运维模块</div>
      <ModuleGrid :modules="modules" :cols="3" />
    </section>

    <!-- 服务器信息玻璃卡 -->
    <section class="hd-section">
      <ServerCard title="服务器信息" :rows="serverRows" />
    </section>

    <!-- 占位：让最后内容不被 TabBar 遮挡 -->
    <div class="hd-bottom-spacer" />

    <!-- 底部 TabBar -->
    <MobileTabBar v-model:active="activeTab" @open-drawer="drawerOpen = true" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import cfg from '@app'
import ModuleGrid from '@/components/ModuleGrid.vue'
import ServerCard from '@/components/ServerCard.vue'
import MobileTabBar from '@/components/MobileTabBar.vue'
import SvgIcon from '@/components/SvgIcon.vue'

const activeTab = ref('all')
const drawerOpen = ref(false)

// EPDM H5 11 个模块（按业务语义配 accent）
const modules = [
  { title: '实时监测', icon: 'monitor', accent: 1, to: '/trend' },
  { title: '历史趋势', icon: 'trend', accent: 2, to: '/trend' },
  { title: '告警中心', icon: 'alert', accent: 3, badge: 7, to: '/detail' },
  { title: 'SQL 性能', icon: 'sql', accent: 4, to: '/detail' },
  { title: 'Archive', icon: 'archive', accent: 1, to: '/detail' },
  { title: '网络传输', icon: 'network', accent: 2, to: '/detail' },
  { title: '磁盘 IO', icon: 'disk', accent: 1, to: '/detail' },
  { title: '故障日志', icon: 'log', accent: 2, to: '/detail' },
  { title: '巡检报告', icon: 'shield', accent: 5, to: '/detail' },
  { title: '运维执行', icon: 'wrench', accent: 4, to: '/settings' },
  { title: '系统设置', icon: 'gear', accent: 1, to: '/settings' },
]

const serverRows = [
  { key: '主机名', val: 'ACE-EPDM', primary: true },
  { key: 'IP 地址', val: '10.168.1.100' },
  { key: '操作系统', val: 'Windows Server 2008 R2' },
  { key: '采集时间', val: '7 分钟前 (09-03 21:40)' },
]

function onRefresh() { location.reload() }
</script>

<style scoped>
.hd-page {
  min-height: 100vh;
  padding: 16px 16px 24px;
  color: var(--v2-text-1, rgba(234, 242, 255, 0.92));
  display: flex; flex-direction: column; gap: 16px;
  background: var(--v2-bg-deep, linear-gradient(135deg, #0B1F3A 0%, #0A1124 100%));
  background-attachment: fixed;
}

/* ---- 顶栏胶囊 ---- */
.hd-top { display: flex; align-items: center; gap: 8px; }
.hd-pill {
  flex: 1;
  display: flex; align-items: center; gap: 8px;
  height: 36px;
  padding: 0 12px;
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-pill, 999px);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  color: var(--v2-text-1);
}
.hd-brand-mini {
  font-size: 16px;
  color: var(--v2-success, #2BD89B);
}
.hd-pill-title {
  flex: 1;
  font-size: 14px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.hd-pill-actions { display: flex; gap: 4px; }
.hd-pill-btn {
  width: 28px; height: 28px;
  background: transparent; border: none;
  color: var(--v2-text-2);
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.hd-pill-btn:active { background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 80%, transparent); }

/* ---- 主体白卡片（品牌 + 大标题）---- */
.hd-head {
  display: flex; align-items: center; gap: 12px;
  padding: 16px;
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
.hd-brand-logo {
  width: 44px; height: 44px;
  border-radius: var(--v2-r-md, 12px);
  background: linear-gradient(135deg, var(--v2-primary, #4F8AFF), var(--v2-accent-2, #B968F0));
  color: #fff;
  font-weight: 800; font-size: 11px;
  letter-spacing: 0.5px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--v2-primary, #4F8AFF) 40%, transparent);
}
.hd-head-main { flex: 1; min-width: 0; }
.hd-head-title { font-size: 18px; font-weight: 700; color: var(--v2-text-1); }
.hd-head-sub { font-size: 12px; color: var(--v2-text-3); margin-top: 2px; }
.hd-refresh-btn {
  width: 36px; height: 36px;
  background: color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 60%, transparent);
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-sm, 8px);
  color: var(--v2-text-2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* ---- 区块 ---- */
.hd-section { display: flex; flex-direction: column; gap: 10px; }
.hd-section-hd {
  font-size: 12px; font-weight: 600;
  color: var(--v2-text-2);
  padding-left: 4px;
  letter-spacing: 0.5px;
}

.hd-bottom-spacer { height: 24px; }
</style>