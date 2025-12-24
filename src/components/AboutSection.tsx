import Image from 'next/image';
import React from 'react';

interface AboutSectionProps {
  banner: string;
  content: string;
  description?: string;
  onReadMore: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ banner, content, description, onReadMore }) => {
  return (
    <section
      className="w-full flex flex-col md:flex-row items-center gap-8 bg-white rounded-xl shadow-lg p-6 md:p-10 border border-zinc-200 min-h-[600px] justify-center"
      style={{ backdropFilter: 'blur(4px)', margin: 0 }}
    >
      <div className="flex-1 w-full flex justify-center items-center">
        {banner ? (
          <img
            src={banner}
            alt="Hakkımızda Banner"
            className="rounded-lg shadow-md w-full max-w-md object-cover"
            style={{ maxHeight: 340 }}
          />
        ) : (
          <div className="text-red-500">Banner bulunamadı</div>
        )}
      </div>
      <div className="flex-2 w-full flex flex-col gap-4">
        {description && (
          <div className="text-lg text-black font-semibold" dangerouslySetInnerHTML={{ __html: description }} />
        )}
        <div className="text-base text-black" dangerouslySetInnerHTML={{ __html: content }} />
        <button
          onClick={onReadMore}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-all duration-200 self-start"
        >
          Devamını Oku
        </button>
      </div>
    </section>
  );
};

export default AboutSection;
