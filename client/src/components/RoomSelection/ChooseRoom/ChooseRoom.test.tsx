import { screen, fireEvent, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRoomsStore } from "@/store/RoomsStore";
import { renderWithMockSocket } from "@/test-utils/renderWithMockSocket";
import { ChooseRoom } from "./ChooseRoom";


describe("ChooseRoom with mocked socket", () => {
  let mockSocket: { emit: jest.Mock }

  beforeEach(() => {
    mockSocket = { emit: jest.fn() };
  
    // setup rooms store state
    useRoomsStore.setState({
      rooms: [
        { name: "Room1", owner: "Player1", size: 1},
        { name: "Room2", owner: "Player2", size: 2},
        { name: "Room3", owner: "Player3", size: 1}
      ],
    });
  });


  test("emits 'server:join-room' on join click", () => {
    renderWithMockSocket(<ChooseRoom />, mockSocket);
    const roomItem = screen.getByText("Room1").closest("li")!;
    const joinButton = within(roomItem).getByRole("button")
    
    fireEvent.click(joinButton);
    expect(mockSocket.emit).toHaveBeenCalledWith("server:join-room", 'Room1')
  })

  test("shows only rooms which are not full", () => {
    renderWithMockSocket(<ChooseRoom />, mockSocket);

    const listElements = screen.getAllByRole("listitem");

    expect(listElements).toHaveLength(2);
    
    const room2 = screen.queryByText('Room2');
    expect(room2).not.toBeInTheDocument();
  })
  
  test("does not emit 'server:create-room' on create click", () => {
    renderWithMockSocket(<ChooseRoom />, mockSocket);
    const createButton = screen.getByTestId("create-room-btn")
    fireEvent.click(createButton);
    expect(mockSocket.emit).toHaveBeenCalledTimes(0)
  })

  test("emits 'server:create-room' on create click", async () => {
    renderWithMockSocket(<ChooseRoom />, mockSocket);
    const roomNameInput = screen.getByTestId("input-room-name")
    const createButton = screen.getByTestId("create-room-btn")

    const newRoomName = "Room4"
    await userEvent.type(roomNameInput, newRoomName)
    expect(roomNameInput).toHaveValue(newRoomName)
    fireEvent.click(createButton);
    expect(mockSocket.emit).toHaveBeenCalledWith("server:create-room", newRoomName)
  })
})