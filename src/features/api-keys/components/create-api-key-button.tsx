'use client';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateApiKeyDialog } from "./create-api-key-dialog"

export function CreateApiKeyButton() {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create API Key
      </Button>

      <CreateApiKeyDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  )
}
