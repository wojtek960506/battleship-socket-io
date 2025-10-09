import { BOARD_SIZE } from "./utils";
import type { BoardType, Ship } from "./utils";

export const canShipBePlaced = (board: BoardType, ship: Ship) => {
  
  if (ship.startColumn === null || ship.startRow === null) return false;
  if (ship.startColumn < 0 || ship.startRow < 0) return false;

  let finalColumn = ship.startColumn;
  let finalRow = ship.startRow;

  if (ship.direction === "horizontal") finalColumn += ship.length - 1;
  else finalRow += ship.length - 1;
  
  if (finalColumn >= BOARD_SIZE || finalRow >= BOARD_SIZE) return false;

  // TODO
  // ship cannot be placed when other ship is on its way or other ship is too close
  // or maybe better will be to store surrounding cells within ship properties
  
  return true
}
