import { act } from "@testing-library/react";
import { resetGameStore, useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult";
import { useBoardHandlers } from "./useBoardHandlers";

const PLAYER_ID = "player_1";
const OTHER_PLAYER_ID = "player_2";

describe("useBoardHandlers", () => {
  let result: HookResult<typeof useBoardHandlers>;

  beforeEach(() => {
    resetGameStore();
    useRoomStore.getState().setPlayer(PLAYER_ID);
    jest.clearAllMocks();
    result = getHookResult(useBoardHandlers);
  })
  
  test.each<[ handler: "handleBoardSet" | "handleRepositionShips"]>([
    ["handleBoardSet"], ["handleRepositionShips"]
  ])("%s - the same player", (handler) => {
    act(() => result.current[handler]({ otherPlayer: PLAYER_ID }));

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();

    expect(gameState).toEqual(initialGameState);
  })

  test("handleBoardSet - other player, game status is not `board-set`", () => {
    act(() => result.current.handleBoardSet({ otherPlayer: OTHER_PLAYER_ID }));

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();

    expect(gameState).not.toEqual(initialGameState);
    expect(gameState.isOtherBoardSet).toBeTruthy();
    expect(gameState.gameStatus).toEqual(initialGameState.gameStatus);
    expect(gameState.currentPlayer).toEqual(OTHER_PLAYER_ID);
  })

  test("handleBoardSet - other player, game status is `board-set`", () => {
    act(() => useGameStore.getState().setGameStatus("board-set"));

    act(() => result.current.handleBoardSet({ otherPlayer: OTHER_PLAYER_ID }));

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();

    expect(gameState).not.toEqual(initialGameState);
    expect(gameState.isOtherBoardSet).toBeTruthy();
    expect(gameState.gameStatus).toEqual("playing");
    expect(gameState.currentPlayer).toEqual(initialGameState.currentPlayer);
  })

  test("handleRepositionShips - other player is current player", () => {
    act(() => useGameStore.getState().setCurrentPlayer(OTHER_PLAYER_ID));
    act(() => useGameStore.getState().setIsOtherBoardSet(true));

    act(() => result.current.handleRepositionShips({ otherPlayer: OTHER_PLAYER_ID }));

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();

    expect(gameState).toEqual(initialGameState);
  })

  test("handleRepositionShips - other player is not current player", () => {
    act(() => useGameStore.getState().setCurrentPlayer(PLAYER_ID));

    act(() => result.current.handleRepositionShips({ otherPlayer: OTHER_PLAYER_ID }));

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();

    expect(gameState).not.toEqual(initialGameState);
    expect(gameState.currentPlayer).toEqual(PLAYER_ID);
    expect(gameState.isOtherBoardSet).toBeFalsy();
  })

})