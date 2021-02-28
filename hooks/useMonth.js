import { useTodayDateString } from "../context/TodayDateStringContextProvider"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useState, useEffect } from "react"
import { startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns"
import { createDateString } from "../helper-fns/helper-fns"

const yearMonthDay = new RegExp(/\d{4}\/\d{2}\/\d{2}$/)

export const useMonth = (year, month, thisMonth = false) => {
  const { userDocumentStub } = useFirestore()
  const { selectedBoard } = useSelectedBoard()
  const { todayDateString } = useTodayDateString()
  const [monthData, setMonthData] = useState([])

  const monthCollectionStub =
    userDocumentStub &&
    selectedBoard &&
    userDocumentStub
      .append(`boards`)
      .append(selectedBoard)
      .append(`data`)
      .append(year)
      .append(month)

  useEffect(() => {
    const asyncHelper = async () => {
      if (monthCollectionStub) {
        const data = new Map()
        await monthCollectionStub
          .close()
          .orderBy(`createdAt`)
          .where(`createdAt`, `<`, new Date(todayDateString))
          .get()
          .then((collectionSnapshot) => {
            collectionSnapshot.forEach((doc) => {
              const date = doc.ref.path.match(yearMonthDay)[0]
              data.set(date, doc.data())
            })
          })

        const monthStart = startOfMonth(parseISO(`${year}-${month}`))
        const monthEnd = thisMonth
          ? parseISO(todayDateString.replace(/\//g, `-`))
          : endOfMonth(parseISO(`${year}-${month}`))
        const eachDay = eachDayOfInterval({
          start: monthStart,
          end: monthEnd,
        })
          .slice(0, -1)
          .map((date) => createDateString(date))
        const fullMonth = eachDay.map((date) => ({
          date,
          data: data.get(date) || null,
        }))
        setMonthData(fullMonth)
      }
    }
    asyncHelper()
  }, [userDocumentStub, selectedBoard, todayDateString])

  return { monthData }
}
