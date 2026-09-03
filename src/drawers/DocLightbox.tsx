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
      className="kyc-lightbox"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="kyc-lightbox-backdrop" />
      <div
        className="kyc-lightbox-panel"
        style={{
          position: "relative",
          width: "min(760px, 92vw)",
          maxHeight: "88vh",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(16,36,53,.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="kyc-lightbox-head"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 16px",
            borderBottom: "1px solid #dde6ed",
          }}
        >
          <b style={{ fontSize: 14, color: "#142d42", marginRight: "auto" }}>
            {doc.title}
          </b>
          <Button
            className="mini btn-ghost"
            style={{ borderRadius: 999 }}
            onClick={onClose}
          >
            下载
          </Button>
          <button
            aria-label="close"
            onClick={onClose}
            style={{
              border: 0,
              background: "transparent",
              fontSize: 20,
              color: "#748493",
              cursor: "pointer",
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>

        <div
          className="kyc-lightbox-body"
          style={{ padding: 20, overflow: "auto", background: "#eef2f6" }}
        >
          <div
            className="kyc-doc"
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "26px 28px",
              boxShadow: "0 2px 10px rgba(16,36,53,.12)",
              maxWidth: 560,
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: "2px solid #102435",
                paddingBottom: 10,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  background: "#102435",
                  color: "#fff",
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 6,
                  letterSpacing: "0.05em",
                }}
              >
                {doc.badge}
              </span>
              <b style={{ fontSize: 15, color: "#102435" }}>{doc.title}</b>
            </div>

            <div style={{ color: "#748493", fontSize: 11, marginBottom: 14 }}>
              {doc.meta}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 18px",
                marginBottom: 14,
              }}
            >
              {doc.fields.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "1px dotted #d6dee5",
                    paddingBottom: 5,
                  }}
                >
                  <span style={{ fontSize: 10, color: "#9aa7b3" }}>
                    {f.label}
                  </span>
                  <b style={{ fontSize: 13, color: "#1c2c3a" }}>{f.value}</b>
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: 12.5,
                lineHeight: 1.7,
                color: "#33414f",
                whiteSpace: "pre-wrap",
              }}
            >
              {doc.body}
            </div>

            {doc.stamp && (
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  right: 22,
                  border: "2px solid #2fa36b",
                  color: "#2fa36b",
                  borderRadius: 8,
                  padding: "3px 10px",
                  fontSize: 12,
                  transform: "rotate(-8deg)",
                  opacity: 0.85,
                }}
              >
                {doc.stamp}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
