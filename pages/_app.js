import { AuthContextProvider } from "../firebase/AuthContextProvider"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <div suppressHydrationWarning id="__app">
      {typeof window === `undefined` ? null : (
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      )}
    </div>
  )
}

export default MyApp
