import "../styles/globals.css"
import { AuthContextProvider } from "../firebase/AuthContextProvider"
import { FirestoreContextProvider } from "../firebase/FirestoreContextProvider"
import { SelectedBoardContextProvider } from "../context/SelectedBoardContextProvider"
import { TodayDateStringContextProvider } from "../context/TodayDateStringContextProvider"
import { TodayContextProvider } from "../context/TodayContextProvider"

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
