import Head from "next/head"
import nookies from "nookies"
import { Route, Switch } from "react-router-dom"
import { NavBar } from "../components/Navigation"
import AppContextProvider from "../context/AppContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useAuth } from "../firebase/AuthContextProvider"
import { firebaseAdmin } from "../firebase/firebaseAdmin"
import { colorOptions } from "../helper-fns/dictionaries"
import Calendar from "../views/Calendar"
import CalendarEmpty from "../views/CalendarEmpty"
import DemoForm from "../views/DemoForm"
import Loading from "../views/Loading"
import Settings from "../views/Settings"
import Vote from "../views/Vote"
import VoteEmpty from "../views/VoteEmpty"

const dev = process.env.NODE_ENV === `development`

export default function Home({ onboarded, hostname }) {
  return (
    <AppContextProvider>
      <App {...{ onboarded, hostname }} />
    </AppContextProvider>
  )
}

const App = ({ onboarded }) => {
  const { user } = useAuth()
  const { selectedBoard } = useSelectedBoard()

  return (
    <>
      <div className="App">
        {user && selectedBoard ? (
          selectedBoard.id ? (
            <Switch>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/calendar">
                <Calendar />
              </Route>
              {dev && (
                <Route path="/demo">
                  <DemoForm />
                </Route>
              )}
              <Route path="/">
                <Vote />
              </Route>
            </Switch>
          ) : (
            <Switch>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/calendar">
                <CalendarEmpty />
              </Route>
              <Route path="/">
                <VoteEmpty />
              </Route>
            </Switch>
          )
        ) : (
          <Loading />
        )}
        <NavBar />
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const hostname = ctx.req.headers.host
  let cookies
  let token
  try {
    cookies = nookies.get(ctx)
    token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
  } catch (err) {
    console.error(err)
    return { redirect: { destination: `/login`, permanent: false } }
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
          symbols: [
            { emoji: `🙃`, color: colorOptions[0] },
            { emoji: `😘`, color: colorOptions[1] },
          ],
          binary: false,
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
    return { props: { onboarded: cookies.onboarded || true, hostname } }
  } catch (err) {
    console.error(err)
    return { redirect: { destination: `/failed-onboarding`, permanent: false } }
  }
}
