import { Drawer, Button, Input, App as AntdApp } from "antd";
import { DataList, NoteBox } from "@/components/OpsUI";
import { useI18n } from "@/i18n";

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
  const { t } = useI18n();

  return (
    <Drawer
      title={t("drawer.ticket.titleTpl", {
        id: ticketId,
        subject: t("page.tickets.categorySettleDelay"),
      })}
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
        <label className="mb-1.5 block text-xs text-muted">
          {t("drawer.ticket.replyLabel")}
        </label>
        <Input.TextArea
          rows={4}
          defaultValue={t("drawer.ticket.replyDefault")}
        />
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          type="primary"
          className="mini btn-primary"
          onClick={() => message.success(t("drawer.ticket.btnSendMsg"))}
        >
          {t("drawer.ticket.btnSend")}
        </Button>
        <Button
          className="mini btn-ghost"
          onClick={() => message.info(t("drawer.ticket.btnDispatchMsg"))}
        >
          {t("drawer.ticket.btnDispatchShort")}
        </Button>
      </div>

      <NoteBox tone="warn">{t("drawer.ticket.note")}</NoteBox>
    </Drawer>
  );
}
