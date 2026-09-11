import type { DeptFocusReport } from '@/types/bill'

/** 高风险阻击战后 — 部门三线聚焦（审计 / 监察 / 内控） */
export const mockDeptFocusReports: DeptFocusReport[] = [
  {
    id: 'audit',
    eyebrow: '在过去一年中',
    department: '财经中心',
    metrics: [
      [{ text: '参与完成审计项目 ' }, { text: '3', accent: true }, { text: ' 起' }],
      [
        { text: '我们一起参与整改项目 ' },
        { text: '2', accent: true },
        { text: ' 起' },
      ],
      [{ text: '触发整改任务 ' }, { text: '8', accent: true }, { text: ' 个' }],
      [{ text: '关闭整改任务 ' }, { text: '8', accent: true }, { text: ' 个' }],
      [{ text: '未关闭任务 ' }, { text: '0', accent: true }, { text: ' 个' }],
      [
        { text: '累计为公司避免损失 ' },
        { text: '0', accent: true },
        { text: ' 万元' },
      ],
    ],
    tip: '建议加强对财经相关的系统账号权限管控、业务结算逻辑及数据准确性的复核。',
  },
  {
    id: 'supervision',
    eyebrow: '在过去一年中',
    department: '财经中心',
    metrics: [
      [{ text: '涉及监察事项 ' }, { text: '1', accent: true }, { text: ' 起' }],
      [{ text: '违规合作商数量 ' }, { text: '0', accent: true }, { text: ' 家' }],
      [
        { text: '员工积分扣减申请发起 ' },
        { text: '0', accent: true },
        { text: ' 人次' },
      ],
      [
        { text: '共向违规员工发出红牌 ' },
        { text: '0', accent: true },
        { text: ' 张，黄牌 ' },
        { text: '0', accent: true },
        { text: ' 张，蓝牌 ' },
        { text: '0', accent: true },
        { text: ' 张' },
      ],
    ],
    tip: '关键岗位多，各级管理者应时刻保持关注。2026年保持更多的信息同频，员工廉洁从业意识提升，减少舞弊风险。',
  },
  {
    id: 'control',
    eyebrow: '在过去一年中',
    department: '财经中心',
    metrics: [
      [{ text: '参与完成内控项目 ' }, { text: '4', accent: true }, { text: ' 起' }],
      [{ text: '触发整改任务 ' }, { text: '18', accent: true }, { text: ' 个' }],
      [{ text: '到期应关闭任务 ' }, { text: '18', accent: true }, { text: ' 个' }],
      [{ text: '关闭整改任务 ' }, { text: '18', accent: true }, { text: ' 个' }],
      [{ text: '未关闭任务 ' }, { text: '0', accent: true }, { text: ' 个' }],
      [
        { text: '累计为公司避免损失 ' },
        { text: '44.5', accent: true },
        { text: ' 万元' },
      ],
    ],
    tip: '建议加强对前端业务链路的下探，定期回顾系统规则与业务场景的一致性。',
  },
]
