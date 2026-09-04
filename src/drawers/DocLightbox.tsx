import { Button } from "antd";

export type DocField = { label: string; value: string };

export type DocView = {
  badge: string; // 'PDF' | 'IMAGE' 等
  title: string; // 例如：公司注册证书 (Certificate of Incorporation)
  meta: string; // 文件路径/日期/大小
  fields: DocField[];
  body: string;
  stamp?: string; // 例如：Verified
};

/** KYC 资料在线查看：以灯箱方式展示 PDF / 图片样本 */
export function DocLightbox({
  doc,
  onClose,
}: {
  doc: DocView;
  onClose: () => void;
}) {
  return (
    <div
      className="kyc-lightbox fixed inset-0 z-[500] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="kyc-lightbox-backdrop" />
      <div
        className="kyc-lightbox-panel relative z-[1] flex max-h-[88vh] w-[min(760px,92vw)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(16,36,53,.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kyc-lightbox-head flex items-center gap-2.5 border-b border-[#dde6ed] px-4 py-[13px]">
          <b className="mr-auto text-sm text-[#142d42]">{doc.title}</b>
          <Button className="mini btn-ghost" onClick={onClose}>
            下载
          </Button>
          <button
            aria-label="close"
            onClick={onClose}
            className="cursor-pointer border-0 bg-transparent px-1 text-xl text-[#748493]"
          >
            ×
          </button>
        </div>

        <div className="kyc-lightbox-body overflow-auto bg-[#eef2f6] p-5">
          <div className="kyc-doc relative mx-auto max-w-[560px] rounded-lg bg-white px-7 py-[26px] shadow-[0_2px_10px_rgba(16,36,53,.12)]">
            <div className="mb-3.5 flex items-center gap-2.5 border-b-2 border-[#102435] pb-2.5">
              <span className="rounded-md bg-[#102435] px-2 py-0.5 text-[10px] tracking-[0.05em] text-white">
                {doc.badge}
              </span>
              <b className="text-[15px] text-[#102435]">{doc.title}</b>
            </div>

            <div className="mb-3.5 text-[11px] text-[#748493]">{doc.meta}</div>

            <div className="mb-3.5 grid grid-cols-2 gap-x-[18px] gap-y-2">
              {doc.fields.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col border-b border-dotted border-[#d6dee5] pb-[5px]"
                >
                  <span className="text-[10px] text-[#9aa7b3]">{f.label}</span>
                  <b className="text-[13px] text-[#1c2c3a]">{f.value}</b>
                </div>
              ))}
            </div>

            <div className="whitespace-pre-wrap text-[12.5px] leading-[1.7] text-[#33414f]">
              {doc.body}
            </div>

            {doc.stamp && (
              <div className="absolute right-[22px] top-[18px] rotate-[-8deg] rounded-lg border-2 border-[#2fa36b] px-2.5 py-[3px] text-xs text-[#2fa36b] opacity-85">
                {doc.stamp}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
