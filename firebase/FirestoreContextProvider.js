import { createContext, useContext, useEffect, useState } from "react"
import { db, FieldValue } from "./firebaseClient"
import { useAuth } from "./AuthContextProvider"

const firestoreContext = createContext(null)

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
