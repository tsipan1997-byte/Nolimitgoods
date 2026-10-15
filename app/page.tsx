'use client';

import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import TrustBanner from './components/trust-banner'; // 1. Імпортуємо наш траст-баннер
import RFQSection from './components/rfq-section';
import BrandsCatalog from './components/BrandsCatalog';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
  // Функція для одночасного підхоплення артикула та назви бренду з каталогу в калькулятор
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
      {/* 1. Верхнє меню навігації */}
      <Header />

      {/* 2. Головний банер (Hero) */}
      <HeroSection />

      {/* 2.1. Траст-баннер із правдивими цифрами та європейськими гарантіями */}
      <TrustBanner />

      {/* 3. Блок калькулятора та специфікацій */}
      <div id="parts-calculator">
        <RFQSection />
      </div>

      {/* 4. Світлий каталог вузлів OEM з реальними фото */}
      <BrandsCatalog onSelectOem={handleSelectOem} />

      {/* 5. Відео відвантажень з хабу */}
      <div id="deliveries">
        <DeliveriesSection />
      </div>

      {/* 6. Юридичні реквізити та контакти NoLimitGoods Ltd */}
      <div id="contacts">
        <ContactSection />
      </div>

      {/* 7. Підвал сайту */}
      <Footer />

      {/* 8. Плаваюча кнопка швидкого зв'язку */}
      <FloatingContact />
    </div>
  );
}
