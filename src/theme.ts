/** 设计令牌 · 与产品原型 index.html 的 :root 变量保持一致 */
export const T = {
  navy: '#062d53',
  navy2: '#0c447c',
  ink: '#12283d',
  muted: '#66788b',
  gold: '#b8932e',
  goldBright: '#d9b95d',
  cream: '#f7f5ef',
  paper: '#fffdf8',
  line: '#d8e0e5',
  success: '#16825d',
  warn: '#b7791f',
  danger: '#b42318',
  blue: '#378add',

  // 运营后台专用色
  opsBg: '#f4f7fa',
  opsSidebar: '#102435',
  opsSidebarText: '#d6e3ed',
  opsNavText: '#cbd9e5',
  opsNavLabel: '#7fa1b8',
  opsNavActiveBg: '#1b3950',
  opsNavActiveBar: '#66b4e9',
  opsPanelBorder: '#dde6ed',
  opsTitle: '#142d42',
  opsDesc: '#748493',
  opsNote: '#8a94a6',
  opsTableTh: '#6f8190',
  opsCardTitle: '#173c59',
  opsCardText: '#708190',
} as const;

export type ChipTone = 'blue' | 'green' | 'yellow' | 'red' | 'gray';
