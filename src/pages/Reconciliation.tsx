import { Col, Row, Table, Tag, Button } from 'antd';

const RECON_COLS = [
  { title: '批次', dataIndex: 'batch', key: 'batch', width: 130 },
  { title: '合作方', dataIndex: 'partner', key: 'partner' },
  { title: '币种', dataIndex: 'ccy', key: 'ccy', width: 60 },
  { title: '净额', dataIndex: 'amount', key: 'amount', width: 130 },
  {
    title: '对账状态',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    render: (v: string) => (
      <Tag color={v === 'Matched' ? 'green' : 'red'}>{v === 'Matched' ? 'Matched' : '金额差异'}</Tag>
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    render: () => <Button type="link" size="small">查看</Button>,
  },
];

const RECON_DATA = [
  { key: '1', batch: 'SET-20260730-01', partner: 'Canada ACH Partner', ccy: 'CAD', amount: '1,280,300.00', status: 'Diff' },
  { key: '2', batch: 'SET-20260730-02', partner: 'SG FAST Partner',    ccy: 'SGD', amount: '920,411.00',   status: 'Matched' },
  { key: '3', batch: 'SET-20260730-03', partner: 'EU SEPA Partner',    ccy: 'EUR', amount: '615,220.00',   status: 'Matched' },
  { key: '4', batch: 'SET-20260730-04', partner: 'US Wire Partner',    ccy: 'USD', amount: '2,840,900.00', status: 'Diff' },
];

const LIQUIDITY = [
  { ccy: 'USD', value: '$2.8M',  status: 'Healthy' },
  { ccy: 'SGD', value: '$0.42M', status: 'Warning' },
  { ccy: 'EUR', value: '€1.9M',  status: 'Healthy' },
];

const RELEASE = [
  { title: '法币结算',   desc: '法币多批次跳账放行与回退',         btn: '运营放行', pending: 2 },
  { title: '资金隔离',   desc: '客户隔离账户资金复核',             btn: '释放申请', pending: 1 },
  { title: 'Crypto 结算', desc: 'Crypto 多批次放行与回退',         btn: '结算放行', pending: 1 },
  { title: 'Crypto 隔离', desc: '受托 Crypto 资金移转',             btn: '释放申请', pending: 1 },
];

export default function Reconciliation() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>清结算与对账</div>
        <div style={{ color: '#8c8c8c', fontSize: 13 }}>
          结算批次、合作方对账数据、清算与流动性
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <div className="section-card">
            <div className="section-title">清结算与对账</div>
            <div className="section-subtitle">今日批次 · T+0 / T+1</div>
            <Table size="small" pagination={false} columns={RECON_COLS} dataSource={RECON_DATA} />
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div className="section-card">
            <div className="section-title">流动性监控</div>
            <div className="section-subtitle">主要通道头寸 · 实时</div>
            <Row gutter={12}>
              {LIQUIDITY.map((l) => (
                <Col key={l.ccy} span={8}>
                  <div
                    style={{
                      background: '#F6F7FB',
                      borderRadius: 10,
                      padding: 16,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{l.ccy}</div>
                    <div className="kpi-number" style={{ marginTop: 4 }}>
                      {l.value}
                    </div>
                    <Tag
                      style={{ marginTop: 6 }}
                      color={l.status === 'Healthy' ? 'green' : 'gold'}
                    >
                      {l.status}
                    </Tag>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>

      <div className="section-card" style={{ marginTop: 16 }}>
        <div className="section-title">资金放行与释放</div>
        <div className="section-subtitle">
          对账错账，隔离 Crypto 资金放行对账，常规资金隔账对账，放出入复核与放账对账。
        </div>
        <Row gutter={[16, 16]}>
          {RELEASE.map((r) => (
            <Col key={r.title} xs={24} sm={12} md={6}>
              <div
                style={{
                  border: '1px solid #eef0f5',
                  borderRadius: 12,
                  padding: 16,
                  background: '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  <Tag color="warning">{r.pending} 待放行</Tag>
                </div>
                <div style={{ color: '#6b7280', fontSize: 12, marginTop: 6 }}>{r.desc}</div>
                <Button
                  block
                  style={{
                    marginTop: 14,
                    background: '#C9A24B',
                    borderColor: '#C9A24B',
                    color: '#fff',
                  }}
                >
                  {r.btn}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
        <div
          style={{
            marginTop: 14,
            padding: '10px 14px',
            background: '#E6F4FF',
            border: '1px solid #91CAFF',
            borderRadius: 8,
            color: '#0050B3',
            fontSize: 13,
          }}
        >
          所有放行 / 释放操作均记录审计痕迹，并触发双人复核。
        </div>
      </div>
    </div>
  );
}
