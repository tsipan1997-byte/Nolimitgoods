import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('pro-kompaniiu');

export default function Page() {
  return <InfoPageView slug="pro-kompaniiu" />;
}
