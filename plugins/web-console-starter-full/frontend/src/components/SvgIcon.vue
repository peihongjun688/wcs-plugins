<template>
  <span
    class="svg-icon"
    :class="['size-' + size, 'accent-' + (accent || 1)]"
    :style="{ color }"
    v-html="inner"
  />
</template>

<script setup>
import { computed } from 'vue'
import { ICONS, ICON_ACCENT } from '@/icons'

const props = defineProps({
  name: { type: String, required: true },
  // 业务语义配色（1=青 2=紫 3=红 4=橙 5=绿）；缺省按图标自动映射
  accent: { type: Number, default: 0 },
  // 直接覆盖颜色（如 'var(--v2-primary)'），优先级高于 accent
  color: { type: String, default: '' },
  size: { type: String, default: 'md' }, // xs/sm/md/lg/xl
})

const inner = computed(() => ICONS[props.name] || '')
const autoAccent = computed(() => props.accent || ICON_ACCENT[props.name] || 1)
</script>

<style scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
}
.svg-icon :deep(svg) { width: 100%; height: 100%; display: block; }
.size-xs { width: 14px; height: 14px; }
.size-sm { width: 18px; height: 18px; }
.size-md { width: 24px; height: 24px; }
.size-lg { width: 32px; height: 32px; }
.size-xl { width: 40px; height: 40px; }

/* accent 映射为 v2 强调色（color 属性为空时由 class 注入） */
.accent-1 { color: var(--v2-accent-1, #2BD4D4); }
.accent-2 { color: var(--v2-accent-2, #B968F0); }
.accent-3 { color: var(--v2-accent-3, #FF5C5C); }
.accent-4 { color: var(--v2-accent-4, #FF7A45); }
.accent-5 { color: var(--v2-accent-5, #2BD89B); }
</style>