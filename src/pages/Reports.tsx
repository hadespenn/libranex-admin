import { useState } from 'react';
import { Button } from 'antd';
import { Panel, Chip, OpsTable, CardGrid } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers/Drawers';

const CARDS = [
  {
    title: '合规与风险报告',
    desc: 'KYC、筛查、案件、处置时效、STR 候选。',
    btn: '生成',
    kind: 'create' as const,
  },
  {
    title: '运营交易大盘',
    desc: '笔数、金额、成功率、通道、币种、地区。',
    btn: '查看',
    kind: 'view' as const,
  },
  {
    title: '审计与法律保全',
    desc: '操作日志、证据包、Legal Hold、导出审批。',
    btn: '访问',
    kind: 'access' as const,
  },
];

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
    action: '处理',
  },
  {
    key: '2',
    type: 'EFTR',
    trigger: 'International EFT threshold',
    due: '5 business days',
    status: 'Draft',
    tone: 'yellow',
    action: '审核',
  },
];

export default function Reports() {
  const [modal, setModal] = useState<null | 'create' | 'view' | 'access' | 'handle' | 'review'>(null);

  return (
    <>
      <CardGrid
        cards={CARDS}
        render={(c) => (
          <>
            <b style={{ fontSize: 15 }}>{c.title}</b>
            <p className="ops-card-sub">{c.desc}</p>
            <Button
              block
              style={{
                marginTop: 8,
                borderRadius: 999,
                background: '#b8932e',
                borderColor: '#b8932e',
                color: '#fff',
                fontSize: 12,
              }}
              onClick={() => setModal(c.kind)}
            >
              {c.btn}
            </Button>
          </>
        )}
      />

      <Panel title="监管报告任务">
        <OpsTable<Row>
          columns={[
            { title: '报告类型', key: 'type', render: (r) => <b>{r.type}</b> },
            { title: '触发条件', key: 'trigger', render: (r) => r.trigger },
            { title: '截止时间', key: 'due', render: (r) => r.due },
            { title: '状态', key: 'status', render: (r) => <Chip tone={r.tone}>{r.status}</Chip> },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button
                  className="link"
                  onClick={() => setModal(r.action === '处理' ? 'handle' : 'review')}
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
        open={modal === 'create'}
        onClose={() => setModal(null)}
        title="生成合规与风险报告"
        submitText="生成"
        toast="报告生成任务已提交，完成后将通知。"
        fields={
          [
            {
              name: 'type',
              label: '报告类型',
              type: 'select',
              options: ['KYC 月度汇总', '筛查命中率', '案件处置时效', 'STR 候选'],
            },
            { name: 'window', label: '时间窗', type: 'select', options: ['近 7 天', '近 30 天', '本季度', '自定义'] },
            { name: 'region', label: '区域', type: 'select', options: ['全部', 'APAC', 'EMEA', 'AMER'] },
            { name: 'granularity', label: '粒度', type: 'select', options: ['逐笔', '客户级'] },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'view'}
        onClose={() => setModal(null)}
        title="运营交易大盘"
        submitText="应用"
        toast="大盘视图已刷新。"
        fields={
          [
            {
              name: 'metric',
              label: '指标',
              type: 'select',
              options: ['笔数', '金额', '成功率', '通道分布'],
            },
            {
              name: 'groupBy',
              label: '分组',
              type: 'select',
              options: ['通道', '币种', '地区', 'KYC 等级'],
            },
            { name: 'window', label: '时间窗', type: 'select', options: ['今日', '近 7 天', '近 30 天'] },
            {
              name: 'refresh',
              label: '刷新频率',
              type: 'select',
              options: ['实时', '5 分钟', '手动'],
              initial: '实时',
            },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'access'}
        onClose={() => setModal(null)}
        title="审计与法律保全"
        submitText="提交"
        toast="操作已提交，需双人复核。"
        note="导出证据包与 Legal Hold 操作均记录审计轨迹。"
        fields={
          [
            {
              name: 'operation',
              label: '操作',
              type: 'select',
              options: ['查看日志', '导出证据包', '标记 Legal Hold', '解除 Legal Hold'],
            },
            { name: 'caseId', label: '案件 ID', type: 'text', initial: 'RC-202607-1009' },
            { name: 'reason', label: '理由', type: 'textarea' },
            { name: 'dual', label: '已获得双人复核', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'handle'}
        onClose={() => setModal(null)}
        title="STR Candidate 决策"
        submitText="提交决策"
        toast="STR 决策已记录并进入报送队列。"
        note="STR 候选受 need-to-know 控制，不得对客披露。"
        summary={[
          { label: '关联案件', value: 'RC-202607-1009' },
          { label: '截止时间', value: 'Priority（不可修改）' },
        ]}
        fields={
          [
            {
              name: 'decision',
              label: '决策',
              type: 'select',
              options: ['上报 STR', '缓报 + 加强监控', '驳回', '升级 CCO'],
            },
            { name: 'reason', label: '理由', type: 'textarea' },
            { name: 'mfa', label: '已通过 MFA 二次确认', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'review'}
        onClose={() => setModal(null)}
        title="EFTR 审核"
        submitText="签字确认"
        toast="EFTR 审核意见已签字确认。"
        summary={[
          { label: '类型', value: 'EFTR（不可修改）' },
          { label: '触发条件', value: '跨境阈值超额（不可修改）' },
        ]}
        fields={
          [
            { name: 'comment', label: '审核意见', type: 'textarea' },
            { name: 'sign', label: '确认签字', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
