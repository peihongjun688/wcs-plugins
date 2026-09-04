<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="login-head">
        <div class="lh-logo">{{ cfg.logoText || 'MC' }}</div>
        <div>
          <div class="lh-t1">{{ cfg.title || '综合管理控制台' }}</div>
          <div class="lh-t2">{{ cfg.subtitle || '' }}</div>
        </div>
      </div>

      <el-form :model="form" @submit.prevent="onLogin">
        <el-form-item>
          <el-input v-model="form.username" size="large" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            size="large"
            type="password"
            show-password
            placeholder="密码"
            :prefix-icon="Lock"
            @keyup.enter="onLogin"
          />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="onLogin">
          登 录
        </el-button>
      </el-form>

      <!-- 皮肤预览（可选，app.config.skinPreview=true 时显示） -->
      <div class="skin-row" v-if="cfg.skinPreview">
        <span class="muted">皮肤预览</span>
        <el-select v-model="skinName" size="small" class="skin-sel" @change="onSkinChange">
          <el-option v-for="(label, key) in SKINS" :key="key" :label="label" :value="key" />
        </el-select>
      </div>

      <div class="login-foot">{{ cfg.defaultAccountHint || '' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import cfg from '@app'
import { authApi } from '@/api'
import { setAuth } from '@/store'
import { SKINS, resolveSkin, setSkin } from '@/app.skin'

const route = useRoute()
const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const skinName = ref(resolveSkin())

function onSkinChange(name) {
  setSkin(name) // 预览切换：写入 localStorage 后整页重载
}

async function onLogin() {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const d = await authApi.login(form.value.username, form.value.password)
    setAuth(d.token, d.user)
    ElMessage.success('登录成功')
    router.replace(route.query.redirect || '/dashboard')
  } catch (e) {
    ElMessage.error(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.login-card {
  width: 380px;
  max-width: calc(100vw - 32px); /* 窄屏自动收缩，杜绝横向溢出 */
  padding: 30px 28px 22px;
  background: var(--panel-solid);
  border: 1px solid var(--panel-bd);
  border-radius: 18px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.25);
}
.login-head { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
.lh-logo {
  width: 46px; height: 46px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 16px;
  color: var(--logo-fg);
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  box-shadow: 0 4px 18px color-mix(in srgb, var(--accent) 45%, transparent);
  flex-shrink: 0;
}
.lh-t1 { font-size: 17px; font-weight: 700; color: var(--txt-strong); }
.lh-t2 { font-size: 11px; color: var(--txt-dim); margin-top: 2px; }
.login-btn {
  width: 100%;
  letter-spacing: 4px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border: none;
  color: var(--btn-fg);
  font-weight: 700;
}
.skin-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 16px;
}
.skin-sel { width: 150px; }
.login-foot {
  margin-top: 16px; font-size: 11px; color: var(--txt-dim);
  text-align: center;
}

/* H5 移动端（≤768px）：卡片贴顶留呼吸，头部与字号微调 */
@media (max-width: 768px) {
  .login-bg { padding: 6vh 0; align-items: flex-start; }
  .login-card { padding: 24px 20px 18px; border-radius: 16px; }
  .lh-logo { width: 40px; height: 40px; font-size: 14px; }
  .lh-t1 { font-size: 15px; }
  .skin-row { margin-top: 12px; }
}
</style>
