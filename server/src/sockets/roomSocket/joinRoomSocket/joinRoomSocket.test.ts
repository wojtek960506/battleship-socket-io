import { beforeEach, describe, expect, it, Mock, vi } from "vitest"
import { registerJoinRoomSocket } from "./joinRoomSocket";
import { roomStore } from "@/data/store";
import { Server, Socket } from "socket.io";

vi.mock("@/data/store");

type MockSocketType = {
  on: any,
  emit: any,
  join: any,
  to: any,
  broadcast: any,
}

type MockIoType = {
  sockets: {
    adapter: {
      rooms:  Map<string, string[]>
    }
  }
}


describe("joinRoomSocket - handle `server:join-room`", () => {

  let mockSocket: MockSocketType;
  let mockIo: MockIoType;
  const emitMock = vi.fn();

  const getMockedIo = (rooms: Map<string, string[]>) => ({
    sockets: { adapter: { rooms } }
  })

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      join: vi.fn(),
      to: vi.fn(() => ({ emit: emitMock })),
      broadcast: { emit: emitMock }
    }
  })

  it("emit event when room not found", () => {
    (roomStore.getRoom as Mock).mockReturnValue(undefined)
    
    registerJoinRoomSocket((getMockedIo(new Map()) as unknown) as Server, mockSocket as Socket)

    const handler = mockSocket.on.mock.calls
      .find((c: string[]) => c[0] === "server:join-room")?.[1];
    handler('room');

    expect(mockSocket.emit).toHaveBeenCalledTimes(1);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "room:not-found", { room: 'room', message: expect.any(String) }
    )
  })

  
})