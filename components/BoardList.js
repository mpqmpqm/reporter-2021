import { useState } from "react"
import { emojiFromSymbolsArray } from "../helper-fns/helper-fns"
import BoardListItem from "./BoardListItem"

const BoardList = ({ availableBoards, handleSelect, selectedBoardId }) => {
  const [isEditing, setIsEditing] = useState(null)

  const emitEdit = (id) => setIsEditing(id)

  return availableBoards.map(({ id, title, symbols }) => (
    <BoardListItem
      key={id}
      {...{ title, id, handleSelect, emitEdit }}
      emoji={emojiFromSymbolsArray(symbols)}
      isSelected={id === selectedBoardId}
      isEditing={isEditing === id}
    />
  ))
}

export default BoardList
