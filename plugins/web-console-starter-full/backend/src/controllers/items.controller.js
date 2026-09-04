// ============================================================
// web-console-starter backend · modules 示范 CRUD 控制器
// ------------------------------------------------------------
// 这就是"给 AI 看/给开发者抄的后端业务模块教科书"：
//   list(分页/筛选) / get / create / update / remove + meta
// 新业务模块：复制本文件 + 改表名/字段/校验即完成一半。
// ============================================================
const { db } = require('../db')
const { wrap } = require('../middleware/error')

const TABLE = 'sample_items'
const SEARCHABLE = ['code', 'name']
const FILTERS = ['category', 'status']

function toInt(v, d = 1) {
  const n = parseInt(v, 10)
  return Number.isFinite(n) && n > 0 ? n : d
}

// GET /modules/items?page=1&pageSize=10&keyword=&category=&status=
exports.list = wrap(async (req, res) => {
  const page = toInt(req.query.page, 1)
  const pageSize = Math.min(toInt(req.query.pageSize, 10), 200)
  const keyword = (req.query.keyword || '').trim()
  const where = []
  const params = []

  if (keyword) {
    where.push(`(${SEARCHABLE.map((c) => `${c} LIKE ?`).join(' OR ')})`)
    SEARCHABLE.forEach(() => params.push(`%${keyword}%`))
  }
  FILTERS.forEach((f) => {
    if (req.query[f]) {
      where.push(`${f} = ?`)
      params.push(String(req.query[f]))
    }
  })
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : ''

  const total = db.prepare(`SELECT COUNT(*) AS n FROM ${TABLE} ${whereSql}`).get(...params).n
  const list = db
    .prepare(`SELECT * FROM ${TABLE} ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...params, pageSize, (page - 1) * pageSize)

  res.ok({ list, total, page, pageSize })
})

// 给前端下拉用的元数据
exports.meta = wrap(async (req, res) => {
  const cats = db.prepare(`SELECT DISTINCT category FROM ${TABLE} ORDER BY category`).all().map((r) => r.category)
  const sts = db.prepare(`SELECT DISTINCT status FROM ${TABLE} ORDER BY status`).all().map((r) => r.status)
  res.ok({ categories: cats, statuses: sts })
})

exports.get = wrap(async (req, res) => {
  const row = db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`).get(Number(req.params.id))
  if (!row) return res.fail('记录不存在', 404)
  res.ok(row)
})

function validate(body) {
  if (!body.name || !String(body.name).trim()) return '名称不能为空'
  if (!body.category) return '分类不能为空'
  if (!body.status) return '状态不能为空'
  return null
}

function nextCode() {
  const max = db.prepare(`SELECT MAX(id) AS n FROM ${TABLE}`).get().n || 0
  return `S-${String(1000 + max + 1)}`
}

exports.create = wrap(async (req, res) => {
  const err = validate(req.body || {})
  if (err) return res.fail(err)
  const { name, category, status, owner = '', amount = 0, remark = '' } = req.body
  const info = db
    .prepare(`INSERT INTO ${TABLE} (code, name, category, status, owner, amount, remark) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(nextCode(), name.trim(), category, status, owner, Number(amount) || 0, remark)
  res.ok({ id: Number(info.lastInsertRowid) }, '创建成功')
})

exports.update = wrap(async (req, res) => {
  const id = Number(req.params.id)
  const old = db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`).get(id)
  if (!old) return res.fail('记录不存在', 404)
  const err = validate(req.body || {})
  if (err) return res.fail(err)
  const { name, category, status, owner = '', amount = 0, remark = '' } = req.body
  db.prepare(`UPDATE ${TABLE} SET name=?, category=?, status=?, owner=?, amount=?, remark=? WHERE id=?`).run(
    name.trim(), category, status, owner, Number(amount) || 0, remark, id
  )
  res.ok(null, '更新成功')
})

exports.remove = wrap(async (req, res) => {
  const info = db.prepare(`DELETE FROM ${TABLE} WHERE id = ?`).run(Number(req.params.id))
  if (info.changes === 0) return res.fail('记录不存在', 404)
  res.ok(null, '删除成功')
})
