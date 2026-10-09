'use client';

import { LanguageProvider } from '@/lib/language-context';
import Header from './components/header';
import HeroSection from './components/hero-section';
import PartsSection from './components/parts-section';
import RFQSection from './components/rfq-section';
import DeliveriesSection from './components/deliveries-section';
import BrandsSection from './components/brands-section';
import FeaturesSection from './components/features-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import WhatsAppButton from './components/whatsapp-button';

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-slate-950 text-white">
        <Header />
        {/* 1. Головний екран із живим пошуком деталі по номеру */}
        <HeroSection />

        {/* 2. Живий каталог з фотографіями деталей і цінами */}
        <PartsSection />

        {/* 3. Форма швидкого прорахунку (куди залітає вибрана деталь) */}
        <RFQSection />

        {/* 4. Відеозвіт відвантажень із Ковентрі */}
        <DeliveriesSection />

        {/* 5. Бренди виробників */}
        <BrandsSection />

        {/* 6. Офіційні реквізити та доставка */}
        <FeaturesSection />

        {/* 7. Контакти та футер */}
        <ContactSection />
        <Footer />
        <WhatsAppButton />
      </main>
    </LanguageProvider>
  );
}
