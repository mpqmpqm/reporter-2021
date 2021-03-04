import { useEffect, useState } from "react"
import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useFirestore } from "../firebase/FirestoreContextProvider"

const PopulateBoard = () => {
  const [date, setDate] = useState(null)

  const { userDocumentStub, FieldValue } = useFirestore()
  const { selectedBoard } = useSelectedBoard()

  const dayDocumentStub =
    userDocumentStub &&
    selectedBoard &&
    date &&
    userDocumentStub
      .append(`boards`)
      .append(selectedBoard.id)
      .append(`data`)
      .append(date.replace(/-/g, `/`))

  const handleDateSelect = ({ target: { value } }) => {
    setDate(value)
  }

  useEffect(() => {
    dayDocumentStub &&
      dayDocumentStub.close().set({
        createdAt: new Date(date),
      })
  }, [date])

  const handleClick = ({ target: { value } }) => {
    dayDocumentStub.close().update({
      [value]: FieldValue.increment(1),
    })
  }

  return (
    selectedBoard && (
      <div>
        <h1>{selectedBoard.details.title}</h1>
        <input type="date" onSelect={handleDateSelect} />
        {selectedBoard.details.symbols.map((symbol, i) => (
          <div key={i}>
            <button onClick={handleClick} value={symbol}>
              {symbol}
            </button>
          </div>
        ))}
      </div>
    )
  )
}

export default PopulateBoard
