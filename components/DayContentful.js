import React from "react"
import { Link } from "react-router-dom"
import { colorOptions } from "../helper-fns/dictionaries"
import DayFill from "./DayFill"

const DayContentful = ({
  day,
  year,
  month,
  reports,
  totalReports,
  symbols,
}) => {
  const percent = (count) => count / totalReports
  const buildFills = (reports) => {
    const symbolCount = Object.values(reports).filter((count) => count > 0)
      .length
    const separatorHeight = symbolCount === 1 ? 0 : 10 / symbolCount
    let y = 0

    const remainingSpace = 100 - separatorHeight * (symbolCount - 1)

    const normalizedHeight = (nativePercent) => nativePercent * remainingSpace

    return Object.entries(reports)
      .sort(
        ([symbol1], [symbol2]) =>
          symbols.indexOf(symbol1) - symbols.indexOf(symbol2)
      )
      .map(([symbol, count], i) => {
        const height = normalizedHeight(percent(count))
        const thisY = y
        y += height + separatorHeight
        return (
          <Link
            to={`/calendar/${year}/${month}/${day}`}
            key={year + month + day + symbol}
          >
            <DayFill
              y={thisY}
              color={colorOptions[symbols.indexOf(symbol)]}
              {...{ height }}
            />
          </Link>
        )
      })
  }
  return <svg>{buildFills(reports)}</svg>
}

export default DayContentful
