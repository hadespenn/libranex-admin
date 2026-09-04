import { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  Metrics,
  Panel,
  Chip,
  OpsTable,
  Timeline,
  CardGrid,
  BarChart,
} from "@/components/OpsUI";
import { KycDrawer, RiskDrawer, SettlementDrawer } from "@/drawers";
import { useI18n } from "@/i18n";

const METRICS = [
  { label: "page.overview.metricTpv", value: "$1.82M", note: "▲ 14.2% today", tone: 'ok' },
  { label: "page.overview.metricSuccess", value: "99.18%", note: "SLA healthy", tone: 'ok' },
  { label: "page.overview.metricKyc", value: "42", note: "11 due today", tone: 'ok' },
  {
    label: "page.overview.metricRisk",
    value: "18",
    note: "5 Red · immediate",
    tone: "bad" as const,
  },
  {
    label: "page.overview.metricRecon",
    value: "7",
    note: "$24.6K exposure",
    tone: "warn" as const,
  },
];

const BARS = [
  { label: "09:00", value: 64 },
  { label: "10:00", value: 76 },
  { label: "11:00", value: 59 },
  { label: "12:00", value: 88 },
  { label: "13:00", value: 70 },
  { label: "14:00", value: 82 },
  { label: "15:00", value: 73 },
];

type QueueRow = {
  key: string;
  type: "KYC" | "Risk" | "Settlement";
  subject: string;
  reason: string;
  priority: string;
  tone: "red" | "yellow" | "green" | "blue";
  action: string;
};

const QUEUE: QueueRow[] = [
  {
    key: "1",
    type: "KYC",
    subject: "Atlas Commerce",
    reason: "page.overview.queueReasonUbo",
    priority: "Yellow",
    tone: "yellow",
    action: "page.overview.queueActionReview",
  },
  {
    key: "2",
    type: "Risk",
    subject: "TX-849201",
    reason: "Potential sanctions match",
    priority: "Red",
    tone: "red",
    action: "page.overview.queueActionHandle",
  },
  {
    key: "3",
    type: "Settlement",
    subject: "CAN-ACH-07",
    reason: "page.overview.queueReasonDiff",
    priority: "Medium",
    tone: "yellow",
    action: "page.overview.queueActionSettle",
  },
];

const ALERTS = [
  {
    title: "page.overview.alertGw",
    desc: "page.overview.alertGwDesc",
  },
  {
    title: "page.overview.alertScreen",
    desc: "page.overview.alertScreenDesc",
  },
  {
    title: "page.overview.alertLiq",
    desc: "page.overview.alertLiqDesc",
  },
];

const COMPLIANCE = [
  { title: "11", sub: "page.overview.complianceKycSla" },
  { title: "3", sub: "page.overview.complianceEdd" },
  { title: "2", sub: "page.overview.complianceReport" },
];

export default function Overview() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [drawer, setDrawer] = useState<null | "kyc" | "risk" | "settlement">(
    null,
  );

  const openDrawer = (row: QueueRow) => {
    if (row.type === "KYC") setDrawer("kyc");
    else if (row.type === "Risk") setDrawer("risk");
    else navigate("/settlement");
  };

  return (
    <>
      <Metrics items={METRICS.map((m) => ({ ...m, label: t(m.label) }))} />

      <div className="ops-layout">
        <div>
          <Panel title={t("page.overview.txStatusTitle")}>
            <BarChart bars={BARS} />
          </Panel>
          <Panel
            title={t("page.overview.prioQueueTitle")}
            actions={
              <Button
                className="mini link"
                onClick={() => navigate("/risk")}
              >
                ⚑ {t("nav.opsRisk.key")}
              </Button>
            }
          >
            <OpsTable<QueueRow>
              columns={[
                { title: t("page.overview.col.type"), key: "type", render: (r) => r.type },
                {
                  title: t("page.overview.col.subject"),
                  key: "subject",
                  render: (r) => <b>{r.subject}</b>,
                },
                { title: t("page.overview.col.reason"), key: "reason", render: (r) => t(r.reason) },
                {
                  title: t("page.overview.col.priority"),
                  key: "priority",
                  render: (r) => <Chip tone={r.tone}>{r.priority}</Chip>,
                },
                {
                  title: t("page.overview.col.action"),
                  key: "action",
                  render: (r) => (
                    <button className="link" onClick={() => openDrawer(r)}>
                      {t(r.action)}
                    </button>
                  ),
                },
              ]}
              data={QUEUE}
            />
          </Panel>
        </div>
        <div>
          <Panel title={t("page.overview.sysAlertTitle")}>
            <Timeline items={ALERTS.map((a) => ({ title: t(a.title), desc: t(a.desc) }))} />
          </Panel>

          <Panel title={t("page.overview.complianceTitle")}>
            <CardGrid
              cards={COMPLIANCE.map((c) => ({ ...c, sub: t(c.sub) }))}
              render={(c) => (
                <>
                  <b className="text-2xl text-[#142d42]">{c.title}</b>
                  <p className="ops-card-sub">{c.sub}</p>
                </>
              )}
            />
          </Panel>
        </div>
      </div>

      <KycDrawer open={drawer === "kyc"} onClose={() => setDrawer(null)} />
      <RiskDrawer open={drawer === "risk"} onClose={() => setDrawer(null)} />
      <SettlementDrawer
        open={drawer === "settlement"}
        onClose={() => setDrawer(null)}
      />
    </>
  );
}
