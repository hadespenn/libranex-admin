import { useState } from "react";
import { Button, Modal, Input, Radio, App as AntdApp } from "antd";
import { NoteBox } from "@/components/OpsUI";
import type { ChipTone } from "@/theme";
import { DocLightbox, type DocView } from "./DocLightbox";
import { BTN_PRIMARY, TabPills } from "./shared";

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
      destroyOnClose
      className="kyc-modal"
    >
      {/* 头部：名称 + meta + chip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#142d42" }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: "#748493", marginTop: 2 }}>
            {kyId} · {jurisdiction} · 联系人 {contact}
          </div>
        </div>
        <div
          style={{ display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}
        >
          <span className="ops-chip blue">审核中</span>
          <span className="ops-chip red">高</span>
          <span className="ops-chip yellow">PEP potential</span>
        </div>
      </div>

      {/* SLA / 材料 / 邮箱 三联 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
          margin: "12px 0",
        }}
      >
        {[
          { label: "SLA", value: sla },
          { label: "材料", value: docsLabel },
          { label: "客户邮箱", value: email },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              border: "1px solid #dde6ed",
              borderRadius: 12,
              padding: "10px 12px",
              background: "#fbfdff",
            }}
          >
            <div style={{ fontSize: 11, color: "#748493" }}>{c.label}</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#142d42",
                marginTop: 2,
              }}
            >
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
                style={{
                  border: "1px solid #dde6ed",
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 12,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#142d42",
                      }}
                    >
                      {stage.title}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#748493", marginTop: 2 }}
                    >
                      {stage.sub}
                    </div>
                  </div>
                  <span className={`ops-chip ${stage.chipTone}`}>
                    {stage.chip}
                  </span>
                </div>

                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  {stage.materials.map((m) => (
                    <div
                      key={m.key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 11px",
                        border: "1px solid #dde6ed",
                        borderRadius: 11,
                        background: "#fbfdff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            marginTop: 4,
                            flexShrink: 0,
                            background:
                              m.tone === "green"
                                ? "#2fa36b"
                                : m.tone === "red"
                                  ? "#bb352d"
                                  : m.tone === "yellow"
                                    ? "#e0a83c"
                                    : "#378add",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            minWidth: 0,
                          }}
                        >
                          <b style={{ fontSize: 13, color: "#1c2c3a" }}>
                            {m.name}
                          </b>
                          {m.note && (
                            <span style={{ fontSize: 11, color: "#b06a00" }}>
                              注：{m.note}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexShrink: 0,
                        }}
                      >
                        <span className={`ops-chip ${m.tone}`}>{m.status}</span>
                        <button className="link" onClick={() => openDoc(m.key)}>
                          在线查看
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
                  <Button
                    className="mini btn-ghost"
                    style={{ borderRadius: 999 }}
                    onClick={() => setCompose({ stage: idx, type: "supply" })}
                  >
                    补发补件通知
                  </Button>
                  <Button
                    className="mini btn-ghost"
                    style={{ borderRadius: 999 }}
                    onClick={() => setCompose({ stage: idx, type: "fix" })}
                  >
                    要求修改资料
                  </Button>
                </div>

                {showing && composeData && (
                  <div
                    style={{
                      marginTop: 10,
                      border: "1px dashed #9cc3e6",
                      background: "#f3f9ff",
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: 12,
                            color: "#354454",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          收件人
                        </label>
                        <Input value={email} readOnly />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: 12,
                            color: "#354454",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          主题
                        </label>
                        <Input value={composeData.subject} readOnly />
                      </div>
                    </div>

                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: "#354454",
                        fontWeight: 600,
                        margin: "12px 0 6px",
                      }}
                    >
                      正文
                    </label>
                    <Input.TextArea defaultValue={composeData.body} rows={6} />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        type="primary"
                        style={BTN_PRIMARY}
                        onClick={() => onSend(idx)}
                      >
                        发送通知
                      </Button>
                      <Button
                        className="btn-ghost"
                        style={{ borderRadius: 999 }}
                        onClick={() => setCompose(null)}
                      >
                        取消
                      </Button>
                      <span style={{ fontSize: 11, color: "#748493" }}>
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
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              margin: "8px 0",
            }}
          >
            <Radio value="approve">通过</Radio>
            <Radio value="reject">驳回</Radio>
            <Radio value="edd">转 EDD（加强尽调）</Radio>
          </Radio.Group>

          <div style={{ marginTop: 6 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                color: "#354454",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              审核意见 *
            </label>
            <Input.TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="通过 / 驳回 / 加强尽调的理由与后续动作"
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <Button
              type="primary"
              style={BTN_PRIMARY}
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
            <Button
              className="btn-ghost"
              style={{ borderRadius: 999 }}
              onClick={onClose}
            >
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
            <div style={{ display: "grid", gap: 10 }}>
              {notifyLog.map((n, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #dde6ed",
                    borderRadius: 12,
                    padding: "11px 13px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      className={`ops-chip ${n.type === "supply" ? "blue" : "yellow"}`}
                    >
                      {n.type === "supply" ? "补件" : "修改"}
                    </span>
                    <b style={{ color: "#142d42" }}>{n.stage}</b>
                    <small
                      style={{
                        marginLeft: "auto",
                        color: "#748493",
                        fontSize: 11,
                      }}
                    >
                      {n.time}
                    </small>
                  </div>
                  <div style={{ color: "#3a4a5a", fontSize: 12, marginTop: 4 }}>
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
