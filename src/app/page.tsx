
"use client";
// ...existing code...
import SliderSection from "@/components/SliderSection";
import AboutSection from "@/components/AboutSection";
import CategorySection from "@/components/CategorySection";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import i18n from "../i18n";
import { useRouter } from "next/navigation";
// ...existing code...



interface Category {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner: string;
}

interface AboutData {
  id: number;
  title: string;
  slug: string;
  content: string;
  banner: string;
  categories: Category[];
}

export default function Home() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [lang, setLang] = useState(i18n.language);
  const router = useRouter();

  useEffect(() => {
    const handleLangChange = (lng: string) => setLang(lng);
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/posts/hakkimizda", {
      headers: { "Accept-Language": lang }
    })
      .then((res) => res.json())
      .then((data) => setAbout(data.data));
  }, [lang]);

  const pathname = usePathname();
  // locale'yi path'ten al
  const locale = pathname.split("/")[1] || "tr";
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-black">
      <main className="flex flex-col items-center w-full bg-linear-to-b from-white via-blue-50 to-white">
        <SliderSection />
        {about && about.banner && (
          <>
            <div className="w-full">
              <AboutSection
                banner={about.banner.startsWith('http') ? about.banner : `http://127.0.0.1:8000/storage/${about.banner}`}
                content={about.content}
                description={about.categories[0].description}
                onReadMore={() => router.push(`/${locale}/hakkimizda`)}
                showReadMore={true}
              />
            </div>
            <div className="w-full">
              <CategorySection />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
