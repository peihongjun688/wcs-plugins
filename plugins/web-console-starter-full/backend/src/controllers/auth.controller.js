// ============================================================
// web-console-starter backend · auth 控制器
// login / profile / password / logout
// ============================================================
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cfg = require('../config')
const { db } = require('../db')
const { wrap } = require('../middleware/error')

function sign(user) {
  return jwt.sign(
    { id: user.id, username: user.username, name: user.name, role: user.role },
    cfg.jwtSecret,
    { expiresIn: cfg.tokenTtl }
  )
}

function publicUser(u) {
  return { id: u.id, username: u.username, name: u.name, role: u.role }
}

exports.login = wrap(async (req, res) => {
  const { username = '', password = '' } = req.body || {}
  if (!username || !password) return res.fail('请输入用户名和密码')
  const u = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim())
  if (!u) return res.fail('用户名或密码错误', 401)
  const pass = await bcrypt.compare(password, u.password)
  if (!pass) return res.fail('用户名或密码错误', 401)
  res.ok({ token: sign(u), user: publicUser(u) })
})

exports.profile = wrap(async (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!u) return res.fail('用户不存在', 404)
  res.ok(publicUser(u))
})

exports.changePassword = wrap(async (req, res) => {
  const { oldPassword = '', newPassword = '' } = req.body || {}
  if (!oldPassword || !newPassword) return res.fail('请填写原密码和新密码')
  if (newPassword.length < 6) return res.fail('新密码至少 6 位')
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  const pass = await bcrypt.compare(oldPassword, u.password)
  if (!pass) return res.fail('原密码不正确')
  const hash = await bcrypt.hash(newPassword, 10)
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, u.id)
  res.ok(null, '密码已更新')
})

exports.logout = wrap(async (req, res) => {
  // 无状态 JWT：登出由前端清 token 完成
  res.ok(null, '已退出')
})
