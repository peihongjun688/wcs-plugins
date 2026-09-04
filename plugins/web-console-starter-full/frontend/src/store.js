// ============================================================
// 全局状态（auth）。localStorage key 前缀读自根 app.config.js
// 的 localKey（缺省取 name），避免多套系统同域互相污染。
// ============================================================
import { reactive, computed } from 'vue'
import cfg from '@app'

const APP_KEY = cfg.localKey || cfg.name || 'wcs'

const savedUser = localStorage.getItem(APP_KEY + '_user')
const state = reactive({
  token: localStorage.getItem(APP_KEY + '_token') || '',
  user: savedUser ? JSON.parse(savedUser) : null,
})

export const auth = state

export function setAuth(token, user) {
  state.token = token
  state.user = user
  localStorage.setItem(APP_KEY + '_token', token)
  localStorage.setItem(APP_KEY + '_user', JSON.stringify(user))
}

export function clearAuth() {
  state.token = ''
  state.user = null
  localStorage.removeItem(APP_KEY + '_token')
  localStorage.removeItem(APP_KEY + '_user')
}

export const isLoggedIn = computed(() => !!state.token)
export const role = computed(() => state.user?.role || 'viewer')

// 权限判断：admin 全权；operator 可 view/写操作；viewer 只读
export function can(action) {
  const r = role.value
  if (r === 'admin') return true
  if (r === 'operator') return ['view', 'collect', 'edit', 'ack'].includes(action)
  return action === 'view'
}
