import { useState } from 'react';
import { Button, App as AntdApp } from 'antd';
import { Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { RiskDrawer } from '@/drawers';
import { useI18n } from '@/i18n';

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
    type: 'typeBank',
    amount: 'USD 98,500',
    reason: 'reasonSanctions',
    status: 'frozen',
    tone: 'red',
  },
  {
    key: '2',
    id: 'TX-849166',
    type: 'typeFx',
    amount: 'EUR 65,000',
    reason: 'reasonPath',
    status: 'pendingRisk',
    tone: 'yellow',
  },
];

export default function TxReview() {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [detail, setDetail] = useState<Row | null>(null);

  return (
    <>
    <div className="ops-layout">
      <Panel title={t('page.txReview.queueTitle')}>
        <OpsTable<Row>
          columns={[
            { title: t('page.txReview.col.id'), key: 'id', render: (r) => <b>{r.id}</b> },
            { title: t('page.txReview.col.ccy'), key: 'type', render: (r) => t(`page.txReview.${r.type}`) },
            { title: t('page.txReview.col.amount'), key: 'amount', render: (r) => r.amount },
            { title: t('page.txReview.col.reason'), key: 'reason', render: (r) => t(`page.txReview.${r.reason}`) },
            { title: t('page.txReview.col.status'), key: 'status', render: (r) => <Chip tone={r.tone}>{t(`page.txReview.status${r.status.charAt(0).toUpperCase()}${r.status.slice(1)}`)}</Chip> },
            {
              title: t('page.txReview.col.action'),
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  {t('action.review')}
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <Panel title={t('page.txReview.reviewTitle')}>
        <NoteBox>{t('page.txReview.reviewNote')}</NoteBox>
        <div className="flex flex-wrap gap-2.5">
          <Button
            className="mini btn-success"
            onClick={() => message.success(t('page.txReview.btnReleaseMsg'))}
          >
            {t('page.txReview.btnRelease')}
          </Button>
          <Button
            className="mini btn-danger"
            onClick={() => message.info(t('page.txReview.btnRejectMsg'))}
          >
            {t('page.txReview.btnReject')}
          </Button>
          <Button
            className="mini btn-ghost"
            onClick={() => message.info(t('page.txReview.btnEscalateMsg'))}
          >
            {t('page.txReview.btnEscalate')}
          </Button>
        </div>
      </Panel>

      <RiskDrawer open={!!detail} onClose={() => setDetail(null)} caseId="RC-202607-1009" />
        </div>
    </>
  );
}
