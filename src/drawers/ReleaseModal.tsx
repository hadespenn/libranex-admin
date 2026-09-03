import type { ReactNode } from "react";
import {
  Modal,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Form,
  App as AntdApp,
} from "antd";
import { DataList, NoteBox } from "@/components/OpsUI";

/**
 * 通用「资金放行 / 释放 / 冻结」类弹框。
 * 通过 fields 声明式描述表单，业务页面只关心传什么字段，不关心表单布局。
 */
export type ReleaseField =
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
      initial?: string;
      /** 占用的列数（两列栅格，1 或 2），默认 1 */
      span?: 1 | 2;
    }
  | { name: string; label: string; type: "text"; initial?: string; span?: 1 | 2 }
  | {
      name: string;
      label: string;
      type: "textarea";
      initial?: string;
      span?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "number";
      initial?: number;
      span?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "checkbox";
      initial?: boolean;
      span?: 1 | 2;
    };

export function ReleaseModal({
  open,
  onClose,
  title,
  fields,
  submitText = "提交",
  toast,
  note,
  summary,
  extra,
  width = 620,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: ReleaseField[];
  submitText?: string;
  toast: string;
  note?: string;
  summary?: { label: string; value: string }[];
  extra?: ReactNode;
  width?: number;
}) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={() => {
        form.validateFields().then(() => {
          message.success(toast);
          onClose();
        });
      }}
      okText={submitText}
      cancelText="取消"
      width={width}
    >
      {note && <NoteBox tone="info">{note}</NoteBox>}
      {summary && <DataList items={summary} />}

      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0 16px",
          }}
        >
          {fields.map((f) => {
            // 将类型断言，避免 TypeScript 判断联合类型时报错
            const selectField = f as Extract<ReleaseField, { type: "select" }>;
            const span = f.span ?? 1;

            return (
              <div
                key={f.name}
                style={{ gridColumn: `span ${span}`, minWidth: 0 }}
              >
                {f.type === "checkbox" ? (
                  // checkbox 的 label 直接作为勾选框文案，不再额外渲染一遍 Form.Item label
                  <Form.Item
                    name={f.name}
                    valuePropName="checked"
                    initialValue={f.initial}
                    rules={[
                      {
                        validator: (_r, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(new Error("请勾选确认")),
                      },
                    ]}
                  >
                    <Checkbox>{f.label}</Checkbox>
                  </Form.Item>
                ) : (
                  <Form.Item
                    name={f.name}
                    label={f.label}
                    initialValue={f.initial}
                    rules={[{ required: true, message: `请填写${f.label}` }]}
                  >
                    {f.type === "select" ? (
                      <Select
                        options={selectField.options.map((o) => ({
                          value: o,
                          label: o,
                        }))}
                      />
                    ) : f.type === "number" ? (
                      <InputNumber style={{ width: "100%" }} />
                    ) : f.type === "textarea" ? (
                      <Input.TextArea rows={4} />
                    ) : (
                      <Input />
                    )}
                  </Form.Item>
                )}
              </div>
            );
          })}
        </div>
      </Form>

      {extra}
    </Modal>
  );
}
