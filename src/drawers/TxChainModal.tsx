import { Modal, Button } from "antd";
import { Timeline } from "@/components/OpsUI";
import { BTN } from "./shared";

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
      destroyOnClose
      title={`交易链路 · ${txId}`}
      closable
    >
      <Timeline items={steps} />
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 16,
          justifyContent: "flex-end",
        }}
      >
        <Button style={BTN} onClick={onOpenCase}>
          打开风险案件
        </Button>
        <Button type="primary" style={BTN} onClick={onClose}>
          关闭
        </Button>
      </div>
    </Modal>
  );
}
