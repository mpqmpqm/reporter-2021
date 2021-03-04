import { createContext, useContext, useEffect, useState } from "react"
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
        .onSnapshot(async (doc) => {
          const id = await doc.data().selected
          // then update the context with the details of the selected board
          const selectedBoardDetails = await userDocumentStub
            .append(`boards`)
            .append(id)
            .close()
            .get()
            .then((doc) => doc.data())
          setSelectedBoard({ id, details: selectedBoardDetails })
        })
    }
    return unsubscribe
  }, [userDocumentStub])

  return (
    <SelectedBoardContext.Provider value={{ selectedBoard }}>
      {children}
    </SelectedBoardContext.Provider>
  )
}

export const useSelectedBoard = () => useContext(SelectedBoardContext)
