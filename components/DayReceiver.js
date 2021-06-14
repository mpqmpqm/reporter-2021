import { forwardRef, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import DayContentful from "./DayContentful"
import DayEmpty from "./DayEmpty"

const DayReceiver = forwardRef(
  (
    {
      day,
      year,
      month,
      data,
      emojiList,
      colorDict,
      startOfMonth = false,
      calendar,
      binary,
    },
    ref
  ) => {
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

    const svgContainer = useRef(null)

    useEffect(() => {
      if (ref && svgContainer && ref.current && svgContainer.current) {
        svgContainer.current.style.height = `${
          ref.current.getBoundingClientRect().height
        }px`
      }
    })

    return calendar ? (
      <div
        className="day-receiver-grid-item"
        style={{ gridColumnStart: startOfMonth && startOfMonth + 1 }}
      >
        <p>{day}</p>

        <div className="svg-clip-container" ref={svgContainer}>
          {contentful ? (
            <Link
              to={`/calendar/${year}/${month}/${day}`}
              key={year + month + day}
            >
              <DayContentful
                {...{
                  reports,
                  totalReports,
                  emojiList,
                  colorDict,
                  calendar,
                  day,
                  month,
                  year,
                  binary,
                }}
                ref={svgContainer}
              />
            </Link>
          ) : (
            <DayEmpty ref={svgContainer} binary={binary} />
          )}
        </div>
      </div>
    ) : (
      <div className="today-vote-graph" ref={svgContainer}>
        {contentful ? (
          <DayContentful
            ref={ref}
            {...{
              reports,
              totalReports,
              emojiList,
              colorDict,
              calendar,
              binary,
            }}
          />
        ) : (
          <DayEmpty binary={binary} />
        )}
      </div>
    )
  }
)

export default DayReceiver
