import { act } from "@testing-library/react";
import { resetGameStore, useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { COMMON_SHIP_1, COMMON_SHIP_2, getBoardWithCommonShips, OTHER_PLAYER_ID, PLAYER_ID } from "@/test-utils/constants";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult";
import { useShotHandlers } from "./useShotHandlers";
import { getEmptyBoard } from "@/utils/board";
import type { BoardCellType } from "@/types";

describe("useShotHandlers", () => {

  let result: HookResult<typeof useShotHandlers>;

  beforeEach(() => {
    useRoomStore.getState().setPlayer(PLAYER_ID);
    act(() => {
      resetGameStore();
      result = getHookResult(useShotHandlers);
    });
    jest.clearAllMocks();
  })

  test("handleReceiveShot - the same player", () => {
    act(() => result.current.handleReceiveShot(
      { row: 1, column: 1, playerFromServer: PLAYER_ID }
    ));

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();
    expect(gameState).toEqual(initialGameState);
  })

  test.each<[_title: string, row: number, column: number, value: BoardCellType]>([
    ["missing shot", 9, 9, "missed"],
    ["hit shot", 1, 1, "hit"]
  ])("handleReceiveShot - %s", (_title, row, column, value) => {
    const ships = [{...COMMON_SHIP_1}, {...COMMON_SHIP_2}];
    act(() => {
      useGameStore.getState().setYourBoard(getBoardWithCommonShips());
      useGameStore.getState().setShips([...ships]);
    })

    act(() => result.current.handleReceiveShot(
      { row, column, playerFromServer: OTHER_PLAYER_ID })
    )

    const board = getBoardWithCommonShips();
    board[row][column] = value;

    const gameState = useGameStore.getState();
    expect(gameState.yourBoard).toEqual(board);
    expect(gameState.currentPlayer).toEqual(PLAYER_ID);
  })

  test("handleReceiveShot - wrong shot", () => {
    act(() => {
      useGameStore.getState().setYourBoard(getBoardWithCommonShips());
    })

    act(() => {
      expect(() => result.current.handleReceiveShot(
      { row: 4, column: 5, playerFromServer: OTHER_PLAYER_ID }
    )).toThrow(Error)
    })
  })
})