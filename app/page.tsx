import DeliveriesSection from './components/deliveries-section';
import Header from './components/header';
import HeroSection from './components/hero-section';
import FeaturesSection from './components/features-section';
import RFQSection from './components/rfq-section';
import BrandsSection from './components/brands-section';
import PartsSection from './components/parts-section';
import ClientsSection from './components/clients-section';
import WhyUsSection from './components/why-us-section';
import ContactSection from './components/contact-section';
import SEOSection from './components/seo-section';
import Footer from './components/footer';
import WhatsAppButton from './components/whatsapp-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <RFQSection />
      <BrandsSection />
      <PartsSection />
      <ClientsSection />
      <WhyUsSection />
      <ContactSection />
      <SEOSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
