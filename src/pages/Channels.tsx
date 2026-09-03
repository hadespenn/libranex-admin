import { useState } from 'react';
import { Button, App as AntdApp } from 'antd';
import { Panel, Chip, OpsTable, DataList } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers';

type Row = {
  key: string;
  partner: string;
  capability: string;
  health: string;
  tone: 'green' | 'yellow';
  weight: string;
  cycle: string;
  action: string;
};

const DATA: Row[] = [
  {
    key: '1',
    partner: 'Canada ACH Partner',
    capability: 'CAD collection / payout',
    health: '99.92%',
    tone: 'green',
    weight: '55%',
    cycle: 'T+1',
    action: '查看',
  },
  {
    key: '2',
    partner: 'SG FAST Partner',
    capability: 'SGD local payout',
    health: '97.8%',
    tone: 'yellow',
    weight: '25%',
    cycle: 'Same day',
    action: '调整路由',
  },
  {
    key: '3',
    partner: 'Qualified Exchange',
    capability: 'USDC settlement',
    health: '99.70%',
    tone: 'green',
    weight: '20%',
    cycle: 'On-chain',
    action: '查看',
  },
];

export default function Channels() {
  const { message } = AntdApp.useApp();
  const [modal, setModal] = useState<null | 'view' | 'route'>(null);
  const [row, setRow] = useState<Row | null>(null);

  return (
    <>
      <Panel title="通道、路由与流动性">
        <OpsTable<Row>
          columns={[
            { title: '合作方 / 通道', key: 'partner', render: (r) => <b>{r.partner}</b> },
            { title: '能力', key: 'capability', render: (r) => r.capability },
            {
              title: '健康度',
              key: 'health',
              render: (r) => <Chip tone={r.tone}>{r.health}</Chip>,
            },
            { title: '权重', key: 'weight', render: (r) => r.weight },
            { title: '结算周期', key: 'cycle', render: (r) => r.cycle },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button
                  className="link"
                  onClick={() => {
                    setRow(r);
                    setModal(r.action === '调整路由' ? 'route' : 'view');
                  }}
                >
                  {r.action}
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <ReleaseModal
        open={modal === 'view'}
        onClose={() => setModal(null)}
        title={`通道详情 · ${row?.partner ?? ''}`}
        submitText="调整路由权重"
        toast="已进入路由权重调整流程。"
        summary={[
          { label: '成功率', value: row?.health ?? '99.92%' },
          { label: '权重', value: row?.weight ?? '55%' },
          { label: '结算周期', value: row?.cycle ?? 'T+1' },
          { label: '限额', value: 'CAD 5M 每日' },
        ]}
        fields={[]}
      />

      <ReleaseModal
        open={modal === 'route'}
        onClose={() => setModal(null)}
        title="调整路由权重"
        submitText="提交进入双人复核"
        toast="路由变更已提交，进入双人复核。"
        note="合作方备注：SLA 99.9%；特殊场景需双人书面授权。合计权重必须为 100%。"
        width={560}
        extra={
          <div style={{ marginTop: 8 }}>
            <DataList
              items={[
                { label: 'Canada ACH', value: '55%' },
                { label: 'SG FAST', value: '25%' },
                { label: 'Qualified Exchange', value: '20%' },
                { label: '合计', value: '100%' },
              ]}
            />
            <Button
              className="mini"
              style={{ borderRadius: 999, marginTop: 10 }}
              onClick={() => message.info('已打开权重配比校验明细。')}
            >
              查看校验明细
            </Button>
          </div>
        }
        fields={
          [
            {
              name: 'effective',
              label: '生效时间',
              type: 'select',
              options: ['立即', '下一结算日'],
              initial: '立即',
            },
            {
              name: 'killSwitch',
              label: '急停保留',
              type: 'select',
              options: ['保持生产路由', '立刻切换'],
              initial: '保持生产路由',
            },
            { name: 'reason', label: '变更说明', type: 'textarea' },
            { name: 'mfa', label: '已通过 MFA 二次确认', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
