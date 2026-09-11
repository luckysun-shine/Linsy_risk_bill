<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <h1>林氏风险账单管理后台</h1>
      <p class="hint">统一配置年度内容，按部门生成浏览链接</p>
      <el-form :model="form" @submit.prevent="onSubmit">
        <el-form-item label="账号">
          <el-input v-model="form.username" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            autocomplete="current-password"
          />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: '',
})

async function onSubmit() {
  loading.value = true
  try {
    await auth.login(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  } catch {
    /* interceptor handles toast */
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(64, 224, 208, 0.25), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(32, 178, 170, 0.2), transparent 35%),
    linear-gradient(160deg, #041f24, #0a3d42 55%, #052e2c);
}

.login-card {
  width: min(420px, 92vw);
  border-radius: 16px;
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #052e2c;
}

.hint {
  margin: 0 0 24px;
  color: #667;
  font-size: 13px;
}
</style>
