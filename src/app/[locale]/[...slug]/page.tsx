"use client";
import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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
  const router = useRouter();
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([]);
  const [notFound, setNotFound] = useState(false);
  const slugArr = params?.slug && Array.isArray(params.slug) ? params.slug : [];
  const currentSlug = slugArr[0] || null;
  const postSlug = slugArr.length > 1 ? slugArr[slugArr.length - 1] : null;
  const [postDetail, setPostDetail] = useState<Post | null>(null);

  useEffect(() => {
    if (!currentSlug) return;
    // Hakkımızda ise özel endpoint
    if (currentSlug === "hakkimizda") {
      fetch(`http://127.0.0.1:8000/api/posts/hakkimizda`)
        .then((res) => res.json())
        .then((data) => setPageData(data.data));
    } else if (postSlug) {
      // Post detayına gidildi
      fetch(`http://127.0.0.1:8000/api/posts/${postSlug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Post not found");
          return res.json();
        })
        .then((data) => {
          setPageData(null);
          setCategoryPosts([]);
          setNotFound(false);
          // Bazı API'ler data.data döndürüyor, bazıları direkt data
          setPostDetail(data.data ? data.data : data);
        })
        .catch(() => {
          setPageData(null);
          setCategoryPosts([]);
          setPostDetail(null);
          setNotFound(true);
        });
    } else {
      // Kategoriye göre postları çek
      fetch(`http://127.0.0.1:8000/api/posts`)
        .then((res) => res.json())
        .then((data) => {
          setPageData(null);
          setPostDetail(null);
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
        })
        .catch(() => {
          setPageData(null);
          setPostDetail(null);
          setCategoryPosts([]);
          setNotFound(true);
        });
    }
  }, [currentSlug, postSlug]);

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

  const isPostDetail = !!postDetail;

  return (
    <div className={`flex flex-col min-h-screen ${isPostDetail ? 'bg-white' : 'bg-zinc-50 dark:bg-black'}`}>
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
        {/* Post detay sayfası */}
        {postDetail && (
          <section
            className="w-full flex flex-col md:flex-row gap-10 items-start justify-center mt-12 px-4 md:px-0"
            style={{ maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px #0002', padding: 32 }}
          >
            <div className="flex-1 flex items-center justify-center">
              {postDetail.banner ? (
                postDetail.banner.startsWith("http") ? (
                  <Image src={postDetail.banner} alt={postDetail.title || ""} width={600} height={350} style={{ borderRadius: 16, objectFit: "cover", boxShadow: '0 2px 16px #0001' }} unoptimized />
                ) : (
                  <Image src={`http://127.0.0.1:8000/storage/${postDetail.banner}`} alt={postDetail.title || ""} width={600} height={350} style={{ borderRadius: 16, objectFit: "cover", boxShadow: '0 2px 16px #0001' }} unoptimized />
                )
              ) : null}
            </div>
            <div className="flex-1 flex flex-col gap-4" >
              <h1 style={{ fontSize: 36, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.1 }}>{postDetail.title || "Başlık Yok"}</h1>
              {postDetail.categories && postDetail.categories[0]?.description && (
                <div style={{ fontSize: 18, color: '#444', marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: postDetail.categories[0].description }} />
              )}
              <div style={{ fontSize: 17, color: '#222', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: postDetail.content || "<em>İçerik bulunamadı.</em>" }} />
            </div>
          </section>
        )}
        {/* Kategoriye göre postlar */}
        {!pageData && !notFound && !postDetail && categoryPosts.length > 0 && (
          <section className="w-screen min-h-[calc(100vh-64px)] bg-white flex flex-col items-center justify-center py-12">
            <h1 className="text-3xl font-bold mb-8 text-blue-900 capitalize">{currentSlug} İçerikleri</h1>
            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center mx-auto">
              {categoryPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-md border border-zinc-200 flex flex-col items-center p-4 transition-transform hover:scale-105 hover:shadow-lg cursor-pointer w-60 h-64"
                  onClick={() => {
                    // locale paramı varsa onu da ekle
                    const locale = Array.isArray(params?.locale) ? params.locale[0] : (params?.locale || "");
                    router.push(`/${locale}/${currentSlug}/${post.slug}`);
                  }}
                >
                  {post.banner ? (
                    <Image
                      src={post.banner}
                      alt={post.title}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-full mb-4 border border-blue-200 bg-gray-100"
                      unoptimized
                    />
                  ) : null}
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
