import isEqual from "lodash.isequal"
import { forwardRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory, useRouteMatch } from "react-router-dom"
import { useBoardSettings } from "../context/BoardSettingsContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import PageOverlay from "./ModalGenerics"

const EditBoardModalOverlay = () => {
  const { userDocumentStub } = useFirestore()

  const {
    params: { boardId },
  } = useRouteMatch()

  const { push: redirect } = useHistory()

  const { availableBoards, updateBoardSelection } = useBoardSettings()
  const { selectedBoard } = useSelectedBoard()

  const { title, symbols, id, binary } = availableBoards.find(
    ({ id }) => id === boardId
  )

  const { register, handleSubmit, errors } = useForm()

  const handleSave = async (formValues) => {
    const { formBinary, formTitle, ...colors } = formValues
    try {
      const formSymbols = Object.entries({ ...colors }).reduce(
        (acc, [emoji, color]) => [...acc, { emoji, color }],
        []
      )

      const titleChanged = title !== formTitle
      const symbolsChanged = !isEqual(symbols, formSymbols)
      const binaryChanged = binary !== formBinary

      if (titleChanged || symbolsChanged || binaryChanged) {
        const replacementData = {}
        if (titleChanged) replacementData.title = formTitle
        if (symbolsChanged) replacementData.symbols = formSymbols
        if (binaryChanged) replacementData.binary = formBinary

        await userDocumentStub
          .append(`boards`)
          .append(id)
          .close()
          .update(replacementData)
      }

      redirect(`/settings`)
    } catch (e) {
      console.error(e)
    }
  }
  const handleCancel = (e) => {
    redirect(`/settings`)
  }

  const handleBoardDelete = async (e) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${title}? This cannot be undone.`
    )
    if (confirmed) {
      if (id === selectedBoard.id) {
        const nextSelected = availableBoards.find(
          ({ id }) => id !== selectedBoard.id
        )?.id

        await updateBoardSelection(nextSelected || null)
      }
      try {
        userDocumentStub.append(`boards`).append(id).close().delete()
        redirect(`/settings`)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <PageOverlay origin="/settings" className="edit-board">
      <header>
        <h4
          style={{
            display: `flex`,
            justifyContent: `center`,
            alignItems: `flex-end`,
            marginBottom: `2.5vh`,
            marginLeft: `1ch`,
          }}
        >
          Editing <Title initial={title} ref={register} />
        </h4>
      </header>
      <form onSubmit={handleSubmit(handleSave)} className="edit-board-form">
        <fieldset>
          <legend>Colors </legend>
          <div className="emoji-color-pairs">
            {symbols.map(({ emoji, color }) => (
              <div key={emoji} className="emoji-color-input-container">
                <div>
                  Emoji: <span className="emoji">{emoji}</span>
                </div>
                <ColorPicker initial={color} formId={emoji} ref={register} />
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Binary tracking</legend>
          <p
            style={{
              color: `#666`,
              fontSize: `.9em`,
              lineHeight: 1.25,
              marginBottom: 6,
            }}
          >
            Sometimes you might want to track whether or not you made a report
            on a day rather than how many reports you made. Check this box to
            tell the app that this is an on/off–style calendar.
          </p>
          <div style={{ display: `flex`, alignItems: `center` }}>
            <label htmlFor="formBinary">Binary tracking </label>
            <input
              type="checkbox"
              ref={register}
              name="formBinary"
              id="formBinary"
              defaultChecked={binary}
            ></input>
          </div>
        </fieldset>
        <div className="confirmation-options">
          <button type="submit" title="Save" name="confirm">
            Save
          </button>
        </div>
      </form>
      <div style={{ display: `flex`, justifyContent: `center` }}>
        <button onClick={handleBoardDelete} name="delete">
          Delete board
        </button>
      </div>
    </PageOverlay>
  )
}

export default EditBoardModalOverlay

// const EmojiColorPair = forwardRef(({ emoji, color, formId }, ref) => (
//   <>
//     <EmojiPicker initial={emoji} formId={formId} ref={ref} />
//     <ColorPicker initial={color} formId={formId} ref={ref} />
//   </>
// ))

// const EmojiPicker = forwardRef(({ initial, formId }, ref) => (
//   <div className="emoji-picker">
//     <label htmlFor={`emoji-input-${formId}`}>Emoji: </label>
//     <input
//       ref={ref}
//       defaultValue={initial}
//       name={`emoji-${formId}`}
//       className="emoji-input"
//       id={`emoji-input-${formId}`}
//     />
//   </div>
// ))

const ColorPicker = forwardRef(({ initial, formId }, ref) => {
  const [color, setColor] = useState(initial)

  return (
    <div className="color-picker">
      <label htmlFor={`color-input-${formId}`}>Color: </label>
      <div className="color-picker-bg" style={{ background: color }}>
        <input
          type="color"
          className="color-picker"
          value={color}
          onChange={({ target: { value } }) => setColor(value)}
          ref={ref}
          name={`${formId}`}
          id={`color-input-${formId}`}
        />
      </div>
    </div>
  )
})

const Title = forwardRef(({ initial }, ref) => {
  const [title, setTitle] = useState(initial)

  return (
    <>
      <label htmlFor="formTitle" aria-hidden={true} hidden>
        Title
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        ref={ref}
        name="formTitle"
        id="formTitle"
        style={{
          fontSize: `inherit`,
          background: `none`,
          border: `none`,
          borderBottom: `.5px solid #666`,
          marginLeft: `1ch`,
          color: `whitesmoke`,
          fontWeight: `inherit`,
          display: `block`,
          width: `${Math.min(title.length + 3, 15)}ch`,
          borderRadius: 0,
          // marginTop: -2,
        }}
        type="text"
      />
    </>
  )
})

// const DeleteRow = ({ formId, deleteRow }) => {
//   const handleClick = () => {
//     // console.log({ formId })
//     deleteRow(formId)
//   }

//   return (
//     <button onClick={handleClick} type="button">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <line x1="18" y1="6" x2="6" y2="18"></line>
//         <line x1="6" y1="6" x2="18" y2="18"></line>
//       </svg>
//     </button>
//   )
// }
