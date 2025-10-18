import type { Ship } from "@/types";
import { getPlacedShip } from "./getPlacedShip";

test("getPlacedShip", () => {
  const ship: Ship = {
      id: 1,
    direction: "horizontal",
    startColumn: null,
    startRow: null,
    length: 4,
    cells: [],
    surroundingCells: [],
    hitCells: [],
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