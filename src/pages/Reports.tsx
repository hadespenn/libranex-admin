import { useState } from 'react';
import { Button } from 'antd';
import { Panel, Chip, OpsTable, CardGrid } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers';
import { useI18n } from '@/i18n';

type Row = {
  key: string;
  type: string;
  trigger: string;
  due: string;
  status: string;
  tone: 'red' | 'yellow';
  action: string;
};

const DATA: Row[] = [
  {
    key: '1',
    type: 'STR Candidate',
    trigger: 'RC-202607-1009',
    due: 'Priority',
    status: 'Decision needed',
    tone: 'red',
    action: 'handle',
  },
  {
    key: '2',
    type: 'EFTR',
    trigger: 'International EFT threshold',
    due: '5 business days',
    status: 'Draft',
    tone: 'yellow',
    action: 'review',
  },
];

export default function Reports() {
  const { t } = useI18n();
  const [modal, setModal] = useState<null | 'create' | 'view' | 'access' | 'handle' | 'review'>(null);

  const CARDS = [
    {
      title: t('page.reports.cardCompliance.title'),
      desc: t('page.reports.cardCompliance.desc'),
      btn: t('page.reports.cardCompliance.btn'),
      kind: 'create' as const,
    },
    {
      title: t('page.reports.cardOps.title'),
      desc: t('page.reports.cardOps.desc'),
      btn: t('page.reports.cardOps.btn'),
      kind: 'view' as const,
    },
    {
      title: t('page.reports.cardAudit.title'),
      desc: t('page.reports.cardAudit.desc'),
      btn: t('page.reports.cardAudit.btn'),
      kind: 'access' as const,
    },
  ];

  return (
    <>
      <CardGrid
        cards={CARDS}
        render={(c) => (
          <>
            <b className="text-[15px]">{c.title}</b>
            <p className="ops-card-sub">{c.desc}</p>
            <Button
              block
              className="link"
              style={{ width: '80px' }}
              onClick={() => setModal(c.kind)}
            >
              {c.btn}
            </Button>
          </>
        )}
      />

      <Panel title={t('page.reports.regTaskTitle')}>
        <OpsTable<Row>
          columns={[
            { title: t('page.reports.colType'), key: 'type', render: (r) => <b>{r.type}</b> },
            { title: t('page.reports.colTrigger'), key: 'trigger', render: (r) => r.trigger },
            { title: t('page.reports.colDue'), key: 'due', render: (r) => r.due },
            { title: t('page.reports.col.status'), key: 'status', render: (r) => <Chip tone={r.tone}>{r.status}</Chip> },
            {
              title: t('page.reports.col.action'),
              key: 'action',
              render: (r) => (
                <button
                  className="link"
                  onClick={() => setModal(r.action === 'handle' ? 'handle' : 'review')}
                >
                  {r.action === 'handle' ? t('action.handle') : t('common.audit')}
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <ReleaseModal
        open={modal === 'create'}
        onClose={() => setModal(null)}
        title={t('page.reports.create.title')}
        submitText={t('page.reports.create.submit')}
        toast={t('page.reports.create.toast')}
        note={t('page.reports.create.note')}
        fields={
          [
            {
              name: 'type',
              label: t('page.reports.create.labelType'),
              type: 'select',
              options: [
                t('page.reports.create.typeKyc'),
                t('page.reports.create.typeScreen'),
                t('page.reports.create.typeCase'),
                t('page.reports.create.typeStr'),
              ],
              initial: t('page.reports.create.typeKyc'),
            },
            { name: 'window', label: t('page.reports.create.labelWindow'), type: 'text', placeholder: '2026-07-01 ~ 7-31' },
            {
              name: 'region',
              label: t('page.reports.create.labelRegion'),
              type: 'select',
              options: [t('page.reports.create.regionAll'), 'APAC', 'EMEA', 'AMER'],
              initial: t('page.reports.create.regionAll'),
            },
            {
              name: 'granularity',
              label: t('page.reports.create.labelGranularity'),
              type: 'select',
              options: [
                t('page.reports.create.granularityTxn'),
                t('page.reports.create.granularityCustomer'),
              ],
              initial: t('page.reports.create.granularityTxn'),
            },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'view'}
        onClose={() => setModal(null)}
        title={t('page.reports.view.title')}
        submitText={t('page.reports.view.submit')}
        toast={t('page.reports.view.toast')}
        note={t('page.reports.view.note')}
        fields={
          [
            {
              name: 'metric',
              label: t('page.reports.view.labelMetric'),
              type: 'select',
              options: [
                t('page.reports.view.metricCount'),
                t('page.reports.view.metricAmount'),
                t('page.reports.view.metricSuccess'),
                t('page.reports.view.metricChannel'),
              ],
              initial: t('page.reports.view.metricCount'),
            },
            {
              name: 'groupBy',
              label: t('page.reports.view.labelGroupBy'),
              type: 'select',
              options: [
                t('page.reports.view.groupChannel'),
                t('page.reports.view.groupCcy'),
                t('page.reports.view.groupRegion'),
                t('page.reports.view.groupKyc'),
              ],
              initial: t('page.reports.view.groupChannel'),
            },
            { name: 'window', label: t('page.reports.view.labelWindow'), type: 'text', placeholder: t('page.reports.view.refreshManual') },
            {
              name: 'refresh',
              label: t('page.reports.view.labelRefresh'),
              type: 'select',
              options: [
                t('page.reports.view.refreshRealTime'),
                t('page.reports.view.refresh5m'),
                t('page.reports.view.refreshManual'),
              ],
              initial: t('page.reports.view.refreshRealTime'),
            },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'access'}
        onClose={() => setModal(null)}
        title={t('page.reports.access.title')}
        submitText={t('page.reports.access.submit')}
        toast={t('page.reports.access.toast')}
        note={t('page.reports.access.note')}
        fields={
          [
            {
              name: 'operation',
              label: t('page.reports.access.labelOperation'),
              type: 'select',
              options: [
                t('page.reports.access.opView'),
                t('page.reports.access.opExport'),
                t('page.reports.access.opMarkHold'),
                t('page.reports.access.opReleaseHold'),
              ],
              initial: t('page.reports.access.opView'),
            },
            { name: 'caseId', label: t('page.reports.access.labelCase'), type: 'text', placeholder: 'RC-202607-1009' },
            {
              name: 'reason',
              label: t('page.reports.access.labelReason'),
              type: 'textarea',
              placeholder: t('page.reports.access.reasonPlaceholder'),
            },
            { name: 'dual', label: t('page.reports.access.labelDual'), type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'handle'}
        onClose={() => setModal(null)}
        title={t('page.reports.handle.title')}
        submitText={t('page.reports.handle.submit')}
        toast={t('page.reports.handle.toast')}
        note={t('page.reports.handle.note')}
        fields={
          [
            {
              name: 'decision',
              label: t('page.reports.handle.labelDecision'),
              type: 'select',
              options: [
                t('page.reports.handle.decisionReport'),
                t('page.reports.handle.decisionDefer'),
                t('page.reports.handle.decisionReject'),
                t('page.reports.handle.decisionEscalate'),
              ],
              initial: t('page.reports.handle.decisionReport'),
            },
            { name: 'time', label: t('page.reports.handle.labelDue'), type: 'text', initial: 'Priority', readOnly: true },
            {
              name: 'reason',
              label: t('page.reports.handle.labelReason'),
              type: 'textarea',
              placeholder: t('page.reports.handle.reasonPlaceholder'),
            },
            { name: 'mfa', label: t('page.reports.handle.labelMfa'), type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'review'}
        onClose={() => setModal(null)}
        title={t('page.reports.review.title')}
        submitText={t('page.reports.review.submit')}
        toast={t('page.reports.review.toast')}
        note={t('page.reports.review.note')}
        fields={
          [
            { name: 'type', label: t('page.reports.review.labelType'), type: 'text', initial: 'EFTR', readOnly: true },
            {
              name: 'trigger',
              label: t('page.reports.review.labelTrigger'),
              type: 'text',
              initial: t('page.reports.review.triggerValue'),
              readOnly: true,
            },
            {
              name: 'comment',
              label: t('page.reports.review.labelComment'),
              type: 'textarea',
              placeholder: t('page.reports.review.commentPlaceholder'),
            },
            { name: 'sign', label: t('page.reports.review.labelSign'), type: 'checkbox' },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
