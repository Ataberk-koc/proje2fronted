'use client';

import React, { useEffect, useState } from 'react';
import i18n from '../i18n';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ContactField {
  type: string;
  label: string;
  required: boolean;
  placeholder: string;
}

interface ContactData {
  id: number;
  title: string;
  description: string;
  schema: ContactField[];
}

const ContactSection: React.FC = () => {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [lang, setLang] = useState(i18n.language);
  const { ref, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    const handleLangChange = (lng: string) => setLang(lng);
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/contacts', {
      headers: { 'Accept-Language': lang }
    })
      .then((res) => res.json())
      .then((data) => {
        setContact(data.data[0]);
        setLoading(false);
      })
      .catch(() => {
        setError('İletişim formu yüklenemedi.');
        setLoading(false);
      });
  }, [lang]);

  const handleChange = (label: string, value: string) => {
    setForm((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({});
  };

  if (loading) return <div className="w-full py-20 text-center text-gray-500">Yükleniyor...</div>;
  if (error) return <div className="w-full py-20 text-center text-red-500">{error}</div>;
  if (!contact) return null;

  return (
    <section id="contact" className="w-full bg-linear-to-b from-white via-blue-50 to-white py-20 md:py-32 flex flex-col items-center relative overflow-hidden" ref={ref}>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-3xl px-4 md:px-0 relative z-10" style={{
        animation: isVisible ? 'fadeInUp 0.8s ease-out forwards' : 'none',
      }}>
        <div className="text-center mb-16">
          <h2 className="category-title-large mb-6 text-center">{contact.title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{contact.description}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contact.schema.map((field, idx) => (
              <div 
                key={idx} 
                className={`group ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
              >
                <label className="block mb-3 font-semibold text-gray-800 text-sm uppercase tracking-wider group-hover:text-blue-600 transition-colors duration-300">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 font-sans resize-none placeholder-gray-400 shadow-sm hover:shadow-md hover:border-blue-400 text-gray-900"
                      placeholder={field.placeholder}
                      required={field.required}
                      value={form[field.label] || ''}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      onFocus={() => setFocusedField(field.label)}
                      onBlur={() => setFocusedField(null)}
                      rows={5}
                    />
                  ) : (
                    <input
                      className="w-full px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 font-sans placeholder-gray-400 shadow-sm hover:shadow-md hover:border-blue-400 text-gray-900"
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={form[field.label] || ''}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      onFocus={() => setFocusedField(field.label)}
                      onBlur={() => setFocusedField(null)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="relative group px-10 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base uppercase tracking-wider shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                {submitted ? (
                  <>
                    <span>✓</span>
                    <span>{i18n.t('submitted')}</span>
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    <span>{i18n.t('submit')}</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
