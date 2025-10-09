import { BOARD_SIZE, calculateShipCells } from "./utils";
import type { Ship } from "./utils";

export const canShipBePlaced = (ship: Ship, ships: Ship[]) => {
  
  // TODO maybe in the future if I will decide to somehow mark surrounding
  // cell on the board then `board` can be used in this function instead
  // of `ships`. Then there will be less computations

  if (!isWithinBoard(ship)) return false

  const { shipCells } = calculateShipCells(ship);

  const otherShips = ships.filter(s => s.id !== ship.id)

  for (const otherShip of otherShips) {
    for (const cell of shipCells) {
      if (otherShip.cells.some(otherCell => 
        cell.row === otherCell.row && cell.column === otherCell.column 
      )) return false
      if (otherShip.surroundingCells.some(otherCell => 
        cell.row === otherCell.row && cell.column === otherCell.column
      )) return false
    }
  }

  return true
}

export const isWithinBoard = (ship: Ship) => {
  if (ship.startColumn === null || ship.startRow === null) return false;
  if (ship.startColumn < 0 || ship.startRow < 0) return false;

  let finalColumn = ship.startColumn;
  let finalRow = ship.startRow;

  if (ship.direction === "horizontal") finalColumn += ship.length - 1;
  else finalRow += ship.length - 1;
  
  return (finalColumn < BOARD_SIZE && finalRow < BOARD_SIZE);
}

export const findShip = (ships: Ship[], row: number, column: number) => (
  ships.find(s => s.cells.some(cell => cell.row === row && cell.column === column))
)
