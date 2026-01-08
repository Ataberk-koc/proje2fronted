import Image from 'next/image';
import React from 'react';

interface AboutSectionProps {
  banner: string;
  content: string;
  description?: string;
  onReadMore?: () => void;
  showReadMore?: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({ banner, content, description, onReadMore, showReadMore = true }) => {
  return (
    <section
      className="w-full flex-1 flex flex-col md:flex-row items-center gap-8 bg-white shadow-lg p-6 md:p-10 border border-zinc-200 min-h-[90vh] justify-center"
      style={{ backdropFilter: 'blur(4px)', margin: 0, borderRadius: 0 }}
    >
      <div className="flex-1 w-full flex justify-center items-center">
        {banner ? (
          <div
            style={{ width: 340, height: 340, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, overflow: 'hidden' }}
          >
            <img
              src={banner}
              alt="Hakkımızda Banner"
              className="object-cover"
              style={{ width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'cover', background: '#000', borderRadius: 16 }}
            />
          </div>
        ) : (
          <div className="text-red-500">Banner bulunamadı</div>
        )}
      </div>
      <div className="flex-2 w-full flex flex-col gap-4 text-center md:text-left items-center md:items-start">
        {description && (
          <div className="text-lg text-black font-semibold w-full" dangerouslySetInnerHTML={{ __html: description }} />
        )}
        <div className="text-base text-black w-full" dangerouslySetInnerHTML={{ __html: content }} />
        {showReadMore && (
          <button
            onClick={onReadMore}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-all duration-200 self-center md:self-start"
          >
            Devamını Oku
          </button>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
