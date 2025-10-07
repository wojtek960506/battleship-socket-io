import { getBoardCellClass, type BoardType } from "../../helpers/utils"
import { useGameStore } from "../../store/GameStore"

const renderBoard = (board: BoardType) => {
    const renderedBoard = board.map((boardRow, i) => {
      const boardFields = boardRow.map((boardField, j) => {
        const className = "board-field " + getBoardCellClass(boardField);
        const key = `${i}-${j}`

        return <div key={key} className={className} />
      })

      const key = `row-number-${i}`
      boardFields.unshift(
        <div key={key} className="board-field row-number">{String.fromCharCode(65 + i)}</div>
      )

      return <div key={i} className="board-row">{boardFields}</div>
    })

    const numbers = [...Array(10).keys()].map(i => (i + 1).toString())
    numbers.unshift("")
  
    const boardColumnNumbers = numbers.map((number, index) => {
      const key = `column-number-${index}`;
      return <div key={key} className="board-field column-number">{number}</div>
    })

    renderedBoard.unshift(
      <div key="column-numbers" className="board-row">{boardColumnNumbers}</div>
    )
    return renderedBoard
  }

export const Board = () => {
  const {
    yourBoard,
    
    // ships,
    // placeShipOnBoard,
    // removeShipFromBoard,
    // moveShipOnBoard
  } = useGameStore()




  return <div className="board-container">{renderBoard(yourBoard)}</div>
}