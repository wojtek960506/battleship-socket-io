import type { Cell, Ship } from "@/types";

export const findShip = (ships: Ship[], row: number, column: number) => (
  ships.find(s => isInShipCells(s.cells, row, column))
)

export const isInShipCells = (cells: Cell[], row: number, column: number) => (
  cells.some(cell => cell.row === row && cell.column === column)
)

export const areAllCellsHit = (ship: Ship) => {
  if (ship.cells.length !== ship.hitCells.length) return false;

  for (const hitCell of ship.hitCells) {
    if (!isInShipCells(ship.cells, hitCell.row, hitCell.column)) return false;
  }
  return true;
}

