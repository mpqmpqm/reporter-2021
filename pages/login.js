import nookies from "nookies"
import { useState } from "react"
import { firebaseAdmin } from "../firebase/firebaseAdmin"
import { Login, SignUp } from "../views/Login"

const login = () => {
  const [isLoginFlow, setIsLoginFlow] = useState(true)

  const handleSwitch = () => {
    setIsLoginFlow(!isLoginFlow)
  }

  return isLoginFlow ? (
    <div>
      <Login>
        <div className="switch">
          <p>New to Reporter?</p>
          <button onClick={handleSwitch}>Sign up</button>
        </div>
      </Login>
    </div>
  ) : (
    <div>
      <SignUp>
        <div className="switch">
          <p>Returning?</p>
          <button onClick={handleSwitch}>Sign in</button>
        </div>
      </SignUp>
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
