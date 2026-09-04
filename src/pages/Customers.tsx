import { useMemo, useState } from 'react';
import { Button, Input, Select } from 'antd';
import { Metrics, Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { KycDrawer, ReleaseModal, Customer360Drawer } from '@/drawers';

const MERCHANTS = [
  { value: 'atlas', label: 'Atlas Commerce Ltd. · KY-202607-1042' },
  { value: 'unity', label: 'Unity Centre Investment Ltd. · KY-202607-1038' },
];

type AccountRow = {
  key: string;
  account: string;
  type: string;
  network: string;
  balance: string;
  status: string;
  tone: 'green' | 'yellow';
  updated: string;
};

const ACCOUNTS: AccountRow[] = [
  {
    key: 'usd',
    account: 'USD · 8301 2245 6677',
    type: '法币账户',
    network: 'ACH / SWIFT',
    balance: '$4,210,320.18',
    status: '可用',
    tone: 'green',
    updated: '刚刚',
  },
  {
    key: 'eur',
    account: 'EUR · 7301 9921 4421',
    type: '法币账户',
    network: 'SEPA',
    balance: '€920,180.00',
    status: '可用',
    tone: 'green',
    updated: '刚刚',
  },
  {
    key: 'sgd',
    account: 'SGD · 4200 0100 9900',
    type: '法币账户',
    network: 'FAST',
    balance: 'S$1,480,000.00',
    status: '可用',
    tone: 'green',
    updated: '刚刚',
  },
  {
    key: 'usdt',
    account: 'USDT · 0x82F1...AA91',
    type: '虚拟币账户',
    network: 'TRON · TRC20',
    balance: '680,400.00 USDT',
    status: '可用',
    tone: 'green',
    updated: '2 分钟前',
  },
  {
    key: 'usdc',
    account: 'USDC · 0x4A90...19C2',
    type: '虚拟币账户',
    network: 'Ethereum · ERC20',
    balance: '600,000.00 USDC',
    status: '筛查中',
    tone: 'yellow',
    updated: '2 分钟前',
  },
];

type CustomerRow = {
  key: string;
  name: string;
  kyc: string;
  kycTone: 'green' | 'red';
  accounts: string;
  capability: string;
  lastActive: string;
};

const CUSTOMERS: CustomerRow[] = [
  {
    key: 'unity',
    name: 'Unity Centre Investment Ltd.',
    kyc: 'Active · Medium',
    kycTone: 'green',
    accounts: '4 accounts',
    capability: 'Accounts, payout, FX',
    lastActive: '10:24',
  },
  {
    key: 'atlas',
    name: 'Atlas Commerce Ltd.',
    kyc: 'EDD · High',
    kycTone: 'red',
    accounts: '1 account',
    capability: 'Restricted',
    lastActive: '09:56',
  },
];

export default function Customers() {
  const [merchant, setMerchant] = useState('atlas');
  const [frozen, setFrozen] = useState(false);
  const [status, setStatus] = useState('__all__');
  const [kw, setKw] = useState('');
  const [detail, setDetail] = useState<CustomerRow | null>(null);
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [freezeAccount, setFreezeAccount] = useState<AccountRow | null>(null);
  const [c360Row, setC360Row] = useState<CustomerRow | null>(null);

  const rows = useMemo(() => {
    const q = kw.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      if (status !== '__all__') {
        // 中文标签对中文文案匹配，已激活/受限/冻结 对应 kyc 字符串
        const map: Record<string, string[]> = {
          已激活: ['Active'],
          受限: ['Restricted', 'EDD'],
          冻结: ['Frozen', 'Blacklist'],
        };
        const needles = map[status] ?? [status];
        const ok = needles.some((n) => c.kyc.includes(n));
        if (!ok) return false;
      }
      if (!q) return true;
      return `${c.name} ${c.kyc} ${c.capability}`.toLowerCase().includes(q);
    });
  }, [status, kw]);

  const filterActive = status !== '__all__' || kw.length > 0;

  return (
    <>
      <Panel
        title="客户资金与账户总览"
        desc="查看商户所有法币与虚拟币账户余额、资产总额估算及冻结状态。"
        actions={
          <div className="flex flex-wrap gap-2">
            <Select
              className="ops-w-260"
              value={merchant}
              onChange={setMerchant}
              options={MERCHANTS}
            />
            <Button
              className="mini btn-ghost"
              onClick={() =>
                setC360Row(CUSTOMERS.find((c) => c.key === merchant) ?? null)
              }
            >
              客户 360
            </Button>
            <Button
              className="mini btn-danger"
              onClick={() => setFreezeOpen(true)}
            >
              冻结商户整体
            </Button>
          </div>
        }
      >
        <Metrics
          cols={4}
          items={[
            { label: '资产总额估算 · USD', value: '$8,420,680', note: '按参考汇率折算', tone: 'ok'},
            { label: '法币账户余额', value: '$7,140,280', note: '4 accounts' },
            { label: '虚拟币账户余额', value: '$1,280,400', note: '2 assets' },
            {
              label: '可用 / 受限',
              value: '5 / 1',
              note: frozen ? '商户状态：已冻结' : '商户状态：正常',
              tone: frozen ? ('bad' as const) : 'ok',
            },
          ]}
        />
      </Panel>

      <Panel title="账户余额明细">
        <NoteBox>余额为运营视图估算值，实际冻结以账务与风控服务执行结果为准。</NoteBox>
        <OpsTable<AccountRow>
          columns={[
            { title: '账户', key: 'account', render: (r) => <b>{r.account}</b> },
            { title: '类型', key: 'type', render: (r) => r.type },
            { title: '网络 · 通道', key: 'network', render: (r) => r.network },
            { title: '可用余额', key: 'balance', render: (r) => r.balance },
            { title: '状态', key: 'status', render: (r) => <Chip tone={r.tone}>{r.status}</Chip> },
            { title: '最后更新', key: 'updated', render: (r) => r.updated },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setFreezeAccount(r)}>
                  冻结账户
                </button>
              ),
            },
          ]}
          data={ACCOUNTS}
        />
      </Panel>

      <Panel title="客户与账户运营">
        <div className="ops-filter">
          <Input
            className="ops-w-240"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder="企业名称、ID、成员、账户"
            allowClear
          />
          <Select
            className="ops-w-160"
            value={status}
            onChange={setStatus}
            options={[
              { value: '__all__', label: '所有 KYC 状态' },
              { value: '已激活', label: '已激活' },
              { value: '受限', label: '受限' },
              { value: '冻结', label: '冻结' },
            ]}
          />
          <Button className="mini btn-ghost">搜索</Button>
        </div>

        <OpsTable<CustomerRow>
          columns={[
            { title: '企业', key: 'name', render: (r) => <b>{r.name}</b> },
            { title: 'KYC/风险', key: 'kyc', render: (r) => <Chip tone={r.kycTone}>{r.kyc}</Chip> },
            { title: '账户', key: 'accounts', render: (r) => r.accounts },
            { title: '产品能力', key: 'capability', render: (r) => r.capability },
            { title: '最近活动', key: 'lastActive', render: (r) => r.lastActive },
            {
              title: '操作',
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  客户 360
                </button>
              ),
            },
          ]}
          data={rows}
          empty="没有符合条件的客户。"
        />

        {filterActive && <NoteBox>已显示 {rows.length} 条匹配记录。</NoteBox>}
      </Panel>

      <KycDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        name={detail?.name}
        kyId={detail?.key === 'atlas' ? 'KY-202607-1042' : 'KY-202607-1038'}
        jurisdiction="Singapore"
      />

      <ReleaseModal
        open={freezeOpen}
        onClose={() => {
          setFreezeOpen(false);
          setFrozen(true);
        }}
        title="冻结商户整体"
        toast="商户整体冻结已提交，需双人复核与跨系统生效。"
        note="商户整体冻结将暂停所有账户的出金、付款、兑换、收款接入及虚拟币转出；已入资金仍保留在账上，法定义务与退款按策略处理。"
        summary={[
          { label: 'Merchant', value: 'Atlas Commerce Ltd.' },
          { label: 'KY ID', value: 'KY-202607-1042' },
          { label: 'Status', value: 'Active · EDD · High' },
        ]}
        submitText="确认冻结商户"
        fields={[
          {
            name: 'scope',
            label: '冻结范围',
            type: 'select',
            initial: '全面冻结',
            options: ['全面冻结', '仅出金/兑换', '仅收款接入', '仅虚拟币转出'],
          },
          {
            name: 'caseId',
            label: '关联案件',
            type: 'text',
            initial: 'RC-202607-1009',
          },
          {
            name: 'reason',
            label: '冻结依据',
            type: 'textarea',
            initial: '',
          },
          {
            name: 'confirm',
            label: '我确认该操作会影响商户全部账户，并已获得相应权限。',
            type: 'checkbox',
            initial: false,
            span: 2,
          },
        ]}
      />

      <ReleaseModal
        open={!!freezeAccount}
        onClose={() => setFreezeAccount(null)}
        title={
          freezeAccount
            ? `冻结 ${freezeAccount.account.split(' · ')[0]} ${freezeAccount.type}`
            : '冻结账户'
        }
        toast="账户冻结已提交，需双人复核与跨系统生效。"
        note="仅冻结该指定账户的出金、兑换与转账能力；其他账户不受影响。已入资金仍保留在账上。"
        summary={
          freezeAccount
            ? [
                { label: '账户', value: freezeAccount.account },
                { label: '类型', value: freezeAccount.type },
                { label: '网络 · 通道', value: freezeAccount.network },
                { label: '可用余额', value: freezeAccount.balance },
              ]
            : undefined
        }
        submitText="确认冻结账户"
        fields={[
          {
            name: 'scope',
            label: '冻结范围',
            type: 'select',
            initial: '全面冻结',
            options: ['全面冻结', '仅出金/兑换', '仅虚拟币转出'],
          },
          {
            name: 'caseId',
            label: '关联案件',
            type: 'text',
            initial: 'RC-202607-1009',
          },
          {
            name: 'reason',
            label: '冻结依据',
            type: 'textarea',
            initial: '',
          },
          {
            name: 'confirm',
            label: '我确认该操作仅影响上述指定账户，并已获得相应权限。',
            type: 'checkbox',
            initial: false,
            span: 2,
          },
        ]}
      />

      <Customer360Drawer open={!!c360Row} onClose={() => setC360Row(null)} row={c360Row} />
    </>
  );
}
