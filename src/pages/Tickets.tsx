import { useState } from 'react';
import { Button, App as AntdApp } from 'antd';
import { Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { TicketDrawer } from '@/drawers';
import { useI18n } from '@/i18n';

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
    category: 'categorySettleDelay',
    priority: 'P2',
    tone: 'yellow',
    sla: '22m left',
  },
  {
    key: '2',
    id: '#TCK-9318',
    customer: 'Atlas Commerce',
    category: 'categoryKycSupplement',
    priority: 'P3',
    tone: 'blue',
    sla: '4h left',
  },
];

export default function Tickets() {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [detail, setDetail] = useState<Row | null>(null);

  return (
    <>
    <div className="ops-layout">
      <Panel title={t('page.tickets.title')}>
        <OpsTable<Row>
          columns={[
            { title: t('page.tickets.col.id'), key: 'id', render: (r) => <b>{r.id}</b> },
            { title: t('page.tickets.col.customer'), key: 'customer', render: (r) => r.customer },
            { title: t('page.tickets.col.category'), key: 'category', render: (r) => t(`page.tickets.${r.category}`) },
            { title: t('page.tickets.col.priority'), key: 'priority', render: (r) => <Chip tone={r.tone}>{r.priority}</Chip> },
            { title: t('page.tickets.col.sla'), key: 'sla', render: (r) => r.sla },
            {
              title: t('page.tickets.col.action'),
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  {t('page.tickets.actionOpen')}
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <Panel title={t('page.tickets.boundaryTitle')}>
        <p>{t('page.tickets.boundaryDesc')}</p>
        <Button
          className="mini link"
          style={{ marginBottom: 56 }}
          onClick={() => message.info(t('page.tickets.kbMsg'))}
        >
          {t('page.tickets.kbBtn')}
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
