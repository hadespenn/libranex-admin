import { useMemo, useState } from 'react';
import { Button, Input, Select } from 'antd';
import { Metrics, Panel, Chip, OpsTable, NoteBox } from '@/components/OpsUI';
import { KycDrawer, ReleaseModal, Customer360Drawer } from '@/drawers';
import { useI18n } from '@/i18n';

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
    type: 'typeFiat',
    network: 'ACH / SWIFT',
    balance: '$4,210,320.18',
    status: 'statusAvail',
    tone: 'green',
    updated: 'justNow',
  },
  {
    key: 'eur',
    account: 'EUR · 7301 9921 4421',
    type: 'typeFiat',
    network: 'SEPA',
    balance: '€920,180.00',
    status: 'statusAvail',
    tone: 'green',
    updated: 'justNow',
  },
  {
    key: 'sgd',
    account: 'SGD · 4200 0100 9900',
    type: 'typeFiat',
    network: 'FAST',
    balance: 'S$1,480,000.00',
    status: 'statusAvail',
    tone: 'green',
    updated: 'justNow',
  },
  {
    key: 'usdt',
    account: 'USDT · 0x82F1...AA91',
    type: 'typeCrypto',
    network: 'TRON · TRC20',
    balance: '680,400.00 USDT',
    status: 'statusAvail',
    tone: 'green',
    updated: 'minutesAgo',
  },
  {
    key: 'usdc',
    account: 'USDC · 0x4A90...19C2',
    type: 'typeCrypto',
    network: 'Ethereum · ERC20',
    balance: '600,000.00 USDC',
    status: 'statusScreening',
    tone: 'yellow',
    updated: 'minutesAgo',
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
  const { t } = useI18n();
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
        const map: Record<string, string[]> = {
          active: ['Active'],
          restricted: ['Restricted', 'EDD'],
          frozen: ['Frozen', 'Blacklist'],
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
        title={t('page.customers.overviewTitle')}
        desc={t('page.customers.overviewDesc')}
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
              {t('page.customers.btn360')}
            </Button>
            <Button
              className="mini btn-danger"
              onClick={() => setFreezeOpen(true)}
            >
              {t('page.customers.btnFreezeMerchant')}
            </Button>
          </div>
        }
      >
        <Metrics
          cols={4}
          items={[
            { label: t('page.customers.metricTotal'), value: '$8,420,680', note: t('page.customers.metricTotalNote'), tone: 'ok'},
            { label: t('page.customers.metricFiat'), value: '$7,140,280', note: '4 accounts' },
            { label: t('page.customers.metricCrypto'), value: '$1,280,400', note: '2 assets' },
            {
              label: t('page.customers.metricAvail'),
              value: '5 / 1',
              note: frozen ? t('page.customers.statusFrozenNote') : t('page.customers.statusNormalNote'),
              tone: frozen ? ('bad' as const) : 'ok',
            },
          ]}
        />
      </Panel>

      <Panel title={t('page.customers.accountsTitle')}>
        <NoteBox>{t('page.customers.accountsNote')}</NoteBox>
        <OpsTable<AccountRow>
          columns={[
            { title: t('page.customers.colAccount'), key: 'account', render: (r) => <b>{r.account}</b> },
            { title: t('page.customers.col.type'), key: 'type', render: (r) => t(`page.customers.${r.type}`) },
            { title: t('page.customers.colNetwork'), key: 'network', render: (r) => r.network },
            { title: t('page.customers.colBalance'), key: 'balance', render: (r) => r.balance },
            { title: t('page.customers.col.status'), key: 'status', render: (r) => <Chip tone={r.tone}>{t(`page.customers.${r.status}`)}</Chip> },
            { title: t('page.customers.colUpdated'), key: 'updated', render: (r) => (r.updated === 'justNow' ? t('page.customers.updatedJustNow') : t('page.customers.updatedMinutesAgo', { n: 2 })) },
            {
              title: t('page.customers.col.action'),
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setFreezeAccount(r)}>
                  {t('page.customers.freezeAccountBtn')}
                </button>
              ),
            },
          ]}
          data={ACCOUNTS}
        />
      </Panel>

      <Panel title={t('page.customers.opsTitle')}>
        <div className="ops-filter">
          <div className="ops-search">
          <Input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder={t('page.customers.searchPlaceholder')}
            allowClear
          />
          <Select
            value={status}
            onChange={setStatus}
            options={[
              { value: '__all__', label: t('page.customers.allKyc') },
              { value: 'active', label: t('page.customers.kycActive') },
              { value: 'restricted', label: t('page.customers.kycRestricted') },
              { value: 'frozen', label: t('page.customers.kycFrozen') },
            ]}
          />
          </div>
          <Button className="mini btn-ghost">{t('page.customers.search')}</Button>
        </div>

        <OpsTable<CustomerRow>
          columns={[
            { title: t('page.customers.colName'), key: 'name', render: (r) => <b>{r.name}</b> },
            { title: t('page.customers.colKyc'), key: 'kyc', render: (r) => <Chip tone={r.kycTone}>{r.kyc}</Chip> },
            { title: t('page.customers.colAccounts'), key: 'accounts', render: (r) => r.accounts },
            { title: t('page.customers.colCapability'), key: 'capability', render: (r) => r.capability },
            { title: t('page.customers.colLastActive'), key: 'lastActive', render: (r) => r.lastActive },
            {
              title: t('page.customers.col.action'),
              key: 'action',
              render: (r) => (
                <button className="link" onClick={() => setDetail(r)}>
                  {t('page.customers.btn360')}
                </button>
              ),
            },
          ]}
          data={rows}
          empty={t('page.customers.empty')}
        />

        {filterActive && (
          <NoteBox>{t('page.customers.matchNote', { n: rows.length })}</NoteBox>
        )}
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
        title={t('page.customers.freezeMerchant.title')}
        toast={t('page.customers.freezeMerchant.toast')}
        note={t('page.customers.freezeMerchant.note')}
        summary={[
          { label: 'Merchant', value: 'Atlas Commerce Ltd.' },
          { label: 'KY ID', value: 'KY-202607-1042' },
          { label: 'Status', value: 'Active · EDD · High' },
        ]}
        submitText={t('page.customers.freezeMerchant.submit')}
        fields={[
          {
            name: 'scope',
            label: t('page.customers.freezeMerchant.labelScope'),
            type: 'select',
            initial: t('page.customers.freezeMerchant.optAll'),
            options: [
              t('page.customers.freezeMerchant.optAll'),
              t('page.customers.freezeMerchant.optOut'),
              t('page.customers.freezeMerchant.optIn'),
              t('page.customers.freezeMerchant.optCrypto'),
            ],
          },
          {
            name: 'caseId',
            label: t('page.customers.freezeMerchant.labelCase'),
            type: 'text',
            initial: 'RC-202607-1009',
          },
          {
            name: 'reason',
            label: t('page.customers.freezeMerchant.labelReason'),
            type: 'textarea',
            initial: '',
          },
          {
            name: 'confirm',
            label: t('page.customers.freezeMerchant.confirm'),
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
            ? t('page.customers.freezeAccount.titleTpl', {
                ccy: freezeAccount.account.split(' · ')[0],
                type: t(`page.customers.${freezeAccount.type}`),
              })
            : t('page.customers.freezeAccount.titleFallback')
        }
        toast={t('page.customers.freezeAccount.toast')}
        note={t('page.customers.freezeAccount.note')}
        summary={
          freezeAccount
            ? [
                { label: t('page.customers.colAccount'), value: freezeAccount.account },
                { label: t('page.customers.col.type'), value: t(`page.customers.${freezeAccount.type}`) },
                { label: t('page.customers.colNetwork'), value: freezeAccount.network },
                { label: t('page.customers.colBalance'), value: freezeAccount.balance },
              ]
            : undefined
        }
        submitText={t('page.customers.freezeAccount.submit')}
        fields={[
          {
            name: 'scope',
            label: t('page.customers.freezeMerchant.labelScope'),
            type: 'select',
            initial: t('page.customers.freezeMerchant.optAll'),
            options: [
              t('page.customers.freezeMerchant.optAll'),
              t('page.customers.freezeMerchant.optOut'),
              t('page.customers.freezeMerchant.optCrypto'),
            ],
          },
          {
            name: 'caseId',
            label: t('page.customers.freezeMerchant.labelCase'),
            type: 'text',
            initial: 'RC-202607-1009',
          },
          {
            name: 'reason',
            label: t('page.customers.freezeMerchant.labelReason'),
            type: 'textarea',
            initial: '',
          },
          {
            name: 'confirm',
            label: t('page.customers.freezeAccount.confirm'),
            type: 'checkbox',
            initial: false,
            span: 2,
          },
        ]}
      />

      <Customer360Drawer
        open={!!c360Row}
        onClose={() => setC360Row(null)}
        name={c360Row?.name}
      />
    </>
  );
}
