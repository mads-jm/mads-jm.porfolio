import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { AppSidebar } from "../components/AppSidebar"
import ReactMarkdown from 'react-markdown'
import { getMarkdownContent } from '../lib/markdown'
import { Contact } from '../components/Contact'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useState, useEffect, useCallback } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import type { Components } from 'react-markdown'

interface SectionData {
  title?: string
  [key: string]: unknown
}

interface SectionContent {
  data: SectionData
  content: string
  subSections?: Record<string, string>
}

interface HomeProps {
  sections: {
    home: SectionContent
    about: SectionContent
    projects: SectionContent
    contact: SectionContent
  }
}

// Extend Components type to include our custom components
interface CustomComponents extends Components {
  ProjectLink: typeof ButtonLink
}

// Custom components for ReactMarkdown
const markdownComponents: CustomComponents = {
  ProjectLink: ButtonLink,
  a: ({ href, children }) => {
    if (href?.includes('github.com')) {
      return (
        <ButtonLink href={href} type="github">
          {children}
        </ButtonLink>
      )
    }
    if (href?.includes('madigan.app')) {
      return (
        <ButtonLink href={href} type="app">
          {children}
        </ButtonLink>
      )
    }
    if (href?.includes('docs.google.com')) {
      return (
        <ButtonLink href={href} type="resume">
          {children}
        </ButtonLink>
      )
    }
    return <a href={href}>{children}</a>
  }
}

