import { useState } from 'react';
import { Drawer, Button, Modal, Input, Select, InputNumber, Checkbox, App as AntdApp, Form } from 'antd';
import type { ReactNode } from 'react';
import { Chip, DataList, NoteBox, OpsTable, Timeline } from '@/components/OpsUI';
import type { ChipTone } from '@/theme';

const BTN = { borderRadius: 999, fontSize: 12, padding: '7px 10px' } as const;

/* ============================================================
   KYC 客户 360
   ============================================================ */
export function KycDrawer({
  open,
  onClose,
  name = 'Atlas Commerce Ltd.',
  kyId = 'KY-202607-1042',
  jurisdiction = 'Singapore',
}: {
  open: boolean;
  onClose: () => void;
  name?: string;
  kyId?: string;
  jurisdiction?: string;
}) {
  const { message } = AntdApp.useApp();
  const [tab, setTab] = useState('d-profile');

  const tabs = [
    { key: 'd-profile', label: '企业资料' },
    { key: 'd-docs', label: '材料核验' },
    { key: 'd-ubo', label: 'UBO 图谱' },
    { key: 'd-screen', label: '筛查' },
    { key: 'd-score', label: '风险 / EDD' },
    { key: 'd-decision', label: '审核决定' },
  ];

  const docs: {
    key: string;
    name: string;
    version: string;
    hash: string;
    check: string;
    result: string;
  }[] = [
    { key: '1', name: '注册证明', version: 'v2', hash: 'hash retained', check: 'Entity registry matched', result: '通过' },
    { key: '2', name: '地址证明', version: 'v1', hash: '—', check: 'Expired 3 days', result: '需补件' },
    { key: '3', name: '授权决议', version: 'v1', hash: '—', check: 'Signer mismatch', result: '不一致' },
  ];

  const resultTone = (r: string): ChipTone =>
    r === '通过' ? 'green' : r === '需补件' ? 'yellow' : 'red';

  return (
    <Drawer
      title={`KYC 客户 360 · ${name}`}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnClose
    >
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '14px 0' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              border: '1px solid #dce5eb',
              background: tab === t.key ? '#173c59' : '#fff',
              color: tab === t.key ? '#fff' : '#52687d',
              borderRadius: 999,
              padding: '7px 10px',
              fontSize: 12,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'd-profile' && (
        <>
          <DataList
            items={[
              { label: 'Legal name', value: name },
              { label: 'Jurisdiction', value: jurisdiction },
              { label: 'Industry', value: 'Cross-border e-commerce' },
              { label: 'Expected volume', value: 'USD 5M–20M / year' },
              { label: 'KYC ID', value: kyId },
            ]}
          />
          <NoteBox tone="info">资料版本快照，敏感字段需记录访问理由。</NoteBox>
        </>
      )}

      {tab === 'd-docs' && (
        <>
          <OpsTable
            columns={[
              { title: '材料', key: 'name', render: (r) => r.name },
              { title: '版本', key: 'version', render: (r) => r.version },
              { title: '核验', key: 'check', render: (r) => r.check },
              {
                title: '结论',
                key: 'result',
                render: (r) => <Chip tone={resultTone(r.result)}>{r.result}</Chip>,
              },
            ]}
            data={docs}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Button style={BTN} onClick={() => message.success('已向客户发送中性补件请求。')}>
              发送中性补件请求
            </Button>
            <Button style={BTN} onClick={() => message.info('打开资料包')}>
              查看资料包
            </Button>
          </div>
        </>
      )}

      {tab === 'd-ubo' && (
        <>
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              padding: 16,
              border: '1px solid #dde6ed',
              borderRadius: 12,
              background: '#fbfdff',
            }}
          >
            {[
              { n: name, p: '' },
              { n: 'Holding Co.', p: '60%' },
              { n: 'Alex Morgan', p: '46%' },
              { n: 'Chunhua Xu', p: '54%' },
            ].map((x) => (
              <div
                key={x.n}
                style={{
                  border: '1px solid #dde6ed',
                  borderRadius: 999,
                  padding: '8px 12px',
                  background: '#fff',
                  fontSize: 12,
                }}
              >
                <b style={{ color: '#142d42' }}>{x.n}</b>
                {x.p && <span style={{ color: '#708190' }}> · {x.p}</span>}
              </div>
            ))}
          </div>
          <NoteBox tone="warn">
            缺少 Holding Co. 董事名册与控制权证据（25% 阈值）。
          </NoteBox>
        </>
      )}

      {tab === 'd-screen' && (
        <>
          <DataList
            items={[
              { label: 'Sanctions', value: 'Potential match · paused' },
              { label: 'PEP / HIO', value: 'Potential relationship' },
              { label: 'Adverse media', value: '1 relevant result' },
              { label: 'List version', value: '2026-07-30 09:55 UTC' },
            ]}
          />
          <NoteBox tone="warn">
            可能匹配不得由运营单独放行，对客不披露。
          </NoteBox>
        </>
      )}

      {tab === 'd-score' && (
        <>
          <div className="ops-card-row" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[
              { t: 'Inherent risk', v: '18 / 25' },
              { t: 'Residual risk', v: 'High' },
              { t: 'EDD', v: 'Required' },
            ].map((c) => (
              <div className="ops-card" key={c.t}>
                <small style={{ color: '#718190', fontSize: 11 }}>{c.t}</small>
                <b style={{ fontSize: 18, display: 'block', marginTop: 4 }}>{c.v}</b>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Timeline
              items={[
                { title: '复杂 UBO', desc: '+5' },
                { title: 'PEP 潜在关联', desc: '+4' },
                { title: '贸易路线高风险', desc: '+3' },
              ]}
            />
          </div>
          <Button
            type="primary"
            style={{ ...BTN, marginTop: 14, background: '#b8932e', borderColor: '#b8932e' }}
            onClick={() => message.success('已生成 EDD 清单并提交高级审批。')}
          >
            生成 EDD 清单与高级审批
          </Button>
        </>
      )}

      {tab === 'd-decision' && (
        <>
          <NoteBox>记录理由、证据、审核人、时间、前后状态与客户可见文案。</NoteBox>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <Button style={BTN}>查看资料包</Button>
            <Button style={BTN}>发送补件邮件</Button>
            <Button className="btn-success" style={BTN}>
              条件化通过
            </Button>
            <Button className="btn-ghost" style={BTN}>
              补件
            </Button>
            <Button className="btn-danger" style={BTN}>
              拒绝
            </Button>
            <Button className="btn-ghost" style={BTN}>
              升级 EDD
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
}

/* ============================================================
   风险案件
   ============================================================ */
export function RiskDrawer({
  open,
  onClose,
  caseId = 'RC-202607-1009',
}: {
  open: boolean;
  onClose: () => void;
  caseId?: string;
}) {
  const { message } = AntdApp.useApp();
  const [tab, setTab] = useState('r-facts');

  const tabs = [
    { key: 'r-facts', label: '事实与时间线' },
    { key: 'r-evidence', label: '证据' },
    { key: 'r-actions', label: '处置' },
    { key: 'r-report', label: '报告决定' },
  ];

  return (
    <Drawer
      title={`风险案件 · ${caseId}`}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnClose
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <Chip tone="red">Red</Chip>
        <span style={{ fontSize: 13, color: '#142d42' }}>Potential sanctions match</span>
      </div>
      <DataList
        items={[
          { label: '即时措施', value: 'Reversible operations paused' },
          { label: '权限', value: 'CCO / MLRO + Legal' },
        ]}
      />

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '14px 0' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              border: '1px solid #dce5eb',
              background: tab === t.key ? '#173c59' : '#fff',
              color: tab === t.key ? '#fff' : '#52687d',
              borderRadius: 999,
              padding: '7px 10px',
              fontSize: 12,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'r-facts' && (
        <Timeline
          items={[
            { title: '10:39 · Payment TX-849201 submitted', desc: 'sanctions rule v3.4 triggered.' },
            { title: '10:39 · Funds frozen', desc: 'external channel submission prevented.' },
            { title: '10:41 · Case auto-routed', desc: 'to CCO / sanctions officer.' },
          ]}
        />
      )}

      {tab === 'r-evidence' && (
        <DataList
          items={[
            { label: 'List data', value: 'Version 2026.07.30' },
            { label: 'Candidate identifiers', value: 'Alias / DOB / jurisdiction' },
            { label: 'Transaction path', value: 'USD → SWIFT → beneficiary' },
            { label: 'Device / IP', value: 'Known device, low fraud signal' },
          ]}
        />
      )}

      {tab === 'r-actions' && (
        <>
          <NoteBox>默认禁止释放，运营仅补充材料、保全证据、升级。</NoteBox>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <Button className="btn-danger" style={BTN} onClick={() => message.info('交易保持冻结。')}>
              保持冻结
            </Button>
            <Button className="btn-ghost" style={BTN} onClick={() => message.info('已升级至法务 / CCO 队列。')}>
              升级法务 CCO
            </Button>
            <Button style={BTN} onClick={() => message.success('已向客户请求交易资料。')}>
              向客户请求交易资料
            </Button>
          </div>
        </>
      )}

      {tab === 'r-report' && (
        <>
          <NoteBox tone="warn">STR 候选受 need-to-know 控制，不得披露。</NoteBox>
          <Button
            type="primary"
            style={{ ...BTN, marginTop: 14, background: '#b8932e', borderColor: '#b8932e' }}
            onClick={() => message.success('已创建报告决策任务。')}
          >
            创建报告决策任务
          </Button>
        </>
      )}
    </Drawer>
  );
}

/* ============================================================
   客服工单
   ============================================================ */
export function TicketDrawer({
  open,
  onClose,
  ticketId = '#TCK-9321',
  customer = 'Unity Centre Investment Ltd.',
  sla = '22m remaining',
}: {
  open: boolean;
  onClose: () => void;
  ticketId?: string;
  customer?: string;
  sla?: string;
}) {
  const { message } = AntdApp.useApp();

  return (
    <Drawer
      title={`工单 ${ticketId} · Settlement delay`}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnClose
    >
      <DataList
        items={[
          { label: 'Customer', value: customer },
          { label: 'SLA', value: sla },
          { label: 'Account', value: 'Active · KYC approved' },
          { label: 'Recent transaction', value: '3 pending · 1 returned' },
        ]}
      />

      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 12, color: '#66788b', display: 'block', marginBottom: 6 }}>
          客户回复
        </label>
        <Input.TextArea
          rows={4}
          defaultValue="我们正在核实结算状态，将在收到通道回执后第一时间更新您。"
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button
          type="primary"
          style={{ ...BTN, background: '#b8932e', borderColor: '#b8932e' }}
          onClick={() => message.success('回复已发送。')}
        >
          发送回复
        </Button>
        <Button style={BTN} onClick={() => message.info('工单已分派。')}>
          分派
        </Button>
      </div>

      <NoteBox tone="warn">
        客服界面不展示制裁、STR、内部调查等敏感状态；仅使用经过授权的客户可见信息。
      </NoteBox>
    </Drawer>
  );
}

