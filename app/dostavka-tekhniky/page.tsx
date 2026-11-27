import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('dostavka-tekhniky');

export default function Page() {
  return <InfoPageView slug="dostavka-tekhniky" />;
}
