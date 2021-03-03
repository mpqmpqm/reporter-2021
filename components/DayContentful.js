import React from "react"
import DayFill from "./DayFill"
import { colorOptions } from "../helper-fns/dictionaries"

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
    const separatorHeight = 2
    let y = 0

    const remainingSpace = 100 - separatorHeight
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
          <DayFill
            y={thisY}
            key={year + month + day + symbol}
            color={colorOptions[i]}
            {...{ height }}
          />
        )
      })
  }
  return <svg>{buildFills(reports)}</svg>
}

export default DayContentful
