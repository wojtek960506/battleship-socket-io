import { BOARD_SIZE } from "@/constants";
import type { Ship } from "@/types";
import { getEmptyBoard } from "./board";
import { getBoardPlacingShip, getDefaultShips, getPlacedShip } from "./general"
import { getRandomlyPlacedShips, isWithinBoard } from "./shipPlacement";

// TODO maybe later extract those functions to single files and do
// more tests as now all cases for every function are in one test
describe("shipPlacement", () => {
  test.each([
    ["when no ships are placed", false],
    ["when one ship is already placed", true],
  ])("getRandomlyPlacedShips - %s", (_desc, isShipPlaced) => {
    let board = getEmptyBoard();
    const ships = getDefaultShips();
  
    if (isShipPlaced) {
      const placedShip = getPlacedShip(ships[0], 3, 4);
      ships[0] = placedShip;
      board = getBoardPlacingShip(board, placedShip);
    }

    const { newBoard, newShips } = getRandomlyPlacedShips(board, ships);
    
    for (const ship of newShips) {
      expect(["horizontal", "vertical"]).toContain(ship.direction);
      expect(ship.status).toBe("placed")
      expect(ship.startColumn).toBeGreaterThanOrEqual(0);
      expect(ship.startRow).toBeGreaterThanOrEqual(0);
      expect(ship.startColumn).toBeLessThan(BOARD_SIZE);
      expect(ship.startRow).toBeLessThan(BOARD_SIZE);
    }

    let emptyCellsCount = 0;
    let takenCellsCount = 0;

    for (const row of newBoard) {
      for (const cell of row) {
        if (cell === "empty") emptyCellsCount += 1;
        else if (cell === "taken") takenCellsCount += 1;
      }
    }

    const expectedTakenCells = newShips.reduce((acc, curr) => acc  + curr.length, 0);
    const expectedEmptyCells = BOARD_SIZE * BOARD_SIZE - expectedTakenCells;
    expect(emptyCellsCount).toEqual(expectedEmptyCells);
    expect(takenCellsCount).toEqual(expectedTakenCells);
  })


  test("isWithinBoard", () => {
    let ship = {
      startColumn: 1,
      startRow: 1,
      direction: "horizontal",
      length: 5,
    } as Ship;

    expect(isWithinBoard(ship)).toBeTruthy();
    ship.direction = "vertical";
    expect(isWithinBoard(ship)).toBeTruthy();

    ship.startColumn = null;
    expect(isWithinBoard(ship)).toBeFalsy();
    ship.startColumn = 10;
    expect(isWithinBoard(ship)).toBeFalsy();
    ship.startColumn = -1;
    expect(isWithinBoard(ship)).toBeFalsy();

    ship.startColumn = 1;
    ship.startRow = null;
    expect(isWithinBoard(ship)).toBeFalsy();
    ship.startRow = 10;
    expect(isWithinBoard(ship)).toBeFalsy();
    ship.startRow = -1;
    expect(isWithinBoard(ship)).toBeFalsy();

    ship.startColumn = 6;
    ship.startRow = 6;
    expect(isWithinBoard(ship)).toBeFalsy();

    ship.direction = "horizontal";
    expect(isWithinBoard(ship)).toBeFalsy();  
  })

  
})