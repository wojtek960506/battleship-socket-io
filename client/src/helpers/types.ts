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
  sunkCells: ShipCell[];
  isFinished: boolean;
}

export type ReceiveShotType = {
  column: number;
  row: number;
  playerFromServer: string
}

export type BoardCellType = "empty" | "hit" | "sunk" | "missed" | "taken";

export type Direction = "horizontal" | "vertical"

export type ShipStatus = "not-placed" | "placed" | "sunk"

export type ShipCell = { column: number, row: number }

export type BoardType = BoardCellType[][];

export type Ship = {
  id: number;
  direction: Direction;
  startColumn: number | null // in UI: 1,2,...
  startRow: number | null // in UI: A,B,...
  length: number
  cells: ShipCell[] // maybe for easier detection of sunk
  surroundingCells: ShipCell[],
  hitCells: ShipCell[],
  status: ShipStatus
}