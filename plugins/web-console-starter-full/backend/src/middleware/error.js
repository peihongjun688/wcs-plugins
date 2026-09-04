// ============================================================
// web-console-starter backend · 统一错误处理
// ============================================================
function notFound(req, res) {
  res.fail('接口不存在: ' + req.method + ' ' + req.originalUrl, 404)
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[err]', req.method, req.originalUrl, err && err.stack || err)
  if (res.headersSent) return next(err)
  res.fail(err.message || '服务器内部错误', err.status || 500)
}

// 异步控制器包装：把 promise reject 交给 errorHandler
function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = { notFound, errorHandler, wrap }
