import { useMemo, useState } from 'react';
import { Button, Input, Select, App as AntdApp } from 'antd';
import { Metrics, Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { KycDrawer } from '@/drawers/Drawers';

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
  const { message } = AntdApp.useApp();
  const [merchant, setMerchant] = useState('atlas');
  const [frozen, setFrozen] = useState(false);
  const [status, setStatus] = useState('__all__');
  const [kw, setKw] = useState('');
  const [detail, setDetail] = useState<CustomerRow | null>(null);

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
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Select
              value={merchant}
              onChange={setMerchant}
              style={{ width: 260 }}
              options={MERCHANTS}
            />
            <Button className="mini" style={{ borderRadius: 999 }} onClick={() => setDetail(CUSTOMERS[0])}>
              客户 360
            </Button>
            <Button
              className="mini btn-danger"
              style={{ borderRadius: 999 }}
              onClick={() => {
                setFrozen(true);
                message.warning('商户整体冻结已提交，需双人复核。');
              }}
            >
              冻结商户整体
            </Button>
          </div>
        }
      >
        <Metrics
          cols={4}
          items={[
            { label: '资产总额估算 · USD', value: '$8,420,680', note: '按参考汇率折算' },
            { label: '法币账户余额', value: '$7,140,280', note: '4 accounts' },
            { label: '虚拟币账户余额', value: '$1,280,400', note: '2 assets' },
            {
              label: '可用 / 受限',
              value: '5 / 1',
              note: frozen ? '商户状态：已冻结' : '商户状态：正常',
              tone: frozen ? ('bad' as const) : undefined,
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
                <button
                  className="link"
                  onClick={() => message.warning(`${r.account} 冻结申请已提交，需双人复核。`)}
                >
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
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder="企业名称、ID、成员、账户"
            style={{ width: 240 }}
            allowClear
          />
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: 160 }}
            options={[
              { value: '__all__', label: '所有 KYC 状态' },
              { value: '已激活', label: '已激活' },
              { value: '受限', label: '受限' },
              { value: '冻结', label: '冻结' },
            ]}
          />
          <Button className="mini" style={{ borderRadius: 999 }}>
            搜索
          </Button>
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
    </>
  );
}
