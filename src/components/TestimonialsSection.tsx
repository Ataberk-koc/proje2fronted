'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  message: string;
  rating: number;
  avatar?: string;
}

const TESTIMONIALS_EN: Testimonial[] = [
        {
          id: 1,
          name: 'Ahmet Yılmaz',
          company: 'ABC Corporation',
          role: 'General Manager',
          message: 'We were very satisfied with the services. Thank you for the professional team and quick solutions.',
          rating: 5,
        },
        {
          id: 2,
          name: 'Fatma Kaya',
          company: 'XYZ Marketing',
          role: 'Project Manager',
          message: 'We had an experience that exceeded our expectations. They did excellent work.',
          rating: 5,
        },
        {
          id: 3,
          name: 'Mehmet Şahin',
          company: 'DEF Construction',
          role: 'Human Resources',
          message: 'Quality service and customer support are truly extraordinary. I recommend them.',
          rating: 5,
        },
        {
          id: 4,
          name: 'Zeynep Demir',
          company: 'GHI Technology',
          role: 'CEO',
          message: 'On-time delivery and excellent quality. It was the best choice for our business.',
          rating: 5,
        },
        {
          id: 5,
          name: 'İbrahim Yıldız',
          company: 'JKL Education',
          role: 'Director',
          message: 'Customer satisfaction is truly the first priority. Amazing team!',
          rating: 5,
        },
        {
          id: 6,
          name: 'Ayşe Aktaş',
          company: 'MNO Healthcare',
          role: 'Operations Manager',
          message: 'Professional approach and good communication. They met all our needs.',
          rating: 5,
        },
      ];

const TESTIMONIALS_TR: Testimonial[] = [
        {
          id: 1,
          name: 'Ahmet Yılmaz',
          company: 'ABC Şirketi',
          role: 'Genel Müdür',
          message: 'Hizmetlerinden çok memnun kaldık. Profesyonel ekip ve hızlı çözümler için teşekkürler.',
          rating: 5,
        },
        {
          id: 2,
          name: 'Fatma Kaya',
          company: 'XYZ Pazarlama',
          role: 'Proje Yöneticisi',
          message: 'Beklentilerimizi aşan bir deneyim yaşadık. Çok iyi iş çıkarmışlardır.',
          rating: 5,
        },
        {
          id: 3,
          name: 'Mehmet Şahin',
          company: 'DEF İnşaat',
          role: 'İnsan Kaynakları',
          message: 'Kaliteli hizmet ve müşteri desteği gerçekten olağanüstü. Tavsiye ederim.',
          rating: 5,
        },
        {
          id: 4,
          name: 'Zeynep Demir',
          company: 'GHI Teknoloji',
          role: 'CEO',
          message: 'Zamanında teslimat ve mükemmel kalite. İşletmemiz için en iyi seçimdi.',
          rating: 5,
        },
        {
          id: 5,
          name: 'İbrahim Yıldız',
          company: 'JKL Eğitim',
          role: 'Direktör',
          message: 'Müşteri memnuniyeti gerçekten birinci öncelik. Harika bir ekip!',
          rating: 5,
        },
        {
          id: 6,
          name: 'Ayşe Aktaş',
          company: 'MNO Sağlık',
          role: 'Operasyon Müdürü',
          message: 'Profesyonel yaklaşım ve iyi iletişim. Tüm ihtiyaçlarımızı karşıladılar.',
          rating: 5,
        },
      ];

const TestimonialsSection: React.FC = () => {
  const { i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = useMemo(() => (i18n.language === 'en' ? TESTIMONIALS_EN : TESTIMONIALS_TR), [i18n.language]);
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section className="w-full bg-linear-to-b from-white via-blue-50 to-white py-20 md:py-32 flex flex-col items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-32 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-5xl px-4 md:px-0 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="category-title-large mb-6 text-center">
            {i18n.language === 'en' ? 'What Our Customers Say?' : 'Müşterilerimiz Ne Diyor?'}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {i18n.language === 'en' 
              ? 'Learn about the trust and satisfaction our customers have in us' 
              : 'Müşterilerimizin bize duydukları güven ve memnuniyeti öğrenin'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Rating Stars */}
              <div className="mb-4">{renderStars(testimonial.rating)}</div>

              {/* Testimonial Message */}
              <p className="text-gray-700 text-base leading-relaxed mb-6 italic line-clamp-4">
                &ldquo;{testimonial.message}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-1 w-12 bg-linear-to-r from-blue-600 to-indigo-600 mb-6 group-hover:w-full transition-all duration-300"></div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(testimonial.name)}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-base">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role} {testimonial.company && `@ ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots for Carousel - Optional, for when items > 6 */}
        {testimonials.length > 3 && (
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.slice(0, Math.ceil(testimonials.length / 3)).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'bg-blue-600 w-8' : 'bg-gray-300 w-3 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
