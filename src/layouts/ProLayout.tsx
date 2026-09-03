import { Select, Button, Dropdown, App as AntdApp } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MENU_GROUPS, ROUTES } from '@/routes';

export default function ProLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntdApp.useApp();

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
          <small>Signed in as</small>
          <b>Alex Chen · Compliance Analyst</b>
        </div>

        {MENU_GROUPS.map(({ group, items }) => (
          <div key={group}>
            <p className="ops-nav-label">{group}</p>
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
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      <main className="ops-main">
        <header className="ops-top">
          <div>
            <h1>{active.title}</h1>
            <p>{active.desc}</p>
          </div>

          <div className="ops-top-right">
            <span className="ops-chip yellow">● 3 项需关注</span>

            <Select
              size="small"
              defaultValue="zh"
              style={{ width: 110}}
              className="lang-select"
              labelRender={(props) => (
        <span>
         🌐 {props.label}
        </span>
      )}
              options={[
                { value: 'zh', label: '中文' },
                { value: 'zh-TW', label: '繁體中文' },
                { value: 'en', label: 'English' },
              ]}
            />
           
            <Dropdown
              
              menu={{
                items: [
                  { key: 'profile', label: '个人资料' },
                  { key: 'session', label: '会话与权限' },
                  { type: 'divider' as const },
                  { key: 'logout', label: '退出登录', danger: true },
                ],
                onClick: ({ key }) => message.info(`已选择：${key}`),
              }}
            >
              <Button className="mini btn-ghost top-dropdown" style={{ borderRadius: 999 }}>
                切换至用户平台
              </Button>
            </Dropdown>

            <Button
              className="mini btn-primary"
              style={{ borderRadius: 999 }}
              onClick={() => message.success('内部平台已通过 SSO 与 MFA 验证。')}
            >
              SSO / MFA 已验证
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
