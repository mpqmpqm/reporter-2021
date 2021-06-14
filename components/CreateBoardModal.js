import { useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory } from "react-router-dom"
import { useBoardSettings } from "../context/BoardSettingsContextProvider"
import { colorOptions } from "../helper-fns/dictionaries"
import { emojiRegex, reduceEmojiModifiers } from "../helper-fns/helper-fns"
import PageOverlay from "./ModalGenerics"

const createBoardModal = () => {
  const { push: redirect } = useHistory()
  const { updateBoardSelection, addBoard } = useBoardSettings()

  const [isConfirming, setIsConfirming] = useState(false)
  const [processedEmoji, setProcessedEmoji] = useState([])
  const [title, setTitle] = useState(null)

  const { register, handleSubmit, errors, watch } = useForm()

  const { formTitle, formEmoji } = watch()

  const formReady = !!formTitle && !!formEmoji

  const handleSave = ({ formTitle, formEmoji }) => {
    let symbols
    try {
      symbols =
        formEmoji &&
        Array.from(new Set(reduceEmojiModifiers(formEmoji.match(emojiRegex))))
    } catch (e) {
      alert(
        `Something went wrong. Make sure you entered only emoji in that field.`
      )
    }
    if (formTitle && symbols) {
      setIsConfirming(true)
      setTitle(formTitle)
      setProcessedEmoji(symbols)
    }
  }

  const handleConfirm = async () => {
    const newId = await addBoard({
      title,
      symbols: processedEmoji.map((emoji, i) => ({
        emoji,
        color: colorOptions[i],
      })),
      binary: false,
    })
    redirect(`/settings/edit/${newId}`)
  }

  const handleConfirmationCancel = () => {
    setIsConfirming(false)
  }

  return (
    <>
      <PageOverlay origin="/settings" className="create-board">
        <header>
          <h4>Create</h4>
        </header>
        <form onSubmit={handleSubmit(handleSave)}>
          <div>
            <label htmlFor="">Name your board</label>
            <input
              type="text"
              name="formTitle"
              ref={register}
              style={{
                width: `${Math.max(
                  (formTitle ? formTitle.length : 0) + 2,
                  10
                )}ch`,
              }}
            />
          </div>
          <div>
            <label htmlFor="">
              Which emoji would you like to&nbsp;use?
              <br />
              <span style={{ color: `#666`, fontSize: `.8em` }}>
                Enter all of them here
              </span>
            </label>
            <input
              type="text"
              name="formEmoji"
              ref={register}
              style={{
                width: `${Math.max(
                  (formEmoji ? formEmoji.length : 0) + 2,
                  6
                )}ch`,
              }}
            />
          </div>
          <div>
            <button type="submit" disabled={!formReady}>
              Next &rarr;
            </button>
          </div>
        </form>
      </PageOverlay>
      {isConfirming && (
        <PageOverlay origin="/settings/add">
          <div className="confirmation-dialog">
            <p>
              Please confirm that this is all the emoji you want to track. You
              won't be able to change this later.
            </p>
            <p className="processed-emoji">{processedEmoji.map((e) => e)}</p>
            <div className="confirmation-options">
              <button onClick={handleConfirmationCancel} name="cancel">
                &larr;&nbsp;Back
              </button>
              <button onClick={handleConfirm} name="confirm">
                Set colors and other options &rarr;
              </button>
            </div>
          </div>
        </PageOverlay>
      )}
    </>
  )
}

export default createBoardModal
