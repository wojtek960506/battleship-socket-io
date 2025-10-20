import { act } from "@testing-library/react";
import { resetGameStore, useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { COMMON_SHIP_1, COMMON_SHIP_2, getBoardWithCommonShips, OTHER_PLAYER_ID, PLAYER_ID } from "@/test-utils/constants";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult";
import type { BoardCellType, ReceiveShotResultType } from "@/types";
import { useShotHandlers } from "./useShotHandlers";

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

  test.each<[handler: "handleReceiveShot" | "handleReceiveShotResult"]>(
    [ ["handleReceiveShot"], ["handleReceiveShotResult"] ]
  )("%s - the same player", (method) => {
    act(() => result.current[method]({ playerFromServer: PLAYER_ID } as any));

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

  test("handleReceiveShot - missed shot", () => {
    act(() => useGameStore.getState().setOpponentBoard(getBoardWithCommonShips()));
    
    const data: ReceiveShotResultType = {
      row: 1,
      column: 1,
      value: "missed",
      playerFromServer: OTHER_PLAYER_ID,
      sunkCells: [],
      isFinished: false
    }
    act(() => result.current.handleReceiveShotResult(data));
    
    const board = getBoardWithCommonShips();
    board[1][1] = "missed";

    const gameState = useGameStore.getState();
    expect(gameState.opponentBoard).toEqual(board);
    expect(gameState.gameStatus).not.toBe("finished");
    expect(gameState.winner).toBeNull();
    expect(gameState.currentPlayer).toBe(OTHER_PLAYER_ID);
  })

  test("handleReceiveShot - sunk the last ship", () => {
    act(() => useGameStore.getState().setOpponentBoard(getBoardWithCommonShips()));
    
    const data: ReceiveShotResultType = {
      row: 6,
      column: 5,
      value: "sunk",
      playerFromServer: OTHER_PLAYER_ID,
      sunkCells: [
        { row: 4, column: 5 },
        { row: 5, column: 5 },
        { row: 6, column: 5 },
      ],
      isFinished: true
    }
    act(() => result.current.handleReceiveShotResult(data));
    
    const board = getBoardWithCommonShips();
    board[4][5] = "sunk";
    board[5][5] = "sunk";
    board[6][5] = "sunk";

    const gameState = useGameStore.getState();
    expect(gameState.opponentBoard).toEqual(board);
    expect(gameState.gameStatus).toBe("finished");
    expect(gameState.winner).toBe(PLAYER_ID);
    expect(gameState.currentPlayer).toBeNull();
  })
})