import { format } from "date-fns"
import { Fragment } from "react"
import { Redirect, useLocation } from "react-router-dom"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import { useTodayDateString } from "../context/TodayDateStringContextProvider"
import { stripCreatedAt } from "../helper-fns/helper-fns"
import DayReceiver from "./DayReceiver"
import { SymbolColorPair } from "./Legend"
import PageOverlay from "./ModalGenerics"

const DayOverlayReceiver = ({ monthDict }) => {
  const { todayDateString } = useTodayDateString()
  const { pathname } = useLocation()
  const {
    selectedBoard: {
      details: { emojiList, colorDict },
    },
  } = useSelectedBoard()

  const dateString = pathname.replace(`/calendar/`, ``)

  const isToday = todayDateString === dateString

  return isToday ? (
    <TodayOverlayReceiver {...{ emojiList, colorDict, dateString }} />
  ) : monthDict.get(dateString) ? (
    <DayOverlay
      {...{ emojiList, colorDict, dateString }}
      reports={stripCreatedAt(monthDict.get(dateString))}
    />
  ) : (
    <Redirect to="/calendar" />
  )
}

const TodayOverlayReceiver = ({ emojiList, colorDict, dateString }) => {
  const { todayData } = useToday()
  return (
    <DayOverlay
      {...{ emojiList, colorDict, dateString }}
      reports={todayData && stripCreatedAt(todayData)}
    />
  )
}

const DayOverlay = ({ emojiList, colorDict, dateString, reports }) => {
  const [year, month, day] = dateString.split(`/`)
  return (
    <PageOverlay origin="/calendar">
      {reports ? (
        <div className="day-overlay-data">
          <h4 className="day-overlay-date">
            {format(new Date(dateString), `MMMM d, yyyy`)}
          </h4>
          <div className="day-overlay-svg-container">
            <DayReceiver
              data={reports}
              {...{ emojiList, colorDict, calendar: true, year, month, day }}
            />
          </div>
          <p className="total-reports-intro-text">Total reports:</p>
          <div className="symbols-colors-counts">
            {emojiList.map((emoji, i) => (
              <Fragment key={emoji}>
                <SymbolColorPair emoji={emoji} color={colorDict[emoji]} />
                <p>{reports[emoji] || 0}</p>
              </Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div>...</div>
      )}
    </PageOverlay>
  )
}

export default DayOverlayReceiver
