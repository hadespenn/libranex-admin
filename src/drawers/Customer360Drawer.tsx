import { useState } from "react";
import { Drawer, Button, App as AntdApp } from "antd";
import { DataList, NoteBox, OpsTable } from "@/components/OpsUI";
import { TabPills } from "./shared";

/** 与 pages/Customers 的 CustomerRow 保持一致的最小结构（避免跨模块引入页面） */
export type Customer360Row = {
  key: string;
  name: string;
  kyc: string;
  kycTone: "green" | "red";
  accounts: string;
  capability: string;
  lastActive: string;
};

/**
 * 客户 360 抽屉（原型：右侧侧滑 Drawer，7 个标签）。
 * 仅用于 Customers 页面顶部「客户 360」入口；KycDrawer 保持不动。
 * 数据来源：CustomerRow（表格行）+ 开户向导原型中的企业主体字段。
 */
export function Customer360Drawer({
  open,
  onClose,
  row,
}: {
  open: boolean;
  onClose: () => void;
  row: Customer360Row | null;
}) {
  const { message } = AntdApp.useApp();
  const [tab, setTab] = useState("c-profile");

  // 企业资料：按原型（截图）真实字段；按商户名映射
  const profileBy =
    row?.name === "Atlas Commerce Ltd."
      ? {
          legalName: "Atlas Commerce Ltd.",
          jurisdiction: "Singapore",
          industry: "Cross-border e-commerce",
          expectedVolume: "USD 5M–20M / year",
          note: "客户资料、地址、经营范围及预期交易量信息已形成版本快照。敏感字段受权限控制，查看完整证件号需记录访问理由。",
        }
      : {
          legalName: "Unity Centre Investment Ltd.",
          jurisdiction: "Canada",
          industry: "Cross-border payment infrastructure",
          expectedVolume: "USD 5M–20M / year",
          note: "客户资料、地址、经营范围及预期交易量信息已形成版本快照。敏感字段受权限控制，查看完整证件号需记录访问理由。",
        };

  const tabs = [
    { key: "c-profile", label: "企业资料" },
    { key: "c-docs", label: "材料核验" },
    { key: "c-ubo", label: "UBO 图谱" },
    { key: "c-screen", label: "筛查" },
    { key: "c-risk", label: "风险/EDD" },
    { key: "c-decision", label: "审核决定" },
  ];

  return (
    <Drawer
      title={row ? `KYC 客户 360 · ${row.name}` : "KYC 客户 360"}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnHidden
    >
      {row && (
        <>
          {/* 头部：名称 + KYC 状态 + 能力三联 */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-[19px] font-bold text-[#142d42]">
                {row.name}
              </div>
              <div className="mt-0.5 text-xs text-[#748493]">
                {row.accounts} 个账户 · 最近活跃 {row.lastActive}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-1.5">
              <span
                className={`ops-chip ${row.kycTone === "green" ? "green" : "red"}`}
              >
                {row.kyc}
              </span>
            </div>
          </div>

          <TabPills items={tabs} value={tab} onChange={setTab} />

          {tab === "c-profile" && (
            <>
              <DataList
                cols={2}
                items={[
                  { label: "Legal name", value: profileBy.legalName },
                  { label: "Jurisdiction", value: profileBy.jurisdiction },
                  { label: "Industry", value: profileBy.industry },
                  { label: "Expected volume", value: profileBy.expectedVolume },
                ]}
              />
              <div className="mt-3">
                <NoteBox>{profileBy.note}</NoteBox>
              </div>
            </>
          )}

          {tab === "c-docs" && (
            <>
              <OpsTable
                data={[
                  { key: "inc", name: "注册证照", ver: "v2 · hash retained", check: "Entity registry matched", tone: "green" },
                  { key: "addr", name: "地址证明", ver: "v1", check: "Expired 3 days", tone: "amber" },
                  { key: "auth", name: "授权决议", ver: "v1", check: "Signer mismatch", tone: "red" },
                ]}
                columns={[
                  { key: "name", title: "材料", render: (r) => r.name },
                  { key: "ver", title: "版本", render: (r) => r.ver },
                  { key: "check", title: "核验", render: (r) => r.check },
                  {
                    key: "tone",
                    title: "结论",
                    render: (r) => (
                      <span className={`ops-chip ${r.tone}`}>
                        {r.tone === "green"
                          ? "通过"
                          : r.tone === "amber"
                          ? "需补件"
                          : "不一致"}
                      </span>
                    ),
                  },
                ]}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="primary"
                  className="mini link"
                  onClick={() => message.success("已发送任性补件请求。")}
                >
                  发送任性补件请求
                </Button>
                <Button
                  className="mini link"
                  onClick={() => message.info("资料包已生成，可下载。")}
                >
                  查看资料包
                </Button>
              </div>
            </>
          )}

          {tab === "c-ubo" && (
            <>
              <div className="relative overflow-hidden rounded-2xl bg-[#0a1e36] p-5 text-white" style={{ minHeight: 260 }}>
                {/* 图谱节点：Atlas Commerce */}
                <div className="absolute left-[18%] top-4">
                  <span className="inline-block rounded-full bg-[#1a3a5c] px-3.5 py-1.5 text-[13px] font-medium text-white/90 border border-[#2a4a6c]">
                    Atlas Commerce
                  </span>
                </div>

                {/* 连接线：Atlas Commerce -> 中心 */}
                <div className="absolute left-[28%] top-12 h-10 w-px bg-[#2a4a6c]" />
                <div className="absolute left-[28%] top-[88px] h-px w-[28%] bg-[#2a4a6c]" />
                <div className="absolute left-[28%] top-[88px] h-8 w-px bg-[#2a4a6c]" />
                <div className="absolute left-[56%] top-[88px] h-8 w-px bg-[#2a4a6c]" />

                {/* 中心图片/图表占位 */}
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

                {/* 连接线：中心 -> 左下 */}
                <div className="absolute left-[28%] top-[152px] h-6 w-px bg-[#2a4a6c]" />
                <div className="absolute left-[28%] top-[176px] h-px w-[12%] bg-[#2a4a6c]" />
                <div className="absolute left-[40%] top-[176px] h-5 w-px bg-[#2a4a6c]" />

                {/* 连接线：中心 -> 右下 */}
                <div className="absolute left-[56%] top-[152px] h-6 w-px bg-[#2a4a6c]" />
                <div className="absolute left-[56%] top-[176px] h-px w-[16%] bg-[#2a4a6c]" />
                <div className="absolute left-[72%] top-[176px] h-5 w-px bg-[#2a4a6c]" />

                {/* 图谱节点：Chunhua Xu 54% */}
                <div className="absolute bottom-5 left-[28%]">
                  <span className="inline-block rounded-full bg-[#1a3a5c] px-3 py-1.5 text-xs font-medium text-white/90 border border-[#2a4a6c]">
                    Chunhua Xu 54%
                  </span>
                </div>

                {/* 图谱节点：Alex Morgan 46% */}
                <div className="absolute bottom-5 right-[18%]">
                  <span className="inline-block rounded-full bg-[#1a3a5c] px-3 py-1.5 text-xs font-medium text-white/90 border border-[#2a4a6c]">
                    Alex Morgan 46%
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#748493]">
                自动校验控制链穿透与 25% 阈值覆盖。当前缺少 Holding Co. 的董事名册与控制权证据。
              </p>
            </>
          )}

          {tab === "c-screen" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#eee] bg-white p-3">
                  <p className="mb-1 text-xs text-[#748493]">Sanctions</p>
                  <p className="text-sm font-semibold text-[#d69e2e]">Potential match · paused</p>
                </div>
                <div className="rounded-lg border border-[#eee] bg-white p-3">
                  <p className="mb-1 text-xs text-[#748493]">PEP / HIO</p>
                  <p className="text-sm font-medium text-[#2d3748]">Potential relationship</p>
                </div>
                <div className="rounded-lg border border-[#eee] bg-white p-3">
                  <p className="mb-1 text-xs text-[#748493]">Adverse media</p>
                  <p className="text-sm font-semibold text-[#2d3748]">1 relevant result</p>
                </div>
                <div className="rounded-lg border border-[#eee] bg-white p-3">
                  <p className="mb-1 text-xs text-[#748493]">List version</p>
                  <p className="text-sm font-medium text-[#2d3748]">2026-07-30 09:55 UTC</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-[#cce8ff] bg-[#f0f8ff] px-3 py-2.5 text-xs leading-relaxed text-[#27516f]">
                可能匹配不得由运营单独放行；需结合二级识别信息、证据与合规复核。对客不得披露筛查原因。
              </div>
            </>
          )}

          {tab === "c-risk" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-[#eee] bg-white p-3">
                  <p className="mb-1 text-xs text-[#748493]">Inherent risk</p>
                  <p className="text-sm font-semibold text-[#2d3748]">18 / 25</p>
                </div>
                <div className="rounded-lg border border-[#eee] bg-white p-3">
                  <p className="mb-1 text-xs text-[#748493]">Residual risk</p>
                  <p className="text-sm font-semibold text-[#2d3748]">High</p>
                </div>
                <div className="rounded-lg border border-[#eee] bg-white p-3">
                  <p className="mb-1 text-xs text-[#748493]">EDD</p>
                  <p className="text-sm font-semibold text-[#2d3748]">Required</p>
                </div>
              </div>
              <ul className="mt-4 list-disc space-y-1 pl-4 text-sm text-[#2d3748]">
                <li>复杂 UBO 结构: +5</li>
                <li>PEP 潜在关联: +4</li>
                <li>贸易路线高风险因素: +3</li>
              </ul>
              <div className="mt-4">
                <Button
                  type="primary"
                  className="mini link"
                  onClick={() => message.success("EDD 清单与高级审批已生成。")}
                >
                  生成 EDD 清单与高级审批
                </Button>
              </div>
            </>
          )}

        

          {tab === "c-decision" && (
            <>
              <NoteBox>
                所有决定均记录理由、证据、审核人、时间、前后状态与客户可见文案。审核前可直接查看资料包，并针对缺失材料发送中性补件邮件。
              </NoteBox>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="mini btn-ghost"
                  onClick={() => message.info("资料包已生成，可下载。")}
                >
                  查看资料包
                </Button>
                <Button
                  className="mini btn-ghost"
                  onClick={() => message.success("补件邮件已发送。")}
                >
                  发送补件邮件
                </Button>
                <Button
                  className="mini"
                  style={{ background: '#13845b', borderColor: '#13845b', color: '#fff' }}
                  onClick={() => message.success("已条件化通过。")}
                >
                  条件化通过
                </Button>
                <Button
                  className="mini"
                  style={{ background: '#e0a83c', borderColor: '#e0a83c', color: '#fff' }}
                  onClick={() => message.info("已要求补件。")}
                >
                  补件
                </Button>
                <Button
                  className="mini"
                  style={{ background: '#bb352d', borderColor: '#bb352d', color: '#fff' }}
                  onClick={() => message.warning("已拒绝。")}
                >
                  拒绝
                </Button>
                <Button
                  className="mini"
                  style={{ background: '#b8932e', borderColor: '#b8932e', color: '#fff' }}
                  onClick={() => message.success("已升级 EDD。")}
                >
                  升级 EDD
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Drawer>
  );
}
