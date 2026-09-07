import { useState } from "react";
import { Drawer, Button, App as AntdApp } from "antd";
import { DataList, NoteBox } from "@/components/OpsUI";
import { TabPills } from "./shared";
import { useI18n } from "@/i18n";

export function SettlementDrawer({
  open,
  onClose,
  batch = "SET-20260730-01",
}: {
  open: boolean;
  onClose: () => void;
  batch?: string;
}) {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [tab, setTab] = useState("s-match");

  const tabs = [
    { key: "s-match", label: t("drawer.settlement.tabMatch") },
    { key: "s-adjust", label: t("drawer.settlement.tabAdjust") },
    { key: "s-evidence", label: t("drawer.settlement.tabFile") },
  ];

  return (
    <Drawer
      title={t("drawer.settlement.diffTitleTpl", { batch })}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnHidden
    >
      <DataList
        items={[
          { label: t("drawer.settlement.reconPartner"), value: "Canada ACH Partner" },
          { label: t("drawer.settlement.reconDiff"), value: "CAD 24,600" },
          { label: t("common.type"), value: "Amount difference" },
          { label: t("drawer.settlement.liqStatus"), value: "Investigation open" },
        ]}
      />

      <TabPills items={tabs} value={tab} onChange={setTab} />

      {tab === "s-match" && <p>{t("drawer.settlement.matchText")}</p>}

      {tab === "s-adjust" && (
        <>
          <p>{t("drawer.settlement.adjustText")}</p>
          <Button
            type="primary"
            className="mini btn-primary"
            onClick={() =>
              message.success(t("drawer.settlement.btnAdjustApprovalMsg"))
            }
          >
            {t("drawer.settlement.btnAdjustApproval")}
          </Button>
        </>
      )}

      {tab === "s-evidence" && (
        <p>
          Settlement file 20260730.csv · Partner statement #CA-2321 · callback
          receipts
        </p>
      )}
    </Drawer>
  );
}
