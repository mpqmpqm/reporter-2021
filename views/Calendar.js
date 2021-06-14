import Legend from "../components/Legend"
import { Month, ThisMonth } from "../components/Month"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import {
  getMonthBefore,
  isEndOfMonthBeforeCreatedAt,
} from "../helper-fns/helper-fns"
import View from "./View"

const Calendar = () => {
  const {
    selectedBoard: {
      details: { title, emojiList, colorDict, createdAt, binary },
    },
  } = useSelectedBoard()
  const { todayDateString } = useToday()

  const buildMonths = (monthBefore) => {
    return isEndOfMonthBeforeCreatedAt({ date: monthBefore.date, createdAt })
      ? []
      : [
          <Month
            month={monthBefore.month}
            year={monthBefore.year}
            key={monthBefore.month + monthBefore.year}
            {...{ emojiList, colorDict, binary }}
          />,
          ...buildMonths(getMonthBefore({ date: monthBefore.date })),
        ]
  }

  return (
    <View pageTitle={title} id="Calendar">
      <Legend {...{ emojiList, colorDict }} />
      <div id="calendar-scroll">
        <ThisMonth {...{ emojiList, colorDict, binary }} />
        {buildMonths(getMonthBefore({ date: new Date(todayDateString) }))}
      </div>
    </View>
  )
}

export default Calendar
