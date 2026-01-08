import React, { useEffect, useState } from "react";
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
    <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 flex flex-col items-center">
      <h2 className="text-4xl font-extrabold mb-10 text-blue-900 tracking-tight drop-shadow-lg uppercase">Kategoriler</h2>
      <div
        className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center"
      >
        {categories.map((cat) => (
          <div
            className="category-card bg-white rounded-3xl shadow-xl border border-blue-100 flex flex-col items-center p-6 transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer w-72 h-72 group"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <div className="relative flex items-center justify-center mb-6">
              <img
                src={cat.banner}
                alt={cat.title}
                className="w-36 h-36 object-cover rounded-full border-4 border-blue-300 bg-gray-100 shadow-lg group-hover:border-blue-500 transition-all duration-300"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
              />
              <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md opacity-80 group-hover:opacity-100 transition">Yeni</span>
            </div>
            <div className="text-xl font-bold text-blue-900 text-center mt-2 drop-shadow-sm group-hover:text-blue-700 transition-all duration-300">
              {cat.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

