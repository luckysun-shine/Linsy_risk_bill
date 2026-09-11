<template>
  <div class="editor-block">
    <h3 class="section-title">{{ title }}</h3>
    <el-form label-width="110px">
      <el-form-item label="区块标题">
        <el-input v-model="model.title" />
      </el-form-item>
      <el-form-item label="平均关闭率">
        <el-input-number v-model="model.avg_close_rate" :step="0.1" />
      </el-form-item>
    </el-form>
    <el-table :data="model.departments" style="width: 100%">
      <el-table-column label="部门" min-width="130">
        <template #default="{ row }">
          <el-input v-model="row.name" />
        </template>
      </el-table-column>
      <el-table-column label="问题" width="100">
        <template #default="{ row }">
          <el-input-number v-model="row.problem" :min="0" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column label="应整改" width="100">
        <template #default="{ row }">
          <el-input-number v-model="row.should_rectify" :min="0" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column label="已关闭" width="100">
        <template #default="{ row }">
          <el-input-number v-model="row.closed" :min="0" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column label="关闭率" width="110">
        <template #default="{ row }">
          <el-input-number v-model="row.close_rate" :step="0.1" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column width="70">
        <template #default="{ $index }">
          <el-button text type="danger" @click="model.departments.splice($index, 1)">删</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      size="small"
      style="margin-top: 8px"
      @click="
        model.departments.push({
          name: '',
          problem: 0,
          should_rectify: 0,
          closed: 0,
          close_rate: 0,
        })
      "
    >
      添加部门行
    </el-button>
  </div>
</template>

<script setup lang="ts">
import type { RectificationOverviewSection } from '@/types/bill'

defineProps<{ title: string }>()
const model = defineModel<RectificationOverviewSection>({ required: true })
</script>
