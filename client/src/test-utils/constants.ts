import type { Direction, Ship, ShipStatus } from "@/types";

export const PLAYER_ID = "player_1";
export const OTHER_PLAYER_ID = "player_2";

export const ROOM_NAME = "room_1";

export const COMMON_SHIP_1: Ship = {
  id: 1,
  direction: "horizontal" as Direction,
  startColumn: 1,
  startRow: 1,
  length: 3,
  cells: [
    { row: 1, column: 1 },
    { row: 1, column: 2 },
    { row: 1, column: 3 },
  ],
  surroundingCells: [],
  hitCells: [],
  status: "placed" as ShipStatus,
}

export const COMMON_SHIP_2: Ship = {
  id: 2,
  direction: "vertical" as Direction,
  startColumn: 5,
  startRow: 4,
  length: 3,
  cells: [
    { row: 4, column: 5 },
    { row: 5, column: 5 },
    { row: 6, column: 5 },
  ],
  surroundingCells: [],
  hitCells: [
    { row: 4, column: 5 },
    { row: 5, column: 5 },
  ],
  status: "placed" as ShipStatus,
}