'use client';

import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import BrandsCatalog from './components/BrandsCatalog';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
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
      <Header />

      <div id="parts-calculator">
        <HeroSection />
      </div>

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
