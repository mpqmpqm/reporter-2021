import Legend from "../components/Legend"
import { Month, ThisMonth } from "../components/Month"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import { colorOptions } from "../helper-fns/dictionaries"
import {
  getMonthBefore,
  isEndOfMonthBeforeCreatedAt,
} from "../helper-fns/helper-fns"
import View from "./View"

const Calendar = () => {
  const { selectedBoard } = useSelectedBoard()
  const { todayDateString } = useToday()

  const buildMonths = (monthBefore) => {
    const { createdAt } = selectedBoard.details
    return isEndOfMonthBeforeCreatedAt({ date: monthBefore.date, createdAt })
      ? []
      : [
          <Month
            month={monthBefore.month}
            year={monthBefore.year}
            key={monthBefore.month + monthBefore.year}
            symbols={selectedBoard.details.symbols}
            {...{ triggerOverlay }}
          />,
          ...buildMonths(getMonthBefore({ date: monthBefore.date })),
        ]
  }

  return (
    <View pageTitle={selectedBoard.details.title} id="Calendar">
      <Legend
        symbols={selectedBoard.details.symbols}
        colors={
          selectedBoard.details.colors ||
          colorOptions.slice(0, selectedBoard.details.symbols.length)
        }
      />
      <div id="calendar-scroll">
        <ThisMonth
          symbols={selectedBoard.details.symbols}
          {...{ triggerOverlay }}
        />
        {buildMonths(getMonthBefore({ date: new Date(todayDateString) }))}
      </div>
    </View>
  )
}

export default Calendar
