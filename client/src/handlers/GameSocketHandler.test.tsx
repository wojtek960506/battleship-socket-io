import { render } from "@testing-library/react";
import { useSocket } from "@/context/SocketContext";
import { useGameSocketHandlers } from "@/hooks/useGameSocketHandlers/useGameSocketHandlers";
import { GameSocketHandler } from "./GameSocketHandler";

jest.mock("@/context/SocketContext");
jest.mock("@/hooks/useGameSocketHandlers/useGameSocketHandlers");



describe("GameSocketHandler", () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
  };

  const handlers = {
    handleBoardSet: jest.fn(),
    handleRepositionShips: jest.fn(),
    handleReceiveShot: jest.fn(),
    handleReceiveShotResult: jest.fn(),
  };

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    (useGameSocketHandlers as jest.Mock).mockReturnValue(handlers);
    jest.clearAllMocks();
  });


  it.each<[description: string, method: "on" | "off"]>([
    ["subscribes to socket events on mount", "on"],
    ["unsubscribes to socket events on unmount", "off"],
  ])('%s', (_desc, method) => {
    const { unmount } = render(<GameSocketHandler />);
    if (method === "off") unmount();

    const events = [
      ["player:board-set", handlers.handleBoardSet],
      ["player:reposition-ships", handlers.handleRepositionShips],
      ["player:receive-shot", handlers.handleReceiveShot],
      ["player:receive-shot-result", handlers.handleReceiveShotResult],
    ]

    for (const [event, handler] of events) {
      expect(mockSocket[method]).toHaveBeenCalledWith(event, handler);
    }

    expect(mockSocket[method]).toHaveBeenCalledTimes(events.length);
  })
  
})