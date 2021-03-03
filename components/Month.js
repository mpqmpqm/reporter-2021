import React from "react"
import { useMonth } from "../hooks/useMonth"
import { useToday } from "../context/TodayContextProvider"
import { monthDict } from "../helper-fns/dictionaries"
import DayReceiver from "./DayReceiver"

export const Month = ({
  year,
  month,
  thisMonth,
  todayData,
  todayDateString,
  symbols,
}) => {
  const { monthData } = useMonth(year, month, thisMonth)

  const startDay = monthData?.length
    ? new Date(monthData[0].date).getDay()
    : new Date(todayDateString).getDay()
  const thisYear = new Date().getFullYear() === year

  return (
    monthData && (
      <>
        <h3>
          {monthDict[month]}
          {!thisYear && ` ${year}`}
        </h3>
        <div style={{ display: `grid`, gridTemplateColumns: `repeat(7, 1fr)` }}>
          {monthData.map(({ date, data }, i) => (
            <DayReceiver
              day={date.slice(8)}
              {...{ year, month, symbols }}
              data={data}
              startOfMonth={i === 0 && startDay}
              key={date}
            />
          ))}
          {todayData && (
            <DayReceiver
              day={todayDateString.slice(8)}
              {...{ year, month, symbols }}
              data={todayData}
              startOfMonth={monthData.length === 0 && startDay}
            />
          )}
        </div>
      </>
    )
  )
}

export const ThisMonth = ({ symbols }) => {
  const { todayData, todayDateString } = useToday()
  const year = todayDateString.slice(0, 4)
  const month = todayDateString.slice(5, 7)

  return (
    <Month
      year={year}
      month={month}
      thisMonth
      {...{ todayData, todayDateString, symbols }}
    />
  )
}
