import nookies from "nookies"
import { createContext, useContext, useEffect, useState } from "react"
import { firebase } from "./firebaseClient"

const AuthContext = createContext({
  user: null,
})

const dev = process.env.NODE_ENV === `development`

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    dev ? { uid: `80t5YySrAPRTA1iHlUOEjl138gG2` } : null
  )

  // useEffect(() => {
  //   return firebase.auth().onIdTokenChanged(async (user) => {
  //     if (!user) {
  //       setUser(null)
  //       nookies.set(undefined, `token`, ``, { path: `/` })
  //     } else {
  //       const token = await user.getIdToken()
  //       setUser(user)
  //       nookies.set(undefined, `token`, token, { path: `/` })
  //     }
  //   })
  // }, [])

  // useEffect(() => {
  //   const handle = setInterval(async () => {
  //     const user = firebase.auth().currentUser
  //     if (user) await user.getIdToken(true)
  //   }, 10 * 60 * 1000)

  //   return () => clearInterval(handle)
  // }, [])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
