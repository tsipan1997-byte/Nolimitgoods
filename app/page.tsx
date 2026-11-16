'use client';

import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import PriceShowcase from './components/price-showcase';
import CategoryTiles from './components/category-tiles';
import InteractiveDiagram from './components/interactive-diagram';
import QuoteCart from './components/quote-cart';
import SocialSection from './components/social-section';
import TrustSection from './components/trust-section';
import BrandsCatalog from './components/BrandsCatalog';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
  // Клік по артикулу в каталозі: підставляємо його у форму запиту і гортаємо до неї
  const handleSelectOem = (oem: string, brand: string) => {
    window.dispatchEvent(new CustomEvent('nlg:select-part', { detail: { oem, brand } }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />

      <HeroSection />

      {/* Плитки категорій каталогу */}
      <CategoryTiles />

      {/* Приклади реальних цін з живим курсом гривні */}
      <PriceShowcase />

      {/* Форма запиту одразу під головним екраном: сюди ведуть усі кнопки «Зробити замовлення» */}
      <TrustSection />
      <RFQSection />

      {/* Інтерактивна схема двигуна з цінами */}
      <InteractiveDiagram />

      <BrandsCatalog onSelectOem={handleSelectOem} />

      <div id="deliveries">
        <DeliveriesSection />
      </div>

      <SocialSection />

      <div id="contacts">
        <ContactSection />
      </div>

      <Footer />
      <FloatingContact />
      <QuoteCart />
    </div>
  );
}
