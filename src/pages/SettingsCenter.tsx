import { Col, Row, Button, Tag } from 'antd';

const SETTINGS_CARDS = [
  {
    title: '限额档',
    desc: '按企业 / KYC 等级 / 通道 / 风险等级配置。',
    btn: '申报变更',
    count: '5 active',
  },
  {
    title: '地区与行业',
    desc: '准入、禁入、风险因子与产品套餐。',
    btn: '查看版本',
    count: '12 regions',
  },
  {
    title: '数据留存',
    desc: '5 年路线，法律保全与区域化配置。',
    btn: '配置',
    count: '7 categories',
  },
];

const QUICK_LINKS = [
  { label: '业务参数',  desc: '费率、限额、节假日、币种、地区' },
  { label: '审批矩阵',  desc: '双人复核 · 升级到负责人 · 跨部门' },
  { label: '通知模板',  desc: '邮件 · SMS · 站内信' },
  { label: '审计菜单',  desc: '关键操作的可审计追溯设计' },
];

export default function SettingsCenter() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>配置中心</div>
        <div style={{ color: '#8c8c8c', fontSize: 13 }}>
          参数、费率、限额、地区、功能开关与变更治理
        </div>
      </div>

      <div className="section-card" style={{ marginBottom: 16 }}>
        <div className="section-title">配置中心</div>
        <div className="section-subtitle">
          业务参数、费率、限额、节假日、币种、地区、功能开关、数据留存与报告模板与限额版本。审批、生效时间、回溯与审计。
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
          {SETTINGS_CARDS.map((c) => (
            <Col key={c.title} xs={24} md={8}>
              <div style={{ border: '1px solid #eef0f5', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{c.title}</div>
                  <Tag color="default" style={{ borderRadius: 999 }}>{c.count}</Tag>
                </div>
                <div style={{ color: '#6b7280', fontSize: 12, marginTop: 6 }}>{c.desc}</div>
                <Button block style={{ marginTop: 14 }}>
                  {c.btn}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div className="section-card">
        <div className="section-title">常用入口</div>
        <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
          {QUICK_LINKS.map((q) => (
            <Col key={q.label} xs={24} sm={12} md={6}>
              <div
                style={{
                  background: '#F6F7FB',
                  padding: 14,
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600 }}>{q.label}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{q.desc}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
