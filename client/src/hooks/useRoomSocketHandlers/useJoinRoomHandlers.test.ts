import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { useSocket } from "@/context/SocketContext";
import { resetRoomStore, useRoomStore } from "@/store/RoomStore";
import { useJoinRoomHandlers } from "./useJoinRoomHandlers"

jest.mock("@/context/SocketContext");

describe("test useJoinRoomHandlers", () => {
  type HookReturn = ReturnType<typeof useJoinRoomHandlers>;
  let result: RenderHookResult<HookReturn, undefined>["result"];
  const mockSocket = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    resetRoomStore();
    jest.clearAllMocks();
    const hook = renderHook(() => useJoinRoomHandlers());
    result = hook.result;
  });

  test("handleYouJoinedRoom", () => {
    const PLAYER_ID = 'player2'
    act(() => useRoomStore.getState().setPlayer(PLAYER_ID));

    const args = { room: 'room1', ownerId: '123', message: '' }
    act(() => result.current.handleYouJoinedRoom(args))

    const roomState = useRoomStore.getState();
    expect(roomState.roomName).toBe(args.room);
    expect(roomState.status).toBe("ready");
    expect(roomState.errorMessage).toBe('');
    expect(roomState.player).toBe(PLAYER_ID);
    expect(roomState.players).toEqual([{ id: args.ownerId }, { id: PLAYER_ID }]);
  })

  test("handleSomeoneJoinedRoom", () => {
    const PLAYER_ID = 'player2'
    act(() => useRoomStore.getState().setPlayer(PLAYER_ID));

    const args = { playerId: 'player1', message: '' };
    act(() => result.current.handleSomeoneJoinedRoom(args));
    
    const roomState = useRoomStore.getState();
    expect(roomState.status).toBe("ready");
    expect(roomState.players).toEqual([{ id: PLAYER_ID }, { id: args.playerId }]);
  })
})