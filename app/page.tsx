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
        
        {/* 1. ПЕРШИМ ЗАВЖДИ ЙДЕ ГОЛОВНИЙ ЕКРАН HERO */}
        <HeroSection />

        {/* 2. Калькулятор розрахунку ціни (RFQ) */}
        <RFQSection />

        {/* 3. Каталог 10 деталей із цінами */}
        <PartsSection />

        {/* 4. Бренди OEM */}
        <BrandsSection />

        {/* 5. Відео зі складу */}
        <DeliveriesSection />

        {/* 6. Покрокова логістика */}
        <FeaturesSection />

        {/* 7. Контакти та футер */}
        <ContactSection />
        <Footer />
        <WhatsAppButton />
      </main>
    </LanguageProvider>
  );
}
