import React, { useState, useEffect, useContext, createContext } from "react"
import { firebase } from "./firebaseClient"
import nookies from "nookies"

const AuthContext = createContext({
  user: null,
})

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(
      () => setUser({ uid: `80t5YySrAPRTA1iHlUOEjl138gG2` }),
      600
    )
    return () => {
      timeout
    }
  }, [])

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
