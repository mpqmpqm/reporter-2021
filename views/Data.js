import { ThisMonth } from "../components/Month"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"

const Data = () => {
  const { selectedBoard } = useSelectedBoard()
  const { todayData, sendReport } = useToday()

  return (
    <div>
      {Object.entries(todayData)
        .filter(([symbol]) => symbol !== `createdAt`)
        .map(([symbol, count], i) => (
          <div key={i}>
            <p>
              {symbol}: {count}
            </p>
            <button
              onClick={({ target: { value } }) => sendReport(value)}
              value={symbol}
            >
              {symbol}
            </button>
          </div>
        ))}
      <ThisMonth />
    </div>
  )
}

export default Data
