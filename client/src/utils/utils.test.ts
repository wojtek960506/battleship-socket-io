import type { BoardCellType } from "@/types";
import { getBoardCellClass } from "./general_tmp";

describe("test utils", () => {

  test("getBoardCellClass", () => {
    for (const cellType of ["empty", "hit", "sunk", "missed", "taken"]) {
      expect(getBoardCellClass(cellType as BoardCellType)).toBe(`${cellType}-cell`)
    }
  })
})