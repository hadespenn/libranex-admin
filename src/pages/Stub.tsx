import { Empty, Tag, Button } from 'antd';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="text-[22px] font-bold">{title}</div>
          {count && <Tag color="processing">{count}</Tag>}
        </div>
        <div className="text-[13px] text-[#8c8c8c]">{desc}</div>
      </div>
      <div className="section-card min-h-[360px]">
        <Empty description={t('page.stub.empty')}>
          {primaryBtn && <Button type="primary">{primaryBtn}</Button>}
        </Empty>
      </div>
    </div>
  );
}
