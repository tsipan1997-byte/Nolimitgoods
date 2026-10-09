'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function ContactSection() {
  const { language } = useLanguage();
  const isUk = language === 'uk' || (language as string) === 'ua';

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', company: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Левая колонка: Контактные данные */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {isUk ? 'Контактна інформація' : 'Contact Information'}
              </h2>
              <p className="text-slate-600 text-sm">
                {isUk
                  ? 'Зв’яжіться з нашим офісом у Ковентрі напряму через месенджери або форму зворотного зв’язку.'
                  : 'Contact our Coventry office directly via instant messengers or the enquiry form.'}
              </p>
            </div>

            <div className="space-y-6">
              {/* Телефон и мессенджеры */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{isUk ? 'Телефон' : 'Phone'}</h4>
                  <p className="text-base font-semibold text-slate-800 mt-0.5">+44 7426 826595</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-medium">
                    <a href="https://wa.me/447426826595" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                      🟢 WhatsApp
                    </a>
                    <a href="https://t.me/+447426826595" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
                      🔵 Telegram
                    </a>
                    <a href="viber://chat?number=%2B447426826595" className="text-purple-600 hover:underline">
                      🟣 Viber
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email</h4>
                  <a href="mailto:sales@nolimitgoods.co.uk" className="text-base font-medium text-slate-700 hover:text-blue-600 transition-colors">
                    sales@nolimitgoods.co.uk
                  </a>
                </div>
              </div>

              {/* Новый адрес */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{isUk ? 'Адреса' : 'Address'}</h4>
                  <p className="text-base text-slate-700 font-medium leading-relaxed">
                    374 Hipsell Highway<br />
                    Coventry, CV2 5FR, United Kingdom
                  </p>
                </div>
              </div>

              {/* График работы */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{isUk ? 'Робочі години' : 'Working Hours'}</h4>
                  <p className="text-sm text-slate-600 font-medium">
                    {isUk ? 'Пн – Пт: 9:00 – 18:00 (UK time)' : 'Mon – Fri: 9:00 – 18:00 (UK time)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка: Форма отправки */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {isUk ? 'Повідомлення надіслано!' : 'Message Sent!'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {isUk ? 'Менеджер зв’яжеться з вами найближчим часом.' : 'Our team will contact you shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      {isUk ? "Повне ім'я *" : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      {isUk ? 'Назва компанії' : 'Company Name'}
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      {isUk ? 'Номер телефону' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {isUk ? 'Ваше повідомлення *' : 'Your Message *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={isUk ? 'Розкажіть нам про ваші потреби в деталях або доставці...' : 'Describe your parts or logistics request...'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-[#f95721] hover:bg-[#e04815] text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer text-base disabled:opacity-70"
                >
                  <Send className="w-5 h-5" />
                  <span>{status === 'sending' ? (isUk ? 'Надсилання...' : 'Sending...') : (isUk ? 'Надіслати повідомлення' : 'Send Message')}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
