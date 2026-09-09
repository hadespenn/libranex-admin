import { useState } from 'react';
import { Button } from 'antd';
import { Panel, OpsTable, CardGrid, NoteBox } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers';
import { useI18n } from '@/i18n';

const REGION_VERSIONS = [
  { key: 'v24', v: 'v2.4', date: '2026-07-30', region: 'APAC', markets: 'CN / HK / SG / JP', approval: 'CCO approved' },
  { key: 'v23', v: 'v2.3', date: '2026-06-12', region: 'EMEA', markets: 'UK / DE / FR', approval: 'CCO approved' },
  { key: 'v22', v: 'v2.2', date: '2026-05-04', region: 'AMER', markets: 'CA / MX', approval: 'Rolled back' },
];

export default function Config() {
  const { t } = useI18n();
  const [modal, setModal] = useState<null | 'request' | 'version' | 'retention'>(null);

  const CARDS = [
    {
      title: t('page.config.cardLimit.title'),
      desc: t('page.config.cardLimit.desc'),
      btn: t('page.config.cardLimit.btn'),
      kind: 'request' as const,
    },
    {
      title: t('page.config.cardRegion.title'),
      desc: t('page.config.cardRegion.desc'),
      btn: t('page.config.cardRegion.btn'),
      kind: 'version' as const,
    },
    {
      title: t('page.config.cardRetention.title'),
      desc: t('page.config.cardRetention.desc'),
      btn: t('page.config.cardRetention.btn'),
      kind: 'retention' as const,
    },
  ];

  return (
    <>
      <Panel title={t('page.config.title')}>
        <p>{t('page.config.intro')}</p>

        <CardGrid
          cards={CARDS}
          render={(c) => (
            <>
              <b className="text-[15px]">{c.title}</b>
              <p className="ops-card-sub">{c.desc}</p>
              <Button
                block
                className="link"
                style={{ width: '120px' }}
                onClick={() => setModal(c.kind)}
              >
                {c.btn}
              </Button>
            </>
          )}
        />
      </Panel>

      <ReleaseModal
        open={modal === 'request'}
        onClose={() => setModal(null)}
        title={t('page.config.request.title')}
        submitText={t('page.config.request.submit')}
        toast={t('page.config.request.toast')}
        note={t('page.config.request.note')}
        fields={
          [
            {
              name: 'level',
              label: t('page.config.request.labelLevel'),
              type: 'select',
              options: [
                t('page.config.request.levelEntity'),
                t('page.config.request.levelKyc'),
                t('page.config.request.levelChannel'),
              ],
              initial: t('page.config.request.levelEntity'),
            },
            { name: 'caseId', label: t('page.config.request.labelCase'), type: 'text', placeholder: 'RC-' },
            { name: 'perTxn', label: t('page.config.request.labelPerTxn'), type: 'text', placeholder: '例： 50,000' },
            { name: 'perDay', label: t('page.config.request.labelPerDay'), type: 'text', placeholder: '例： 200,000' },
            {
              name: 'effective',
              label: t('page.config.request.labelEffective'),
              type: 'select',
              options: [
                t('page.config.request.effectiveNow'),
                t('page.config.request.effectiveNextDay'),
              ],
              initial: t('page.config.request.effectiveNow'),
            },
            { name: 'reason', label: t('page.config.request.labelReason'), type: 'textarea', placeholder: t('page.config.request.labelPlace') },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'version'}
        onClose={() => setModal(null)}
        title={t('page.config.version.title')}
        submitText={t('page.config.version.submit')}
        toast={t('page.config.version.toast')}
        note={t('page.config.version.note')}
        width={680}
        extra={
          <div className="mt-2">
            <OpsTable<(typeof REGION_VERSIONS)[number]>
              columns={[
                { title: t('page.config.colRegions.status'), key: 'v', render: (r) => <b>{r.v}</b> },
                { title: t('page.config.colEffectiveDate'), key: 'date', render: (r) => r.date },
                { title: t('page.config.colRegions.region'), key: 'region', render: (r) => r.region },
                { title: t('page.config.colMarkets'), key: 'markets', render: (r) => r.markets },
                { title: t('page.rules.colApproval'), key: 'approval', render: (r) => r.approval },
              ]}
              data={REGION_VERSIONS}
            />
          </div>
        }
        fields={
          [
            {
              name: 'target',
              label: t('page.config.version.labelTarget'),
              type: 'select',
              options: ['v2.4', 'v2.3', 'v2.2'],
              initial: 'v2.4',
            },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'retention'}
        onClose={() => setModal(null)}
        title={t('page.config.retention.title')}
        submitText={t('page.config.retention.submit')}
        toast={t('page.config.retention.toast')}
        note={t('page.config.retention.note')}
        fields={
          [
            {
              name: 'baseline',
              label: t('page.config.retention.labelBaseline'),
              type: 'select',
              options: [
                t('page.config.retention.baseline5'),
                t('page.config.retention.baseline7'),
                t('page.config.retention.baseline10'),
              ],
              initial: t('page.config.retention.baseline5'),
            },
            {
              name: 'regional',
              label: t('page.config.retention.labelRegional'),
              type: 'select',
              options: [
                t('page.config.retention.regionalPer'),
                t('page.config.retention.regionalOff'),
              ],
              initial: t('page.config.retention.regionalPer'),
            },
            {
              name: 'legalHold',
              label: t('page.config.retention.labelLegalHold'),
              type: 'select',
              options: [
                t('page.config.retention.holdCase'),
                t('page.config.retention.holdCustomer'),
              ],
              initial: t('page.config.retention.holdCase'),
            },
            {
              name: 'effective',
              label: t('page.config.retention.labelEffective'),
              type: 'select',
              options: [
                t('page.config.request.effectiveNow'),
                t('page.config.request.effectiveNextDay'),
              ],
              initial: t('page.config.request.effectiveNow'),
            },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
