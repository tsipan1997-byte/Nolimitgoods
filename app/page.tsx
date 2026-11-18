'use client';

import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import PriceShowcase from './components/price-showcase';
import CategoryTiles from './components/category-tiles';
import AuctionsTeaser from './components/auctions-teaser';
import InteractiveDiagram from './components/interactive-diagram';
import QuoteCart from './components/quote-cart';
import SocialSection from './components/social-section';
import TrustSection from './components/trust-section';
import BrandsStrip from './components/brands-strip';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />

      <HeroSection />

      {/* Плитки категорій каталогу */}
      <CategoryTiles />

      {/* Аукціони спецтехніки Великої Британії */}
      <AuctionsTeaser />

      {/* Приклади реальних цін з живим курсом гривні */}
      <PriceShowcase />

      {/* Форма запиту одразу під головним екраном: сюди ведуть усі кнопки «Зробити замовлення» */}
      <TrustSection />
      <RFQSection />

      {/* Інтерактивна схема двигуна з цінами */}
      <InteractiveDiagram />

      {/* Бренди: веде на сторінки марок з цінами (замість каталогу OEM-кодів без цін) */}
      <BrandsStrip />

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
