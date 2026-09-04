import { Modal, Button, App as AntdApp } from "antd";
import { DataList } from "@/components/OpsUI";
import { useI18n } from "@/i18n";

/** 实时交易监控 · 交易回执弹框 */
export function TxReceiptModal({
  open,
  onClose,
  txId = "TX-849200",
  partnerReference = "SEPA-CLH-77881",
  settlementStatus = "Confirmed",
  valueDate = "2026-07-30",
}: {
  open: boolean;
  onClose: () => void;
  txId?: string;
  partnerReference?: string;
  settlementStatus?: string;
  valueDate?: string;
}) {
  const { t } = useI18n();
  const { message } = AntdApp.useApp();

  const handleDownload = () => {
    const lines = [
      `Transaction Receipt`,
      `====================`,
      `Transaction: ${txId}`,
      `Partner reference: ${partnerReference}`,
      `Settlement status: ${settlementStatus}`,
      `Value date: ${valueDate}`,
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${txId}-receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success("回执已下载");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      title={`${t("page.transactions.receipt")} · ${txId}`}
      closable
    >
      <DataList
        cols={2}
        items={[
          { label: "Partner reference", value: partnerReference },
          { label: "Settlement status", value: settlementStatus },
          { label: "Value date", value: valueDate },
        ]}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button className="mini btn-ghost" onClick={handleDownload}>
          {t("page.transactions.xzreceipt")}
        </Button>
        <Button type="primary" className="mini btn-primary" onClick={onClose}>
          {t("common.close")}
        </Button>
      </div>
    </Modal>
  );
}
