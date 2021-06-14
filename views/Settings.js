import { Route } from "react-router"
import { Link } from "react-router-dom"
import BoardList from "../components/BoardList"
import CreateBoardModal from "../components/CreateBoardModal"
import EditBoardModalOverlay from "../components/EditBoardModal"
import { useBoardSettings } from "../context/BoardSettingsContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { firebase } from "../firebase/firebaseClient"
import View from "./View"

const Settings = () => {
  const { updateBoardSelection, availableBoards, addBoard } = useBoardSettings()

  const { selectedBoard } = useSelectedBoard()

  const signOut = async () => {
    firebase.auth().signOut()
    window.location.href = `/login`
  }

  return (
    <View pageTitle="Settings" id="Settings">
      <div>
        <div className="board-selector">
          <header>
            <h3>Your boards</h3>
          </header>
          {availableBoards.length ? (
            <>
              <p
                style={{
                  margin: `8px 16px 0`,
                  fontSize: `1em`,
                  color: `#666`,
                  fontStyle: `italic`,
                  lineHeight: 1,
                }}
              >
                Swipe left to edit
              </p>
              <BoardList
                {...{ availableBoards }}
                handleSelect={({ target: { value } }) =>
                  updateBoardSelection(value)
                }
                selectedBoardId={selectedBoard.id}
              />
            </>
          ) : null}
          <div className="board-option add">
            <Link to="/settings/add">+ Add a board</Link>
          </div>
        </div>
        <div>
          <button id="sign-out" onClick={signOut}>
            Sign out
          </button>
        </div>
        <Route path="/settings/add/">
          <CreateBoardModal />
        </Route>
        <Route path="/settings/edit/:boardId">
          <EditBoardModalOverlay />
        </Route>
      </div>
    </View>
  )
}

export default Settings
