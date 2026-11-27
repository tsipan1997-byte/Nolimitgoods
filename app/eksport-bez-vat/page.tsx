import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('eksport-bez-vat');

export default function Page() {
  return <InfoPageView slug="eksport-bez-vat" />;
}
