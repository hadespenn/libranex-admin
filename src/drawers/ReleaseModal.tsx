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
      /** 占位提示（非初始值，提交时为空） */
      placeholder?: string;
      /** 只读字段：展示 initial 值，不可编辑 */
      readOnly?: boolean;
      /** 占用的列数（两列栅格，1 或 2），默认 1 */
      span?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "text";
      initial?: string;
      /** 占位提示（非初始值，提交时为空） */
      placeholder?: string;
      /** 只读字段：展示 initial 值，不可编辑 */
      readOnly?: boolean;
      span?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      initial?: string;
      /** 占位提示（非初始值，提交时为空） */
      placeholder?: string;
      /** 只读字段：展示 initial 值，不可编辑 */
      readOnly?: boolean;
      span?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "number";
      initial?: number;
      /** 占位提示（非初始值，提交时为空） */
      placeholder?: string;
      /** 只读字段：展示 initial 值，不可编辑 */
      readOnly?: boolean;
      span?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "checkbox";
      initial?: boolean;
      /** 占位提示（非初始值，提交时为空） */
      placeholder?: string;
      /** 只读字段：展示 initial 值，不可编辑 */
      readOnly?: boolean;
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
  cols,
  width = 620,
  onSubmit,
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
  cols?: number;
  onSubmit?: () => void;
}) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={() => {
        if (onSubmit) {
          onSubmit();
          return;
        }
        form.validateFields().then(() => {
          message.success(toast);
          onClose();
        });
      }}
      okText={submitText}
      cancelText="取消"
      width={width}
    >
      {summary && <DataList items={summary} cols={cols} />}

      <Form form={form} layout="vertical" className="mt-4">
        <div className="grid grid-cols-2 gap-x-4">
          {fields.map((f) => {
            // 将类型断言，避免 TypeScript 判断联合类型时报错
            const selectField = f as Extract<ReleaseField, { type: "select" }>;
            // textarea 默认占满整行：多行说明类字段在两列栅格里压成 1 列既不美观
            // 也难阅读，span=2 与原型排版一致；其他类型维持 1 列默认值。
            const span =
              f.type === "textarea" ? 2 : f.span ?? 1;

            return (
              <div
                key={f.name}
                className={span === 2 ? "col-span-2 min-w-0" : "min-w-0"}
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
                ) : f.readOnly ? (
                  <Form.Item label={f.label}>
                    <Input value={f.initial} readOnly />
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
                        placeholder={f.placeholder}
                        options={selectField.options.map((o) => ({
                          value: o,
                          label: o,
                        }))}
                      />
                    ) : f.type === "number" ? (
                      <InputNumber
                        className="ops-input-full"
                        placeholder={f.placeholder}
                      />
                    ) : f.type === "textarea" ? (
                      <Input.TextArea rows={4} placeholder={f.placeholder} />
                    ) : (
                      <Input placeholder={f.placeholder} />
                    )}
                  </Form.Item>
                )}
              </div>
            );
          })}
        </div>
      </Form>

      {extra}
      {note && <NoteBox tone="info">{note}</NoteBox>}
    </Modal>
  );
}
