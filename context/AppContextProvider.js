import React from "react"
import { FirestoreContextProvider } from "../firebase/FirestoreContextProvider"
import { SelectedBoardContextProvider } from "./SelectedBoardContextProvider"
import { TodayDateStringContextProvider } from "./TodayDateStringContextProvider"
import { TodayContextProvider } from "./TodayContextProvider"
import { BrowserRouter } from "react-router-dom"

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
