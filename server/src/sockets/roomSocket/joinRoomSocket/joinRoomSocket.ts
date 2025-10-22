import { Server, Socket } from "socket.io";
import { roomStore } from "../../../data/store";
import { getRoomsList, isInRoom } from "../../utils";

export function registerJoinRoomSocket(io: Server, socket: Socket) {
  socket.on("server:join-room", (room: string) => {
    const roomData = roomStore.getRoom(room)
    
    if (!roomData) {
      socket.emit("room_not_found", { room, message: `Room '${room}' does not exist.` })
      return;
    } 
    if (isInRoom(io, socket.id, room)) {
      socket.emit("already_in_room", { room, message: `You are already in room '${room}'` });
      return;
    } 
    if (roomData.size >= 2) {
      socket.emit("room_full", { room, message: `Room '${room}' is already full.` });
      return; 
    }

    socket.join(room);
    roomStore.updateRoom(
      room, 
      {
        size: roomData.size + 1,
        members: [...roomData.members, socket.id]
      }
    )

    socket.emit("room:you-joined", {
      room,
      message: `You joined room '${room}'`,
      ownerId: roomData.owner,

    })
    socket.to(room).emit('room:someone-joined', {
      room,  
      message: `Player '${socket.id}' has just joined room '${room}'`,
      playerId: socket.id
    })
    // update other players lists so they know that given room is no longer available
    socket.emit("rooms:list", getRoomsList())
    socket.broadcast.emit("rooms:list", getRoomsList())
    
    console.log(`Player '${socket.id}' has just joined room '${room}'`  )
  });
}