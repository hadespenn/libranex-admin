import Stub from './Stub';
import { useI18n } from '@/i18n';

export default function ChannelsLiquidity() {
  const { t } = useI18n();

  return (
    <Stub
      title={t('page.channelsLiquidity.title')}
      desc={t('page.channelsLiquidity.desc')}
      primaryBtn={t('page.channelsLiquidity.primaryBtn')}
    />
  );
}
