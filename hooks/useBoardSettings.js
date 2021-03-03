import { useFirestore } from "../firebase/FirestoreContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useState, useEffect, createContext } from "react"

export const useBoardSettings = () => {
  const { userDocumentStub, FieldValue } = useFirestore()

  const boardsReference = userDocumentStub?.append(`boards`)
  const selectedBoardReference = boardsReference?.append(`selected`)

  const updateBoardSelection = (id) => {
    selectedBoardReference.close().set({ selected: id })
  }

  const addBoard = (options) => {
    boardsReference
      .close()
      .add({ ...options, createdAt: FieldValue.serverTimestamp() })
      .then((newDoc) => updateBoardSelection(newDoc.id))
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

  return {
    updateBoardSelection,
    availableBoards,
    addBoard,
  }
}
