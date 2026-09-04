import { useState } from "react";
import { Button, Modal, Input, Radio, App as AntdApp } from "antd";
import { NoteBox } from "@/components/OpsUI";
import type { ChipTone } from "@/theme";
import { DocLightbox, type DocView } from "./DocLightbox";
import { TabPills } from "./shared";

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
  risk = "High",
  screening = "PEP potential",
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
  risk?: string;
  screening?: string;
}) {
  const { message } = AntdApp.useApp();
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

  const buildCompose = (stageTitle: string, type: "supply" | "fix") => {
    const subject =
      type === "supply"
        ? `[KYC 补件] ${name}（${kyId}）· 需补充「${stageTitle}」`
        : `[KYC 资料修改] ${name}（${kyId}）· 请修改「${stageTitle}」`;
    const greet = `尊敬的 ${contact}：`;
    const intro =
      type === "supply"
        ? `为保证 ${name}（${kyId}）的 KYC 审核顺利进行，请补充以下「${stageTitle}」环节的资料：`
        : `在审核 ${name}（${kyId}）的「${stageTitle}」资料时，以下文件需修改后重新提交：`;
    const items =
      type === "supply"
        ? "• 所需文件列表 — 请在 5 个工作日内通过企业控制台上传，或回复本邮件附上文件。如有疑问请联系合规团队。"
        : "• 待修改文件 — 请更正后通过企业控制台重新上传。";
    const body = `${greet}\n\n${intro}\n\n${items}\n\nLibranex 合规部`;
    return { subject, body };
  };

  const onSend = (stageIdx: number) => {
    const stageTitle = [companyStage, addressStage, govStage][stageIdx].title;
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
    message.success(
      type === "supply" ? "补件通知已发送。" : "资料修改通知已发送。",
    );
    setCompose(null);
  };

  // 样品资料对应的 PDF 视图
  const DOCS: Record<string, DocView> = {
    ci: {
      badge: "PDF",
      title: "公司注册证书 (Certificate of Incorporation)",
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
      title: "商业登记证 (Business Registration)",
      meta: "Atlas Commerce Ltd. · 上传 2026-07-28 · Atlas · 0.8 MB",
      fields: [
        { label: "BR No.", value: "BR-558821" },
        { label: "Status", value: "Registered" },
      ],
      body: "Business Registration recognised and in good standing.",
    },
    ma: {
      badge: "PDF",
      title: "公司章程 (M&A)",
      meta: "Atlas Commerce Ltd. · 上传 2026-07-28 · Atlas · 2.1 MB",
      fields: [
        { label: "Article", value: "12 — Shareholders" },
        { label: "Version", value: "v2" },
        { label: "Status", value: "Needs revision" },
      ],
      body: "Memorandum and Articles of Association. Article 12 lists shareholders, the declared UBO list must match this article.",
    },
    add1: {
      badge: "PDF",
      title: "注册地址单据样本",
      meta: "Atlas Commerce Ltd. · 上传 2026-07-25 · Atlas · 0.6 MB",
      fields: [
        { label: "Address", value: "60 Anson Road, #14-01, Singapore 079914" },
        { label: "Issue Date", value: "2026-05-12" },
        { label: "Issuer", value: "Singtel Utility Bill" },
      ],
      body: "Service address verified within last 3 months.",
    },
    g1: {
      badge: "PDF",
      title: "变更登记表",
      meta: "Atlas Commerce Ltd. · 上传 2026-07-21 · Atlas · 0.4 MB",
      fields: [
        { label: "Change Type", value: "Director appointment" },
        { label: "Effective Date", value: "2026-06-30" },
      ],
      body: "Filing accepted by ACRA.",
    },
    g2: {
      badge: "PDF",
      title: "同名公司公告",
      meta: "Atlas Commerce Ltd. · 上传 2026-07-22 · Atlas · 0.3 MB",
      fields: [
        { label: "Publication", value: "The Straits Times" },
        { label: "Published", value: "2026-07-15" },
      ],
      body: "Notice of name similarity filed in compliance with Section 17.",
    },
  };

  const openDoc = (key: string) => {
    const d = DOCS[key];
    if (d) setDoc(d);
  };

  const tabs = [
    { key: "kyc-docs", label: "资料核验" },
    { key: "kyc-decision", label: "审核决定" },
    { key: "kyc-log", label: "补件与通知", count: notifyLog.length },
  ];

  // 原型：3 个企业主体资料阶段块（证书 / 章程 / 地址证）
  const companyStage = {
    title: "企业主体资料",
    sub: "公司注册与法律主体文件",
    chip: "待核验",
    chipTone: "yellow" as ChipTone,
    materials: [
      {
        key: "ci",
        name: "公司注册证书 (Certificate of Incorporation)",
        status: "已提交",
        tone: "green" as ChipTone,
        note: "",
      },
      {
        key: "br",
        name: "商业登记证 (Business Registration)",
        status: "已提交",
        tone: "green" as ChipTone,
        note: "",
      },
      {
        key: "ma",
        name: "公司章程 (M&A)",
        status: "待修改",
        tone: "yellow" as ChipTone,
        note: "19 条股东多数与 UBO 持股的股东名称不一致，请更换并重新上传。",
      },
    ],
    extra: ["补发补件通知", "要求修改资料"],
  };

  const addressStage = {
    title: "注册地址证明",
    sub: "注册地址在过去 3 个月内单据",
    chip: "待补件",
    chipTone: "red" as ChipTone,
    materials: [
      {
        key: "add1",
        name: "注册地址单据样本",
        status: "已提交",
        tone: "green" as ChipTone,
        note: "",
      },
    ],
    extra: ["补发补件通知", "要求修改资料"],
  };

  const govStage = {
    title: "公告与登记",
    sub: "同名公司、变更登记与公告条款",
    chip: "进行中",
    chipTone: "blue" as ChipTone,
    materials: [
      {
        key: "g1",
        name: "变更登记表",
        status: "已提交",
        tone: "green" as ChipTone,
        note: "",
      },
      {
        key: "g2",
        name: "同名公司公告",
        status: "需补件",
        tone: "yellow" as ChipTone,
        note: "",
      },
    ],
    extra: ["补发补件通知", "要求修改资料"],
  };

  return (
    <Modal
      title={`KYC 审核 · ${name}`}
      open={open}
      onCancel={onClose}
      width={720}
      footer={null}
      centered
      destroyOnHidden
      className="kyc-modal"
    >
      {/* 头部：名称 + meta + chip */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[19px] font-bold text-[#142d42]">{name}</div>
          <div className="mt-0.5 text-xs text-[#748493]">
            {kyId} · {jurisdiction} · 联系人 {contact}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          <span className="ops-chip blue">审核中</span>
          <span className="ops-chip red">高</span>
          <span className="ops-chip yellow">PEP potential</span>
        </div>
      </div>

      {/* SLA / 材料 / 邮箱 三联 */}
      <div className="my-3 grid grid-cols-3 gap-2.5">
        {[
          { label: "SLA", value: sla },
          { label: "材料", value: docsLabel },
          { label: "客户邮箱", value: email },
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
          {[companyStage, addressStage, govStage].map((stage, idx) => {
            const showing = compose && compose.stage === idx;
            const composeData = showing
              ? buildCompose(stage.title, compose.type)
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
                      className="flex items-center justify-between gap-2.5 rounded-[11px] border border-[#dde6ed] bg-[#fbfdff] px-[11px] py-[9px]"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-2">
                        <span
                          aria-hidden
                          className={`mt-1 size-[9px] shrink-0 rounded-full ${
                            DOT_TONE[m.tone]
                          }`}
                        />
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <b className="text-[13px] text-[#1c2c3a]">{m.name}</b>
                          {m.note && (
                            <span className="text-[11px] text-[#b06a00]">
                              注：{m.note}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className={`ops-chip ${m.tone}`}>{m.status}</span>
                        <button className="link" onClick={() => openDoc(m.key)}>
                          在线查看
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-[11px] flex gap-2">
                  <Button
                    className="mini btn-ghost"
                    onClick={() => setCompose({ stage: idx, type: "supply" })}
                  >
                    补发补件通知
                  </Button>
                  <Button
                    className="mini btn-ghost"
                    onClick={() => setCompose({ stage: idx, type: "fix" })}
                  >
                    要求修改资料
                  </Button>
                </div>

                {showing && composeData && (
                  <div className="mt-2.5 rounded-xl border border-dashed border-[#9cc3e6] bg-[#f3f9ff] p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
                          收件人
                        </label>
                        <Input value={email} readOnly />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
                          主题
                        </label>
                        <Input value={composeData.subject} readOnly />
                      </div>
                    </div>

                    <label className="mb-1.5 mt-3 block text-xs font-semibold text-[#354454]">
                      正文
                    </label>
                    <Input.TextArea defaultValue={composeData.body} rows={6} />

                    <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                      <Button
                        type="primary"
                        className="mini btn-primary"
                        onClick={() => onSend(idx)}
                      >
                        发送通知
                      </Button>
                      <Button
                        className="mini btn-ghost"
                        onClick={() => setCompose(null)}
                      >
                        取消
                      </Button>
                      <span className="text-[11px] text-[#748493]">
                        {compose!.type === "supply"
                          ? "向客户发送补件请求，并自动记录至通知与案件。"
                          : "向客户说明需修改的资料，并自动记录。"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {tab === "kyc-decision" && (
        <>
          <NoteBox>
            审核人可结合在线资料与名单 / 交易筛查作出最终决定。驳回或转 EDD
            需填写理由。
          </NoteBox>

          <Radio.Group
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="my-2 flex flex-wrap gap-3.5"
          >
            <Radio value="approve">通过</Radio>
            <Radio value="reject">驳回</Radio>
            <Radio value="edd">转 EDD（加强尽调）</Radio>
          </Radio.Group>

          <div className="mt-1.5">
            <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
              审核意见 *
            </label>
            <Input.TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="通过 / 驳回 / 加强尽调的理由与后续动作"
            />
          </div>

          <div className="mt-[18px] flex gap-2">
            <Button
              type="primary"
              className="mini btn-primary"
              onClick={() =>
                message.success(
                  decision === "reject"
                    ? "已驳回该 KYC 申请。"
                    : decision === "edd"
                      ? "已升级至 EDD（加强尽调）。"
                      : "KYC 审核决定已提交。",
                )
              }
            >
              提交审核决定
            </Button>
            <Button className="mini btn-ghost" onClick={onClose}>
              关闭
            </Button>
          </div>
        </>
      )}

      {tab === "kyc-log" && (
        <>
          {notifyLog.length === 0 ? (
            <NoteBox>
              暂无补件或通知记录。当您使用「补发补件通知」或「要求修改资料」时，操作会自动记录到此日志。
            </NoteBox>
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
                      {n.type === "supply" ? "补件" : "修改"}
                    </span>
                    <b className="text-[#142d42]">{n.stage}</b>
                    <small className="ml-auto text-[11px] text-[#748493]">
                      {n.time}
                    </small>
                  </div>
                  <div className="mt-1 text-xs text-[#3a4a5a]">
                    收件人：{n.to}
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
