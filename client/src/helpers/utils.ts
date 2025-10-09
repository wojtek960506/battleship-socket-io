export type BoardCellType = "empty" | "hit" | "sunk" | "missed" | "taken";

export type Direction = "horizontal" | "vertical"

export type ShipStatus = "not-placed" | "placed" | "sunk"

export type ShipCells = { column: number, row: number }

export type BoardType = BoardCellType[][];

export const BOARD_SIZE = 10;

export type Ship = {
  id: number;
  direction: Direction;
  startColumn: number | null // in UI: 1,2,...
  startRow: number | null // in UI: A,B,...
  length: number
  cells: ShipCells[] // maybe for easier detection of sunk
  status: ShipStatus
}

export const getEmptyBoard = (): BoardCellType[][] => (
  Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("empty"))
);

export const getDefaultShips = (): Ship[] => (
  [5,4,3,3,2].map((length, i) => ({
    id: i,
    direction: "horizontal",
    startColumn: null,
    startRow: null,
    length,
    cells: [],
    status: "not-placed"
  }))
)

export const calculateShipCells = (ship: Ship): ShipCells[] => {
  let shipCells: ShipCells[] = [];

  for (let i = 0 ; i < ship.length ; i++) {
    let column = ship.startColumn!;
    let row = ship.startRow!;

    if (ship.direction === "horizontal") {
      column = ship.startColumn! + i
    } else {
      row = ship.startRow! + i
    }

    shipCells.push({ column, row })
  }
  
  return shipCells;
}

export const getPlacedShip = (ship: Ship, startRow: number, startColumn: number ) => {
  let newShip: Ship = { ...ship, startColumn, startRow, status: "placed" };

  const cells = calculateShipCells(newShip)

  return { ...newShip, cells }
}

export const getRemovedShip = (ship: Ship): Ship => {
  return {
    ...ship,
    startColumn: null,
    startRow: null,
    cells: [],
    status: "not-placed"
  }
}

export const getBoardPlacingShip = (board: BoardType, ship: Ship) => {
  // copy of board as it is mostly coming from store
  const newBoard = board.map(row => [...row]);

  ship.cells.forEach(({column, row}) => {
    newBoard[row][column] = "taken"
  })

  return newBoard;
}

export const getBoardRemovingShip = (board: BoardType, ship: Ship) => {
  // copy of board as it is mostly coming from store
  const newBoard = board.map(row => [...row]);

  ship.cells.forEach(({column, row}) => {
    newBoard[row][column] = "empty"
  })

  return newBoard;
}

const classMapBoardCell: Record<BoardCellType, string> = {
  hit: "hit-cell",
  sunk: "sunk-cell",
  missed: "missed-cell",
  taken: "taken-cell",
  empty: "empty-cell",
};

export const getBoardCellClass = (boardCell: BoardCellType): string => {
  return classMapBoardCell[boardCell];
}
