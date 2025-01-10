'use client'

import { CategoryCard } from './category-card'
import { CategoryListProps } from '../types/category'

export function CategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryListProps) {
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!categories?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No categories found
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}
