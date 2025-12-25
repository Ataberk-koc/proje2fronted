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
    <section className="w-full bg-white py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-blue-900">Kategoriler</h2>
      <div
        className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center"
      >
        {categories.map((cat) => (
          <div
            className="category-card bg-white rounded-xl shadow-md border border-zinc-200 flex flex-col items-center p-4 transition-transform hover:scale-105 hover:shadow-lg cursor-pointer w-60 h-56"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <img
              src={cat.banner}
              alt={cat.title}
              className="w-24 h-24 object-cover rounded-full mb-4 border border-blue-200 bg-gray-100"
            />
            <div className="text-lg font-semibold text-blue-900 text-center mt-2">
              {cat.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

