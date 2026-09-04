// ============================================================
// web-console-starter · 路由骨架（通用版）
// ------------------------------------------------------------
// 本文件只提供"骨架 + 登录守卫 + meta{title,icon} 约定"。
// 新系统开发时按 AI-GUIDE.md 的指引，将下方 4 个示范业务路由
// （dashboard/crud/trend/detail/settings）替换/增删成自己的模块即可：
//   { path: '模块', name: '模块', component: () => import('@/views/Xxx.vue'),
//     meta: { title: '菜单名', icon: 'ElementPlus图标名' } }
// 图标名取自 @element-plus/icons-vue，注册后可直接以字符串使用。
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/store'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/dashboard',
    children: [
      // ▼▼▼ 示范业务路由（AI-GUIDE 第 3 步：按模板替换成自己的模块）▼▼▼
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '总览', icon: 'DataLine' } },
      { path: 'crud', name: 'crud', component: () => import('@/views/CrudPage.vue'), meta: { title: '数据管理', icon: 'Coin' } },
      { path: 'trend', name: 'trend', component: () => import('@/views/TrendPage.vue'), meta: { title: '趋势分析', icon: 'TrendCharts' } },
      { path: 'detail', name: 'detail', component: () => import('@/views/DetailPage.vue'), meta: { title: '明细台账', icon: 'Document' } },
      { path: 'settings', name: 'settings', component: () => import('@/views/SettingsPage.vue'), meta: { title: '系统设置', icon: 'Setting' } },
      // H5 视觉规范 v2.0：H5 专属总览（底部 TabBar + 玻璃卡 + 彩色图标）
      { path: 'h5', name: 'h5', component: () => import('@/views/HDashboard.vue'), meta: { title: '总览', icon: 'DataLine', h5Only: true } },
      // ▲▲▲ 示范业务路由（结束）▲▲▲
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 登录守卫：未登录只能进 public 页；已登录访问 /login 则回首页
router.beforeEach((to) => {
  const token = auth.token
  if (!to.meta.public && !token) return { path: '/login', query: { redirect: to.fullPath } }
  if (to.path === '/login' && token) return { path: '/dashboard' }
  return true
})

export default router
