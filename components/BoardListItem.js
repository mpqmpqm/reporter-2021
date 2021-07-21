import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useSwipeable } from "react-swipeable"
import styled from "styled-components"
import { Pencil } from "./Edit"

const Option = styled.div`
  --edit-button-width: 36px;
  padding: 0 var(--padding-sides);
  padding-right: 0;
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: 400;
  display: flex;
  position: relative;
  z-index: 2;
  line-height: 1.2;
  margin: 4px 0;

  &:first-child {
    padding-top: 0;
    margin-top: 0;
  }

  label {
    position: relative;
    z-index: 2;
    background-color: black;
    transition: transform 0.2s ease-in-out;
    padding: 2px 0;
    padding-right: var(--padding-sides);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      max-width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
    }

    .symbols {
      font-size: 1.1em;
      text-align: right;
      max-width: 50%;
    }
  }

  input[type="radio"] {
    display: none;
  }

  .icon-container {
    background-color: rgb(255, 135, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--edit-button-width);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    padding: 2px 0;

    svg {
      display: block;
    }
  }

  &.selected {
    color: var(--nav-color);
    font-weight: bold;
  }

  &.add {
    text-align: center;
    justify-content: center;
    margin-left: -1ch;
    margin-top: 3vh;
  }

  &.editing {
    label {
      transform: translateX(calc(var(--edit-button-width) * -1));
    }
  }
`

const BoardListItem = ({
  id,
  title,
  emoji,
  isSelected,
  handleSelect,
  isEditing,
  emitEdit,
}) => {
  const editButton = useRef(null)

  const editingClassName = isEditing ? `editing` : `static`

  const listenForDismissal = ({ target }) => {
    if (!target.closest(`nav`)) endEditing(null)
  }

  const beginEditing = () => {
    emitEdit(id)
    window.addEventListener(`click`, listenForDismissal)
  }

  const endEditing = () => {
    emitEdit(null)
    window.removeEventListener(`click`, listenForDismissal)
  }

  useEffect(
    () => () => window.removeEventListener(`click`, listenForDismissal),
    []
  )

  const handlers = useSwipeable({
    onSwipedLeft: () => beginEditing(),
    onSwipedRight: () => endEditing(),
  })

  return (
    <Option
      key={id}
      className={`${isSelected ? `selected` : ``} ${editingClassName}`}
      {...handlers}
    >
      <input
        type="radio"
        id={id}
        value={id}
        checked={isSelected}
        onChange={handleSelect}
      />
      <label htmlFor={id}>
        <span className="title">{title}</span>
        <span className="symbols">{emoji}</span>
      </label>
      <Link to={`/settings/edit/${id}`} onClick={endEditing} ref={editButton}>
        <div className={`icon-container ${editingClassName}`}>
          <Pencil size={18} />
        </div>
      </Link>
    </Option>
  )
}
export default BoardListItem
