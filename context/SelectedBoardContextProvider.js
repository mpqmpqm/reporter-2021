import { createContext, useContext, useEffect, useState } from "react"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import { emojiColorDict, emojiFromSymbolsArray } from "../helper-fns/helper-fns"

const SelectedBoardContext = createContext(null)

export const SelectedBoardContextProvider = ({ children }) => {
  const { userDocumentStub } = useFirestore()

  const [selectedBoard, setSelectedBoard] = useState(null)

  // listen for updates to selected board
  useEffect(() => {
    let unsubscribe1
    let unsubscribe2
    if (userDocumentStub) {
      unsubscribe1 = userDocumentStub
        .append(`boards`)
        .append(`selected`)
        .close()
        .onSnapshot(async (doc) => {
          const id = await doc.data().selected
          // detach any listener on a previously selected board
          unsubscribe2 && unsubscribe2()
          // then update the context with the details of the selected board
          if (id) {
            unsubscribe2 = userDocumentStub
              .append(`boards`)
              .append(id)
              .close()
              .onSnapshot(async (doc) => {
                const selectedBoardDetails = await doc.data()
                setSelectedBoard({
                  id,
                  details: {
                    title: selectedBoardDetails.title,
                    emojiList: emojiFromSymbolsArray(
                      selectedBoardDetails.symbols
                    ),
                    colorDict: emojiColorDict(selectedBoardDetails.symbols),
                    ...selectedBoardDetails,
                  },
                })
              })
          } else {
            setSelectedBoard({ id: null })
          }
        })
    }
    return () => {
      unsubscribe1 && unsubscribe1()
      unsubscribe2 && unsubscribe2()
    }
  }, [userDocumentStub])

  return (
    <SelectedBoardContext.Provider value={{ selectedBoard }}>
      {children}
    </SelectedBoardContext.Provider>
  )
}

export const useSelectedBoard = () => useContext(SelectedBoardContext)
