import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('ohliad-tekhniky');

export default function Page() {
  return <InfoPageView slug="ohliad-tekhniky" />;
}
