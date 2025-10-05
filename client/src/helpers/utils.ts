
export type FieldType = "empty" | "hit" | "sunk" | "missed" | "taken";

export type Direction = "horizontal" | "vertical"

export type ShipStatus = "not-placed" | "placed" | "sunk"

export type Ship = {
  id: number;
  direction: Direction;
  startColumn: number | null // in UI: 1,2,...
  startRow: number | null // in UI: A,B,...
  length: number
  fields: { column: number, row: number }[] // maybe for easier detection of sunk
  status: ShipStatus
}

export const getEmptyBoard = (): FieldType[][] => (
  Array(10).fill(null).map(() => Array(10).fill("empty"))
);

export const getDefaultShips = (): Ship[] => (
  [5,4,3,3,2].map((length, i) => ({
    id: i + 1,
    direction: "horizontal",
    startColumn: null,
    startRow: null,
    length,
    fields: [],
    status: "not-placed"
  }))
)