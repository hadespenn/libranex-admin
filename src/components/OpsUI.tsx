import type { ReactNode } from 'react';
import { Empty } from 'antd';
import type { ChipTone } from '@/theme';
import { useI18n } from '@/i18n';

/* ---------------- 指标行 ---------------- */
export function Metrics({
  items,
  cols = 5,
}: {
  items: { label: string; value: string; note?: string; tone?: 'ok' | 'warn' | 'bad' }[];
  cols?: 4 | 5;
}) {
  return (
    <div className={`ops-metrics${cols === 4 ? ' cols-4' : ''}`}>
      {items.map((m) => (
        <div className="ops-metric" key={m.label}>
          <small>{m.label}</small>
          <strong>{m.value}</strong>
          {m.note && (
            <div className={`ops-kpi${m.tone ? ` ${m.tone}` : ''}`}>{m.note}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- 面板 ---------------- */
export function Panel({
  title,
  desc,
  actions,
  wide,
  children,
}: {
  title?: string;
  desc?: string;
  actions?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`ops-panel${wide ? ' ops-panel-wide' : ''}`}>
      {(title || actions) && (
        <div className="ops-panel-head">
          {title && <h2>{title}</h2>}
          {actions}
        </div>
      )}
      {desc && <p className="ops-note">{desc}</p>}
      {children}
    </section>
  );
}

/* ---------------- 状态标签 ---------------- */
export function Chip({ tone, children }: { tone: ChipTone; children: ReactNode }) {
  return <span className={`ops-chip ${tone}`}>{children}</span>;
}

/* ---------------- 表格 ---------------- */
export type OpsColumn<T> = {
  title: string;
  key: string;
  render: (row: T) => ReactNode;
  width?: number;
};

export function OpsTable<T extends { key: string }>({
  columns,
  data,
  empty,
}: {
  columns: OpsColumn<T>[];
  data: T[];
  empty?: string;
}) {
  const { t } = useI18n();
  const emptyText = empty ?? t('ops.noRecord');
  if (!data.length) return <div className="ops-empty">{emptyText}</div>;
  return (
    <table className="ops-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={c.width ? { width: c.width } : undefined}>
              {c.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.key}>
            {columns.map((c) => (
              <td key={c.key}>{c.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------------- 卡片网格 ---------------- */
export function CardGrid<T extends { title: string }>({
  cards,
  cols = 3,
  render,
}: {
  cards: T[];
  cols?: 3 | 4;
  render: (card: T) => ReactNode;
}) {
  return (
    <div className={cols === 4 ? 'ops-card-row ops-card-row-4' : 'ops-card-row'}>
      {cards.map((c) => (
        <div className="ops-card" key={c.title}>
          {render(c)}
        </div>
      ))}
    </div>
  );
}

/* ---------------- 时间线 ---------------- */
export function Timeline({ items }: { items: { title: string; desc?: string }[] }) {
  return (
    <div className="ops-timeline">
      {items.map((it, i) => (
        <div key={i}>
          <b>{it.title}</b>
          {it.desc && <p>{it.desc}</p>}
        </div>
      ))}
    </div>
  );
}

/* ---------------- 键值数据 ---------------- */
export function DataList({
  items,
  cols = 2,
}: {
  items: { label: string; value: ReactNode }[];
  cols?: 2 | 3;
}) {
  return (
    <div className={`ops-data-list ops-cols-${cols}`}>
      {items.map((it) => (
        <div className="ops-data" key={it.label}>
          <small>{it.label}</small>
          <b>{it.value}</b>
        </div>
      ))}
    </div>
  );
}

/* ---------------- 柱状图 ---------------- */
export function BarChart({ bars }: { bars: { label: string; value: number }[] }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="ops-chart-wrap">
      <div className="ops-chart">
        {bars.map((b) => (
          <div
            className="ops-bar"
            key={b.label}
            data-label={b.label}
            style={{ height: `${(b.value / max) * 100}%` }}
            title={`${b.label} · ${b.value}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- 提示条 ---------------- */
export function NoteBox({
  tone = 'default',
  children,
}: {
  tone?: 'default' | 'info' | 'warn';
  children: ReactNode;
}) {
  return <div className={`ops-note-box${tone === 'default' ? '' : ` ${tone}`}`}>{children}</div>;
}

export function EmptyBox({ text }: { text?: string }) {
  const { t } = useI18n();
  const emptyText = text ?? t('ops.emptyData');
  return (
    <div className="ops-empty">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
    </div>
  );
}
