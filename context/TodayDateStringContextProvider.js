import { createContext, useState, useEffect, useContext } from "react"
import { createDateString } from "../helper-fns/helper-fns"

const TodayDateStringContext = createContext()
const TEN_MINUTES = 60 * 10 * 1000

export const TodayDateStringContextProvider = ({ children }) => {
  const [dateString, setDateString] = useState(createDateString(new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      setDateString(createDateString(new Date()))
    }, TEN_MINUTES)
    return () => clearInterval(interval)
  }, [])

  return (
    <TodayDateStringContext.Provider value={{ todayDateString: dateString }}>
      {children}
    </TodayDateStringContext.Provider>
  )
}

export const useTodayDateString = () => useContext(TodayDateStringContext)
