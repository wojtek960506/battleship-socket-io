import { Server, Socket } from "socket.io";
import { roomStore } from "../data/store";
import { getRoomsList } from "./utils";

export function registerRoomSocket(io: Server, socket: Socket) {

  const isInRoom = (socketId: string, room: string) => {
    const roomMembers = io.sockets.adapter.rooms.get(room);
    return roomMembers ? roomMembers.has(socketId) : false;
  }

  socket.on("server:create-room", (room: string) => {
    if (!roomStore.getRoom(room)) {
      roomStore.createRoom(room, socket.id);

      // joining new room
      socket.join(room)
      socket.emit("room:created", {
        room,
        message: `You have just created and joined room '${room}'`,
        playerId: socket.id,
      });
    } else {
      socket.emit("room:already-exists", {
        room,
        message: `Room with name '${room}' already exists`
      })
    }
  })

  socket.on("server:list-rooms", () => {
    socket.emit("rooms:list", getRoomsList());
    socket.emit("room:set-player", socket.id);
  });

  socket.on("server:list-rooms-for-everyone", () => {
    socket.broadcast.emit("rooms:list", getRoomsList())
  })

  socket.on("server:join-room", (room: string) => {
    const roomData = roomStore.getRoom(room)
    
    if (!roomData) {
      socket.emit("room_not_found", { room, message: `Room '${room}' does not exist.` })
      return;
    } 
    if (isInRoom(socket.id, room)) {
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

  socket.on("server:leave-room", (room: string) => {
    const roomData = roomStore.getRoom(room)

    if (!roomData) {
      socket.emit("room_not_found", { room, message: `Room '${room}' does not exist.` });
      return;
    } 
    if (!isInRoom(socket.id, room)) {
      socket.emit("not_in_room", { room, message: `You are not in a room '${room}'` });
      return;
    }

    socket.leave(room);
    // delete room if leaving user is the last one within it
    if (roomData.size === 1) {
      roomStore.deleteRoom(room)
      socket.emit("rooms:list", getRoomsList())
      socket.broadcast.emit("rooms:list", getRoomsList())
    } else {
      const newMembers = roomData.members.filter(m => m !== socket.id);
      roomStore.updateRoom(room, {
        size: newMembers.length,
        members: newMembers,
        owner: newMembers[0]
      })
    }
    socket.emit("room:you-left", {
      room,
      message: `Player with ID: '${socket.id}' left room '${room}'`,
      playerId: socket.id
    })
    socket.to(room).emit("room:someone-left", {
      room,
      message: `Player with ID: '${socket.id}' left room '${room}'`,
      playerId: socket.id
    })

    // update lists after leaving because new room is available
    socket.emit("rooms:list", getRoomsList())
    socket.broadcast.emit("rooms:list", getRoomsList())

    console.log(`Player with ID: '${socket.id}' left room '${room}'`)
  })


}