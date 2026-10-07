'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Play } from 'lucide-react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/lib/language-context';
import { useState } from 'react';

const testimonials = {
  en: [
    {
      id: 1,
      name: 'John Mitchell',
      role: 'Operations Director',
      company: 'TechSupply UK',
      content: 'NOLIMITGOODS has been our trusted logistics partner since they started in 2021. Their attention to detail and commitment to on-time delivery is unmatched. We ship to over 20 countries and they handle everything seamlessly.',
      rating: 5,
      date: 'December 2021',
      type: 'text',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Supply Chain Manager',
      company: 'Euro Fashion Ltd',
      content: 'Working with NOLIMITGOODS transformed our e-commerce fulfillment. Their warehousing solutions and last-mile delivery are exceptional. Highly recommend for any business looking for reliable shipping partners.',
      rating: 5,
      date: 'March 2022',
      type: 'text',
    },
    {
      id: 3,
      name: 'Customer Shipment',
      role: 'Verified Delivery',
      company: 'Cargo to UK',
      content: 'Professional palletized cargo ready for UK delivery. NOLIMITGOODS ensures all shipments are properly packaged and secured for safe transport.',
      rating: 5,
      date: 'March 2026',
      type: 'image',
      media: '/testimonial-photo-1.jpg',
    },
    {
      id: 4,
      name: 'Marcus Rodriguez',
      role: 'Founder & CEO',
      company: 'Global Imports Co',
      content: 'From day one with NOLIMITGOODS in 2021, we knew we found the right partner. Their tracking system keeps us informed at every step, and their customer service team is always available when we need them.',
      rating: 5,
      date: 'August 2021',
      type: 'text',
    },
    {
      id: 5,
      name: 'Live Delivery',
      role: 'Real Footage',
      company: 'NOLIMITGOODS',
      content: 'Watch our professional delivery process in action. We take pride in careful handling of every shipment.',
      rating: 5,
      date: 'March 2026',
      type: 'video',
      media: '/testimonial-video-1.mp4',
    },
    {
      id: 6,
      name: 'Emma Thompson',
      role: 'Procurement Lead',
      company: 'Northern Wholesale',
      content: "NOLIMITGOODS' pricing is transparent with no hidden fees. Their business plan works perfectly for our medium-sized operation. We've saved 30% on shipping costs since switching to them in early 2022.",
      rating: 5,
      date: 'February 2022',
      type: 'text',
    },
  ],
  uk: [
    {
      id: 1,
      name: 'Джон Мітчелл',
      role: 'Директор з операцій',
      company: 'TechSupply UK',
      content: 'NOLIMITGOODS є нашим надійним логістичним партнером з моменту їх заснування у 2021 році. Їхня увага до деталей та відданість вчасній доставці неперевершені. Ми відправляємо в понад 20 країн, і вони все виконують бездоганно.',
      rating: 5,
      date: 'Грудень 2021',
      type: 'text',
    },
    {
      id: 2,
      name: 'Сара Вільямс',
      role: 'Менеджер ланцюга постачань',
      company: 'Euro Fashion Ltd',
      content: 'Робота з NOLIMITGOODS трансформувала наш e-commerce фулфілмент. Їхні складські рішення та доставка "останньої милі" виняткові. Рекомендую будь-якому бізнесу, який шукає надійних партнерів з доставки.',
      rating: 5,
      date: 'Березень 2022',
      type: 'text',
    },
    {
      id: 3,
      name: 'Відправлення клієнта',
      role: 'Підтверджена доставка',
      company: 'Вантаж до UK',
      content: 'Професійний палетизований вантаж, готовий до доставки у Великобританію. NOLIMITGOODS забезпечує належну упаковку та захист усіх відправлень для безпечного транспортування.',
      rating: 5,
      date: 'Березень 2026',
      type: 'image',
      media: '/testimonial-photo-1.jpg',
    },
    {
      id: 4,
      name: 'Маркус Родрігес',
      role: 'Засновник та CEO',
      company: 'Global Imports Co',
      content: 'З першого дня співпраці з NOLIMITGOODS у 2021 році ми знали, що знайшли правильного партнера. Їхня система відстеження інформує нас на кожному етапі, а служба підтримки завжди доступна.',
      rating: 5,
      date: 'Серпень 2021',
      type: 'text',
    },
    {
      id: 5,
      name: 'Жива доставка',
      role: 'Реальне відео',
      company: 'NOLIMITGOODS',
      content: 'Перегляньте наш професійний процес доставки в дії. Ми пишаємося дбайливим поводженням з кожним відправленням.',
      rating: 5,
      date: 'Березень 2026',
      type: 'video',
      media: '/testimonial-video-1.mp4',
    },
    {
      id: 6,
      name: 'Емма Томпсон',
      role: 'Керівник закупівель',
      company: 'Northern Wholesale',
      content: 'Ціноутворення NOLIMITGOODS прозоре, без прихованих платежів. Їхній бізнес-план ідеально підходить для нашого середнього бізнесу. Ми заощадили 30% на доставці з початку 2022 року.',
      rating: 5,
      date: 'Лютий 2022',
      type: 'text',
    },
  ],
};

export default function TestimonialsSection() {
  const { language, t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const currentTestimonials = testimonials[language] || testimonials.en;

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Media Content */}
              {testimonial.type === 'image' && testimonial.media && (
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={testimonial.media}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {testimonial.type === 'video' && testimonial.media && (
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-900">
                  {playingVideo === testimonial.id ? (
                    <video
                      src={testimonial.media}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      onEnded={() => setPlayingVideo(null)}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center cursor-pointer group"
                      onClick={() => setPlayingVideo(testimonial.id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="relative z-10 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quote Icon for text testimonials */}
              {testimonial.type === 'text' && (
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-orange-500/30" />
                </div>
              )}

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
