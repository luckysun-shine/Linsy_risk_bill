<template>
  <div v-loading="loading">
    <div class="page-card toolbar">
      <div>
        <el-button text @click="router.push('/')">← 返回列表</el-button>
        <h2 class="section-title" style="margin: 8px 0 4px">{{ title }}</h2>
        <el-tag :type="status === 'published' ? 'success' : 'info'" size="small">
          {{ status === 'published' ? '已发布' : '草稿' }}
        </el-tag>
      </div>
      <div class="actions">
        <el-button @click="downloadImportTemplate">下载导入模板</el-button>
        <el-upload
          :show-file-list="false"
          accept=".xlsx,.xls"
          :before-upload="onImportExcel"
        >
          <el-button>上传表格填报</el-button>
        </el-upload>
        <el-button :loading="saving" @click="onSave">保存</el-button>
        <el-button type="primary" :loading="publishing" @click="onPublish">
          保存并发布部门链接
        </el-button>
      </div>
    </div>

    <div class="page-card" style="margin-top: 16px">
      <el-form inline>
        <el-form-item label="配置标题">
          <el-input v-model="title" style="width: 280px" />
        </el-form-item>
        <el-form-item label="年份">
          <el-tag>{{ year }}</el-tag>
        </el-form-item>
      </el-form>
      <p class="hint">
        公司公共内容对所有部门链接一致；仅「部门聚焦」三页因部门而异。CEO
        等可不含聚焦页。
      </p>
    </div>

    <div class="page-card" style="margin-top: 16px" v-if="payload">
      <h3 class="section-title">公司公共内容（全员一致）</h3>
      <BillContentEditor v-model="payload" />
    </div>

    <div class="page-card" style="margin-top: 16px">
      <div class="dept-head">
        <h3 class="section-title" style="margin-bottom: 0">接收部门与链接</h3>
        <el-button size="small" @click="addDepartment">新增部门</el-button>
      </div>
      <p class="hint">
        例如：CEO（不含部门聚焦）、财经中心 / 产品中心（各自配置聚焦三页数据）。
        <b>仅「部门聚焦」会不同</b>，封面到阻击战等公司公共页本来就相同。
        修改后需点「保存并发布部门链接」才会更新已生成的链接内容。
      </p>
      <el-table :data="departments" style="width: 100%">
        <el-table-column label="编码" width="130">
          <template #default="{ row }">
            <el-input
              v-model="row.dept_code"
              placeholder="product"
              @change="() => onDeptIdentityChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="部门名称" min-width="130">
          <template #default="{ row }">
            <el-input
              v-model="row.dept_name"
              placeholder="产品中心"
              @change="() => onDeptIdentityChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="接收称呼" min-width="130">
          <template #default="{ row }">
            <el-input v-model="row.recipient_name" placeholder="账单中展示称呼" />
          </template>
        </el-table-column>
        <el-table-column label="含部门聚焦" width="120">
          <template #default="{ row }">
            <el-switch
              :model-value="isIncludeFocus(row)"
              @change="(v: boolean) => setIncludeFocus(row, v)"
            />
          </template>
        </el-table-column>
        <el-table-column label="账单结构" min-width="160">
          <template #default="{ row }">
            <el-tag size="small" :type="isIncludeFocus(row) ? 'success' : 'info'">
              {{ billStructureLabel(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="聚焦数据" width="130">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              :disabled="!isIncludeFocus(row)"
              @click="openFocusEditor(row)"
            >
              编辑聚焦
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="浏览链接" min-width="220">
          <template #default="{ row }">
            <div v-if="row.url" class="url-cell">
              <el-link :href="row.url" target="_blank" type="primary">打开</el-link>
              <el-button link type="primary" @click="copyUrl(row.url!)">复制</el-button>
            </div>
            <span v-else class="muted">未发布</span>
          </template>
        </el-table-column>
        <el-table-column width="70">
          <template #default="{ $index }">
            <el-button text type="danger" @click="departments.splice($index, 1)">删</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="focusDialog"
      :title="`部门聚焦 — ${focusTarget?.dept_name || ''}`"
      width="860px"
      top="5vh"
    >
      <p class="hint">为该部门配置审计 / 监察 / 内控三页（也可增删页）。</p>
      <DeptFocusEditor v-if="focusReports" v-model="focusReports" />
      <template #footer>
        <el-button @click="loadFocusTemplate">载入默认三页模板</el-button>
        <el-button @click="focusDialog = false">取消</el-button>
        <el-button type="primary" @click="applyFocusEditor">保存聚焦数据</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="publishDialog" title="发布结果" width="720px">
      <el-table :data="publishResults" style="width: 100%">
        <el-table-column prop="dept_name" label="部门" width="140" />
        <el-table-column prop="url" label="链接" min-width="280" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="copyUrl(row.url)">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BillContentEditor from '@/components/BillContentEditor.vue'
import DeptFocusEditor from '@/components/DeptFocusEditor.vue'
import { fetchCampaign, publishCampaign, saveCampaign } from '@/api/campaign'
import api from '@/api/client'
import type { BillData, CampaignDepartment, DeptFocusReport } from '@/types/bill'
import {
  applySharedPatch,
  downloadImportTemplate,
  parseImportExcel,
} from '@/utils/excelImport'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const publishing = ref(false)
const title = ref('')
const year = ref(2025)
const status = ref<'draft' | 'published'>('draft')
const payload = ref<BillData | null>(null)
const departments = ref<CampaignDepartment[]>([])
const focusDialog = ref(false)
const focusTarget = ref<CampaignDepartment | null>(null)
const focusReports = ref<DeptFocusReport[] | null>(null)
const publishDialog = ref(false)
const publishResults = ref<Array<{ dept_name: string; url: string }>>([])

function getOverrides(row: CampaignDepartment) {
  return (row.overrides || {}) as {
    include_dept_focus?: boolean
    details_data?: { dept_focus_reports?: DeptFocusReport[] }
  }
}

function isIncludeFocus(row: CampaignDepartment) {
  const o = getOverrides(row)
  return (
    o.include_dept_focus === true ||
    (o.details_data?.dept_focus_reports?.length ?? 0) > 0
  )
}

function isCeoLike(row: CampaignDepartment) {
  const text = `${row.dept_code || ''} ${row.dept_name || ''}`.toLowerCase()
  return /(^|[^a-z])ceo([^a-z]|$)/i.test(text) || row.dept_name.includes('总裁')
}

function billStructureLabel(row: CampaignDepartment) {
  if (isIncludeFocus(row)) {
    const count = getOverrides(row).details_data?.dept_focus_reports?.length || 3
    return `公共页 + 聚焦${count}页`
  }
  return '仅公共页（无聚焦）'
}

function onDeptIdentityChange(row: CampaignDepartment) {
  if (isCeoLike(row) && isIncludeFocus(row)) {
    setIncludeFocus(row, false)
    ElMessage.info('已按 CEO/组织视角自动关闭「部门聚焦」')
  }
}

function setIncludeFocus(row: CampaignDepartment, value: boolean) {
  const o = getOverrides(row)
  if (value) {
    row.overrides = {
      ...o,
      include_dept_focus: true,
      details_data: {
        dept_focus_reports:
          o.details_data?.dept_focus_reports?.length
            ? o.details_data.dept_focus_reports
            : createEmptyFocus(row.dept_name),
      },
    }
  } else {
    row.overrides = { include_dept_focus: false }
  }
}

function createEmptyFocus(department: string): DeptFocusReport[] {
  return [
    {
      id: 'audit',
      eyebrow: '在过去一年中',
      department,
      tipTitle: '风控提示',
      tip: '',
      metrics: [[{ text: '参与完成审计项目 ' }, { text: '0', accent: true }, { text: ' 起' }]],
    },
    {
      id: 'supervision',
      eyebrow: '在过去一年中',
      department,
      tipTitle: '风控提示',
      tip: '',
      metrics: [[{ text: '涉及监察事项 ' }, { text: '0', accent: true }, { text: ' 起' }]],
    },
    {
      id: 'control',
      eyebrow: '在过去一年中',
      department,
      tipTitle: '风控提示',
      tip: '',
      metrics: [[{ text: '参与完成内控项目 ' }, { text: '0', accent: true }, { text: ' 起' }]],
    },
  ]
}

async function load() {
  loading.value = true
  try {
    const id = String(route.params.id)
    const data = await fetchCampaign(id)
    title.value = data.campaign.title
    year.value = data.campaign.year
    status.value = data.campaign.status
    payload.value = data.campaign.base_payload
    departments.value = data.departments.map((d, index) => ({
      ...d,
      role_key: d.role_key || 'manager',
      sort_order: d.sort_order ?? index,
      overrides: d.overrides || { include_dept_focus: false },
    }))
  } finally {
    loading.value = false
  }
}

function addDepartment() {
  const name = `新部门${departments.value.length + 1}`
  departments.value.push({
    dept_code: `dept_${departments.value.length + 1}`,
    dept_name: name,
    recipient_name: name,
    role_key: 'manager',
    sort_order: departments.value.length,
    overrides: {
      include_dept_focus: true,
      details_data: { dept_focus_reports: createEmptyFocus(name) },
    },
  })
}

function openFocusEditor(row: CampaignDepartment) {
  focusTarget.value = row
  const reports = getOverrides(row).details_data?.dept_focus_reports
  focusReports.value = structuredClone(reports?.length ? reports : createEmptyFocus(row.dept_name))
  focusDialog.value = true
}

async function loadFocusTemplate() {
  if (!focusTarget.value) return
  const { data } = await api.get('/admin/campaigns/templates/dept-focus', {
    params: { department: focusTarget.value.dept_name },
  })
  focusReports.value = data.data as DeptFocusReport[]
  ElMessage.success('已载入默认三页模板，可继续修改')
}

function applyFocusEditor() {
  if (!focusTarget.value || !focusReports.value) return
  const deptName = focusTarget.value.dept_name
  focusTarget.value.overrides = {
    include_dept_focus: true,
    details_data: {
      dept_focus_reports: focusReports.value.map((r) => ({
        ...r,
        department: deptName,
      })),
    },
  }
  focusDialog.value = false
  ElMessage.success('部门聚焦已更新（记得点保存）')
}

async function copyUrl(url: string) {
  await navigator.clipboard.writeText(url)
  ElMessage.success('已复制链接')
}

function departmentPayload() {
  return departments.value.map((d, index) => ({
    dept_code: d.dept_code.trim(),
    dept_name: d.dept_name.trim(),
    recipient_name: d.recipient_name || null,
    role_key: d.role_key || 'manager',
    sort_order: index,
    overrides: d.overrides || { include_dept_focus: false },
  }))
}

async function onSave() {
  if (!payload.value) return
  saving.value = true
  try {
    await saveCampaign(String(route.params.id), {
      title: title.value,
      base_payload: payload.value,
      departments: departmentPayload(),
    })
    ElMessage.success('配置已保存。若要更新已有链接内容，请再点「保存并发布部门链接」')
    await load()
  } finally {
    saving.value = false
  }
}

async function onPublish() {
  if (!payload.value) return
  publishing.value = true
  try {
    await saveCampaign(String(route.params.id), {
      title: title.value,
      base_payload: payload.value,
      departments: departmentPayload(),
    })
    const result = await publishCampaign(String(route.params.id))
    publishResults.value = result.results
    publishDialog.value = true
    ElMessage.success('已为各部门生成/更新链接')
    await load()
  } finally {
    publishing.value = false
  }
}

async function onImportExcel(file: File) {
  if (!payload.value) return false
  try {
    const { sharedPatch, departments: importedDepts } = await parseImportExcel(file)
    payload.value = applySharedPatch(payload.value, sharedPatch)
    if (importedDepts.length) {
      departments.value = importedDepts
    }
    ElMessage.success('表格已导入到表单，请检查后保存/发布')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '表格解析失败')
  }
  return false
}

onMounted(load)
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}
.dept-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.hint {
  color: #667;
  font-size: 13px;
  margin: 0 0 12px;
}
.url-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}
.muted {
  color: #99a;
}
</style>
