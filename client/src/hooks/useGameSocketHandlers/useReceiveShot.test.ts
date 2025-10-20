import { act } from "@testing-library/react";
import { useSocket } from "@/context/SocketContext";
import { resetGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult"
import { useReceiveShot } from "./useReceiveShot"

const PLAYER_ID = "player_1";
const ROOM_NAME = "room_1";

jest.mock("@/context/SocketContext");

describe("useReceiveShot", () => {
  
  let result: HookResult<typeof useReceiveShot>;
  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }

  beforeAll(() => {
    result = getHookResult(useReceiveShot);
  })

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    act(() => {
      useRoomStore.getState().setPlayer(PLAYER_ID);
      useRoomStore.getState().setRoom(ROOM_NAME);
      resetGameStore();
    })
    jest.clearAllMocks();
  })

  test("receiveMissedShot", () => {
    
    act(() => result.current.receiveMissedShot(1,1));

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "server:shot-result",
      { player: PLAYER_ID, roomName: ROOM_NAME, value: "missed", row: 1, column: 1 }
    )
  })

})