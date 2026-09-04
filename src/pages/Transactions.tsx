import { useState } from "react";
import { Metrics, Panel, Chip, OpsTable } from "@/components/OpsUI";
import {
  TxChainModal,
  TxReceiptModal,
  RiskDrawer,
} from "@/drawers";
import { useI18n } from "@/i18n";

type Row = {
  key: string;
  time: string;
  id: string;
  client: string;
  amount: string;
  channel: string;
  status: string;
  tone: "red" | "green" | "yellow";
  action: "chain" | "receipt";
  partnerReference: string;
  settlementStatus: string;
  valueDate: string;
};

const DATA: Row[] = [
  {
    key: "1",
    time: "10:39:12",
    id: "TX-849201",
    client: "Atlas Commerce",
    amount: "USD 98,500",
    channel: "SWIFT",
    status: "Risk hold",
    tone: "red",
    action: "chain",
    partnerReference: "SWIFT-ACM-98201",
    settlementStatus: "Pending",
    valueDate: "2026-08-02",
  },
  {
    key: "2",
    time: "10:38:54",
    id: "TX-849200",
    client: "Clear Hub",
    amount: "EUR 12,420",
    channel: "SEPA",
    status: "Success",
    tone: "green",
    action: "receipt",
    partnerReference: "SEPA-CLH-77881",
    settlementStatus: "Confirmed",
    valueDate: "2026-07-30",
  },
];

const METRICS = [
  { labelKey: "page.transactions.metricCount", value: "12,482", note: "Last 24h" },
  { labelKey: "page.transactions.metricProcessing", value: "184", note: "Queue healthy" },
  { labelKey: "page.transactions.metricFailRate", value: "0.82%", note: "Within threshold" },
  { labelKey: "page.transactions.metricAbnormal", value: "37", note: "Needs triage", tone: "bad" as const },
  { labelKey: "page.transactions.metricHealth", value: "94%", note: "1 degraded", tone: "warn" as const },
];

export default function Transactions() {
  const { t } = useI18n();
  const [chainOpen, setChainOpen] = useState(false);
  const [chainTx, setChainTx] = useState<Row | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptTx, setReceiptTx] = useState<Row | null>(null);
  const [caseOpen, setCaseOpen] = useState(false);

  const openChain = (r: Row) => {
    setChainTx(r);
    setChainOpen(true);
  };
  const openReceipt = (r: Row) => {
    setReceiptTx(r);
    setReceiptOpen(true);
  };

  return (
    <>
      <Metrics items={METRICS.map((m) => ({ ...m, label: t(m.labelKey) }))} />

      <Panel title={t("page.transactions.title")}>
        <OpsTable<Row>
          columns={[
            { title: t("page.transactions.col.time"), key: "time", render: (r) => r.time },
            { title: t("page.transactions.col.id"), key: "id", render: (r) => <b>{r.id}</b> },
            { title: t("page.transactions.col.cust"), key: "client", render: (r) => r.client },
            { title: t("page.transactions.col.amount"), key: "amount", render: (r) => r.amount },
            { title: t("page.transactions.col.channel"), key: "channel", render: (r) => r.channel },
            {
              title: t("page.transactions.col.status"),
              key: "status",
              render: (r) => <Chip tone={r.tone}>{r.status}</Chip>,
            },
            {
              title: "",
              key: "action",
              render: (r) =>
                r.action === "chain" ? (
                  <button className="link" onClick={() => openChain(r)}>
                    {t("action.chain")}
                  </button>
                ) : (
                  <button className="link" onClick={() => openReceipt(r)}>
                    {t("action.receipt")}
                  </button>
                ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <TxChainModal
        open={chainOpen}
        onClose={() => setChainOpen(false)}
        txId={chainTx?.id}
        onOpenCase={() => {
          setChainOpen(false);
          setCaseOpen(true);
        }}
      />

      <TxReceiptModal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        txId={receiptTx?.id}
        partnerReference={receiptTx?.partnerReference}
        settlementStatus={receiptTx?.settlementStatus}
        valueDate={receiptTx?.valueDate}
      />

      <RiskDrawer
        open={caseOpen}
        onClose={() => setCaseOpen(false)}
        caseId="RC-202607-1009"
      />
    </>
  );
}