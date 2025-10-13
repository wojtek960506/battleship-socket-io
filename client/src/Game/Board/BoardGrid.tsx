import React from "react"
import { BOARD_SIZE, getBoardCellClass, type BoardType, type ShipCell } from "../../helpers/utils"

type BoardGridProps = {
  board: BoardType,
  hoverPreview: ShipCell[],
  onCellClick: (row: number, column: number) => void,
  onCellEnter?: (row: number, column: number) => void,
  onCellLeave?: (row: number, column: number) => void,
}

const ColumnLabels = () => (
  <div className="board-row">
    {["", ...[...Array(BOARD_SIZE).keys()].map(i => (i + 1).toString())].map((number, index) => (
      <div key={`col-label-${index}`} className="board-cell column-number">{number}</div>
    ))}
  </div>
)

export const BoardGrid = React.memo(
  ({ board, hoverPreview, onCellClick, onCellEnter, onCellLeave } : BoardGridProps) => (
    <div className="board-container">
      <ColumnLabels />
      <>
        {board.map((boardRow, rowIndex) => (
          <div key={`row-${rowIndex}`} className="board-row">
            <div key={`row-number-${rowIndex}`} className="board-cell row-number">
              {String.fromCharCode(65 + rowIndex)}
            </div>
            {boardRow.map((boardCell, columnIndex) => {
              // showing preview of ship when hovering
              const additionalClass = hoverPreview
                .some(p => p.column === columnIndex && p.row === rowIndex) 
                ? "preview-cell"
                : getBoardCellClass(boardCell)

              return (
                <div
                  onClick={(event) => {
                    event.stopPropagation()
                    onCellClick(rowIndex, columnIndex)
                  }}
                  onMouseEnter={() => onCellEnter?.(rowIndex, columnIndex)}
                  onMouseLeave={() => onCellLeave?.(rowIndex, columnIndex)}
                  key={`cell-${rowIndex}-${columnIndex}`}
                  className={`board-cell ${additionalClass}`}
                />
            )})}
          </div>
        ))}
      </>
    </div>
  )
)