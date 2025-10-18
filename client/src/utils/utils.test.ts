import type { BoardCellType, Ship } from "@/types";
import { getEmptyBoard } from "./board";
import { getBoardCellClass, getBoardPlacingShip, getBoardRemovingShip, getPlacedShip, getRemovedShip } from "./general";
import { getDefaultShips } from "./ship";

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

  

  

  

  test("getPlacedShip", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      startColumn: null,
      startRow: null,
      status: "not-placed"
    }

    const newShip = getPlacedShip(ship, 3, 2);
    expect(newShip).not.toEqual(ship)
    expect(newShip.startColumn).toBe(2)
    expect(newShip.startRow).toBe(3)
    expect(newShip.cells).toEqual([
      { column: 2, row: 3 },
      { column: 3, row: 3 },
      { column: 4, row: 3 },
      { column: 5, row: 3 },
    ])
  })

  test("getRemovedShip", () => {
    const ship = getRemovedShip(COMMON_SHIP);

    expect(ship.startColumn).toBeNull();
    expect(ship.startRow).toBeNull();
    expect(ship.cells).toHaveLength(0);
    expect(ship.status).toBe("not-placed")
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

  test("getBoardCellClass", () => {
    for (const cellType of ["empty", "hit", "sunk", "missed", "taken"]) {
      expect(getBoardCellClass(cellType as BoardCellType)).toBe(`${cellType}-cell`)
    }
  })
})