import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategory = categories[0],
  onCategoryChange,
}: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <div className="flex overflow-x-auto gap-2 p-1 bg-gray-100 rounded-xl">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "flex-shrink-0 px-3 py-1 rounded-lg text-base font-medium transition-all duration-200",
            "min-w-fit whitespace-nowrap",
            selectedCategory === category
              ? "bg-white text-black shadow-sm font-semibold"
              : "text-black hover:bg-white/50",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
