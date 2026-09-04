// ============================================================
// web-console-starter backend · 鉴权中间件 + 统一响应工具
// ------------------------------------------------------------
// 约定：
//   成功: res.ok(data)          → 200 { code:0, msg:'ok', data }
//   失败: res.fail(msg, http)   → { code:1, msg }
//   401 由前端 axios 拦截跳登录；业务错误 code!==0 由 unwrap 抛出
// 角色：admin 全权；operator 可 view/edit/create/ack；
//       viewer 仅 view。后端用 requireRole / canAction 强制。
// ============================================================
const jwt = require('jsonwebtoken')
const cfg = require('../config')

const ACTIONS_BY_ROLE = {
  admin: ['view', 'create', 'edit', 'delete', 'ack', 'settings'],
  operator: ['view', 'create', 'edit', 'ack'],
  viewer: ['view'],
}

// 响应工具挂到 res
function ok(data, msg = 'ok') {
  this.status(200).json({ code: 0, msg, data: data === undefined ? null : data })
}
function fail(msg, http = 400, code = 1) {
  this.status(http).json({ code, msg })
}

function attachResHelpers(req, res, next) {
  res.ok = ok
  res.fail = fail
  next()
}

// 登录态校验：Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  if (!token) return res.fail('未登录或登录已过期', 401)
  try {
    const payload = jwt.verify(token, cfg.jwtSecret)
    req.user = payload // { id, username, name, role }
    return next()
  } catch (e) {
    return res.fail('登录已过期，请重新登录', 401)
  }
}

// 角色白名单
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.fail('未登录', 401)
    if (!roles.includes(req.user.role)) return res.fail('无权访问：需要角色 ' + roles.join('/'), 403)
    return next()
  }
}

// 动作权限（默认仅 admin/operator 可写）
function canAction(action) {
  return (req, res, next) => {
    if (!req.user) return res.fail('未登录', 401)
    const allowed = ACTIONS_BY_ROLE[req.user.role] || []
    if (!allowed.includes(action)) return res.fail('权限不足：需要操作「' + action + '」', 403)
    return next()
  }
}

function can(user, action) {
  const allowed = ACTIONS_BY_ROLE[user.role] || []
  return allowed.includes(action)
}

module.exports = { attachResHelpers, requireAuth, requireRole, canAction, can }
