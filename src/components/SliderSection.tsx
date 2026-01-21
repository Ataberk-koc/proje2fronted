
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Section2 from "./Section2";
import { useTranslation } from "react-i18next";

interface SliderItem {
  id: number;
  title: string;
  short_description: string;
  desktop_image: string;
  mobile_image: string;
  url: string | null;
  button_text: string;
}




const fetchSlider = async (lang: string, setLoading: (v: boolean) => void): Promise<SliderItem[]> => {
  setLoading(true);
  const res = await fetch("http://127.0.0.1:8000/api/sliders", {
    headers: { "Accept-Language": lang },
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch slider");
  const data = await res.json();
  return data.data || [];
};

function HeaderTransparent() {
  return (
    <div className="w-full mb-2">
      <Header />
    </div>
  );
}

export default function SliderSection() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // İlk yüklemede loading göster, dil değişiminde anlık veri değişsin
  useEffect(() => {
    const first = slides.length === 0;
    if (first) setLoading(true);
    fetchSlider(i18n.language, () => {})
      .then(setSlides)
      .catch(() => setSlides([]))
      .finally(() => { if (first) setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);


  if (loading) return <div className="h-screen flex items-center justify-center"></div>;
  if (!slides.length) return <div className="h-screen flex items-center justify-center">No slides found.</div>;

  // İlk slider (sabit)
  const mainSlide = slides[0];
  // Overlay slider - sadece 2. slider (sabit, değişmez)
  const overlaySlide = slides.length > 1 ? slides[1] : null;

  return (
    <section className="w-full relative">
      <div className="w-full h-screen min-h-105 relative overflow-hidden flex items-center justify-center">
        {/* Main Slider - Sabit (değişmez) */}
        <picture className="absolute inset-0 w-full h-full z-10">
          <source media="(max-width: 768px)" srcSet={mainSlide.mobile_image} />
          <img
            src={mainSlide.desktop_image}
            alt={mainSlide.title}
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        </picture>

        {/* Overlay Slider - Yuvarlak (Mobilde sağda altta küçük, Desktop'ta sağda büyük) */}
        {overlaySlide && (
          <div className="absolute right-4 md:right-10 bottom-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 w-48 h-48 md:w-[650px] md:h-[650px] overflow-hidden pointer-events-auto">
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-white">
              <picture className="absolute inset-0 w-full h-full">
                <source media="(max-width: 768px)" srcSet={overlaySlide.mobile_image} />
                <img
                  src={overlaySlide.desktop_image}
                  alt={overlaySlide.title}
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                />
              </picture>
            </div>
          </div>
        )}

        {/* Overlay: Section2 and Header, above image and slider text, clickable */}
        <div className="absolute top-0 left-0 w-full z-50 flex flex-col pointer-events-auto">
          <Section2 />
          <HeaderTransparent />
        </div>

        {/* Slider text - Mobilde merkez-solda ufak, Desktop'ta sol büyük */}
        <div className="absolute inset-0 flex flex-col justify-center md:justify-center items-start px-4 md:px-12 pt-8 md:pt-0 z-30 pointer-events-none">
          <div className="max-w-sm md:max-w-4xl text-left text-white pointer-events-auto">
            <h2 
              className="font-bold mb-2 md:mb-8 drop-shadow-lg leading-tight"
              style={{ fontSize: "clamp(24px, 7vw, 70px)", color: "#64B5F6" }}
            >
              {mainSlide.title}
            </h2>
            <p 
              className="mb-4 md:mb-10 drop-shadow-lg"
              style={{ fontSize: "clamp(14px, 4vw, 36px)" }}
            >
              {mainSlide.short_description}
            </p>
            {mainSlide.button_text && (
              <a
                href="#contact"
                className="inline-block px-6 md:px-8 py-2 md:py-3 bg-white text-black font-semibold rounded-full shadow hover:bg-zinc-200 transition pointer-events-auto text-sm md:text-lg"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {mainSlide.button_text}
              </a>
            )}
          </div>
        </div>

        {/* Slider Navigation Dots - Devre dışı */}
      </div>
    </section>
  );
}
