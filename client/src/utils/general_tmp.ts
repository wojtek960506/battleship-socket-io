import type { BoardCellType, BoardType, Ship, Cell } from "@/types";

export const getBoardCellClass = (boardCell: BoardCellType): string => {
  const classMapBoardCell: Record<BoardCellType, string> = {
    hit: "hit-cell",
    sunk: "sunk-cell",
    missed: "missed-cell",
    taken: "taken-cell",
    empty: "empty-cell",
  };
  
  return classMapBoardCell[boardCell];
}

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

export const getShipsAfterShot = (ships: Ship[], row: number, column: number) => {
  const hitShip = findShip(ships, row, column);
  if (!hitShip) return { shipsAfterShot: ships, hitShip };

  const hitShipCopy = {...hitShip}
  
  if (isInShipCells(hitShipCopy.cells, row, column)) {
    hitShipCopy.hitCells.push({ row, column });
  }

  if (areAllCellsHit(hitShipCopy)) hitShipCopy.status = "sunk";

  return { 
    shipsAfterShot: ships.map(s => s.id === hitShipCopy.id ? hitShipCopy : s),
    hitShip: hitShipCopy,
  }
}
