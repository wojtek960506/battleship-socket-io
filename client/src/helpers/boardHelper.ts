import type { BoardCellType, BoardType, Cell } from "./types";

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