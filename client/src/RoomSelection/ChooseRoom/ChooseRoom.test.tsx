import { type ReactNode } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { useRoomsStore } from "../../store/RoomsStore";
import { ChooseRoom } from "./ChooseRoom";
import { SocketContext } from "../../context/SocketContext";


describe("RoomSelection with mocked socket", () => {
  let mockSocket: { emit: jest.Mock }

  beforeEach(() => {
    mockSocket = { emit: jest.fn() };
  
    // setup room store state
    useRoomsStore.setState({
      rooms: [
        { name: "Room1", owner: "Player1", size: 1},
        { name: "Room2", owner: "Player2", size: 2},
        { name: "Room3", owner: "Player3", size: 1}
      ],
    });
  });

  const renderWithMockSocket = (ui: ReactNode) =>
    render(<SocketContext.Provider value={mockSocket as any}>{ui}</SocketContext.Provider>)

    test("emits 'server:join-room' on join click", () => {
      renderWithMockSocket(<ChooseRoom />);
      const roomItem = screen.getByText("Room1").closest("li")!;
      const joinButton = within(roomItem).getByRole("button")
      
      fireEvent.click(joinButton);
      expect(mockSocket.emit).toHaveBeenCalledWith("server:join-room", 'Room1')
    })

    test("shows only rooms which are not full", () => {
      renderWithMockSocket(<ChooseRoom />);

      const listElements = screen.getAllByRole("listitem");

      expect(listElements).toHaveLength(2);
      
      const room2 = screen.queryByText('Room2');
      expect(room2).not.toBeInTheDocument();
    })
    
    test("does not emit 'server:create-room' on create click", () => {
      renderWithMockSocket(<ChooseRoom />);
      const createButton = screen.getByTestId("create-room-btn")
      fireEvent.click(createButton);
      expect(mockSocket.emit).toHaveBeenCalledTimes(0)
    })

    test("emits 'server:create-room' on create click", async () => {
      renderWithMockSocket(<ChooseRoom />);
      const roomNameInput = screen.getByTestId("input-room-name")
      const createButton = screen.getByTestId("create-room-btn")

      const newRoomName = "Room4"
      await userEvent.type(roomNameInput, newRoomName)
      expect(roomNameInput).toHaveValue(newRoomName)
      fireEvent.click(createButton);
      expect(mockSocket.emit).toHaveBeenCalledWith("server:create-room", newRoomName)
    })
})