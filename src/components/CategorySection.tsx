import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  // locale'yi path'ten al, yoksa i18n'den al
  const locale = pathname?.split("/")[1] || i18n.language || "tr";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const filtered = data.data.filter(
            (cat: Category) => cat.parent && cat.parent.title === "hakkimizda"
          );
          setCategories(filtered);
        }
      });
  }, []);

  if (!categories.length) return null;

  const handleCategoryClick = (slug: string) => {
    router.push(`/${locale}/${slug}`);
  };

  return (
    <section className="w-full bg-transparent py-20 md:py-32 flex flex-col items-center">
      <h2 className="category-title-large mb-16 md:mb-20 text-center">Kategoriler</h2>
      <div
        className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 justify-items-center px-4 md:px-0"
      >
        {categories.map((cat) => (
          <div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col items-center p-6 transition-all duration-300 hover:scale-105 cursor-pointer w-72 h-80 group"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <div className="relative flex items-center justify-center mb-6">
              <Image
                src={cat.banner}
                alt={cat.title}
                width={160}
                height={160}
                unoptimized
                className="w-40 h-40 object-cover rounded-xl bg-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300"
                style={{ boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.1)' }}
              />
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-sm opacity-80 group-hover:opacity-100 transition">Yeni</span>
            </div>
            <div className="text-lg font-semibold text-gray-800 text-center mt-3 group-hover:text-blue-600 transition-colors duration-300">
              {cat.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

