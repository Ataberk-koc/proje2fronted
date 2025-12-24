
"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


interface Category {
  id: number;
  slug: string;
  banner: string;
  description: string;
}

interface AboutPageData {
  categories?: Category[];
}

const AboutDetailPage = () => {
  const params = useParams();
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const currentSlug = params?.slug && Array.isArray(params.slug) ? params.slug[0] : null;

  // API'den veri çekme
  useEffect(() => {
    if (currentSlug) {
      fetch(`http://127.0.0.1:8000/api/posts/${currentSlug}`)
        .then((res) => res.json())
        .then((data) => setPageData(data.data));
    }
  }, [currentSlug]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="flex flex-col items-center w-full flex-1">
        {pageData && pageData.banner ? (
          <AboutSection
            banner={pageData.banner.startsWith('http') ? pageData.banner : `http://127.0.0.1:8000/storage/${pageData.banner}`}
            content={pageData.categories && pageData.categories[0]?.description ? pageData.categories[0].description : pageData.content}
            showReadMore={false}
          />
        ) : (
          <div className="text-center text-gray-500 py-10">İçerik bulunamadı.</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AboutDetailPage;
