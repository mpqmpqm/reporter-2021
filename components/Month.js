import { Link, Redirect, Route, useLocation } from "react-router-dom"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import { monthDict } from "../helper-fns/dictionaries"
import { useMonth } from "../hooks/useMonth"
import DayOverlayReceiver from "./DayOverlay"
import DayReceiver from "./DayReceiver"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"

export const Month = ({
  year,
  month,
  thisMonth,
  todayData,
  todayDateString,
  emojiList,
  colorDict,
  binary,
}) => {
  const { monthData } = useMonth(year, month, thisMonth)

  const startDay = monthData?.renderElements.length
    ? new Date(monthData.renderElements[0].date).getDay()
    : new Date(todayDateString).getDay()
  const thisYear = new Date().getFullYear() == year

  return (
    monthData && (
      <div className="month">
        <h3>
          {monthDict[month]}
          {!thisYear && ` `}
        </h3>
        <div className="month-grid">
          {monthData.renderElements.map(({ date, data }, i) => (
            <DayReceiver
              day={date.slice(8)}
              {...{ year, month, emojiList, colorDict, binary }}
              data={data}
              startOfMonth={i === 0 && startDay}
              key={date}
              calendar={true}
            />
          ))}
          {todayData && (
            <DayReceiver
              day={todayDateString.slice(8)}
              {...{ year, month, emojiList, colorDict, binary }}
              data={todayData}
              startOfMonth={monthData.length === 0 && startDay}
              calendar={true}
            />
          )}
        </div>
        <AnimatePresence>
          <Route path={`/calendar/${year}/${month}/:day`}>
            <DayOverlayReceiver monthDict={monthData.dict} />
          </Route>
        </AnimatePresence>
      </div>
    )
  )
}

export const ThisMonth = ({ emojiList, colorDict, binary }) => {
  const { todayData, todayDateString } = useToday()
  const year = todayDateString.slice(0, 4)
  const month = todayDateString.slice(5, 7)

  return (
    <Month
      year={year}
      month={month}
      thisMonth
      {...{ todayData, todayDateString, emojiList, colorDict, binary }}
    />
  )
}
