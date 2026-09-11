import type { RiskClassificationTreeData } from '@/types/bill'

/** 风控分类宣导 — 风险 / 整改分类树 */
export const mockRiskClassificationTree: RiskClassificationTreeData = {
  rootTitle: '风控分类宣导',
  rectification: {
    title: '整改分类',
    icon: '📋',
    items: ['追责通报', '流程整改', '挽损整改', '系统整改', '其他整改'],
  },
  risk: {
    title: '风险分类',
    icon: '🛡️',
    columns: [
      {
        up: {
          name: '信数管理',
          icon: '🖥️',
          children: ['信息安全', '系统管理', '物资管理'],
        },
        down: {
          name: '渠道管理',
          icon: '🗂️',
          children: ['TOB业务', 'TOC业务', '大家及特殊客户'],
        },
      },
      {
        up: {
          name: '物流仓储管理',
          icon: '📦',
          children: ['物流管理', '仓储管理'],
        },
        down: {
          name: '战略管理',
          icon: '🧭',
          children: ['集分权管理', '经营考核', '战略项目管理'],
        },
      },
      {
        up: {
          name: '供应链管理',
          icon: '🔗',
          children: ['采购管理', '供应商管理', '产业园管理'],
        },
        down: {
          name: '行政管理',
          icon: '📝',
          children: [
            '差旅',
            '会务',
            '业务招待',
            '办公杂费',
            '物业租赁',
            '后勤服务',
            '固定资产',
          ],
        },
      },
      {
        up: {
          name: '财务管理',
          icon: '💰',
          children: ['财报', '税务', '资金', '预算', '核算', '投融资'],
        },
      },
      {
        up: {
          name: '客服管理',
          icon: '🎧',
          children: ['售前', '售中', '售后'],
        },
        down: {
          name: '产品管理',
          icon: '📦',
          children: ['价格管理', '产品发布', '上架与退市'],
        },
      },
      {
        up: {
          name: '工程管理',
          icon: '⚙️',
          children: ['基建工程', '装修工程', '其它工程'],
        },
        down: {
          name: '人力资源管理',
          icon: '👥',
          children: [
            '薪酬绩效',
            '企业文化',
            '培训',
            '招聘',
            '员工关系',
            '外包',
          ],
        },
      },
      {
        up: {
          name: '印章与档案管理',
          icon: '🔏',
          children: ['印章管理', '证照管理', '档案管理'],
        },
      },
      {
        up: {
          name: '品质管理',
          icon: '🔍',
          children: ['检验管理', '质量保证'],
        },
      },
      {
        up: {
          name: '研发管理',
          icon: '🧪',
          children: ['产品设计', '打样与验证'],
        },
      },
    ],
    terminal: {
      name: '营销管理',
      icon: '📊',
      children: ['线上推广', '活动运营', '线下推广', '品牌推广', '流量管理'],
    },
  },
}
