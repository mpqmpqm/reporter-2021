import { useCallback, useEffect, useRef } from "react"
import styled from "styled-components"
import ButtonArray from "../components/ButtonArray"
import DayReceiver from "../components/DayReceiver"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useToday } from "../context/TodayContextProvider"
import { drawEmojiSparkles } from "../helper-fns/drawEmojiSparkles"
import View from "./View"

const Container = styled.div`
  display: grid;
  grid-template-areas: "all";
  flex-grow: 1;

  .button-array-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-area: all;
    z-index: 2;
  }
`

const Vote = () => {
  const {
    selectedBoard: {
      details: { title, emojiList, colorDict, binary },
    },
  } = useSelectedBoard()

  const { todayData, sendReport } = useToday()

  const gridRef = useRef(null)
  const buttonRef = useRef(null)

  const handleClick = useCallback((e) => {
    drawEmojiSparkles(e)
    sendReport(e.target.value)
  })

  useEffect(() => {
    const grid = gridRef.current
    const button = buttonRef.current

    if (grid && button) {
      button.style.height = `${grid.getBoundingClientRect().height}px`
    }
  })

  return (
    <View pageTitle={title} id="Vote">
      <Container ref={gridRef}>
        <div className="button-array-container" ref={buttonRef}>
          <ButtonArray emojiList={emojiList} handleClick={handleClick} />
          <div className="button-array"></div>
        </div>
        <DayReceiver
          ref={gridRef}
          data={todayData}
          {...{ emojiList, colorDict, binary }}
        />
      </Container>
    </View>
  )
}

export default Vote
