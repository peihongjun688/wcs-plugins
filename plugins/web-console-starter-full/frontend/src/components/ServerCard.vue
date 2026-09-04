<template>
  <div class="scard">
    <div class="scard-hd">
      <span class="scard-bar"></span>
      <span class="scard-title">{{ title }}</span>
    </div>
    <div class="scard-rows">
      <div v-for="(r, i) in rows" :key="i" class="scard-row" :class="{ primary: r.primary }">
        <span class="scard-key">{{ r.key }}</span>
        <span class="scard-val" :class="r.primary ? 'val-strong' : 'val-norm'">{{ r.val }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '服务器信息' },
  rows: { type: Array, required: true }, // [{key, val, primary?}]
})
</script>

<style scoped>
.scard {
  background: var(--v2-glass-bg, rgba(15, 28, 48, 0.62));
  border: 1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.10));
  border-radius: var(--v2-r-md, 12px);
  box-shadow: var(--v2-shadow-glass, 0 8px 32px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  padding: 16px;
  color: var(--v2-text-1);
}
.scard-hd {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
}
.scard-bar {
  display: inline-block;
  width: 3px; height: 14px;
  border-radius: 2px;
  background: var(--v2-primary, #4F8AFF);
}
.scard-title { font-size: 14px; font-weight: 600; color: var(--v2-text-1); }

.scard-rows { display: flex; flex-direction: column; }
.scard-row {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 36px;
  padding: 6px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--v2-glass-border, rgba(255,255,255,0.10)) 50%, transparent);
}
.scard-row:last-child { border-bottom: none; }
.scard-key { font-size: 12px; color: var(--v2-text-3); }
.scard-val { font-size: 14px; font-weight: 600; }
.scard-row.primary .scard-key { color: var(--v2-text-2); }
.val-strong { font-size: 18px; color: var(--v2-text-1); }
.val-norm { color: var(--v2-text-2); }
</style>