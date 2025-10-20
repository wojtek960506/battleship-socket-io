import { act } from "@testing-library/react";
import { resetGameStore, useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult";
import { useSwitchPlayers } from "./useSwitchPlayers";

const PLAYER_ID = "player_1";
const PLAYER_FROM_SERVER = "player_2";

describe("useSwitchPlayers", () => {
  
  let result: HookResult<typeof useSwitchPlayers>
  
  beforeEach(() => {
    act(() => useRoomStore.getState().setPlayer(PLAYER_ID))
    resetGameStore();
    jest.clearAllMocks();
    result = getHookResult(useSwitchPlayers);
  })
  
  test("switchPlayers - game not finished", () => {
    act(() => result.current.switchPlayers(PLAYER_FROM_SERVER, false))

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();

    expect(gameState).not.toEqual(initialGameState);
    expect({
      ...gameState,
      currentPlayer: initialGameState.currentPlayer
    }).toEqual(initialGameState);
    expect(gameState.currentPlayer).toEqual(PLAYER_ID);
  })

  test("switchPlayers - game finished", () => {
    act(() => result.current.switchPlayers(PLAYER_FROM_SERVER, true));

    const gameState = useGameStore.getState();
    const initialGameState = useGameStore.getInitialState();

    expect(gameState).not.toEqual(initialGameState);
    expect({
      ...gameState,
      winner: initialGameState.winner,
      gameStatus: initialGameState.gameStatus,
    }).toEqual(initialGameState);
    expect(gameState.gameStatus).toEqual("finished");
    expect(gameState.winner).toEqual(PLAYER_FROM_SERVER);
    expect(gameState.currentPlayer).toBeNull();
  })
})

