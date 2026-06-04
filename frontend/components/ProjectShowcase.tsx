import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots, CarouselCounter } from '@/components/ui/carousel'
import { ImageModal } from './ImageModal'
import { markdownComponents } from '../lib/markdownComponents'
import styles from '../styles/Home.module.css'

interface ShowcaseItem {
  src: string
  alt: string
  type?: 'image' | 'spotify'
}

// Per-project media. Flagship Rust projects (Pour, seed, git-identity) have empty
// arrays — the layout is ready; screenshots get dropped in here later.
const projectImages: Record<string, ShowcaseItem[]> = {
  'EmailEssence': [
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjkyi1uoTKvHl3Yc6iN4UeChxIdMXsOJLnf0tP', alt: 'EmailEssence Dashboard', type: 'image' },
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjUrh23jbW6d9Ra8hBcVYTtwP0Dji5yJs7eES2', alt: 'EmailEssence Screenshot 1', type: 'image' },
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjprm1QkzGEPjidDz7AUys8ev256YTLbFZocMx', alt: 'EmailEssence Screenshot 2', type: 'image' },
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjsf8xZS345OyM2j0kCJQ6lcYngt9VFziofvTW', alt: 'EmailEssence Screenshot 3', type: 'image' },
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjQebo5pW6CG1RlbTWjvaFQu9IyZJsp2iL36nm', alt: 'EmailEssence Screenshot 4', type: 'image' },
  ],
  'ReverbXR': [
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjq4GZLzGh0pZivJbPAEcongRdQtewV6DxLfyG', alt: 'ReverbXR v2', type: 'image' },
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjKGomwQLgAUnSZdIuQlaNTyHWEscxr6VpFqoB', alt: 'ReverbXR v1 Final', type: 'image' },
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNj8dTvhqGaSOBD9ZzAXdiosC5GunQHKYNbFJ1R', alt: 'ReverbXR v1', type: 'image' },
    { src: 'https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjWVxqg04upgRSyMNarcl0H3nB1tjEIfLoexVY', alt: 'ReverbXR 2D Prototype', type: 'image' },
  ],
  'Pour': [],
  'seed': [],
  'git-identity': [],
  'WhatNext': [
    { src: 'https://open.spotify.com/embed/playlist/2kpswjk4hzWHQwpci2PUnc?utm_source=generator', alt: 'WhatNext Playlist 1', type: 'spotify' },
    { src: 'https://open.spotify.com/embed/playlist/6KgZCaJ94sVwCVZiOt1ToE?utm_source=generator', alt: 'WhatNext Playlist 2', type: 'spotify' },
    { src: 'https://open.spotify.com/embed/playlist/2oLS4kpcrgoA530LjNqH1V?utm_source=generator', alt: 'WhatNext Playlist 3', type: 'spotify' },
    { src: 'https://open.spotify.com/embed/playlist/72jl5AIRhXgX12Gbtkifw5?utm_source=generator', alt: 'WhatNext Playlist 4', type: 'spotify' },
    { src: 'https://open.spotify.com/embed/playlist/6FRUuTQFVtEQkECIqslQRS?utm_source=generator', alt: 'WhatNext Playlist 5', type: 'spotify' },
    { src: 'https://open.spotify.com/embed/playlist/2TGkrJ3ZuNWAzFiLq9z2JY?utm_source=generator', alt: 'WhatNext Playlist 6', type: 'spotify' },
  ]
}

// TUI apps — small dark glyphs
const tuiIcons = new Set(["Pour", "seed", "git-identity"])

interface ProjectShowcaseProps {
  intro: string
  projects: Record<string, string>
}

// Renders the projects section: an intro blurb followed by one section per
// project, each with its markdown body and an image/spotify carousel. Extracted
// from the old single-page home so the portfolio route can own it.
export function ProjectShowcase({ intro, projects }: ProjectShowcaseProps) {
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

  const renderCarouselContent = useCallback((name: string, items: ShowcaseItem[], type: 'image' | 'spotify') => {
    const carouselOptions = {
      loop: true,
      align: "start" as const,
      slidesToScroll: 1,
      dragFree: false,
      ...(isMobile ? { slidesToShow: 1, spacing: 10 } : { slidesToShow: type === 'spotify' ? 2 : 3, spacing: 20 })
    }

    const carouselItemClass = `${isMobile ? 'basis-full' : type === 'spotify' ? 'basis-1/2' : 'basis-1/3'} flex justify-center pl-4`

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '95%',
        padding: '0 1rem',
        margin: '0 auto'
      }}>
        <Carousel
          opts={carouselOptions}
          className="w-full"
          aria-label={type === 'spotify' ? `${name} playlists` : `${name} screenshots`}
        >
          <CarouselContent className="flex -ml-4">
            {items.map((item, index) => (
              <CarouselItem key={`${type}-${item.src}-${index}`} className={carouselItemClass}>
                {type === 'spotify' ? (
                  <div className="w-full cursor-grab active:cursor-grabbing">
                    <iframe
                      style={{ borderRadius: '0px' }}
                      src={item.src}
                      width="100%"
                      height={isMobile ? "152" : "352"}
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      draggable="true"
                      className="transition-all hover:scale-105"
                    />
                  </div>
                ) : (
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
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="carousel-button" />
          <CarouselNext className="carousel-button" />
          <CarouselDots />
          <CarouselCounter />
        </Carousel>
      </div>
    )
  }, [isMobile, handleImageClick])

  const renderProjectSection = useCallback((name: string, content: string) => {
    const iconPath = `/projects/${name.toLowerCase().replaceAll(' ', '')}.ico`
    const iconClass = tuiIcons.has(name) ? "project-icon-tui" : ""

    const imageItems = projectImages[name]?.filter(item => item.type === 'image') ?? []
    const spotifyItems = projectImages[name]?.filter(item => item.type === 'spotify') ?? []

    return (
      <section id={`projects-${name.toLowerCase()}`} className={styles.section} key={name}>
        <hr className="tui-divider" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
          <div style={{ width: 64, height: 64, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src={iconPath}
              alt={`${name} icon`}
              width={120}
              height={120}
              className={iconClass}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h2>{name}</h2>
        </div>
        <div className="react-markdown project-body" style={{ padding: '0.5rem 0 1.5rem' }}>
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
        {(imageItems.length > 0 || spotifyItems.length > 0) && (
          <hr className="tui-divider" />
        )}
        {imageItems.length > 0 && (
          <div style={{ padding: '1.5rem 0' }}>
            {renderCarouselContent(name, imageItems, 'image')}
          </div>
        )}
        {spotifyItems.length > 0 && (
          <div style={{ padding: '1.5rem 0' }}>
            {renderCarouselContent(name, spotifyItems, 'spotify')}
          </div>
        )}
      </section>
    )
  }, [renderCarouselContent])

  return (
    <>
      <section id="projects" className={styles.section}>
        <ReactMarkdown>{intro}</ReactMarkdown>
        {Object.entries(projects).map(([name, content]) => renderProjectSection(name, content))}
        <hr className="tui-divider" />
      </section>

      {expandedImage && (
        <ImageModal
          src={expandedImage.src}
          alt={expandedImage.alt}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </>
  )
}
