<template>
  <div v-loading="loading">
    <div class="page-card toolbar">
      <div>
        <h2 class="section-title" style="margin-bottom: 4px">访问统计</h2>
        <p class="desc">
          查看已发布账单链接的打开情况。数据来自 H5 成功拉取账单时的访问记录。
        </p>
      </div>
      <el-button :loading="loading" @click="load">刷新</el-button>
    </div>

    <div class="page-card filters" style="margin-top: 16px">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="年份">
          <el-select
            v-model="filters.year"
            clearable
            placeholder="全部"
            style="width: 120px"
          >
            <el-option
              v-for="y in yearOptions"
              :key="y"
              :label="String(y)"
              :value="y"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filters.range"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="load">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="summary-row" style="margin-top: 16px">
      <div class="stat-card">
        <div class="stat-label">打开次数（PV）</div>
        <div class="stat-value">{{ stats?.totalViews ?? 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已打开链接</div>
        <div class="stat-value">
          {{ stats?.openedLinks ?? 0 }}
          <span class="stat-sub">/ {{ stats?.totalLinks ?? 0 }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">独立 IP</div>
        <div class="stat-value">{{ stats?.uniqueIps ?? 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">有访问的链接数</div>
        <div class="stat-value">{{ stats?.uniqueLinks ?? 0 }}</div>
      </div>
    </div>

    <div class="page-card" style="margin-top: 16px">
      <h3 class="section-title">按日趋势</h3>
      <div v-if="!dayBars.length" class="empty-hint">所选范围内暂无访问记录</div>
      <div v-else class="day-chart">
        <div
          v-for="item in dayBars"
          :key="item.date"
          class="day-bar-col"
          :title="`${item.date}: ${item.count} 次`"
        >
          <div class="day-bar-track">
            <div class="day-bar" :style="{ height: `${item.pct}%` }" />
          </div>
          <div class="day-count">{{ item.count }}</div>
          <div class="day-label">{{ item.short }}</div>
        </div>
      </div>
    </div>

    <div class="page-card" style="margin-top: 16px">
      <div class="table-head">
        <h3 class="section-title" style="margin-bottom: 0">各链接访问明细</h3>
        <el-radio-group v-model="linkFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="opened">已打开</el-radio-button>
          <el-radio-button label="unopened">未打开</el-radio-button>
        </el-radio-group>
      </div>
      <el-table
        :data="filteredLinks"
        style="width: 100%; margin-top: 12px"
        empty-text="暂无已发布链接"
      >
        <el-table-column label="年份" prop="year" width="80" />
        <el-table-column label="部门" min-width="140">
          <template #default="{ row }">
            {{ row.department || '—' }}
            <span v-if="row.dept_code" class="muted">（{{ row.dept_code }}）</span>
          </template>
        </el-table-column>
        <el-table-column label="接收人" min-width="120">
          <template #default="{ row }">
            {{ row.employee_name || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="所属配置" min-width="140">
          <template #default="{ row }">
            {{ row.campaign_title || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="打开次数" prop="view_count" width="100" sortable />
        <el-table-column label="独立 IP" prop="unique_ips" width="100" sortable />
        <el-table-column label="最近打开" min-width="170">
          <template #default="{ row }">
            <el-tag v-if="!row.view_count" type="info" size="small">未打开</el-tag>
            <span v-else>{{ formatTime(row.last_accessed_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="首次打开" min-width="170">
          <template #default="{ row }">
            {{ row.first_accessed_at ? formatTime(row.first_accessed_at) : '—' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.is_revoked ? 'danger' : 'success'" size="small">
              {{ row.is_revoked ? '已撤销' : '有效' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-card" style="margin-top: 16px">
      <h3 class="section-title">最近访问记录</h3>
      <el-table :data="stats?.recent ?? []" style="width: 100%" empty-text="暂无记录">
        <el-table-column label="时间" min-width="170">
          <template #default="{ row }">
            {{ formatTime(row.accessed_at) }}
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="120">
          <template #default="{ row }">
            {{ row.department || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="接收人" min-width="120">
          <template #default="{ row }">
            {{ row.employee_name || row.employee_id || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="年份" width="80">
          <template #default="{ row }">
            {{ row.year ?? '—' }}
          </template>
        </el-table-column>
        <el-table-column label="IP" min-width="130">
          <template #default="{ row }">
            {{ row.ip_address || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="设备 / 浏览器" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            {{ shortenUa(row.user_agent) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchAccessStats, type AccessStatsData } from '@/api/stats'
import { fetchCampaigns } from '@/api/campaign'

const loading = ref(false)
const stats = ref<AccessStatsData | null>(null)
const yearOptions = ref<number[]>([])
const linkFilter = ref<'all' | 'opened' | 'unopened'>('all')

const filters = reactive<{
  year?: number
  range: [string, string] | null
}>({
  year: undefined,
  range: null,
})

const filteredLinks = computed(() => {
  const list = stats.value?.byLink ?? []
  if (linkFilter.value === 'opened') return list.filter((l) => l.view_count > 0)
  if (linkFilter.value === 'unopened') return list.filter((l) => l.view_count === 0)
  return list
})

const dayBars = computed(() => {
  const days = stats.value?.byDay ?? []
  if (!days.length) return [] as Array<{ date: string; count: number; pct: number; short: string }>
  const max = Math.max(...days.map((d) => d.count), 1)
  return days.map((d) => ({
    date: d.date,
    count: d.count,
    pct: Math.max(8, Math.round((d.count / max) * 100)),
    short: d.date.slice(5),
  }))
})

function formatTime(value: string | null | undefined) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('zh-CN', { hour12: false })
}

function shortenUa(ua: string | null | undefined) {
  if (!ua) return '—'
  if (ua.length <= 64) return ua
  return `${ua.slice(0, 64)}…`
}

async function loadYears() {
  try {
    const campaigns = await fetchCampaigns()
    const years = [...new Set(campaigns.map((c) => c.year))].sort((a, b) => b - a)
    yearOptions.value = years.length ? years : [new Date().getFullYear()]
  } catch {
    yearOptions.value = [new Date().getFullYear()]
  }
}

async function load() {
  loading.value = true
  try {
    stats.value = await fetchAccessStats({
      year: filters.year,
      from: filters.range?.[0],
      to: filters.range?.[1],
    })
  } finally {
    loading.value = false
  }
}

function onReset() {
  filters.year = undefined
  filters.range = null
  linkFilter.value = 'all'
  load()
}

onMounted(async () => {
  await loadYears()
  await load()
})
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.desc {
  margin: 0;
  color: #667;
  font-size: 13px;
}

.filters :deep(.el-form-item) {
  margin-bottom: 0;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 2px rgba(10, 92, 88, 0.06);
}

.stat-label {
  font-size: 13px;
  color: #667;
}

.stat-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 700;
  color: #0a5c58;
  line-height: 1.2;
}

.stat-sub {
  font-size: 16px;
  font-weight: 500;
  color: #889;
}

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.muted {
  color: #99a;
  font-size: 12px;
}

.empty-hint {
  color: #889;
  font-size: 13px;
  padding: 12px 0;
}

.day-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-height: 140px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.day-bar-col {
  flex: 0 0 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.day-bar-track {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.day-bar {
  width: 18px;
  border-radius: 6px 6px 2px 2px;
  background: linear-gradient(180deg, #20b2aa, #0a5c58);
  min-height: 4px;
}

.day-count {
  font-size: 11px;
  color: #0a5c58;
  font-weight: 600;
}

.day-label {
  font-size: 10px;
  color: #889;
  white-space: nowrap;
}

@media (max-width: 960px) {
  .summary-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
