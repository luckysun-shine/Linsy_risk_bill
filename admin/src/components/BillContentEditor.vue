<template>
  <div v-if="model" class="bill-editor">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="公司公共信息" name="base">
        <p class="hint">
          这里是全公司统一内容（CEO / 各部门账单共用）。发布时各链接仅在「是否含部门聚焦」上不同；部门聚焦数据请到下方部门列表中分别配置。
        </p>
        <el-form label-width="110px" class="editor-block">
          <el-form-item label="公司">
            <el-input v-model="model.user.company" />
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="model.summary_data.keyword" />
          </el-form-item>
          <el-form-item label="风险等级">
            <el-input v-model="model.summary_data.risk_level" />
          </el-form-item>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="风险分">
                <el-input-number v-model="model.summary_data.risk_score" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="超越百分比">
                <el-input-number v-model="model.summary_data.rank_percent" :min="0" :max="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模型数">
                <el-input-number v-model="model.summary_data.total_models" :min="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="挽损金额">
            <el-input-number v-model="model.summary_data.savings" :min="0" :step="1000" />
          </el-form-item>
          <el-form-item label="BGM 路径">
            <el-input v-model="bgm" placeholder="/audio/bgm.mp3" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="封面" name="cover">
        <el-form label-width="100px">
          <el-form-item label="Headline">
            <el-input v-model="cover.headline" />
          </el-form-item>
          <el-form-item label="主标题">
            <el-input v-model="cover.title" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="cover.subtitle" />
          </el-form-item>
          <el-form-item label="问候语">
            <el-input v-model="cover.greeting" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="风险分类" name="risk_pie">
        <h3 class="section-title">风险分类占比</h3>
        <CategoryTable v-model="model.details_data.risk_categories" />
        <h3 class="section-title" style="margin-top: 20px">整改分类占比</h3>
        <CategoryTable
          v-model="rectificationCategories"
        />
      </el-tab-pane>

      <el-tab-pane label="整改概况" name="rectification">
        <template v-if="model.details_data.rectification_overview">
          <el-form label-width="120px">
            <el-form-item label="平均关闭率说明">
              <el-input
                v-model="model.details_data.rectification_overview.avg_rate_note"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-form>
          <RectSectionEditor
            v-model="model.details_data.rectification_overview.year_section"
            title="本年度整改"
          />
          <RectSectionEditor
            v-model="model.details_data.rectification_overview.history_section"
            title="历史整改"
          />
          <div class="editor-block">
            <h3 class="section-title">警示摘要</h3>
            <el-form label-width="120px">
              <el-form-item label="年份">
                <el-input-number
                  v-model="model.details_data.rectification_overview.alert.year"
                />
              </el-form-item>
              <el-form-item label="应整改总数">
                <el-input-number
                  v-model="model.details_data.rectification_overview.alert.should_rectify_total"
                />
              </el-form-item>
              <el-form-item label="已关闭">
                <el-input-number
                  v-model="model.details_data.rectification_overview.alert.closed_total"
                />
              </el-form-item>
              <el-form-item label="关闭率">
                <el-input-number
                  v-model="model.details_data.rectification_overview.alert.close_rate"
                  :step="0.1"
                />
              </el-form-item>
              <el-form-item label="挽损展示">
                <el-input
                  v-model="model.details_data.rectification_overview.alert.salvage_display"
                />
              </el-form-item>
              <el-form-item label="挽损数值">
                <el-input-number
                  v-model="model.details_data.rectification_overview.alert.salvage_amount"
                  :step="10000"
                />
              </el-form-item>
              <el-form-item label="报告日期">
                <el-input v-model="model.details_data.rectification_overview.alert.report_date" />
              </el-form-item>
              <el-form-item label="重点部门">
                <el-select
                  v-model="model.details_data.rectification_overview.alert.top_departments"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane label="合规数读" name="stats">
        <template v-if="model.details_data.compliance_education">
          <el-form label-width="80px">
            <el-form-item label="引言">
              <el-input
                v-model="model.details_data.compliance_education.intro"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </el-form>
          <div
            v-for="(item, idx) in model.details_data.compliance_education.items"
            :key="idx"
            class="editor-block"
          >
            <div class="block-head">
              <el-input v-model="item.title" placeholder="条目标题" />
              <el-button text type="danger" @click="removeComplianceItem(idx)">删除</el-button>
            </div>
            <div v-for="(para, pIdx) in item.paragraphs" :key="pIdx" class="para">
              <div class="para-head">
                <span>段落 {{ pIdx + 1 }}</span>
                <el-button text type="danger" @click="item.paragraphs.splice(pIdx, 1)">
                  删除段落
                </el-button>
              </div>
              <MetricPartsEditor v-model="item.paragraphs[pIdx]" />
            </div>
            <el-button size="small" @click="item.paragraphs.push([{ text: '' }])">
              添加段落
            </el-button>
          </div>
          <el-button
            style="margin-top: 12px"
            @click="
              model.details_data.compliance_education!.items.push({
                title: '新条目',
                paragraphs: [[{ text: '' }]],
              })
            "
          >
            添加成果条目
          </el-button>
        </template>
      </el-tab-pane>

      <el-tab-pane label="高风险阻击战" name="milestone">
        <template v-if="model.details_data.dept_battle_report">
          <el-form label-width="90px">
            <el-form-item label="副标题">
              <el-input v-model="model.details_data.dept_battle_report.subtitle" />
            </el-form-item>
          </el-form>
          <div
            v-for="(dept, idx) in model.details_data.dept_battle_report.departments"
            :key="idx"
            class="editor-block"
          >
            <el-form label-width="80px">
              <el-form-item label="部门名">
                <el-input v-model="dept.name" />
              </el-form-item>
              <el-form-item label="导语">
                <el-input v-model="dept.lead" />
              </el-form-item>
            </el-form>
            <div v-for="(line, lIdx) in dept.lines" :key="lIdx" class="para">
              <div class="para-head">
                <span>战绩行 {{ lIdx + 1 }}</span>
                <el-button text type="danger" @click="dept.lines.splice(lIdx, 1)">删除</el-button>
              </div>
              <MetricPartsEditor v-model="dept.lines[lIdx]" />
            </div>
            <el-button size="small" @click="dept.lines.push([{ text: '' }])">添加战绩行</el-button>
          </div>
          <div class="editor-block" v-if="model.details_data.dept_battle_report.tip">
            <h3 class="section-title">风控提示</h3>
            <el-form label-width="80px">
              <el-form-item label="标题">
                <el-input v-model="model.details_data.dept_battle_report.tip.title" />
              </el-form-item>
            </el-form>
            <MetricPartsEditor v-model="model.details_data.dept_battle_report.tip.body" />
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane label="重大风险" name="cluster">
        <template v-if="model.details_data.risk_report">
          <h3 class="section-title">标题句</h3>
          <MetricPartsEditor v-model="model.details_data.risk_report.headline" show-strong />
          <div
            v-for="(para, pIdx) in model.details_data.risk_report.paragraphs"
            :key="pIdx"
            class="para"
          >
            <div class="para-head">
              <span>正文段落 {{ pIdx + 1 }}</span>
              <el-button
                text
                type="danger"
                @click="model.details_data.risk_report!.paragraphs.splice(pIdx, 1)"
              >
                删除
              </el-button>
            </div>
            <MetricPartsEditor v-model="model.details_data.risk_report.paragraphs[pIdx]" />
          </div>
          <el-button
            size="small"
            @click="model.details_data.risk_report!.paragraphs.push([{ text: '' }])"
          >
            添加段落
          </el-button>
          <div class="editor-block">
            <el-form label-width="90px">
              <el-form-item label="点赞标题">
                <el-input v-model="model.details_data.risk_report.praise.title" />
              </el-form-item>
            </el-form>
            <MetricPartsEditor v-model="model.details_data.risk_report.praise.body" />
          </div>
          <div class="editor-block">
            <h3 class="section-title">收尾寄语</h3>
            <div
              v-for="(_line, idx) in model.details_data.risk_report.closing"
              :key="idx"
              class="closing-row"
            >
              <el-input
                v-model="model.details_data.risk_report.closing[idx]"
                type="textarea"
                :rows="2"
              />
              <el-button
                text
                type="danger"
                @click="model.details_data.risk_report!.closing.splice(idx, 1)"
              >
                删
              </el-button>
            </div>
            <el-button size="small" @click="model.details_data.risk_report!.closing.push('')">
              添加寄语
            </el-button>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane label="分类宣导" name="achievement">
        <template v-if="tree">
          <el-form label-width="100px">
            <el-form-item label="根标题">
              <el-input v-model="tree.rootTitle" />
            </el-form-item>
            <el-form-item label="整改标题">
              <el-input v-model="tree.rectification.title" />
            </el-form-item>
            <el-form-item label="整改图标">
              <el-input v-model="tree.rectification.icon" />
            </el-form-item>
            <el-form-item label="整改分类">
              <el-select
                v-model="tree.rectification.items"
                multiple
                filterable
                allow-create
                default-first-option
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="风险标题">
              <el-input v-model="tree.risk.title" />
            </el-form-item>
            <el-form-item label="风险图标">
              <el-input v-model="tree.risk.icon" />
            </el-form-item>
          </el-form>
          <div v-for="(col, cIdx) in tree.risk.columns" :key="cIdx" class="editor-block">
            <h4>风险列 {{ cIdx + 1 }}</h4>
            <TreeNodeEditor v-model="col.up" label="上节点" />
            <div v-if="col.down" style="margin-top: 12px">
              <TreeNodeEditor v-model="col.down" label="下节点" />
              <el-button text type="danger" @click="col.down = undefined">移除下节点</el-button>
            </div>
            <el-button
              v-else
              size="small"
              @click="col.down = { name: '', icon: '', children: [] }"
            >
              添加下节点
            </el-button>
          </div>
          <div class="editor-block">
            <TreeNodeEditor v-model="tree.risk.terminal" label="末端节点" />
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane label="分屏编排" name="pages">
        <p class="hint">
          公司公共分屏顺序。部门聚焦页会在发布时按各部门配置自动插入（CEO 等不含聚焦的部门不会插入）。
        </p>
        <el-table :data="model.page_config" style="width: 100%">
          <el-table-column label="类型" width="180">
            <template #default="{ row }">
              <el-select v-model="row.type" style="width: 160px">
                <el-option
                  v-for="t in pageTypes"
                  :key="t"
                  :label="t"
                  :value="t"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="focusId / 文案">
            <template #default="{ row }">
              <el-input
                v-if="row.type === 'dept_focus'"
                v-model="row.focusId"
                placeholder="audit / supervision / control"
              />
              <el-input
                v-else-if="row.type === 'cover'"
                v-model="row.headline"
                placeholder="封面 headline（可在封面页编辑）"
                disabled
              />
              <span v-else class="muted">—</span>
            </template>
          </el-table-column>
          <el-table-column width="160">
            <template #default="{ $index }">
              <el-button text @click="movePage($index, -1)" :disabled="$index === 0">上移</el-button>
              <el-button
                text
                @click="movePage($index, 1)"
                :disabled="$index === model.page_config.length - 1"
              >
                下移
              </el-button>
              <el-button text type="danger" @click="model.page_config.splice($index, 1)">
                删
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button style="margin-top: 12px" @click="model.page_config.push({ type: 'stats' })">
          添加分屏
        </el-button>
      </el-tab-pane>

      <el-tab-pane label="高级 JSON" name="json">
        <p class="hint">可直接编辑完整 payload；失焦后写回表单。请保持 JSON 合法。</p>
        <el-input
          v-model="jsonText"
          type="textarea"
          :rows="28"
          @blur="applyJson"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  BillData,
  CoverPageConfig,
  PageType,
  RiskCategoryItem,
} from '@/types/bill'
import MetricPartsEditor from './MetricPartsEditor.vue'
import CategoryTable from './CategoryTable.vue'
import RectSectionEditor from './RectSectionEditor.vue'
import TreeNodeEditor from './TreeNodeEditor.vue'

