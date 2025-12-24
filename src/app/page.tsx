
"use client";
// ...existing code...
import SliderSection from "@/components/SliderSection";
import AboutSection from "@/components/AboutSection";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// ...existing code...


export default function Home() {
  const [about, setAbout] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/posts/hakkimizda")
      .then((res) => res.json())
      .then((data) => setAbout(data.data));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center w-full">
        <SliderSection />
        {about && about.categories && Array.isArray(about.categories) && (
          (() => {
            const hakkimizdaCat = about.categories.find((cat: any) => cat.slug === "hakkimizda");
            if (!hakkimizdaCat || !hakkimizdaCat.banner) return null;
            return (
              <AboutSection
                banner={hakkimizdaCat.banner.startsWith('http') ? hakkimizdaCat.banner : `http://127.0.0.1:8000/storage/${hakkimizdaCat.banner}`}
                content={hakkimizdaCat.description}
                onReadMore={() => router.push("/hakkimizda")}
              />
            );
          })()
        )}
      </main>
    </div>
  );
}
