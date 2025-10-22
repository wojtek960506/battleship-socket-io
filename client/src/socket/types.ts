import type { BoardCellType, Cell, Room } from "@/types";

type SendShotData = {
  roomName: string;
  player: string;
  row: number;
  column: number;
}

type ReceiveShotData = Omit<SendShotData, "roomName" | "player"> & {
  playerFromServer: string;
}

type ReceiveShotResultData = Omit<ShotResultData, "roomName" | "player"> & {
  playerFromServer: string
}

type ShotResultData = {
  roomName: string;
  column: number;
  row: number;
  player: string;
  value: BoardCellType;
  sunkCells: Cell[];
  isFinished: boolean;
}

type RoomNamePlayer = { roomName: string, player: string }

// Events sent from client to server
export interface ClientToServerEvents {
  "server:create-room": (roomName: string) => void;
  "server:list-rooms": () => void;
  "server:list-rooms-for-everyone": () => void;
  "server:join-room": (room: string) => void;
  "server:leave-room": (room: string) => void;
  "server:send-shot": (data: SendShotData) => void;
  "server:shot-result": (data: ShotResultData) => void;
  "server:board-set": (data: RoomNamePlayer) => void;
  "server:reposition-ships": (data: RoomNamePlayer) => void;
}

// Events sent from client to server
export interface ServerToClientEvents {
  "room:created": (data: { room: string, message: string, playerId: string}) => void;
  "room:already-exists": (data: {room: string, message: string}) => void;
  "rooms:list": (rooms: Room[]) => void;
  "room:set-player": (playerId: string) => void;
  "room:not-found": (data: { room: string, message: string }) => void;
  "room:already-in": (data: { room: string, message: string }) => void;
  "room:is-full": (data: { room: string, message: string }) => void;
  "room:you-joined": (data: { room: string, message: string, ownerId: string }) => void;
  "room:someone-joined": (data: { room: string, message: string, playerId: string }) => void;
  "room:not-in": (data: { room: string, message: string }) => void;
  "room:you-left": (data: { room: string, message: string, playerId: string }) => void;
  "room:someone-left": (data: { room: string, message: string, playerId: string }) => void;
  "player:receive-shot": (data: ReceiveShotData) => void;
  "player:receive-shot-result": (data: ReceiveShotResultData) => void;
  "player:board-set": (data: { otherPlayer: string }) => void;
  "player:reposition-ships": (data: { otherPlayer: string }) => void;
}