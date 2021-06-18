import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useTodayDateString } from "../context/TodayDateStringContextProvider"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import View from "./View"

const DemoForm = () => {
  const { userDocumentStub } = useFirestore()

  const [dateStr, setDateStr] = useState(null)

  const { selectedBoard } = useSelectedBoard()

  const handleChange = ({ target: { value } }) => {
    setDateStr(value.replace(/-/g, `/`))
  }

  const { register, handleSubmit } = useForm()

  const dateDocumentStub =
    userDocumentStub &&
    selectedBoard?.id &&
    dateStr &&
    userDocumentStub
      .append(`boards`)
      .append(selectedBoard.id)
      .append(`data`)
      .append(dateStr)

  const handleSave = async (formValues) => {
    const formValuesAsInts = Object.fromEntries(
      Object.entries(formValues).map(([emoji, count]) => [emoji, Number(count)])
    )

    if (dateDocumentStub) {
      await dateDocumentStub
        .close()
        .get()
        .then(async (doc) => {
          await dateDocumentStub.close().set(formValuesAsInts)
        })
    }
  }

  return (
    <View pageTitle="Demo Form">
      <input type="date" onChange={handleChange} />
      <p>{dateStr}</p>
      <form onSubmit={handleSubmit(handleSave)}>
        {selectedBoard?.details.emojiList.map((e) => (
          <div key={e}>
            <label>{e}</label>
            <input name={e} type="number" ref={register}></input>
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
      <ChangeCreatedAt />
    </View>
  )
}

const ChangeCreatedAt = () => {
  const { userDocumentStub } = useFirestore()
  const { selectedBoard } = useSelectedBoard()

  const { register, handleSubmit } = useForm()

  const boardStub =
    userDocumentStub &&
    selectedBoard?.id &&
    userDocumentStub.append(`boards`).append(selectedBoard.id)

  const changeCreatedAt = async ({ createdAt }) => {
    const date = new Date(createdAt)
    if (date) {
      await boardStub.close().update({ createdAt: date })
    }
  }

  return (
    <form onSubmit={handleSubmit(changeCreatedAt)}>
      <input type="date" ref={register} name="createdAt" />
      <button>Save</button>
    </form>
  )
}

export default DemoForm
