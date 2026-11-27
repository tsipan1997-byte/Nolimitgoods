import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('oplata');

export default function Page() {
  return <InfoPageView slug="oplata" />;
}
