import { useState } from "react";
import { Drawer, Button, App as AntdApp } from "antd";
import { Chip, DataList, NoteBox, Timeline } from "@/components/OpsUI";
import { TabPills } from "./shared";

/** 风险案件抽屉：事实时间线 / 证据 / 处置 / 报告决定 */
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
  const [tab, setTab] = useState("r-facts");

  const tabs = [
    { key: "r-facts", label: "事实与时间线" },
    { key: "r-evidence", label: "证据" },
    { key: "r-actions", label: "处置" },
    { key: "r-report", label: "报告决定" },
  ];

  return (
    <Drawer
      title={`风险案件 · ${caseId}`}
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
          { label: "Red", value: "潜在制裁匹配" },
          { label: "即时措施", value: "Reversible operations paused" },
          { label: "权限", value: "CCO / MLRO + Legal" },
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
          <NoteBox>
            制裁可能匹配默认禁止释放。运营仅可补充材料、保全证据与升级；不允许以名称轻微差异自行关闭。
          </NoteBox>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <Button
              className="mini btn-danger"
              onClick={() => message.info("交易保持冻结。")}
            >
              保持冻结
            </Button>
            <Button
              className="mini btn-ghost"
              onClick={() => message.info("已升级至法务 / CCO 队列。")}
            >
              升级法务 CCO
            </Button>
            <Button
              className="mini btn-ghost"
              onClick={() => message.success("已向客户请求交易资料。")}
            >
              向客户请求交易资料
            </Button>
          </div>
        </>
      )}

      {tab === "r-report" && (
        <>
          <NoteBox tone="warn">
            STR
            候选案件访问受“需要知悉”控制。不得向客户或无业务必要人员披露报告已提交、正在准备或拟提交。
          </NoteBox>
          <Button
            type="primary"
            className="mini btn-primary mt-3.5"
            onClick={() => message.success("已创建报告决策任务。")}
          >
            创建报告决策任务
          </Button>
        </>
      )}
    </Drawer>
  );
}
