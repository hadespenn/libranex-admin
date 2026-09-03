import { useState } from 'react';
import { Button } from 'antd';
import { Panel, Chip, OpsTable, CardGrid, NoteBox } from '@/components/OpsUI';
import { SettlementDrawer, ReleaseModal, type ReleaseField } from '@/drawers/Drawers';

type Row = {
  key: string;
  batch: string;
  partner: string;
  ccy: string;
  amount: string;
  status: string;
  tone: 'yellow' | 'green';
  action: string;
};

const DATA: Row[] = [
  {
    key: '1',
    batch: 'SET-20260730-01',
    partner: 'Canada ACH Partner',
    ccy: 'CAD',
    amount: '1,280,300.00',
    status: '金额差异',
    tone: 'yellow',
    action: '调查',
  },
  {
    key: '2',
    batch: 'SET-20260730-02',
    partner: 'SG FAST Partner',
    ccy: 'SGD',
    amount: '920,411.00',
    status: 'Matched',
    tone: 'green',
    action: '查看',
  },
];

const LIQUIDITY = [
  { title: 'USD', available: 'Available $2.8M', status: 'Healthy', tone: 'green' as const },
  { title: 'SGD', available: 'Available $0.42M', status: 'Warning', tone: 'yellow' as const },
  { title: 'EUR', available: 'Available €1.9M', status: 'Healthy', tone: 'green' as const },
];

const RELEASE = [
  {
    title: '法币结算',
    count: '2 笔待放行',
    desc: '法币多批次结算放行与回退',
    btn: '运营放行',
    toast: '结算放行已提交，进入双人复核。',
    fields: [
      {
        name: 'batch',
        label: '结算批次',
        type: 'select',
        options: ['STL-20260811-01', 'STL-20260810-07'],
        initial: 'STL-20260811-01',
      },
      {
        name: 'target',
        label: '目标',
        type: 'select',
        options: ['Payment Account', 'Safeguarding', 'Downstream', 'Bank'],
        initial: 'Payment Account',
      },
      { name: 'amount', label: '金额', type: 'number', initial: 120000 },
    ] as ReleaseField[],
  },
  {
    title: '资金隔离',
    count: '1 笔待释放',
    desc: '客户隔离账户资金释放',
    btn: '释放申请',
    toast: '隔离资金释放申请已提交，进入双人复核。',
    fields: [
      {
        name: 'reason',
        label: '原因',
        type: 'select',
        options: ['Customer settlement completed', 'Account closure', 'Regulatory release'],
        initial: 'Customer settlement completed',
      },
      { name: 'amount', label: '金额', type: 'number', initial: 80000 },
    ] as ReleaseField[],
  },
  {
    title: 'Crypto 结算',
    count: '1 笔待放行',
    desc: 'Crypto 多批次放行与回退',
    btn: '结算放行',
    toast: 'Crypto 结算放行已提交，进入双人复核。',
    fields: [
      {
        name: 'batch',
        label: '批次',
        type: 'select',
        options: ['CSTL-20260811-03', 'CSTL-20260810-02'],
        initial: 'CSTL-20260811-03',
      },
      {
        name: 'target',
        label: '目标',
        type: 'select',
        options: ['Crypto Payment', 'Crypto Safeguarding', 'Downstream'],
        initial: 'Crypto Payment',
      },
      { name: 'amount', label: '金额', type: 'number', initial: 85000 },
    ] as ReleaseField[],
  },
  {
    title: 'Crypto 隔离',
    count: '1 笔待释放',
    desc: '受托 Crypto 资金释放',
    btn: '释放申请',
    toast: 'Crypto 隔离资金释放申请已提交，进入双人复核。',
    fields: [
      { name: 'asset', label: '资产', type: 'select', options: ['USDT', 'USDC'], initial: 'USDT' },
      { name: 'network', label: '网络', type: 'select', options: ['TRC20', 'ERC20'], initial: 'TRC20' },
      {
        name: 'reason',
        label: '原因',
        type: 'select',
        options: ['Release condition met', 'Client withdrawal', 'Treasury rebalance'],
        initial: 'Release condition met',
      },
    ] as ReleaseField[],
  },
];

export default function Settlement() {
  const [detail, setDetail] = useState<Row | null>(null);
  const [release, setRelease] = useState<(typeof RELEASE)[number] | null>(null);

  return (
    <>
      <div className="ops-layout">
        <Panel title="清结算与对账">
          <OpsTable<Row>
            columns={[
              { title: '批次', key: 'batch', render: (r) => <b>{r.batch}</b> },
              { title: '合作方', key: 'partner', render: (r) => r.partner },
              { title: '币种', key: 'ccy', render: (r) => r.ccy },
              { title: '净额', key: 'amount', render: (r) => r.amount },
              {
                title: '对账状态',
                key: 'status',
                render: (r) => <Chip tone={r.tone}>{r.status}</Chip>,
              },
              {
                title: '操作',
                key: 'action',
                render: (r) => (
                  <button className="link" onClick={() => setDetail(r)}>
                    {r.action}
                  </button>
                ),
              },
            ]}
            data={DATA}
          />
        </Panel>

        <Panel title="流动性监控">
          <CardGrid
            cards={LIQUIDITY}
            render={(c) => (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b>{c.title}</b>
                  <Chip tone={c.tone}>{c.status}</Chip>
                </div>
                <p className="ops-card-sub">{c.available}</p>
              </>
            )}
          />
        </Panel>
      </div>

      <Panel
        title="资金放行与释放"
        desc="对结算、隔离与 Crypto 资金执行放行 / 释放，受双人复核与审计约束。"
        actions={<Chip tone="blue">受双人复核与审计约束</Chip>}
        wide
      >
        <CardGrid
          cols={4}
          cards={RELEASE}
          render={(c) => (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <b>{c.title}</b>
                <Chip tone="yellow">{c.count}</Chip>
              </div>
              <p className="ops-card-sub">{c.desc}</p>
              <Button
                block
                style={{
                  marginTop: 8,
                  borderRadius: 999,
                  background: '#b8932e',
                  borderColor: '#b8932e',
                  color: '#fff',
                  fontSize: 12,
                }}
                onClick={() => setRelease(c)}
              >
                {c.btn}
              </Button>
            </>
          )}
        />

        <NoteBox tone="info">所有放行 / 释放操作均记录审计轨迹，并触发双人复核。</NoteBox>
      </Panel>

      <SettlementDrawer open={!!detail} onClose={() => setDetail(null)} batch={detail?.batch} />

      <ReleaseModal
        open={!!release}
        onClose={() => setRelease(null)}
        title={`${release?.title ?? ''} · ${release?.btn ?? ''}`}
        fields={release?.fields ?? []}
        submitText={release?.btn ?? '提交'}
        toast={release?.toast ?? ''}
      />
    </>
  );
}
