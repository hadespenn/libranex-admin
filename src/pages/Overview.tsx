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

const METRICS = [
  { label: "实时 TPV", value: "$1.82M", note: "▲ 14.2% today" },
  { label: "交易成功率", value: "99.18%", note: "SLA healthy" },
  { label: "KYC 待审核", value: "42", note: "11 due today" },
  {
    label: "风险案件",
    value: "18",
    note: "5 Red · immediate",
    tone: "bad" as const,
  },
  {
    label: "对账差异",
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
    reason: "UBO 穿透不完整",
    priority: "Yellow",
    tone: "yellow",
    action: "审核",
  },
  {
    key: "2",
    type: "Risk",
    subject: "TX-849201",
    reason: "Potential sanctions match",
    priority: "Red",
    tone: "red",
    action: "处置",
  },
  {
    key: "3",
    type: "Settlement",
    subject: "CAN-ACH-07",
    reason: "金额差异",
    priority: "Medium",
    tone: "yellow",
    action: "清结算与对账",
  },
];

const ALERTS = [
  {
    title: "Payment Gateway · Elevated error rate",
    desc: "5xx 从 0.2% 上升至 1.9% · 已通知值班人员",
  },
  {
    title: "Screening provider · Healthy",
    desc: "名单更新完成 · 42,108 个对象已重筛",
  },
  {
    title: "SGD liquidity · Threshold warning",
    desc: "可用头寸低于预警线 18%",
  },
];

const COMPLIANCE = [
  { title: "11", sub: "今日 KYC SLA" },
  { title: "3", sub: "EDD 高级审批" },
  { title: "2", sub: "报告截止提醒" },
];

export default function Overview() {
  const navigate = useNavigate();
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
      <Metrics items={METRICS} />

      <div className="ops-layout">
        <div>
          <Panel title="实时交易与通道状态">
            <BarChart bars={BARS} />
          </Panel>
          <Panel
            title="优先处理队列"
            actions={
              <Button
                className="mini btn-ghost"
                onClick={() => navigate("/risk")}
              >
                风险案件
              </Button>
            }
          >
            <OpsTable<QueueRow>
              columns={[
                { title: "类型", key: "type", render: (r) => r.type },
                {
                  title: "对象",
                  key: "subject",
                  render: (r) => <b>{r.subject}</b>,
                },
                { title: "原因", key: "reason", render: (r) => r.reason },
                {
                  title: "优先级",
                  key: "priority",
                  render: (r) => <Chip tone={r.tone}>{r.priority}</Chip>,
                },
                {
                  title: "动作",
                  key: "action",
                  render: (r) => (
                    <button className="link" onClick={() => openDrawer(r)}>
                      {r.action}
                    </button>
                  ),
                },
              ]}
              data={QUEUE}
            />
          </Panel>
        </div>
        <div>
          <Panel title="系统与通道告警">
            <Timeline items={ALERTS} />
          </Panel>

          <Panel title="合规待办">
            <CardGrid
              cards={COMPLIANCE}
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
