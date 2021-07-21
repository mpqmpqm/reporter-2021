import { Route } from "react-router"
import { Link } from "react-router-dom"
import styled, { css } from "styled-components"
import BoardList from "../components/BoardList"
import CreateBoardModal from "../components/CreateBoardModal"
import EditBoardModalOverlay from "../components/EditBoardModal"
import { useBoardSettings } from "../context/BoardSettingsContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { firebase } from "../firebase/firebaseClient"
import View from "./View"

const SettingsStyleVars = css`
  --padding-sides: 16px;
  --spacing: 4px;
`

const BoardSelector = styled.div`
  ${SettingsStyleVars}
  margin: 8px 0;
  margin-bottom: 10vh;

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: var(--spacing);
    margin-bottom: var(--spacing);
    border-bottom: 1px solid whitesmoke;
    padding: var(--spacing) var(--padding-sides);
    padding-left: calc(var(--padding-sides) * 0.75);

    h3 {
      font-weight: 500;
    }
  }

  #add-board,
  #sign-out {
    -webkit-appearance: none;
    color: inherit;
    border: none;
    background: none;
    display: block;
  }

  #add-board {
    font-size: 1.4em;
    text-align: center;
    margin-top: 6px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const SignoutParent = styled.div`
  ${SettingsStyleVars}
  button {
    padding-left: var(--padding-sides);
    font-size: 1.4rem;
    font-weight: 500;
  }
`

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
        <BoardSelector>
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
          <div id="add-board">
            <Link to="/settings/add">+ Add a board</Link>
          </div>
        </BoardSelector>
        <SignoutParent>
          <button id="sign-out" onClick={signOut}>
            Sign out
          </button>
        </SignoutParent>
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
