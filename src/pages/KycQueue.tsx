import { useMemo, useState } from 'react';
import { Button, Input, Select, App as AntdApp } from 'antd';
import { Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { KycDrawer } from '@/drawers/Drawers';

type Row = {
  key: string;
  name: string;
  meta: string;
  status: string;
  statusTone: 'blue' | 'yellow' | 'green' | 'red';
  risk: string;
  riskTone: 'green' | 'yellow' | 'red';
  screening: string;
  docs: string;
  sla: string;
  action: string;
};

const DATA: Row[] = [
  {
    key: 'KY-202607-1042',
    name: 'Atlas Commerce Ltd.',
    meta: 'KY-202607-1042 · Singapore',
    status: '待审核',
    statusTone: 'yellow',
    risk: 'High',
    riskTone: 'red',
    screening: 'PEP potential',
    docs: '8/10 complete',
    sla: '4h 12m',
    action: '打开 360 视图',
  },
  {
    key: 'KY-202607-1041',
    name: 'North Trade Inc.',
    meta: 'KY-202607-1041 · Canada',
    status: '待补件',
    statusTone: 'blue',
    risk: 'Medium',
    riskTone: 'yellow',
    screening: 'Clear',
    docs: '6/8 complete',
    sla: '1d 03h',
    action: '查看',
  },
  {
    key: 'KY-202607-1039',
    name: 'Clear Hub Pte.',
    meta: 'KY-202607-1039 · Singapore',
    status: 'EDD',
    statusTone: 'blue',
    risk: 'High',
    riskTone: 'red',
    screening: 'Adverse media',
    docs: '12/12 complete',
    sla: 'Due today',
    action: '审核',
  },
];

const STATUS_OPTIONS = [
  { value: '__all__', label: '所有状态' },
  { value: '待审核', label: '待审核' },
  { value: '待补件', label: '待补件' },
  { value: 'EDD', label: 'EDD 审核中' },
];

const RISK_OPTIONS = [
  { value: '__all__', label: '所有风险等级' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export default function KycQueue() {
  const { message } = AntdApp.useApp();
  const [status, setStatus] = useState('__all__');
  const [risk, setRisk] = useState('__all__');
  const [kw, setKw] = useState('');
  const [detail, setDetail] = useState<Row | null>(null);

  const rows = useMemo(() => {
    const q = kw.trim().toLowerCase();
    return DATA.filter((r) => {
      if (status !== '__all__' && r.status !== status) return false;
      if (risk !== '__all__' && r.risk !== risk) return false;
      if (!q) return true;
      return `${r.name} ${r.meta} ${r.status} ${r.risk} ${r.screening}`.toLowerCase().includes(q);
    });
  }, [status, risk, kw]);

  const filterActive = status !== '__all__' || risk !== '__all__' || kw.length > 0;

  return (
    <>
      <Panel
        title="KYC 审核工作台"
        actions={
          <Button
            className="mini btn-primary"
            style={{ borderRadius: 999 }}
            onClick={() => message.success('高优先级 KYC 案件已认领，并记录操作审计。')}
          >
            认领高优先级案件
          </Button>
        }
      >
        <div className="ops-filter">
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: 160 }}
            options={STATUS_OPTIONS}
          />
          <Select
            value={risk}
            onChange={setRisk}
            style={{ width: 160 }}
            options={RISK_OPTIONS}
          />
          <Input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder="企业 / 企业ID / UBO 搜索"
            style={{ width: 240 }}
            allowClear
          />
          <Button className="mini" style={{ borderRadius: 999 }}>
            筛选
          </Button>
        </div>

        <OpsTable<Row>
          columns={[
            {
              title: '企业',
              key: 'name',
              render: (r) => (
                <>
                  <b style={{ display: 'block', color: '#142d42' }}>{r.name}</b>
                  <span style={{ color: '#708190', fontSize: 11 }}>{r.meta}</span>
                </>
              ),
            },
            { title: '状态', key: 'status', render: (r) => <Chip tone={r.statusTone}>{r.status}</Chip> },
            { title: '风险', key: 'risk', render: (r) => <Chip tone={r.riskTone}>{r.risk}</Chip> },
            { title: '筛查', key: 'screening', render: (r) => r.screening },
            { title: '材料', key: 'docs', render: (r) => r.docs },
            { title: 'SLA', key: 'sla', render: (r) => r.sla },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  {r.action}
                </button>
              ),
            },
          ]}
          data={rows}
          empty="没有符合条件的 KYC 案件。"
        />

        {filterActive && <NoteBox>已显示 {rows.length} 条匹配记录。</NoteBox>}
      </Panel>

      <KycDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        name={detail?.name}
        kyId={detail?.key}
        jurisdiction={detail?.meta.split(' · ')[1]}
      />
    </>
  );
}
