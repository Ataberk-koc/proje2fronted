'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Category {
  id: number;
  title: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  banner: string;
  categories?: Category[];
}

const fetchBlogPosts = async (lang: string): Promise<Post[]> => {
  const res = await fetch('http://127.0.0.1:8000/api/posts', {
    headers: { 'Accept-Language': lang },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  if (data && Array.isArray(data.data)) {
    // Kategorisi blog olanları filtrele
    return data.data.filter((post: Post) => 
      post.categories && 
      Array.isArray(post.categories) &&
      post.categories.some((cat: Category) => 
        cat.title.toLowerCase() === 'blog'
      )
    );
  }
  return [];
};

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || i18n.language || 'tr';
  const { ref, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    // Her zaman fetch yap, isVisible'dan bağımsız
    const first = posts.length === 0;
    if (first) setLoading(true);
    
    fetchBlogPosts(i18n.language)
      .then((data) => {
        setPosts(data);
      })
      .catch(() => {
        console.error('Blog fetch hatası');
        setPosts([]);
      })
      .finally(() => { 
        if (first) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // İsVisible olduğunda animasyonları başlat
  useEffect(() => {
    if (isVisible && posts.length > 0) {
      setVisibleItems(new Set());
      posts.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => new Set(prev).add(index));
        }, index * 80);
      });
    }
  }, [isVisible, posts]);

  // Don't return early - always render the section to prevent hydration mismatch
  const hasNoPosts = !posts || posts.length === 0;

  const getBannerUrl = (banner: string | null | undefined) => {
    if (!banner || banner === 'null') return '/placeholder.jpg';
    return banner;
  };

  const stripHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <section className="w-full bg-linear-to-b from-white via-blue-50 to-white py-20 md:py-32 flex flex-col items-center relative overflow-hidden" ref={ref}>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .blog-card {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .blog-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 25px 60px rgba(59, 130, 246, 0.25);
        }
        .blog-image {
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .blog-card:hover .blog-image {
          transform: scale(1.12);
        }
        .blog-overlay {
          transition: opacity 0.3s ease;
        }
      `}</style>
      
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-6xl px-4 md:px-0 relative z-10">
        {/* Show loading state */}
        {loading && (
          <div className="w-full py-20 text-center text-gray-500">
            {i18n.language === 'en' ? 'Loading...' : 'Yükleniyor...'}
          </div>
        )}

        {/* Show empty state when not loading and no posts */}
        {!loading && hasNoPosts && (
          <div className="w-full py-20 text-center text-gray-500">
            {i18n.language === 'en' ? 'No blog posts found.' : 'Blog yazısı bulunamadı.'}
          </div>
        )}

        {/* Show blog grid when posts exist */}
        {!hasNoPosts && (
          <>
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="category-title-large mb-6 text-center">
                {i18n.language === 'en' ? 'Latest Articles' : 'Son Makaleler'}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                {i18n.language === 'en'
                  ? 'Discover our latest insights and industry trends'
                  : 'En son görüşlerimizi ve sektör trendlerini keşfedin'}
              </p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/${locale}/${post.slug}`}>
                  <div 
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col blog-card"
                    style={{
                      animation: visibleItems.has(index) ? `fadeInUp 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                      opacity: visibleItems.has(index) ? 1 : 0,
                    }}
                  >
                    {/* Banner Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <Image
                        src={getBannerUrl(post.banner)}
                        alt={post.title}
                        fill
                        unoptimized
                        className="w-full h-full object-cover blog-image"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 blog-overlay"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col grow">
                      {/* Category Badge */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="inline-flex mb-4">
                          <span className="px-4 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            {post.categories[0].title}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 grow line-clamp-3">
                        {truncateText(stripHtml(post.description || post.content), 150)}
                      </p>

                      {/* Read More Link */}
                      <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors duration-300">
                        <span>{i18n.language === 'en' ? 'Read More' : 'Devamını Oku'}</span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Posts Button */}
            {posts.length > 0 && (
              <div className="flex justify-center mt-16">
                <Link
                  href={`/${locale}/blog`}
                  className="px-10 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-105 active:scale-95 text-base uppercase tracking-wider"
                >
                  {i18n.language === 'en' ? 'View All Articles' : 'Tüm Makaleleri Gör'}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
