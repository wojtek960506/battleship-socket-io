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

  it.each([
    ["subscribes", "mount", "on", false],
    ["unsubscribes", "unmount", "off", true],
  ])('%s to socket events on $s', 
    (_title1, _title2, method, isUnmounting) => {
    const { unmount } = render(<GameSocketHandler />);
    if (isUnmounting) unmount();

    expect(mockSocket[method as "on" | "off"]).toHaveBeenCalledWith(
      "player:board-set",
      handlers.handleBoardSet
    );
    expect(mockSocket[method as "on" | "off"]).toHaveBeenCalledWith(
      "player:reposition-ships",
      handlers.handleRepositionShips
    );
    expect(mockSocket[method as "on" | "off"]).toHaveBeenCalledWith(
      "player:receive-shot",
      handlers.handleReceiveShot
    );
    expect(mockSocket[method as "on" | "off"]).toHaveBeenCalledWith(
      "player:receive-shot-result",
      handlers.handleReceiveShotResult
    );
  })


  
})