import type { Ship } from "@/types";
import { calculateShipCells } from "./calculateShipCells";

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

describe("calculateShipCells", () => {
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
})