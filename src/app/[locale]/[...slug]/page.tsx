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
          <div className="category-posts-page w-full max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">{currentSlug} İçerikleri</h1>
            <div className="posts-list grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryPosts.map((post) => (
                <div key={post.id} className="post-card bg-white rounded-lg shadow p-6 border border-zinc-200">
                  <img src={post.banner} alt={post.title} className="post-banner w-full h-48 object-cover rounded mb-4" />
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <div className="text-base text-black" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* İçerik bulunamadı */}
        {notFound && (
          <div className="text-center text-gray-500 py-10">
            İçerik bulunamadı.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DynamicPage;
