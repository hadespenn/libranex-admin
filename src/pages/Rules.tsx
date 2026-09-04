import { useState } from 'react';
import { Button } from 'antd';
import { Panel, Chip, OpsTable, CardGrid } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers';

type Row = {
  key: string;
  name: string;
  version: string;
  status: string;
  tone: 'green' | 'blue';
  policy: string;
  hits: number;
  approval: string;
  action: string;
};

const DATA: Row[] = [
  {
    key: '1',
    name: '24h 交易聚合',
    version: 'v1.8',
    status: 'Production',
    tone: 'green',
    policy: 'CAD 10,000',
    hits: 24,
    approval: 'Dual approved',
    action: '模拟 / 编辑',
  },
  {
    key: '2',
    name: '制裁筛查',
    version: 'v3.4',
    status: 'Production',
    tone: 'green',
    policy: 'Potential match → pause',
    hits: 6,
    approval: 'CCO approved',
    action: '查看',
  },
  {
    key: '3',
    name: '设备关联欺诈',
    version: 'v2.1',
    status: 'Grey rollout',
    tone: 'blue',
    policy: 'Shared device graph',
    hits: 18,
    approval: 'Pending review',
    action: '审批',
  },
];

const VERSIONS = [
  { key: 'v34', v: 'v3.4', date: '2026-07-22', state: 'Production', hits: '6', approval: 'CCO approved' },
  { key: 'v33', v: 'v3.3', date: '2026-06-18', state: 'Deprecated', hits: '—', approval: 'CCO approved' },
  { key: 'v32', v: 'v3.2', date: '2026-05-09', state: 'Rolled back', hits: '—', approval: 'Dual approved' },
];

