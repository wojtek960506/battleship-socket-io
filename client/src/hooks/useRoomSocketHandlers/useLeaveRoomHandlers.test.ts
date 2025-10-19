import { act } from "@testing-library/react";
import { useSocket } from "@/context/SocketContext";
import { resetRoomStore, useRoomStore } from "@/store/RoomStore";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult";
import { useLeaveRoomHandlers } from "./useLeaveRoomHandlers";

jest.mock("@/context/SocketContext");

describe("test useLeaveRoomHandlers", () => {
  let result: HookResult<typeof useLeaveRoomHandlers>;
  const mockSocket = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    resetRoomStore();
    jest.clearAllMocks();
    result = getHookResult(useLeaveRoomHandlers);
  });

  test("handleYouLeftRoom", () => {
    act(() => result.current.handleYouLeftRoom())
    
    const roomState = useRoomStore.getState();
    expect(roomState.status).toBe("idle");
    expect(roomState.errorMessage).toBe("");
    expect(roomState.roomName).toBeNull();
    expect(roomState.players).toHaveLength(0);
  })

  test("handleSomeoneLeftRoom", () => {
    const PLAYER_1 = 'player1'
    const PLAYER_2 = 'player2'
    act(() => useRoomStore.getState().setPlayers([{ id: PLAYER_1 }, { id: PLAYER_2 }]));

    const args = { playerId: PLAYER_2, message: '' }
    act(() => result.current.handleSomeoneLeftRoom(args))

    const roomState = useRoomStore.getState();
    expect(roomState.status).toBe("waiting");
    expect(roomState.playerWhoLeft).toBe(args.playerId)
    expect(roomState.players).toEqual([{ id: PLAYER_1 }]);
  })
})