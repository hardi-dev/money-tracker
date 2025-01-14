import { CreateApiKeyButton } from "@/features/api-keys/components/create-api-key-button"
import { ApiKeyList } from "@/features/api-keys/components/api-key-list"
import { getApiKeys } from "@/features/api-keys/actions/api-key"
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MDXRemote } from 'next-mdx-remote/rsc'
import fs from 'fs/promises'
import path from 'path'

export default async function ApiKeysPage() {
  const { data: apiKeys = [] } = await getApiKeys()
  
  // Read documentation file
  const docPath = path.join(process.cwd(), 'src/app/(protected)/settings/api-keys/documentation.mdx')
  const documentation = await fs.readFile(docPath, 'utf-8')

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="API Keys"
        text="Manage your API keys and explore our API documentation."
      />
      
      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <div className="flex justify-end">
            <CreateApiKeyButton />
          </div>
          
          <ApiKeyList apiKeys={apiKeys} />
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Learn how to integrate Money Tracker with your applications
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <MDXRemote source={documentation} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
