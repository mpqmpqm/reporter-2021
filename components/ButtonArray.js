import styled from "styled-components"

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  grid-auto-rows: min-content;
  overflow-y: auto;

  .button-container {
    margin: 0 3vw;
    min-width: 25%;
    display: flex;
    justify-content: center;
    transform-origin: center;

    button {
      font-size: 20vw;
      -webkit-user-select: none;
      user-select: none;
      touch-action: manipulation;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

      &:active {
        background-color: none;
        filter: contrast(75%);
        filter: brightness(75%);
      }
    }

    &:nth-child(3n - 2) {
      justify-content: flex-end;
    }

    &:nth-child(3n - 2):last-child {
      justify-content: center;
      grid-column: span 3;
    }

    &:first-child:last-child {
      justify-content: center;
    }

    &:nth-child(2):last-child {
      justify-content: flex-start;
    }

    &:nth-child(3n) {
      justify-content: flex-start;
    }
  }
`

const ButtonArray = ({ emojiList, handleClick }) => (
  <Container>
    {emojiList.map((emoji, i) => (
      <div className="button-container" key={emoji}>
        <button onClick={handleClick} value={emoji}>
          {emoji}
        </button>
      </div>
    ))}
  </Container>
)

export default ButtonArray
