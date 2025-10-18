import type { BoardCellType, Ship } from "@/types";
import { getEmptyBoard } from "./board";
import { getBoardCellClass, getBoardPlacingShip, getBoardRemovingShip } from "./general_tmp";
import { getDefaultShips, getPlacedShip } from "./ship";

const COMMON_SHIP: Ship = {
  id: 1,
  direction: "horizontal",
  startColumn: 1,
  startRow: 2,
  length: 4,
  cells: [],
  surroundingCells: [],
  hitCells: [],
  status: "placed"
}

describe("test utils", () => {

  

  


  

  test("placing and removing ship from board", () => {
    let board = getEmptyBoard();
    const ships = getDefaultShips();

    const ship = getPlacedShip(ships[0], 1, 1)

    for (const { column, row } of ship.cells) {
      expect(board[row][column]).toBe("empty")
    }

    board = getBoardPlacingShip(board, ship);

    for (const { column, row } of ship.cells) {
      expect(board[row][column]).toBe("taken")
    }

    board = getBoardRemovingShip(board, ship);

    for (const { column, row } of ship.cells) {
      expect(board[row][column]).toBe("empty")
    }    
  })

  test("getBoardCellClass", () => {
    for (const cellType of ["empty", "hit", "sunk", "missed", "taken"]) {
      expect(getBoardCellClass(cellType as BoardCellType)).toBe(`${cellType}-cell`)
    }
  })
})