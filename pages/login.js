import React, { useEffect } from "react"
import { useAuth } from "../firebase/AuthContextProvider"
import { firebase } from "../firebase/firebaseClient"

const login = () => {
  // const { user } = useAuth()

  const signIn = async () => {
    await firebase.auth().signInWithEmailAndPassword(`test@mpq.dev`, `ecksdee`)
    window.location.href = `/`
  }

  // useEffect(() => {
  //   console.log(user)
  // }, [user])

  return (
    <div>
      Login, doy!
      <button onClick={signIn}>Sign in</button>
    </div>
  )
}

export default login
