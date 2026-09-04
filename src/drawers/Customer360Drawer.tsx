import { useState } from "react";
import { Button, Modal, App as AntdApp } from "antd";
import { NoteBox, DataList } from "@/components/OpsUI";
import { TabPills } from "./shared";
import { useI18n } from "@/i18n";

const TABS = [
  { key: "c-profile", label: "c360.tabProfile" },
  { key: "c-docs", label: "c360.tabDocs" },
  { key: "c-ubo", label: "c360.tabUbo" },
  { key: "c-screen", label: "c360.tabScreen" },
  { key: "c-risk", label: "c360.tabRisk" },
  { key: "c-decision", label: "c360.tabDecision" },
];

const DOCS = [
  { name: "Certificate of Incorporation", v: "v2", verify: "Verified", conclusion: "pass" },
  { name: "UBO Declaration", v: "v1", verify: "Verified", conclusion: "supply" },
  { name: "Bank Letter", v: "v3", verify: "Verified", conclusion: "mismatch" },
];

const CONCLUSION_TONE: Record<string, string> = {
  pass: "green",
  supply: "red",
  mismatch: "yellow",
};

/** 客户 360 抽屉：企业资料 / 材料核验 / UBO 图谱 / 筛查 / 风险 EDD / 审核决定 */
export function Customer360Drawer({
  open,
  onClose,
  name = "Atlas Commerce Ltd.",
}: {
  open: boolean;
  onClose: () => void;
  name?: string;
}) {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [tab, setTab] = useState("c-profile");

  return (
    <Modal
      title={t("c360.title", { name })}
      open={open}
      onCancel={onClose}
      width={720}
      footer={null}
      centered
      className="c360-drawer"
    >
      <TabPills
        items={TABS.map((x) => ({ key: x.key, label: t(x.label) }))}
        value={tab}
        onChange={setTab}
      />

      {tab === "c-profile" && (
        <DataList
          cols={2}
          items={[
            { label: t("c360.legalName"), value: "Atlas Commerce Ltd." },
            { label: t("c360.jurisdiction"), value: "Singapore" },
            { label: t("c360.entityType"), value: "Private Limited" },
            { label: t("c360.regNo"), value: "202607-1042" },
            { label: t("c360.riskLevel"), value: "High" },
            { label: t("c360.pep"), value: "Potential" },
            { label: t("c360.accountStatus"), value: "Active" },
          ]}
        />
      )}

      {tab === "c-docs" && (
        <div className="overflow-hidden rounded-2xl border border-[#dde6ed]">
          <div className="grid grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr] gap-2 border-b border-[#dde6ed] bg-[#f6f9fb] px-4 py-2 text-[12px] font-semibold text-[#5b6b7b]">
            <span>{t("c360.docs.head")}</span>
            <span>{t("c360.docs.version")}</span>
            <span>{t("c360.docs.verify")}</span>
            <span>{t("c360.docs.conclusion")}</span>
          </div>
          {DOCS.map((d) => (
            <div
              key={d.name}
              className="grid grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr] items-center gap-2 px-4 py-2.5 text-[13px] text-[#1c2c3a]"
            >
              <span>{d.name}</span>
              <span>{d.v}</span>
              <span>{d.verify}</span>
              <span>
                <span className={`ops-chip ${CONCLUSION_TONE[d.conclusion]}`}>
                  {t(`c360.conclusion.${d.conclusion}`)}
                </span>
              </span>
            </div>
          ))}
          <div className="border-t border-[#dde6ed] px-4 py-2.5">
            <Button
              className="mini btn-ghost"
              onClick={() => message.success(t("c360.btnSupplement"))}
            >
              {t("c360.btnSupplement")}
            </Button>
          </div>
        </div>
      )}

      {tab === "c-ubo" && (
        <>
          <div className="relative overflow-hidden rounded-2xl bg-[#0a1e36] p-5 text-white" style={{ minHeight: 260 }}>
            <div className="absolute left-[18%] top-4">
              <span className="inline-block rounded-full bg-[#1a3a5c] px-3.5 py-1.5 text-[13px] font-medium text-white/90 border border-[#2a4a6c]">
                Atlas Commerce
              </span>
            </div>

            <div className="absolute left-[28%] top-12 h-10 w-px bg-[#2a4a6c]" />
            <div className="absolute left-[28%] top-[88px] h-px w-[28%] bg-[#2a4a6c]" />
            <div className="absolute left-[28%] top-[88px] h-8 w-px bg-[#2a4a6c]" />
            <div className="absolute left-[56%] top-[88px] h-8 w-px bg-[#2a4a6c]" />

            <div className="absolute left-1/2 top-[88px] -translate-x-1/2">
              <div className="flex h-20 w-16 items-center justify-center rounded-lg border border-white/20 bg-white/90">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#0a1e36]">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
                </svg>
              </div>
            </div>

            <div className="absolute left-[28%] top-[152px] h-6 w-px bg-[#2a4a6c]" />
            <div className="absolute left-[28%] top-[176px] h-px w-[12%] bg-[#2a4a6c]" />
            <div className="absolute left-[40%] top-[176px] h-5 w-px bg-[#2a4a6c]" />

            <div className="absolute left-[56%] top-[152px] h-6 w-px bg-[#2a4a6c]" />
            <div className="absolute left-[56%] top-[176px] h-px w-[16%] bg-[#2a4a6c]" />
            <div className="absolute left-[72%] top-[176px] h-5 w-px bg-[#2a4a6c]" />

            <div className="absolute bottom-5 left-[28%]">
              <span className="inline-block rounded-full bg-[#1a3a5c] px-3 py-1.5 text-xs font-medium text-white/90 border border-[#2a4a6c]">
                Chunhua Xu 54%
              </span>
            </div>

            <div className="absolute bottom-5 right-[18%]">
              <span className="inline-block rounded-full bg-[#1a3a5c] px-3 py-1.5 text-xs font-medium text-white/90 border border-[#2a4a6c]">
                Alex Morgan 46%
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#748493]">{t("c360.ubo.note")}</p>
        </>
      )}

      {tab === "c-screen" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#eee] bg-white p-3">
              <p className="mb-1 text-xs text-[#748493]">{t("c360.screen.sanctions.key")}</p>
              <p className="text-sm font-semibold text-[#d69e2e]">{t("c360.screen.sanctions.val")}</p>
            </div>
            <div className="rounded-lg border border-[#eee] bg-white p-3">
              <p className="mb-1 text-xs text-[#748493]">{t("c360.screen.pep.key")}</p>
              <p className="text-sm font-medium text-[#2d3748]">{t("c360.screen.pep.val")}</p>
            </div>
            <div className="rounded-lg border border-[#eee] bg-white p-3">
              <p className="mb-1 text-xs text-[#748493]">{t("c360.screen.adverse.key")}</p>
              <p className="text-sm font-semibold text-[#2d3748]">{t("c360.screen.adverse.val")}</p>
            </div>
            <div className="rounded-lg border border-[#eee] bg-white p-3">
              <p className="mb-1 text-xs text-[#748493]">{t("c360.screen.version.key")}</p>
              <p className="text-sm font-medium text-[#2d3748]">{t("c360.screen.version.val")}</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-[#e6edf2] bg-[#f6f9fb] px-3 py-2.5 text-xs leading-relaxed text-[#748493]">
            {t("c360.screen.note")}
          </div>
        </>
      )}

      {tab === "c-risk" && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-[#eee] bg-white p-3">
              <p className="mb-1 text-xs text-[#748493]">{t("c360.risk.inherent.key")}</p>
              <p className="text-sm font-semibold text-[#2d3748]">{t("c360.risk.inherent.val")}</p>
            </div>
            <div className="rounded-lg border border-[#eee] bg-white p-3">
              <p className="mb-1 text-xs text-[#748493]">{t("c360.risk.residual.key")}</p>
              <p className="text-sm font-semibold text-[#2d3748]">{t("c360.risk.residual.val")}</p>
            </div>
            <div className="rounded-lg border border-[#eee] bg-white p-3">
              <p className="mb-1 text-xs text-[#748493]">{t("c360.risk.edd.key")}</p>
              <p className="text-sm font-semibold text-[#2d3748]">{t("c360.risk.edd.val")}</p>
            </div>
          </div>
          <ul className="mt-4 list-disc space-y-1 pl-4 text-sm text-[#2d3748]">
            <li>{t("c360.risk.factor1")}</li>
            <li>{t("c360.risk.factor2")}</li>
            <li>{t("c360.risk.factor3")}</li>
          </ul>
          <div className="mt-4">
            <Button
              type="primary"
              className="mini btn-primary"
              onClick={() => message.success(t("c360.risk.btnMsg"))}
            >
              {t("c360.risk.btn")}
            </Button>
          </div>
        </>
      )}

      {tab === "c-decision" && (
        <>
          <NoteBox>{t("c360.decision.note")}</NoteBox>
          <div className="flex flex-wrap gap-2">
            <Button
              className="mini btn-ghost"
              onClick={() => message.info(t("c360.decision.packageMsg"))}
            >
              {t("c360.decision.package")}
            </Button>
            <Button
              className="mini btn-ghost"
              onClick={() => message.success(t("c360.decision.emailMsg"))}
            >
              {t("c360.decision.email")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#13845b", borderColor: "#13845b", color: "#fff" }}
              onClick={() => message.success(t("c360.decision.conditionalMsg"))}
            >
              {t("c360.decision.conditional")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#e0a83c", borderColor: "#e0a83c", color: "#fff" }}
              onClick={() => message.info(t("c360.decision.supplementMsg"))}
            >
              {t("c360.decision.supplement")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#bb352d", borderColor: "#bb352d", color: "#fff" }}
              onClick={() => message.warning(t("c360.decision.rejectMsg"))}
            >
              {t("c360.decision.reject")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#b8932e", borderColor: "#b8932e", color: "#fff" }}
              onClick={() => message.success(t("c360.decision.escalateMsg"))}
            >
              {t("c360.decision.escalate")}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
