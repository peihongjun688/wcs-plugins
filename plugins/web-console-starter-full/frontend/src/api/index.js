// ============================================================
// axios 封装：401 拦截 + 统一解包 {code,msg,data}
// apiBase 读自根 app.config.js
// ============================================================
import axios from 'axios'
import { auth, clearAuth } from '@/store'
import cfg from '@app'

const api = axios.create({ baseURL: cfg.apiBase || '/api/v1', timeout: 60000 })

api.interceptors.request.use((cfgR) => {
  if (auth.token) cfgR.headers.Authorization = 'Bearer ' + auth.token
  return cfgR
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      clearAuth()
      if (location.pathname !== '/login') location.assign('/login')
    }
    return Promise.reject(err)
  }
)

function unwrap(res) {
  const d = res.data
  if (d && d.code !== 0) {
    const e = new Error(d.msg || '请求失败')
    e.code = d.code
    throw e
  }
  return d ? d.data : null
}
const get = (url, params) => api.get(url, { params }).then(unwrap)
const post = (url, body, params, cfgR) => api.post(url, body, Object.assign({ params }, cfgR)).then(unwrap)
const put = (url, body) => api.put(url, body).then(unwrap)
const del = (url) => api.delete(url).then(unwrap)

// ---- 通用 API 分组：auth（登录鉴权）----
export const authApi = {
  login: (username, password) => post('/auth/login', { username, password }),
  profile: () => get('/auth/profile'),
  changePassword: (oldPassword, newPassword) => post('/auth/password', { oldPassword, newPassword }),
  logout: () => post('/auth/logout'),
}

// ---- 通用 API 分组：settings（系统设置）----
export const settingsApi = {
  get: () => get('/settings'),
  update: (body) => put('/settings', body),
}

// ---- 通用 API 分组：common（健康检查/系统信息）----
export const commonApi = {
  health: () => get('/health'),
  info: () => get('/health'),
}

export default api
