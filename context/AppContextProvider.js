import { BrowserRouter } from "react-router-dom"
import { FirestoreContextProvider } from "../firebase/FirestoreContextProvider"
import { SelectedBoardContextProvider } from "./SelectedBoardContextProvider"
import { TodayContextProvider } from "./TodayContextProvider"
import { TodayDateStringContextProvider } from "./TodayDateStringContextProvider"

const AppContextProvider = ({ children }) => (
  <FirestoreContextProvider>
    <SelectedBoardContextProvider>
      <TodayDateStringContextProvider>
        <TodayContextProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </TodayContextProvider>
      </TodayDateStringContextProvider>
    </SelectedBoardContextProvider>
  </FirestoreContextProvider>
)

export default AppContextProvider