/* ============================================================
   结算差异
   ============================================================ */
export function SettlementDrawer({
  open,
  onClose,
  batch = 'SET-20260730-01',
}: {
  open: boolean;
  onClose: () => void;
  batch?: string;
}) {
  const { message } = AntdApp.useApp();
  const [tab, setTab] = useState('s-match');

  const tabs = [
    { key: 's-match', label: '交易配对' },
    { key: 's-adjust', label: '调账审批' },
    { key: 's-evidence', label: '对账文件' },
  ];

  return (
    <Drawer
      title={`结算差异 · ${batch}`}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnClose
    >
      <DataList
        items={[
          { label: 'Partner', value: 'Canada ACH Partner' },
          { label: 'Difference', value: 'CAD 24,600' },
          { label: 'Type', value: 'Amount difference' },
          { label: 'Status', value: 'Investigation open' },
        ]}
      />

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '14px 0' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              border: '1px solid #dce5eb',
              background: tab === t.key ? '#173c59' : '#fff',
              color: tab === t.key ? '#fff' : '#52687d',
              borderRadius: 999,
              padding: '7px 10px',
              fontSize: 12,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 's-match' && (
        <NoteBox>
          系统已将内部总账、通道回执与合作方账单进行三方对账。缺失记录与金额差异已自动生成调查任务。
        </NoteBox>
      )}

      {tab === 's-adjust' && (
        <>
          <NoteBox>
            任何调账须关联差异原因、审批链、账务凭证和前后余额，且不得由同一人员发起与批准。
          </NoteBox>
          <Button
            type="primary"
            style={{ ...BTN, background: '#b8932e', borderColor: '#b8932e' }}
            onClick={() => message.success('调账审批已发起，需双人复核。')}
          >
            发起调账审批
          </Button>
        </>
      )}

      {tab === 's-evidence' && (
        <NoteBox>Settlement file 20260730.csv · Partner statement #CA-2321 · callback receipts</NoteBox>
      )}
    </Drawer>
  );
}

