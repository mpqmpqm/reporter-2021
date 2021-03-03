import nookies from "nookies"
import { Route, Switch } from "react-router-dom"
import { NavBar } from "../components/Navigation"
import AppContextProvider from "../context/AppContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useAuth } from "../firebase/AuthContextProvider"
import Data from "../views/Data"
import Settings from "../views/Settings"
import Vote from "../views/Vote"
import { firebaseAdmin } from "../firebase/firebaseAdmin"

export default function Home({ onboarded }) {
  return (
    <AppContextProvider>
      <App {...{ onboarded }} />
    </AppContextProvider>
  )
}

const App = ({ onboarded }) => {
  const { user } = useAuth()
  const { selectedBoard } = useSelectedBoard()

  return (
    <div className="App">
      {user && selectedBoard ? (
        <Switch>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/calendar">
            <Data />
          </Route>
          <Route path="/">
            <Vote />
          </Route>
        </Switch>
      ) : (
        <div>...</div>
      )}
      <NavBar />
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  let cookies
  let token
  try {
    cookies = nookies.get(ctx)
    token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
  } catch (err) {
    console.error(err)
    ctx.res.writeHead(302, { Location: `/login` })
    ctx.res.end()
    return { props: {} }
  }
  try {
    if (cookies.firestoreNotInitialized) {
      const db = firebaseAdmin.firestore()
      const createdDoc = await db
        .collection(`users`)
        .doc(token.uid)
        .collection(`boards`)
        .add({
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          title: `Mood`,
          symbols: [`😔`, `😘`],
        })
        .then((createdDoc) => createdDoc.id)

      createdDoc &&
        (await db
          .collection(`users`)
          .doc(token.uid)
          .collection(`boards`)
          .doc(`selected`)
          .set({
            selected: createdDoc,
          }))

      nookies.destroy(ctx, `firestoreNotInitialized`)
    }
    return { props: { onboarded: cookies.onboarded || true } }
  } catch (err) {
    console.error(err)
    ctx.res.writeHead(302, { Location: `/failed-onboarding` })
    ctx.res.end()
    return { props: {} }
  }
}
