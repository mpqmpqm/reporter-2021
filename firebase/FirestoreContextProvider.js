import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContextProvider"
import { db, FieldValue } from "./firebaseClient"

const firestoreContext = createContext(null)

// const dev = process.env.NODE_ENV === `development`

const FirestorePath = (pathString) => ({
  append: (appendString) => FirestorePath(`${pathString}/${appendString}`),
  close: () =>
    pathString.match(/\//g).length % 2
      ? db.doc(pathString)
      : db.collection(pathString),
  inspect: () => console.log(pathString),
})

export const FirestoreContextProvider = ({ children }) => {
  const { user } = useAuth()
  const [userDocumentStub, setUserDocumentStub] = useState(null)

  useEffect(() => {
    user && setUserDocumentStub(FirestorePath(`users`).append(user.uid))
  }, [user])

  // useEffect(() => {
  //   if (dev) window.populate = populateEmulator(user)
  // }, [])

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
