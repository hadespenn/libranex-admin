/**
 * 各 drawer / modal 共享的常量与小组件。
 * 业务无关的通用 UI 片段放在这里，业务专属内容放在各自的文件中。
 */

/** 统一的胶囊按钮尺寸（配合 btn-ghost / btn-danger 等 className 使用） */
export const BTN = {
  borderRadius: 999,
  fontSize: 12,
  padding: "7px 10px",
} as const;

/** 主行动按钮（金色）的基础样式 */
export const BTN_PRIMARY = {
  ...BTN,
  background: "#b8932e",
  borderColor: "#b8932e",
} as const;

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
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "14px 0" }}>
      {items.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          style={{
            border: "1px solid #dce5eb",
            background: value === t.key ? "#173c59" : "#fff",
            color: value === t.key ? "#fff" : "#52687d",
            borderRadius: 999,
            padding: "7px 10px",
            fontSize: 12,
          }}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              style={{
                background: value === t.key ? "#fff" : "#378add",
                color: value === t.key ? "#378add" : "#fff",
                borderRadius: 10,
                fontSize: 11,
                padding: "0 7px",
                marginLeft: 4,
              }}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
