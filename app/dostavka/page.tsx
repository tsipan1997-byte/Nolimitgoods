import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('dostavka');

export default function Page() {
  return <InfoPageView slug="dostavka" />;
}
