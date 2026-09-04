// ============================================================
// web-console-starter backend · 服务入口
// ------------------------------------------------------------
// 职责：
//   1) 初始化 DB（建表 + 种子）
//   2) 装配：CORS / JSON / /api/v1 路由 / 前端静态(./public) + SPA 回退
//   3) 监听 PORT（读 .env）
// 运行：npm start（或 node src/server.js），从 backend/ 目录执行
// ============================================================
const path = require('node:path')
const fs = require('node:fs')
const express = require('express')
const cors = require('cors')
const cfg = require('./config')
const { initDb } = require('./db')
const { attachResHelpers } = require('./middleware/auth')
const { notFound, errorHandler } = require('./middleware/error')
const api = require('./routes')

// 1. 数据库
initDb()

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(attachResHelpers)

// 2. API
app.use('/api/v1', api)
app.use('/api', notFound) // 其余 /api/* → 404 JSON

// 3. 前端静态（vite build 输出到 backend/public）
const publicDir = path.join(__dirname, '..', 'public')
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir))
  // SPA history 回退：非 /api 的 GET 一律给 index.html
  const indexHtml = path.join(publicDir, 'index.html')
  app.get(/^\/(?!api\/).*/, (req, res) => {
    if (fs.existsSync(indexHtml)) return res.sendFile(indexHtml)
    res.fail('前端未构建：请先在 frontend/ 执行 npm run build', 503)
  })
}

app.use(notFound)
app.use(errorHandler)

const server = app.listen(cfg.port, () => {
  console.log(`[wcs] backend listening on http://127.0.0.1:${cfg.port}`)
  console.log(`[wcs] db: ${path.resolve(process.cwd(), cfg.dbPath)}`)
})

// 优雅退出
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    server.close(() => process.exit(0))
  })
}
