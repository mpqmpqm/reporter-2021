import React from "react"

const DayFill = ({ color, height, y }) => (
  <rect
    x="0"
    width="100%"
    height={`${height}%`}
    y={`${y}%`}
    style={{ fill: color }}
  />
)

export default DayFill
