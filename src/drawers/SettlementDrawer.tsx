import { useState } from "react";
import { Drawer, Button, App as AntdApp } from "antd";
import { DataList, NoteBox } from "@/components/OpsUI";
import { TabPills } from "./shared";

/** 结算差异抽屉：交易配对 / 调账审批 / 对账文件 */
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
  const [tab, setTab] = useState("s-match");

  const tabs = [
    { key: "s-match", label: "交易配对" },
    { key: "s-adjust", label: "调账审批" },
    { key: "s-evidence", label: "对账文件" },
  ];

  return (
    <Drawer
      title={`结算差异 · ${batch}`}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnHidden
    >
      <DataList
        items={[
          { label: "Partner", value: "Canada ACH Partner" },
          { label: "Difference", value: "CAD 24,600" },
          { label: "Type", value: "Amount difference" },
          { label: "Status", value: "Investigation open" },
        ]}
      />

      <TabPills items={tabs} value={tab} onChange={setTab} />

      {tab === "s-match" && (
        <p>系统已将内部总账、通道回执与合作方账单进行三方对账。缺失记录与金额差异已自动生成调查任务。</p>
      )}

      {tab === "s-adjust" && (
        <>
          <p>
            任何调账须关联差异原因、审批链、账务凭证和前后余额，且不得由同一人员发起与批准。
          </p>
          <Button
            type="primary"
            className="mini btn-primary"
            onClick={() => message.success("调账审批已发起，需双人复核。")}
          >
            发起调账审批
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
