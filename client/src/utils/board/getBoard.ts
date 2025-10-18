import { BOARD_SIZE } from "@/constants";
import { type BoardCellType, type BoardType, type Cell, type Ship } from "@/types";

export const getEmptyBoard = (): BoardCellType[][] => (
  Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("empty"))
);

export const getUpdatedBoard = (
  board: BoardType,
  cells: Cell[],
  value: BoardCellType
) => {
  // create a copy of board
  const newBoard = board.map(row => [...row]);
  cells.forEach(({row, column}) => {
    newBoard[row][column] = value;
  })
  return newBoard;
}

export const getBoardPlacingShip = (board: BoardType, ship: Ship) => {
  const newBoard = board.map(row => [...row]);

  ship.cells.forEach(({column, row}) => {
    newBoard[row][column] = "taken"
  })

  return newBoard;
}

export const getBoardRemovingShip = (board: BoardType, ship: Ship) => {
  const newBoard = board.map(row => [...row]);

  ship.cells.forEach(({column, row}) => {
    newBoard[row][column] = "empty"
  })

  return newBoard;
}