// test/utils.test.ts
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getRoomsList, isInRoom } from '@/sockets/utils';
import { roomStore } from '@/data/store';
import { Server } from "socket.io";

// Mock the store module
vi.mock('@/data/store', () => {
  return {
    roomStore: {
      getRooms: vi.fn(),
    },
  };
});

vi.mock("socket.io", () => {
  return {
    Server: {
      sockets: {
        adapter: {
          rooms: {
            get: vi.fn()
          }
        }
      }
    }
  }
})

describe('getRoomsList', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset mocks before each test
  });

  it('should return rooms from roomStore', () => {
    const mockRooms = [
      { name: 'Room1', owner: 'Alice', size: 1, members: ['Alice'], messages: [] },
      { name: 'Room2', owner: 'Bob', size: 2, members: ['Bob', 'Charlie'], messages: [] },
    ];

    // Mock getRooms() to return our fake data
    (roomStore.getRooms  as Mock).mockReturnValue(mockRooms);

    const result = getRoomsList();

    expect(roomStore.getRooms).toHaveBeenCalled(); // ensure the method was called
    expect(result).toEqual(mockRooms); // ensure it returns mocked data
  });
});

describe("isInRoom", () => {
  const ROOM_1 = 'room1';
  const ROOM_2 = 'room2';
  const SOCKET_1 = 'socket1';
  const SOCKET_2 = 'socket2';
  const SOCKET_3 = 'socket3';
  const mockRoomMembers = new Set([SOCKET_1, SOCKET_2]);
  const io = {
    sockets: {
      adapter: {
        rooms: new Map([[ROOM_1, mockRoomMembers]])
      }
    }
  } as Server;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Socket is not in room", () => {
    expect(isInRoom(io, SOCKET_3, ROOM_1)).toBeFalsy();
  })

  it("Socket is in room", () => {
    expect(isInRoom(io, SOCKET_1, ROOM_1)).toBeTruthy();
    expect(isInRoom(io, SOCKET_2, ROOM_1)).toBeTruthy();
  })

  it("Room not found", () => {
    expect(isInRoom(io, SOCKET_1, ROOM_2)).toBeFalsy();
  })
})
