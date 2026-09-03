import { useState } from 'react';
import { Button, App as AntdApp } from 'antd';
import { Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { RiskDrawer } from '@/drawers/Drawers';

type Row = {
  key: string;
  id: string;
  type: string;
  amount: string;
  reason: string;
  status: string;
  tone: 'red' | 'yellow';
};

const DATA: Row[] = [
  {
    key: '1',
    id: 'TX-849201',
    type: '银行付款',
    amount: 'USD 98,500',
    reason: '潜在制裁匹配',
    status: '冻结',
    tone: 'red',
  },
  {
    key: '2',
    id: 'TX-849166',
    type: '兑换',
    amount: 'EUR 65,000',
    reason: '异常路径 / 新收款人',
    status: '待风控',
    tone: 'yellow',
  },
];

export default function TxReview() {
  const { message } = AntdApp.useApp();
  const [detail, setDetail] = useState<Row | null>(null);

  return (
    <>
      <Panel title="交易复核队列">
        <OpsTable<Row>
          columns={[
            { title: '交易', key: 'id', render: (r) => <b>{r.id}</b> },
            { title: '类型', key: 'type', render: (r) => r.type },
            { title: '金额', key: 'amount', render: (r) => r.amount },
            { title: '触发原因', key: 'reason', render: (r) => r.reason },
            { title: '状态', key: 'status', render: (r) => <Chip tone={r.tone}>{r.status}</Chip> },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  复核
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <Panel title="复核动作">
        <NoteBox>展示资金来源去向、对手方、规则命中、名单/链上筛查和客户 KYC 资料。</NoteBox>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            className="mini btn-success"
            style={{ borderRadius: 999 }}
            onClick={() => message.success('放行需要满足规则与权限校验；已生成待审批决定。')}
          >
            放行
          </Button>
          <Button
            className="mini btn-danger"
            style={{ borderRadius: 999 }}
            onClick={() => message.info('交易保持冻结，已记录处置理由与证据要求。')}
          >
            拒绝 / 冻结
          </Button>
          <Button
            className="mini btn-ghost"
            style={{ borderRadius: 999 }}
            onClick={() => message.info('案件已升级至 CCO / 法务队列。')}
          >
            升级案件
          </Button>
        </div>
      </Panel>

      <RiskDrawer open={!!detail} onClose={() => setDetail(null)} caseId="RC-202607-1009" />
    </>
  );
}
