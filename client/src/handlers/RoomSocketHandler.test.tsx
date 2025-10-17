import { render } from "@testing-library/react";
import { useSocket } from "@/context/SocketContext";
import { useRoomSocketHandlers } from "@/hooks/useRoomSocketHandlers/useRoomSocketHandlers";
import { RoomSocketHandler } from "./RoomSocketHandler"

jest.mock("@/context/SocketContext");
jest.mock("@/hooks/useRoomSocketHandlers/useRoomSocketHandlers");

describe("test RoomSocketHandler", () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
  };

  const handlers = {
    handleSetPlayer: jest.fn(),
    handleCreatedRoom: jest.fn(),
    handleRoomAlreadyExists: jest.fn(),
    handleYouJoinedRoom: jest.fn(),
    handleSomeoneJoinedRoom: jest.fn(),
    handleYouLeftRoom: jest.fn(),
    handleSomeoneLeftRoom: jest.fn(),
  };

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    (useRoomSocketHandlers as jest.Mock).mockReturnValue(handlers);
    jest.clearAllMocks();
  });


  it.each<[description: string, method: "on" | "off"]>([
    ["subscribes to socket events on mount", "on"],
    ["unsubscribes to socket events on unmount", "off"],
  ])('%s', (_desc, method) => {
    const { unmount } = render(<RoomSocketHandler />);
    if (method === "off") unmount();

    const events = [
      ["room:set-player", handlers.handleSetPlayer],
      ["room:created", handlers.handleCreatedRoom],
      ["room:already-exists", handlers.handleRoomAlreadyExists],
      ["room:you-joined", handlers.handleYouJoinedRoom],
      ["room:someone-joined", handlers.handleSomeoneJoinedRoom],
      ["room:you-left", handlers.handleYouLeftRoom],
      ["room:someone-left", handlers.handleSomeoneLeftRoom],
    ]

    for (const [event, handler] of events) {
      expect(mockSocket[method]).toHaveBeenCalledWith(event, handler);
    }

    expect(mockSocket[method]).toHaveBeenCalledTimes(events.length);
  })
})
