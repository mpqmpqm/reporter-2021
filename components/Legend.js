const Legend = ({ symbols, colors }) => (
  <div className="legend">
    {symbols.map((symbol, i) => (
      <div key={symbol} className="symbol-color-pair">
        <span>{symbol}</span>
        <ConcentricCircles color={colors[i]} />
      </div>
    ))}
  </div>
)

const ConcentricCircles = ({ color }) => (
  <svg>
    <circle r="40%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
    <circle r="30%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
    <circle r="20%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
    <circle r="10%" cy="50%" cx="50%" stroke={color} strokeWidth="1px" />
  </svg>
)

export default Legend
