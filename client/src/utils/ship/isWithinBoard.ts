import { BOARD_SIZE } from "@/constants";
import type { Ship } from "@/types";

export const isWithinBoard = (ship: Ship) => {
  if (ship.startColumn === null || ship.startRow === null) return false;
  if (ship.startColumn < 0 || ship.startRow < 0) return false;

  let finalColumn = ship.startColumn;
  let finalRow = ship.startRow;

  if (ship.direction === "horizontal") finalColumn += ship.length - 1;
  else finalRow += ship.length - 1;
  
  return (finalColumn < BOARD_SIZE && finalRow < BOARD_SIZE);
}