/* ============================================================
   资金放行 / 释放 弹窗
   ============================================================ */
export type ReleaseField =
  | { name: string; label: string; type: 'select'; options: string[]; initial?: string }
  | { name: string; label: string; type: 'text'; initial?: string }
  | { name: string; label: string; type: 'textarea'; initial?: string }
  | { name: string; label: string; type: 'number'; initial?: number }
  | { name: string; label: string; type: 'checkbox'; initial?: boolean };

export function ReleaseModal({
  open,
  onClose,
  title,
  fields,
  submitText = '提交',
  toast,
  note,
  summary,
  extra,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: ReleaseField[];
  submitText?: string;
  toast: string;
  note?: string;
  summary?: { label: string; value: string }[];
  extra?: ReactNode;
  width?: number;
}) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={() => {
        form.validateFields().then(() => {
          message.success(toast);
          onClose();
        });
      }}
      okText={submitText}
      cancelText="取消"
      width={width}
    >
      {note && <NoteBox tone="info">{note}</NoteBox>}
      {summary && <DataList items={summary} />}

      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {fields.map((f) => (
          <Form.Item
            key={f.name}
            name={f.name}
            label={f.label}
            initialValue={f.initial}
            valuePropName={f.type === 'checkbox' ? 'checked' : 'value'}
            rules={
              f.type === 'checkbox'
                ? []
                : [{ required: true, message: `请填写${f.label}` }]
            }
          >
            {f.type === 'select' ? (
              <Select options={(f as { options: string[] }).options.map((o) => ({ value: o, label: o }))} />
            ) : f.type === 'number' ? (
              <InputNumber style={{ width: '100%' }} />
            ) : f.type === 'textarea' ? (
              <Input.TextArea rows={4} />
            ) : f.type === 'checkbox' ? (
              <Checkbox>{f.label}</Checkbox>
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
      </Form>

      {extra}
    </Modal>
  );
}
