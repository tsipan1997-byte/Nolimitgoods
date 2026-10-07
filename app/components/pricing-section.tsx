'use client';

import { motion } from 'framer-motion';
import { Package, Building2, Building, Check } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/lib/language-context';

export default function PricingSection() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pricingTiers = [
    {
      name: t.pricing.starter.name,
      description: t.pricing.starter.description,
      price: '£99',
      period: t.pricing.perMonth,
      icon: Package,
      features: t.pricing.starter.features,
      cta: t.pricing.cta,
      popular: false,
    },
    {
      name: t.pricing.business.name,
      description: t.pricing.business.description,
      price: '£299',
      period: t.pricing.perMonth,
      icon: Building2,
      features: t.pricing.business.features,
      cta: t.pricing.cta,
      popular: true,
    },
    {
      name: t.pricing.enterprise.name,
      description: t.pricing.enterprise.description,
      price: t.pricing.custom,
      period: '',
      icon: Building,
      features: t.pricing.enterprise.features,
      cta: t.pricing.ctaEnterprise,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow ${
                tier.popular ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                    {t.pricing.business.popular}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <tier.icon className="w-7 h-7 text-[#1E3A8A]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-500 text-sm">{tier.description}</p>
              </div>

              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                <span className="text-gray-500">{tier.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToContact}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
