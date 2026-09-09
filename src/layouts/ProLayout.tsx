import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Select,
  Button,
  Dropdown,
  Drawer,
  App as AntdApp,
} from 'antd';
import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MENU_GROUPS, ROUTES } from '@/routes';
import { useI18n, type Lang } from '@/i18n';

const GROUP_MAP: Record<string, string> = {
  工作台: 'workbench',
  运营与客户: 'opsCustomer',
  控制与配置: 'control',
};

/** 与 global.css 中 @media (max-width: 1024px) 的断点保持一致 */
const MOBILE_QUERY = '(max-width: 1024px)';
const COLLAPSE_KEY = 'libranex-sidebar-collapsed';

/** 订阅媒体查询，用于区分桌面 / 移动端布局 */
function useMediaQuery(query: string): boolean {
  const supported =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';

  const [matched, setMatched] = useState(
    () => supported && window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (!supported) return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatched(e.matches);
    setMatched(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query, supported]);

  return matched;
}

export default function ProLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntdApp.useApp();
  const { lang, setLang, t } = useI18n();

  const isMobile = useMediaQuery(MOBILE_QUERY);

  /** 桌面端侧边栏收起 / 展开（记忆到 localStorage） */
  const [collapsed, setCollapsed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(COLLAPSE_KEY) === '1',
  );
  /** 移动端侧边栏抽屉 */
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
    }
  }, [collapsed]);

  // 路由变化后自动关闭移动端抽屉
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const active = useMemo(
    () =>
      ROUTES.find((r) => location.pathname === r.path) ??
      ROUTES.find((r) => location.pathname.startsWith(r.path)) ??
      ROUTES[0],
    [location.pathname],
  );

  const go = useCallback(
    (path: string) => {
      navigate(path);
      setNavOpen(false);
    },
    [navigate],
  );

  const navContent = (
    <>
      <div className="ops-brand">
        <div className="logo">L</div>
        <div className="ops-brand-text">
          <strong>Libranex</strong>
          <small>Operations Platform</small>
        </div>
        {isMobile && (
          <button
            type="button"
            className="ops-nav-close"
            aria-label={t('layout.closeMenu')}
            onClick={() => setNavOpen(false)}
          >
            <CloseOutlined />
          </button>
        )}
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
                title={t(`nav.${item.key}.key`)}
                onClick={() => go(item.path)}
              >
                <span className="ico">{item.icon}</span>
                <span className="ops-nav-text">{t(`nav.${item.key}.key`)}</span>
              </button>
            );
          })}
        </div>
      ))}
    </>
  );

  return (
    <div className={`ops-shell${!isMobile && collapsed ? ' is-collapsed' : ''}`}>
      {!isMobile && <aside className="ops-sidebar">{navContent}</aside>}

      {isMobile && (
        <Drawer
          className="ops-nav-drawer"
          placement="left"
          open={navOpen}
          onClose={() => setNavOpen(false)}
          // 用视口百分比而非固定像素：
          // 之前 272px 在 375px 的 iPhone SE 上≈72.5%，几乎占满整个屏幕；
          // 现在改为字符串 '70%' 让浏览器直接按 viewport 算，
          // Drawer 是 fixed 定位，所以百分比是相对视口的，
          // 从手机到平板（≤1024px 断点内）都能等比收缩，无需 JS resize 监听。
          width="70%"
          closable={false}
          styles={{ body: { padding: 0, background: '#102435' } }}
        >
          <div className="ops-sidebar-inner">{navContent}</div>
        </Drawer>
      )}

      <main className="ops-main">
        <header className="ops-top">
          <div className="ops-top-left">
            <button
              type="button"
              className="ops-icon-btn"
              aria-label={
                isMobile
                  ? t('layout.toggleMenu')
                  : collapsed
                    ? t('layout.expandMenu')
                    : t('layout.collapseMenu')
              }
              onClick={() => (isMobile ? setNavOpen(true) : setCollapsed((c) => !c))}
            >
              {isMobile ? (
                <MenuOutlined />
              ) : collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )}
            </button>

            <div className="ops-top-title">
              <h1>{t(`nav.${active.key}.key`)}</h1>
              <p>{t(`nav.${active.key}.desc`)}</p>
            </div>
          </div>

          <div className="ops-top-right">
            <span className="ops-chip yellow ops-hide-sm">
              ● 3 {t('layout.attention')}
            </span>

            <Select<Lang>
              size="small"
              value={lang}
              onChange={(v) => setLang(v)}
              className="lang-select ops-w-120"
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
                  // { key: 'profile', label: t('layout.profile') },
                  // { key: 'session', label: t('layout.session') },
                  // { type: 'divider' as const },
                  // { key: 'logout', label: t('layout.logout'), danger: true },
                ],
                onClick: ({ key }) => {
                  if (key === 'switch') navigate('/user');
                  else message.info(t('layout.menuSelected', { key: String(key) }));
                },
              }}
            >
              <Button className="mini btn-ghost top-dropdown ops-hide-sm" onClick={() => (window.location.href = 'https://libranex-deploy.pages.dev/')}>
                {t('layout.switchUser')}
              </Button>
            </Dropdown>

            <Button
              className="mini btn-primary ops-hide-sm"
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
