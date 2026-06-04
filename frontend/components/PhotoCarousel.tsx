import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots, CarouselCounter } from '@/components/ui/carousel'
import { ImageModal } from './ImageModal'

export interface Photo {
  src: string
  alt: string
}

// Personal photos shown on the /me page. A few peeks into life outside the terminal.
export const HOME_IMAGES: Photo[] = [
  { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjv03EyzDDZg0mYBiM43271b8AJcFG6wTV5saW", alt: "Chester" },
  { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjunwSWmI0cIjg3BZdiJowSTfR8rl9WGL6m2b1", alt: "Latte Art 2024" },
  { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNje9lc5UffMjBseuvGIUcb9FWdHmpONYkoZEKr", alt: "Latte Art 2024 2" },
  { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjsU4pIOn345OyM2j0kCJQ6lcYngt9VFziofvT", alt: "Desk" },
  { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjh0H571WYQRTd6qklsFrWe4cU3bC8MigLN7vA", alt: "Bass Canyon" },
  { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjyQo83uqXAD0saPGEeuYNK8LjZS4WMIm9kz1r", alt: "Bass Canyon 2" }
]

// A draggable image carousel with fullscreen-on-click. Extracted from the old
// single-page home so the personal page can reuse it.
export function PhotoCarousel({ images = HOME_IMAGES }: { images?: Photo[] }) {
  const [expandedImage, setExpandedImage] = useState<{ src: string, alt: string } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleImageClick = useCallback((src: string, alt: string) => {
    setExpandedImage({ src, alt })
  }, [])

  const carouselOptions = {
    loop: true,
    align: "start" as const,
    slidesToScroll: 1,
    dragFree: false,
    ...(isMobile ? { slidesToShow: 1, spacing: 10 } : { slidesToShow: 3, spacing: 20 })
  }

  const carouselItemClass = `${isMobile ? 'basis-full' : 'basis-1/3'} flex justify-center pl-4`

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '95%',
      padding: '0 1rem',
      margin: '0 auto'
    }}>
      <Carousel opts={carouselOptions} className="w-full" aria-label="Personal photos">
        <CarouselContent className="flex -ml-4">
          {images.map((item, index) => (
            <CarouselItem key={`image-${item.src}-${index}`} className={carouselItemClass}>
              <div
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`View ${item.alt} full size`}
                onClick={() => handleImageClick(item.src, item.alt)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleImageClick(item.src, item.alt) } }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={480}
                  height={270}
                  style={{
                    width: 'auto',
                    height: isMobile ? '250px' : '330px',
                    maxWidth: '100%'
                  }}
                  className="object-cover transition-all hover:scale-105"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="carousel-button" />
        <CarouselNext className="carousel-button" />
        <CarouselDots />
        <CarouselCounter />
      </Carousel>

      {expandedImage && (
        <ImageModal
          src={expandedImage.src}
          alt={expandedImage.alt}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </div>
  )
}
