<template>
  <el-form label-width="90px">
    <el-form-item :label="label + '名称'">
      <el-input v-model="model.name" />
    </el-form-item>
    <el-form-item label="图标">
      <el-input v-model="model.icon" />
    </el-form-item>
    <el-form-item label="子类">
      <el-select
        v-model="model.children"
        multiple
        filterable
        allow-create
        default-first-option
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { RiskTreeCategoryNode } from '@/types/bill'

defineProps<{ label: string }>()
const model = defineModel<RiskTreeCategoryNode>({ required: true })
</script>
