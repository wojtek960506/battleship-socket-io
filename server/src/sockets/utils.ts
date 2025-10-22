import { Server } from "socket.io";
import { roomStore } from "@/data/store";

export const getRoomsList = () => roomStore.getRooms();

export const isInRoom = (io: Server, socketId: string, room: string) => {
    const roomMembers = io.sockets.adapter.rooms.get(room);
    return roomMembers ? roomMembers.has(socketId) : false;
  }