import * as echarts from 'echarts/core'
import { BarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  PieChart,
  RadarChart,
  ScatterChart,
  BarChart,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
  GridComponent,
  CanvasRenderer,
])

export { echarts }
export type { ECharts } from 'echarts/core'

