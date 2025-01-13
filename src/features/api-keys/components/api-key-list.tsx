'use client'

import { useState } from "react"
import { Copy, MoreHorizontal } from "lucide-react"
import { type ApiKey } from "../types/api-key"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/hooks/use-toast"
import { DeleteApiKeyDialog } from "./delete-api-key-dialog"
import { formatDateTime, formatRelativeTime } from "@/lib/utils"

interface ApiKeyListProps {
  apiKeys: ApiKey[]
}

export function ApiKeyList({ apiKeys }: ApiKeyListProps) {
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCopy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast({
        title: "Copied!",
        description: "API key copied to clipboard.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (apiKey: ApiKey) => {
    // Filter out the deleted API key from the list
    apiKeys = apiKeys.filter(key => key.id !== apiKey.id)
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left font-medium">Name</th>
                <th className="pb-4 text-left font-medium">Key</th>
                <th className="pb-4 text-left font-medium">Created</th>
                <th className="pb-4 text-left font-medium">Expires</th>
                <th className="pb-4 text-left font-medium">Last Used</th>
                <th className="pb-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="border-b last:border-none">
                  <td className="py-4">{apiKey.name}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1">
                        {apiKey.key}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4">{formatRelativeTime(apiKey.created_at)}</td>
                  <td className="py-4">
                    {apiKey.expires_at
                      ? formatDateTime(apiKey.expires_at)
                      : "Never"}
                  </td>
                  <td className="py-4">
                    {apiKey.last_used_at
                      ? formatRelativeTime(apiKey.last_used_at)
                      : "Never"}
                  </td>
                  <td className="py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleCopy(apiKey.key)}
                          className="text-sm"
                        >
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedApiKey(apiKey)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-sm text-destructive"
                        >
                          Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteApiKeyDialog
        apiKey={selectedApiKey}
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedApiKey(null)
        }}
        onDelete={handleDelete}
      />
    </>
  )
}
