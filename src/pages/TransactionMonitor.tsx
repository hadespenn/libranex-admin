import { Col, Row, Table, Tag, Button } from 'antd';

const STATS = [
  { title: '处理笔数',  value: '12,482', hint: 'Last 24h',   color: '#0F2A4A' },
  { title: '处理中',   value: '184',    hint: 'Queue healthy', color: '#1F5BBF' },
  { title: '失败率',   value: '0.82%',  hint: 'Within threshold', color: '#DC2626' },
  { title: '异常交易',  value: '37',     hint: 'Needs triage', color: '#F59E0B' },
  { title: '通道健康',  value: '94%',    hint: '1 degraded', color: '#16A34A' },
];

const COLUMNS = [
  { title: '时间',    dataIndex: 'time',    key: 'time',    width: 100 },
  { title: '交易号',  dataIndex: 'tx',      key: 'tx',      width: 140 },
  { title: '客户',    dataIndex: 'client',  key: 'client' },
  { title: '金额',    dataIndex: 'amount',  key: 'amount',  width: 110 },
  { title: '通道',    dataIndex: 'channel', key: 'channel', width: 90 },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (v: string) => {
      const color =
        v === 'Success' ? 'green' : v === 'Risk hold' ? 'red' : v === 'Pending' ? 'gold' : 'default';
      return <Tag color={color}>{v}</Tag>;
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    render: () => (
      <Button type="link" size="small">
        看看回溯
      </Button>
    ),
  },
];

const DATA = [
  { key: '1', time: '10:39:12', tx: 'TX-849201', client: 'Alias Commerce', amount: 'USD 98,500', channel: 'SWIFT', status: 'Risk hold' },
  { key: '2', time: '10:38:54', tx: 'TX-849200', client: 'Clear Hub',      amount: 'EUR 12,420', channel: 'SEPA',  status: 'Success' },
  { key: '3', time: '10:38:21', tx: 'TX-849199', client: 'Nova Pay Co',    amount: 'USD 4,300',  channel: 'ACH',   status: 'Pending' },
  { key: '4', time: '10:37:48', tx: 'TX-849198', client: 'Atlas Travel SG', amount: 'SGD 22,800', channel: 'FAST',  status: 'Success' },
  { key: '5', time: '10:37:12', tx: 'TX-849197', client: 'Green Ledger',   amount: 'EUR 6,490',  channel: 'SEPA',  status: 'Risk hold' },
  { key: '6', time: '10:36:55', tx: 'TX-849196', client: 'Orion B2B',      amount: 'USD 51,200', channel: 'SWIFT', status: 'Success' },
];

export default function TransactionMonitor() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>实时交易监控</div>
        <div style={{ color: '#8c8c8c', fontSize: 13 }}>交易监听、状态审核、通道错误率与异常告警</div>
      </div>

      <Row gutter={[16, 16]}>
        {STATS.map((s) => (
          <Col key={s.title} xs={24} sm={12} md={8} lg={24 / 5}>
            <div className="section-card">
              <div style={{ color: '#6b7280', fontSize: 12 }}>{s.title}</div>
              <div className="kpi-number" style={{ color: s.color, marginTop: 4 }}>
                {s.value}
              </div>
              <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{s.hint}</div>
            </div>
          </Col>
        ))}
      </Row>

      <div className="section-card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div className="section-title">实时交易流</div>
            <div className="section-subtitle">滚动窗口 · 每 5 秒刷新</div>
          </div>
          <div>
            <Button>导出 CSV</Button>
          </div>
        </div>
        <Table size="small" pagination={{ pageSize: 8 }} columns={COLUMNS} dataSource={DATA} />
      </div>
    </div>
  );
}
