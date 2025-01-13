'use client'

import { useState } from "react"
import { createApiKey } from "../actions/api-key"
import { type CreateApiKey } from "../types/api-key"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createApiKeySchema } from "../types/api-key"

interface CreateApiKeyDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateApiKeyDialog({ open, onClose }: CreateApiKeyDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<CreateApiKey>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
      permissions: [],
      expires_at: null,
    },
  })

  const onSubmit = async (data: CreateApiKey) => {
    try {
      setIsLoading(true)
      const { success, error, data: apiKey } = await createApiKey(data)

      if (!success || !apiKey?.key) throw error

      setNewApiKey(apiKey.key)
      form.reset()
      
      toast({
        title: "API key created",
        description: "Your new API key has been created successfully.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setNewApiKey(null)
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Create a new API key to access the Money Tracker API.
          </DialogDescription>
        </DialogHeader>

        {newApiKey ? (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <p className="mb-2 text-sm font-medium">Your API Key:</p>
              <code className="break-all text-sm">{newApiKey}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Make sure to copy your API key now. You won&apos;t be able to see it again!
            </p>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Production API Key" />
                    </FormControl>
                    <FormDescription>
                      A friendly name to identify this API key.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("transactions.create")}
                                onCheckedChange={(checked) => {
                                  const value = checked
                                    ? [...(field.value || []), "transactions.create"]
                                    : field.value?.filter(
                                        (p) => p !== "transactions.create"
                                      ) || []
                                  field.onChange(value)
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Create transactions
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("transactions.delete")}
                                onCheckedChange={(checked) => {
                                  const value = checked
                                    ? [...(field.value || []), "transactions.delete"]
                                    : field.value?.filter(
                                        (p) => p !== "transactions.delete"
                                      ) || []
                                  field.onChange(value)
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Delete transactions
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormDescription>
                      Select the permissions for this API key.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expires_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Expiration
                      <span className="text-sm font-normal text-muted-foreground">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value || null)
                        }
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Set an expiration date for this API key. Leave empty for no expiration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
