
import React, { useState, useEffect, useRef } from "react";
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

export default function SliderSection() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // Carousel otomatik geçiş
  useEffect(() => {
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev: number) => (prev + 1) % slides.length);
      }, 5000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
    // Eğer slides.length <= 1 ise herhangi bir şey döndürmesin (void)
    return;
  }, [slides]);


  if (loading) return <div className="h-screen flex items-center justify-center"></div>;
  if (!slides.length) return <div className="h-screen flex items-center justify-center">No slides found.</div>;

  const slide = slides[current];

  return (
    <section className="w-full relative">
      <div className="w-full h-screen min-h-[420px] relative overflow-hidden flex items-center justify-center">
        <picture className="absolute inset-0 w-full h-full">
          <source media="(max-width: 768px)" srcSet={slide.mobile_image} />
          <img
            src={slide.desktop_image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        </picture>
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center px-4">
          <div className="max-w-2xl text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl mb-6 drop-shadow-lg">
              {slide.short_description}
            </p>
            {slide.button_text && (
              <a
                href={slide.url || "#"}
                className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-full shadow hover:bg-zinc-200 transition"
              >
                {slide.button_text}
              </a>
            )}
          </div>
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_: unknown, idx: number) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border border-white ${current === idx ? "bg-white" : "bg-transparent"}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Animasyon kaldırıldı */}
    </section>
  );
}
