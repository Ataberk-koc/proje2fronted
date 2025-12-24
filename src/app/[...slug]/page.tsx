"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OnePage() {
  const params = useParams();
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    if (params?.slug && params.slug[0] === "hakkimizda") {
      fetch("http://127.0.0.1:8000/api/posts/hakkimizda")
        .then((res) => res.json())
        .then((data) => setAbout(data.data));
    }
  }, [params]);

  if (!params?.slug || params.slug[0] !== "hakkimizda") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="flex flex-col items-center w-full flex-1">
        {about && about.categories && Array.isArray(about.categories) && (
          (() => {
            const hakkimizdaCat = about.categories.find((cat: any) => cat.slug === "hakkimizda");
            if (!hakkimizdaCat || !hakkimizdaCat.banner) return null;
            return (
              <AboutSection
                banner={hakkimizdaCat.banner.startsWith('http') ? hakkimizdaCat.banner : `http://127.0.0.1:8000/storage/${hakkimizdaCat.banner}`}
                content={hakkimizdaCat.description}
                onReadMore={() => {}}
              />
            );
          })()
        )}
      </main>
      <Footer />
    </div>
  );
}
