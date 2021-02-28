import { useBoardSettings } from "../hooks/useBoardSettings"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"

const Settings = () => {
  const { updateBoardSelection, availableBoards, addBoard } = useBoardSettings()

  const handleAddBoard = () => {
    const title = window.prompt(`name for your board?`)
    const symbols = window.prompt(`emoji to track, separated by comma`)
    title &&
      symbols &&
      addBoard({ title, symbols: symbols.replace(/ /g, ``).split(`,`) })
  }

  const { selectedBoard } = useSelectedBoard()
  return (
    <div>
      <button onClick={handleAddBoard}>add board</button>
      <div>
        {availableBoards.map(({ id, title }) => (
          <div
            key={id}
            className={`board-select ${id === selectedBoard ? `selected` : ``}`}
          >
            <input
              type="radio"
              id={id}
              value={id}
              checked={id === selectedBoard}
              onChange={({ target: { value } }) => updateBoardSelection(value)}
            />
            <label htmlFor={id}>{title}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings
