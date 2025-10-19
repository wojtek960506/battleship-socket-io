import type { Ship } from "@/types";
import { calculateShipCells } from "./calculateShipCells";
import { isWithinBoard } from "./isWithinBoard";

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