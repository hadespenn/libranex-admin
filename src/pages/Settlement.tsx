import { useState } from 'react';
import { Button } from 'antd';
import { Panel, Chip, OpsTable, CardGrid, NoteBox } from '@/components/OpsUI';
import { SettlementDrawer, ReleaseModal, type ReleaseField } from '@/drawers';
import { useI18n } from '@/i18n';

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
    status: 'diff',
    tone: 'yellow',
    action: 'investigate',
  },
  {
    key: '2',
    batch: 'SET-20260730-02',
    partner: 'SG FAST Partner',
    ccy: 'SGD',
    amount: '920,411.00',
    status: 'matched',
    tone: 'green',
    action: 'view',
  },
];

const LIQUIDITY = [
  { title: 'USD', available: 'Available $2.8M', status: 'Healthy', tone: 'green' as const },
  { title: 'SGD', available: 'Available $0.42M', status: 'Warning', tone: 'yellow' as const },
  { title: 'EUR', available: 'Available €1.9M', status: 'Healthy', tone: 'green' as const },
];

const RELEASE = [
  {
    key: 'fiat',
    countN: 2,
    countKey: 'page.settlement.countPendingRelease',
    fields: [
      {
        name: 'batch',
        labelKey: 'page.settlement.labelBatch',
        type: 'select',
        options: ['STL-20260811-01', 'STL-20260810-07'],
        initial: 'STL-20260811-01',
      },
      {
        name: 'target',
        labelKey: 'page.settlement.labelTarget',
        type: 'select',
        options: ['Payment Account', 'Safeguarding', 'Downstream', 'Bank'],
        initial: 'Payment Account',
      },
      { name: 'amount', labelKey: 'page.settlement.labelAmount', type: 'number', initial: 120000 },
    ],
  },
  {
    key: 'seg',
    countN: 1,
    countKey: 'page.settlement.countPendingFree',
    fields: [
      {
        name: 'reason',
        labelKey: 'page.settlement.labelReason',
        type: 'select',
        options: ['Customer settlement completed', 'Account closure', 'Regulatory release'],
        initial: 'Customer settlement completed',
      },
      { name: 'amount', labelKey: 'page.settlement.labelAmount', type: 'number', initial: 80000 },
    ],
  },
  {
    key: 'crypto',
    countN: 1,
    countKey: 'page.settlement.countPendingRelease',
    fields: [
      {
        name: 'batch',
        labelKey: 'page.settlement.labelBatchShort',
        type: 'select',
        options: ['CSTL-20260811-03', 'CSTL-20260810-02'],
        initial: 'CSTL-20260811-03',
      },
      {
        name: 'target',
        labelKey: 'page.settlement.labelTarget',
        type: 'select',
        options: ['Crypto Payment', 'Crypto Safeguarding', 'Downstream'],
        initial: 'Crypto Payment',
      },
      { name: 'amount', labelKey: 'page.settlement.labelAmount', type: 'number', initial: 85000 },
    ],
  },
  {
    key: 'cryptoSafe',
    countN: 1,
    countKey: 'page.settlement.countPendingFree',
    fields: [
      { name: 'asset', labelKey: 'page.settlement.labelAsset', type: 'select', options: ['USDT', 'USDC'], initial: 'USDT' },
      { name: 'network', labelKey: 'page.settlement.labelNetwork', type: 'select', options: ['TRC20', 'ERC20'], initial: 'TRC20' },
      {
        name: 'reason',
        labelKey: 'page.settlement.labelReason',
        type: 'input',
        placeholder: 'Release condition met',
      },
    ],
  },
];

export default function Settlement() {
  const { t } = useI18n();
  const [detail, setDetail] = useState<Row | null>(null);
  const [release, setRelease] = useState<(typeof RELEASE)[number] | null>(null);

  const releaseItems = RELEASE.map((r) => ({
    ...r,
    title: t(`page.settlement.release.${r.key}.title`),
    desc: t(`page.settlement.release.${r.key}.desc`),
    btn: t(`page.settlement.release.${r.key}.btn`),
    tip: t(`page.settlement.release.${r.key}.tip`),
    toast: t(`page.settlement.release.${r.key}.toast`),
    count: t(r.countKey, { n: r.countN }),
    fields: r.fields.map((f) => ({ ...f, label: t(f.labelKey) })) as unknown as ReleaseField[],
  }));

  return (
    <>
      <div className="ops-layout">
        <Panel title={t('page.settlement.title')}>
          <OpsTable<Row>
            columns={[
              { title: t('page.settlement.colBatch.batch'), key: 'batch', render: (r) => <b>{r.batch}</b> },
              { title: t('page.settlement.colBatch.partner'), key: 'partner', render: (r) => r.partner },
              { title: t('page.settlement.colBatch.ccy'), key: 'ccy', render: (r) => r.ccy },
              { title: t('page.settlement.colBatch.net'), key: 'amount', render: (r) => r.amount },
              {
                title: t('page.settlement.colBatch.status'),
                key: 'status',
                render: (r) => <Chip tone={r.tone}>{t(`page.settlement.reconStatus.${r.status}`)}</Chip>,
              },
              {
                title: t('page.settlement.colBatch.action'),
                key: 'action',
                render: (r) => (
                  <button className="link" onClick={() => setDetail(r)}>
                    {r.action === 'view' ? t('action.view') : t('page.settlement.actionInvestigate')}
                  </button>
                ),
              },
            ]}
            data={DATA}
          />
        </Panel>

        <Panel title={t('page.settlement.liquidityTitle')}>
          <CardGrid
            cards={LIQUIDITY}
            render={(c) => (
              <>
                <div className="flex items-center justify-between mb-6.5">
                  <b>{c.title}</b>    
                </div>
                <p className="ops-card-sub">{c.available}</p>
                <div>
                <Chip tone={c.tone}>{c.status}</Chip>
                </div>
              </>
            )}
          />
        </Panel>
      </div>

      <Panel
        title={t('page.settlement.releaseTitle')}
        desc=""
        actions={<Chip tone="blue">{t('page.settlement.releaseChip')}</Chip>}
        wide
      >
        <CardGrid
          cols={4}
          cards={releaseItems}
          render={(c) => (
            <>
              <div className="flex items-center justify-between gap-2">
                <b>{c.title}</b>
                <Chip tone="yellow">{c.count}</Chip>
              </div>
              <p className="ops-card-sub">{c.desc}</p>
              <Button
                block
                className="btn-primary mini mt-2"
                onClick={() => setRelease(c)}
              >
                {c.btn}
              </Button>
            </>
          )}
        />

        <NoteBox tone="info">{t('page.settlement.releaseNote')}</NoteBox>
      </Panel>

      <SettlementDrawer open={!!detail} onClose={() => setDetail(null)} batch={detail?.batch} />

      <ReleaseModal
        open={!!release}
        onClose={() => setRelease(null)}
        title={`${release?.title ?? ''} · ${release?.btn ?? ''}`}
        fields={release?.fields ?? []}
        submitText={release?.btn ?? t('common.submit')}
        toast={release?.toast ?? ''}
        note={release?.tip}
      />
    </>
  );
}
