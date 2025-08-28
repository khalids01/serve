'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Copy, Key, Plus, Trash2, Shield, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface ApiKey {
  id: string
  name: string
  lastUsedAt: string | null
  createdAt: string
  revoked: boolean
}

interface NewApiKey {
  id: string
  name: string
  key: string
  createdAt: string
}

export default function ApiKeysPage() {
  const params = useParams()
  const applicationId = params.id as string
  
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey, setNewKey] = useState<NewApiKey | null>(null)
  const [showNewKey, setShowNewKey] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchKeys()
  }, [applicationId])

  const fetchKeys = async () => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/keys`)
      if (response.ok) {
        const data = await response.json()
        setKeys(data.keys)
      } else {
        toast.error('Failed to fetch API keys')
      }
    } catch (error) {
      toast.error('Error fetching API keys')
    } finally {
      setLoading(false)
    }
  }

  const createKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }

    setCreating(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewKey(data.apiKey)
        setShowNewKey(true)
        setNewKeyName('')
        setIsDialogOpen(false)
        await fetchKeys()
        toast.success('API key created successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create API key')
      }
    } catch (error) {
      toast.error('Error creating API key')
    } finally {
      setCreating(false)
    }
  }

  const revokeKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/keys/${keyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'revoke' }),
      })

      if (response.ok) {
        await fetchKeys()
        toast.success('API key revoked')
      } else {
        toast.error('Failed to revoke API key')
      }
    } catch (error) {
      toast.error('Error revoking API key')
    }
  }

  const deleteKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/keys/${keyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchKeys()
        toast.success('API key deleted')
      } else {
        toast.error('Failed to delete API key')
      }
    } catch (error) {
      toast.error('Error deleting API key')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage API keys for programmatic access to your application
          </p>
        </div>

        {/* New Key Display */}
        {newKey && (
          <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Key className="h-5 w-5" />
                New API Key Created
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Copy this key now - you won't be able to see it again!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-green-900 rounded border">
                <code className="flex-1 font-mono text-sm">
                  {showNewKey ? newKey.key : '•'.repeat(newKey.key.length)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewKey(!showNewKey)}
                >
                  {showNewKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(newKey.key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setNewKey(null)}
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Key Dialog */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Give your API key a descriptive name to help you identify it later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API, Mobile App"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createKey}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Key'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>
              These keys allow programmatic access to your application's file storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : keys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys found. Create your first key to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{key.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created {formatDate(key.createdAt)}
                          {key.lastUsedAt && (
                            <> • Last used {formatDate(key.lastUsedAt)}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {key.revoked ? (
                        <Badge variant="destructive">Revoked</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                      
                      {!key.revoked && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Shield className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will immediately disable the API key. Applications using this key will no longer be able to access your files.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => revokeKey(key.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke Key
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the API key. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteKey(key.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Key
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
