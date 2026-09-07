import type { ReactNode } from "react";
import {
  Modal,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Form,
  Button,
  App as AntdApp,
} from "antd";
import { DataList, NoteBox } from "@/components/OpsUI";
import { useI18n } from "@/i18n";

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
  rejectText,
  rejectToast,
  note,
  desc,
  summary,
  extra,
  cols,
  width = 620,
  onSubmit,
  onReject,
  reverseFooter = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: ReleaseField[];
  submitText?: string;
  toast: string;
  /** 驳回按钮文案；不传则不渲染驳回按钮 */
  rejectText?: string;
  /** 驳回后的成功提示文案 */
  rejectToast?: string;
  note?: string;
  /** 顶部蓝色说明条文案（不传则不渲染） */
  desc?: string;
  summary?: { label: string; value: string }[];
  extra?: ReactNode;
  width?: number;
  cols?: number;
  onSubmit?: () => void;
  onReject?: () => void;
  /** 颠倒底部按钮顺序：主操作在左，取消在右；用于「新建」类弹框 */
  reverseFooter?: boolean;
}) {
  const { message } = AntdApp.useApp();
  const { t } = useI18n();
  const [form] = Form.useForm();

  const handleApprove = () => {
    if (onSubmit) {
      onSubmit();
      return;
    }
    form.validateFields().then(() => {
      message.success(toast);
      onClose();
    });
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
      return;
    }
    form.validateFields().then(() => {
      if (rejectToast) message.success(rejectToast);
      onClose();
    });
  };

  const renderFooter = () => {
    const cancelBtn = (
      <Button key="cancel" onClick={onClose}>
        {t("common.cancel")}
      </Button>
    );
    const okBtn = (
      <Button
        key="ok"
        type="primary"
        className="btn-primary"
        onClick={handleApprove}
      >
        {submitText}
      </Button>
    );
    if (rejectText) {
      // 审批类：取消(左) · 驳回(ghost) · 同意并发布(右, primary)
      return [
        cancelBtn,
        <Button key="reject" className="btn-ghost" onClick={handleReject}>
          {rejectText}
        </Button>,
        okBtn,
      ];
    }
    if (reverseFooter) {
      // 新建类：提交(左, primary) · 取消(右)
      return [okBtn, cancelBtn];
    }
    return undefined; // 走 Antd 默认：取消(左) · 确定(右, primary)
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={handleApprove}
      okText={submitText}
      cancelText={t("common.cancel")}
      width={width}
      footer={renderFooter()}
    >
      {desc && <NoteBox tone="info">{desc}</NoteBox>}
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
                    rules={[{ required: true, message: t('common.required') + f.label }]}
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
