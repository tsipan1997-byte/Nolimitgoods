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
  // Автоматичне заповнення і Каталожного номера, і Бренду
  const handleSelectOem = (oem: string, brand: string) => {
    const calcSection = document.getElementById('parts-calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 1. Знаходимо інпут каталожного номера
    const oemInput = (document.querySelector('input[placeholder*="OEM"]') ||
      document.querySelector('input[name*="oem"]') ||
      document.querySelector('input[type="text"]')) as HTMLInputElement | null;

    if (oemInput) {
      oemInput.value = oem;
      oemInput.dispatchEvent(new Event('input', { bubbles: true }));
      oemInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Знаходимо інпут техніки / бренду і підставляємо бренд
    const brandInput = (document.querySelector('input[placeholder*="Donaldson"]') ||
      document.querySelector('input[placeholder*="JCB"]') ||
      document.querySelector('input[name*="brand"]') ||
      document.querySelectorAll('input[type="text"]')[1]) as HTMLInputElement | null;

    if (brandInput) {
      brandInput.value = brand;
      brandInput.dispatchEvent(new Event('input', { bubbles: true }));
      brandInput.dispatchEvent(new Event('change', { bubbles: true }));
      brandInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />
      <HeroSection />

      {/* Калькулятор прорахунку специфікації */}
      <div id="parts-calculator">
        <RFQSection />
      </div>

      {/* Каталог із передачею коду та бренду */}
      <BrandsCatalog onSelectOem={handleSelectOem} />

      <div id="deliveries">
        <DeliveriesSection />
      </div>

      <div id="contacts">
        <ContactSection />
      </div>

      <Footer />
      <FloatingContact />
    </div>
  );
}
