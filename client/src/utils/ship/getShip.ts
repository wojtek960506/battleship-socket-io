import type { Ship } from "@/types";
import { calculateShipCells } from "./calculateShipCells";

export const getPlacedShip = (ship: Ship, startRow: number, startColumn: number ) => {
  const newShip: Ship = { ...ship, startColumn, startRow, status: "placed" };
  const { shipCells, surroundingCells } = calculateShipCells(newShip)
  return { ...newShip, cells: shipCells, surroundingCells }
}

export const getRemovedShip = (ship: Ship): Ship => {
  return {
    ...ship,
    startColumn: null,
    startRow: null,
    cells: [],
    surroundingCells: [],
    status: "not-placed",
  }
}