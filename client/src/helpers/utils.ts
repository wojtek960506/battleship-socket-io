export type BoardCellType = "empty" | "hit" | "sunk" | "missed" | "taken";

export type Direction = "horizontal" | "vertical"

export type ShipStatus = "not-placed" | "placed" | "sunk"

export type ShipCell = { column: number, row: number }

export type BoardType = BoardCellType[][];

export const BOARD_SIZE = 10;

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
    surroundingCells: [],
    hitCells: [],
    status: "not-placed"
  }))
)

type AllShipCells = {
  shipCells: ShipCell[];
  surroundingCells: ShipCell[];
}

export const calculateShipCells = (ship: Ship): AllShipCells => {
  let shipCells: ShipCell[] = [];
  let surroundingCells: ShipCell[] = [];

  for (let i = 0 ; i < ship.length ; i++) {
    let column = ship.startColumn!;
    let row = ship.startRow!;

    if (ship.direction === "horizontal") {
      column = ship.startColumn! + i

      surroundingCells.push({ row: row - 1, column })
      surroundingCells.push({ row: row + 1, column })
    } else {
      row = ship.startRow! + i

      surroundingCells.push({ row, column: column - 1 })
      surroundingCells.push({ row, column: column + 1 })
    }

    shipCells.push({ column, row })
  }

  const startRow = ship.startRow!
  const startColumn = ship.startColumn!
  if (ship.direction === "horizontal") {
    [-1, 0, 1].forEach(num => {
      surroundingCells.push({ row: startRow + num, column: startColumn - 1 })
      surroundingCells.push({ row: startRow + num, column: startColumn + ship.length })
    });
  } else {
    [-1, 0, 1].forEach(num => {
      surroundingCells.push({ row: startRow -1, column: startColumn + num })
      surroundingCells.push({ row: startRow + ship.length, column: startColumn + num })
    });
  }

  return { shipCells, surroundingCells };
}

export const getPlacedShip = (ship: Ship, startRow: number, startColumn: number ) => {
  let newShip: Ship = { ...ship, startColumn, startRow, status: "placed" };

  const { shipCells, surroundingCells } = calculateShipCells(newShip)

  return { ...newShip, cells: shipCells, surroundingCells }
}

export const getRemovedShip = (ship: Ship): Ship => {
  return {
    ...ship,
    startColumn: null,
    startRow: null,
    cells: [],
    surroundingCells: [],
    status: "not-placed",
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

export const findShip = (ships: Ship[], row: number, column: number) => (
  ships.find(s => isInShipCells(s.cells, row, column))
)

export const isInShipCells = (cells: ShipCell[], row: number, column: number) => (
  cells.some(cell => cell.row === row && cell.column === column)
)

export const areAllCellsHit = (ship: Ship) => {
  if (ship.cells.length !== ship.hitCells.length) return false;

  for (const hitCell of ship.hitCells) {
    if (!isInShipCells(ship.cells, hitCell.row, hitCell.column)) return false;
  }
  return true;
}

export const getShipsAfterShot = (ships: Ship[], row: number, column: number) => {
  const hitShip = findShip(ships, row, column);
  if (!hitShip) return { shipsAfterShot: ships, hitShip };

  const hitShipCopy = {...hitShip}
  
  if (isInShipCells(hitShipCopy.cells, row, column)) {
    hitShipCopy.hitCells.push({ row, column });
  }

  if (areAllCellsHit(hitShipCopy)) hitShipCopy.status = "sunk";

  return { 
    shipsAfterShot: ships.map(s => s.id === hitShipCopy.id ? hitShipCopy : s),
    hitShip: hitShipCopy,
  }
}
