import React, { createContext, useState, useEffect, useContext } from "react"
import { useFirestore } from "../firebase/FirestoreContextProvider"

const SelectedBoardContext = createContext(null)

export const SelectedBoardContextProvider = ({ children }) => {
  const { userDocumentStub } = useFirestore()

  const [selectedBoard, setSelectedBoard] = useState(null)

  // listen for updates to selected board
  useEffect(() => {
    let unsubscribe
    if (userDocumentStub) {
      unsubscribe = userDocumentStub
        .append(`boards`)
        .append(`selected`)
        .close()
        .onSnapshot((doc) => setSelectedBoard(doc.data().selected))
    }
  }, [userDocumentStub])

  return (
    <SelectedBoardContext.Provider value={{ selectedBoard }}>
      {children}
    </SelectedBoardContext.Provider>
  )
}

export const useSelectedBoard = () => useContext(SelectedBoardContext)
