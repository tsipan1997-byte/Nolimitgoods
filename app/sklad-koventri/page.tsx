import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('sklad-koventri');

export default function Page() {
  return <InfoPageView slug="sklad-koventri" />;
}
