
import { isUrl } from '~/utils/is-url'
import { AlertCircle, Globe } from 'lucide-react'

export const Route = createFileRoute({
  component: DashboardDynamicPage,
})

function DashboardDynamicPage() {
  const { url } = Route.useParams()
  const decodedUrl = decodeURIComponent(url)
  const isValidUrl = isUrl(decodedUrl)

  if (!isValidUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Invalid URL</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          The provided URL is not valid. Please enter a valid URL in the search box above to continue.
        </p>
        <code className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
          {decodedUrl}
        </code>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">URL Preview</h1>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Current URL</label>
            <p className="mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
              {decodedUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}