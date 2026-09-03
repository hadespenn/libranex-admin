export type RouteMeta = {
  key: string;
  path: string;
  title: string;
  desc: string;
  /** 原型 .ops-nav 的字符图标（与 navMap 一致） */
  icon: string;
  group: string;
};

/** 对应原型 ops-shell · navMap 的 12 个字符图标 */
export const ROUTES: RouteMeta[] = [
  {
    key: 'ops-home',
    path: '/overview',
    title: '运营总览',
    desc: '交易、合规、风险、通道与系统运行的实时视图',
    icon: '◈',
    group: '工作台',
  },
  {
    key: 'ops-kyc',
    path: '/kyc',
    title: 'KYC 审核队列',
    desc: '客户尽调、材料核验、UBO、筛查、评分与决定',
    icon: '✓',
    group: '工作台',
  },
  {
    key: 'ops-risk',
    path: '/risk',
    title: '风险案件',
    desc: '规则命中、人工调查、证据、处置与报告候选',
    icon: '⚑',
    group: '工作台',
  },
  {
    key: 'ops-txreview',
    path: '/tx-review',
    title: '交易复核',
    desc: '资金链路、名单/链上筛查与放行/冻结决策',
    icon: '↗',
    group: '工作台',
  },
  {
    key: 'ops-transactions',
    path: '/transactions',
    title: '实时交易监控',
    desc: '交易量、状态滞留、通道错误率与异常告警',
    icon: '▤',
    group: '运营与客户',
  },
  {
    key: 'ops-customers',
    path: '/customers',
    title: '客户与账户',
    desc: '客户状态、账户能力和脱敏 360 视图',
    icon: '◎',
    group: '运营与客户',
  },
  {
    key: 'ops-tickets',
    path: '/tickets',
    title: '工单管理',
    desc: '分类、优先级、分派、SLA 与客户协作',
    icon: '?',
    group: '运营与客户',
  },
  {
    key: 'ops-settlement',
    path: '/settlement',
    title: '清结算与对账',
    desc: '结算批次、合作方对账差异、调账与流动性',
    icon: '◇',
    group: '运营与客户',
  },
  {
    key: 'ops-rules',
    path: '/rules',
    title: '规则策略',
    desc: '规则版本、灰度、模拟、审批发布和回滚',
    icon: '⌁',
    group: '控制与配置',
  },
  {
    key: 'ops-channels',
    path: '/channels',
    title: '通道与流动性',
    desc: '伙伴能力、路由权重、健康度和结算周期',
    icon: '▣',
    group: '控制与配置',
  },
  {
    key: 'ops-reports',
    path: '/reports',
    title: '报告与审计',
    desc: '运营、合规、风险、监管报告及法律保全',
    icon: '▧',
    group: '控制与配置',
  },
  {
    key: 'ops-config',
    path: '/config',
    title: '配置中心',
    desc: '参数、费率、限额、地区、功能开关与变更治理',
    icon: '⚙',
    group: '控制与配置',
  },
];

export const MENU_GROUPS = ['工作台', '运营与客户', '控制与配置'].map((group) => ({
  group,
  items: ROUTES.filter((r) => r.group === group),
}));
