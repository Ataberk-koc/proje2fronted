import React from "react";
import { useTranslation } from "react-i18next";

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

  return (
    <section
      className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 bg-transparent p-8 md:p-16 min-h-[85vh] mx-auto"
      style={{ margin: 0 }}
    >
      {/* Banner */}
      <div className="shrink-0 flex justify-center items-center md:mb-0 md:mr-0">
        {banner ? (
          <img
            src={banner}
            alt="Hakkımızda Banner"
            className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-2xl shadow-lg bg-white transition-all duration-300 hover:scale-105"
            style={{ boxShadow: '0 10px 40px 0 rgba(59, 130, 246, 0.15)' }}
          />
        ) : (
          <div className="text-red-500">Banner bulunamadı</div>
        )}
      </div>
      {/* Right Side: Title, Description, Content, Button */}
      <div className="flex flex-col items-center md:items-start justify-center gap-6 max-w-2xl w-auto">
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
            className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 text-base"
          >
            {i18n.language === 'en' ? 'Read More' : 'Devamını Oku'}
          </button>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
