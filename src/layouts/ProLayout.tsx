import { Select, Button, Dropdown, App as AntdApp } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MENU_GROUPS, ROUTES } from '@/routes';
import { useI18n, type Lang } from '@/i18n';

const GROUP_MAP: Record<string, string> = {
  工作台: 'workbench',
  运营与客户: 'opsCustomer',
  控制与配置: 'control',
};

export default function ProLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntdApp.useApp();
  const { lang, setLang, t } = useI18n();

  const active =
    ROUTES.find((r) => location.pathname === r.path) ??
    ROUTES.find((r) => location.pathname.startsWith(r.path)) ??
    ROUTES[0];

  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <div className="ops-brand">
          <div className="logo">L</div>
          <div>
            <strong>Libranex</strong>
            <small>Operations Platform</small>
          </div>
        </div>

        <div className="ops-role">
          <small>{t('layout.signedInAs')}</small>
          <b>Alex Chen · Compliance Analyst</b>
        </div>

        {MENU_GROUPS.map(({ group, items }) => (
          <div key={group}>
            <p className="ops-nav-label">{t(`nav.group.${GROUP_MAP[group]}`)}</p>
            {items.map((item) => {
              const isActive = active.key === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`ops-nav${isActive ? ' active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="ico">{item.icon}</span>
                  <span>{t(`nav.${item.key}.key`)}</span>
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      <main className="ops-main">
        <header className="ops-top">
          <div>
            <h1>{t(`nav.${active.key}.key`)}</h1>
            <p>{t(`nav.${active.key}.desc`)}</p>
          </div>

          <div className="ops-top-right">
            <span className="ops-chip yellow">● 3 {t('layout.attention')}</span>

            <Select<Lang>
              size="small"
              value={lang}
              onChange={(v) => setLang(v)}
              className="lang-select ops-w-110"
              labelRender={(props) => (
                <span>
                 🌐 {props.label}
                </span>
              )}
              options={[
                { value: 'zh-CN', label: t('layout.langOptions.zhCn') },
                { value: 'zh-TW', label: t('layout.langOptions.zhTw') },
                { value: 'en', label: t('layout.langOptions.en') },
              ]}
            />
           
            <Dropdown
              menu={{
                items: [
                  { key: 'profile', label: t('layout.profile') },
                  { key: 'session', label: t('layout.session') },
                  { type: 'divider' as const },
                  { key: 'logout', label: t('layout.logout'), danger: true },
                ],
                onClick: ({ key }) => {
                  if (key === 'switch') navigate('/user');
                  else message.info(t('layout.menuSelected', { key: String(key) }));
                },
              }}
            >
              <Button className="mini btn-ghost top-dropdown">
                {t('layout.switchUser')}
              </Button>
            </Dropdown>

            <Button
              className="mini btn-primary"
              onClick={() => message.success(t('layout.ssoVerified'))}
            >
              {t('layout.ssoVerified')}
            </Button>
          </div>
        </header>

        <div className="ops-content">
          <div className="ops-page">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
