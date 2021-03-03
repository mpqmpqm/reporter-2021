import { Month, ThisMonth } from "../components/Month"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import {
  getMonthBefore,
  isEndOfMonthBeforeCreatedAt,
} from "../helper-fns/helper-fns"
import { colorOptions } from "../helper-fns/dictionaries"
import View from "./View"

const Data = () => {
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
            symbols={selectedBoard.details.symbols.join()}
          />,
          ...buildMonths(getMonthBefore({ date: monthBefore.date })),
        ]
  }

  return (
    <View pageTitle={selectedBoard.details.title}>
      <div>
        {selectedBoard.details.symbols.map((symbol, i) => (
          <div key={symbol}>
            <div>{symbol}</div>
            <div
              style={{
                height: `24px`,
                width: `24px`,
                backgroundColor: colorOptions[i],
              }}
            />
          </div>
        ))}
      </div>
      <ThisMonth symbols={selectedBoard.details.symbols.join()} />
      {buildMonths(getMonthBefore({ date: new Date(todayDateString) }))}
    </View>
  )
}

export default Data
