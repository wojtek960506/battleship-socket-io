import type { Direction, ShipStatus } from "@/types"
import { getShipsAfterShot } from "./getShipsAfterShot"

const COMMON_SHIP_1 = {
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

const COMMON_SHIP_2 = {
  id: 2,
  direction: "vertical" as Direction,
  startColumn: 1,
  startRow: 1,
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

describe("getShipsAfterShot", () => {
  test("missed ship", () => {
    const ships = [{...COMMON_SHIP_1}, {...COMMON_SHIP_2}];

    const { shipsAfterShot, hitShip } = getShipsAfterShot(ships, 9, 9);

    expect(hitShip).toBeUndefined();
    expect(shipsAfterShot).toBe(ships);
  })

  test("hit ship", () => {
    const ships =  [{...COMMON_SHIP_1}, {...COMMON_SHIP_2}];

    const { shipsAfterShot, hitShip } = getShipsAfterShot(ships, 1, 2);

    const hitCells = [{row: 1, column: 2}];
    const newShips = [{ ...COMMON_SHIP_1, hitCells }, { ...COMMON_SHIP_2 }];
    expect(shipsAfterShot).toEqual(newShips);
    expect(hitShip?.status).toBe("placed");
    expect(hitShip?.hitCells).toEqual([{ row: 1, column: 2 }]);
  })

  test("sunk ship", () => {
    const ships =  [{...COMMON_SHIP_1}, {...COMMON_SHIP_2}];

    const { shipsAfterShot, hitShip } = getShipsAfterShot(ships, 6, 5);

    const hitCells = [...COMMON_SHIP_2.hitCells, { row: 6, column: 5 }];
    const newShips = [{ ...COMMON_SHIP_1 }, { ...COMMON_SHIP_2, hitCells, status: "sunk" }]; 
    
    expect(shipsAfterShot).toEqual(newShips);
    expect(hitShip?.status).toBe("sunk");
    expect(hitShip?.hitCells).toEqual(hitCells);
  })
})