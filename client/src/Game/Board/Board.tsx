import React, { useCallback, useState } from "react"
import { calculateShipCells, getBoardCellClass, type BoardType } from "../../helpers/utils"
import { useGameStore } from "../../store/GameStore"
import "./Board.css"
import { canShipBePlaced } from "../../helpers/shipPlacement"
import { BOARD_SIZE, type ShipCells } from "../../helpers/utils"

const ColumnLabels = () => (
  <div className="board-row">
    {["", ...[...Array(BOARD_SIZE).keys()].map(i => (i + 1).toString())].map((number, index) => (
      <div key={`col-label-${index}`} className="board-cell column-number">{number}</div>
    ))}
  </div>
)

type BoardGridProps = {
  board: BoardType,
  hoverPreview: ShipCells[],
  onCellClick: (row: number, column: number) => void,
  onCellEnter: (row: number, column: number) => void,
  onCellLeave: (row: number, column: number) => void,
}

const BoardGrid = React.memo(
  ({ board, hoverPreview, onCellClick, onCellEnter, onCellLeave } : BoardGridProps) => (
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
                onClick={() => onCellClick(rowIndex, columnIndex)}
                onMouseEnter={() => onCellEnter(rowIndex, columnIndex)}
                onMouseLeave={() => onCellLeave(rowIndex, columnIndex)}
                key={`cell-${rowIndex}-${columnIndex}`}
                className={`board-cell ${additionalClass}`}
              />
          )})}
        </div>
      ))}
    </>
  )
)

export const Board = () => {
  const { yourBoard, chosenShipId, ships } = useGameStore()
  const [hoverPreview, setHoverPreview] = useState<ShipCells[]>([])

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    if (chosenShipId === null) return;

    const ship = ships.find(s => s.id === chosenShipId)
    if (!ship) return;

    const newShip = {...ship, startRow: rowIndex, startColumn: columnIndex}
    if (!canShipBePlaced(yourBoard, newShip)) {
      return;
    }

  }, [chosenShipId, ships, yourBoard])

  const handleCellEnter = useCallback((rowIndex: number, columnIndex: number) => {
    if (chosenShipId === null) return;

    const ship = ships.find(s => s.id === chosenShipId)
    if (!ship) return;

    const newShip = {...ship, startRow: rowIndex, startColumn: columnIndex}
    if (!canShipBePlaced(yourBoard, newShip)) {
      return;
    }

    setHoverPreview(calculateShipCells(newShip));
  }, [chosenShipId, ships, yourBoard])

  const handleCellLeave = useCallback((rowIndex: number, columnIndex: number) => {
    if (chosenShipId === null) return;

    const ship = ships.find(s => s.id === chosenShipId)
    if (!ship) return;

    const newShip = {...ship, startRow: rowIndex, startColumn: columnIndex}
    if (!canShipBePlaced(yourBoard, newShip)) return;

    setHoverPreview([])
  }, [chosenShipId, ships, yourBoard])

  return <div className="board-container">
    <ColumnLabels />
    <BoardGrid
      board={yourBoard}
      hoverPreview={hoverPreview}
      onCellClick={handleCellClick}
      onCellEnter={handleCellEnter}
      onCellLeave={handleCellLeave}
    />
  </div>
}