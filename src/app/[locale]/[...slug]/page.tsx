"use client";
import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

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
  description?: string;
  categories: Category[];
}

const DynamicPage = () => {
  const params = useParams();
  const router = useRouter();
  const { i18n } = useTranslation();
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([]);
  const [notFound, setNotFound] = useState(false);
  const slugArr = params?.slug && Array.isArray(params.slug) ? params.slug : [];
  const currentSlug = slugArr[0] || null;
  // Post slug: ilk segment haricinde tüm segmentleri birleştir
  let postSlug = slugArr.length > 1 ? slugArr.slice(1).join('-') : null;
  // Slug'ı normalize et: lowercase ve boşluk → tire
  if (postSlug) {
    postSlug = postSlug.toLowerCase().replace(/\s+/g, '-');
  }
  const [postDetail, setPostDetail] = useState<Post | null>(null);
  const locale = (Array.isArray(params?.locale) ? params.locale[0] : params?.locale) || "tr";

  // Dil değiştiğinde i18n'i güncelleyelim
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  // Başlık için dili format et
  const getHeadingText = () => {
    if (!currentSlug) return '';
    const formatted = currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1);
    const suffix = locale === 'tr' ? 'İçerikleri' : 'Contents';
    return `${formatted} ${suffix}`;
  };

  useEffect(() => {
    if (!currentSlug) return;
    // Hakkımızda ise özel endpoint
    if (currentSlug === "hakkimizda") {
      fetch(`http://127.0.0.1:8000/api/posts/hakkimizda`, {
        headers: { "Accept-Language": locale }
      })
        .then((res) => res.json())
        .then((data) => setPageData(data.data));
    } else if (postSlug) {
      // Post detayına gidildi - tüm postları fetch edip slug ile eşleştir
      fetch(`http://127.0.0.1:8000/api/posts`, {
        headers: { "Accept-Language": locale }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data) {
            const foundPost = data.data.find((post: Post) => post.slug === postSlug);
            if (foundPost) {
              setPageData(null);
              setCategoryPosts([]);
              setNotFound(false);
              setPostDetail(foundPost);
            } else {
              setPageData(null);
              setCategoryPosts([]);
              setPostDetail(null);
              setNotFound(true);
            }
          } else {
            setPageData(null);
            setCategoryPosts([]);
            setPostDetail(null);
            setNotFound(true);
          }
        })
        .catch((err) => {
          console.error('Error fetching posts:', err);
          setPageData(null);
          setCategoryPosts([]);
          setPostDetail(null);
          setNotFound(true);
        });
    } else {
      // Kategoriye göre postları çek
      fetch(`http://127.0.0.1:8000/api/posts`, {
        headers: { "Accept-Language": locale }
      })
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
  }, [currentSlug, postSlug, locale]);

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
    <div className={`flex flex-col min-h-screen ${isPostDetail ? 'bg-white' : 'bg-linear-to-b from-white via-blue-50 to-white dark:bg-black'}`}>
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
          <>
            {/* Banner section */}
            <div className="w-full bg-linear-to-b from-white via-blue-50 to-transparent py-12 md:py-20">
              <div className="max-w-6xl mx-auto px-4 md:px-8">
                <h1 className="category-title-large text-center mb-8 md:mb-12">{postDetail.title || "Başlık Yok"}</h1>
                {postDetail.banner && (
                  <div className="flex justify-center">
                    {postDetail.banner.startsWith("http") ? (
                      <Image src={postDetail.banner} alt={postDetail.title || ""} width={800} height={500} className="w-full max-w-4xl rounded-3xl shadow-lg object-cover" style={{ maxHeight: 500 }} unoptimized />
                    ) : (
                      <Image src={`http://127.0.0.1:8000/storage/${postDetail.banner}`} alt={postDetail.title || ""} width={800} height={500} className="w-full max-w-4xl rounded-3xl shadow-lg object-cover" style={{ maxHeight: 500 }} unoptimized />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content section */}
            <section className="w-full bg-white py-16 md:py-24">
              <div className="max-w-4xl mx-auto px-4 md:px-8">
                {(postDetail.description || (postDetail.categories && postDetail.categories[0]?.description)) && (
                  <div className="mb-12 pb-12 border-b border-gray-200">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Özet</h2>
                    <div className="text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: postDetail.description || postDetail.categories[0]?.description || '' }} />
                  </div>
                )}
                {postDetail.content && (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Detaylar</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: postDetail.content }} />
                  </div>
                )}
              </div>
            </section>
          </>
        )}
        {/* Kategoriye göre postlar */}
        {!pageData && !notFound && !postDetail && categoryPosts.length > 0 && (
          <section className="w-full bg-transparent flex flex-col items-center justify-center py-20 md:py-32">
            <h1 className="category-title-large mb-16 md:mb-20 text-center">
              {getHeadingText()}
            </h1>
            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 justify-items-center mx-auto px-4 md:px-0">
              {categoryPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col items-center p-6 transition-all duration-300 hover:scale-105 cursor-pointer w-72 h-auto group"
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
                      width={160}
                      height={160}
                      className="w-40 h-40 object-cover rounded-xl bg-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300"
                      unoptimized
                    />
                  ) : null}
                  <h2 className="text-lg font-semibold text-gray-800 text-center mt-4 group-hover:text-blue-600 transition-colors duration-300">{post.title}</h2>
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
