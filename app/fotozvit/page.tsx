import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('fotozvit');

export default function Page() {
  return <InfoPageView slug="fotozvit" />;
}
