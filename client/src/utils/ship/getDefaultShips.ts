import type { Ship } from "@/types";

export const getDefaultShips = (): Ship[] => (
  // [5,4,3,3,2].map((length, i) => ({
  [3,2].map((length, i) => ({
    id: i,
    direction: "horizontal",
    startColumn: null,
    startRow: null,
    length,
    cells: [],
    surroundingCells: [],
    hitCells: [],
    status: "not-placed"
  }))
)