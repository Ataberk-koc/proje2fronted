import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AboutSectionProps {
  banner: string;
  content: string;
  description?: string;
  onReadMore?: () => void;
  showReadMore?: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  banner,
  content,
  description,
  onReadMore,
  showReadMore = true,
}) => {
  const { i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref}
      className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 bg-transparent p-8 md:p-16 min-h-[85vh] mx-auto overflow-hidden"
      style={{ margin: 0 }}
    >
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-slide-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .image-hover {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .image-hover:hover {
          transform: translateY(-8px);
          filter: drop-shadow(0 20px 60px rgba(59, 130, 246, 0.25));
        }
      `}</style>

      {/* Banner */}
      <div className="shrink-0 flex justify-center items-center md:mb-0 md:mr-0" style={{
        animation: isVisible ? 'slideInLeft 0.8s ease-out forwards' : 'none',
      }}>
        {banner ? (
          <img
            src={banner}
            alt="Hakkımızda Banner"
            className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-2xl shadow-lg bg-white image-hover"
            style={{ 
              boxShadow: '0 10px 40px 0 rgba(59, 130, 246, 0.15)',
              opacity: imageLoaded ? 1 : 0.8
            }}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="text-red-500">Banner bulunamadı</div>
        )}
      </div>
      {/* Right Side: Title, Description, Content, Button */}
      <div className="flex flex-col items-center md:items-start justify-center gap-6 max-w-2xl w-auto" style={{
        animation: isVisible ? 'fadeInUp 0.8s ease-out forwards' : 'none',
      }}>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2 text-center md:text-left leading-tight">{i18n.language === 'en' ? 'About Us' : 'Hakkımızda'}</h1>
        {description && (
          <div
            className="text-base md:text-lg text-gray-700 font-normal text-center md:text-left mb-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
       
        {showReadMore && (
          <button
            onClick={onReadMore}
            className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 text-base hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {i18n.language === 'en' ? 'Read More' : 'Devamını Oku'}
          </button>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
