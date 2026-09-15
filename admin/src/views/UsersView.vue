<template>
  <div v-loading="loading">
    <div class="page-card toolbar">
      <div>
        <h2 class="section-title" style="margin-bottom: 4px">账号管理</h2>
        <p class="desc">管理后台登录账号：创建、停用、重置密码。</p>
      </div>
      <el-button type="primary" @click="openCreate">新建账号</el-button>
    </div>

    <div class="page-card" style="margin-top: 16px">
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180">
          <template #default="{ row }">
            {{ row.email || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="row.role === 'admin' ? 'success' : 'info'">
              {{ row.role === 'admin' ? '管理员' : 'API 客户端' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              :model-value="row.is_active"
              :disabled="row.username === auth.username"
              @change="(v: boolean) => onToggleActive(row, v)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openReset(row)">重置密码</el-button>
            <el-button
              link
              type="danger"
              :disabled="row.username === auth.username"
              @click="onDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="createVisible" title="新建账号" width="440px">
      <el-form label-width="90px">
        <el-form-item label="用户名" required>
          <el-input v-model="createForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="初始密码" required>
          <el-input
            v-model="createForm.password"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="createForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="createForm.role" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="API 客户端" value="api_client" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onCreate">创建</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="resetVisible" title="重置密码" width="420px">
      <p class="hint">为账号 <b>{{ resetTarget?.username }}</b> 设置新密码</p>
      <el-form label-width="90px">
        <el-form-item label="新密码" required>
          <el-input
            v-model="resetPassword"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onReset">确认重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createUser,
  deleteUser,
  fetchUsers,
  resetUserPassword,
  updateUser,
  type AdminUser,
} from '@/api/users'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const users = ref<AdminUser[]>([])

const createVisible = ref(false)
const createForm = reactive({
  username: '',
  password: '',
  email: '',
  role: 'admin' as 'admin' | 'api_client',
})

const resetVisible = ref(false)
const resetTarget = ref<AdminUser | null>(null)
const resetPassword = ref('')

function formatTime(value: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('zh-CN', { hour12: false })
}

async function load() {
  loading.value = true
  try {
    users.value = await fetchUsers()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  createForm.username = ''
  createForm.password = ''
  createForm.email = ''
  createForm.role = 'admin'
  createVisible.value = true
}

async function onCreate() {
  if (!createForm.username.trim() || createForm.password.length < 6) {
    ElMessage.warning('请填写用户名，且密码至少 6 位')
    return
  }
  saving.value = true
  try {
    await createUser({
      username: createForm.username.trim(),
      password: createForm.password,
      email: createForm.email.trim() || null,
      role: createForm.role,
    })
    ElMessage.success('账号已创建')
    createVisible.value = false
    await load()
  } finally {
    saving.value = false
  }
}

function openReset(row: AdminUser) {
  resetTarget.value = row
  resetPassword.value = ''
  resetVisible.value = true
}

async function onReset() {
  if (!resetTarget.value) return
  if (resetPassword.value.length < 6) {
    ElMessage.warning('新密码至少 6 位')
    return
  }
  saving.value = true
  try {
    await resetUserPassword(resetTarget.value.id, resetPassword.value)
    ElMessage.success('密码已重置')
    resetVisible.value = false
  } finally {
    saving.value = false
  }
}

async function onToggleActive(row: AdminUser, value: boolean) {
  try {
    await updateUser(row.id, { is_active: value })
    row.is_active = value
    ElMessage.success(value ? '已启用' : '已停用')
  } catch {
    /* interceptor handles */
  }
}

async function onDelete(row: AdminUser) {
  await ElMessageBox.confirm(
    `确定删除账号「${row.username}」？此操作不可恢复。`,
    '删除确认',
    { type: 'warning' }
  )
  await deleteUser(row.id)
  ElMessage.success('账号已删除')
  await load()
}

onMounted(load)
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.desc,
.hint {
  margin: 0;
  color: #667;
  font-size: 13px;
}
</style>
