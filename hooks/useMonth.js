import {
  eachDayOfInterval,
  lastDayOfMonth,
  parseISO,
  startOfMonth,
} from "date-fns"
import { useEffect, useState } from "react"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useTodayDateString } from "../context/TodayDateStringContextProvider"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import { createDateString } from "../helper-fns/helper-fns"

const yearMonthDay = new RegExp(/\d{4}\/\d{2}\/\d{2}$/)

export const useMonth = (year, month, thisMonth = false) => {
  const { userDocumentStub } = useFirestore()
  const { selectedBoard } = useSelectedBoard()
  const { todayDateString } = useTodayDateString()
  const [monthData, setMonthData] = useState(null)

  const monthCollectionStub =
    userDocumentStub &&
    selectedBoard &&
    userDocumentStub
      .append(`boards`)
      .append(selectedBoard.id)
      .append(`data`)
      .append(year)
      .append(month)

  useEffect(() => {
    const asyncHelper = async () => {
      if (monthCollectionStub) {
        const data = new Map()
        await monthCollectionStub
          .close()
          // .where(`createdAt`, `<`, new Date(todayDateString))
          // .get({ source: !thisMonth ? `cache` : `default` })
          .get()
          .then((collectionSnapshot) => {
            collectionSnapshot.forEach((doc) => {
              const date = doc.ref.path.match(yearMonthDay)[0]
              data.set(date, doc.data())
            })
          })
          .catch(async (err) => {
            console.log(err)
            await monthCollectionStub
              .close()
              .where(`createdAt`, `<`, new Date(todayDateString))
              .get()
              .then((collectionSnapshot) => {
                collectionSnapshot.forEach((doc) => {
                  const date = doc.ref.path.match(yearMonthDay)[0]
                  data.set(date, doc.data())
                })
              })
          })

        const monthStart = startOfMonth(parseISO(`${year}-${month}`))
        const monthEnd = thisMonth
          ? parseISO(todayDateString.replace(/\//g, `-`))
          : lastDayOfMonth(parseISO(`${year}-${month}`))

        const eachDay = eachDayOfInterval({
          start: monthStart,
          end: monthEnd,
        })
          .slice(0, thisMonth ? -1 : undefined)
          // .reverse()
          .map((date) => createDateString(date))

        const fullMonth = eachDay.map((date) => ({
          date,
          data: data.get(date) || null,
        }))
        setMonthData({ renderElements: fullMonth, dict: data })
      }
    }
    asyncHelper()
  }, [userDocumentStub, selectedBoard, todayDateString])

  return { monthData }
}
