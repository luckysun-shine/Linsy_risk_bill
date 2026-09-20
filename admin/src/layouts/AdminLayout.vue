<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="brand">
        <div class="brand-title">风险账单</div>
        <div class="brand-sub">管理后台</div>
      </div>
      <el-menu :default-active="active" router>
        <el-menu-item index="/">
          <span>年度配置</span>
        </el-menu-item>
        <el-menu-item index="/stats">
          <span>访问统计</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <span>账号管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-title">{{ title }}</div>
        <div class="header-actions">
          <span class="user">{{ auth.username }}</span>
          <el-button text type="primary" @click="pwdVisible = true">修改密码</el-button>
          <el-button text type="danger" @click="onLogout">退出</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>

    <el-dialog v-model="pwdVisible" title="修改我的密码" width="420px">
      <el-form label-width="100px">
        <el-form-item label="当前密码" required>
          <el-input
            v-model="pwdForm.current"
            type="password"
            show-password
            autocomplete="current-password"
          />
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input
            v-model="pwdForm.next"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="确认新密码" required>
          <el-input
            v-model="pwdForm.confirm"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" :loading="pwdSaving" @click="onChangePassword">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { changeOwnPassword } from '@/api/users'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const active = computed(() => {
  if (route.path.startsWith('/users')) return '/users'
  if (route.path.startsWith('/stats')) return '/stats'
  if (route.path.startsWith('/campaigns')) return '/'
  return route.path
})

const title = computed(() => {
  if (route.name === 'campaign-edit') return '编辑账单内容'
  if (route.name === 'users') return '账号管理'
  if (route.name === 'stats') return '访问统计'
  return '年度账单配置'
})

const pwdVisible = ref(false)
const pwdSaving = ref(false)
const pwdForm = reactive({
  current: '',
  next: '',
  confirm: '',
})

function onLogout() {
  auth.logout()
  router.push('/login')
}

async function onChangePassword() {
  if (pwdForm.current.length < 6 || pwdForm.next.length < 6) {
    ElMessage.warning('密码至少 6 位')
    return
  }
  if (pwdForm.next !== pwdForm.confirm) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  pwdSaving.value = true
  try {
    await changeOwnPassword(pwdForm.current, pwdForm.next)
    ElMessage.success('密码已修改，请使用新密码登录')
    pwdVisible.value = false
    pwdForm.current = ''
    pwdForm.next = ''
    pwdForm.confirm = ''
  } finally {
    pwdSaving.value = false
  }
}
</script>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
}

.aside {
  background: #052e2c;
  color: #fff;
}

.brand {
  padding: 24px 20px 16px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
}

.brand-sub {
  margin-top: 4px;
  opacity: 0.7;
  font-size: 12px;
}

.aside :deep(.el-menu) {
  border-right: none;
  background: transparent;
}

.aside :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.85);
}

.aside :deep(.el-menu-item.is-active) {
  background: rgba(32, 178, 170, 0.22);
  color: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e8eeee;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user {
  color: #667;
  font-size: 13px;
}

.main {
  padding: 20px;
}
</style>
