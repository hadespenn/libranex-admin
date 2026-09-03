import { Drawer, Button, Input, App as AntdApp } from "antd";
import { DataList, NoteBox } from "@/components/OpsUI";
import { BTN, BTN_PRIMARY } from "./shared";

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
      destroyOnClose
    >
      <DataList
        items={[
          { label: "Customer", value: customer },
          { label: "SLA", value: sla },
          { label: "Account", value: "Active · KYC approved" },
          { label: "Recent transaction", value: "3 pending · 1 returned" },
        ]}
      />

      <div style={{ marginTop: 16 }}>
        <label
          style={{
            fontSize: 12,
            color: "#66788b",
            display: "block",
            marginBottom: 6,
          }}
        >
          客户回复
        </label>
        <Input.TextArea
          rows={4}
          defaultValue="我们正在核实结算状态，将在收到通道回执后第一时间更新您。"
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Button
          type="primary"
          style={BTN_PRIMARY}
          onClick={() => message.success("回复已发送。")}
        >
          发送回复
        </Button>
        <Button style={BTN} onClick={() => message.info("工单已分派。")}>
          分派
        </Button>
      </div>

      <NoteBox tone="warn">
        客服界面不展示制裁、STR、内部调查等敏感状态；仅使用经过授权的客户可见信息。
      </NoteBox>
    </Drawer>
  );
}
