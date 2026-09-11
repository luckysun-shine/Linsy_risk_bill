<template>
  <div class="page-card">
    <div class="toolbar">
      <div>
        <h2 class="section-title" style="margin-bottom: 4px">年度账单配置</h2>
        <p class="desc">统一编辑内容后，按部门发布独立浏览链接，发给对应主管。</p>
      </div>
      <el-button type="primary" @click="showCreate = true">新建配置</el-button>
    </div>

    <el-table :data="list" v-loading="loading" style="width: 100%">
      <el-table-column prop="year" label="年份" width="90" />
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column prop="status" label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="department_count" label="部门数" width="90" />
      <el-table-column label="更新时间" min-width="170">
        <template #default="{ row }">
          {{ formatTime(row.updated_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="router.push(`/campaigns/${row.id}`)">
            编辑
          </el-button>
          <el-button link type="danger" @click="onDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showCreate" title="新建年度配置" width="420px">
      <el-form label-width="80px">
        <el-form-item label="年份">
          <el-input-number v-model="createForm.year" :min="2020" :max="2100" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="createForm.title" placeholder="如：2025年度风险账单" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="onCreate">创建          创建并载入默认模板
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createCampaign, deleteCampaign, fetchCampaigns } from '@/api/campaign'
import type { CampaignSummary } from '@/types/bill'

const router = useRouter()
const list = ref<CampaignSummary[]>([])
const loading = ref(false)
const showCreate = ref(false)
const creating = ref(false)
const createForm = reactive({
  year: new Date().getFullYear(),
  title: `${new Date().getFullYear()}年度风险账单`,
})

function formatTime(value: string) {
  return new Date(value).toLocaleString()
}

async function load() {
  loading.value = true
  try {
    list.value = await fetchCampaigns()
  } finally {
    loading.value = false
  }
}

async function onCreate() {
  creating.value = true
  try {
    const data = await createCampaign({
      year: createForm.year,
      title: createForm.title,
      seed_departments: true,
    })
    ElMessage.success('已创建，默认模板已载入')
    showCreate.value = false
    await router.push(`/campaigns/${data.campaign.id}`)
  } finally {
    creating.value = false
  }
}

async function onDelete(id: string) {
  await ElMessageBox.confirm('确定删除该配置？不会自动吊销已发布链接。', '删除确认', {
    type: 'warning',
  })
  await deleteCampaign(id)
  ElMessage.success('已删除')
  await load()
}

onMounted(load)
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.desc {
  margin: 0;
  color: #667;
  font-size: 13px;
}
</style>
