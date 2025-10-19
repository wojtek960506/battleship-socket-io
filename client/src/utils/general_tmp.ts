import type { Ship } from "@/types";
import { areAllCellsHit, findShip, isInShipCells } from "./ship/findShip";


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
