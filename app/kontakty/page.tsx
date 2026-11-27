import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('kontakty');

export default function Page() {
  return <InfoPageView slug="kontakty" />;
}
