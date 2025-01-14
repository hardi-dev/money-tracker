import { CreateApiKeyButton } from "@/features/api-keys/components/create-api-key-button"
import { ApiKeyList } from "@/features/api-keys/components/api-key-list"
import { getApiKeys } from "@/features/api-keys/actions/api-key"
import { PageHeader } from '@/components/page-header'

export default async function ApiKeysPage() {
  const { data: apiKeys = [] } = await getApiKeys()

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        heading="API Keys"
        text="Manage API keys for external access to your transactions"
      />
      <div className="flex items-center justify-between">
        <div>
        </div>
        <CreateApiKeyButton />
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border bg-card">
          <div className="p-6 space-y-4">
            <h2 className="font-semibold">Documentation</h2>
            <div className="prose prose-sm max-w-none">
              <p>
                Use these API keys to manage your transactions from external applications.
                Each key can have specific permissions:
              </p>
              <ul>
                <li><code>transactions.create</code> - Create new transactions</li>
                <li><code>transactions.delete</code> - Delete existing transactions</li>
              </ul>
              <h3>Create Transaction</h3>
              <pre><code>
                {`POST /api/transactions
Authorization: Bearer YOUR_API_KEY

{
  "amount": 100,
  "type": "EXPENSE",
  "category_id": "uuid",
  "description": "Coffee",
  "date": "2025-01-13"
}`}
              </code></pre>
              <h3>Delete Transaction</h3>
              <pre><code>
                {`DELETE /api/transactions/:id
Authorization: Bearer YOUR_API_KEY`}
              </code></pre>
            </div>
          </div>
        </div>

        <ApiKeyList apiKeys={apiKeys} />
      </div>
    </div>
  )
}
