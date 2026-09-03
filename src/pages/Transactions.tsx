import { App as AntdApp } from 'antd';
import { Metrics, Panel, Chip, OpsTable } from '@/components/OpsUI';

const METRICS = [
  { label: '处理笔数', value: '12,482', note: 'Last 24h' },
  { label: '处理中', value: '184', note: 'Queue healthy' },
  { label: '失败率', value: '0.82%', note: 'Within threshold' },
  { label: '异常交易', value: '37', note: 'Needs triage', tone: 'bad' as const },
  { label: '通道健康', value: '94%', note: '1 degraded', tone: 'warn' as const },
];

type Row = {
  key: string;
  time: string;
  id: string;
  client: string;
  amount: string;
  channel: string;
  status: string;
  tone: 'red' | 'green' | 'yellow';
  action: string;
};

const DATA: Row[] = [
  {
    key: '1',
    time: '10:39:12',
    id: 'TX-849201',
    client: 'Atlas Commerce',
    amount: 'USD 98,500',
    channel: 'SWIFT',
    status: 'Risk hold',
    tone: 'red',
    action: '查看链路',
  },
  {
    key: '2',
    time: '10:38:54',
    id: 'TX-849200',
    client: 'Clear Hub',
    amount: 'EUR 12,420',
    channel: 'SEPA',
    status: 'Success',
    tone: 'green',
    action: '查看回执',
  },
];

export default function Transactions() {
  const { message } = AntdApp.useApp();

  return (
    <>
      <Metrics items={METRICS} />

      <Panel title="实时交易监控">
        <OpsTable<Row>
          columns={[
            { title: '时间', key: 'time', render: (r) => r.time },
            { title: '交易号', key: 'id', render: (r) => <b>{r.id}</b> },
            { title: '客户', key: 'client', render: (r) => r.client },
            { title: '金额', key: 'amount', render: (r) => r.amount },
            { title: '通道', key: 'channel', render: (r) => r.channel },
            { title: '状态', key: 'status', render: (r) => <Chip tone={r.tone}>{r.status}</Chip> },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => message.info(`${r.id} · ${r.action}`)}>
                  {r.action}
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>
    </>
  );
}
