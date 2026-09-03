import { useState } from 'react';
import { Drawer, Button } from 'antd';
import type { ReactNode } from 'react';

export type DrawerTab = { key: string; label: string; content: ReactNode };

/**
 * 运营后台通用抽屉：对应原型 .ops-drawer
 * 支持多标签页（ops-tabs / ops-tabpanel）
 */
export default function OpsDrawer({
  open,
  title,
  onClose,
  summary,
  tabs,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  summary?: ReactNode;
  tabs?: DrawerTab[];
  footer?: ReactNode;
}) {
  const [active, setActive] = useState(tabs?.[0]?.key ?? '');

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnClose
    >
      {summary}

      {tabs && tabs.length > 0 && (
        <>
          <div
            style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '14px 0' }}
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                style={{
                  border: '1px solid #dce5eb',
                  background: active === t.key ? '#173c59' : '#fff',
                  color: active === t.key ? '#fff' : '#52687d',
                  borderRadius: 999,
                  padding: '7px 10px',
                  fontSize: 12,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tabs.map((t) => (
            <div key={t.key} style={{ display: active === t.key ? 'block' : 'none' }}>
              {t.content}
            </div>
          ))}
        </>
      )}

      {footer && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>{footer}</div>
      )}
    </Drawer>
  );
}

export function DrawerButton({
  children,
  tone = 'ghost',
  onClick,
}: {
  children: ReactNode;
  tone?: 'primary' | 'ghost' | 'danger' | 'success';
  onClick?: () => void;
}) {
  return (
    <Button
      className={`mini btn-${tone}`}
      style={{ borderRadius: 999 }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
