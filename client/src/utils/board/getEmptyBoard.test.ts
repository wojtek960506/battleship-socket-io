import { BOARD_SIZE } from "@/constants";
import { getEmptyBoard } from "./getEmptyBoard";

test("getEmptyBoard", () => {
    const emptyBoard = getEmptyBoard();
    expect(emptyBoard).toHaveLength(BOARD_SIZE);
    for (const row of emptyBoard) {
      expect(row).toHaveLength(BOARD_SIZE);
      for (const cell of row) {
        expect(cell).toBe("empty")
      }
    }
  })