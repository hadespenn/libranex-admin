import Stub from './Stub';
import { useI18n } from '@/i18n';

export default function TransactionReview() {
  const { t } = useI18n();

  return (
    <Stub
      title={t('page.transactionReview.title')}
      desc={t('page.transactionReview.desc')}
      primaryBtn={t('page.transactionReview.primaryBtn')}
      count={t('page.transactionReview.count')}
    />
  );
}
