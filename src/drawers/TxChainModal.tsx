import { Modal, Button } from "antd";
import { Timeline } from "@/components/OpsUI";

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

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      title={`交易链路 · ${txId}`}
      closable
    >
      <Timeline items={steps} />
      <div className="mt-4 flex justify-end gap-2">
        <Button className="mini btn-ghost" onClick={onOpenCase}>
          打开风险案件
        </Button>
        <Button type="primary" className="mini btn-primary" onClick={onClose}>
          关闭
        </Button>
      </div>
    </Modal>
  );
}
