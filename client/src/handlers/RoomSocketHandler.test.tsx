import { act } from "@testing-library/react";
import { renderWithMockSocket } from "../context/renderWithMockSocket"
import { resetRoomStore, useRoomStore } from "../store/RoomStore";
import { RoomSocketHandler } from "./RoomSocketHandler"

type MockSocketType = {
  emit: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
}

const triggerSocketEvent = (mockSocket: MockSocketType, eventName: string, args: any) => {
  const handler = mockSocket.on.mock.calls
    .find(([name]) => name === eventName)?.[1];
  if (!handler) throw new Error(`Handler for '${eventName}' not found`);

  act(() => handler(args))
}

describe("test RoomSocketHandler", () => {

  let mockSocket: MockSocketType;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };
    resetRoomStore();
  })


  test("handling 'room:set-player'", () => {
    renderWithMockSocket(<RoomSocketHandler />, mockSocket);
    const PLAYER_ID = 'player1'

    triggerSocketEvent(mockSocket, "room:set-player", PLAYER_ID);

    const roomState = useRoomStore.getState();
    expect(roomState.player).toBe(PLAYER_ID);

  })

  test("handling 'room:created'", () => {
    renderWithMockSocket(<RoomSocketHandler />, mockSocket);
    const args = {
      room: "roomName",
      playerId: "player1"
    }

    triggerSocketEvent(mockSocket, "room:created", args);

    const roomState = useRoomStore.getState();
    expect(roomState.roomName).toBe(args.room);
    expect(roomState.players).toStrictEqual([{ id: args.playerId }]);
    expect(roomState.status).toBe("waiting");
    expect(roomState.errorMessage).toBe("");
    expect(roomState.playerWhoLeft).toBe(null);
  })

  test("handling 'room:already-exists", () => {
    renderWithMockSocket(<RoomSocketHandler />, mockSocket);
    const args = { message: 'error' }

    triggerSocketEvent(mockSocket, "room:already-exists", args);

    const roomState = useRoomStore.getState();
    expect(roomState.errorMessage).toBe(args.message);
  })

  test("handling 'room:you-joined", () => {
    const PLAYER_ID = 'player2'
    act(() => useRoomStore.getState().setPlayer(PLAYER_ID));
    renderWithMockSocket(<RoomSocketHandler />, mockSocket);
    const args = { room: 'room1', ownerId: '' }
    
    triggerSocketEvent(mockSocket, "room:you-joined", args);

    const roomState = useRoomStore.getState();
    expect(roomState.roomName).toBe(args.room);
    expect(roomState.status).toBe("ready");
    expect(roomState.errorMessage).toBe('');
    expect(roomState.player).toBe(PLAYER_ID);
    expect(roomState.players).toEqual([{ id: args.ownerId }, { id: PLAYER_ID }]);
  })
})