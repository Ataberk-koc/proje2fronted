import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  title: string;
  banner: string;
  slug: string;
  parent?: { title: string } | null;
}

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

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
    router.push(`/${slug}`);
  };

  return (
    <section className="category-section">
      <h2 className="category-section-title">Kategoriler</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div
            className="category-card"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            style={{ cursor: "pointer" }}
          >
            <img src={cat.banner} alt={cat.title} className="category-banner" />
            <div className="category-title">{cat.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

