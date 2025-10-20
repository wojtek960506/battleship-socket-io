import { COMMON_SHIP_1, COMMON_SHIP_2 } from "@/test-utils/constants";
import { getShipsAfterShot } from "./getShipsAfterShot"

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