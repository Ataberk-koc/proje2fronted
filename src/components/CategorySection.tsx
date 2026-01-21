import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
interface Category {
  id: number;
  title: string;
  banner: string;
  slug: string;
  parent?: { title: string } | null;
}


import { usePathname } from "next/navigation";
import i18n from "../i18n";

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const router = useRouter();
  const pathname = usePathname();
  const { ref, isVisible } = useScrollAnimation(0.1);
  // locale'yi path'ten al, yoksa i18n'den al
  const locale = pathname?.split("/")[1] || i18n.language || "tr";

  useEffect(() => {
    if (!isVisible) return;
    
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const filtered = data.data.filter(
            (cat: Category) => cat.parent && cat.parent.title === "hakkimizda"
          );
          setCategories(filtered);
          // Kartları sırayla görünür yap - sadece viewport'a giriş yaptıktan sonra
          filtered.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => new Set(prev).add(index));
            }, index * 100);
          });
        }
      });
  }, [isVisible]);

  if (!categories.length) return null;

  const handleCategoryClick = (slug: string) => {
    router.push(`/${locale}/${slug}`);
  };

  return (
    <section className="w-full bg-transparent py-20 md:py-32 flex flex-col items-center overflow-hidden" ref={ref}>
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
        .card-container {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .card-container:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.2);
        }
        .card-image {
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .card-container:hover .card-image {
          transform: scale(1.08);
        }
        .card-title {
          transition: color 0.3s ease;
        }
        .card-container:hover .card-title {
          color: #2563eb;
        }
        .badge {
          transition: all 0.3s ease;
        }
        .card-container:hover .badge {
          transform: scale(1.1);
          background-color: #1d4ed8;
        }
      `}</style>
      <h2 className="category-title-large mb-16 md:mb-20 text-center">{i18n.t("categories")}</h2>
      <div
        className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 justify-items-center px-4 md:px-0"
      >
        {categories.map((cat, index) => (
          <div
            className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center p-6 cursor-pointer w-72 h-80 group card-container"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            style={{
              animation: visibleItems.has(index) ? `fadeInUp 0.6s ease-out ${index * 0.1}s forwards` : 'none',
              opacity: visibleItems.has(index) ? 1 : 0,
            }}
          >
            <div className="relative flex items-center justify-center mb-6 overflow-hidden rounded-xl">
              <Image
                src={cat.banner}
                alt={cat.title}
                width={160}
                height={160}
                unoptimized
                className="w-40 h-40 object-cover rounded-xl bg-gray-100 shadow-sm card-image"
                style={{ boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.1)' }}
              />
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-sm opacity-80 badge">
                Yeni
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-800 text-center mt-3 card-title">
              {cat.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

