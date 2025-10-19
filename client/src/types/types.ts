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
  messages: MessageData[];
}

export type RoomsData = Map<string, RoomData>;

export type ReceiveShotResultType = {
  column: number;
  row: number;
  value: BoardCellType;
  playerFromServer: string;
  sunkCells: Cell[];
  isFinished: boolean;
}

export type ReceiveShotType = {
  column: number;
  row: number;
  playerFromServer: string
}

export type BoardCellType = "empty" | "hit" | "sunk" | "missed" | "taken";

export type BoardType = BoardCellType[][];

export type Direction = "horizontal" | "vertical"

export type ShipStatus = "not-placed" | "placed" | "sunk"

export type Cell = { column: number, row: number }

export type Ship = {
  id: number;
  direction: Direction;
  startColumn: number | null // in UI: 1,2,...
  startRow: number | null // in UI: A,B,...
  length: number
  cells: Cell[] // maybe for easier detection of sunk
  surroundingCells: Cell[],
  hitCells: Cell[],
  status: ShipStatus
}

export type GameStatus = "setting-board" | "board-set" | "playing" | "finished";

export type Room = {
  name: string;
  owner: string;
  size: number;
}