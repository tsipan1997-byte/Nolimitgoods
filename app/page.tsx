// Серверний компонент: дані аукціонів рахуються тут під час збирання, у браузер ідуть лише props.
import React from 'react';
import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import PriceShowcase from './components/price-showcase';
import CategoryTiles from './components/category-tiles';
import AuctionsTeaser from './components/auctions-teaser';
import SoldPricesStrip from './components/sold-prices-strip';
import UpcomingAuctions from './components/upcoming-auctions';
import InteractiveDiagram from './components/interactive-diagram';
import QuoteCart from './components/quote-cart';
import SocialSection from './components/social-section';
import TrustSection from './components/trust-section';
import BrandsStrip from './components/brands-strip';
import DeliveriesSection from './components/deliveries-section';
import ContactSection from './components/contact-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';
import { homeLots } from '@/lib/home-lots';

export default function HomePage() {
  const lots = homeLots();
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />

      <HeroSection lotsTotal={lots.total} />

      {/* Найближчі аукціони за датами + перехід до лотів з фото */}
      <UpcomingAuctions data={{ byAuction: lots.byAuction, calendar: lots.calendar, total: lots.total }} />

      {/* За скільки продали техніку на аукціоні + ціна під ключ — одразу під першим екраном */}
      <SoldPricesStrip results={lots.sold} total={lots.soldTotal} />

      {/* Плитки категорій каталогу */}
      <CategoryTiles />

      {/* Аукціони спецтехніки Великої Британії */}
      <AuctionsTeaser data={{ tiles: lots.tiles, feed: lots.feed, closings: lots.closings, total: lots.total }} />

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
