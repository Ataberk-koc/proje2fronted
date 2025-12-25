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

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  banner: string;
  categories: Category[];
}

const DynamicPage = () => {
  const params = useParams();
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([]);
  const [notFound, setNotFound] = useState(false);
  const currentSlug = params?.slug && Array.isArray(params.slug) ? params.slug[0] : null;

  useEffect(() => {
    if (!currentSlug) return;
    // Hakkımızda ise özel endpoint
    if (currentSlug === "hakkimizda") {
      fetch(`http://127.0.0.1:8000/api/posts/hakkimizda`)
        .then((res) => res.json())
        .then((data) => setPageData(data.data));
    } else {
      // Kategoriye göre postları çek
      fetch(`http://127.0.0.1:8000/api/posts`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data) {
            const filtered = data.data.filter((post: Post) =>
              post.categories.some((cat: Category) => cat.slug === currentSlug)
            );
            setCategoryPosts(filtered);
            setNotFound(filtered.length === 0);
          } else {
            setCategoryPosts([]);
            setNotFound(true);
          }
        });
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
        {/* Hakkımızda sayfası */}
        {pageData && (
          <AboutSection
            banner={getBanner()}
            content={
              pageData.content || pageData.categories?.[0]?.description || ""
            }
            description={pageData.categories?.[0]?.description}
            showReadMore={false}
          />
        )}
        {/* Kategoriye göre postlar */}
        {!pageData && !notFound && categoryPosts.length > 0 && (
          <section className="w-screen min-h-[calc(100vh-64px)] bg-white flex flex-col items-center justify-center py-12">
            <h1 className="text-3xl font-bold mb-8 text-blue-900 capitalize">{currentSlug} İçerikleri</h1>
            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center mx-auto">
              {categoryPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-md border border-zinc-200 flex flex-col items-center p-4 transition-transform hover:scale-105 hover:shadow-lg cursor-pointer w-60 h-64"
                >
                  <img
                    src={post.banner}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded-full mb-4 border border-blue-200 bg-gray-100"
                  />
                  <h2 className="text-lg font-semibold text-blue-900 text-center mt-2 mb-2">{post.title}</h2>
                  <div className="text-sm text-gray-700 text-center line-clamp-4 overflow-hidden" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              ))}
            </div>
          </section>
        )}
        {/* İçerik bulunamadı */}
        {notFound && (
          <div className="text-center text-gray-500 py-10">
            İçerik bulunamadı.
          </div>
        )}
      </main>
    </div>
  );
};

export default DynamicPage;
