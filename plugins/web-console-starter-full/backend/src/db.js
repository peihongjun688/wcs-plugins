// ============================================================
// web-console-starter backend · 数据库层（node:sqlite DatabaseSync）
// ------------------------------------------------------------
// 职责：打开 DB（建目录/WAL）→ 建表(schema) → 首启种子(seed)。
// 新增业务模块的教科书流程（照抄即可）：
//   1) schema() 里加 CREATE TABLE IF NOT EXISTS xxx ...
//   2) seed()  里加首次运行的基础/演示数据（≥5 条、可编辑）
//   3) routes/controllers 下新建 xxx 路由，挂到 routes/index.js
// 本文件可独立运行：node src/db.js（仅初始化/重建空表后退出）
// ============================================================
const { DatabaseSync } = require('node:sqlite')
const path = require('node:path')
const fs = require('node:fs')
const bcrypt = require('bcryptjs')
const cfg = require('./config')

function openDb() {
  const p = path.resolve(process.cwd(), cfg.dbPath)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  const db = new DatabaseSync(p)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA foreign_keys = ON;')
  return db
}

const db = openDb()

// ---------------- schema ----------------
function schema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      name       TEXT DEFAULT '',
      role       TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin','operator','viewer')),
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT DEFAULT ''
    );

    -- 示范业务表（modules 样例 CRUD）：新系统照此结构新增自己的业务表
    CREATE TABLE IF NOT EXISTS sample_items (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      code       TEXT NOT NULL UNIQUE,
      name       TEXT NOT NULL,
      category   TEXT NOT NULL DEFAULT '销售',
      status     TEXT NOT NULL DEFAULT '进行中',
      owner      TEXT DEFAULT '',
      amount     REAL DEFAULT 0,
      remark     TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );
  `)
}

// ---------------- seed ----------------
function seedIfEmpty() {
  const cnt = db.prepare('SELECT COUNT(*) AS n FROM users').get().n
  if (cnt === 0) {
    const ins = db.prepare('INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)')
    const mk = (u) => ins.run(u.username, bcrypt.hashSync(u.password, 10), u.name, u.role)
    mk(cfg.seeds.admin)
    mk(cfg.seeds.operator)
    mk(cfg.seeds.viewer)
    console.log(`[db] seeded users: ${cfg.seeds.admin.username}(admin) / ${cfg.seeds.operator.username}(operator) / ${cfg.seeds.viewer.username}(viewer)`)
    console.log(`[db] WARN: change default passwords via /auth/password after first login`)
  }

  const n2 = db.prepare('SELECT COUNT(*) AS n FROM sample_items').get().n
  if (n2 === 0) {
    const names = ['演示记录', '业务样本', '流程实例', '归档文档', '统计模板', '配置单据', '审批流程', '对账台账']
    const cats = ['采购', '销售', '库存', '财务', '人事']
    const sts = ['进行中', '已完成', '已暂停']
    const ins = db.prepare(
      'INSERT INTO sample_items (code, name, category, status, owner, amount, remark) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    names.forEach((nm, i) => {
      ins.run(
        `S-${String(1001 + i)}`,
        `${nm} #${i + 1}`,
        cats[i % cats.length],
        sts[i % 3],
        `演示用户${(i % 5) + 1}`,
        Math.round((1000 + i * 1377.5) * 100) / 100,
        '种子数据：可编辑（新增/编辑/删除后入库）'
      )
    })
    console.log(`[db] seeded sample_items: ${names.length} rows`)
  }

  const n3 = db.prepare('SELECT COUNT(*) AS n FROM settings').get().n
  if (n3 === 0) {
    const ins = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')
    ins.run('siteName', '综合管理控制台')
    console.log('[db] seeded settings')
  }
}

// ---------------- helpers ----------------
function initDb() {
  schema()
  seedIfEmpty()
  return db
}

// 供测试/脚本使用：直接执行并退出（node src/db.js）
if (require.main === module) {
  initDb()
  console.log('[db] init done at', cfg.dbPath)
}

module.exports = { db, initDb }
