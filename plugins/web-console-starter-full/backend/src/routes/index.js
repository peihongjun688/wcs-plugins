// ============================================================
// web-console-starter backend · 路由装配
// 所有接口挂在 /api/v1 前缀下（与前端 app.config.apiBase 一致）
// ============================================================
const express = require('express')
const { db } = require('../db')
const { requireAuth, canAction } = require('../middleware/auth')
const { wrap } = require('../middleware/error')
const auth = require('../controllers/auth.controller')
const items = require('../controllers/items.controller')
const settings = require('../controllers/settings.controller')

const api = express.Router()

// ---- 公共 ----
api.get('/health', wrap(async (req, res) => {
  let dbOk = false
  try { db.prepare('SELECT 1 AS x').get(); dbOk = true } catch (e) { /* ignore */ }
  res.ok({
    ok: true,
    db: dbOk ? 'ok' : 'error',
    time: new Date().toISOString(),
    version: require('../../package.json').version,
  })
}))

// ---- auth（登录公共；其余需登录）----
api.post('/auth/login', auth.login)
api.post('/auth/logout', auth.logout) // 无状态：仅返回 ok
api.get('/auth/profile', requireAuth, auth.profile)
api.post('/auth/password', requireAuth, auth.changePassword)

// ---- modules 示范 CRUD（list/meta/get 仅登录；写操作需 create/edit/delete 权限）----
api.get('/modules/items', requireAuth, items.list)
api.get('/modules/items/meta', requireAuth, items.meta)
api.get('/modules/items/:id', requireAuth, items.get)
api.post('/modules/items', requireAuth, canAction('create'), items.create)
api.put('/modules/items/:id', requireAuth, canAction('edit'), items.update)
api.delete('/modules/items/:id', requireAuth, canAction('delete'), items.remove)

// ---- settings ----
api.get('/settings', requireAuth, settings.get)
api.put('/settings', requireAuth, canAction('settings'), settings.update)

module.exports = api
