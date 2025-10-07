import { useGameStore } from "../../store/GameStore"

export const Board = () => {
  const {
    yourBoard,
    // ships,
    // placeShipOnBoard,
    // removeShipFromBoard,
    // moveShipOnBoard
  } = useGameStore()

  const boardTmp = yourBoard.map((boardRow, i) => {
    const boardFields = boardRow.map((boardField, j) => {
      let className = "board-field";

      switch(boardField) {
        case "hit":
          className += " hit-cell";
          break;
        case "sunk":
          className += " sunk-cell";
          break;
        case "missed":
          className += " missed-cell";
          break;
        case "taken":
          className += " taken-cell";
          break;
        case "empty":
        default:
          className += " empty-cell";
          break; 
      }

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

  boardTmp.unshift(
    <div key="column-numbers" className="board-row">{boardColumnNumbers}</div>
  )
  return <div className="board-container">{boardTmp}</div>
}