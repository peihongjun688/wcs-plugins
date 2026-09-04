<template>
  <section class="panel">
    <header class="panel-hd" v-if="title || $slots.extra">
      <span class="panel-bar"></span>
      <el-icon v-if="icon" class="panel-ic"><component :is="iconComp" /></el-icon>
      <span class="panel-title">{{ title }}</span>
      <span class="panel-spacer"></span>
      <span class="panel-extra"><slot name="extra" /></span>
    </header>
    <div class="panel-bd" :style="{ padding: bodyPadding }">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps({
  title: String,
  icon: String,
  bodyPadding: { type: String, default: '16px' },
})

const iconComp = computed(() => (props.icon ? Icons[props.icon] || props.icon : null))
</script>

<style scoped>
.panel {
  background: var(--panel);
  border: 1px solid var(--panel-bd);
  border-radius: 14px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.panel:hover {
  transform: translateY(-2px);
}
.panel-hd {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
}
.panel-bar {
  width: 4px; height: 16px; border-radius: 3px;
  background: linear-gradient(180deg, var(--accent), var(--accent2));
  box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 60%, transparent);
  flex-shrink: 0;
}
.panel-ic { color: var(--accent); }
.panel-title {
  font-size: 15px; font-weight: 600; color: var(--txt-strong);
  letter-spacing: 0.5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.panel-spacer { flex: 1; }
.panel-extra { display: flex; align-items: center; gap: 8px; }
.panel-bd { padding: 16px; }
</style>
