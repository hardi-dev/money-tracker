import { z } from "zod"

export type ApiKeyPermission = "transactions.create" | "transactions.delete"

export const apiKeySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  key: z.string(),
  permissions: z.array(z.enum(["transactions.create", "transactions.delete"])),
  created_at: z.string().datetime(),
  expires_at: z.string().datetime().nullable(),
  last_used_at: z.string().datetime().nullable(),
  deleted_at: z.string().datetime().nullable(),
})

export const apiKeyUsageSchema = z.object({
  id: z.string().uuid(),
  api_key_id: z.string().uuid(),
  endpoint: z.string(),
  method: z.string(),
  status_code: z.number(),
  ip_address: z.string(),
  created_at: z.string().datetime(),
})

export type ApiKey = z.infer<typeof apiKeySchema>
export type ApiKeyUsage = z.infer<typeof apiKeyUsageSchema>

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  permissions: z.array(z.enum(["transactions.create", "transactions.delete"]))
    .min(1, "At least one permission is required"),
  expires_at: z.union([z.string().datetime(), z.null()]).optional(),
})

export type CreateApiKey = z.infer<typeof createApiKeySchema>
