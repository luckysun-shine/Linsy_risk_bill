import type { DeptBattleReportData } from '@/types/bill'

/** 高风险阻击战 — 监察 / 审计 / 内控 年度战绩 */
export const mockDeptBattleReport: DeptBattleReportData = {
  subtitle: '监察 · 审计 · 内控，三线协同守住底线',
  departments: [
    {
      name: '监察部',
      lead: '监察部在过去的一年里',
      lines: [
        [
          { text: '发起了监察案件 ' },
          { text: '78', accent: true },
          { text: ' 起' },
        ],
        [
          { text: '共向违规员工发出红牌 ' },
          { text: '8', accent: true },
          { text: ' 张，黄牌 ' },
          { text: '1', accent: true },
          { text: ' 张，蓝牌 ' },
          { text: '3', accent: true },
          { text: ' 张' },
        ],
        [
          { text: '涉及违规合作商累计 ' },
          { text: '20', accent: true },
          { text: ' 家' },
        ],
        [
          { text: '累计直接挽回金额 ' },
          { text: '357', accent: true },
          { text: ' 万元' },
        ],
      ],
    },
    {
      name: '审计部',
      lead: '审计部在过去的一年里',
      lines: [
        [
          { text: '完成审计项目 ' },
          { text: '25', accent: true },
          { text: ' 起' },
        ],
        [
          { text: '一级部门覆盖率达到 ' },
          { text: '100%', accent: true },
        ],
        [
          { text: '到期应整改任务数 ' },
          { text: '91', accent: true },
          { text: ' 个' },
        ],
        [
          { text: '完成到期整改任务数 ' },
          { text: '79', accent: true },
          { text: ' 个' },
        ],
        [
          { text: '到期风险关闭率 ' },
          { text: '86.8%', accent: true },
        ],
        [
          { text: '累计挽损金额 ' },
          { text: '626.3', accent: true },
          { text: ' 万元' },
        ],
      ],
    },
    {
      name: '内控部',
      lead: '内控部在过去的一年里',
      lines: [
        [
          { text: '完成内控项目 ' },
          { text: '4', accent: true },
          { text: ' 起' },
        ],
        [
          { text: '发布整改任务数 ' },
          { text: '26', accent: true },
          { text: ' 个' },
        ],
        [
          { text: '到期应整改任务数 ' },
          { text: '26', accent: true },
          { text: ' 个' },
        ],
        [
          { text: '完成到期整改任务数 ' },
          { text: '26', accent: true },
          { text: ' 个' },
        ],
        [
          { text: '到期风险关闭率 ' },
          { text: '100%', accent: true },
        ],
        [
          { text: '累计挽损金额 ' },
          { text: '47.6', accent: true },
          { text: ' 万元' },
        ],
      ],
    },
  ],
  tip: {
    title: '风控提示',
    body: [
      { text: '2025', accent: true },
      {
        text: '年，一些在管理过程中容易被忽略的员工不当行为和管理风气问题需要引起关注：例如员工外出不履职、不尽责，花钱的必要性，成本的合理性；上述情况需管理者躬身入局，认真审视。',
      },
    ],
  },
}
