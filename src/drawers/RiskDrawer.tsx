import { useState } from "react";
import { Drawer, Button, App as AntdApp } from "antd";
import { Chip, DataList, NoteBox, Timeline } from "@/components/OpsUI";
import { TabPills } from "./shared";
import { useI18n } from "@/i18n";

export function RiskDrawer({
  open,
  onClose,
  caseId = "RC-202607-1009",
}: {
  open: boolean;
  onClose: () => void;
  caseId?: string;
}) {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [tab, setTab] = useState("r-facts");

  const tabs = [
    { key: "r-facts", label: t("drawer.risk.tabFacts") },
    { key: "r-evidence", label: t("drawer.risk.tabEvidenceShort") },
    { key: "r-actions", label: t("drawer.risk.tabAction") },
    { key: "r-report", label: t("drawer.risk.tabReportDecision") },
  ];

  return (
    <Drawer
      title={t("drawer.risk.title", { id: caseId })}
      open={open}
      onClose={onClose}
      width={720}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnHidden
    >
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <Chip tone="red">Red</Chip>
        <span className="text-[13px] text-[#142d42]">
          Potential sanctions match
        </span>
      </div>
      <DataList
        cols={3}
        items={[
          { label: "Red", value: t("drawer.risk.valueSanctions") },
          { label: t("page.riskCases.colMeasure"), value: t("drawer.risk.measurePaused") },
          { label: t("drawer.risk.permission"), value: "CCO / MLRO + Legal" },
        ]}
      />

      <TabPills items={tabs} value={tab} onChange={setTab} />

      {tab === "r-facts" && (
        <Timeline
          items={[
            {
              title: "10:39 · Payment TX-849201 submitted",
              desc: "sanctions rule v3.4 triggered.",
            },
            {
              title: "10:39 · Funds frozen",
              desc: "external channel submission prevented.",
            },
            {
              title: "10:41 · Case auto-routed",
              desc: "to CCO / sanctions officer.",
            },
          ]}
        />
      )}

      {tab === "r-evidence" && (
        <DataList
          items={[
            { label: "List data", value: "Version 2026.07.30" },
            {
              label: "Candidate identifiers",
              value: "Alias / DOB / jurisdiction",
            },
            { label: "Transaction path", value: "USD → SWIFT → beneficiary" },
            { label: "Device / IP", value: "Known device, low fraud signal" },
          ]}
        />
      )}

      {tab === "r-actions" && (
        <>
          <NoteBox>{t("drawer.risk.actionNote")}</NoteBox>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <Button
              className="mini btn-danger"
              onClick={() => message.info(t("drawer.risk.btnKeepFrozenMsg"))}
            >
              {t("drawer.risk.btnKeepFrozen")}
            </Button>
            <Button
              className="mini btn-ghost"
              onClick={() => message.info(t("drawer.risk.btnEscalateLegalMsg"))}
            >
              {t("drawer.risk.btnEscalateLegal")}
            </Button>
            <Button
              className="mini btn-ghost"
              onClick={() => message.success(t("drawer.risk.btnRequestDocsMsg"))}
            >
              {t("drawer.risk.btnRequestDocs")}
            </Button>
          </div>
        </>
      )}

      {tab === "r-report" && (
        <>
          <NoteBox tone="warn">{t("drawer.risk.reportNote")}</NoteBox>
          <Button
            type="primary"
            className="mini btn-primary mt-3.5"
            onClick={() => message.success(t("drawer.risk.btnReportTaskMsg"))}
          >
            {t("drawer.risk.btnReportTask")}
          </Button>
        </>
      )}
    </Drawer>
  );
}
