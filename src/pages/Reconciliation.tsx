import { Col, Row, Table, Tag, Button } from 'antd';
import { useI18n } from '@/i18n';

export default function Reconciliation() {
  const { t } = useI18n();

  const RECON_COLS = [
    { title: t('page.reconciliation.table.batch'), dataIndex: 'batch', key: 'batch', width: 130 },
    { title: t('page.reconciliation.table.partner'), dataIndex: 'partner', key: 'partner' },
    { title: t('page.reconciliation.table.ccy'), dataIndex: 'ccy', key: 'ccy', width: 60 },
    { title: t('page.reconciliation.table.net'), dataIndex: 'amount', key: 'amount', width: 130 },
    {
      title: t('page.reconciliation.table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (v: string) => (
        <Tag color={v === 'Matched' ? 'green' : 'red'}>{v === 'Matched' ? t('status.match') : t('page.reconciliation.status.diff')}</Tag>
      ),
    },
    {
      title: t('page.reconciliation.table.action'),
      key: 'action',
      width: 100,
      render: () => <Button type="link" size="small">{t('page.reconciliation.table.view')}</Button>,
    },
  ];

  const RECON_DATA = [
    { key: '1', batch: 'SET-20260730-01', partner: 'Canada ACH Partner', ccy: 'CAD', amount: '1,280,300.00', status: 'Diff' },
    { key: '2', batch: 'SET-20260730-02', partner: 'SG FAST Partner',    ccy: 'SGD', amount: '920,411.00',   status: 'Matched' },
    { key: '3', batch: 'SET-20260730-03', partner: 'EU SEPA Partner',    ccy: 'EUR', amount: '615,220.00',   status: 'Matched' },
    { key: '4', batch: 'SET-20260730-04', partner: 'US Wire Partner',    ccy: 'USD', amount: '2,840,900.00', status: 'Diff' },
  ];

  const LIQUIDITY = [
    { ccy: 'USD', value: '$2.8M',  status: 'healthy' },
    { ccy: 'SGD', value: '$0.42M', status: 'warning' },
    { ccy: 'EUR', value: '€1.9M',  status: 'healthy' },
  ];

  const RELEASE = [
    { title: t('page.reconciliation.release.fiat'), desc: t('page.reconciliation.release.fiatDesc'), btn: t('page.reconciliation.release.fiatBtn'), pending: 2 },
    { title: t('page.reconciliation.release.isolation'), desc: t('page.reconciliation.release.isolationDesc'), btn: t('page.reconciliation.release.isolationBtn'), pending: 1 },
    { title: t('page.reconciliation.release.crypto'), desc: t('page.reconciliation.release.cryptoDesc'), btn: t('page.reconciliation.release.cryptoBtn'), pending: 1 },
    { title: t('page.reconciliation.release.cryptoIsolation'), desc: t('page.reconciliation.release.cryptoIsolationDesc'), btn: t('page.reconciliation.release.cryptoIsolationBtn'), pending: 1 },
  ];

  return (
    <div>
      <div className="mb-4">
        <div className="text-[22px] font-bold">{t('page.reconciliation.title')}</div>
        <div className="text-[13px] text-[#8c8c8c]">
          {t('page.reconciliation.subtitle')}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <div className="section-card">
            <div className="section-title">{t('page.reconciliation.panelSettleTitle')}</div>
            <div className="section-subtitle">{t('page.reconciliation.panelSettleSubtitle')}</div>
            <Table size="small" pagination={false} columns={RECON_COLS} dataSource={RECON_DATA} />
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div className="section-card">
            <div className="section-title">{t('page.reconciliation.panelLiquidityTitle')}</div>
            <div className="section-subtitle">{t('page.reconciliation.panelLiquiditySubtitle')}</div>
            <Row gutter={12}>
              {LIQUIDITY.map((l) => (
                <Col key={l.ccy} span={8}>
                  <div className="rounded-[10px] bg-[#F6F7FB] p-4 text-center">
                    <div className="text-xs text-[#6b7280]">{l.ccy}</div>
                    <div className="kpi-number mt-1">{l.value}</div>
                    <Tag
                      className="mt-1.5"
                      color={l.status === 'healthy' ? 'green' : 'gold'}
                    >
                      {l.status === 'healthy' ? t('status.healthy') : t('status.warning')}
                    </Tag>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>

      <div className="section-card mt-4">
        <div className="section-title">{t('page.reconciliation.releaseTitle')}</div>
        <div className="section-subtitle">
          {t('page.reconciliation.releaseSubtitle')}
        </div>
        <Row gutter={[16, 16]}>
          {RELEASE.map((r) => (
            <Col key={r.title} xs={24} sm={12} md={6}>
              <div className="rounded-xl border border-[#eef0f5] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.title}</div>
                  <Tag color="warning">{t('page.reconciliation.pendingRelease', { n: r.pending })}</Tag>
                </div>
                <div className="mt-1.5 text-xs text-[#6b7280]">{r.desc}</div>
                <Button block className="ops-btn-gold mt-3.5">
                  {r.btn}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
        <div className="mt-3.5 rounded-lg border border-[#91CAFF] bg-[#E6F4FF] px-3.5 py-2.5 text-[13px] text-[#0050B3]">
          {t('page.reconciliation.auditNote')}
        </div>
      </div>
    </div>
  );
}
