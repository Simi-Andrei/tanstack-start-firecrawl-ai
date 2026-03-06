import { MessageResponse } from '#/components/ai-elements/message'
import { Badge } from '#/components/ui/badge'
import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible'
import { getItemById, saveSummaryAndGenerateTagsFn } from '#/data/items'
import { cn } from '#/lib/utils'
import { useCompletion } from '@ai-sdk/react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  ExternalLinkIcon,
  Loader2Icon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemById({ data: { id: params.itemId } }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title ?? 'Item details',
      },
      {
        property: 'og:image',
        content: loaderData?.ogImage ?? '',
      },
      {
        name: 'twitter:title',
        content: loaderData?.title ?? 'Item Details',
      },
    ],
  }),
})

function RouteComponent() {
  const data = Route.useLoaderData()

  const [contentOpen, setContentOpen] = useState(false)

  const router = useRouter()

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/summary',
    initialCompletion: data.summary ? data.summary : undefined,
    streamProtocol: 'text',
    body: {
      itemId: data.id,
    },
    onFinish: async (_prompt, completionText) => {
      await saveSummaryAndGenerateTagsFn({
        data: {
          id: data.id,
          summary: completionText,
        },
      })

      toast.success('Summary generated and saved')
      router.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleGenerateSummary() {
    if (!data.content) {
      toast.error('No content available to summarize')
      return
    }

    complete(data.content)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 w-full">
      <div className="flex justify-start">
        <Link
          to="/dashboard/items"
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <ArrowLeftIcon />
          Go Back
        </Link>
      </div>

      {data.ogImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={data.ogImage}
            alt={data.title ?? 'Item Image'}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {data.title ?? 'Untitled'}
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {data.author && (
            <span className="inline-flex items-center gap-1">
              <UserIcon className="size-3.5" />
              {data.author}
            </span>
          )}
          {data.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              {new Date(data.publishedAt).toLocaleDateString('en-US')}
            </span>
          )}

          <span className="inline-flex items-center gap-1">
            <ClockIcon className="size-3.5" />
            Saved {new Date(data.createdAt).toLocaleDateString('en-US')}
          </span>
        </div>

        <a
          target="_blank"
          href={data.url}
          className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
        >
          View Original
          <ExternalLinkIcon className="size-3.5" />
        </a>

        {/* Tags */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Badge>{tag}</Badge>
            ))}
          </div>
        )}

        {/* Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Summary
                </h2>

                {completion || data.summary ? (
                  <MessageResponse>{completion}</MessageResponse>
                ) : (
                  <p className="text-muted-foreground italic">
                    {data.content
                      ? 'No summary yet. Generate one with AI'
                      : 'No content available to summarize'}
                  </p>
                )}
              </div>

              {data.content && !data.summary && (
                <Button
                  onClick={handleGenerateSummary}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="size-4" />
                      Generate
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        {data.content && (
          <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="font-medium">Full Content</span>
                <ChevronDownIcon
                  className={cn(
                    contentOpen ? 'rotate-180' : '',
                    'size-4 transition-transform duration-200',
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent>
                  <MessageResponse
                    components={{
                      p: ({ children }) => (
                        <div className="mb-4 last:mb-0">{children}</div>
                      ),
                    }}
                  >
                    {data.content}
                  </MessageResponse>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}
