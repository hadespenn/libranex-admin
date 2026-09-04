import Stub from './Stub';
import { useI18n } from '@/i18n';

export default function RuleStrategy() {
  const { t } = useI18n();

  return (
    <Stub
      title={t('page.ruleStrategy.title')}
      desc={t('page.ruleStrategy.desc')}
      primaryBtn={t('page.ruleStrategy.primaryBtn')}
    />
  );
}
