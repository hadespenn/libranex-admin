import { Col, Row, Button, Tag } from 'antd';
import { useI18n } from '@/i18n';

export default function SettingsCenter() {
  const { t } = useI18n();

  const SETTINGS_CARDS = [
    {
      title: t('page.settings.cardLimit.title'),
      desc: t('page.settings.cardLimit.desc'),
      btn: t('page.settings.cardLimit.btn'),
      count: '5 active',
    },
    {
      title: t('page.settings.cardRegion.title'),
      desc: t('page.settings.cardRegion.desc'),
      btn: t('page.settings.cardRegion.btn'),
      count: '12 regions',
    },
    {
      title: t('page.settings.cardRetention.title'),
      desc: t('page.settings.cardRetention.desc'),
      btn: t('page.settings.cardRetention.btn'),
      count: '7 categories',
    },
  ];

  const QUICK_LINKS = [
    { label: t('page.settings.qlParams.label'), desc: t('page.settings.qlParams.desc') },
    { label: t('page.settings.qlApproval.label'), desc: t('page.settings.qlApproval.desc') },
    { label: t('page.settings.qlNotify.label'), desc: t('page.settings.qlNotify.desc') },
    { label: t('page.settings.qlAudit.label'), desc: t('page.settings.qlAudit.desc') },
  ];

  return (
    <div>
      <div className="mb-4">
        <div className="text-[22px] font-bold">{t('page.settings.title')}</div>
        <div className="text-[13px] text-[#8c8c8c]">
          {t('page.settings.subtitle')}
        </div>
      </div>

      <div className="section-card mb-4">
        <div className="section-title">{t('page.settings.title')}</div>
        <div className="section-subtitle">
          {t('page.settings.sectionSubtitle')}
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
        <div className="section-title">{t('page.settings.quickTitle')}</div>
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
