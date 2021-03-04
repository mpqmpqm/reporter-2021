import { useBoardSettings } from "../hooks/useBoardSettings"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { firebase } from "../firebase/firebaseClient"
import View from "./View"
import Edit from "../components/Edit"

const Settings = () => {
  const { updateBoardSelection, availableBoards, addBoard } = useBoardSettings()

  const handleAddBoard = () => {
    const title = window.prompt(`name for your board?`)
    const symbols = window.prompt(`emoji to track?`)
    title &&
      symbols &&
      addBoard({
        title,
        symbols: symbols.replace(/ /g, ``).split(`,`),
      })
  }

  const { selectedBoard } = useSelectedBoard()

  const signOut = async () => {
    firebase.auth().signOut()
    window.location.href = `/login`
  }

  return (
    <View pageTitle="Settings" id="Settings">
      <div className="board-selector">
        <header>
          <h3>Your boards</h3>
          <Edit />
        </header>
        {availableBoards.map(({ id, title, symbols }) => (
          <div
            key={id}
            className={`board-option ${
              id === selectedBoard.id ? `selected` : ``
            }`}
          >
            <input
              type="radio"
              id={id}
              value={id}
              checked={id === selectedBoard.id}
              onChange={({ target: { value } }) => updateBoardSelection(value)}
            />
            <label htmlFor={id}>
              <span className="title">{title}</span>
              <span className="symbols">{symbols}</span>
            </label>
          </div>
        ))}
        <div className="board-option">
          <button id="add-board" onClick={handleAddBoard}>
            + Add a board
          </button>
        </div>
      </div>
      <div>
        <button id="sign-out" onClick={signOut}>
          Sign out
        </button>
      </div>
    </View>
  )
}

export default Settings
