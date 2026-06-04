import Image from 'next/image'
import { useEffect, useRef } from 'react'

// Fullscreen image overlay. Shared by PhotoCarousel and ProjectShowcase.
// Input: Image source and alt text plus an onClose handler
// Output: Modal component for expanded image view
export function ImageModal({ src, alt, onClose }: { src: string, alt: string, onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    overlayRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded image: ${alt}`}
      tabIndex={-1}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '90vw',
            maxHeight: '80vh',
            objectFit: 'contain'
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="font-mono text-base px-4 py-2" style={{ color: 'hsl(var(--tui-gray))' }}>
          {alt}
        </div>
      </div>
    </div>
  )
}
