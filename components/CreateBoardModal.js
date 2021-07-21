import { useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { useBoardSettings } from "../context/BoardSettingsContextProvider"
import { colorOptions } from "../helper-fns/dictionaries"
import { emojiRegex, reduceEmojiModifiers } from "../helper-fns/helper-fns"
import PageOverlay from "./ModalGenerics"

const ModalParent = styled.div`
  h4 {
    text-align: center;
    font-size: 1.3rem;
    color: whitesmoke;
    line-height: 1.2;
  }

  form {
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 6vh auto;
      max-width: 90%;
      font-size: 1.3rem;
    }

    label {
      font-weight: 500;
      margin-bottom: 0.5em;
    }

    input {
      font-size: 0.95em;
      background: none;
      border: none;
      border-bottom: 0.5px solid #666;
      border-radius: 0;
      color: whitesmoke;
      text-align: center;
      max-width: 100%;

      &[name="formEmoji"] {
        font-size: 3rem;
      }
    }

    button {
      font-size: 1.4em;
      font-weight: 600;
      padding: 12px 0;
      color: var(--nav-color);
      opacity: 1;
      transform: translateY(0);
      transition: color 0.2s, transform 0.2s, opacity 0.2s;

      &:disabled {
        color: rgb(50, 50, 50);
        opacity: 0;
        transform: translateY(10px);
      }
    }
  }

  .confirmation-dialog {
    text-align: center;
    max-width: 90%;
    margin: 0 auto;

    p {
      margin-bottom: 4vh;
    }

    .processed-emoji {
      font-size: 3rem;
    }

    .confirmation-options {
      display: flex;
      justify-content: space-between;
      margin-top: 10vh;

      button {
        font-size: 1.3em;
        text-align: left;
        font-weight: 600;
        padding: 0;
        margin-right: 10vw;

        &:last-child {
          margin-right: 0;
        }

        &[name="cancel"] {
          border-bottom: 4px solid rgb(150, 0, 0);
        }

        &[name="confirm"] {
          border-bottom: 4px solid var(--nav-color);
        }
      }
    }
  }
`

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
        <ModalParent>
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
        </ModalParent>
      </PageOverlay>
      {isConfirming && (
        <PageOverlay origin="/settings/add">
          <ModalParent>
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
          </ModalParent>
        </PageOverlay>
      )}
    </>
  )
}

export default createBoardModal
