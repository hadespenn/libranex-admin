import { useState } from 'react';
import { Button } from 'antd';
import { Panel, OpsTable, CardGrid, NoteBox } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers';

const CARDS = [
  {
    title: '限额包',
    desc: '按企业 / KYC 等级 / 通道 / 风险等级配置。',
    btn: '申请变更',
    kind: 'request' as const,
  },
  {
    title: '地区与行业',
    desc: '准入、禁入、风险因子与产品资格。',
    btn: '查看版本',
    kind: 'version' as const,
  },
  {
    title: '数据留存',
    desc: '5 年基线、法律保全与区域化配置。',
    btn: '配置',
    kind: 'retention' as const,
  },
];

const REGION_VERSIONS = [
  { key: 'v24', v: 'v2.4', date: '2026-07-30', region: 'APAC', markets: 'CN / HK / SG / JP', approval: 'CCO approved' },
  { key: 'v23', v: 'v2.3', date: '2026-06-12', region: 'EMEA', markets: 'UK / DE / FR', approval: 'CCO approved' },
  { key: 'v22', v: 'v2.2', date: '2026-05-04', region: 'AMER', markets: 'CA / MX', approval: 'Rolled back' },
];

export default function Config() {
  const [modal, setModal] = useState<null | 'request' | 'version' | 'retention'>(null);

  return (
    <>
      <Panel title="配置中心">
        <NoteBox>
          业务参数、费率、限额、节假日、币种、地区、功能开关、数据留存与报告模板均需版本化、审批、生效时间、回滚与审计。
        </NoteBox>

        <CardGrid
          cards={CARDS}
          render={(c) => (
            <>
              <b style={{ fontSize: 15 }}>{c.title}</b>
              <p className="ops-card-sub">{c.desc}</p>
              <Button
                block
                className="link"
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
        title="限额包变更申请"
        submitText="提交变更"
        toast="限额变更已提交，等待审批。"
        fields={
          [
            {
              name: 'level',
              label: '目标级别',
              type: 'select',
              options: ['按企业', '按 KYC 等级', '按通道'],
            },
            { name: 'caseId', label: '关联案件', type: 'text' },
            { name: 'perTxn', label: '单笔限额', type: 'text', initial: 'USD 100,000' },
            { name: 'perDay', label: '单日限额', type: 'text', initial: 'USD 500,000' },
            {
              name: 'effective',
              label: '生效时间',
              type: 'select',
              options: ['立即', '下个营业日'],
              initial: '下个营业日',
            },
            { name: 'reason', label: '变更说明', type: 'textarea' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'version'}
        onClose={() => setModal(null)}
        title="地区与行业版本"
        submitText="申请切换版本"
        toast="版本切换申请已提交，需 CCO 审批。"
        width={680}
        extra={
          <div style={{ marginTop: 8 }}>
            <OpsTable<(typeof REGION_VERSIONS)[number]>
              columns={[
                { title: '版本', key: 'v', render: (r) => <b>{r.v}</b> },
                { title: '发布日期', key: 'date', render: (r) => r.date },
                { title: '区域', key: 'region', render: (r) => r.region },
                { title: '市场', key: 'markets', render: (r) => r.markets },
                { title: '审批', key: 'approval', render: (r) => r.approval },
              ]}
              data={REGION_VERSIONS}
            />
          </div>
        }
        fields={
          [{ name: 'target', label: '目标版本', type: 'select', options: ['v2.4', 'v2.3', 'v2.2'], initial: 'v2.4' }] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'retention'}
        onClose={() => setModal(null)}
        title="数据留存配置"
        submitText="保存配置"
        toast="留存配置已保存，缩短留存不可回退。"
        note="缩短留存不可回退，请确认合规评估已完成。"
        fields={
          [
            {
              name: 'baseline',
              label: '基础留存',
              type: 'select',
              options: ['5 年基线', '7 年', '10 年'],
              initial: '5 年基线',
            },
            {
              name: 'regional',
              label: '区域化',
              type: 'select',
              options: ['按区域逐项', '关闭'],
              initial: '按区域逐项',
            },
            {
              name: 'legalHold',
              label: 'Legal Hold 范围',
              type: 'select',
              options: ['该案件相关', '客户级所有'],
              initial: '该案件相关',
            },
            {
              name: 'effective',
              label: '生效时间',
              type: 'select',
              options: ['立即', '下个营业日'],
              initial: '下个营业日',
            },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
