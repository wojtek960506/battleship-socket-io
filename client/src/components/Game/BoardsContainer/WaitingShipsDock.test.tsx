import { act, screen } from "@testing-library/react";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { OTHER_PLAYER_ID, PLAYER_ID, ROOM_NAME } from "@/test-utils/constants";
import { renderWithMockSocket } from "@/test-utils/renderWithMockSocket";
import { WaitingShipsDock } from "./WaitingShipsDock";


describe("WaitingShipsDock", () => {
  let mockSocket: { emit: jest.Mock }

  beforeEach(() => {
    act(() => {
      useRoomStore.getState().setPlayer(PLAYER_ID);
      useRoomStore.getState().setRoom(ROOM_NAME);
    })
    mockSocket = { emit: jest.fn() };
    jest.clearAllMocks();
  })

  test.each([
    ["is set", true, OTHER_PLAYER_ID, OTHER_PLAYER_ID],
    ["is not set", false, PLAYER_ID, null]
  ])(
    "click reposition button - other board %s",
    (_title, isOtherBoardSet, currentPlayer, currentPlayerExpected) => {
      act(() => {
        useGameStore.getState().setIsOtherBoardSet(isOtherBoardSet);
        useGameStore.getState().setCurrentPlayer(currentPlayer);
      })
      renderWithMockSocket(<WaitingShipsDock />, mockSocket);

      act(() => screen.queryByTestId("reposition-ships-btn")?.click());

      const gameState = useGameStore.getState();
      expect(gameState.gameStatus).toBe("setting-board");
      expect(gameState.currentPlayer).toBe(currentPlayerExpected);
      expect(mockSocket.emit).toHaveBeenCalledTimes(1);
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "server:reposition-ships",{ roomName: ROOM_NAME, player: PLAYER_ID }
      )
    }
  )
})