export default function Rules() {
  const [modal, setModal] = useState<null | 'create' | 'edit' | 'view' | 'approve'>(null);
  const [row, setRow] = useState<Row | null>(null);

  const open = (kind: NonNullable<typeof modal>, r?: Row) => {
    setRow(r ?? null);
    setModal(kind);
  };

  const SIM_METRICS = [
    { title: '0.14%', sub: '命中率' },
    { title: '评估中', sub: '误报评估' },
    { title: '< 5 分钟', sub: '回滚耗时' },
  ];

  return (
    <>
      <Panel
        title="规则策略与名单"
        actions={
          <Button
            className="mini btn-primary"
            onClick={() => open('create')}
          >
            新建规则版本
          </Button>
        }
      >
        <OpsTable<Row>
          columns={[
            { title: '规则', key: 'name', render: (r) => <b>{r.name}</b> },
            { title: '版本', key: 'version', render: (r) => r.version },
            { title: '状态', key: 'status', render: (r) => <Chip tone={r.tone}>{r.status}</Chip> },
            { title: '策略', key: 'policy', render: (r) => r.policy },
            { title: '最近命中', key: 'hits', render: (r) => r.hits },
            { title: '审批', key: 'approval', render: (r) => r.approval },
            {
              title: '操作',
              key: 'action',
              render: (r) => {
                const kind =
                  r.action === '模拟 / 编辑' ? 'edit' : r.action === '查看' ? 'view' : 'approve';
                return (
                  <button className="link" onClick={() => open(kind, r)}>
                    {r.action}
                  </button>
                );
              },
            },
          ]}
          data={DATA}
        />
      </Panel>

      <ReleaseModal
        open={modal === 'create'}
        onClose={() => setModal(null)}
        title="新建规则版本"
        submitText="提交并进入审批"
        toast="规则草稿已提交，进入审批链路。"
        fields={
          [
            {
              name: 'type',
              label: '规则类型',
              type: 'select',
              options: ['交易聚合', '制裁筛查', '设备关联', '行为异常'],
            },
            { name: 'name', label: '规则名称', type: 'text' },
            { name: 'scope', label: '适用场景', type: 'select', options: ['全部交易', '法币出款', 'Crypto 出款', '兑换'] },
            { name: 'threshold', label: '阈值参数', type: 'text', initial: 'CAD 10,000 / 24h' },
            {
              name: 'hitAction',
              label: '命中动作',
              type: 'select',
              options: ['Pause', 'Hold', 'Alert'],
              initial: 'Hold',
            },
            {
              name: 'chain',
              label: '审批链路',
              type: 'select',
              options: ['Dual approved', 'CCO approved', 'CCO / MLRO + Legal'],
              initial: 'Dual approved',
            },
            { name: 'impact', label: '已评估影响范围', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'edit'}
        onClose={() => setModal(null)}
        title={`模拟 / 编辑规则（${row?.name ?? ''} ${row?.version ?? ''}）`}
        submitText="保存为草稿"
        toast="草稿已保存，等待审批发布。"
        note="编辑不会覆盖生产版本；测试通过后另发新版本申请。"
        extra={
          <div className="mt-2">
            <CardGrid
              cards={SIM_METRICS}
              render={(c) => (
                <>
                  <b className="text-[18px] text-[#142d42]">{c.title}</b>
                  <p className="ops-card-sub">{c.sub}</p>
                </>
              )}
            />
          </div>
        }
        fields={
          [
            { name: 'baseVer', label: '基线版本', type: 'text', initial: 'v1.8 Production', readOnly: true },
            { name: 'draftTag', label: '草稿标签', type: 'text', placeholder: 'v1.9-draft-rc' },
            {
              name: 'window',
              label: '试用窗口',
              type: 'select',
              options: ['24 小时回放', '7d 影子模式', '即时生效（审核后）'],
              initial: '24 小时回放',
            },
            { name: 'metrics', label: '观察指标', type: 'text', placeholder: '命中率 / 误报率 / 客户申诉' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'view'}
        onClose={() => setModal(null)}
        title={`规则详情（${row?.name ?? ''} ${row?.version ?? ''}）`}
        submitText="基于此版本起草"
        toast="已基于该版本创建草稿。"
        note="Production 简本只读；详情包含版本历程、命中明细、审批链与回滚日志。"
        onSubmit={() => {
          setModal(null);
          setTimeout(() => setModal('edit'), 0);
        }}
        width={640}
        extra={
          <div className="mt-2">
            <OpsTable<(typeof VERSIONS)[number]>
              columns={[
                { title: '版本', key: 'v', render: (r) => <b>{r.v}</b> },
                { title: '生效时间', key: 'date', render: (r) => r.date },
                {
                  title: '状态',
                  key: 'state',
                  render: (r) => {
                    const colorMap: Record<string, string> = {
                      Production: '#13845b',
                      Deprecated: '#3182ce',
                      'Rolled back': '#d69e2e',
                    };
                    return (
                      <span
                        style={{
                          color: colorMap[r.state] ?? '#2d3748',
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {r.state}
                      </span>
                    );
                  },
                },
                { title: '最近命中', key: 'hits', render: (r) => r.hits },
                { title: '审批', key: 'approval', render: (r) => r.approval },
              ]}
              data={VERSIONS}
            />
          </div>
        }
        fields={[]}
      />

      <ReleaseModal
        open={modal === 'approve'}
        onClose={() => setModal(null)}
        title={`规则审批 · ${row?.name ?? ''}`}
        submitText="同意并发布"
        cols={3}
        toast="规则已同意并发布至生产。"
        note="规则变更需二次 MFA + 强制审批意见；同意后进入灰度发布，驳回需提供修改要求。"
        summary={[
          { label: '版本', value: row?.version ?? 'v2.1' },
          { label: '状态', value: '灰度' },
          { label: '命中', value: String(row?.hits ?? 18) },
        ]}
        fields={
          [
            { name: 'comment', label: '审批意见', type: 'textarea' },
            { name: 'mfa', label: '已通过 MFA 二次确认', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
