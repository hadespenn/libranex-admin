import { useMemo, useState } from 'react';
import { Button, Input, Select, App as AntdApp } from 'antd';
import { Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { RiskDrawer } from '@/drawers';

type Row = {
  key: string;
  id: string;
  title: string;
  source: string;
  target: string;
  level: string;
  tone: 'red' | 'yellow' | 'green';
  measure: string;
  sla: string;
  action: string;
};

const DATA: Row[] = [
  {
    key: '1',
    id: 'RC-202607-1009',
    title: 'Potential sanctions',
    source: 'Sanctions v3.4',
    target: 'TX-849201 · Global Supply',
    level: 'Red',
    tone: 'red',
    measure: '已暂停可逆操作',
    sla: 'Today',
    action: '打开案件',
  },
  {
    key: '2',
    id: 'RC-202607-1008',
    title: 'Structuring',
    source: '24h Aggregate v1.8',
    target: 'Atlas Commerce',
    level: 'Yellow',
    tone: 'yellow',
    measure: '补充用途证明',
    sla: '2 business days',
    action: '调查',
  },
  {
    key: '3',
    id: 'RC-202607-1004',
    title: 'False positive',
    source: 'Device graph v2.1',
    target: 'North Trade',
    level: 'Green',
    tone: 'green',
    measure: 'Evidence retained',
    sla: '5 days',
    action: '复核',
  },
];

const SEVERITY_OPTIONS = [
  { value: '__all__', label: '所有严重度' },
  { value: 'Red', label: 'Red' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Green', label: 'Green' },
  { value: 'STR', label: 'STR candidate' },
];

const SOURCE_OPTIONS = [
  { value: '__all__', label: '所有来源' },
  { value: '交易监控', label: '交易监控' },
  { value: '名单筛查', label: '名单筛查' },
  { value: '人工创建', label: '人工创建' },
];

export default function RiskCases() {
  const { message } = AntdApp.useApp();
  const [severity, setSeverity] = useState('__all__');
  const [source, setSource] = useState('__all__');
  const [kw, setKw] = useState('');
  const [detail, setDetail] = useState<Row | null>(null);

  const rows = useMemo(() => {
    const q = kw.trim().toLowerCase();
    return DATA.filter((r) => {
      // 严重度筛选：'STR' 视为标签匹配；其他按 level 匹配
      if (severity !== '__all__') {
        if (severity === 'STR') {
          if (r.id !== 'RC-202607-1009') return false; // 当前仅 1 个 STR 候选
        } else if (r.level !== severity) {
          return false;
        }
      }
      if (source !== '__all__' && r.source !== source) return false;
      if (!q) return true;
      return `${r.id} ${r.title} ${r.source} ${r.target}`.toLowerCase().includes(q);
    });
  }, [severity, source, kw]);

  const filterActive = severity !== '__all__' || source !== '__all__' || kw.length > 0;

  return (
    <>
      <Panel
        title="风险案件中心"
        actions={
          <Button
            className="mini btn-primary"
            onClick={() => message.success('已创建人工风险案件，等待关联证据与分派。')}
          >
            创建人工案件
          </Button>
        }
      >
        <div className="ops-filter">
          <Select
            className="ops-w-180"
            value={severity}
            onChange={setSeverity}
            options={SEVERITY_OPTIONS}
          />
          <Select
            className="ops-w-160"
            value={source}
            onChange={setSource}
            options={SOURCE_OPTIONS}
          />
          <Input
            className="ops-w-240"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder="案例、交易、客户或收款人"
            allowClear
          />
          <Button className="mini btn-ghost">筛选</Button>
        </div>

        <OpsTable<Row>
          columns={[
            {
              title: '案件',
              key: 'id',
              render: (r) => (
                <>
                  <b className="block text-[#142d42]">{r.id}</b>
                  <span className="text-[11px] text-[#708190]">{r.title}</span>
                </>
              ),
            },
            { title: '来源 / 规则版本', key: 'source', render: (r) => r.source },
            { title: '关联对象', key: 'target', render: (r) => r.target },
            { title: '级别', key: 'level', render: (r) => <Chip tone={r.tone}>{r.level}</Chip> },
            { title: '即时措施', key: 'measure', render: (r) => r.measure },
            { title: '目标时效', key: 'sla', render: (r) => r.sla },
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
          empty="没有符合条件的风险案件。"
        />

        {filterActive && <NoteBox>已显示 {rows.length} 条匹配记录。</NoteBox>}
      </Panel>

      <RiskDrawer open={!!detail} onClose={() => setDetail(null)} caseId={detail?.id} />
    </>
  );
}
