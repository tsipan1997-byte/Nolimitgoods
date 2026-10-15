'use client';

import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import TrustBanner from './components/trust-banner';
import RFQSection from './components/rfq-section';
import BrandsCatalog from './components/BrandsCatalog';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
  const handleSelectOem = (oem: string, brand: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('nlg:select-part', {
          detail: { oem, brand },
        })
      );
    }

    const calcSection = document.getElementById('parts-calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-slate-800 selection:text-white">
      {/* 1. Меню навігації */}
      <Header />

      {/* 2. Головний екран */}
      <HeroSection />

      {/* 3. Блок довіри з чесними цифрами (Понад 200 замовлень) */}
      <TrustBanner />

      {/* 4. Блок калькулятора та підбору */}
      <div id="parts-calculator">
        <RFQSection />
      </div>

      {/* 5. Каталог вузлів та брендів */}
      <div id="catalog">
        <BrandsCatalog onSelectOem={handleSelectOem} />
      </div>

      {/* 6. Відео відвантажень */}
      <div id="deliveries">
        <DeliveriesSection />
      </div>

      {/* 7. Офіційні реквізити та контакти NoLimitGoods Ltd */}
      <div id="contacts">
        <ContactSection />
      </div>

      {/* 8. Підвал сайту */}
      <Footer />

      {/* 9. Швидкий зв'язок */}
      <FloatingContact />
    </div>
  );
}
