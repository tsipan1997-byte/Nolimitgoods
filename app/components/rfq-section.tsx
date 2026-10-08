'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, FileText, CheckCircle, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function RFQSection() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    partNumber: '',
    machineModel: '',
    quantity: '',
    country: '',
    contact: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [estimateData, setEstimateData] = useState<{ estimatedPrice: number; totalEstimate: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setEstimateData({
          estimatedPrice: data.estimatedPrice || 0,
          totalEstimate: data.totalEstimate || 0,
        });
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const cleanPhone = String(formData.contact).replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/380501400245?text=${encodeURIComponent(
    `Hello! RFQ request: Part ${formData.partNumber}, Model: ${formData.machineModel}, Qty:${formData.quantity}. Estimated total: £${estimateData?.totalEstimate || ''}`
  )}`;

  return (
    <section id="rfq" className="py-20 bg-gradient-to-br from-red-600 to-red-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.rfq.title}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t.rfq.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-2xl text-slate-900"
        >
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-3 text-emerald-600 mb-4">
                <CheckCircle className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Request Submitted Successfully!</h3>
              </div>

              {estimateData && estimateData.totalEstimate > 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 text-left max-w-lg mx-auto">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    AI Instant Market Estimation
                  </p>
                  <div className="text-3xl font-extrabold text-slate-900 mb-1">
                    ~£{estimateData.totalEstimate}{' '}
                    <span className="text-sm font-medium text-slate-500">
                      (approx. £{estimateData.estimatedPrice} / unit incl. UK delivery buffer)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    * Indicative price based on current UK/EU suppliers. Manager will verify exact stock availability shortly.
                  </p>
                </div>
              ) : (
                <p className="text-slate-600 mb-6">
                  {t.rfq.form.success}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setEstimateData(null);
                    setFormData({ partNumber: '', machineModel: '', quantity: '', country: '', contact: '' });
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Submit Another RFQ
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.rfq.form.partNumber} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="e.g. 32/925950"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.rfq.form.machineModel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.machineModel}
                    onChange={(e) => setFormData({ ...formData, machineModel: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="e.g. JCB 3CX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.rfq.form.quantity} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.rfq.form.country} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="e.g. Ukraine"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.rfq.form.contact} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="email@example.com or +380..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-70"
              >
                <Send className="w-5 h-5" />
                {status === 'sending' ? t.rfq.form.sending : t.rfq.form.submit}
              </button>

              {status === 'error' && (
                <p className="mt-4 text-red-600 text-center font-medium">{t.rfq.form.error}</p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
