import Head from "next/head"
import { AuthContextProvider } from "../firebase/AuthContextProvider"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Reporter</title>
        <meta name="description" content="A protean quantified self app" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😘</text></svg>"
        />
        <meta
          name="og:image"
          content={`https://${pageProps.hostname}/static/reporter-meta.jpg`}
        />
        <meta name="og:description" content="A protean quantified self app" />
        <meta name="og:site_name" content="Reporter" />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="og:url" content={`https://${pageProps.hostname}`} />
        <meta name="og:title" content="Reporter" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`https://${pageProps.hostname}/static/apple-icon-57x57px.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`https://${pageProps.hostname}/static/apple-icon-72x72px.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`https://${pageProps.hostname}/static/apple-icon-114x114px.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`https://${pageProps.hostname}/static/apple-icon-144x144px.png`}
        />
      </Head>
      <div suppressHydrationWarning id="__app">
        {typeof window === `undefined` ? null : (
          <AuthContextProvider>
            <Component {...pageProps} />
          </AuthContextProvider>
        )}
      </div>
    </>
  )
}

export default MyApp
