import { BOARD_SIZE } from "@/constants";
import { getBoardPlacingShip } from "@/utils/general_tmp";
import { getDefaultShips, getPlacedShip } from "@/utils/ship";
import { getEmptyBoard } from "./getEmptyBoard";
import { getRandomlyPlacedShips } from "./getRandomlyPlacedShips";

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
})