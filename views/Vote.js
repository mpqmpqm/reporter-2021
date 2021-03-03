import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import View from "./View"
import { colorOptions } from "../helper-fns/dictionaries"

const Vote = () => {
  const { selectedBoard } = useSelectedBoard()
  const { todayData, sendReport } = useToday()

  const handleClick = ({ target: { value } }) => {
    sendReport(value)
  }

  return (
    <View pageTitle={selectedBoard.details.title} id="Vote">
      <div className="button-array-container">
        <div className="button-array">
          {selectedBoard.details.symbols.map((emoji, i) => (
            <div className="button-container" key={emoji}>
              <button onClick={handleClick} value={emoji}>
                {emoji}
              </button>
            </div>
          ))}
        </div>
      </div>
    </View>
  )
}

export default Vote
