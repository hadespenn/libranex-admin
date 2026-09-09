import { useMemo, useState } from "react";
import { Button, Input, Select, App as AntdApp } from "antd";
import { Panel, Chip, OpsTable, NoteBox } from "@/components/OpsUI";
import { RiskDrawer } from "@/drawers";
import { useI18n } from "@/i18n";

type Row = {
  key: string;
  id: string;
  title: string;
  source: string;
  target: string;
  level: string;
  tone: "red" | "yellow" | "green";
  measure: string;
  sla: string;
  action: string;
};

const DATA: Row[] = [
  {
    key: "1",
    id: "RC-202607-1009",
    title: "Potential sanctions",
    source: "Sanctions v3.4",
    target: "TX-849201 · Global Supply",
    level: "Red",
    tone: "red",
    measure: "measure.pause",
    sla: "Today",
    action: "actionOpen",
  },
  {
    key: "2",
    id: "RC-202607-1008",
    title: "Structuring",
    source: "24h Aggregate v1.8",
    target: "Atlas Commerce",
    level: "Yellow",
    tone: "yellow",
    measure: "measure.proof",
    sla: "2 business days",
    action: "actionInvestigate",
  },
  {
    key: "3",
    id: "RC-202607-1004",
    title: "False positive",
    source: "Device graph v2.1",
    target: "North Trade",
    level: "Green",
    tone: "green",
    measure: "measure.evidence",
    sla: "5 days",
    action: "review",
  },
];

const SEVERITY_OPTIONS = [
  { value: "__all__", labelKey: "page.riskCases.allSeverity" },
  { value: "Red", label: "Red" },
  { value: "Yellow", label: "Yellow" },
  { value: "Green", label: "Green" },
  { value: "STR", label: "STR candidate" },
];

const SOURCE_OPTIONS = [
  { value: "__all__", labelKey: "page.riskCases.allSource" },
  { value: "txnMonitor", labelKey: "page.riskCases.source.txnMonitor" },
  { value: "listScreen", labelKey: "page.riskCases.source.listScreen" },
  { value: "manual", labelKey: "page.riskCases.source.manual" },
];

export default function RiskCases() {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [severity, setSeverity] = useState("__all__");
  const [source, setSource] = useState("__all__");
  const [kw, setKw] = useState("");
  const [detail, setDetail] = useState<Row | null>(null);

  const rows = useMemo(() => {
    const q = kw.trim().toLowerCase();
    return DATA.filter((r) => {
      if (severity !== "__all__") {
        if (severity === "STR") {
          if (r.id !== "RC-202607-1009") return false;
        } else if (r.level !== severity) {
          return false;
        }
      }
      const srcKey = `page.riskCases.source.${r.source}`;
      const srcLabel =
        r.source === "Sanctions v3.4" || r.source === "24h Aggregate v1.8" || r.source === "Device graph v2.1"
          ? r.source
          : t(srcKey);
      if (source !== "__all__" && r.source !== source) return false;
      if (!q) return true;
      return `${r.id} ${r.title} ${srcLabel} ${r.target}`.toLowerCase().includes(q);
    });
  }, [severity, source, kw, t]);

  const filterActive =
    severity !== "__all__" || source !== "__all__" || kw.length > 0;

  return (
    <>
      <Panel
        title={t("page.riskCases.center")}
        actions={
          <Button
            className="mini btn-primary"
            onClick={() => message.success(t("page.riskCases.createMsg"))}
          >
            {t("page.riskCases.createBtn")}
          </Button>
        }
      >
        <div className="ops-filter">
          <div className="ops-search">
            <Select
              value={severity}
              onChange={setSeverity}
              options={SEVERITY_OPTIONS.map((o) => ({ value: o.value, label: o.labelKey ? t(o.labelKey) : o.label }))}
            />
            <Select
              value={source}
              onChange={setSource}
              options={SOURCE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
            />
            <Input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder={t("page.riskCases.searchPlaceholder")}
              allowClear
            />
          </div>
          <Button className="mini link">{t("page.riskCases.filter")}</Button>
        </div>

        <OpsTable<Row>
          columns={[
            {
              title: t("page.riskCases.col.case"),
              key: "id",
              render: (r) => (
                <>
                  <b className="block text-[#142d42] whitespace-nowrap">{r.id}</b>
                  <span className="text-[11px] text-[#708190] whitespace-nowrap">{r.title}</span>
                </>
              ),
            },
            {
              title: t("page.riskCases.colSource"),
              key: "source",
              render: (r) => (r.source.startsWith("Sanctions") || r.source.startsWith("24h") || r.source.startsWith("Device") ? r.source : t(`page.riskCases.source.${r.source}`)),
            },
            { title: t("page.riskCases.colTarget"), 
              key: "target", 
              render: (r) => (
                <>
                  <b className="block text-[#142d42] whitespace-nowrap">{r.target}</b>
                </>
              ),
            },
            {
              title: t("page.riskCases.col.level"),
              key: "level",
              render: (r) => <Chip tone={r.tone}>{r.level}</Chip>,
            },
            { title: t("page.riskCases.colMeasure"), key: "measure", render: (r) => t(r.measure) },
            { title: t("page.riskCases.colSla"), key: "sla", render: (r) => r.sla },
            {
              title: t("page.riskCases.col.action"),
              key: "action",
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  {r.action === "review" ? t("action.review") : t(`page.riskCases.${r.action}`)}
                </button>
              ),
            },
          ]}
          data={rows}
          empty={t("page.riskCases.empty")}
        />

        {filterActive && (
          <NoteBox>{t("page.riskCases.matchNote", { n: rows.length })}</NoteBox>
        )}
      </Panel>

      <RiskDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        caseId={detail?.id}
      />
    </>
  );
}
