'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/hooks/use-toast'
import { CategoryList } from '@/features/categories/components/category-list'
import { CategoryForm } from '@/features/categories/components/category-form'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { CategoryType, CategoryFormData } from '@/features/categories/types/category'
import { Category } from '@/types/database.types'
import { PageHeader } from '@/components/page-header'

export default function CategoriesPage() {
  const { toast } = useToast()
  const [selectedType, setSelectedType] = useState<CategoryType>('EXPENSE')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  } = useCategories()

  // Filter categories by type
  const filteredCategories = categories.filter(
    (category) => category.type === selectedType,
  )

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true)
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, data)
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        })
      } else {
        await createCategory(data)
        toast({
          title: 'Success',
          description: 'Category created successfully',
        })
      }
      // Refresh categories after successful operation
      await fetchCategories()
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = async (category: Category) => {
    try {
      setIsSubmitting(true)
      await deleteCategory(category.id)
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      })
      // Refresh categories after successful operation
      await fetchCategories()
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) {
      setSelectedCategory(undefined)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Categories"
        text="Manage your income and expense categories"
      />
      <div className="flex items-center justify-between">
        <div>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Tabs
        defaultValue="EXPENSE"
        onValueChange={(value) => setSelectedType(value as CategoryType)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="EXPENSE">Expenses</TabsTrigger>
          <TabsTrigger value="INCOME">Income</TabsTrigger>
        </TabsList>
        <TabsContent value={selectedType} className="space-y-4">
          <CategoryList
            categories={filteredCategories}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isSubmitting}
          />
        </TabsContent>
      </Tabs>

      <CategoryForm
        open={isFormOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        defaultValues={selectedCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
