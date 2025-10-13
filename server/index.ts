import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://192.168.0.213:5173"
    ],
    methods: ["GET", "POST"],
  },
});

const ShotType = {
  HIT: "hit",
  SUNK: "sunk",
  MISSED: "missed"
} as const;


type MessageData = {
  senderId: string;
  message: string;
  order: number;
  time: string;
  date: string;
}

type RoomData = {
  name: string;
  owner: string;
  size: number;
  members: string[];
  messages: MessageData[];
}

const roomsMetadata: Map<string, RoomData> = new Map();

type MoveSendData = {
  roomName: string;
  player: string;
  row: number;
  column: number;
}

type BoardCellType = "empty" | "hit" | "sunk" | "missed" | "taken";
type ShipCell = { row: number, column: number }

type ShotResultData = {
  roomName: string;
  column: number;
  row: number;
  player: string;
  value: BoardCellType;
  sunkCells: ShipCell[];
  isFinished: boolean;
}

const isInRoom = (socketId: string, room: string) => {
  const roomMembers = io.sockets.adapter.rooms.get(room);
  if (!roomMembers) return false;
  return roomMembers.has(socketId);
}

const getRoomsList = () => {
  return [...roomsMetadata.values()]
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("server:create-room", (room) => {
    if (!roomsMetadata.get(room)) {
      // joining new room
      socket.join(room)
      roomsMetadata.set(room, { name: room, owner: socket.id, members:[socket.id], size: 1, messages: []})
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
  })

  socket.on("server:list-rooms-for-everyone", () => {
    socket.broadcast.emit("rooms:list", getRoomsList())
  })

  socket.on("server:join-room", (room) => {
    const roomData = roomsMetadata.get(room)
    
    console.log('server:join-room:', room)

    if (!roomData) {
      socket.emit("room_not_found", {
        room,
        message: `Room with name '${room}' does not exist.`
      })
    } else if (isInRoom(socket.id, room)) {
      socket.emit("already_in_room", {
        room,  
        message: `You are already in room with name '${room}'`
      })
    } else if (roomData.size > 1) {
      socket.emit("room_full", {
        room,
        message: `Room with name '${room}' is already full.`
        }
      )
    } else {

      console.log('actual joining')
      socket.join(room);
      roomsMetadata.set(room, {
        ...roomData,
        size: roomData.size + 1,
        members: [...roomData.members, socket.id]
      })

      socket.emit("room:you-joined", {
        room,
        message: `Player with ID: '${socket.id}' joined room '${room}'`,
        ownerId: roomsMetadata.get(room)?.owner,

      })
      socket.to(room).emit('room:someone-joined', {
        room,  
        message: `'${socket.id}' has just joined room '${room}'`,
        playerId: socket.id
      })
      // update other players lists so they know that given room is no longer available
      socket.emit("rooms:list", getRoomsList())
      socket.broadcast.emit("rooms:list", getRoomsList())

      
    }
    console.log('joining room', roomsMetadata)
  });

  socket.on("server:leave-room", (room: string) => {
    const roomData = roomsMetadata.get(room)

    console.log('leave-room', socket.id)

    if (!roomData) {
      socket.emit("room_not_found", {
        room,
        message: `Room with name '${room}' does not exist.`
      })
      return
    } else if (!isInRoom(socket.id, room)) {
      socket.emit("not_in_room", {
        room,
        message: `You are not in a room with name '${room}'`
      })
      return
    }

    console.log('actual-leaving')

    socket.leave(room);
    // delete room if leaving user is the last one within it
    if (roomData.size === 1) {
      roomsMetadata.delete(room)
      socket.emit("rooms:list", getRoomsList())
      socket.broadcast.emit("rooms:list", getRoomsList())
    } else {
      const newMembers = [...roomData.members].filter(m => m !== socket.id)
      roomsMetadata.set(room, {
        ...roomData,
        size: roomData.size - 1,
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

    console.log('leaving room', roomsMetadata)
  })

  socket.on("server:send-shot", ({ 
    roomName,
    player,
    column,
    row,
  }: MoveSendData) => {
    socket.to(roomName).emit(
      "player:receive-shot",
      { row, column, playerFromServer: player }
    )
  })

  socket.on("server:shot-result", ({
    roomName,
    player,
    column,
    row,
    value,
    sunkCells,
    isFinished,
  }: ShotResultData) => {
    socket.to(roomName).emit(
      "player:receive-shot-result",
      { playerFromServer: player, column, row, value, sunkCells, isFinished }
    )
  })

  type RoomNamePlayer = { roomName: string, player: string }

  socket.on("server:board-set", ({ roomName, player }: RoomNamePlayer) => {
    console.log(`Player '${player}' set its board in room '${roomName}'`)
    socket.to(roomName).emit('player:board-set', { otherPlayer: player })
  })

  socket.on("server:reposition-ships", ({ roomName, player }: RoomNamePlayer) => {
    console.log(`Player '${player}' is repositioning its ships in room '${roomName}'`)
    socket.to(roomName).emit('player:reposition-ships', { otherPlayer: player })
  })

  socket.on("disconnecting", () => {
    console.log(`User Disconnected: ${socket.id}`);
    const rooms = io.sockets.adapter.rooms

    console.log('roomsMetadata', roomsMetadata)
    
    for (const [roomName, members] of rooms.entries()) {
      if (members.has(socket.id)) {
        const roomFromMetadata = roomsMetadata.get(roomName)

        if (roomFromMetadata) { 
          if (roomFromMetadata.size < 2) {
            roomsMetadata.delete(roomName)
          } else {
            const newMembers = [...roomFromMetadata.members].filter(m => m !== socket.id)
            roomsMetadata.set(roomName, {
              ...roomFromMetadata,
              size: roomFromMetadata.size - 1,
              members: newMembers,
              owner: newMembers[0]
            })
            // other members of this room has to be informed that room was left
            socket.to(roomName).emit('room:someone-left', {
              roomName,
              message: `'${socket.id}' has just left room '${roomName}`,
              playerId: socket.id,
            })
          }
        }
      }
    }
    
    // update all rooms with changes
    socket.broadcast.emit("rooms:list", getRoomsList())
  })
})

server.listen(3001, () => {
  console.log("SERVER IS RUNNING")
})