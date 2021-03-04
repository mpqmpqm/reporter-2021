import { endOfMonth, isBefore, subMonths } from "date-fns"

export const createDateString = (date) => {
  const padStart = (n) => String(n).padStart(2, `0`)
  return `${date.getFullYear()}/${padStart(date.getMonth() + 1)}/${padStart(
    date.getDate()
  )}`
}

export const getMonthBefore = ({ date }) => {
  const monthBefore = subMonths(date, 1)
  const string = createDateString(monthBefore).slice(0, 7)
  return {
    date: monthBefore,
    year: string.slice(0, 4),
    month: string.slice(5, 7),
  }
}

export const isEndOfMonthBeforeCreatedAt = ({ date, createdAt }) => {
  const monthEnd = endOfMonth(date)
  const createdAtAsDate = new Date(createdAt.seconds * 1000)
  return isBefore(monthEnd, createdAtAsDate)
}
