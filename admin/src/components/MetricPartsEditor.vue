<template>
  <div class="metric-parts">
    <el-input
      v-model="lineText"
      type="textarea"
      :rows="2"
      placeholder="整句录入，用 [[数字]] 标记高亮，例如：覆盖率达 [[69%]]，同比增长 [[11%]]"
      @change="applyLine"
      @blur="applyLine"
    />
    <p class="hint">也可继续用下方片段精细调整。</p>
    <div v-for="(part, index) in model" :key="index" class="row">
      <el-input v-model="part.text" placeholder="文案片段" />
      <el-checkbox v-model="part.accent">高亮</el-checkbox>
      <el-checkbox v-if="'strong' in part || showStrong" v-model="part.strong">加粗</el-checkbox>
      <el-button text type="danger" @click="remove(index)">删除</el-button>
    </div>
    <el-button size="small" @click="add">添加片段</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MetricPart } from '@/types/bill'

const model = defineModel<MetricPart[]>({ required: true })
withDefaults(defineProps<{ showStrong?: boolean }>(), { showStrong: false })

const lineText = ref('')

function partsToLine(parts: MetricPart[]) {
  return parts
    .map((p) => (p.accent || p.strong ? `[[${p.text}]]` : p.text))
    .join('')
}

function parseMetricLine(text: string): MetricPart[] {
  const parts: MetricPart[] = []
  const regex = /\[\[(.+?)\]\]/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text))) {
    if (match.index > last) {
      parts.push({ text: text.slice(last, match.index) })
    }
    parts.push({ text: match[1], accent: true })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts.length ? parts : [{ text }]
}

watch(
  model,
  (val) => {
    lineText.value = partsToLine(val || [])
  },
  { deep: true, immediate: true }
)

function applyLine() {
  model.value = parseMetricLine(lineText.value)
}

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
.hint {
  margin: 0;
  color: #889;
  font-size: 12px;
}
</style>
