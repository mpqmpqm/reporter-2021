import styled from "styled-components"

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 8px 6px 8px;
  flex-wrap: wrap;
  justify-content: flex-end;

  .symbol-color-pair {
    border-right: 0.5px solid #666;
    flex-basis: 18%;
    flex-grow: 1;
    max-width: 20%;

    &:nth-child(5n) {
      border-right: none;
      padding-right: 0;
    }

    &:last-child {
      border-right: none;
    }

    &:nth-child(n + 6) {
      margin-top: 4px;

      &:last-child {
        margin-right: auto;
      }
    }
  }
`

const SymbolColorPairParent = styled.div`
  display: flex;
  font-size: 28px;
  align-items: center;
  line-height: 1;
  position: relative;
  padding: 0 4px;

  span {
    margin-left: auto;
  }

  svg {
    height: 34px;
    width: 34px;
  }
`

const Legend = ({ emojiList, colorDict }) => (
  <Container>
    {emojiList.map((emoji, i) => (
      <SymbolColorPair key={emoji} {...{ emoji }} color={colorDict[emoji]} />
    ))}
  </Container>
)

export const SymbolColorPair = ({ emoji, color }) => (
  <SymbolColorPairParent className="symbol-color-pair">
    <span>{emoji}</span>
    <ConcentricCircles color={color} />
  </SymbolColorPairParent>
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
