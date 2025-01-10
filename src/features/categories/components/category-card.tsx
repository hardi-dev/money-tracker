'use client'

import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { Category } from '@/types/database.types'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteCategoryDialog } from './delete-category-dialog'

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  isDeleting?: boolean
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  isDeleting = false,
}: CategoryCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(category)
  }

  return (
    <>
      <Card className="group relative overflow-hidden">
        {/* Color strip */}
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{ backgroundColor: category.color }}
        />

        <CardHeader className="space-y-1 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {category.icon && (
                <span className="text-xl" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
              )}
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
            <Badge
              variant={category.type === 'EXPENSE' ? 'destructive' : 'default'}
              className="capitalize"
            >
              {category.type.toLowerCase()}
            </Badge>
          </div>
          {category.description && (
            <CardDescription>{category.description}</CardDescription>
          )}
        </CardHeader>

        {/* Action buttons - visible on hover */}
        <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-end gap-2 bg-gradient-to-t from-background/90 to-background/0 px-6 py-4 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(category)}
            className="h-8 w-8"
            disabled={isDeleting}
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit {category.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="h-8 w-8 text-destructive hover:text-destructive"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {category.name}</span>
          </Button>
        </CardFooter>
      </Card>

      <DeleteCategoryDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        category={category}
        isDeleting={isDeleting}
      />
    </>
  )
}
