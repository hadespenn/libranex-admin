import { useState } from "react";
import { Drawer, Modal, Button, Input, Select, Checkbox, App as AntdApp } from "antd";
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
  // 子弹框：资料包 / 补件邮件 / 邮件预览（按原型 d-docs/d-decision 的两个动作）
  const [packOpen, setPackOpen] = useState(false);
  const [suppOpen, setSuppOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  // 审核决定（d-decision）子弹框：条件化通过 / 拒绝 / 升级 EDD
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("material");
  const [eddOpen, setEddOpen] = useState(false);
  const [eddChecked, setEddChecked] = useState(false);

  return (
    <>
      <Drawer
        title={t("c360.title", { name })}
        open={open}
        onClose={onClose}
        width={720}
        className="ops-drawer c360-drawer"
        styles={{ body: { padding: 22 } }}
        destroyOnHidden
      >
      <TabPills
        items={TABS.map((x) => ({ key: x.key, label: t(x.label) }))}
        value={tab}
        onChange={setTab}
      />

      {tab === "c-profile" && (
        <>
          <DataList
            cols={2}
            items={[
              { label: t("c360.legalName"), value: "Atlas Commerce Ltd." },
              { label: t("c360.jurisdiction"), value: "Singapore" },
              { label: t("c360.industry"), value: "Cross-border e-commerce" },
              { label: t("c360.expectedVolume"), value: "USD 5M–20M / year" },
            ]}
          />
          <NoteBox>{t("c360.profileNote")}</NoteBox>
        </>
      )}

      {tab === "c-docs" && (
        <div className="overflow-hidden rounded-2xl border border-[#dde6ed]">
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr] gap-2 border-b border-[#cce8ff] bg-[#f0f8ff] px-4 py-2 text-[12px] font-semibold text-[#27516f]">
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
            </div>
          </div>
          <div className="flex gap-2 border-t border-[#dde6ed] px-4 py-2.5">
            <Button
              className="mini link"
              onClick={() => setSuppOpen(true)}
            >
              {t("c360.btnSendSupplement")}
            </Button>
            <Button
              className="mini link"
              onClick={() => setPackOpen(true)}
            >
              {t("c360.btnViewPackage")}
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
          <p className="text-xs text-[#748493]" style={{ marginTop: '1em'}}>{t("c360.uboNote")}</p>
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
          <div className="mt-3 rounded-lg border border-[#cce8ff] bg-[#f0f8ff] px-3 py-2.5 text-xs leading-relaxed text-[#27516f]">
            {t("c360.screen.note")}
          </div>
        </>
      )}

      {tab === "c-risk" && (
        <>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              className="mini link"
              onClick={() => message.success(t("c360.risk.btnMsg"))}
            >
              {t("c360.risk.btn")}
            </Button>
          </div>
        </>
      )}

      {tab === "c-decision" && (
        <>
          <p style={{ margnTop: '1em' }}>{t("c360.decision.note")}</p>
          <div className="flex flex-wrap gap-2">
            <Button className="mini btn-ghost" onClick={() => setPackOpen(true)}>
              {t("c360.decision.package")}
            </Button>
            <Button className="mini btn-ghost" onClick={() => setSuppOpen(true)}>
              {t("c360.decision.email")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#13845b", borderColor: "#13845b", color: "#fff" }}
              onClick={() => setApproveOpen(true)}
            >
              {t("c360.decision.conditional")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#e0a83c", borderColor: "#e0a83c", color: "#fff" }}
              onClick={() => message.info(t("c360.decision.requestDocsMsg"))}
            >
              {t("c360.decision.supplement")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#bb352d", borderColor: "#bb352d", color: "#fff" }}
              onClick={() => { setRejectReason("material"); setRejectOpen(true); }}
            >
              {t("c360.decision.reject")}
            </Button>
            <Button
              className="mini"
              style={{ background: "#b8932e", borderColor: "#b8932e", color: "#fff" }}
              onClick={() => { setEddChecked(false); setEddOpen(true); }}
            >
              {t("c360.decision.escalate")}
            </Button>
          </div>
        </>
      )}
    </Drawer>

    {/* 子弹框 1：KYC 资料包（按 prototype.html 第 868 行 viewKycDocument） */}
    <Modal
      open={packOpen}
      title={t("c360.pack.title")}
      onCancel={() => setPackOpen(false)}
      footer={null}
      centered
      width={580}
      destroyOnHidden
    >
      <DataList
        items={[
          { label: "Company registration", value: "Verified · OCR 98% · hash retained" },
          { label: "Registered address", value: "Singapore · proof expired 3 days ago" },
          { label: "Ownership chart", value: "Holding Co. 60% · director evidence missing" },
          { label: "UBO identity", value: "Alex Morgan / Chunhua Xu · review required" },
          { label: "Source of funds", value: "Uploaded · pending analyst review" },
        ]}
      />
      <NoteBox>{t("c360.pack.note")}</NoteBox>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button className="mini btn-ghost" onClick={() => { setPackOpen(false); setSuppOpen(true); }}>
          {t("c360.pack.sendBasedOnDocs")}
        </Button>
        <Button type="primary" className="mini btn-primary" onClick={() => setPackOpen(false)}>
          {t("common.close")}
        </Button>
      </div>
    </Modal>

    {/* 子弹框 2：发送 KYC 补件邮件（按 prototype.html sendKycSupplementEmail） */}
    <Modal
      open={suppOpen}
      title={t("c360.supp.title")}
      onCancel={() => setSuppOpen(false)}
      footer={null}
      centered
      width={620}
      destroyOnHidden
    >
      <NoteBox>{t("c360.supp.note")}</NoteBox>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
            {t("c360.supp.recipient")}
          </label>
          <Input
            id="supplementRecipient"
            defaultValue="finance@atlas-commerce.com"
            placeholder={t("c360.supp.recipientPh")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
            {t("common.subject")}
          </label>
          <Input
            id="supplementSubject"
            defaultValue="Libranex · KYC document request · KY-202607-1042"
          />
        </div>
      </div>
      <label className="mb-1.5 mt-3 block text-xs font-semibold text-[#354454]">
        {t("c360.supp.docs")}
      </label>
      <Input.TextArea
        id="supplementDocs"
        rows={4}
        defaultValue={
          "地址证明（有效期内）\n授权决议或董事会决议\nHolding Co. 董事名册与控制权证明"
        }
      />
      <label className="mb-1.5 mt-3 block text-xs font-semibold text-[#354454]">
        {t("c360.supp.message")}
      </label>
      <Input.TextArea
        id="supplementMessage"
        rows={3}
        defaultValue="请通过安全上传入口提交以上材料。提交后我们会继续审核。"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button className="mini btn-ghost" onClick={() => setPreviewOpen(true)}>
          {t("c360.supp.previewBtn")}
        </Button>
        <Button
          type="primary"
          className="mini btn-primary"
          onClick={() => {
            message.success(t("c360.supp.sentMsg"));
            setSuppOpen(false);
          }}
        >
          {t("c360.supp.sendBtn")}
        </Button>
      </div>
    </Modal>

    {/* 子弹框 3：邮件预览（按 prototype.html previewKycSupplementEmail） */}
    <Modal
      open={previewOpen}
      title={t("c360.preview.title")}
      onCancel={() => setPreviewOpen(false)}
      footer={null}
      centered
      width={620}
      destroyOnHidden
    >
      <div className="rounded-lg border border-[#cce8ff] bg-[#f0f8ff] px-3 py-2.5 text-xs leading-relaxed text-[#27516f]">
        <div><b>To:</b> finance@atlas-commerce.com</div>
        <div><b>{t("common.subject")}:</b> Libranex · KYC document request · KY-202607-1042</div>
      </div>
      <div className="mt-3 rounded-lg border border-[#dde6ed] bg-white p-3 text-sm whitespace-pre-wrap text-[#1c2c3a]">
        地址证明（有效期内）{"\n"}授权决议或董事会决议{"\n"}Holding Co. 董事名册与控制权证明
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button className="mini btn-ghost" onClick={() => setPreviewOpen(false)}>
          {t("c360.preview.back")}
        </Button>
        <Button
          type="primary"
          className="mini btn-primary"
          onClick={() => {
            message.success(t("c360.supp.sentMsg"));
            setPreviewOpen(false);
            setSuppOpen(false);
          }}
        >
          {t("c360.preview.confirm")}
        </Button>
      </div>
    </Modal>

    {/* 子弹框 4：条件化通过 KYC（按 prototype.html kycApprove） */}
    <Modal
      open={approveOpen}
      title={t("c360.approve.title")}
      onCancel={() => setApproveOpen(false)}
      footer={null}
      centered
      width={620}
      destroyOnHidden
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
            {t("c360.approve.conditionsLabel")}
          </label>
          <Input.TextArea id="approvalConditions" rows={4} defaultValue={t("c360.approve.conditionsPh")} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
            {t("c360.approve.noteLabel")}
          </label>
          <Input.TextArea id="approvalNote" rows={4} defaultValue={t("c360.approve.notePh")} />
        </div>
      </div>
      <div className="mt-3">
        <Button
          type="primary"
          className="mini btn-primary"
          onClick={() => {
            message.success(t("c360.approve.okMsg"));
            setApproveOpen(false);
          }}
        >
          {t("c360.approve.submit")}
        </Button>
      </div>
    </Modal>

    {/* 子弹框 5：KYC 拒绝决定（按 prototype.html kycReject） */}
    <Modal
      open={rejectOpen}
      title={t("c360.reject.title")}
      onCancel={() => setRejectOpen(false)}
      footer={null}
      centered
      width={620}
      destroyOnHidden
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
            {t("c360.reject.reasonLabel")}
          </label>
          <Select
            value={rejectReason}
            onChange={setRejectReason}
            className="w-full"
            options={[
              { value: "material", label: t("c360.reject.reason.material") },
              { value: "scope", label: t("c360.reject.reason.scope") },
              { value: "ownership", label: t("c360.reject.reason.ownership") },
              { value: "screen", label: t("c360.reject.reason.screen") },
            ]}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#354454]">
            {t("c360.reject.rationaleLabel")}
          </label>
          <Input.TextArea id="rejectRationale" rows={4} />
        </div>
      </div>
      <label className="mb-1.5 mt-3 block text-xs font-semibold text-[#354454]">
        {t("c360.reject.noteLabel")}
      </label>
      <Input.TextArea id="rejectNote" rows={3} defaultValue={t("c360.reject.notePh")} />
      <div className="mt-3">
        <Button
          danger
          type="primary"
          className="mini"
          style={{ background: "#fff4f2", borderColor: "#ffd5cf", color: "#b42318" }}
          onClick={() => {
            message.success(t("c360.reject.okMsg"));
            setRejectOpen(false);
          }}
        >
          {t("c360.reject.submit")}
        </Button>
      </div>
    </Modal>

    {/* 子弹框 6：创建 EDD 审核任务（按 prototype.html startEdd） */}
    <Modal
      open={eddOpen}
      title={t("c360.edd.title")}
      onCancel={() => setEddOpen(false)}
      footer={null}
      centered
      width={620}
      destroyOnHidden
    >
      <p className="text-sm leading-relaxed text-[#3a4a5a]">{t("c360.edd.desc")}</p>
      <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-[#3a4a5a]">
        <Checkbox
          checked={eddChecked}
          onChange={(e) => setEddChecked(e.target.checked)}
          className="mt-0.5"
        />
        <span>{t("c360.edd.confirm")}</span>
      </label>
      <div className="mt-3">
        <Button
          type="primary"
          className="mini btn-primary"
          onClick={() => {
            if (!eddChecked) {
              message.warning(t("c360.edd.needConfirmMsg"));
              return;
            }
            message.success(t("c360.edd.okMsg"));
            setEddOpen(false);
          }}
        >
          {t("c360.edd.submit")}
        </Button>
      </div>
    </Modal>
    </>
  );
}
