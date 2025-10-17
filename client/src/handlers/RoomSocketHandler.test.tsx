import { act } from "@testing-library/react";
import { resetRoomStore, useRoomStore } from "@/store/RoomStore";
import { renderWithMockSocket } from "@/test-utils/renderWithMockSocket"
import { triggerSocketEvent, type MockSocketType } from "@/test-utils/testHelpers";
import { RoomSocketHandler } from "./RoomSocketHandler"


describe("test RoomSocketHandler", () => {

  let mockSocket: MockSocketType;

  beforeEach(() => {
    mockSocket = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };
    resetRoomStore();
    jest.clearAllMocks();
  })

  // TODO add tests as in GameSocketHandler.test.tsx and then helper function

  // moved to useRoomSocketHandlers.test.ts
  // test("handling 'room:set-player'", () => {
  //   renderWithMockSocket(<RoomSocketHandler />, mockSocket);
  //   const PLAYER_ID = 'player1'

  //   triggerSocketEvent(mockSocket, "room:set-player", PLAYER_ID);

  //   const roomState = useRoomStore.getState();
  //   expect(roomState.player).toBe(PLAYER_ID);

  // })

  // moved to useRoomSocketHandlers.test.ts
  // test("handling 'room:created'", () => {
  //   renderWithMockSocket(<RoomSocketHandler />, mockSocket);
  //   const args = {
  //     room: "roomName",
  //     playerId: "player1"
  //   }

  //   triggerSocketEvent(mockSocket, "room:created", args);

  //   const roomState = useRoomStore.getState();
  //   expect(roomState.roomName).toBe(args.room);
  //   expect(roomState.players).toStrictEqual([{ id: args.playerId }]);
  //   expect(roomState.status).toBe("waiting");
  //   expect(roomState.errorMessage).toBe("");
  //   expect(roomState.playerWhoLeft).toBe(null);
  //   expect(mockSocket.emit).toHaveBeenCalledTimes(2);
  //   expect(mockSocket.emit).toHaveBeenNthCalledWith(1, "server:list-rooms")
  //   expect(mockSocket.emit).toHaveBeenNthCalledWith(2, "server:list-rooms-for-everyone")
  // })

  // // moved to useRoomSocketHandlers.test.ts
  // test("handling 'room:already-exists", () => {
  //   renderWithMockSocket(<RoomSocketHandler />, mockSocket);
  //   const args = { message: 'error' }

  //   triggerSocketEvent(mockSocket, "room:already-exists", args);

  //   const roomState = useRoomStore.getState();
  //   expect(roomState.errorMessage).toBe(args.message);
  // })

  // moved to useJoinRoomHandlers.test.ts
  // test("handling 'room:you-joined", () => {
  //   const PLAYER_ID = 'player2'
  //   act(() => useRoomStore.getState().setPlayer(PLAYER_ID));
  //   renderWithMockSocket(<RoomSocketHandler />, mockSocket);
  //   const args = { room: 'room1', ownerId: '123' }
    
  //   triggerSocketEvent(mockSocket, "room:you-joined", args);

  //   const roomState = useRoomStore.getState();
  //   expect(roomState.roomName).toBe(args.room);
  //   expect(roomState.status).toBe("ready");
  //   expect(roomState.errorMessage).toBe('');
  //   expect(roomState.player).toBe(PLAYER_ID);
  //   expect(roomState.players).toEqual([{ id: args.ownerId }, { id: PLAYER_ID }]);
  // })

  // moved to useJoinRoomHandlers.test.ts
  // test("handling 'room:someone-joined", () => {
  //   const PLAYER_ID = 'player2'
  //   act(() => useRoomStore.getState().setPlayer(PLAYER_ID));
  //   renderWithMockSocket(<RoomSocketHandler />, mockSocket);
  //   const args = { playerId: 'player1' }
    
  //   triggerSocketEvent(mockSocket, "room:someone-joined", args);

  //   const roomState = useRoomStore.getState();
  //   expect(roomState.status).toBe("ready");
  //   expect(roomState.players).toEqual([{ id: PLAYER_ID }, { id: args.playerId }]);
  // })

  test("handling 'room:you-left", () => {
    renderWithMockSocket(<RoomSocketHandler />, mockSocket);
    
    triggerSocketEvent(mockSocket, "room:you-left", {});

    const roomState = useRoomStore.getState();
    expect(roomState.status).toBe("idle");
    expect(roomState.errorMessage).toBe("");
    expect(roomState.roomName).toBeNull();
    expect(roomState.players).toHaveLength(0);
  })

  test("handling 'room:someone-left", () => {
    const PLAYER_1 = 'player1'
    const PLAYER_2 = 'player2'

    act(() => useRoomStore.getState().setPlayers([{ id: PLAYER_1 }, { id: PLAYER_2 }]));
    renderWithMockSocket(<RoomSocketHandler />, mockSocket);
    const args = { playerId: PLAYER_2 }
    
    triggerSocketEvent(mockSocket, "room:someone-left", args);

    const roomState = useRoomStore.getState();
    expect(roomState.status).toBe("waiting");
    expect(roomState.playerWhoLeft).toBe(args.playerId)
    expect(roomState.players).toEqual([{ id: PLAYER_1 }]);
  })
})
