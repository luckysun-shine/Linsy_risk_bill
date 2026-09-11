<template>
  <div class="metric-parts">
    <div v-for="(part, index) in model" :key="index" class="row">
      <el-input v-model="part.text" placeholder="文案片段" />
      <el-checkbox v-model="part.accent">高亮数字</el-checkbox>
      <el-checkbox v-if="'strong' in part || showStrong" v-model="part.strong">加粗</el-checkbox>
      <el-button text type="danger" @click="remove(index)">删除</el-button>
    </div>
    <el-button size="small" @click="add">添加片段</el-button>
  </div>
</template>

<script setup lang="ts">
import type { MetricPart } from '@/types/bill'

const model = defineModel<MetricPart[]>({ required: true })
withDefaults(defineProps<{ showStrong?: boolean }>(), { showStrong: false })

function add() {
  model.value = [...model.value, { text: '' }]
}

function remove(index: number) {
  model.value = model.value.filter((_, i) => i !== index)
}
</script>

<style scoped>
.metric-parts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 8px;
  align-items: center;
}
</style>
