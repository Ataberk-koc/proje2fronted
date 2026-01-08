import React from "react";

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
  return (
    <section
      className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 bg-gradient-to-br from-blue-50 to-white shadow-2xl p-6 md:p-12 border border-blue-100 min-h-[90vh] rounded-3xl mx-auto"
      style={{ backdropFilter: "blur(6px)", margin: 0 }}
    >
      {/* Banner */}
      <div className="flex-shrink-0 flex justify-center items-center md:mb-0 md:mr-0">
        {banner ? (
          <img
            src={banner}
            alt="Hakkımızda Banner"
            className="w-80 h-80 md:w-[480px] md:h-[480px] object-cover rounded-full border-8 border-blue-200 shadow-2xl bg-white transition-all duration-300 hover:scale-105 hover:border-blue-400"
            style={{ boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.18)' }}
          />
        ) : (
          <div className="text-red-500">Banner bulunamadı</div>
        )}
      </div>
      {/* Right Side: Title, Description, Content, Button */}
      <div className="flex flex-col items-center md:items-start justify-center gap-5 max-w-2xl w-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 drop-shadow-lg mb-2 text-center md:text-left">Hakkımızda</h1>
        {description && (
          <div
            className="text-lg md:text-xl text-gray-800 font-medium text-center md:text-left mb-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
       
        {showReadMore && (
          <button
            onClick={onReadMore}
            className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 text-lg"
          >
            Devamını Oku
          </button>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
