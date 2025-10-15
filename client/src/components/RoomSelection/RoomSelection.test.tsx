import { screen } from "@testing-library/react";
import { useRoomStore } from "@/store/RoomStore";
import { renderWithMockSocket } from "@/test-utils/renderWithMockSocket";
import { RoomSelection } from "./RoomSelection";

describe("RoomSelection with socket mock", () => {
  let mockSocket = { emit: jest.fn() };

  test("emit socket event to get list of rooms after render", () => {
    renderWithMockSocket(<RoomSelection />, mockSocket);

    expect(mockSocket.emit).toHaveBeenCalledWith("server:list-rooms")
  })

  test("choosing room when room name is not set yet", () => {
    useRoomStore.setState({ roomName: null });
    renderWithMockSocket(<RoomSelection />, mockSocket);

    const createRoomButton = screen.queryByTestId("create-room-btn");
    const leaveRoomButton = screen.queryByTestId("leave-room-btn");

    expect(createRoomButton).toBeInTheDocument();
    expect(leaveRoomButton).not.toBeInTheDocument();
  })

  test("waiting room when room name is set", () => {
    useRoomStore.setState({ roomName: 'room1' });
    renderWithMockSocket(<RoomSelection />, mockSocket);

    const leaveRoomButton = screen.queryByTestId("leave-room-btn");
    const createRoomButton = screen.queryByTestId("create-room-btn");

    expect(leaveRoomButton).toBeInTheDocument();
    expect(createRoomButton).not.toBeInTheDocument();
  })
})