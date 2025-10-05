import { renderWithMockSocket } from "../../helpers/renderWithMockSocket";
import { useRoomStore } from "../../store/RoomStore";
import { WaitingRoom } from "./WaitingRoom";
import { fireEvent, screen } from "@testing-library/react";


describe("WaitingRoom with mocked socket", () => {
  let mockSocket: { emit: jest.Mock }

  const ROOM_NAME = 'room'

  const initialRoomStoreState = {
      roomName: ROOM_NAME,
      playerWhoLeft: null
    }

  beforeEach(() => {
    mockSocket = { emit: jest.fn() };

    // setup room store state
    useRoomStore.setState(initialRoomStoreState)
  })

  test("emits 'server:leave-room' on leave button click" , () => {
    renderWithMockSocket(<WaitingRoom />, mockSocket);
    const leaveButton = screen.getByTestId("leave-room-btn")

    fireEvent.click(leaveButton);
    expect(mockSocket.emit).toHaveBeenCalledWith("server:leave-room", ROOM_NAME)
  })

  test("shows proper text when getting into waiting room after room creation", () => {
    renderWithMockSocket(<WaitingRoom />, mockSocket);
    const textRoomCreated = screen.queryByTestId("text-room-created")

    expect(textRoomCreated).toBeInTheDocument()
  })

  test("shows proper text when getting into waiting room after other player left room", () => {
    useRoomStore.setState({...initialRoomStoreState, playerWhoLeft: "player2"})
    renderWithMockSocket(<WaitingRoom />, mockSocket);
    
    const textRoomCreated = screen.queryByTestId("text-player-left")

    expect(textRoomCreated).toBeInTheDocument()
  })
})