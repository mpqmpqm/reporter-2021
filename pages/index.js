import { BrowserRouter, Link, Route } from "react-router-dom"
import Data from "../views/Data"
import Settings from "../views/Settings"
import PopulateBoard from "../dev/PopulateBoard"
import { useAuth } from "../firebase/AuthContextProvider"
import { firebase } from "../firebase/firebaseClient"
import { firebaseAdmin } from "../firebase/firebaseAdmin"

import { useMonth } from "../hooks/useMonth"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import Vote from "../views/Vote"
import nookies from "nookies"
import Login from "../views/Login"
import { FirestoreContextProvider } from "../firebase/FirestoreContextProvider"
import { SelectedBoardContextProvider } from "../context/SelectedBoardContextProvider"
import { TodayDateStringContextProvider } from "../context/TodayDateStringContextProvider"
import { TodayContextProvider } from "../context/TodayContextProvider"

const Wrappers = ({ children }) => {
  return (
    <FirestoreContextProvider>
      <SelectedBoardContextProvider>
        <TodayDateStringContextProvider>
          <TodayContextProvider>{children}</TodayContextProvider>
        </TodayDateStringContextProvider>
      </SelectedBoardContextProvider>
    </FirestoreContextProvider>
  )
}

export default function App(props) {
  return (
    <Wrappers>
      <Home />
    </Wrappers>
  )
}

const Home = (props) => {
  const signOut = async () => {
    firebase.auth().signOut()
    window.location.href = `/`
  }

  const { user } = useAuth()
  const { selectedBoard } = useSelectedBoard()

  return (
    <Wrappers>
      <BrowserRouter>
        <nav>
          {user && selectedBoard ? (
            <>
              <Link to="/settings">settings</Link>
              <Link to="/data">data</Link>
              <Link to="/test">test</Link>
              <Link to="/vote">vote</Link>
            </>
          ) : (
            <Link to="/login-dev">login</Link>
          )}
        </nav>
        {user && selectedBoard ? (
          <>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/data">
              <Data />
            </Route>
            <Route path="/test">
              <PopulateBoard />
            </Route>
            <Route path="/vote">
              <Vote />
            </Route>
          </>
        ) : (
          <Route path="/login-dev">
            <Login />
          </Route>
        )}
      </BrowserRouter>
    </Wrappers>
  )
}

export const getServerSideProps = async (ctx) => {
  let cookies
  let token
  try {
    cookies = nookies.get(ctx)
    token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
    if (!token) throw new Error()
  } catch (err) {
    console.error(err)
    ctx.res.writeHead(302, { Location: `/login` })
    ctx.res.end()
    return { props: {} }
  }
  try {
    if (cookies.newUser) {
      const db = firebaseAdmin.firestore()
      const createdDoc = await db
        .collection(`users`)
        .doc(token.uid)
        .collection(`boards`)
        .add({
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          title: `Mood`,
          symbols: [`😘`, `😔`],
        })
        .then((createdDoc) => createdDoc.id)
        .catch((err) => {
          throw new Error(err)
        })

      createdDoc &&
        (await db
          .collection(`users`)
          .doc(token.uid)
          .collection(`boards`)
          .doc(`selected`)
          .set({
            selected: createdDoc,
          }))

      nookies.destroy(ctx, `newUser`)
    }
    return { props: {} }
  } catch (err) {
    console.error(err)
    ctx.res.writeHead(302, { Location: `/failed-onboarding` })
    ctx.res.end()
    return { props: {} }
  }
}
