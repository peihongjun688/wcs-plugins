// ============================================================
// web-console-starter backend · 配置读取（.env + 默认值）
// ============================================================
require('dotenv').config()

function int(v, d) {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : d
}

module.exports = {
  port: int(process.env.PORT, 3000),
  dbPath: process.env.DB_PATH || './data/app.db',
  jwtSecret: process.env.JWT_SECRET || 'insecure_dev_secret_change_me',
  tokenTtl: process.env.TOKEN_TTL || '12h',
  seeds: {
    admin: { username: process.env.SEED_ADMIN_USER || 'admin', password: process.env.SEED_ADMIN_PASS || 'admin123', name: '系统管理员', role: 'admin' },
    operator: { username: process.env.SEED_OPERATOR_USER || 'operator', password: process.env.SEED_OPERATOR_PASS || 'op123456', name: '业务操作员', role: 'operator' },
    viewer: { username: process.env.SEED_VIEWER_USER || 'viewer', password: process.env.SEED_VIEWER_PASS || 'view123456', name: '只读观察员', role: 'viewer' },
  },
}
