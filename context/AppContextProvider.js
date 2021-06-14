import { BrowserRouter } from "react-router-dom"
import { FirestoreContextProvider } from "../firebase/FirestoreContextProvider"
import { BoardSettingsContextProvider } from "./BoardSettingsContextProvider"
import { SelectedBoardContextProvider } from "./SelectedBoardContextProvider"
import { TodayContextProvider } from "./TodayContextProvider"
import { TodayDateStringContextProvider } from "./TodayDateStringContextProvider"

const AppContextProvider = ({ children }) => (
  <FirestoreContextProvider>
    <SelectedBoardContextProvider>
      <BoardSettingsContextProvider>
        <TodayDateStringContextProvider>
          <TodayContextProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </TodayContextProvider>
        </TodayDateStringContextProvider>
      </BoardSettingsContextProvider>
    </SelectedBoardContextProvider>
  </FirestoreContextProvider>
)

export default AppContextProvider
