import { act, renderHook } from "@testing-library/react";
import { useGameStore } from "@/store/GameStore";
import type { BoardCellType, Ship } from "@/types";
import { getRandomlyPlacedShips } from "@/utils/board";
import { useRandomShips } from "./useRandomShips";

jest.mock("@/utils/board");

describe("useRandomShips", () => {
  const newBoard: BoardCellType[][] = [
    ["empty", "empty", "taken", "taken"],
    ["taken", "empty", "empty", "empty"],
    ["taken", "empty", "empty", "empty"],
    ["taken", "empty", "empty", "empty"],
  ];

  const newShips: Ship[] = [{
    id: 1,
    direction: "horizontal",
    startColumn: 2,
    startRow: 0,
    length: 2,
    status: "placed",
  } as Ship, {
    id: 2,
    direction: "vertical",
    startColumn: 0,
    startRow: 1,
    length: 3,
    status: "placed",
  } as Ship]
  
  beforeEach(() => {
    (getRandomlyPlacedShips as jest.Mock).mockReturnValue({ newBoard, newShips });
  })

  test("placeShipsRandomly", () => {
    const { result } = renderHook(() => useRandomShips());
    act(() => {
      result.current.placeShipsRandomly();
    })

    const gameState = useGameStore.getState();
    expect(gameState.yourBoard).toEqual(newBoard);
    expect(gameState.ships).toEqual(newShips);
    expect(gameState.chosenShipId).toBeNull();
  })
})