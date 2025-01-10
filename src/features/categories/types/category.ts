import { Category } from '@/types/database.types'

export type CategoryType = 'INCOME' | 'EXPENSE'

export interface CategoryFormData {
  name: string
  type: CategoryType
  color: string
  icon?: string
  description?: string
}

export interface CategoryFilters {
  type?: CategoryType
  search?: string
}

export interface CategoryListProps {
  categories: Category[]
  isLoading?: boolean
  isDeleting?: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}
