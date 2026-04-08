import { Category } from '@/lib/types';

interface BadgeProps {
  category: Category;
}

const categoryColors: Record<Category, string> = {
  all: 'bg-gray-600 text-gray-100',
  crypto: 'bg-orange-600 text-orange-100',
  sports: 'bg-green-600 text-green-100',
  politics: 'bg-blue-600 text-blue-100',
};

export function Badge({ category }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${categoryColors[category]}`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}
