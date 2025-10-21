import { act, screen } from "@testing-library/react";
import { useRoomStore } from "@/store/RoomStore";
import { ROOM_NAME } from "@/test-utils/constants";
import { renderWithMockSocket } from "@/test-utils/renderWithMockSocket";
import { Game } from "./Game";

describe("Game", () => {
  
  let mockSocket: { emit: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = { emit: jest.fn() }
  })

  test("click leave room button", () => {
    act(() => useRoomStore.getState().setRoom(ROOM_NAME))
    renderWithMockSocket(<Game />, mockSocket);

    const leaveRoomButton = screen.queryByTestId("leave-room-btn-game");
    expect(leaveRoomButton).toBeInTheDocument();
    
    act(() => leaveRoomButton?.click());
    expect(mockSocket.emit).toHaveBeenCalledTimes(1);
    expect(mockSocket.emit).toHaveBeenCalledWith("server:leave-room", ROOM_NAME);
  })

})