// Input: None
// Output: Rendered scroll indicator component
const ScrollIndicator = () => {
  return (
    <div className={styles.scrollIndicator}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.scrollArrow}
        color="black"
      >
        <path
          d="M12 5L12 19M12 19L19 12M12 19L5 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

// Input: Image source and alt text
// Output: Modal component for expanded image view
const ImageModal = ({ src, alt, onClose }: { src: string, alt: string, onClose: () => void }) => {
  return (
    <div 
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
        <div className="font-mono text-base px-4 py-2 rounded-lg" style={{ color: 'hsl(186 25% 66%)' }}>
          {alt}
        </div>
      </div>
    </div>
  )
}

const Home: NextPage<HomeProps> = ({ sections }) => {
  const [expandedImage, setExpandedImage] = useState<{src: string, alt: string} | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageClick = useCallback((src: string, alt: string) => {
    setExpandedImage({ src, alt });
  }, []);

  const renderCarousel = useCallback((images: Array<{src: string, alt: string}>) => {
    const carouselOptions = {
      loop: true,
      align: "start" as const,
      slidesToScroll: 1,
      dragFree: false,
      ...(isMobile ? { 
        slidesToShow: 1,
        spacing: 10 
      } : {
        slidesToShow: 3,
        spacing: 20
      })
    };

    const carouselItemClass = `${isMobile ? 'basis-full' : 'basis-1/3'} flex justify-center pl-4`;

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
        >
          <CarouselContent className="flex -ml-4">
            {images.map((item, index) => (
              <CarouselItem key={`image-${item.src}-${index}`} className={carouselItemClass}>
                <div className="cursor-pointer" onClick={() => handleImageClick(item.src, item.alt)}>
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
          <CarouselPrevious className="bg-primary text-primary-foreground border-border carousel-button" />
          <CarouselNext className="bg-primary text-primary-foreground border-border carousel-button" />
        </Carousel>
      </div>
    );
  }, [isMobile, handleImageClick]);

  const renderSection = useCallback((content: string, id: string, allSections?: {[key: string]: SectionContent}) => {
    if (id === 'home' && allSections) {
      const homeImages = [
        { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjv03EyzDDZg0mYBiM43271b8AJcFG6wTV5saW", alt: "Chester" },
        { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjunwSWmI0cIjg3BZdiJowSTfR8rl9WGL6m2b1", alt: "Latte Art 2024" },
        { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNje9lc5UffMjBseuvGIUcb9FWdHmpONYkoZEKr", alt: "Latte Art 2024 2" },
        { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjsU4pIOn345OyM2j0kCJQ6lcYngt9VFziofvT", alt: "Desk" },
        { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjh0H571WYQRTd6qklsFrWe4cU3bC8MigLN7vA", alt: "Bass Canyon" },
        { src: "https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjyQo83uqXAD0saPGEeuYNK8LjZS4WMIm9kz1r", alt: "Bass Canyon 2" }
      ];

      return (
        <section id={id} className={styles.section}>
          <div className="react-markdown">
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
          <Image src="/divider.svg" alt="Section divider" width={1920} height={2} style={{ width: '100%', height: '2px' }} />
          {renderCarousel(homeImages)}
          <Image src="/divider.svg" alt="Section divider" width={1920} height={2} style={{ width: '100%', height: '2px' }} />

          <div className="mt-8 w-full max-w-md mx-auto">
            <Contact content={allSections.contact.content} />
          </div>
          
          <ScrollIndicator />
          <Image src="/divider.svg" alt="Section divider" width={1920} height={4} style={{ width: '100%', height: '4px' }} />
        </section>
      )
    }
    if (id === 'contact') {
      return (
        <section id={id} className={styles.section}>
          <Contact content={content} />
          <Image src="/divider.svg" alt="Section divider" width={1920} height={4} style={{ width: '100%', height: '4px' }} />
        </section>
      )
    }
    return (
      <section id={id} className={styles.section}>
        <div className="react-markdown">
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
        <Image src="/divider.svg" alt="Section divider" width={1920} height={4} style={{ width: '100%', height: '4px' }} />
      </section>
    )
  }, [renderCarousel]);

  const renderProjectSection = useCallback((name: string, content: string) => {
    const iconPath = `/projects/${name.toLowerCase().replace(' ', '')}.ico`;
    
    // Project-specific image arrays
    const projectImages: Record<string, { src: string, alt: string, type?: 'image' | 'spotify' }[]> = {
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
      'WhatNext': [
        { 
          src: 'https://open.spotify.com/embed/playlist/2kpswjk4hzWHQwpci2PUnc?utm_source=generator', 
          alt: 'WhatNext Playlist 1', 
          type: 'spotify' 
        },
        { 
          src: 'https://open.spotify.com/embed/playlist/6KgZCaJ94sVwCVZiOt1ToE?utm_source=generator', 
          alt: 'WhatNext Playlist 2', 
          type: 'spotify' 
        },
        { 
          src: 'https://open.spotify.com/embed/playlist/2oLS4kpcrgoA530LjNqH1V?utm_source=generator', 
          alt: 'WhatNext Playlist 3', 
          type: 'spotify' 
        },
        { 
          src: 'https://open.spotify.com/embed/playlist/72jl5AIRhXgX12Gbtkifw5?utm_source=generator', 
          alt: 'WhatNext Playlist 4', 
          type: 'spotify' 
        },
        { 
          src: 'https://open.spotify.com/embed/playlist/6FRUuTQFVtEQkECIqslQRS?utm_source=generator', 
          alt: 'WhatNext Playlist 5', 
          type: 'spotify' 
        },
        { 
          src: 'https://open.spotify.com/embed/playlist/2TGkrJ3ZuNWAzFiLq9z2JY?utm_source=generator', 
          alt: 'WhatNext Playlist 6', 
          type: 'spotify' 
        }
      ]
    };

    const renderCarouselContent = (items: typeof projectImages[keyof typeof projectImages], type: 'image' | 'spotify') => {
      const carouselOptions = {
        loop: true,
        align: "start" as const,
        slidesToScroll: 1,
        dragFree: false,
        ...(isMobile ? { 
          slidesToShow: 1,
          spacing: 10 
        } : {
          slidesToShow: type === 'spotify' ? 2 : 3,
          spacing: 20
        })
      };

      const carouselItemClass = `${isMobile ? 'basis-full' : type === 'spotify' ? 'basis-1/2' : 'basis-1/3'} flex justify-center pl-4`;

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
          >
            <CarouselContent className="flex -ml-4">
              {items.map((item, index) => (
                <CarouselItem key={`${type}-${item.src}-${index}`} className={carouselItemClass}>
                  {type === 'spotify' ? (
                    <div className="w-full cursor-grab active:cursor-grabbing">
                      <iframe 
                        style={{ borderRadius: '12px' }} 
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
                    <div className="cursor-pointer" onClick={() => handleImageClick(item.src, item.alt)}>
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
            <CarouselPrevious className="bg-primary text-primary-foreground border-border carousel-button" />
            <CarouselNext className="bg-primary text-primary-foreground border-border carousel-button" />
          </Carousel>
        </div>
      );
    };

    return (
      <section id={`projects-${name.toLowerCase()}`} className={styles.section}>
        <Image src="/divider.svg" alt="Section divider" width={1920} height={2} style={{ width: '100%', height: '4px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
          <div style={{ width: 64, height: 64, position: 'relative' }}>
            <Image 
              src={iconPath} 
              alt={`${name} icon`} 
              width={120}
              height={120}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h2>{name}</h2>
        </div>
        <div className="react-markdown" style={{ padding: '-1rem 0' }}>
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
        <Image src="/divider.svg" alt="Section divider" width={1920} height={2} style={{ width: '100%', height: '2px' }} />
        {projectImages[name]?.filter(item => item.type === 'image').length > 0 && (
          renderCarouselContent(projectImages[name].filter(item => item.type === 'image'), 'image')
        )}
        {projectImages[name]?.filter(item => item.type === 'spotify').length > 0 && (
          renderCarouselContent(projectImages[name].filter(item => item.type === 'spotify'), 'spotify')
        )}
      </section>
    )
  }, [isMobile, handleImageClick]);

  return (
    <div className={styles.container}>
      <Head>
        <title>mads</title>
        <meta name="description" content="Joseph Madigan's full-stack portfolio" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {/* Header ribbon */}
      <div style={{ width: '100%', height: '20px', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
        <Image src="/header.svg" alt="Header" width={1920} height={20} style={{ width: '100%', height: '20px' }} priority />
      </div>

      <AppSidebar />

      {/* Endless scroll sections */}
      <main className={styles.main}>
        {/* Main sections */}
        {renderSection(sections.home.content, "home", sections)}
        {renderSection(sections.about.content, "about")}
        
        {/* Projects section with nested sections */}
        <section id="projects" className={styles.section}>
          <ReactMarkdown>{sections.projects.content}</ReactMarkdown>
          {sections.projects.subSections && Object.entries(sections.projects.subSections).map(([name, content]) => (
            renderProjectSection(name, content)
          ))}
          <Image src="/divider.svg" alt="Section divider" width={1920} height={4} style={{ width: '100%', height: '2px' }} />
        </section>
      </main>

      {expandedImage && (
        <ImageModal
          src={expandedImage.src}
          alt={expandedImage.alt}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </div>
  );
};

export async function getStaticProps() {
  const sections = {
    home: await getMarkdownContent('home'),
    about: await getMarkdownContent('about'),
    projects: await getMarkdownContent('projects'),
    contact: await getMarkdownContent('contact'),
  }

  return {
    props: {
      sections,
    },
  }
}

export default Home
