import { RoomData } from "@/types/socketTypes";


class RoomStore {
  private rooms: Map<string, RoomData> = new Map();
  
  createRoom(name: string, owner: string) {
    if (this.rooms.has(name)) throw new Error("Room already exists");
    const room: RoomData = {
      name,
      owner,
      size: 1,
      members: [owner],
      messages: [],
    };
    this.rooms.set(name, room);
    return room;
  }

  getRoom(name: string) {
    return this.rooms.get(name);
  }

  getRooms() {
    return Array.from(this.rooms.values());
  }

  updateRoom(name: string, data: Partial<RoomData>) {
    const existing = this.rooms.get(name);
    if (!existing) return;
    this.rooms.set(name, { ...existing, ...data });
  }

  deleteRoom(name: string) {
    this.rooms.delete(name);
  }
}

export const roomStore = new RoomStore();