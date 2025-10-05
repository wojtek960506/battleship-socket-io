import { act } from "@testing-library/react";
import { renderWithMockSocket } from "../context/renderWithMockSocket"
import { useRoomStore } from "../store/RoomStore";
import { RoomSocketHandler } from "./RoomSocketHandler"

type MockSocketType = {
  emit: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
}

const socketEventHandler = (mockSocket: MockSocketType, eventName: string) => {
  return mockSocket.on.mock.calls
    .find(([name]) => name === eventName)![1]
}

describe("test RoomSocketHandler", () => {

  const mockSocket: MockSocketType = { emit: jest.fn(), on: jest.fn(), off: jest.fn() }

  

  test("handling 'room:set-player'", () => {

    renderWithMockSocket(<RoomSocketHandler />, mockSocket);

    const handler = socketEventHandler(mockSocket, "room:set-player");
    const PLAYER_ID = 'player1'

    act(() => handler(PLAYER_ID)); 

    const roomState = useRoomStore.getState();
    expect(roomState.player).toBe(PLAYER_ID);
  })
})