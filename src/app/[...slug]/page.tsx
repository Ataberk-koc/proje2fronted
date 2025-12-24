"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OnePage() {
  const params = useParams();
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
    categories: Category[];
  }
  const [about, setAbout] = useState<AboutData | null>(null);

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
        {about && about.categories && about.categories[0]?.banner && (
          <AboutSection
            banner={about.categories[0].banner.startsWith('http') ? about.categories[0].banner : `http://127.0.0.1:8000/storage/${about.categories[0].banner}`}
            content={about.content}
            description={about.categories[0].description}
            onReadMore={() => {}}
          />
        )}
      return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
          <Header />
          <main className="flex flex-col items-center w-full flex-1">
            {about && about.banner && (
              <AboutSection
                banner={about.banner.startsWith('http') ? about.banner : `http://127.0.0.1:8000/storage/${about.banner}`}
                content={about.content}
                description={about.categories && about.categories[0]?.description}
                onReadMore={() => {}}
                showReadMore={false}
              />
            )}
          </main>
          <Footer />
        </div>
      );
