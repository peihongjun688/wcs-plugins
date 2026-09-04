// ============================================================
// web-console-starter backend · settings 控制器
// 白名单键值设置（站点名等），仅 admin/operator 可改
// ============================================================
const { db } = require('../db')
const { wrap } = require('../middleware/error')

const WHITELIST = ['siteName']

exports.get = wrap(async (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all()
  const obj = {}
  rows.forEach((r) => { obj[r.key] = r.value })
  res.ok(obj)
})

exports.update = wrap(async (req, res) => {
  const body = req.body || {}
  const ins = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  )
  Object.keys(body).forEach((k) => {
    if (WHITELIST.includes(k)) ins.run(k, String(body[k]))
  })
  res.ok(null, '设置已保存')
})
