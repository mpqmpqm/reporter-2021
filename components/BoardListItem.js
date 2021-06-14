import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useSwipeable } from "react-swipeable"
import { Pencil } from "./Edit"

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
    <div
      key={id}
      className={`board-option ${
        isSelected ? `selected` : ``
      } ${editingClassName}`}
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
    </div>
  )
}
export default BoardListItem
