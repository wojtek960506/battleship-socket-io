import { Room } from "@/types/socketTypes";


class RoomStore {
  private rooms: Map<string, Room> = new Map();
  
  createRoom(name: string, owner: string) {
    if (this.rooms.has(name)) throw new Error("Room already exists");
    const room: Room = {
      name,
      owner,
      size: 1,
      members: [owner],
      messages: [],
    };
    this.rooms.set(name, room);
    return { ...room };
  }

  getRoom(name: string) {
    const room = this.rooms.get(name);
    return room ? {...room} : undefined;
  }

  getRooms() {
    return Array.from(this.rooms.values());
  }

  updateRoom(name: string, data: Partial<Room>) {
    const existing = this.rooms.get(name);
    if (!existing) return;
    this.rooms.set(name, { ...existing, ...data });
  }

  deleteRoom(name: string) {
    this.rooms.delete(name);
  }

  resetStore() {
    this.rooms.clear(); // = new Map();
  }
}

export const roomStore = new RoomStore();