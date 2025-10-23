import { describe, it, expect, beforeEach } from "vitest";
import { roomStore } from "./store";

describe("test store", () => {

  const ROOM_NAME_1 = "room1";
  const ROOM_NAME_2 = "room2";
  const PLAYER_1 = "player1";
  const PLAYER_2 = "player2";

  beforeEach(() => {
    roomStore.resetStore();
  })

  it("should create a room and retrieve it successfully", () => {
    const roomBeforeCreating = roomStore.getRoom(ROOM_NAME_1);
    expect(roomBeforeCreating).toBeUndefined();

    const createdRoom = roomStore.createRoom(ROOM_NAME_1, PLAYER_1);
    const roomAfterCreating = roomStore.getRoom(ROOM_NAME_1);

    expect(createdRoom).toEqual(roomAfterCreating);
    expect(createdRoom.size).toBe(1);
    expect(createdRoom.members).toEqual([PLAYER_1])
  })

  it("should update room with new members and size", () => {
    roomStore.createRoom(ROOM_NAME_1, PLAYER_1);

    const newMembers = [PLAYER_2, PLAYER_1]
    roomStore.updateRoom(
      ROOM_NAME_1,
      { members: newMembers, size: newMembers.length, owner: PLAYER_2 }
    );

    const roomAfterUpdate = roomStore.getRoom(ROOM_NAME_1);
    expect(roomAfterUpdate?.members).toEqual(newMembers);
    expect(roomAfterUpdate?.size).toBe(2);
    expect(roomAfterUpdate?.owner).toBe(PLAYER_2);
  });

  it("should get all rooms after creating them", () => {
    roomStore.createRoom(ROOM_NAME_1, PLAYER_1);
    roomStore.createRoom(ROOM_NAME_2, PLAYER_2);

    const rooms = roomStore.getRooms();
    expect(rooms).toHaveLength(2);
    expect(rooms.map(r => r.name)).toEqual([ROOM_NAME_1, ROOM_NAME_2]);
  })

  it("should delete room and not show it when getting rooms", () => {
    roomStore.createRoom(ROOM_NAME_1, PLAYER_1);
    roomStore.createRoom(ROOM_NAME_2, PLAYER_2);
    const rooms = roomStore.getRooms();
    expect(rooms).toHaveLength(2);
    expect(rooms.map(r => r.name)).toEqual([ROOM_NAME_1, ROOM_NAME_2]);

    roomStore.deleteRoom(ROOM_NAME_2);
    const roomsAfterDeletion = roomStore.getRooms();
    expect(roomsAfterDeletion).toHaveLength(1);
    expect(roomsAfterDeletion.map(r => r.name)).toEqual([ROOM_NAME_1]);
  })

  it("should throw error when creating room with the same name", () => {
    roomStore.createRoom(ROOM_NAME_1, PLAYER_1);
    expect(roomStore.getRoom(ROOM_NAME_1)).not.toBeUndefined();

    expect(() => roomStore.createRoom(ROOM_NAME_1, PLAYER_2)).toThrow(Error);
  })

  it("when updating not existing room it has no effect", () => {
    expect(roomStore.getRooms()).toHaveLength(0);

    roomStore.updateRoom(ROOM_NAME_1, { owner: PLAYER_1 });

    expect(roomStore.getRooms()).toHaveLength(0);
  })

})