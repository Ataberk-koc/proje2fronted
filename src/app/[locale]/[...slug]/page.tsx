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
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  banner?: string;
  categories?: Category[];
}

const AboutDetailPage = () => {
  const params = useParams();
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const currentSlug =
    params?.slug && Array.isArray(params.slug) ? params.slug[0] : null;

  // API'den veri çekme
  useEffect(() => {
    if (currentSlug) {
      fetch(`http://127.0.0.1:8000/api/posts/${currentSlug}`)
        .then((res) => res.json())
        .then((data) => setPageData(data.data));
    }
  }, [currentSlug]);

  // Banner ve içerik anasayfadaki gibi ana objeden alınacak
  const getBanner = () => {
    if (pageData?.banner) {
      return pageData.banner.startsWith("http")
        ? pageData.banner
        : `http://127.0.0.1:8000/storage/${pageData.banner}`;
    }
    if (pageData?.categories && pageData.categories[0]?.banner) {
      return pageData.categories[0].banner.startsWith("http")
        ? pageData.categories[0].banner
        : `http://127.0.0.1:8000/storage/${pageData.categories[0].banner}`;
    }
    return "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="flex flex-col items-center w-full flex-1">
        {pageData ? (
          <>
            {/* Banner ve ana içerik */}
            <AboutSection
              banner={getBanner()}
              content={
                pageData.content || pageData.categories?.[0]?.description || ""
              }
              description={pageData.categories?.[0]?.description}
              showReadMore={false}
            />
            {/* Diğer kategoriler/postlar */}
            {pageData.categories && pageData.categories.length > 1 && (
              <div className="w-full max-w-3xl mt-8 space-y-6">
                {pageData.categories.slice(1).map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-lg shadow p-6 border border-zinc-200"
                  >
                    <h2 className="text-xl font-bold mb-2">{cat.slug}</h2>
                    {cat.banner && (
                      <img
                        src={
                          cat.banner.startsWith("http")
                            ? cat.banner
                            : `http://127.0.0.1:8000/storage/${cat.banner}`
                        }
                        alt={cat.slug}
                        className="w-full max-w-md rounded mb-4"
                        style={{ maxHeight: 200, objectFit: "cover" }}
                      />
                    )}
                    <div
                      className="text-base text-black"
                      dangerouslySetInnerHTML={{ __html: cat.description }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-10">
            İçerik bulunamadı.
          </div>
        )}
      </main>
    </div>
  );
};

export default AboutDetailPage;
