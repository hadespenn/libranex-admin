import { useState } from "react";
import { Button, App as AntdApp } from "antd";
import { Panel, Chip, OpsTable, DataList } from "@/components/OpsUI";
import { ReleaseModal, type ReleaseField } from "@/drawers";

type Row = {
  key: string;
  partner: string;
  capability: string;
  health: string;
  tone: "green" | "yellow";
  weight: string;
  cycle: string;
  action: string;
};

const DATA: Row[] = [
  {
    key: "1",
    partner: "Canada ACH Partner",
    capability: "CAD collection / payout",
    health: "99.92%",
    tone: "green",
    weight: "55%",
    cycle: "T+1",
    action: "查看",
  },
  {
    key: "2",
    partner: "SG FAST Partner",
    capability: "SGD local payout",
    health: "97.8%",
    tone: "yellow",
    weight: "25%",
    cycle: "Same day",
    action: "调整路由",
  },
  {
    key: "3",
    partner: "Qualified Exchange",
    capability: "USDC settlement",
    health: "99.70%",
    tone: "green",
    weight: "20%",
    cycle: "On-chain",
    action: "查看",
  },
];

export default function Channels() {
  const { message } = AntdApp.useApp();
  const [modal, setModal] = useState<null | "view" | "route">(null);
  const [row, setRow] = useState<Row | null>(null);

  return (
    <>
      <Panel title="通道、路由与流动性">
        <OpsTable<Row>
          columns={[
            {
              title: "合作方 / 通道",
              key: "partner",
              render: (r) => <b>{r.partner}</b>,
            },
            { title: "能力", key: "capability", render: (r) => r.capability },
            {
              title: "健康度",
              key: "health",
              render: (r) => <Chip tone={r.tone}>{r.health}</Chip>,
            },
            { title: "权重", key: "weight", render: (r) => r.weight },
            { title: "结算周期", key: "cycle", render: (r) => r.cycle },
            {
              title: "操作",
              key: "action",
              render: (r) => (
                <button
                  className="link"
                  onClick={() => {
                    setRow(r);
                    setModal(r.action === "调整路由" ? "route" : "view");
                  }}
                >
                  {r.action}
                </button>
              ),
            },
          ]}
          data={DATA}
        />
      </Panel>

      <ReleaseModal
        open={modal === "view"}
        onClose={() => setModal(null)}
        title={`通道详情（${row?.partner ?? ""}）`}
        submitText="调整路由权重"
        toast="已进入路由权重调整流程。"
        note="含健康度曲线、路由权重、结算周期、合作方协议要点与限额。"
        onSubmit={() => {
          setModal(null);
          setTimeout(() => setModal('route'), 0);
        }}
        extra={
          <div className="mt-2">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "成功", value: row?.health ?? "99.92%" },
                { label: "权重", value: row?.weight ?? "55%" },
                { label: "结算", value: row?.cycle ?? "T+1" },
                { label: "限额", value: "CAD 5M / 日" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-lg border border-[#eee] bg-white p-2.5"
                >
                  <p className="mb-0.5 text-xs text-[#748493]">{c.label}</p>
                  <p className="text-sm font-semibold text-[#142d42]">
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-sm font-medium text-[#142d42]">
                合作方备注
              </p>
              <textarea
                readOnly
                rows={3}
                defaultValue="SLA 99.9%；特殊场景需双人书面授权"
                className="w-full rounded-lg border border-[#e6edf2] bg-[#f6f9fb] px-3 py-2 text-sm text-[#2d3748] outline-none focus:border-[#b8932e]"
              />
            </div>
          </div>
        }
        fields={[]}
      />

      <ReleaseModal
        open={modal === "route"}
        onClose={() => setModal(null)}
        title={`调整路由权重（${row?.partner ?? ""}）`}
        submitText="提交进入双人复核"
        toast="路由变更已提交，进入双人复核。"
        note="权重合计必须为 100%。变更需双重 MFA；急停可保留生产路由直到生效时间。"
        width={560}
        // extra={
        //   <div className="mt-2">
        //     <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        //       {[
        //         { label: 'Canada ACH', value: '55' },
        //         { label: 'SG FAST', value: '25' },
        //         { label: 'Qualified Exchange', value: '20' },
        //         { label: '权重合计', value: '100', bold: true },
        //       ].map((c) => (
        //         <div key={c.label} className="flex items-center justify-between">
        //           <span className={`text-sm ${c.bold ? 'font-semibold text-[#142d42]' : 'text-[#748493]'}`}>{c.label}</span>
        //           <input
        //             type="text"
        //             readOnly
        //             defaultValue={c.value}
        //             className="w-24 rounded-lg border border-[#e6edf2] bg-white px-3 py-1.5 text-right text-sm font-medium text-[#142d42] outline-none focus:border-[#b8932e]"
        //           />
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        // }
        fields={
          [
            {
              name: "Canada ACH",
              label: "Canada ACH",
              type: "input",
              initial: "55",
              readonly: true,
            },
            {
              name: "SG FAST",
              label: "SG FAST",
              type: "input",
              placeholder: "25",
            },
            {
              name: "Qualified Exchange",
              label: "Qualified Exchange",
              type: "input",
              initial: "20",
              readonly: true,
            },
            {
              name: "total",
              label: "权重合计",
              type: "input",
              initial: "100",
              readonly: true,
            },
            {
              name: "effective",
              label: "生效时间",
              type: "select",
              options: ["立即生效", "下一个工作日"],
              initial: "立即生效",
            },
            {
              name: "killSwitch",
              label: "急停保留",
              type: "select",
              options: ["保持生产路由直到生效", "立刻切换"],
              initial: "保持生产路由直到生效",
            },
            {
              name: "reason",
              label: "变更说明",
              type: "textarea",
              placeholder: "例：SG FAST 健康度回升",
            },
            { name: "mfa", label: "已二次 MFA 确认", type: "checkbox" },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
