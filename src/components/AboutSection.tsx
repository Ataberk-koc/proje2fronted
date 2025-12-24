import React from 'react';

interface AboutSectionProps {
  banner: string;
  content: string;
  onReadMore: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ banner, content, onReadMore }) => {
  // Debug: log banner value
  console.log('AboutSection banner:', banner);
  return (
    <section style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '2rem 0' }}>
      <div style={{ flex: 1 }}>
        {banner ? (
          <img src={banner} alt="Hakkımızda Banner" style={{ width: '100%', borderRadius: '8px' }} />
        ) : (
          <div style={{ color: 'red' }}>Banner bulunamadı</div>
        )}
      </div>
      <div style={{ flex: 2 }}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <button onClick={onReadMore} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Devamını Oku
        </button>
      </div>
    </section>
  );
};

export default AboutSection;
