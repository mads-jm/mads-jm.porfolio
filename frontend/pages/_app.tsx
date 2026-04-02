// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import { SidebarProvider } from "@/components/ui/sidebar"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SidebarProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Discord Embed Tags */}
        <meta property="og:title" content="Joseph Madigan - Software Engineer" />
        <meta property="og:description" content="Former retail management professional turned software engineer. Explore my journey and projects." />
        <meta property="og:url" content="https://mads-jm.github.io/" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </SidebarProvider>
  )
}
