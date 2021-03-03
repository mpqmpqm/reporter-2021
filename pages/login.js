import React, { useEffect, useState } from "react"
import { useAuth } from "../firebase/AuthContextProvider"
import { firebase } from "../firebase/firebaseClient"
import nookies from "nookies"
import { firebaseAdmin } from "../firebase/firebaseAdmin"
import { SignUp, Login } from "../views/Login"

const login = () => {
  const [isLoginFlow, setIsLoginFlow] = useState(true)

  const handleSwitch = () => {
    setIsLoginFlow(!isLoginFlow)
  }

  return isLoginFlow ? (
    <div>
      <Login />
      <button onClick={handleSwitch}>Sign up &rarr;</button>
    </div>
  ) : (
    <div>
      <SignUp />
      <button onClick={handleSwitch}>Sign in &rarr;</button>
    </div>
  )
}

export default login

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx)
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
    ctx.res.writeHead(302, { Location: `/` })
    ctx.res.end()
    return { props: {} }
  } catch (err) {
    console.error(err)
    return { props: {} }
  }
}
