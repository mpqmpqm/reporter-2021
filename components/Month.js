import React from "react"
import { useMonth } from "../hooks/useMonth"
import { useToday } from "../context/TodayContextProvider"

export const Month = () => {
  return <div></div>
}

export const ThisMonth = () => {
  const { todayData, todayDateString } = useToday()
  const year = todayDateString.slice(0, 4)
  const month = todayDateString.slice(5, 7)

  const { monthData } = useMonth(year, month, true)

  return (
    <div style={{ display: `grid`, gridTemplateColumns: `1fr 1fr 1fr` }}>
      {monthData.map(({ date, data }) => (
        <div key={date}>
          <h2>{date}</h2>
          {data &&
            Object.entries(data)
              .filter(([symbol]) => symbol !== `createdAt`)
              .map(([key, value]) => (
                <p key={key}>
                  {key}: {value}
                </p>
              ))}
        </div>
      ))}
      <div>
        <h2>{todayDateString}</h2>
        {todayData &&
          Object.entries(todayData)
            .filter(([symbol]) => symbol !== `createdAt`)
            .map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
      </div>
    </div>
  )
}
