import nookies from "nookies"
import { useState } from "react"
import { firebaseAdmin } from "../firebase/firebaseAdmin"
import { Login, SignUp } from "../views/Login"
import Head from "next/head"

const login = ({ hostname }) => {
  const [isLoginFlow, setIsLoginFlow] = useState(true)

  const handleSwitch = () => {
    setIsLoginFlow(!isLoginFlow)
  }

  return (
    <>
      <Head>
        <title>Reporter | {isLoginFlow ? `Sign in` : `Sign up`}</title>
        <meta name="og:title">
          Reporter | {isLoginFlow ? `Sign in` : `Sign up`}
        </meta>
        <meta name="description" content="Welcome to Reporter" />
        <meta name="og:description" content="Welcome to Reporter" />
        <meta name="og:site_name" content="Reporter" />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="og:url" content={`https://${hostname}`} />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😘</text></svg>"
        />
        <meta
          name="og:image"
          content={`https://${hostname}/reporter-meta.jpg`}
        />
      </Head>
      <div>
        {isLoginFlow ? (
          <Login>
            <div className="switch">
              <p>New to Reporter?</p>
              <button onClick={handleSwitch}>Sign up</button>
            </div>
          </Login>
        ) : (
          <SignUp>
            <div className="switch">
              <p>Returning?</p>
              <button onClick={handleSwitch}>Sign in</button>
            </div>
          </SignUp>
        )}
      </div>
    </>
  )
}

export default login

export const getServerSideProps = async (ctx) => {
  const hostname = ctx.req.headers.host
  try {
    const cookies = nookies.get(ctx)
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
    return { redirect: { destination: `/`, permanent: false } }
  } catch (err) {
    console.error(err)
    return { props: { hostname } }
  }
}
