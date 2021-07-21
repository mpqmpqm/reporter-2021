import { Link, Redirect, Route, useLocation } from "react-router-dom"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import { monthDict } from "../helper-fns/dictionaries"
import { useMonth } from "../hooks/useMonth"
import DayOverlayReceiver from "./DayOverlay"
import DayReceiver from "./DayReceiver"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import styled from "styled-components"

const MonthContainer = styled.div`
  margin-bottom: 1em;

  &:last-child {
    margin-bottom: 64px;
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 6px;
    text-align: right;
  }
`

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

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
      <MonthContainer>
        <h3>
          {monthDict[month]}
          {!thisYear && ` `}
        </h3>
        <MonthGrid>
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
        </MonthGrid>
        <AnimatePresence>
          <Route path={`/calendar/${year}/${month}/:day`}>
            <DayOverlayReceiver monthDict={monthData.dict} />
          </Route>
        </AnimatePresence>
      </MonthContainer>
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
