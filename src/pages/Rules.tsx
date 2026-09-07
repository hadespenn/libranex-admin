import { useState } from 'react';
import { Button } from 'antd';
import { Panel, Chip, OpsTable, CardGrid } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers';
import { useI18n } from '@/i18n';

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
    name: 'rule24h',
    version: 'v1.8',
    status: 'Production',
    tone: 'green',
    policy: 'CAD 10,000',
    hits: 24,
    approval: 'Dual approved',
    action: 'edit',
  },
  {
    key: '2',
    name: 'ruleSanction',
    version: 'v3.4',
    status: 'Production',
    tone: 'green',
    policy: 'Potential match → pause',
    hits: 6,
    approval: 'CCO approved',
    action: 'view',
  },
  {
    key: '3',
    name: 'ruleDevice',
    version: 'v2.1',
    status: 'Grey rollout',
    tone: 'blue',
    policy: 'Shared device graph',
    hits: 18,
    approval: 'Pending review',
    action: 'approve',
  },
];

const VERSIONS = [
  { key: 'v34', v: 'v3.4', date: '2026-07-22', state: 'Production', hits: '6', approval: 'CCO approved' },
  { key: 'v33', v: 'v3.3', date: '2026-06-18', state: 'Deprecated', hits: '—', approval: 'CCO approved' },
  { key: 'v32', v: 'v3.2', date: '2026-05-09', state: 'Rolled back', hits: '—', approval: 'Dual approved' },
];

