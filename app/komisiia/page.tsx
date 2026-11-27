import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('komisiia');

export default function Page() {
  return <InfoPageView slug="komisiia" />;
}
