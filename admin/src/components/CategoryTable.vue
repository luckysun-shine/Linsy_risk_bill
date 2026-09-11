<template>
  <el-table :data="model" style="width: 100%">
    <el-table-column label="名称" min-width="140">
      <template #default="{ row }">
        <el-input v-model="row.name" />
      </template>
    </el-table-column>
    <el-table-column label="占比/数值" width="140">
      <template #default="{ row }">
        <el-input-number v-model="row.value" :step="0.01" controls-position="right" />
      </template>
    </el-table-column>
    <el-table-column label="颜色" width="140">
      <template #default="{ row }">
        <el-color-picker v-model="row.color" />
      </template>
    </el-table-column>
    <el-table-column width="70">
      <template #default="{ $index }">
        <el-button text type="danger" @click="model.splice($index, 1)">删</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button style="margin-top: 8px" size="small" @click="model.push({ name: '', value: 0 })">
    添加分类
  </el-button>
</template>

<script setup lang="ts">
import type { RiskCategoryItem } from '@/types/bill'

const model = defineModel<RiskCategoryItem[]>({ required: true })
</script>
