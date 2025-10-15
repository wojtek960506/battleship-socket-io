import { resetRoomsStore, useRoomsStore } from "@/store/RoomsStore";
import { renderWithMockSocket } from "@/test-utils/renderWithMockSocket";
import { triggerSocketEvent, type MockSocketType } from "@/test-utils/testHelpers";
import { RoomsSocketHandler } from "./RoomsSocketHandler";

describe("test RoomsSocketHandler", () => {
  
  let mockSocket: MockSocketType;

  beforeEach(() => {
    mockSocket = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };
    resetRoomsStore();
    jest.clearAllMocks();
  })

  test("handling 'rooms:list'", () => {
    const roomsList = [
      { name: "r1", owner: "p1", size: 1 },
      { name: "r2", owner: "p2", size: 1 },
      { name: "r3", owner: "p3", size: 2 },

    ]
    renderWithMockSocket(<RoomsSocketHandler />, mockSocket);
    

    triggerSocketEvent(mockSocket, "rooms:list", roomsList);
    
    const roomsState = useRoomsStore.getState()
    expect(roomsState.rooms).toEqual(roomsList);
  })
})