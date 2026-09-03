import { Empty, Tag, Button } from 'antd';

export default function Stub({
  title,
  desc,
  primaryBtn,
  count,
}: {
  title: string;
  desc: string;
  primaryBtn?: string;
  count?: string;
}) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{title}</div>
          {count && <Tag color="processing">{count}</Tag>}
        </div>
        <div style={{ color: '#8c8c8c', fontSize: 13 }}>{desc}</div>
      </div>
      <div className="section-card" style={{ minHeight: 360 }}>
        <Empty description="该模块骨架已就绪，可对接 API 后填充列表与表单">
          {primaryBtn && <Button type="primary">{primaryBtn}</Button>}
        </Empty>
      </div>
    </div>
  );
}
