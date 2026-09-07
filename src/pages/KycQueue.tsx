import { useMemo, useState } from "react";
import { Button, Input, Select, App as AntdApp } from "antd";
import { Panel, Chip, OpsTable, NoteBox } from "@/components/OpsUI";
import { KycDrawer } from "@/drawers";
import { useI18n } from "@/i18n";

type Row = {
  key: string;
  name: string;
  meta: string;
  status: string;
  statusTone: "blue" | "yellow" | "green" | "red";
  risk: string;
  riskTone: "green" | "yellow" | "red";
  screening: string;
  screeningTone: "green" | "yellow" | "red";
  docs: string;
  sla: string;
  action: string;
};

const DATA: Row[] = [
  {
    key: "KY-202607-1042",
    name: "Atlas Commerce Ltd.",
    meta: "KY-202607-1042 · Singapore",
    status: "pending",
    statusTone: "yellow",
    risk: "High",
    riskTone: "red",
    screening: "PEP potential",
    screeningTone: "yellow",
    docs: "8/10 complete",
    sla: "4h 12m",
    action: "open360",
  },
  {
    key: "KY-202607-1041",
    name: "North Trade Inc.",
    meta: "KY-202607-1041 · Canada",
    status: "resupply",
    statusTone: "blue",
    risk: "Medium",
    riskTone: "yellow",
    screening: "Clear",
    screeningTone: "green",
    docs: "6/8 complete",
    sla: "1d 03h",
    action: "view",
  },
  {
    key: "KY-202607-1039",
    name: "Clear Hub Pte.",
    meta: "KY-202607-1039 · Singapore",
    status: "edd",
    statusTone: "blue",
    risk: "High",
    riskTone: "red",
    screening: "Adverse media",
    screeningTone: "red",
    docs: "12/12 complete",
    sla: "Due today",
    action: "review",
  },
];

const STATUS_OPTIONS = [
  { value: "__all__", labelKey: "status.all" },
  { value: "pending", labelKey: "status.pending" },
  { value: "resupply", labelKey: "status.resupply" },
  { value: "edd", labelKey: "status.edd" },
];

const RISK_OPTIONS = [
  { value: "__all__", labelKey: "page.kycQueue.allRisk" },
  { value: "Low", labelKey: "page.riskCases.level.low" },
  { value: "Medium", labelKey: "page.riskCases.level.medium" },
  { value: "High", labelKey: "page.riskCases.level.high" },
];

export default function KycQueue() {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [status, setStatus] = useState("__all__");
  const [risk, setRisk] = useState("__all__");
  const [kw, setKw] = useState("");
  const [detail, setDetail] = useState<Row | null>(null);

  const rows = useMemo(() => {
    const q = kw.trim().toLowerCase();
    return DATA.filter((r) => {
      if (status !== "__all__" && r.status !== status) return false;
      if (risk !== "__all__" && r.risk !== risk) return false;
      if (!q) return true;
      return `${r.name} ${r.meta} ${t(`status.${r.status}`)} ${r.risk} ${r.screening}`
        .toLowerCase()
        .includes(q);
    });
  }, [status, risk, kw, t]);

  const filterActive =
    status !== "__all__" || risk !== "__all__" || kw.length > 0;

  return (
    <>
      <Panel
        title={t("page.kycQueue.workbench")}
        actions={
          <Button
            className="mini btn-primary"
            onClick={() => message.success(t("page.kycQueue.claimMsg"))}
          >
            {t("page.kycQueue.claimBtn")}
          </Button>
        }
      >
        <div className="ops-filter">
          <div className="ops-search">
            <Select
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
            />
            <Select
              value={risk}
              onChange={setRisk}
              options={RISK_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
            />
            <Input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder={t("page.kycQueue.searchPlaceholder")}
              allowClear
            />
          </div>
          <Button className="mini link">{t("page.kycQueue.filter")}</Button>
        </div>

        <OpsTable<Row>
          columns={[
            {
              title: t("page.kycQueue.col.customer"),
              key: "name",
              render: (r) => (
                <>
                  <b className="block text-[#142d42]">{r.name}</b>
                  <span className="text-[11px] text-[#708190]">{r.meta}</span>
                </>
              ),
            },
            {
              title: t("page.kycQueue.col.status"),
              key: "status",
              render: (r) => <Chip tone={r.statusTone}>{t(`status.${r.status}`)}</Chip>,
            },
            {
              title: t("page.kycQueue.col.type"),
              key: "risk",
              render: (r) => <Chip tone={r.riskTone}>{r.risk}</Chip>,
            },
            { title: t("page.kycQueue.col.reason"), key: "screening", render: (r) => r.screening },
            { title: t("common.note"), key: "docs", render: (r) => r.docs },
            { title: "SLA", key: "sla", render: (r) => r.sla },
            {
              title: t("page.kycQueue.col.action"),
              key: "action",
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  {t(`page.kycQueue.${r.action}`)}
                </button>
              ),
            },
          ]}
          data={rows}
          empty={t("page.kycQueue.empty")}
        />

        {filterActive && (
          <NoteBox>{t("page.kycQueue.matchNote", { n: rows.length })}</NoteBox>
        )}
      </Panel>

      <KycDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        name={detail?.name}
        kyId={detail?.key}
        jurisdiction={detail?.meta.split(" · ")[1]}
        status={detail ? t(`status.${detail.status}`) : undefined}
        statusTone={detail?.statusTone}
        risk={detail ? t(`page.riskCases.level.${detail.risk.toLowerCase()}`, { defaultValue: detail.risk }) : undefined}
        riskTone={detail?.riskTone}
        screening={detail?.screening}
        screeningTone={detail?.screeningTone}
      />
    </>
  );
}
