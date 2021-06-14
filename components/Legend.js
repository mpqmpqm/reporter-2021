const Legend = ({ emojiList, colorDict }) => (
  <div className="legend">
    {emojiList.map((emoji, i) => (
      <SymbolColorPair key={emoji} {...{ emoji }} color={colorDict[emoji]} />
    ))}
  </div>
)

export const SymbolColorPair = ({ emoji, color }) => (
  <div className="symbol-color-pair">
    <span>{emoji}</span>
    <ConcentricCircles color={color} />
  </div>
)

export const ConcentricCircles = ({ color }) => (
  <svg>
    <circle r="40%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
    <circle r="30%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
    <circle r="20%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
    <circle r="10%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
  </svg>
)

export default Legend
