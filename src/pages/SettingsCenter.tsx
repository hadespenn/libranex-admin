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
      <div className="mb-4">
        <div className="text-[22px] font-bold">配置中心</div>
        <div className="text-[13px] text-[#8c8c8c]">
          参数、费率、限额、地区、功能开关与变更治理
        </div>
      </div>

      <div className="section-card mb-4">
        <div className="section-title">配置中心</div>
        <div className="section-subtitle">
          业务参数、费率、限额、节假日、币种、地区、功能开关、数据留存与报告模板与限额版本。审批、生效时间、回溯与审计。
        </div>
        <Row gutter={[16, 16]} className="mt-2">
          {SETTINGS_CARDS.map((c) => (
            <Col key={c.title} xs={24} md={8}>
              <div className="rounded-xl border border-[#eef0f5] p-[18px]">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.title}</div>
                  <Tag color="default" className="ops-pill">
                    {c.count}
                  </Tag>
                </div>
                <div className="mt-1.5 text-xs text-[#6b7280]">{c.desc}</div>
                <Button block className="mt-3.5">
                  {c.btn}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div className="section-card">
        <div className="section-title">常用入口</div>
        <Row gutter={[16, 16]} className="mt-2">
          {QUICK_LINKS.map((q) => (
            <Col key={q.label} xs={24} sm={12} md={6}>
              <div className="cursor-pointer rounded-[10px] bg-[#F6F7FB] p-3.5">
                <div className="font-semibold">{q.label}</div>
                <div className="mt-1 text-xs text-[#6b7280]">{q.desc}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
