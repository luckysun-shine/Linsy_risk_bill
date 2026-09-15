<template>
  <div v-if="model" class="bill-editor">
    <aside class="nav">
      <div class="nav-title">按 H5 分屏编辑</div>
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        class="nav-item"
        :class="{ active: activeTab === item.key }"
        @click="activeTab = item.key"
      >
        <span class="nav-label">{{ item.label }}</span>
        <span class="nav-sub">{{ item.sub }}</span>
      </button>
    </aside>

    <section class="panel">
      <div v-show="activeTab === 'base'" class="pane">
        <h3 class="pane-title">公司公共信息</h3>
        <p class="hint">
          全公司统一内容。部门差异仅在下方「接收部门」中的「部门聚焦」配置。
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
      </div>

      <div v-show="activeTab === 'cover'" class="pane">
        <h3 class="pane-title">封面 Cover</h3>
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
      </div>

      <div v-show="activeTab === 'risk_pie'" class="pane">
        <h3 class="pane-title">风险分类 Risk Pie</h3>
        <h4 class="section-title">风险分类占比</h4>
        <CategoryTable v-model="model.details_data.risk_categories" />
        <h4 class="section-title" style="margin-top: 20px">整改分类占比</h4>
        <CategoryTable v-model="rectificationCategories" />
      </div>

      <div v-show="activeTab === 'rectification'" class="pane">
        <h3 class="pane-title">整改概况 Rectification</h3>
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
            <h4 class="section-title">警示摘要</h4>
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
      </div>

      <div v-show="activeTab === 'stats'" class="pane">
        <h3 class="pane-title">合规数读 Stats</h3>
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
      </div>

      <div v-show="activeTab === 'milestone'" class="pane">
        <h3 class="pane-title">高风险阻击战 Milestone</h3>
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
            <h4 class="section-title">风控提示</h4>
            <el-form label-width="80px">
              <el-form-item label="标题">
                <el-input v-model="model.details_data.dept_battle_report.tip.title" />
              </el-form-item>
            </el-form>
            <MetricPartsEditor v-model="model.details_data.dept_battle_report.tip.body" />
          </div>
        </template>
      </div>

      <div v-show="activeTab === 'cluster'" class="pane">
        <h3 class="pane-title">重大风险 Cluster</h3>
        <template v-if="model.details_data.risk_report">
          <h4 class="section-title">标题句</h4>
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
            <h4 class="section-title">收尾寄语</h4>
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
      </div>

      <div v-show="activeTab === 'achievement'" class="pane">
        <h3 class="pane-title">风控分类宣导 Achievement</h3>
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
      </div>

      <div v-show="activeTab === 'pages'" class="pane">
        <h3 class="pane-title">分屏编排</h3>
        <p class="hint">
          公司公共分屏顺序。部门聚焦页会在发布时按各部门配置自动插入。
        </p>
        <el-table :data="model.page_config" style="width: 100%">
          <el-table-column label="类型" width="180">
            <template #default="{ row }">
              <el-select v-model="row.type" style="width: 160px">
                <el-option v-for="t in pageTypes" :key="t" :label="t" :value="t" />
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
                placeholder="封面 headline"
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
      </div>

      <div v-show="activeTab === 'json'" class="pane">
        <h3 class="pane-title">高级 JSON</h3>
        <p class="hint">可直接编辑完整 payload；失焦后写回表单。请保持 JSON 合法。</p>
        <el-input v-model="jsonText" type="textarea" :rows="28" @blur="applyJson" />
      </div>
    </section>
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
const activeTab = ref('cover')
const jsonText = ref('')

const navItems = [
  { key: 'cover', label: '封面', sub: 'Cover' },
  { key: 'risk_pie', label: '风险分类', sub: 'Risk Pie' },
  { key: 'rectification', label: '整改概况', sub: 'Rectification' },
  { key: 'stats', label: '合规数读', sub: 'Stats' },
  { key: 'milestone', label: '高风险阻击战', sub: 'Milestone' },
  { key: 'cluster', label: '重大风险', sub: 'Cluster' },
  { key: 'achievement', label: '分类宣导', sub: 'Achievement' },
  { key: 'base', label: '公共摘要', sub: 'Summary' },
  { key: 'pages', label: '分屏编排', sub: 'Pages' },
  { key: 'json', label: '高级 JSON', sub: 'Debug' },
]

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
.bill-editor {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 0;
  min-height: 560px;
  border: 1px solid #e2eceb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.nav {
  background: #f4fafa;
  border-right: 1px solid #e2eceb;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-title {
  font-size: 12px;
  color: #6a8080;
  padding: 4px 10px 10px;
  font-weight: 700;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  border: none;
  background: transparent;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  text-align: left;
  color: #234;
  transition: background 0.15s ease;
}

.nav-item:hover {
  background: rgba(20, 143, 136, 0.08);
}

.nav-item.active {
  background: rgba(20, 143, 136, 0.16);
  color: #0a5c58;
}

.nav-label {
  font-size: 13px;
  font-weight: 700;
}

.nav-sub {
  font-size: 11px;
  color: #7a9090;
}

.panel {
  padding: 16px 18px 20px;
  overflow: auto;
  max-height: 72vh;
}

.pane-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 800;
  color: #0a3d42;
}

.hint {
  color: #667;
  font-size: 13px;
  margin: 0 0 12px;
}

.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
}

.editor-block {
  margin: 14px 0;
  padding: 12px;
  background: #f7fbfb;
  border-radius: 10px;
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

@media (max-width: 900px) {
  .bill-editor {
    grid-template-columns: 1fr;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid #e2eceb;
  }
}
</style>
