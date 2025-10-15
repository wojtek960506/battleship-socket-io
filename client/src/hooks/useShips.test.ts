import { act, renderHook } from "@testing-library/react"
import type { Ship } from "@/helpers/types"
import { getDefaultShips } from "@/helpers/utils"
import { resetGameStore, useGameStore } from "@/store/GameStore"
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
