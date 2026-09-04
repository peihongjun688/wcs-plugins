// ============================================================
// web-console-starter · H5 视觉规范 v2.0 移动端判定工具
// ------------------------------------------------------------
// 与 docs/H5视觉规范v2.0.md / Layout.vue 断点完全一致：≤768px = H5。
// 用法：const { isH5 } = useH5()
// 说明：initialValue 在模块加载时立即求值（非等 onMounted），
// 保证手机首帧直接渲染 H5 分支，无"先桌面后 H5"闪烁。
// ============================================================
import { ref, onMounted, onBeforeUnmount } from 'vue'

export const H5_QUERY = '(max-width: 768px)'

export function useH5() {
  const isH5 = ref(typeof window !== 'undefined' && !!window.matchMedia(H5_QUERY).matches)

  let mql = null
  function sync(e) {
    isH5.value = e ? e.matches : window.matchMedia(H5_QUERY).matches
  }

  onMounted(() => {
    mql = window.matchMedia(H5_QUERY)
    sync(mql) // 兜底再同步一次（如移动端浏览器地址栏收起改变视口）
    if (mql.addEventListener) mql.addEventListener('change', sync)
    else if (mql.addListener) mql.addListener(sync)
  })
  onBeforeUnmount(() => {
    if (!mql) return
    if (mql.removeEventListener) mql.removeEventListener('change', sync)
    else if (mql.removeListener) mql.removeListener(sync)
  })

  return { isH5 }
}
