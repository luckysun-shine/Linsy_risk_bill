<template>
  <div>
    <div v-for="(report, idx) in model" :key="report.id + idx" class="editor-block">
      <div class="block-head">
        <strong>聚焦页 {{ idx + 1 }}</strong>
        <el-button text type="danger" @click="model.splice(idx, 1)">删除此页</el-button>
      </div>
      <el-form label-width="90px">
        <el-form-item label="ID">
          <el-input v-model="report.id" placeholder="audit / supervision / control" />
        </el-form-item>
        <el-form-item label="眉题">
          <el-input v-model="report.eyebrow" />
        </el-form-item>
        <el-form-item label="部门名">
          <el-input v-model="report.department" />
        </el-form-item>
        <el-form-item label="提示标题">
          <el-input v-model="report.tipTitle" placeholder="风控提示" />
        </el-form-item>
        <el-form-item label="提示正文">
          <el-input v-model="report.tip" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div v-for="(line, lIdx) in report.metrics" :key="lIdx" class="para">
        <div class="para-head">
          <span>指标行 {{ lIdx + 1 }}</span>
          <el-button text type="danger" @click="removeMetric(report, lIdx)">删除</el-button>
        </div>
        <MetricPartsEditor v-model="report.metrics[lIdx]" />
      </div>
      <el-button size="small" @click="addMetric(report)">添加指标行</el-button>
    </div>
    <el-button style="margin-top: 12px" @click="addReport">新增聚焦页</el-button>
  </div>
</template>

<script setup lang="ts">
import type { DeptFocusReport } from '@/types/bill'
import MetricPartsEditor from './MetricPartsEditor.vue'

const model = defineModel<DeptFocusReport[]>({ required: true })

function ensureMetrics(report: DeptFocusReport) {
  if (!Array.isArray(report.metrics)) report.metrics = []
}

function addMetric(report: DeptFocusReport) {
  ensureMetrics(report)
  report.metrics.push([{ text: '' }])
}

function removeMetric(report: DeptFocusReport, index: number) {
  ensureMetrics(report)
  report.metrics.splice(index, 1)
}

function addReport() {
  model.value.push({
    id: `focus_${model.value.length + 1}`,
    eyebrow: '在过去一年中',
    department: model.value[0]?.department || '',
    metrics: [[{ text: '' }, { text: '0', accent: true }, { text: '' }]],
    tip: '',
    tipTitle: '风控提示',
  })
}
</script>

<style scoped>
.editor-block {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8eeee;
}
.block-head,
.para-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.para {
  margin: 12px 0;
  padding: 12px;
  background: #f7fbfb;
  border-radius: 8px;
}
</style>
