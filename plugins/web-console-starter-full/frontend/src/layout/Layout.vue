<template>
  <el-container class="layout">
    <!-- 侧栏：仅桌面（>768px）渲染；移动端由下方 el-drawer 抽屉承载同一份菜单 -->
    <el-aside v-if="!isMobile" width="220px" class="side">
      <div class="brand">
        <div class="logo">{{ cfg.logoText || 'MC' }}</div>
        <div class="brand-txt">
          <div class="bt1">{{ cfg.title || '综合管理控制台' }}</div>
          <div class="bt2">{{ cfg.subtitle || '' }}</div>
        </div>
      </div>

      <el-menu :default-active="active" class="menu" router>
        <el-menu-item v-for="r in menus" :key="r.path" :index="r.path">
          <el-icon><component :is="r.icon" /></el-icon>
          <span>{{ r.title }}</span>
        </el-menu-item>
      </el-menu>

      <div class="side-foot">v{{ versionText }} · web-console-starter</div>
    </el-aside>

    <el-container>
      <el-header class="top">
        <div class="top-left">
          <!-- 移动端汉堡按钮：唤起抽屉导航（仅 ≤768px 显示） -->
          <el-button v-if="isMobile" class="nav-toggle" size="small" :icon="Expand"
            circle text @click="navOpen = true" aria-label="打开菜单" />
          <el-icon class="top-ic"><component :is="routeIcon" /></el-icon>
          <span class="top-title">{{ routeTitle }}</span>
        </div>
        <div class="top-right">
          <!-- 皮肤预览（app.config.skinPreview=true 时显示）：选择即整页重载应用 -->
          <el-select
            v-if="cfg.skinPreview && !isMobile"
            v-model="skinName"
            size="small"
            class="skin-select"
            @change="onSkinChange"
          >
            <el-option v-for="(label, key) in SKINS" :key="key" :label="label" :value="key" />
          </el-select>
          <el-button size="small" :icon="Refresh" @click="onRefresh">刷新</el-button>
          <el-dropdown @command="onMenu">
            <span class="user">
              <el-icon><User /></el-icon>
              <span class="user-name">{{ user?.name || user?.username || 'admin' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main" :class="{ 'h5-main': isMobile }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <!-- H5 视觉规范 v2.0：底部 TabBar（H5 段固定渲染）-->
        <MobileTabBar v-if="isMobile" />
      </el-main>
    </el-container>

    <!-- 移动端抽屉导航：≤768px 时点击汉堡唤起；结构与侧栏一致，菜单数据同一份 -->
    <el-drawer v-model="navOpen" direction="ltr" size="240px" class="nav-drawer"
      :with-header="false" v-if="isMobile">
      <div class="brand">
        <div class="logo">{{ cfg.logoText || 'MC' }}</div>
        <div class="brand-txt">
          <div class="bt1">{{ cfg.title || '综合管理控制台' }}</div>
          <div class="bt2">{{ cfg.subtitle || '' }}</div>
        </div>
      </div>

      <el-menu :default-active="active" class="menu drawer-menu" router @select="navOpen = false">
        <el-menu-item v-for="r in menus" :key="r.path" :index="r.path">
          <el-icon><component :is="r.icon" /></el-icon>
          <span>{{ r.title }}</span>
        </el-menu-item>
      </el-menu>

      <div class="side-foot">v{{ versionText }} · web-console-starter</div>
    </el-drawer>

    <el-dialog v-model="pwdVisible" title="修改密码" width="420px" class="pwd-dialog">
      <el-form :model="pwdForm" label-width="90px">
        <el-form-item label="原密码">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="至少 6 位" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" :loading="pwdLoading" @click="onPwd">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as Icons from '@element-plus/icons-vue'
import { Refresh, User, ArrowDown, Expand } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import cfg from '@app'
import { authApi, commonApi } from '@/api'
import { auth, clearAuth } from '@/store'
import { SKINS, resolveSkin, setSkin } from '@/app.skin'
import MobileTabBar from '@/components/MobileTabBar.vue'

const route = useRoute()
const router = useRouter()

// ---- 移动端检测：≤768px 视为手机 H5（与 docs/H5移动端开发约束与指导.md 断点一致）----
const MOBILE_QUERY = '(max-width: 768px)'
const isMobile = ref(false)
const navOpen = ref(false) // 移动端抽屉导航开关
let mql = null
function syncMobile(e) {
  isMobile.value = e ? e.matches : window.matchMedia(MOBILE_QUERY).matches
  if (!isMobile.value) navOpen.value = false // 拉宽回桌面时收起抽屉
  // H5 视觉规范 v2.0：视口变化时自动切换 /dashboard ↔ /h5
  const cur = route.path
  if (isMobile.value && cur === '/dashboard') router.replace('/h5')
  else if (!isMobile.value && cur === '/h5') router.replace('/dashboard')
}

// ---- 侧栏菜单：由路由 children 的 meta{title,icon} 自动生成 ----
const menus = computed(() =>
  (router.options.routes.find((r) => r.path === '/')?.children || [])
    .map((c) => ({ path: '/' + c.path, title: c.meta.title, icon: c.meta.icon }))
    .filter((c) => c.title)
)
const active = computed(() => route.path)
const routeTitle = computed(() => route.meta.title || cfg.title || '综合管理控制台')
const routeIcon = computed(() => Icons[route.meta.icon] || Icons.DataLine)
const user = computed(() => auth.user)

// ---- 皮肤 ----
const skinName = ref(resolveSkin())
function onSkinChange(name) {
  setSkin(name) // 写入 localStorage 后整页重载
}

// ---- 版本（后端 GET /health 返回，失败时保留占位）----
const versionText = ref('1.0.0')
async function loadVersion() {
  try {
    const h = await commonApi.health()
    if (h && h.version) versionText.value = h.version
  } catch (e) { /* 公共端点失败不影响布局 */ }
}

function onRefresh() {
  location.reload()
}

// ---- 修改密码 / 退出 ----
const pwdVisible = ref(false)
const pwdLoading = ref(false)
const pwdForm = ref({ oldPassword: '', newPassword: '' })
async function onPwd() {
  if (!pwdForm.value.oldPassword || !pwdForm.value.newPassword) {
    ElMessage.warning('请填写完整')
    return
  }
  pwdLoading.value = true
  try {
    await authApi.changePassword(pwdForm.value.oldPassword, pwdForm.value.newPassword)
    ElMessage.success('密码已更新，请重新登录')
    pwdVisible.value = false
    clearAuth()
    location.assign('/login')
  } catch (e) {
    ElMessage.error(e.message || '修改失败')
  } finally {
    pwdLoading.value = false
  }
}

function onMenu(cmd) {
  if (cmd === 'pwd') pwdVisible.value = true
  if (cmd === 'logout') {
    try { authApi.logout() } catch (e) { /* noop */ }
    clearAuth()
    location.assign('/login')
  }
}

onMounted(() => {
  mql = window.matchMedia(MOBILE_QUERY)
  syncMobile(mql)
  if (mql.addEventListener) mql.addEventListener('change', syncMobile)
  else if (mql.addListener) mql.addListener(syncMobile) // 旧 Safari 兼容
  loadVersion()
})
onBeforeUnmount(() => {
  if (mql) {
    if (mql.removeEventListener) mql.removeEventListener('change', syncMobile)
    else if (mql.removeListener) mql.removeListener(syncMobile)
  }
})
</script>

<style scoped>
.layout { height: 100vh; }

/* ---- 侧栏 ---- */
.side {
  background: var(--side-bg);
  border-right: 1px solid var(--line);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
}
.brand { display: flex; align-items: center; gap: 10px; padding: 18px 16px; }
.logo {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 15px; letter-spacing: 0.5px;
  color: var(--logo-fg);
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  box-shadow: 0 4px 16px color-mix(in srgb, var(--accent) 45%, transparent);
  flex-shrink: 0;
}
.brand-txt { min-width: 0; }
.brand-txt .bt1 {
  font-size: 15px; font-weight: 700; color: var(--txt-strong);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.brand-txt .bt2 {
  font-size: 11px; color: var(--txt-dim);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* 菜单（Element Plus 默认色全部改走 token） */
.menu { border-right: none; flex: 1; background: transparent; }
.menu :deep(.el-menu-item) {
  border-radius: 8px; margin: 4px 8px; height: 44px;
  color: var(--txt-dim);
}
.menu :deep(.el-menu-item .el-icon) { color: inherit; }
.menu :deep(.el-menu-item:hover) {
  background: var(--hover-bg);
  color: var(--txt-strong);
}
.menu :deep(.el-menu-item.is-active) {
  background: var(--menu-active-bg);
  color: var(--menu-active-txt);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--menu-active-txt) 30%, transparent);
}
.side-foot {
  padding: 12px 16px; font-size: 11px; color: var(--txt-dim);
  border-top: 1px solid var(--line);
}

/* ---- 顶栏 ---- */
.top {
  display: flex; align-items: center; justify-content: space-between;
  height: 56px; padding: 0 20px;
  border-bottom: 1px solid var(--line);
  background: var(--top-bg);
  backdrop-filter: blur(8px);
}
.top-left { display: flex; align-items: center; gap: 8px; }
.top-ic { color: var(--accent); font-size: 18px; }
.top-title { font-size: 16px; font-weight: 600; color: var(--txt-strong); }
.top-right { display: flex; align-items: center; gap: 14px; }
.skin-select { width: 140px; }
.user {
  display: flex; align-items: center; gap: 6px;
  color: var(--txt-strong); cursor: pointer; font-size: 13px;
}
.user-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ---- 内容区 ---- */
.main { padding: 18px; overflow-y: auto; }

/* ---- 移动端抽屉导航（≤768px）---- */
.nav-toggle { margin-right: 2px; color: var(--txt-strong); }
.nav-drawer {
  /* 抽屉容器背景/描边已由 style.base.css 的 .el-drawer 走 --panel-solid/--panel-bd */
  display: flex;
  flex-direction: column;
}
.nav-drawer :deep(.el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
}
.nav-drawer .brand { flex-shrink: 0; }
.nav-drawer .menu { flex: 1; overflow-y: auto; }
.nav-drawer .side-foot { flex-shrink: 0; }

/* ---- H5 移动端（≤768px）：内容区收紧，避免横向溢出 ---- */
@media (max-width: 768px) {
  .top { height: 52px; padding: 0 12px; }
  .main { padding: 12px; }
  .top-title { font-size: 15px; }
  .user-name { max-width: 72px; }
}

/* ---- H5 视觉规范 v2.0：底部 TabBar 占位 ---- */
.main.h5-main { padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px)); }
</style>
