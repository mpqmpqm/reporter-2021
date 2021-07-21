import isEqual from "lodash.isequal"
import { forwardRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory, useRouteMatch } from "react-router-dom"
import styled from "styled-components"
import { useBoardSettings } from "../context/BoardSettingsContextProvider"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import PageOverlay from "./ModalGenerics"

const OverlayParent = styled.div`
  header {
    margin-bottom: 12px;

    h4 {
      display: flex;
      justify-content: center;
      alignitems: flex-end;
      marginbottom: 2.5vh;
      marginleft: 1ch;
      text-align: center;
      font-size: 1.3rem;
      color: #666;
      line-height: 1.2;
    }
  }

  .edit-board-form {
    fieldset {
      padding: 6px 16px 16px;
      margin-bottom: 12px;
      border: 0.5px solid #666;
      border-radius: 0 12px 12px 12px;

      legend {
        margin-left: -8px;
        padding: 0 8px;
      }
    }

    .emoji-color-pairs {
      max-height: 20vh;
      overflow-y: auto;

      label {
        margin-right: 8px;
      }
    }

    .emoji-color-input-container {
      --emoji-size: 26px;
      --input-width: 32px;
      display: flex;
      align-items: center;
      padding: 2px 0;
      font-size: 16px;
      margin-bottom: 1vh;

      &:last-child {
        margin-bottom: 0;
      }

      div:first-child {
        margin-right: 5vw;
      }

      > * {
        display: flex;
        align-items: center;
        font-size: inherit;
      }

      .emoji {
        font-size: var(--emoji-size);
        margin-left: 8px;
      }

      input[name="formBinary"] {
        margin-left: 6px;
      }

      button[type="submit"] {
        font-size: 1.2rem;
        font-family: inherit;
        font-weight: 400;
      }
    }
  }

  button[name="delete"] {
    font-size: 1.1em;
    font-weight: 600;
    border-bottom: 2px solid rgb(150, 0, 0);
  }
`

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
      <OverlayParent>
        <header>
          <h4>
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
      </OverlayParent>
    </PageOverlay>
  )
}

export default EditBoardModalOverlay

const ColorPickerParent = styled.div`
  display: flex;
  align-items: center;

  label {
    margin-right: 6px;
  }

  .color-picker-bg {
    height: var(--input-width);
    width: var(--input-width);
    position: relative;
    border: 1px solid whitesmoke;
    border-radius: 50%;

    > * {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    input {
      opacity: 0;
      font-size: 16px;
    }
  }
`

const ColorPicker = forwardRef(({ initial, formId }, ref) => {
  const [color, setColor] = useState(initial)

  return (
    <ColorPickerParent>
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
    </ColorPickerParent>
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
