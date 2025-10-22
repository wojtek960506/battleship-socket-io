export type Message = {
  senderId: string;
  message: string;
  order: number;
  time: string;
  date: string;
}

export type Room = {
  name: string;
  owner: string;
  size: number;
  members: string[];
  messages?: Message[];
}

export type SendShotData = {
  roomName: string;
  player: string;
  row: number;
  column: number;
}

export type ReceiveShotData = Omit<SendShotData, "roomName" | "player"> & {
  playerFromServer: string;
}

export type ReceiveShotResultData = Omit<ShotResultData, "roomName" | "player"> & {
  playerFromServer: string
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