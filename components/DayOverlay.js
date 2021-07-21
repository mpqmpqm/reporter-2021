import { format } from "date-fns"
import { Fragment } from "react"
import { Redirect, useLocation } from "react-router-dom"
import styled from "styled-components"
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

const DayOverlayParent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: hidden;

  & > * {
    flex-grow: 0;
  }

  h4 {
    text-align: center;
    margin-bottom: 0.8em;
    font-size: 1.8em;
    font-weight: 400;
  }

  .graph {
    width: 220px;
    margin: 0 auto;

    p {
      display: none;
      visibility: hidden;
    }
  }

  h5 {
    font-size: 1em;
    text-align: left;
    margin: 0.6em 0;
    font-weight: 300;
    color: rgb(140, 140, 140);
  }

  .symbols-colors-counts {
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(4, min-content);
    grid-auto-rows: min-content;
    font-size: 24px;
    align-items: center;

    p {
      font-weight: 300;
      text-align: left;
      margin-bottom: 5px;
      padding-right: 14px;
      border-right: 0.5px solid #666;
      margin-right: 8px;
      margin-left: 2px;

      &:nth-child(4n) {
        border-right: none;
        padding-right: 0;
      }

      &:last-child {
        border-right: none;
      }
    }

    .symbol-color-pair {
      margin-bottom: 4px;
      display: flex;
      text-align: center;
      align-items: center;

      svg {
        margin-left: auto;
      }
    }
  }
`

const DayOverlay = ({ emojiList, colorDict, dateString, reports }) => {
  const [year, month, day] = dateString.split(`/`)
  return (
    <PageOverlay origin="/calendar">
      {reports ? (
        <DayOverlayParent>
          <h4 className="day-overlay-date">
            {format(new Date(dateString), `MMMM d, yyyy`)}
          </h4>
          <div className="graph">
            <DayReceiver
              data={reports}
              {...{ emojiList, colorDict, calendar: true, year, month, day }}
            />
          </div>
          <h5>Total reports:</h5>
          <div className="symbols-colors-counts">
            {emojiList.map((emoji, i) => (
              <Fragment key={emoji}>
                <SymbolColorPair emoji={emoji} color={colorDict[emoji]} />
                <p>{reports[emoji] || 0}</p>
              </Fragment>
            ))}
          </div>
        </DayOverlayParent>
      ) : (
        <div>...</div>
      )}
    </PageOverlay>
  )
}

export default DayOverlayReceiver