const model = defineModel<BillData>({ required: true })
const activeTab = ref('base')
const jsonText = ref('')

const pageTypes: PageType[] = [
  'cover',
  'risk_pie',
  'risk_rectification',
  'stats',
  'milestone',
  'dept_focus',
  'cluster',
  'achievement',
  'poster',
  'placeholder',
]

const cover = computed(() => {
  let item = model.value.page_config.find((p) => p.type === 'cover') as CoverPageConfig | undefined
  if (!item) {
    item = { type: 'cover', headline: '', title: '', subtitle: '' }
    model.value.page_config.unshift(item)
  }
  return item
})

const bgm = computed({
  get: () => model.value.assets?.bgm || '',
  set: (v: string) => {
    model.value.assets = { ...(model.value.assets || {}), bgm: v }
  },
})

const rectificationCategories = computed({
  get: () => model.value.details_data.rectification_categories || [],
  set: (v: RiskCategoryItem[]) => {
    model.value.details_data.rectification_categories = v
  },
})

const tree = computed(() => model.value.details_data.risk_classification_tree)

watch(
  model,
  (val) => {
    jsonText.value = JSON.stringify(val, null, 2)
  },
  { deep: true, immediate: true }
)

function applyJson() {
  try {
    const parsed = JSON.parse(jsonText.value) as BillData
    model.value = parsed
    ElMessage.success('JSON 已应用')
  } catch {
    ElMessage.error('JSON 格式错误，未应用')
  }
}

function removeComplianceItem(idx: number) {
  model.value.details_data.compliance_education?.items.splice(idx, 1)
}

function movePage(index: number, delta: number) {
  const list = model.value.page_config
  const target = index + delta
  if (target < 0 || target >= list.length) return
  const [item] = list.splice(index, 1)
  list.splice(target, 0, item)
}
</script>

<style scoped>
.hint {
  color: #667;
  font-size: 13px;
  margin: 0 0 12px;
}
.block-head,
.para-head,
.closing-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.para {
  margin: 12px 0;
  padding: 12px;
  background: #f7fbfb;
  border-radius: 8px;
}
.muted {
  color: #99a;
}
</style>
