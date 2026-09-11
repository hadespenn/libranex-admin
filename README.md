# Libranex · Operations Platform

国际化支付运营管理后台。UI 与内容**完全对齐产品原型 `prototype.html`**（Libranex Enterprise Console Prototype），采用 Ant Design 5 组件体系 + 原型设计令牌。

## 目录说明

| 路径 | 说明 |
| --- | --- |
| `prototype.html` | **产品原型**（511KB 单文件 HTML，含用户端控制台 / 开户激活 / 运营后台）。仅作设计参考，不参与构建 |
| `index.html` | **应用入口**（Vite entry）。
| `src/` | React 应用源码 |

> 开发地址：`http://localhost:8000/admin.html`（`npm run dev` 会自动打开）

## 快速开始

```bash
npm install
npm run dev     # → http://localhost:8000/admin.html
npm run build
npm run preview
```

## 运营后台模块（12 个，与原型 ops-shell 一一对应）

| 分组 | 模块 | 路由 |
| --- | --- | --- |
| 工作台 | 运营总览 | `/overview` |
| 工作台 | KYC 审核队列 | `/kyc` |
| 工作台 | 风险案件 | `/risk` |
| 工作台 | 交易复核 | `/tx-review` |
| 运营与客户 | 实时交易监控 | `/transactions` |
| 运营与客户 | 客户与账户 | `/customers` |
| 运营与客户 | 工单管理 | `/tickets` |
| 运营与客户 | 清结算与对账 | `/settlement` |
| 控制与配置 | 规则策略 | `/rules` |
| 控制与配置 | 通道与流动性 | `/channels` |
| 控制与配置 | 报告与审计 | `/reports` |
| 控制与配置 | 配置中心 | `/config` |

页面标题与副标题取自原型 `opsMeta`，由 `src/routes.tsx` 驱动顶栏渲染。

## 设计令牌（与原型 `:root` 一致）

见 `src/theme.ts`：

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--navy` | `#062d53` | 品牌主色 |
| `--navy-2` | `#0c447c` | 强调蓝 |
| `--gold` | `#b8932e` | 主操作 / 品牌金 |
| `--ink` | `#12283d` | 正文 |
| `--muted` | `#66788b` | 辅助文字 |
| `--line` | `#d8e0e5` | 分隔线 |
| `--success / --warn / --danger / --blue` | `#16825d / #b7791f / #b42318 / #378add` | 状态色 |

运营后台专用（原型 `ops-*`）：侧栏 `#102435`、工作台底色 `#f4f7fa`、面板边框 `#dde6ed`、圆角 `13–14px`、状态 chip 圆角 999px。

## 目录结构

```
src/
├── main.tsx              # 入口 + ConfigProvider 主题
├── App.tsx               # 路由
├── routes.tsx            # 12 个模块的路由元数据（标题/副标题/图标/分组）
├── theme.ts              # 设计令牌
├── layouts/
│   └── ProLayout.tsx     # ops-shell：侧栏 + 顶栏（标题/语言/关注项/SSO）
├── components/
│   ├── OpsUI.tsx         # Metrics / Panel / Chip / OpsTable / CardGrid / Timeline / BarChart / DataList / NoteBox
│   └── OpsDrawer.tsx     # 通用抽屉
├── drawers/
│   └── Drawers.tsx       # KYC 360 / 风险案件 / 工单 / 结算差异 抽屉 + 通用操作弹窗
├── pages/                # 12 个业务页面
└── styles/global.css     # 原型 ops-* 样式复刻
```

## 交互实现

- **筛选**：KYC / 风险案件 / 客户支持状态 + 风险 + 关键字过滤，并显示「已显示 N 条匹配记录。」
- **抽屉**：KYC 客户 360（6 标签页）、风险案件（4 标签页）、工单、结算差异（3 标签页）
- **弹窗**：规则新建/模拟/版本/审批、通道详情/路由调整、报告生成/大盘/审计/STR/EFTR、配置限额/地区版本/留存
- **资金放行**：法币结算 / 资金隔离 / Crypto 结算 / Crypto 隔离，均带双人复核提示与审计轨迹说明

## 技术栈

React 18 · TypeScript 5 · Vite 5 · React Router 6 · antd 5 · @ant-design/pro-components

## 后续接入

- 用 `src/services/` 下的 API 客户端替换页面内的静态数据常量
- 原型中的用户端控制台（`app`）、开户激活（`activation-shell`）尚未迁移，可按需新建入口
