import { BrowserRouter, Link, Route } from "react-router-dom"
import Data from "../views/Data"
import Settings from "../views/Settings"
import { useAuth } from "../firebase/AuthContextProvider"
import { firebase } from "../firebase/firebaseClient"
import { useMonth } from "../hooks/useMonth"

export default function Home(props) {
  const signOut = async () => {
    firebase.auth().signOut()
    window.location.href = `/`
  }

  const { user } = useAuth()
  const { monthData } = useMonth(`2021`, `02`, true)

  return user ? (
    <BrowserRouter>
      <Link to="/settings">settings</Link>
      <Link to="/data">data</Link>

      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/data">
        <Data />
      </Route>

      {/* <div>
        {props.email}
        {props.uid}
        <button onClick={signOut}>Sign out</button>
      </div> */}
    </BrowserRouter>
  ) : (
    <div>...</div>
  )
}

// export const getServerSideProps = async (ctx) => {
//   try {
//     const cookies = nookies.get(ctx)
//     const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)

//     const { uid, email } = token

//     return {
//       props: {
//         uid,
//         email,
//         token,
//       },
//     }
//   } catch (err) {
//     ctx.res.writeHead(302, { Location: `/login` })
//     ctx.res.end()
//     return {
//       props: {
//         error: `:(`,
//       },
//     }
//   }
// }
