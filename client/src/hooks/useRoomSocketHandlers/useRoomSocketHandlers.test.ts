import { act, renderHook } from "@testing-library/react";
import { useSocket } from "@/context/SocketContext";
import { resetRoomStore, useRoomStore } from "@/store/RoomStore"
import { useRoomSocketHandlers } from "./useRoomSocketHandlers";

jest.mock("@/context/SocketContext");

describe("test useRoomSocketHandlers" , () => {
  const mockSocket = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    resetRoomStore();
    jest.clearAllMocks();
  });

  test("handleSetPlayer", () => {
    const { result } = renderHook(() => useRoomSocketHandlers());
    expect(useRoomStore.getState().player).toBeNull();

    const player_id = 'player_id'
    act(() => result.current.handleSetPlayer(player_id));

    expect(useRoomStore.getState().player).toBe(player_id);
  })

  test("handleRoomCreated", () => {
    const args = { room: "roomName", playerId: "player1", message: "" };
    const { result } = renderHook(() => useRoomSocketHandlers());

    act(() => result.current.handleCreatedRoom(args));

    const roomState = useRoomStore.getState();
    expect(roomState.roomName).toBe(args.room);
    expect(roomState.players).toStrictEqual([{ id: args.playerId }]);
    expect(roomState.status).toBe("waiting");
    expect(roomState.errorMessage).toBe("");
    expect(roomState.playerWhoLeft).toBe(null);
    expect(mockSocket.emit).toHaveBeenCalledTimes(2);
    expect(mockSocket.emit).toHaveBeenNthCalledWith(1, "server:list-rooms")
    expect(mockSocket.emit).toHaveBeenNthCalledWith(2, "server:list-rooms-for-everyone")
  })

  test("handleRoomAlreadyExists", () => {
    const args = { message: 'error' };
    const { result } = renderHook(() => useRoomSocketHandlers());

    act(() => result.current.handleRoomAlreadyExists(args));

    expect(useRoomStore.getState().errorMessage).toBe(args.message);
  })

})