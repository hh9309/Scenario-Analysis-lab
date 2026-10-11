import { CibVariable, CibImpact } from '../types/scenario';

export const INITIAL_CIB_VARIABLES: CibVariable[] = [
  {
    id: 'var-geo',
    name: '地缘政治与关税壁垒',
    category: '政治',
    states: [
      { id: 'geo-block', label: '阵营脱钩 / 严密壁垒', description: '出口管制、加征惩罚性关税与数据离境审查' },
      { id: 'geo-open', label: '多边合作 / 低关税', description: '遵循自由贸易协定，跨国技术与资本通畅' },
    ],
  },
  {
    id: 'var-tech',
    name: '黑灯工厂与具身自动化',
    category: '技术',
    states: [
      { id: 'tech-auto', label: '低成本极高普及', description: '机器人与大模型边际成本击穿人工成本' },
      { id: 'tech-slow', label: '高成本演进滞缓', description: '柔性改造困难，依然依赖传统密集劳动力' },
    ],
  },
  {
    id: 'var-carbon',
    name: '全球碳税与航运脱碳附加费',
    category: '环境',
    states: [
      { id: 'carbon-high', label: '重税高运费', description: '远洋海运加征高额碳配额，远距离物流暴涨' },
      { id: 'carbon-low', label: '低税平价运费', description: '碳法规放宽或推迟，远洋集装箱运力过剩廉价' },
    ],
  },
  {
    id: 'var-nearshore',
    name: '近岸外包政策与财政补贴',
    category: '政策',
    states: [
      { id: 'near-sub', label: '母国/邻国巨额补贴', description: '政府提供搬迁税收返还并抵扣资本开支' },
      { id: 'near-none', label: '无实质财政补贴', description: '企业需自担搬迁建厂折旧与沉没成本' },
    ],
  },
];

// Rich cross impacts between these 4 variables (binary states = 16 combinations)
export const INITIAL_CIB_IMPACTS: CibImpact[] = [
  // geo-block impacts
  { sourceVarId: 'var-geo', sourceStateId: 'geo-block', targetVarId: 'var-nearshore', targetStateId: 'near-sub', weight: 3 },
  { sourceVarId: 'var-geo', sourceStateId: 'geo-block', targetVarId: 'var-nearshore', targetStateId: 'near-none', weight: -3 },
  { sourceVarId: 'var-geo', sourceStateId: 'geo-block', targetVarId: 'var-tech', targetStateId: 'tech-auto', weight: 2 },
  { sourceVarId: 'var-geo', sourceStateId: 'geo-block', targetVarId: 'var-carbon', targetStateId: 'carbon-high', weight: 1 },

  // geo-open impacts
  { sourceVarId: 'var-geo', sourceStateId: 'geo-open', targetVarId: 'var-nearshore', targetStateId: 'near-none', weight: 3 },
  { sourceVarId: 'var-geo', sourceStateId: 'geo-open', targetVarId: 'var-nearshore', targetStateId: 'near-sub', weight: -2 },
  { sourceVarId: 'var-geo', sourceStateId: 'geo-open', targetVarId: 'var-carbon', targetStateId: 'carbon-low', weight: 2 },

  // tech-auto impacts
  { sourceVarId: 'var-tech', sourceStateId: 'tech-auto', targetVarId: 'var-nearshore', targetStateId: 'near-sub', weight: 2 },
  { sourceVarId: 'var-tech', sourceStateId: 'tech-slow', targetVarId: 'var-nearshore', targetStateId: 'near-none', weight: 2 },

  // carbon-high impacts
  { sourceVarId: 'var-carbon', sourceStateId: 'carbon-high', targetVarId: 'var-nearshore', targetStateId: 'near-sub', weight: 2 },
  { sourceVarId: 'var-carbon', sourceStateId: 'carbon-high', targetVarId: 'var-geo', targetStateId: 'geo-block', weight: 1 },
  { sourceVarId: 'var-carbon', sourceStateId: 'carbon-low', targetVarId: 'var-geo', targetStateId: 'geo-open', weight: 2 },

  // near-sub impacts
  { sourceVarId: 'var-nearshore', sourceStateId: 'near-sub', targetVarId: 'var-geo', targetStateId: 'geo-block', weight: 2 },
  { sourceVarId: 'var-nearshore', sourceStateId: 'near-none', targetVarId: 'var-geo', targetStateId: 'geo-open', weight: 2 },
];
