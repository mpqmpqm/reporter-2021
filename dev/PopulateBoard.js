import { useSelectedBoard } from "../context/SelectedBoardContextProvider"
import { useFirestore } from "../firebase/FirestoreContextProvider"
import { useState } from "react"

const PopulateBoard = () => {
  const [year, setYear] = useState(`2021`)
  const [month, setMonth] = useState(`01`)
  const [day, setDay] = useState(`01`)

  const { userDocumentStub, FieldValue } = useFirestore()
  const { selectedBoard } = useSelectedBoard()

  const dayDocumentStub =
    userDocumentStub &&
    selectedBoard &&
    userDocumentStub
      .append(`boards`)
      .append(selectedBoard.id)
      .append(`data`)
      .append(year)
      .append(month)
      .append(day)

  const createDoc = () => {
    if (dayDocumentStub) {
      dayDocumentStub.close().set({
        createdAt: new Date(year, month - 1, day),
      })
    }
  }

  const handleClick = ({ target: { value } }) => {
    dayDocumentStub.close().update({
      [value]: FieldValue.increment(1),
    })
  }

  return (
    selectedBoard && (
      <div>
        <h1>{selectedBoard.details.title}</h1>
        <input value={year} onChange={(e) => setYear(e.target.value)} />
        <input value={month} onChange={(e) => setMonth(e.target.value)} />
        <input value={day} onChange={(e) => setDay(e.target.value)} />
        <button onClick={createDoc}>Create doc</button>
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
