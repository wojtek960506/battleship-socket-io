import { act } from "@testing-library/react";
import { resetRoomStore, useRoomStore } from "@/store/RoomStore";
import { OTHER_PLAYER_ID, PLAYER_ID, ROOM_NAME } from "@/test-utils/constants";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult";
import { useJoinRoomHandlers } from "./useJoinRoomHandlers"

describe("test useJoinRoomHandlers", () => {
  let result: HookResult<typeof useJoinRoomHandlers>;

  beforeEach(() => {
    resetRoomStore();
    jest.clearAllMocks();
    result = getHookResult(useJoinRoomHandlers);
  });

  test("handleYouJoinedRoom", () => {
    act(() => useRoomStore.getState().setPlayer(PLAYER_ID));

    const args = { room: ROOM_NAME, ownerId: OTHER_PLAYER_ID, message: '' }
    act(() => result.current.handleYouJoinedRoom(args))

    const roomState = useRoomStore.getState();
    expect(roomState.roomName).toBe(ROOM_NAME);
    expect(roomState.status).toBe("ready");
    expect(roomState.errorMessage).toBe('');
    expect(roomState.player).toBe(PLAYER_ID);
    expect(roomState.players).toEqual([{ id: OTHER_PLAYER_ID }, { id: PLAYER_ID }]);
  })

  test("handleSomeoneJoinedRoom", () => {
    act(() => useRoomStore.getState().setPlayer(OTHER_PLAYER_ID));

    const args = { playerId: PLAYER_ID, message: '' };
    act(() => result.current.handleSomeoneJoinedRoom(args));
    
    const roomState = useRoomStore.getState();
    expect(roomState.status).toBe("ready");
    expect(roomState.players).toEqual([{ id: OTHER_PLAYER_ID }, { id: PLAYER_ID }]);
  })
})