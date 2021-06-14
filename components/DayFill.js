const DayFill = ({ color, height, y, emoji }) => (
  <rect
    x="0"
    width="100%"
    height={height}
    y={y}
    fill={color}
    data-emoji={emoji}
  />
)

export default DayFill
