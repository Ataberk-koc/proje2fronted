
"use client";
// ...existing code...
import SliderSection from "@/components/SliderSection";
import AboutSection from "@/components/AboutSection";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import i18n from "../i18n";
import { useRouter } from "next/navigation";
// ...existing code...



export default function Home() {
  const [about, setAbout] = useState<any>(null);
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
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center w-full">
        <SliderSection />
        {about && about.banner && (
          <AboutSection
            banner={about.banner.startsWith('http') ? about.banner : `http://127.0.0.1:8000/storage/${about.banner}`}
            content={about.content}
            description={about.categories[0].description}
            onReadMore={() => router.push(`/${locale}/hakkimizda`)}
            showReadMore={true}
          />
        )}
      </main>
    </div>
  );
}
