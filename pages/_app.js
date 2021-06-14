import Head from "next/head"
import { AuthContextProvider } from "../firebase/AuthContextProvider"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Reporter</title>
        <meta name="description" content="Reporter" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😘</text></svg>"
        />
        <meta
          name="og:image"
          content={`https://${pageProps.hostname}/reporter-meta.jpg`}
        />
        <meta name="og:description" content="Reporter" />
        <meta name="og:site_name" content="Reporter" />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="og:url" content={`https://${pageProps.hostname}`} />
        <meta name="og:title" content="Reporter" />
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
