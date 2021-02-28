import { createContext, useState, useEffect, useContext } from "react"
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
    selectedBoard &&
    todayDateString &&
    userDocumentStub
      .append(`boards`)
      .append(selectedBoard)
      .append(`data`)
      .append(todayDateString)

  //listen for changes on today's data document
  useEffect(() => {
    let unsubscribe
    const asyncHelper = async () => {
      if (todayDocumentStub) {
        // make sure today's doc exists for this user for this board
        await db.runTransaction(async (transaction) => {
          await transaction.get(todayDocumentStub.close()).then(async (doc) => {
            if (!doc.exists) {
              const symbols = await transaction
                .get(
                  userDocumentStub
                    .append(`boards`)
                    .append(selectedBoard)
                    .close()
                )
                .then((doc) => doc.data().symbols)

              await transaction.set(todayDocumentStub.close(), {
                createdAt: FieldValue.serverTimestamp(),
                ...symbols.reduce((object, symbol) => {
                  object[symbol] = 0
                  return object
                }, {}),
              })
            }
          })
        })
        // then subscribe
        todayDocumentStub.close().onSnapshot((doc) => setTodayData(doc.data()))
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
