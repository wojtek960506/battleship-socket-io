import type { BoardCellType, Ship } from "./types";
import { BOARD_SIZE, calculateShipCells, getBoardCellClass, getBoardPlacingShip, getBoardRemovingShip, getDefaultShips, getEmptyBoard, getPlacedShip, getRemovedShip } from "./utils";

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

  test("getDefaultShips", () => {
    const defaultShips = getDefaultShips();
    const defaultLenghts = [5,4,3,3,2];

    expect(defaultShips).toHaveLength(5);
    defaultShips.forEach((ship, index) => {
      expect(ship.id).toBe(index);
      expect(ship.direction).toBe("horizontal");
      expect(ship.startColumn).toBeNull();
      expect(ship.startRow).toBeNull();
      expect(ship.length).toBe(defaultLenghts[index]);
      expect(ship.cells).toHaveLength(0);
      expect(ship.status).toBe("not-placed")
    })
  })

  test("calculateShipCells - horizontal", () => {
    const { shipCells } = calculateShipCells(COMMON_SHIP);
    expect(shipCells).toHaveLength(COMMON_SHIP.length);
    expect(shipCells).toEqual([
      { column: 1, row: 2 },
      { column: 2, row: 2 },
      { column: 3, row: 2 },
      { column: 4, row: 2 },
    ])
  });

  test("calculateShipCells - vertical", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      direction: "vertical",
      length: 5,
    }
    const { shipCells } = calculateShipCells(ship);
    expect(shipCells).toHaveLength(ship.length);
    expect(shipCells).toEqual([
      { column: 1, row: 2 },
      { column: 1, row: 3 },
      { column: 1, row: 4 },
      { column: 1, row: 5 },
      { column: 1, row: 6 },
    ])
  })

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