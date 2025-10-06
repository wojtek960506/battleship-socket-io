import { calculateShipFields, getDefaultShips, getEmptyBoard, getPlacedShip, type Ship } from "./utils";

const COMMON_SHIP: Ship = {
  id: 1,
  direction: "horizontal",
  startColumn: 1,
  startRow: 2,
  length: 4,
  fields: [],
  status: "placed"
}

describe("test utils", () => {

  test("calculateShipFields - horizontal", () => {
    const fields = calculateShipFields(COMMON_SHIP);
    expect(fields).toHaveLength(COMMON_SHIP.length);
    expect(fields).toEqual([
      { column: 1, row: 2 },
      { column: 2, row: 2 },
      { column: 3, row: 2 },
      { column: 4, row: 2 },
    ])
  });

  test("calculateShipFields - vertical", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      direction: "vertical",
      length: 5,
    }
    const fields = calculateShipFields(ship);
    expect(fields).toHaveLength(ship.length);
    expect(fields).toEqual([
      { column: 1, row: 2 },
      { column: 1, row: 3 },
      { column: 1, row: 4 },
      { column: 1, row: 5 },
      { column: 1, row: 6 },
    ])
  })

  test("getPlacedShip - ship with wrong status", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      startColumn: null,
      startRow: null,
    }

    const newShip = getPlacedShip(ship, 2, 3);
    expect(newShip).toEqual(ship)
  })

  test("getPlacedShip - ship with correct status", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      startColumn: null,
      startRow: null,
      status: "not-placed"
    }

    const newShip = getPlacedShip(ship, 2, 3);
    expect(newShip).not.toEqual(ship)
    expect(newShip.startColumn).toBe(2)
    expect(newShip.startRow).toBe(3)
    expect(newShip.fields).toEqual([
      { column: 2, row: 3 },
      { column: 3, row: 3 },
      { column: 4, row: 3 },
      { column: 5, row: 3 },
    ])
  })

  test("getEmptyBoard", () => {
    const emptyBoard = getEmptyBoard();
    expect(emptyBoard).toHaveLength(10);
    for (let row of emptyBoard) {
      expect(row).toHaveLength(10);
      for (let field of row) {
        expect(field).toBe("empty")
      }
    }
  })
  test("getDefaultShips", () => {
    const defaultShips = getDefaultShips();
    const defaultLenghts = [5,4,3,3,2];

    expect(defaultShips).toHaveLength(5);
    defaultShips.forEach((ship, index) => {
      expect(ship.id).toBe(index + 1);
      expect(ship.direction).toBe("horizontal");
      expect(ship.startColumn).toBeNull();
      expect(ship.startRow).toBeNull();
      expect(ship.length).toBe(defaultLenghts[index]);
      expect(ship.fields).toHaveLength(0);
      expect(ship.status).toBe("not-placed")
    })
  })
})