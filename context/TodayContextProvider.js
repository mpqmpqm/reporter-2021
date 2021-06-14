import { createContext, useContext, useEffect, useState } from "react"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import { useSelectedBoard } from "./SelectedBoardContextProvider"
import { useTodayDateString } from "./TodayDateStringContextProvider"

const TodayContext = createContext()

export const TodayContextProvider = ({ children }) => {
  const { userDocumentStub, FieldValue, db } = useFirestore()
  const { selectedBoard } = useSelectedBoard()
  const { todayDateString } = useTodayDateString()

  const [todayData, setTodayData] = useState({})

  const todayDocumentStub =
    userDocumentStub &&
    selectedBoard?.id &&
    todayDateString &&
    userDocumentStub
      .append(`boards`)
      .append(selectedBoard.id)
      .append(`data`)
      .append(todayDateString)

  //listen for changes on today's data document
  useEffect(() => {
    let unsubscribe
    const asyncHelper = async () => {
      if (todayDocumentStub) {
        // make sure today's doc exists for this user for this board
        const { symbols } = selectedBoard.details
        await todayDocumentStub
          .close()
          .get()
          .then(async (doc) => {
            if (!doc.exists) {
              await todayDocumentStub.close().set({
                createdAt: FieldValue.serverTimestamp(),
                ...symbols.reduce((object, symbol) => {
                  object[symbol] = 0
                  return object
                }, {}),
              })
            }
          })
        // then subscribe
        unsubscribe = todayDocumentStub
          .close()
          .onSnapshot((doc) => setTodayData(doc.data()))
      }
    }
    asyncHelper()
    return unsubscribe
  }, [userDocumentStub, selectedBoard, todayDateString])

  const sendReport = (field) => {
    todayDocumentStub.close().update({
      [field]: FieldValue.increment(1),
    })
  }

  return (
    <TodayContext.Provider value={{ todayData, sendReport, todayDateString }}>
      {children}
    </TodayContext.Provider>
  )
}

export const useToday = () => useContext(TodayContext)
