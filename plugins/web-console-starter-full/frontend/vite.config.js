import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { writeFileSync, mkdirSync } from 'node:fs'

// 读根目录 app.config.js（缺省用内置默认值，避免模板未初始化即崩）
let appCfg = { apiBase: '/api/v1', devProxyTarget: 'http://127.0.0.1:3000', devPort: 5180 }
try {
  const { pathToFileURL } = await import('node:url')
  const mod = await import(pathToFileURL(fileURLToPath(new URL('../app.config.js', import.meta.url))).href)
  appCfg = Object.assign(appCfg, mod.default || {})
} catch (e) {
  console.warn('[vite] app.config.js 读取失败或不存在，使用默认值：', e.message)
}

const BUILD_TIME = Date.now()

function writeBuildInfo() {
  return {
    name: 'write-build-info',
    closeBundle() {
      const p = fileURLToPath(new URL('../backend/public/buildinfo.json', import.meta.url))
      mkdirSync(fileURLToPath(new URL('../backend/public', import.meta.url)), { recursive: true })
      writeFileSync(p, JSON.stringify({ build: BUILD_TIME }))
    },
  }
}

export default defineConfig({
  plugins: [vue(), writeBuildInfo()],
  define: { __APP_BUILD__: JSON.stringify(BUILD_TIME) },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app': fileURLToPath(new URL('../app.config.js', import.meta.url)),
    },
  },
  base: '/',
  build: {
    outDir: '../backend/public',
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: appCfg.devPort || 5180,
    proxy: { [appCfg.apiBase || '/api']: appCfg.devProxyTarget || 'http://127.0.0.1:9530' },
  },
})
