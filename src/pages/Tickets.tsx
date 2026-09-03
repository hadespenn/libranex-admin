import { useState } from 'react';
import { Button, App as AntdApp } from 'antd';
import { Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { TicketDrawer } from '@/drawers';

type Row = {
  key: string;
  id: string;
  customer: string;
  category: string;
  priority: string;
  tone: 'yellow' | 'blue';
  sla: string;
};

const DATA: Row[] = [
  {
    key: '1',
    id: '#TCK-9321',
    customer: 'Unity Centre',
    category: '结算延迟',
    priority: 'P2',
    tone: 'yellow',
    sla: '22m left',
  },
  {
    key: '2',
    id: '#TCK-9318',
    customer: 'Atlas Commerce',
    category: 'KYC 补件',
    priority: 'P3',
    tone: 'blue',
    sla: '4h left',
  },
];

export default function Tickets() {
  const { message } = AntdApp.useApp();
  const [detail, setDetail] = useState<Row | null>(null);

  return (
    <>
    <div className="ops-layout">
      <Panel title="工单管理">
        <OpsTable<Row>
          columns={[
            { title: '工单', key: 'id', render: (r) => <b>{r.id}</b> },
            { title: '客户', key: 'customer', render: (r) => r.customer },
            { title: '分类', key: 'category', render: (r) => r.category },
            { title: '优先级', key: 'priority', render: (r) => <Chip tone={r.tone}>{r.priority}</Chip> },
            { title: 'SLA', key: 'sla', render: (r) => r.sla },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  打开
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <Panel title="客服安全边界">
        <NoteBox tone="warn">
          客服仅能查看脱敏客户信息与交易摘要；无资金操作权限，且不得披露制裁、STR 或内部调查状态。
        </NoteBox>
        <Button
          className="mini"
          style={{ borderRadius: 999 }}
          onClick={() => message.info('已打开知识库建议。')}
        >
          查看知识库建议
        </Button>
      </Panel>

      <TicketDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        ticketId={detail?.id}
        customer={
          detail?.customer === 'Unity Centre'
            ? 'Unity Centre Investment Ltd.'
            : 'Atlas Commerce Ltd.'
        }
        sla={detail?.sla.replace(' left', ' remaining')}
      />
      </div>
    </>
  );
}
