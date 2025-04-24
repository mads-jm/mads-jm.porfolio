// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Discord Embed Tags */}
        <meta property="og:title" content="Joseph Madigan - Software Engineer" />
        <meta property="og:description" content="Former retail management professional turned software engineer. Explore my journey and projects." />
        <meta property="og:image" content="https://mads-jm-porfolio.vercel.app/favicon.ico" />
        <meta property="og:url" content="https://mads-jm-porfolio.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
