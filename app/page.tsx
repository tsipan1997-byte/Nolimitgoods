'use client';

import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import BrandsCatalog from './components/BrandsCatalog';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
  // Функція для автоматичної підстановки артикула з каталогу в інпут калькулятора
  const handleSelectOem = (oem: string, brand: string) => {
    const calcSection = document.getElementById('parts-calculator');
    const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;

    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (input) {
      input.value = oem;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* 1. Хедер сайту */}
      <Header />

      {/* 2. Головний банер (Hero) */}
      <HeroSection />

      {/* 3. БЛОК КАЛЬКУЛЯТОРА ТА ПРОРАХУНКУ ВАРТОСТІ */}
      <div id="parts-calculator">
        <RFQSection />
      </div>

      {/* 4. Світлий каталог вузлів (8 карток + підгрупи) */}
      <BrandsCatalog onSelectOem={handleSelectOem} />

      {/* 5. Відео відвантажень */}
      <div id="deliveries">
        <DeliveriesSection />
      </div>

      {/* 6. Юридичні реквізити та контакти */}
      <div id="contacts">
        <ContactSection />
      </div>

      {/* 7. Футер */}
      <Footer />

      {/* 8. Плаваюча кнопка зв'язку */}
      <FloatingContact />
    </div>
  );
}
