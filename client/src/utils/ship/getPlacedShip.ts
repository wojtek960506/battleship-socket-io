import type { Ship } from "@/types";
import { calculateShipCells } from "../general";

export const getPlacedShip = (ship: Ship, startRow: number, startColumn: number ) => {
  const newShip: Ship = { ...ship, startColumn, startRow, status: "placed" };
  const { shipCells, surroundingCells } = calculateShipCells(newShip)
  return { ...newShip, cells: shipCells, surroundingCells }
}