import { BOARD_SIZE } from "@/constants";
import type { BoardType, Direction, Ship } from "@/types";
import { canShipBePlaced } from "@/utils/ship";
import { getBoardPlacingShip, getPlacedShip } from "./general";

export const isWithinBoard = (ship: Ship) => {
  if (ship.startColumn === null || ship.startRow === null) return false;
  if (ship.startColumn < 0 || ship.startRow < 0) return false;

  let finalColumn = ship.startColumn;
  let finalRow = ship.startRow;

  if (ship.direction === "horizontal") finalColumn += ship.length - 1;
  else finalRow += ship.length - 1;
  
  return (finalColumn < BOARD_SIZE && finalRow < BOARD_SIZE);
}

const getRandomInt = (min: number, max: number) => {
  // ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);

  // generate a random integer in the inclusive range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomlyPlacedShips = (board: BoardType, ships: Ship[]) => {

  const placedShips = ships.filter(ship => ship.status === "placed")
  
  for (const ship of ships) {
    if (ship.status === "placed") continue;

    let isPlacementValid = false;
    let placedShip: Ship;

    while (!isPlacementValid) {

      const startRow: number = getRandomInt(0, 9)
      const startColumn: number = getRandomInt(0,9)
      const direction: Direction = getRandomInt(0,1) === 0 ? "horizontal" : "vertical";

      const newShip = {
        ...ship,
        direction,
        startColumn,
        startRow,
      }

      if (canShipBePlaced(newShip, placedShips)) {
        placedShip = getPlacedShip(newShip, startRow, startColumn);
        placedShips.push(placedShip);
        board = getBoardPlacingShip(board, placedShip)
        isPlacementValid = true;
      }
    }
  }

  return { newBoard: board, newShips: placedShips }
}
