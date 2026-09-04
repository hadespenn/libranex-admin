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
      destroyOnHidden
    >
      {summary}

      {tabs && tabs.length > 0 && (
        <>
          <div className="my-3.5 flex flex-wrap gap-[7px]">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={`rounded-full border border-[#dce5eb] px-2.5 py-[7px] text-xs ${
                  active === t.key
                    ? 'bg-[#173c59] is-on'
                    : 'bg-white text-[#52687d]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tabs.map((t) => (
            <div key={t.key} className={active === t.key ? 'block' : 'hidden'}>
              {t.content}
            </div>
          ))}
        </>
      )}

      {footer && (
        <div className="mt-[18px] flex flex-wrap gap-2">{footer}</div>
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
    <Button className={`mini btn-${tone}`} onClick={onClick}>
      {children}
    </Button>
  );
}
