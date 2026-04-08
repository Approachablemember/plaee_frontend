'use client';

import { Category } from '@/lib/types';
import { useCategory } from '@/lib/hooks';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'sports', label: 'Sports' },
  { value: 'politics', label: 'Politics' },
];

export function CategoryNav() {
  const { selectedCategory, selectCategory } = useCategory();

  return (
    <nav className="border-b border-gray-700">
      <div className="flex space-x-8">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => selectCategory(category.value)}
            className={`
              px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors
              border-b-2 -mb-px
              ${
                selectedCategory === category.value
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
