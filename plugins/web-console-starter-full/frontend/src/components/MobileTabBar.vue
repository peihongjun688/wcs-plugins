<template>
  <nav class="mtab" role="navigation" aria-label="主导航">
    <button
      v-for="(t, i) in items"
      :key="t.key"
      class="mtab-item"
      :class="{ active: active === t.key, mid: t.mid }"
      :aria-label="t.label"
      @click="onTap(t)"
    >
      <span class="mtab-ico">
        <SvgIcon :name="t.icon" size="md" />
        <span v-if="t.badge" class="mtab-dot" />
      </span>
      <span class="mtab-txt">{{ t.label }}</span>
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()

// 5 项固定 + 中间"全部"凸起（参考 EPDM H5）
const items = [
  { key: 'overview', label: '总览', icon: 'monitor', to: '/h5' },
  { key: 'alert', label: '告警', icon: 'alert', badge: 7, to: '/h5' },
  { key: 'all', label: '全部', icon: 'grid', mid: true, to: '/h5', action: 'drawer' },
  { key: 'trend', label: '趋势', icon: 'trend', to: '/trend' },
  { key: 'me', label: '我的', icon: 'user', to: '/settings' },
]

const emit = defineEmits(['tap', 'open-drawer'])
const active = defineModel('active', { default: 'overview' })

function onTap(t) {
  active.value = t.key
  if (t.action === 'drawer') {
    emit('open-drawer')
    return
  }
  if (t.to) router.push(t.to)
  emit('tap', t)
}
</script>

<style scoped>
.mtab {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  height: calc(56px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.85));
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-top: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  box-shadow: var(--v2-shadow-tabbar, 0 -4px 16px rgba(0, 0, 0, 0.20));
}

.mtab-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px;
  height: 56px;
  background: transparent; border: none;
  color: var(--v2-text-3, rgba(159, 182, 214, 0.50));
  font-size: 11px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}
.mtab-item:active { transform: scale(0.96); }

.mtab-ico {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
}
.mtab-txt { font-weight: 400; line-height: 1.1; }

.mtab-item.active {
  color: var(--v2-primary, #4F8AFF);
}
.mtab-item.active .mtab-txt { font-weight: 600; }

/* 中间"全部"凸起圆形 */
.mtab-item.mid .mtab-ico {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--v2-primary, #4F8AFF), var(--v2-accent-2, #B968F0));
  box-shadow: 0 6px 16px color-mix(in srgb, var(--v2-primary, #4F8AFF) 40%, transparent);
  color: #fff;
  margin-top: -10px;
}
.mtab-item.mid .mtab-txt { font-weight: 600; color: var(--v2-primary, #4F8AFF); }
.mtab-item.mid.active .mtab-txt { color: var(--v2-primary, #4F8AFF); }

/* 红点徽章 */
.mtab-dot {
  position: absolute; top: 0; right: 0;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--v2-danger, #FF5C5C);
  box-shadow: 0 0 0 2px var(--v2-glass-bg, rgba(15, 28, 48, 0.85));
}

/* 浅色皮肤文字加深 */
:global(html[data-h5-skin="light-warm"]) .mtab,
:global(html[data-h5-skin="light-fresh"]) .mtab {
  color: var(--v2-text-1);
}
</style>