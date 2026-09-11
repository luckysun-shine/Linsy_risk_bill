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
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-title">{{ title }}</div>
        <div class="header-actions">
          <span class="user">{{ auth.username }}</span>
          <el-button text type="danger" @click="onLogout">退出</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const active = computed(() => (route.path.startsWith('/campaigns') ? '/' : route.path))
const title = computed(() =>
  route.name === 'campaign-edit' ? '编辑账单内容' : '年度账单配置'
)

function onLogout() {
  auth.logout()
  router.push('/login')
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
