import React from "react"
import DayContentful from "./DayContentful"
import DayEmpty from "./DayEmpty"

const DayReceiver = ({
  day,
  year,
  month,
  data,
  symbols,
  startOfMonth = false,
}) => {
  const reports =
    data &&
    (({ createdAt, ...props }) =>
      Object.keys(props).length
        ? {
            ...props,
          }
        : null)(data)

  const totalReports =
    reports && Object.values(reports).reduce((sum, count) => sum + count, 0)

  const contentful = !!totalReports

  return (
    <div
      className="day-receiver-grid-item"
      style={{ gridColumnStart: startOfMonth && startOfMonth + 1 }}
    >
      <p>{day}</p>
      {contentful ? (
        <DayContentful
          {...{ reports, totalReports, day, year, month, symbols }}
        />
      ) : (
        <DayEmpty />
      )}
    </div>
  )
}

export default DayReceiver
