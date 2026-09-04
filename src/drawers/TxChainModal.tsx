import { Modal, Button } from "antd";
import { Timeline } from "@/components/OpsUI";
import { useI18n } from '@/i18n';

/** 实时交易监控 · 交易链路弹框 */
export function TxChainModal({
  open,
  onClose,
  txId = "TX-849201",
  onOpenCase,
}: {
  open: boolean;
  onClose: () => void;
  txId?: string;
  onOpenCase?: () => void;
}) {
  const steps = [
    {
      title: "Created",
      desc: "Client request accepted · idempotency key verified.",
    },
    {
      title: "Risk screening",
      desc: "SWIFT route paused for analyst review.",
    },
    {
      title: "Settlement pending",
      desc: "Release requires authorized operations decision.",
    },
  ];
  const { t } = useI18n();
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      title={`${t('txChain.chain')} · ${txId}`}
      closable
    >
      <Timeline items={steps} />
      <div className="mt-4 flex justify-end gap-2">
        <Button className="mini btn-ghost" onClick={onOpenCase}>
          {t('txChain.openCase')}
        </Button>
        <Button type="primary" className="mini btn-primary" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>
    </Modal>
  );
}
