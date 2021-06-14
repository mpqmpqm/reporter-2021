import { createContext, useContext, useEffect, useState } from "react"
import { useFirestore } from "../firebase/FirestoreContextProvider"

const boardSettingsContext = createContext()

export const BoardSettingsContextProvider = ({ children }) => {
  const { userDocumentStub, FieldValue } = useFirestore()

  const boardsReference = userDocumentStub?.append(`boards`)
  const selectedBoardReference = boardsReference?.append(`selected`)

  const updateBoardSelection = async (id) => {
    selectedBoardReference.close().set({ selected: id })
  }

  const addBoard = async (options) => {
    const newId = await boardsReference
      .close()
      .add({ ...options, createdAt: FieldValue.serverTimestamp() })
      .then((newDoc) => {
        updateBoardSelection(newDoc.id)
        return newDoc.id
      })
    return newId
  }

  const [availableBoards, setAvailableBoards] = useState([])

  // listen for updates to available boards
  useEffect(() => {
    let unsubscribe
    if (boardsReference) {
      unsubscribe = boardsReference
        .close()
        .orderBy(`createdAt`)
        .onSnapshot((collectionSnapshot) => {
          const boards = []
          collectionSnapshot.forEach((doc) =>
            boards.push({ id: doc.id, ...doc.data() })
          )
          setAvailableBoards(boards)
        })
    }
    return unsubscribe
  }, [userDocumentStub])

  return (
    <boardSettingsContext.Provider
      value={{ updateBoardSelection, availableBoards, addBoard }}
    >
      {children}
    </boardSettingsContext.Provider>
  )
}

export const useBoardSettings = () => useContext(boardSettingsContext)
