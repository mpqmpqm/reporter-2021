import React, { useEffect } from "react"
import { useAuth } from "../firebase/AuthContextProvider"
import { firebase } from "../firebase/firebaseClient"
import nookies from "nookies"

const login = () => {
  // const { user } = useAuth()

  const user = `test1@mpq.dev`
  const pw = `ecksdee`

  const createUser = async () => {
    await firebase.auth().createUserWithEmailAndPassword(user, pw)
    nookies.set(undefined, `firestoreNotInitialized`, "true", { path: `/` })
    nookies.set(undefined, `onboarded`, "false", { path: `/` })
    window.location.href = `/`
  }

  const signIn = async () => {
    await firebase.auth().signInWithEmailAndPassword(user, pw)
    window.location.href = `/`
  }

  // useEffect(() => {
  //   console.log(user)
  // }, [user])

  return (
    <div>
      Login, doy!
      <button onClick={createUser}>Create</button>
      <button onClick={signIn}>sign in</button>
    </div>
  )
}

export default login
