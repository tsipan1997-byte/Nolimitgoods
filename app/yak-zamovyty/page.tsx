import InfoPageView, { infoMetadata } from '../components/info-page';

export const metadata = infoMetadata('yak-zamovyty');

export default function Page() {
  return <InfoPageView slug="yak-zamovyty" />;
}
