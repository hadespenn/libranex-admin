import { Drawer, Button, Input, App as AntdApp } from "antd";
import { DataList, NoteBox } from "@/components/OpsUI";

/** 客服工单抽屉 */
export function TicketDrawer({
  open,
  onClose,
  ticketId = "#TCK-9321",
  customer = "Unity Centre Investment Ltd.",
  sla = "22m remaining",
}: {
  open: boolean;
  onClose: () => void;
  ticketId?: string;
  customer?: string;
  sla?: string;
}) {
  const { message } = AntdApp.useApp();

  return (
    <Drawer
      title={`工单 ${ticketId} · Settlement delay`}
      open={open}
      onClose={onClose}
      width={620}
      className="ops-drawer"
      styles={{ body: { padding: 22 } }}
      destroyOnHidden
    >
      <DataList
        items={[
          { label: "Customer", value: customer },
          { label: "SLA", value: sla },
          { label: "Account", value: "Active · KYC approved" },
          { label: "Recent transaction", value: "3 pending · 1 returned" },
        ]}
      />

      <div className="mt-4">
        <label className="mb-1.5 block text-xs text-muted">客户回复</label>
        <Input.TextArea
          rows={4}
          defaultValue="我们正在核实结算状态，将在收到通道回执后第一时间更新您。"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          type="primary"
          className="mini btn-primary"
          onClick={() => message.success("回复已发送。")}
        >
          发送回复
        </Button>
        <Button
          className="mini btn-ghost"
          onClick={() => message.info("工单已分派。")}
        >
          分派
        </Button>
      </div>

      <NoteBox tone="warn">
        客服界面不展示制裁、STR、内部调查等敏感状态；仅使用经过授权的客户可见信息。
      </NoteBox>
    </Drawer>
  );
}
