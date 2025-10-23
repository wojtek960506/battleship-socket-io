import { beforeEach, describe, expect, it, vi } from "vitest";
import { Socket } from "socket.io";
import { registerGameSocket } from "./gameSocket";

type MockSocketType = {
  on: any,
  emit: any,
  join: any,
  to: any,
  broadcast: any,
}

describe("gameSocket", () => {

  let mockSocket: MockSocketType;
  const emitMock = vi.fn();

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      join: vi.fn(),
      to: vi.fn(() => ({ emit: emitMock })),
      broadcast: vi.fn()
    }
    vi.clearAllMocks();

    registerGameSocket(mockSocket as Socket)
  })

  it("handle `server:send-shot` event", () => {
    const handler = mockSocket.on.mock.calls
      .find((c: string[]) => c[0] === "server:send-shot")?.[1];
    handler({ roomName: 'room', player: 'player', row: 1, column: 1})

    expect(mockSocket.to).toHaveBeenCalledTimes(1);
    expect(mockSocket.to).toHaveBeenCalledWith('room');
    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith(
      "player:receive-shot", 
      { playerFromServer: 'player', row: 1, column: 1 }
    );
  })

  it("handle `server:board-set` event", () => {
    const handler = mockSocket.on.mock.calls
      .find((c: string[]) => c[0] === "server:board-set")?.[1];
    handler({ roomName: 'room', player: 'player'})

    expect(mockSocket.to).toHaveBeenCalledTimes(1);
    expect(mockSocket.to).toHaveBeenCalledWith('room');
    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith(
      "player:board-set", 
      { otherPlayer: 'player' }
    );
  })
  



})