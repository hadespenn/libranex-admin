import { useState } from 'react';
import { Button } from 'antd';
import { Panel, Chip, OpsTable, CardGrid } from '@/components/OpsUI';
import { ReleaseModal, type ReleaseField } from '@/drawers';

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
        note="报告生成需选择模板与时间窗，提交后进入双人复核与下载授权。"
        fields={
          [
            {
              name: 'type',
              label: '报告类型',
              type: 'select',
              options: ['KYC 月度汇总', '筛查命中率', '案件处置时效', 'STR 候选清单'],
              initial: 'KYC月度汇总'
            },
            { name: 'window', label: '时间窗', type: 'input', 'placeholder': '2026-07-01 ~ 7-31' },
            { name: 'region', label: '区域', type: 'select', options: ['全部', 'APAC', 'EMEA', 'AMER'], initial: '全部' },
            { name: 'granularity', label: '粒度', type: 'select', options: ['逐笔', '客户级'], initial: '逐笔' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'view'}
        onClose={() => setModal(null)}
        title="运营交易大盘"
        submitText="应用"
        toast="大盘视图已刷新。"
        note="参数用于自定义视图与导出；导出需二次授权。"
        fields={
          [
            {
              name: 'metric',
              label: '指标',
              type: 'select',
              options: ['笔数', '金额', '成功率', '通道分布'],
              initial: "笔数"
            },
            {
              name: 'groupBy',
              label: '分组',
              type: 'select',
              options: ['通道', '币种', '地区', 'KYC 等级'],
              initial: "通道"
            },
            { name: 'window', label: '时间窗', type: 'input', placeholder: '最近24小时'},
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
        submitText="提交访问请求"
        toast="操作已提交，需双人复核。"
        note="所有访问记录留痕；标记 Legal Hold 后相关记录暂停自动删除。"
        fields={
          [
            {
              name: 'operation',
              label: '操作',
              type: 'select',
              options: ['查看证据包', '导出证据包', '标记 Legal Hold', '解除 Legal Hold'],
              initial: "查看证据包"
            },
            { name: 'caseId', label: '案件 ID', type: 'text', placeholder: 'RC-202607-1009' },
            { name: 'reason', label: '理由', type: 'textarea', placeholder: '监管请求/内部审计/诉讼' },
            { name: 'dual', label: '确认双人复核与审计留痕', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'handle'}
        onClose={() => setModal(null)}
        title={`STR Candidate 决策(RC-202607-1009)`}
        submitText="提交决策"
        toast="STR 决策已记录并进入报送队列。"
        note="处理 STR 候选直接影响上报，必须二次 MFA 与审计理由。"
        fields={
          [
            {
              name: 'decision',
              label: '决策',
              type: 'select',
              options: ['上报 STR', '缓报 + 加强监控', '驳回', '升级 CCO'],
              initial: '上报 STR' 
            },
            { name: 'time', label: '截止时间', type: 'input', initial: 'Priority', readonly: true },
            { name: 'reason', label: '理由', type: 'textarea', placeholder: '命中模式、可疑模式、客户背景' },
            { name: 'mfa', label: '已确认二次 MFA', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />

      <ReleaseModal
        open={modal === 'review'}
        onClose={() => setModal(null)}
        title="EFTR 审核"
        submitText="签字确认"
        toast="EFTR 审核意见已签字确认。"
        note="草案审核需签字确认通过后才可提交；驳回必须说明修改要求。"
        fields={
          [
            { name: 'type', label: '类型', type: 'input', initial: 'EFTR', readonly: true },
            { name: 'trigger', label: '触发', type: 'input', initial: '跨境阈值超额', readonly: true },
            { name: 'comment', label: '审核意见', type: 'textarea', placeholder: '同意/需补字段/需重做' },
            { name: 'sign', label: '签字确认', type: 'checkbox' },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
