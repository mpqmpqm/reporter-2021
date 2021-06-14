import React, { forwardRef, useEffect } from "react"
import DayFill from "./DayFill"

const getPercent = (curr, total) => (curr / total) * 100

const percentSign = (percent) => `${percent}%`

const dataTransform = ({
  reports,
  totalReports,
  emojiList,
  calendar,
  minReports,
}) => {
  const contentfulReports = Object.entries(reports).filter(
    ([_, count]) => count
  )
  const blocksCount = contentfulReports.length
  const padding = (1 / blocksCount) * 6.5

  const normalizeWithPadding = (nativePercent) =>
    (nativePercent * (100 - (blocksCount - 1) * padding)) / 100

  const calcPercents = () =>
    contentfulReports
      .sort(
        ([emojiA], [emojiB]) =>
          emojiList.indexOf(emojiB) - emojiList.indexOf(emojiA)
      )
      .map(([emoji, count]) => ({
        emoji,
        count,
        height: normalizeWithPadding(
          getPercent(
            count,
            calendar ? totalReports : Math.max(minReports, totalReports)
          )
        ),
      }))

  const calcYCoords = (array) => {
    let y = 0
    let lastHeight = 0
    return array.map((object) => {
      y += lastHeight
      lastHeight = object.height + padding
      return {
        ...object,
        y,
      }
    })
  }

  const percentStringify = (array) =>
    array.map(({ height, y, ...rest }) => ({
      ...rest,
      height: percentSign(height),
      y: percentSign(y),
    }))

  return percentStringify(calcYCoords(calcPercents()))
}

const DayContentful = forwardRef(
  (
    {
      reports,
      totalReports,
      emojiList,
      colorDict,
      calendar,
      binary,
      year,
      month,
      day,
    },
    container
  ) => {
    const minReports = binary
      ? 1
      : 2 + Math.max(2, Math.max(totalReports + 1, 2))

    const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))

    const scale = (count) =>
      `scale(${
        calendar
          ? clamp(count / Math.max(totalReports, minReports), 0.65, 0.925)
          : 1
      })`

    useEffect(() => {
      if (container.current) {
        container.current.style.transform = scale(totalReports)
      }
    })

    return (
      <svg key={year + month + day}>
        {dataTransform({
          reports,
          totalReports,
          emojiList,
          calendar,
          minReports,
        }).map(({ emoji, height, y }) => (
          <DayFill
            {...{ height, y, emoji }}
            color={colorDict[emoji]}
            key={emoji}
          />
        ))}
      </svg>
    )
  }
)

export default DayContentful
