import type { BoardCellType } from "@/utils/types"
import { resetGameStore, useGameStore } from "./GameStore"


describe("test GameStore", () => {

  beforeEach(() => resetGameStore())

  test("setYourBoard", () => {
    const smallBoard: BoardCellType[][] = [
      ["empty", "empty"],
      ["empty", "empty"]
    ]
    useGameStore.getState().setYourBoard(smallBoard)
    expect(useGameStore.getState().yourBoard).toEqual(smallBoard)
  })
})