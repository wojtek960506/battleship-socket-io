import { act, renderHook } from "@testing-library/react"
import { resetGameStore, useGameStore } from "@/store/GameStore"
import { getDefaultShips } from "@/utils/general"
import type { Ship } from "@/utils/types"
import { useShips } from "./useShips"


describe("test useShips", () => {

  beforeEach(() => resetGameStore())

  test("updateShipsDirection", () => {
    const { result } = renderHook(() => useShips());
    act(() => {
      result.current.updateShipsDirection([0,2,4], "vertical");
    })

    const ships: Ship[] = getDefaultShips();
    ships[0].direction = "vertical"
    ships[2].direction = "vertical"
    ships[4].direction = "vertical"
    expect(useGameStore.getState().ships).toEqual(ships);
  })
})
