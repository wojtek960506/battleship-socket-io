import type { Ship } from "@/types";
import { getPlacedShip, getRemovedShip } from "./getShip";

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

describe("getShip", () => {

  test("getPlacedShip", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      startColumn: null,
      startRow: null,
      status: "not-placed",
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

})