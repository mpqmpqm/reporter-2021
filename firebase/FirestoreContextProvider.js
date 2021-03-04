import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContextProvider"
import { db, FieldValue } from "./firebaseClient"

const firestoreContext = createContext(null)

const dev = process.env.NODE_ENV === `development`

const FirestorePath = (pathString) => ({
  append: (appendString) => FirestorePath(`${pathString}/${appendString}`),
  close: () =>
    pathString.match(/\//g).length % 2
      ? db.doc(pathString)
      : db.collection(pathString),
  inspect: () => console.log(pathString),
})

const populateEmulator = (user) => async () => {
  const randomNumber = () => Math.round(Math.random() * 5)

  const firstBoard = await FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .close()
    .add({
      createdAt: new Date("January 1, 2021 09:00:00"),
      title: `Mood`,
      symbols: [`😔`, `😘`],
    })
    .then((createdDoc) => createdDoc.id)
  await FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .append(`selected`)
    .close()
    .set({ selected: firstBoard })
  const firstBoardStub = FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .append(firstBoard)
    .append(`data`)

  const docs = []

  for (let i = 1; i <= 31; i++) {
    if (Math.random() > 0.3)
      docs.push(
        firstBoardStub
          .append(`2021`)
          .append(`01`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`January ${i}, 2021 9:00:00`),
            "😔": randomNumber(),
            "😘": randomNumber(),
          })
      )
  }

  for (let i = 1; i <= 28; i++) {
    if (Math.random() > 0.3)
      docs.push(
        firstBoardStub
          .append(`2021`)
          .append(`02`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`February ${i}, 2021 9:00:00`),
            "😔": randomNumber(),
            "😘": randomNumber(),
          })
      )
  }

  const secondBoard = await FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .close()
    .add({
      createdAt: new Date("January 1, 2021 09:00:00"),
      title: `Ecks dee`,
      symbols: [`🚶‍♀️`],
    })
    .then((createdDoc) => createdDoc.id)

  const secondBoardStub = FirestorePath(`users`)
    .append(user.uid)
    .append(`boards`)
    .append(secondBoard)
    .append(`data`)

  for (let i = 1; i <= 31; i++) {
    if (Math.random() > 0.2)
      docs.push(
        secondBoardStub
          .append(`2021`)
          .append(`01`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`January ${i}, 2021 9:00:00`),
            "🚶‍♀️": 1,
          })
      )
  }

  for (let i = 1; i <= 28; i++) {
    if (Math.random() > 0.2)
      docs.push(
        secondBoardStub
          .append(`2021`)
          .append(`02`)
          .append(String(i).padStart(2, `0`))
          .close()
          .set({
            createdAt: new Date(`February ${i}, 2021 9:01:00`),
            "🚶‍♀️": 1,
          })
      )
  }

  await Promise.all(docs)
}

export const FirestoreContextProvider = ({ children }) => {
  const { user } = useAuth()
  const [userDocumentStub, setUserDocumentStub] = useState(null)

  useEffect(() => {
    user && setUserDocumentStub(FirestorePath(`users`).append(user.uid))
  }, [user])

  useEffect(() => {
    if (dev) window.populate = populateEmulator(user)
  }, [])

  return (
    <firestoreContext.Provider
      value={{
        userDocumentStub,
        FieldValue,
        db,
      }}
    >
      {children}
    </firestoreContext.Provider>
  )
}

export const useFirestore = () => useContext(firestoreContext)
