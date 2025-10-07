import { getBoardCellClass, type BoardType } from "../../helpers/utils"
import { useGameStore } from "../../store/GameStore"
import "./Board.css"

const ColumnLabels = () => (
  <div className="board-row">
    {["", ...[...Array(10).keys()].map(i => (i + 1).toString())].map((number, index) => (
      <div key={`col-label-${index}`} className="board-cell column-number">{number}</div>
    ))}
  </div>
)

const BoardGrid = ({ board }: { board: BoardType }) => {
  return (
    <>
      {board.map((boardRow, i) => (
        <div key={`row-${i}`} className="board-row">
          <div key={`row-number-${i}`} className="board-cell row-number">
            {String.fromCharCode(65 + i)}
          </div>
          {boardRow.map((boardCell, j) => (
            <div
              key={`cell-${i}-${j}`}
              className={`board-cell ${getBoardCellClass(boardCell)}`}
            />
          ))}
        </div>
      ))}
    </>
  )
}

export const Board = () => {
  const { yourBoard } = useGameStore()

  return <div className="board-container">
    <ColumnLabels />
    <BoardGrid board={yourBoard} />
  </div>
}