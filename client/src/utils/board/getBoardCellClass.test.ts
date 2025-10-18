import type { BoardCellType } from "@/types"
import { getBoardCellClass } from "./getBoardCellClass"

test("getBoardCellClass", () => {
  for (const cellType of ["empty", "hit", "sunk", "missed", "taken"]) {
    expect(getBoardCellClass(cellType as BoardCellType)).toBe(`${cellType}-cell`)
  }
})