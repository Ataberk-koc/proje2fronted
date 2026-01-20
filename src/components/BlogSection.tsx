'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || i18n.language || 'tr';

  useEffect(() => {
    const first = posts.length === 0;
    if (first) setLoading(true);
    fetchBlogPosts(i18n.language)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => { if (first) setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  if (loading) return <div className="w-full py-20 text-center text-gray-500">Yükleniyor...</div>;
  if (posts.length === 0) return null;

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
    <section className="w-full bg-linear-to-b from-white via-blue-50 to-white py-20 md:py-32 flex flex-col items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-6xl px-4 md:px-0 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="category-title-large mb-6 text-center">
            {i18n.language === 'en' ? 'Latest Blog Posts' : 'Son Blog Yazıları'}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {i18n.language === 'en'
              ? 'Stay updated with our latest articles and insights'
              : 'En son makalelerimiz ve içgörülerimiz ile güncel kalın'}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/${locale}/${post.slug}`}>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer h-full flex flex-col">
                {/* Banner Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={getBannerUrl(post.banner)}
                    alt={post.title}
                    fill
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  {/* Category Badge */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="inline-flex mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {post.categories[0].title}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
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
          <div className="flex justify-center mt-12">
            <Link
              href={`/${locale}/blog`}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-base"
            >
              {i18n.language === 'en' ? 'View All Posts' : 'Tüm Yazıları Gör'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
