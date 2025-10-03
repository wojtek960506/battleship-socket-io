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
  owner: string;
  size: number;
  messages: MessageData[];
}

const roomsMetadata: Map<string, RoomData> = new Map();

type MoveSendData = {
  room: string;
  column: number;
  row: number;
  playerFromServer: string
}

type MoveReplyData = {
  room: string;
  column: number;
  row: number;
  playerFromServer: string;
  shotType: typeof ShotType;
}

const isInRoom = (socketId: string, room: string) => {
  const roomMembers = io.sockets.adapter.rooms.get(room);
  if (!roomMembers) return false;
  return roomMembers.has(socketId);
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("create_room", (room) => {
    if (!roomsMetadata.get(room)) {
      // joining new room
      socket.join(room)
      roomsMetadata.set(room, { owner: socket.id, size: 1, messages: []})
      socket.emit("room_created", {
        room,
        message: `You have just created and joined room '${room}'`
      });
    } else {
      socket.emit("room_exists", {
        room,
        message: `Room with name '${room}' already exists`
      })
    }
  })

  socket.on("get_rooms", () => {
    socket.emit("rooms_map", [...roomsMetadata.entries()])
  })

  socket.on("join_room", (room) => {
    const roomData = roomsMetadata.get(room)
    
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
      socket.join(room);
      roomsMetadata.set(room, {...roomData, size: roomData.size + 1})
      socket.emit('you_joined_room', {
        room,
        message: `You have just joined room '${room}'`
      })
      socket.to(room).emit('someone_joined_room', {
        room,  
        message: `'${socket.id}' has just joined room '${room}'`
      })
    }
  });

  socket.on("leave_room", (room: string) => {
    const roomData = roomsMetadata.get(room)

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

    socket.leave(room);
    if (roomData.size === 1) {
      roomsMetadata.delete(room)
    } else {
      roomsMetadata.set(room, {...roomData, size: roomData.size - 1})
    }
    socket.emit('you_left_room', {
      room,
      message: `You have just left room '${room}'`
    })
    socket.to(room).emit('someone_left_room', {
      room,
      message: `'${socket.id}' has just left room '${room}`}
    )
  })

  socket.on("shot", ({ 
    room,
    column,
    row,
    playerFromServer,

  }: MoveSendData) => {
    socket.to(room).emit(
      "receive_shot",
      { column, row, playerFromServer}
    )
  })

  socket.on("reply", ({
    room,
    column,
    row,
    playerFromServer,
    shotType
  }: MoveReplyData) => {
    socket.to(room).emit(
      "shot_result",
      { column, row, playerFromServer, shotType }
    )
  })


  socket.on("disconnecting", () => {
    console.log("socket disconnecting")
    const rooms = io.sockets.adapter.rooms
    console.log(rooms);
    for (const room of rooms) {
      console.log("room", room)
      console.log("room size", room[1].size)
    }

    console.log("socket rooms", socket.rooms)
  })
})

server.listen(3001, () => {
  console.log("SERVER IS RUNNING")
})