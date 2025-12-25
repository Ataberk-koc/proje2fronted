import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  title: string;
  banner: string;
  parent?: { title: string } | null;
}

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <section className="category-section">
      <h2 className="category-section-title">Kategoriler</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div className="category-card" key={cat.id}>
            <img src={cat.banner} alt={cat.title} className="category-banner" />
            <div className="category-title">{cat.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
