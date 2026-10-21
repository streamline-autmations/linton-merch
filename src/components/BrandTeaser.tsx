import { lazy, Suspense, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResponsiveImage } from '@/components/ResponsiveImage'

// The builder (mock-up stage, logo reading, export) is only fetched once the visitor opens it.
const BrandPreview = lazy(() =>
  import('@/components/BrandPreview').then((m) => ({ default: m.BrandPreview })),
)

/**
 * "Put your logo on it" on the home page: a compact band with a shirt sketch. The full builder
 * opens in a dialog (a tall bottom sheet on phones) and unmounts on close, which also lets go of
 * any logo the visitor read in. Nothing is uploaded or stored.
 */
export function BrandTeaser() {
  const [open, setOpen] = useState(false)
  return (
    <section
      className="on-ink overflow-hidden bg-brand-blue text-white"
      aria-labelledby="brand-teaser-title"
    >
      <div className="container-wide grid grid-cols-[minmax(0,1fr)_7.5rem] items-center gap-x-5 gap-y-6 py-12 sm:gap-y-0 sm:grid-cols-[minmax(0,1fr)_14rem] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-20 lg:py-16">
        <div className="col-start-1 row-start-1 self-end">
          <h2 id="brand-teaser-title" className="section-title max-w-md">
            Put your logo on it.
          </h2>
          <p className="mt-3 hidden max-w-sm text-base leading-7 text-white/85 sm:block lg:mt-5">
            See it stitched on a golf shirt, engraved on a bottle or printed on a tote. Download the
            picture or add it to your quote.
          </p>
        </div>
        <div className="col-span-2 row-start-2 self-start sm:col-span-1 sm:mt-6 lg:mt-8">
          <p className="max-w-sm text-base leading-7 text-white/85 sm:hidden">
            See it on a golf shirt, bottle or tote, then download the picture.
          </p>
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
              <Button
                size="lg"
                className="mt-5 h-12 w-full bg-white px-6 text-ink hover:bg-white/90 sm:mt-0 sm:w-auto"
              >
                Try it with your logo
              </Button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="builder-overlay fixed inset-0 z-50 bg-ink/75" />
              <DialogPrimitive.Content className="builder-dialog fixed z-50 overflow-y-auto bg-white text-ink">
                <div className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-white pl-5 pr-2 lg:pl-10 lg:pr-4">
                  <DialogPrimitive.Title className="text-xl font-bold tracking-tight [font-family:var(--font-display)]">
                    Put your logo on it
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close className="flex h-11 w-11 items-center justify-center rounded-sm text-ink/70 transition-colors hover:bg-secondary hover:text-ink">
                    <X className="size-5" aria-hidden="true" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>
                <DialogPrimitive.Description className="sr-only">
                  Upload a logo or type your company name to see it on a product. Your logo is read
                  on this device only and never uploaded.
                </DialogPrimitive.Description>
                <div className="px-5 pb-10 pt-5 lg:px-10 lg:pt-8">
                  <Suspense
                    fallback={
                      <p role="status" className="py-24 text-center text-sm text-muted-foreground">
                        Opening the preview…
                      </p>
                    }
                  >
                    <BrandPreview embedded />
                  </Suspense>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
          <p className="mt-3 text-xs text-white/80">Your logo stays on your device.</p>
        </div>
        <ShirtSketch />
      </div>
    </section>
  )
}

/** A real shirt photo with a stitched "your logo" patch on the left chest; it sews in on view. */
function ShirtSketch() {
  return (
    <div
      className="col-start-2 row-start-1 self-end sm:row-span-2 sm:self-center lg:row-span-2"
      aria-hidden="true"
    >
      <div className="relative mx-auto aspect-[1122/1402] w-full max-w-[20rem] overflow-hidden rounded-md bg-white">
        <ResponsiveImage
          src="/mockups/golf-shirt/black-front.webp"
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 224px, 120px"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="teaser-mark stitch">Your logo</span>
      </div>
    </div>
  )
}
