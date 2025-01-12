'use client'

import { useState } from "react"
import { revokeApiKey } from "../actions/api-key"
import { type ApiKey } from "../types/api-key"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/hooks/use-toast"

interface DeleteApiKeyDialogProps {
  apiKey: ApiKey | null
  open: boolean
  onClose: () => void
  onDelete: (apiKey: ApiKey) => void
}

export function DeleteApiKeyDialog({
  apiKey,
  open,
  onClose,
  onDelete,
}: DeleteApiKeyDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!apiKey) return

    try {
      setIsLoading(true)
      const { success, error } = await revokeApiKey(apiKey.id)

      if (!success) throw error

      onDelete(apiKey)
      toast({
        title: "API key revoked",
        description: "The API key has been revoked successfully.",
      })
      onClose()
    } catch {
      toast({
        title: "Error",
        description: "Failed to revoke API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke API Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke this API key? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Revoking..." : "Revoke"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
