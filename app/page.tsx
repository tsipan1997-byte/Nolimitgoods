'use client';

import { LanguageProvider } from '@/lib/language-context';
import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import PartsSection from './components/parts-section';
import BrandsSection from './components/brands-section';
import DeliveriesSection from './components/deliveries-section';
import FeaturesSection from './components/features-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import WhatsAppButton from './components/whatsapp-button';

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-slate-950 text-white">
        <Header />
        
        {/* 1. Головний екран Hero: рядок пошуку деталі, переваги */}
        <HeroSection />

        {/* 2. Калькулятор / Форма RFQ, куди автоматично вставляються деталі */}
        <RFQSection />

        {/* 3. Живий каталог ходових запчастин із цінами в £ та грн */}
        <PartsSection />

        {/* 4. Бренди OEM */}
        <BrandsSection />

        {/* 5. Відеозвіт відвантажень зі складу */}
        <DeliveriesSection />

        {/* 6. Офіційні реквізити NoLimitGoods Limited та логістика */}
        <FeaturesSection />

        {/* 7. Контакти та футер */}
        <ContactSection />
        <Footer />
        <WhatsAppButton />
      </main>
    </LanguageProvider>
  );
}
