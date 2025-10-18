import { BOARD_SIZE } from "@/constants";
import type { Cell } from "@/types";
import { getDefaultShips, getPlacedShip } from "@/utils/ship";
import { getBoardPlacingShip, getBoardRemovingShip, getEmptyBoard, getUpdatedBoard } from "./getBoard";

describe("getBoard", () => {
  
  test("getEmptyBoard", () => {
    const emptyBoard = getEmptyBoard();
    expect(emptyBoard).toHaveLength(BOARD_SIZE);
    for (const row of emptyBoard) {
      expect(row).toHaveLength(BOARD_SIZE);
      for (const cell of row) {
        expect(cell).toBe("empty")
      }
    }
  })

  test("getUpdatedBoard", () => {
    const board = getEmptyBoard();
    const cells: Cell[] = [
      { row: 2, column: 1 },
      { row: 3, column: 1 },
      { row: 4, column: 1 },
    ]

    const newBoard = getUpdatedBoard(board, cells, "sunk");
    
    board[2][1] = "sunk";
    board[3][1] = "sunk";
    board[4][1] = "sunk";
    expect(newBoard).toEqual(board);
  })

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
})