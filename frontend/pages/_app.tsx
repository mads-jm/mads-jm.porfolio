// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
        <link rel="icon" href="/favicon.ico" />
        {/* Site-wide share defaults — per-page SiteLayout overrides these. */}
        <meta property="og:site_name" content="mads" />
        <meta property="og:title" content="mads | systems & tools craftsperson" />
        <meta property="og:description" content="I build local-first software: terminal UIs, peer-to-peer systems, and developer tools, mostly in Rust." />
        <meta property="og:url" content="https://home.madigan.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://home.madigan.app/header.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
