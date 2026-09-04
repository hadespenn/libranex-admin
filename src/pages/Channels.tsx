import { useState } from "react";
import { Button, App as AntdApp } from "antd";
import { Panel, Chip, OpsTable, DataList } from "@/components/OpsUI";
import { ReleaseModal, type ReleaseField } from "@/drawers";
import { useI18n } from "@/i18n";

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
    action: "view",
  },
  {
    key: "2",
    partner: "SG FAST Partner",
    capability: "SGD local payout",
    health: "97.8%",
    tone: "yellow",
    weight: "25%",
    cycle: "Same day",
    action: "route",
  },
  {
    key: "3",
    partner: "Qualified Exchange",
    capability: "USDC settlement",
    health: "99.70%",
    tone: "green",
    weight: "20%",
    cycle: "On-chain",
    action: "view",
  },
];

export default function Channels() {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [modal, setModal] = useState<null | "view" | "route">(null);
  const [row, setRow] = useState<Row | null>(null);

  return (
    <>
      <Panel title={t("page.channels.panelTitle")}>
        <OpsTable<Row>
          columns={[
            {
              title: t("page.channels.colPartner"),
              key: "partner",
              render: (r) => <b>{r.partner}</b>,
            },
            { title: t("page.channels.colCapability"), key: "capability", render: (r) => r.capability },
            {
              title: t("page.channels.col.health"),
              key: "health",
              render: (r) => <Chip tone={r.tone}>{r.health}</Chip>,
            },
            { title: t("page.channels.colWeight"), key: "weight", render: (r) => r.weight },
            { title: t("page.channels.col.settleCycle"), key: "cycle", render: (r) => r.cycle },
            {
              title: t("page.channels.col.action"),
              key: "action",
              render: (r) => (
                <button
                  className="link"
                  onClick={() => {
                    setRow(r);
                    setModal(r.action === "route" ? "route" : "view");
                  }}
                >
                  {r.action === "route" ? t("page.channels.actionRoute") : t("action.view")}
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
        title={t("page.channels.view.titleTpl", { partner: row?.partner ?? "" })}
        submitText={t("page.channels.view.submit")}
        toast={t("page.channels.view.toast")}
        note={t("page.channels.view.note")}
        onSubmit={() => {
          setModal(null);
          setTimeout(() => setModal('route'), 0);
        }}
        extra={
          <div className="mt-2">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: t("page.channels.view.cardSuccess"), value: row?.health ?? "99.92%" },
                { label: t("page.channels.view.cardWeight"), value: row?.weight ?? "55%" },
                { label: t("page.channels.view.cardSettle"), value: row?.cycle ?? "T+1" },
                { label: t("page.channels.view.cardLimit"), value: t("page.channels.view.cardLimitValue") },
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
                {t("page.channels.partnerNote")}
              </p>
              <textarea
                readOnly
                rows={3}
                defaultValue={t("page.channels.view.noteDefault")}
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
        title={t("page.channels.route.titleTpl", { partner: row?.partner ?? "" })}
        submitText={t("page.channels.route.submit")}
        toast={t("page.channels.route.toast")}
        note={t("page.channels.route.note")}
        width={560}
        fields={
          [
            {
              name: "Canada ACH",
              label: "Canada ACH",
              type: "text",
              initial: "55",
              readOnly: true,
            },
            {
              name: "SG FAST",
              label: "SG FAST",
              type: "text",
              placeholder: "25",
            },
            {
              name: "Qualified Exchange",
              label: "Qualified Exchange",
              type: "text",
              initial: "20",
              readOnly: true,
            },
            {
              name: "total",
              label: t("page.channels.route.labelTotal"),
              type: "text",
              initial: "100",
              readOnly: true,
            },
            {
              name: "effective",
              label: t("page.channels.route.labelEffective"),
              type: "select",
              options: [
                t("page.channels.route.effectiveNow"),
                t("page.channels.route.effectiveNextDay"),
              ],
              initial: t("page.channels.route.effectiveNow"),
            },
            {
              name: "killSwitch",
              label: t("page.channels.route.labelKillSwitch"),
              type: "select",
              options: [
                t("page.channels.route.killKeep"),
                t("page.channels.route.killSwitchNow"),
              ],
              initial: t("page.channels.route.killKeep"),
            },
            {
              name: "reason",
              label: t("page.channels.route.labelReason"),
              type: "textarea",
              placeholder: t("page.channels.route.labelReason"),
            },
            { name: "mfa", label: t("page.channels.route.labelMfa"), type: "checkbox" },
          ] as ReleaseField[]
        }
      />
    </>
  );
}