export default function Rules() {
  const { t } = useI18n();
  const [modal, setModal] = useState<null | 'create' | 'edit' | 'view' | 'approve'>(null);
  const [row, setRow] = useState<Row | null>(null);

  const open = (kind: NonNullable<typeof modal>, r?: Row) => {
    setRow(r ?? null);
    setModal(kind);
  };

  const SIM_METRICS = [
    { title: t('page.rules.sandbox') + '0.14%', sub: t('page.rules.simHitRate') },
    { title: t('page.rules.simFpVal'), sub: t('page.rules.simFp') },
    { title: "< " + t('page.reports.view.refresh5m'), sub: t('page.rules.simRollback') },
  ];

  return (
    <>
      <Panel
        title={t('page.rules.panelTitle')}
        actions={
          <Button
            className="mini btn-primary"
            onClick={() => open('create')}
          >
            {t('page.rules.createBtn')}
          </Button>
        }
      >
        <OpsTable<Row>
          columns={[
            { title: t('page.rules.colList.name'), key: 'name', render: (r) => <b>{t(`page.rules.${r.name}`)}</b> },
            { title: t('page.rules.colVer.version'), key: 'version', render: (r) => r.version },
            { title: t('page.rules.colVer.status'), key: 'status', render: (r) => <Chip tone={r.tone}>{r.status}</Chip> },
            { title: t('page.rules.colPolicy'), key: 'policy', render: (r) => r.policy },
            { title: t('page.rules.colHits'), key: 'hits', render: (r) => r.hits },
            { title: t('page.rules.colApproval'), key: 'approval', render: (r) => r.approval },
            {
              title: t('page.rules.colList.action'),
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => open(r.action as 'edit' | 'view' | 'approve', r)}>
                  {r.action === 'edit'
                    ? t('page.rules.actionSimulate')
                    : r.action === 'view'
                      ? t('action.view')
                      : t('page.rules.actionApprove')}
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
        title={t('page.rules.create.title')}
        desc={t('page.rules.create.desc')}
        submitText={t('page.rules.create.submit')}
        toast={t('page.rules.create.toast')}
        reverseFooter
        fields={
          [
            {
              name: 'type',
              label: t('page.rules.create.labelType'),
              type: 'select',
              options: [
                t('page.rules.rule24h'),
                t('page.rules.create.typeSanction'),
                t('page.rules.create.typeDevice'),
                t('page.rules.create.typeBehavior'),
              ],
              initial: t('page.rules.rule24h')
            },
            { name: 'name', label: t('page.rules.create.labelName'), type: 'text', placeholder: t('page.rules.create.placerule') },
            {
              name: 'scope',
              label: t('page.rules.create.labelScope'),
              type: 'text',
              placeholder: t('page.rules.create.placeScope'),
            },
            { name: 'threshold', label: t('page.rules.create.labelThreshold'), type: 'text', placeholder: t('page.rules.create.placeThreshold') },
            {
              name: 'hitAction',
              label: t('page.rules.create.labelHitAction'),
              type: 'select',
              options: [
                t('page.rules.create.hitActionPause'),
                t('page.rules.create.hitActionHold'),
                t('page.rules.create.hitActionAlert'),
              ],
              initial: t('page.rules.create.hitActionPause'),
            },
            {
              name: 'chain',
              label: t('page.rules.create.labelChain'),
              type: 'select',
              options: [
                t('page.rules.create.chainCco'),
                t('page.rules.create.chainDual'),
                t('page.rules.create.chainCcoLegal'),
              ],
              initial: t('page.rules.create.chainCco'),
            },
            { name: 'change', label: t('page.rules.create.labelChange'), type: 'textarea', placeholder: t('page.rules.create.placeChange') },
            { name: 'impact', label: t('page.rules.create.labelImpact'), type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'edit'}
        onClose={() => setModal(null)}
        title={t('page.rules.edit.titleTpl', {
          name: row ? t(`page.rules.${row.name}`) : '',
          version: row?.version ?? '',
        })}
        submitText={t('page.rules.edit.submit')}
        toast={t('page.rules.edit.toast')}
        note={t('page.rules.edit.note')}
        extra={
          <div className="mt-2">
            <CardGrid
              cards={SIM_METRICS}
              render={(c) => (
                <>
                  <p className="ops-card-sub">{c.sub}</p>
                  <b className="text-[18px] text-[#142d42]">{c.title}</b> 
                </>
              )}
            />
          </div>
        }
        fields={
          [
            { name: 'baseVer', label: t('page.rules.edit.labelBase'), type: 'text', initial: 'v1.8 Production', readOnly: true },
            { name: 'draftTag', label: t('page.rules.edit.labelDraftTag'), type: 'text', placeholder: 'v1.9-draft-rc' },
            {
              name: 'window',
              label: t('page.rules.edit.labelWindow'),
              type: 'select',
              options: [
                t('page.rules.edit.windowReplay'),
                t('page.rules.edit.windowShadow'),
                t('page.rules.edit.windowInstant'),
              ],
              initial: t('page.rules.edit.windowReplay'),
            },
            { name: 'metrics', label: t('page.rules.edit.labelMetrics'), type: 'text', placeholder: t('page.rules.simHitRate') + ' / ' + t('page.rules.simFp') },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'view'}
        onClose={() => setModal(null)}
        title={t('page.rules.view.titleTpl', {
          name: row ? t(`page.rules.${row.name}`) : '',
          version: row?.version ?? '',
        })}
        submitText={t('page.rules.view.submit')}
        toast={t('page.rules.view.toast')}
        note={t('page.rules.view.note')}
        onSubmit={() => {
          setModal(null);
          setTimeout(() => setModal('edit'), 0);
        }}
        width={640}
        extra={
          <div className="mt-2">
            <OpsTable<(typeof VERSIONS)[number]>
              columns={[
                { title: t('page.rules.colVer.version'), key: 'v', render: (r) => <b>{r.v}</b> },
                { title: t('page.rules.colEffective'), key: 'date', render: (r) => r.date },
                {
                  title: t('page.rules.colVer.status'),
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
                { title: t('page.rules.colHits'), key: 'hits', render: (r) => r.hits },
                { title: t('page.rules.colApproval'), key: 'approval', render: (r) => r.approval },
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
        title={t('page.rules.approve.titleTpl', { name: row ? t(`page.rules.${row.name}`) + ' ' + row?.version : '' })}
        submitText={t('page.rules.approve.submit')}
        toast={t('page.rules.approve.toast')}
        rejectText={t('page.rules.approve.rejectSubmit')}
        rejectToast={t('page.rules.approve.rejectToast')}
        note={t('page.rules.approve.note')}
        cols={3}
        summary={[
          { label: t('page.rules.approve.sumVersion'), value: row?.version ?? 'v2.1' },
          { label: t('page.rules.approve.sumStatus'), value: t('page.rules.approve.statusCanary') },
          { label: t('page.rules.approve.sumHits'), value: String(row?.hits ?? 18) },
        ]}
        fields={
          [
            { name: 'comment', label: t('page.rules.approve.labelComment'), type: 'textarea', placeholder: t('page.rules.approve.commentPlace') },
            { name: 'mfa', label: t('page.rules.approve.labelMfa'), type: 'checkbox' },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
