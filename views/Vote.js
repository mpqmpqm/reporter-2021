import { useEffect, useRef } from "react"
import DayReceiver from "../components/DayReceiver"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import View from "./View"

const Vote = () => {
  const {
    selectedBoard: {
      details: { title, emojiList, colorDict, binary },
    },
  } = useSelectedBoard()

  const { todayData, sendReport } = useToday()

  const gridRef = useRef(null)
  const buttonRef = useRef(null)

  const handleClick = ({ target: { value } }) => {
    sendReport(value)
  }

  useEffect(() => {
    const grid = gridRef.current
    const button = buttonRef.current

    if (grid && button) {
      button.style.height = `${grid.getBoundingClientRect().height}px`
    }
  })

  return (
    <View pageTitle={title} id="Vote">
      <div className="absolute-grid" ref={gridRef}>
        <div className="button-array-container" ref={buttonRef}>
          <div className="button-array">
            {emojiList.map((emoji, i) => (
              <div className="button-container" key={emoji}>
                <button onClick={handleClick} value={emoji}>
                  {emoji}
                </button>
              </div>
            ))}
          </div>
        </div>
        <DayReceiver
          ref={gridRef}
          data={todayData}
          {...{ emojiList, colorDict, binary }}
        />
      </div>
    </View>
  )
}

export default Vote
