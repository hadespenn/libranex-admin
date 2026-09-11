import { useState } from "react";
import { Button, Modal, Input, Radio, App as AntdApp } from "antd";
import { NoteBox } from "@/components/OpsUI";
import type { ChipTone } from "@/theme";
import { DocLightbox, type DocView } from "./DocLightbox";
import { TabPills } from "./shared";
import { useI18n } from "@/i18n";

/** 材料状态圆点配色，与 ops-chip 的语义色保持一致 */
const DOT_TONE: Record<ChipTone, string> = {
  green: "bg-[#2fa36b]",
  red: "bg-[#bb352d]",
  yellow: "bg-[#e0a83c]",
  blue: "bg-[#378add]",
  gray: "bg-[#94a3b8]",
};

/** KYC 客户 360：资料核验 / 审核决定 / 补件与通知 */
export function KycDrawer({
  open,
  onClose,
  name = "Atlas Commerce Ltd.",
  kyId = "KY-202607-1042",
  jurisdiction = "Singapore",
  contact = "Lin Manager (Finance Director)",
  sla = "4h 12m",
  docsLabel = "12/16 complete",
  email = "compliance@atlascommerce.com",
  // status 不再写死中文默认值：调用方若不传则走 i18n 的「审核中 / Under review」，
  // 避免英文版下还把 "审核中" 直接显示出来。
  status,
  statusTone = "blue" as ChipTone,
  risk = "High",
  riskTone = "red" as ChipTone,
  screening = "PEP potential",
  screeningTone = "yellow" as ChipTone,
}: {
  open: boolean;
  onClose: () => void;
  name?: string;
  kyId?: string;
  jurisdiction?: string;
  contact?: string;
  sla?: string;
  docsLabel?: string;
  email?: string;
  status?: string;
  statusTone?: ChipTone;
  risk?: string;
  riskTone?: ChipTone;
  screening?: string;
  screeningTone?: ChipTone;
}) {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [tab, setTab] = useState("kyc-docs");
  const [decision, setDecision] = useState("approve");
  const [notes, setNotes] = useState("");
  const [doc, setDoc] = useState<DocView | null>(null);
  // compose 面板：每个 stage 独立开关；type=supply(补件) / fix(修改)
  const [compose, setCompose] = useState<{
    stage: number;
    type: "supply" | "fix";
  } | null>(null);
  const [notifyLog, setNotifyLog] = useState<
    { type: "supply" | "fix"; stage: string; to: string; time: string }[]
  >([]);

  const buildCompose = (
    stage: {
      title: string;
      materials: { key: string; name: string; tone: ChipTone; note: string }[];
    },
    type: "supply" | "fix",
  ) => {
    const prefix = type === "supply" ? "supply" : "fix";
    const subject = t(`kyc.compose.${prefix}.subject`, {
      name,
      kyId,
      stage: stage.title,
    });
    const intro = t(`kyc.compose.${prefix}.intro`, {
      name,
      kyId,
      stage: stage.title,
    });
    const greet = t("kyc.compose.greet", { contact });
    const itemLines =
      type === "supply"
        ? stage.materials.map(
            (m) =>
              `• ${m.name} — ${
                m.note ||
                (m.tone === "red"
                  ? t("kyc.compose.supply.missing")
                  : t("kyc.compose.supply.please"))
              }`,
          )
        : stage.materials
            .filter((m) => m.note)
            .map((m) => `• ${m.name} — ${m.note}`);
    const items = itemLines.join("\n");
    const closing = t(`kyc.compose.${prefix}.closing`);
    const body = `${greet}\n\n${intro}\n\n${items}\n\n${closing}\n\n${t("kyc.compose.sign")}`;
    return { subject, body };
  };

  const onSend = (stageIdx: number) => {
    const stageTitle = [companyStage, addressStage, directorsStage, uboStage][
      stageIdx
    ].title;
    if (!compose) return;
    const type = compose.type;
    setNotifyLog((prev) => [
      {
        type,
        stage: stageTitle,
        to: email,
        time: new Date().toLocaleString("zh-CN", { hour12: false }),
      },
      ...prev,
    ]);
    message.success(type === "supply" ? t("kyc.sendSupply") : t("kyc.sendFix"));
    setCompose(null);
  };

  // 样品资料对应的 PDF 视图
  const DOCS: Record<string, DocView> = {
    ci: {
      badge: "PDF",
      title: t("kyc.material.ci.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-28 · Atlas · 1.2 MB",
      fields: [
        { label: "Company Name", value: name },
        { label: "Registration No.", value: kyId.replace("KY-", "") },
        { label: "Incorporation Date", value: "2026-07-20" },
        { label: "Jurisdiction", value: "Singapore" },
      ],
      body: "This is to certify that ATLAS COMMERCE LTD. is incorporated under the Companies Act and is a company limited by shares.",
      stamp: "Verified",
    },
    br: {
      badge: "PDF",
      title: t("kyc.material.br.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-28 · Atlas · 0.8 MB",
      fields: [
        { label: "BR No.", value: "BR-558821" },
        { label: "Status", value: "Registered" },
      ],
      body: "Business Registration recognised and in good standing.",
    },
    ma: {
      badge: "PDF",
      title: t("kyc.material.ma.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-28 · Atlas · 2.1 MB",
      fields: [
        { label: "Article", value: "12 — Shareholders" },
        { label: "Version", value: "v2" },
        { label: "Status", value: "Needs revision" },
      ],
      body: "Memorandum and Articles of Association. Article 12 lists shareholders, the declared UBO list must match this article.",
    },
    lease: {
      badge: "PDF",
      title: t("kyc.material.lease.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-27 · Atlas · 1.5 MB",
      fields: [
        { label: "Premises", value: "10 Marina Blvd, SG" },
        { label: "Term", value: "3 years" },
        { label: "Status", value: "Active" },
      ],
      body: "Tenancy agreement for the registered office premises.",
    },
    add1: {
      badge: "PDF",
      title: t("kyc.material.add1.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-25 · Atlas · 0.6 MB",
      fields: [
        { label: "Address", value: "60 Anson Road, #14-01, Singapore 079914" },
        { label: "Issue Date", value: "2026-05-12" },
        { label: "Issuer", value: "Singtel Utility Bill" },
      ],
      body: "Service address verified within last 3 months.",
    },
    dirId: {
      badge: "PDF",
      title: t("kyc.material.dirId.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-21 · Atlas · 0.4 MB",
      fields: [
        { label: "Director Name", value: "Tan Wei Ling" },
        { label: "ID Type", value: "Passport" },
        { label: "ID No.", value: "E1234567A" },
      ],
      body: "Director identity document verified against the company registry.",
    },
    dirAddr: {
      badge: "PDF",
      title: t("kyc.material.dirAddr.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-21 · Atlas · 0.3 MB",
      fields: [
        { label: "Director Name", value: "Tan Wei Ling" },
        { label: "Address", value: "88 Marina Bay View, Singapore 018956" },
        { label: "Issue Date", value: "2026-06-15" },
      ],
      body: "Director residential address proof issued within the last 3 months.",
    },
    dirRoster: {
      badge: "PDF",
      title: t("kyc.material.dirRoster.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-22 · Atlas · 0.5 MB",
      fields: [
        { label: "Total Directors", value: "3" },
        { label: "Last Updated", value: "2026-07-20" },
      ],
      body: "Official director roster matching the latest ACRA filing.",
    },
    uboList: {
      badge: "PDF",
      title: t("kyc.material.uboList.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-22 · Atlas · 0.6 MB",
      fields: [
        { label: "UBO Name", value: "Lim Jia Hao" },
        { label: "Ownership", value: "35%" },
      ],
      body: "Declared beneficial ownership list. Ensure Article 12 shareholders align with this list.",
    },
    uboStruct: {
      badge: "PDF",
      title: t("kyc.material.uboStruct.key"),
      meta: "Atlas Commerce Ltd. · 上传 2026-07-23 · Atlas · 0.7 MB",
      fields: [
        { label: "Layers", value: "2" },
        { label: "Ultimate Owner", value: "Lim Jia Hao" },
      ],
      body: "Shareholding structure chart showing natural persons holding ≥25%.",
    },
  };

  const openDoc = (key: string) => {
    const d = DOCS[key];
    if (d) setDoc(d);
  };

  const tabs = [
    { key: "kyc-docs", label: t("kyc.tabDocs") },
    { key: "kyc-decision", label: t("kyc.tabDecision") },
    { key: "kyc-log", label: t("kyc.tabLog"), count: notifyLog.length },
  ];

  // 企业主体资料阶段块
  const companyStage = {
    title: t("kyc.stageCompany.key"),
    sub: t("kyc.stageCompany.sub"),
    chip: t("kyc.stageCompany.chip"),
    chipTone: "yellow" as ChipTone,
    materials: [
      {
        key: "ci",
        name: t("kyc.material.ci.key"),
        status: t("kyc.status.submitted"),
        tone: "green" as ChipTone,
        note: t("kyc.material.ci.note"),
      },
      {
        key: "br",
        name: t("kyc.material.br.key"),
        status: t("kyc.status.submitted"),
        tone: "green" as ChipTone,
        note: t("kyc.material.br.note"),
      },
      {
        key: "ma",
        name: t("kyc.material.ma.key"),
        status: t("kyc.status.toFix"),
        tone: "yellow" as ChipTone,
        note: t("kyc.material.ma.note"),
      },
    ],
    extra: [t("kyc.btnResupply"), t("kyc.btnRequestFix")],
  };

  // 注册地址证明阶段块
  const addressStage = {
    title: t("kyc.stageAddress.key"),
    sub: t("kyc.stageAddress.sub"),
    chip: t("kyc.stageAddress.chip"),
    chipTone: "blue" as ChipTone,
    materials: [
      {
        key: "lease",
        name: t("kyc.material.lease.key"),
        status: t("kyc.status.submitted"),
        tone: "green" as ChipTone,
        note: t("kyc.material.lease.note"),
      },
      {
        key: "util",
        name: t("kyc.material.util.key"),
        status: t("kyc.status.needSupply"),
        tone: "blue" as ChipTone,
        note: t("kyc.material.util.note"),
      },
    ],
    extra: [t("kyc.btnResupply"), t("kyc.btnRequestFix")],
  };

  const directorsStage = {
    title: t("kyc.stageDirectors.key"),
    sub: t("kyc.stageDirectors.sub"),
    chip: t("kyc.stageDirectors.chip"),
    chipTone: "green" as ChipTone,
    materials: [
      {
        key: "dirId",
        name: t("kyc.material.dirId.key"),
        status: t("kyc.status.submitted"),
        tone: "green" as ChipTone,
        note: t("kyc.material.dirId.note"),
      },
      {
        key: "dirAddr",
        name: t("kyc.material.dirAddr.key"),
        status: t("kyc.status.submitted"),
        tone: "green" as ChipTone,
        note: t("kyc.material.dirAddr.note"),
      },
      {
        key: "dirRoster",
        name: t("kyc.material.dirRoster.key"),
        status: t("kyc.status.submitted"),
        tone: "green" as ChipTone,
        note: t("kyc.material.dirRoster.note"),
      },
    ],
    extra: [t("kyc.btnResupply"), t("kyc.btnRequestFix")],
  };

  const uboStage = {
    title: t("kyc.stageUbo.key"),
    sub: t("kyc.stageUbo.sub"),
    chip: t("kyc.stageUbo.chip"),
    chipTone: "yellow" as ChipTone,
    materials: [
      {
        key: "uboList",
        name: t("kyc.material.uboList.key"),
        status: t("kyc.status.toFix"),
        tone: "yellow" as ChipTone,
        note: t("kyc.material.uboList.note"),
      },
      {
        key: "uboStruct",
        name: t("kyc.material.uboStruct.key"),
        status: t("kyc.status.needSupply"),
        tone: "blue" as ChipTone,
        note: t("kyc.material.uboStruct.note"),
      },
    ],
    extra: [t("kyc.btnResupply"), t("kyc.btnRequestFix")],
  };

  return (
    <Modal
      title={t("kyc.title", { name })}
      open={open}
      onCancel={onClose}
      width={720}
      footer={null}
      centered
      destroyOnHidden
      className="kyc-modal"
    >
      {/* 头部：名称 + meta + chip */}
      <div className="flex items-start justify-between gap-3 kyc-header">
        <div>
          <div className="text-[19px] font-bold text-[#142d42]">{name}</div>
          <div className="mt-0.5 text-xs text-[#748493]">
            {kyId} · {jurisdiction} · {t("common.contact")} {contact}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          <span className={`ops-chip ${statusTone}`}>
            {/* 没传 status 时落到 i18n：英文版显示 "Reviewing"，中文版显示 "审核中"。
                调用方已传则按调用方传入显示。 */}
            {status ?? t("kyc.chipReviewing")}
          </span>
          <span className={`ops-chip ${riskTone}`}>{risk}</span>
          <span className={`ops-chip ${screeningTone}`}>{screening}</span>
        </div>
      </div>

      {/* SLA / 材料 / 邮箱 三联 */}
      <div className="my-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {[
          { label: t("kyc.sla"), value: sla },
          { label: t("kyc.docs"), value: docsLabel },
          { label: t("kyc.email"), value: email },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-[#dde6ed] bg-[#fbfdff] px-3 py-2.5"
          >
            <div className="text-[11px] text-[#748493]">{c.label}</div>
            <div className="mt-0.5 text-sm font-semibold text-[#142d42]">
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <TabPills items={tabs} value={tab} onChange={setTab} />

      {tab === "kyc-docs" && (
        <>
          {[companyStage, addressStage, directorsStage, uboStage].map(
            (stage, idx) => {
              const showing = compose && compose.stage === idx;
              const composeData = showing
                ? buildCompose(stage, compose!.type)
                : null;

              return (
                <div
                  key={idx}
                  className="mb-3 rounded-2xl border border-[#dde6ed] bg-white p-3.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[15px] font-bold text-[#142d42]">
                        {stage.title}
                      </div>
                      <div className="mt-0.5 text-xs text-[#748493]">
                        {stage.sub}
                      </div>
                    </div>
                    <span className={`ops-chip ${stage.chipTone}`}>
                      {stage.chip}
                    </span>
                  </div>

                  <div className="mt-2.5 grid gap-2">
                    {stage.materials.map((m) => (
                      <div
                        key={m.key}
                        className="flex items-center justify-between gap-2.5 rounded-[11px] border border-[#dde6ed] bg-[#fbfdff] px-[11px] py-[9px] kyc-row"
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-2">
                          <span
                            aria-hidden
                            className={`mt-1 size-[9px] shrink-0 rounded-full ${
                              DOT_TONE[m.tone]
                            }`}
                          />
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <b className="text-[13px] text-[#1c2c3a]">
                              {m.name}
                            </b>
                            {m.note && (
                              <span className="text-[11px] text-[#b06a00]">
                                {t("kyc.notePrefix")}
                                {m.note}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className={`ops-chip ${m.tone}`}>
                            {m.status}
                          </span>
                          {DOCS[m.key] ? (
                            <button
                              className="link"
                              onClick={() => openDoc(m.key)}
                            >
                              {t("common.onlineView")}
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#94a3b8]">
                              {t("kyc.status.notUpload")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-[11px] flex gap-2">
                    <Button
                      className="mini btn-ghost"
                      onClick={() => setCompose({ stage: idx, type: "supply" })}
                    >
                      {t("kyc.btnResupply")}
                    </Button>
                    <Button
                      className="mini btn-ghost"
                      onClick={() => setCompose({ stage: idx, type: "fix" })}
                    >
                      {t("kyc.btnRequestFix")}
                    </Button>
                  </div>

                  {showing && composeData && (
                    <div className="mt-2.5 rounded-xl border border-dashed border-[#9cc3e6] bg-[#f3f9ff] p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
                            {t("common.recipient")}
                          </label>
                          <Input value={email} readOnly />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
                            {t("common.subject")}
                          </label>
                          <Input value={composeData.subject} readOnly />
                        </div>
                      </div>

                      <label className="mb-1.5 mt-3 block text-xs font-semibold text-[#354454]">
                        {t("common.body")}
                      </label>
                      <Input.TextArea
                        defaultValue={composeData.body}
                        rows={6}
                      />

                      <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                        <Button
                          type="primary"
                          className="mini btn-primary"
                          onClick={() => onSend(idx)}
                        >
                          {t("common.send")}
                        </Button>
                        <Button
                          className="mini btn-ghost"
                          onClick={() => setCompose(null)}
                        >
                          {t("common.cancel")}
                        </Button>
                        <span className="text-[11px] text-[#748493]">
                          {compose!.type === "supply"
                            ? t("kyc.composeSupply.hint")
                            : t("kyc.composeFix.hint")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            },
          )}
        </>
      )}

      {tab === "kyc-decision" && (
        <>
          <NoteBox>{t("kyc.decisionNote")}</NoteBox>

          <Radio.Group
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="my-2 flex flex-wrap gap-3.5"
          >
            <Radio value="approve">{t("kyc.radio.approve")}</Radio>
            <Radio value="reject">{t("kyc.radio.reject")}</Radio>
            <Radio value="edd">{t("kyc.radio.edd")}</Radio>
          </Radio.Group>

          <div className="mt-1.5">
            <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
              {t("kyc.opinion")}
            </label>
            <Input.TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("kyc.opinion.placeholder")}
            />
          </div>

          <div className="mt-[18px] flex gap-2">
            <Button
              type="primary"
              className="mini btn-primary"
              onClick={() =>
                message.success(
                  decision === "reject"
                    ? t("kyc.rejectMsg")
                    : decision === "edd"
                      ? t("kyc.eddMsg")
                      : t("kyc.approveMsg"),
                )
              }
            >
              {t("kyc.submitDecision")}
            </Button>
            <Button className="mini btn-ghost" onClick={onClose}>
              {t("common.close")}
            </Button>
          </div>
        </>
      )}

      {tab === "kyc-log" && (
        <>
          {notifyLog.length === 0 ? (
            <NoteBox>{t("kyc.logEmpty")}</NoteBox>
          ) : (
            <div className="grid gap-2.5">
              {notifyLog.map((n, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#dde6ed] bg-white px-[13px] py-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`ops-chip ${n.type === "supply" ? "blue" : "yellow"}`}
                    >
                      {n.type === "supply"
                        ? t("kyc.logSupply")
                        : t("kyc.logFix")}
                    </span>
                    <b className="text-[#142d42]">{n.stage}</b>
                    <small className="ml-auto text-[11px] text-[#748493]">
                      {n.time}
                    </small>
                  </div>
                  <div className="mt-1 text-xs text-[#3a4a5a]">
                    {t("kyc.logRecipient")}
                    {n.to}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {doc && <DocLightbox doc={doc} onClose={() => setDoc(null)} />}
    </Modal>
  );
}
