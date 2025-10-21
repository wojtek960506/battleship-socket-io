export type MessageData = {
  senderId: string;
  message: string;
  order: number;
  time: string;
  date: string;
}

export type RoomData = {
  name: string;
  owner: string;
  size: number;
  members: string[];
  messages: MessageData[];
}

export type MoveSendData = {
  roomName: string;
  player: string;
  row: number;
  column: number;
}

export type BoardCellType = "empty" | "hit" | "sunk" | "missed" | "taken";

export type ShipCell = { row: number, column: number }

export type ShotResultData = {
  roomName: string;
  column: number;
  row: number;
  player: string;
  value: BoardCellType;
  sunkCells: ShipCell[];
  isFinished: boolean;
}

export type RoomNamePlayer = { roomName: string, player: string }