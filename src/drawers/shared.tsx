/**
 * 各 drawer / modal 共享的常量与小组件。
 * 业务无关的通用 UI 片段放在这里，业务专属内容放在各自的文件中。
 */

export type TabItem = { key: string; label: string; count?: number };

/**
 * 抽屉 / 弹框内常见的胶囊式 tab 切换。
 * 原先在 RiskDrawer / SettlementDrawer / KycDrawer 中各写了一份内联样式，这里收口。
 */
export function TabPills({
  items,
  value,
  onChange,
}: {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="my-3.5 flex flex-wrap gap-[7px]">
      {items.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`rounded-full border border-[#dce5eb] px-2.5 py-[7px] text-xs ${
              active ? "bg-[#173c59] is-on" : "bg-white text-[#52687d]"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={`ml-1 rounded-[10px] px-[7px] text-[11px] ${
                  active ? "bg-white text-[#378add]" : "bg-[#378add] text-white"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
