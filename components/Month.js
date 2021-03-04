import { Link, Redirect, Route, useLocation } from "react-router-dom"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import { useTodayDateString } from "../context/TodayDateStringContextProvider"
import { monthDict } from "../helper-fns/dictionaries"
import { useMonth } from "../hooks/useMonth"
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

  const startDay = monthData?.renderElements.length
    ? new Date(monthData.renderElements[0].date).getDay()
    : new Date(todayDateString).getDay()
  const thisYear = new Date().getFullYear() == year

  return (
    monthData && (
      <div className="month">
        <h3>
          {monthDict[month]}
          {!thisYear && ` ${year}`}
        </h3>
        <div className="month-grid">
          {monthData.renderElements.map(({ date, data }, i) => (
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
        <Route path={`/calendar/${year}/${month}/:day`}>
          <DayOverlayReceiver monthDict={monthData.dict} />
        </Route>
      </div>
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

const DayOverlayReceiver = ({ monthDict }) => {
  const { todayDateString } = useTodayDateString()
  const { pathname } = useLocation()
  const {
    selectedBoard: {
      details: { symbols },
    },
  } = useSelectedBoard()

  const dateString = pathname.replace(`/calendar/`, ``)

  const isToday = todayDateString === dateString

  return isToday ? (
    <TodayOverlayReceiver {...{ symbols, dateString }} />
  ) : monthDict.get(dateString) ? (
    <DayOverlay
      {...{ symbols, dateString }}
      reports={monthDict.get(dateString)}
    />
  ) : (
    <Redirect to="/calendar" />
  )
}

const TodayOverlayReceiver = ({ symbols, dateString }) => {
  const { todayData } = useToday()
  return (
    <DayOverlay
      {...{ symbols, dateString }}
      reports={
        todayData &&
        (({ createdAt, ...props }) =>
          Object.keys(props).length
            ? {
                ...props,
              }
            : null)(todayData)
      }
    />
  )
}

const DayOverlay = ({ symbols, dateString, reports }) => {
  console.log(reports, dateString)
  return (
    <div className="day-overlay">
      <Link to="/calendar">Dismiss</Link>
      {symbols.map((s) => (
        <div key={s}>{s}</div>
      ))}
    </div>
  )
}
