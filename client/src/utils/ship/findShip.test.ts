import type { Direction, Ship, ShipStatus } from "@/types";
import { areAllCellsHit, findShip, isInShipCells } from "./findShip";

const COMMON_CELLS = [
    { row: 1, column: 1 },
    { row: 1, column: 2 },
    { row: 1, column: 3 },
  ]

const COMMON_SHIP = {
  id: 1,
  direction: "horizontal" as Direction,
  startColumn: 1,
  startRow: 1,
  length: 3,
  cells: COMMON_CELLS,
  surroundingCells: [],
  hitCells: [],
  status: "placed" as ShipStatus,
}

describe("isInShipCells", () => {

  it("returns true when cell exists in the list", () => {
    expect(isInShipCells(COMMON_CELLS, 1, 2)).toBe(true);
  });

  it("returns false when cell does not exist", () => {
    expect(isInShipCells(COMMON_CELLS, 2, 1)).toBe(false);
  });
});

describe("findShip", () => {
  const ships: Ship[] = [
    COMMON_SHIP,
    {
      id: 2,
      direction: "vertical",
      startColumn: 5,
      startRow: 2,
      length: 2,
      cells: [
        { row: 2, column: 5 },
        { row: 3, column: 5 },
      ],
      surroundingCells: [],
      hitCells: [],
      status: "placed",
    },
  ];

  it("finds the correct ship when cell is within a ship", () => {
    const ship = findShip(ships, 1, 2);
    expect(ship?.id).toBe(1);
  });

  it("returns undefined when cell does not belong to any ship", () => {
    const ship = findShip(ships, 10, 10);
    expect(ship).toBeUndefined();
  });
});

describe("areAllCellsHit", () => {
  it("returns true when all ship cells are hit", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      hitCells: COMMON_CELLS
    };

    expect(areAllCellsHit(ship)).toBe(true);
  });

  it("returns false when not all cells are hit", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      hitCells: [
        { ...COMMON_CELLS[0] },
        { ...COMMON_CELLS[1] },
      ],
    };

    expect(areAllCellsHit(ship)).toBe(false);
  });

  it("returns false when hitCells has extra invalid cells", () => {
    const ship: Ship = {
      ...COMMON_SHIP,
      hitCells: [
        ...COMMON_CELLS,
        { row: 2, column: 3 }, // invalid hit cell
      ],
    };

    expect(areAllCellsHit(ship)).toBe(false);
  });
});
