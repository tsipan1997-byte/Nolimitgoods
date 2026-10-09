'use client';

import Header from './components/header';
import HeroSection from './components/hero-section';
import RFQSection from './components/rfq-section';
import DeliveriesSection from './components/deliveries-section';
import PartsSection from './components/parts-section';
import BrandsSection from './components/brands-section';
import LegalSection from './components/legal-section';
import Footer from './components/footer';
import FloatingContact from './components/floating-contact';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* 1. Шапка з навігацією та перемикачем мов */}
      <Header />

      {/* 2. Головний екран із пошуком та популярними кодами */}
      <HeroSection />

      {/* 3. Калькулятор вартості, тарифів Nova Post та генератор інвойсу */}
      <RFQSection />

      {/* 4. Відеозвіт доставки (YouTube Shorts із розвантаженням) */}
      <DeliveriesSection />

      {/* 5. Каталог деталей (сітка 3х3) */}
      <PartsSection />

      {/* 6. Бренди OEM техніки */}
      <BrandsSection />

      {/* 7. Офіційні юридичні реквізити NoLimitGoods Limited */}
      <LegalSection />

      {/* 8. Підвал сайту */}
      <Footer />

      {/* Плаваюча кнопка швидкого зв'язку в кутку */}
      <FloatingContact />
    </main>
  );
}
