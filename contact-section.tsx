'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';

export default function ContactSection() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', phone: '', service: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };



  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.contact.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.contact.info.title}</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.info.phone}</h4>
                  <p className="text-gray-600">+44 7426 826595</p>
                  <div className="flex gap-3 mt-2">
                    <a
                      href="https://wa.me/447426826595"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href="https://t.me/+447426826595"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </a>
                    <a
                      href="viber://chat?number=447426826595"
                      className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.182.635 6.65.5 9.693c-.132 3.041-.3 8.75 5.36 10.398v2.378s-.037.963.598 1.16c.781.249 1.237-.502 1.984-1.304l1.512-1.715c4.166.347 7.373-.453 7.734-.564.835-.257 5.552-.875 6.32-7.14.793-6.468-.379-10.563-2.461-12.423-.634-.552-3.198-2.318-8.133-2.473-.006 0-.7-.014-1.516-.008zm.108 1.987c.704-.003 1.266.014 1.266.014 4.058.129 6.202 1.466 6.722 1.92 1.694 1.513 2.627 5.17 1.962 10.5-.626 5.107-4.358 5.462-5.047 5.672-.297.092-3.038.772-6.481.564 0 0-2.566 3.094-3.368 3.903-.127.128-.274.178-.373.156-.139-.032-.177-.186-.175-.41l.032-4.236c-4.676-1.354-4.401-6.01-4.296-8.433.108-2.428.606-4.504 2.063-5.958 1.891-1.727 5.421-1.963 7.695-1.692zm-.087 2.073c-.074-.007-.074.101-.074.101l.006.707s-.056.42.262.513c.379.11.554-.247.554-.247l.006-.162c0-.245-.125-.567-.46-.782-.112-.072-.214-.12-.294-.13zm1.782.628c-.046-.007-.081.039-.075.088.006.048 1.125 4.787-3.996 5.08-.08.004-.119.07-.11.15l.072.676c.008.07.067.12.14.114 2.963-.173 4.788-1.859 5.283-4.043.277-1.218.022-1.897-.02-1.972a.094.094 0 00-.076-.055l-.714-.077s-.325-.032-.504.039zm.48 1.69c-.078-.012-.12.078-.12.078-.136.298.089.675.089.675.367.695.348 1.082.322 1.24-.015.09.067.159.156.142l.666-.113c.063-.011.11-.058.12-.12.038-.243.093-.85-.337-1.598 0 0-.324-.59-.778-.281a.463.463 0 00-.118-.023zm-4.882.905c-1.016.026-2.18.714-2.418 1.93-.193.98.36 1.796.36 1.796.109.239.195.478.341.716.177.287.414.573.699.849.566.55 1.264.98 1.742 1.232.086.046.46.26.54.3.084.044.186.094.288.125.197.06.395.039.558-.063.268-.168.54-.72.727-1.012.197-.305.102-.643-.201-.864-.275-.2-.575-.397-.835-.57-.356-.237-.72-.145-.888.097l-.223.295c-.17.212-.468.17-.468.17-1.784-.454-2.263-2.266-2.263-2.266s-.042-.298.17-.468l.295-.223c.242-.168.334-.532.097-.888-.173-.26-.37-.56-.57-.835-.154-.212-.4-.317-.652-.321zm7.36.59c-.097-.012-.097.123-.097.123l.007.864s-.057.514.321.627c.448.133.658-.302.658-.302l.009-.199c0-.3-.153-.693-.563-.956-.136-.088-.261-.146-.335-.157z"/>
                      </svg>
                      Viber
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.info.email}</h4>
                  <a href="mailto:sales@nolimitgoods.co.uk" className="text-gray-600 hover:text-red-600 transition-colors">
                    sales@nolimitgoods.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.info.address}</h4>
                  <p className="text-gray-600">18 Yewdale Crescent<br />Coventry, CV2 2FH</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.info.hours}</h4>
                  <p className="text-gray-600">{t.contact.info.hoursValue}</p>
                </div>
              </div>
            </div>

            {/* Facebook Link */}
            <div className="mt-8">
              <a
                href="https://www.facebook.com/nolimitgoodslimited"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#1E3A8A] hover:text-orange-500 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.company}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contact.form.message} *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.contact.form.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  t.contact.form.sending
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t.contact.form.submit}
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="text-green-600 text-center font-medium">
                  {t.contact.form.success}
                </p>
              )}

              {status === 'error' && (
                <p className="text-red-600 text-center font-medium">
                  {t.contact.form.error}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
