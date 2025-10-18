import { BOARD_SIZE } from "@/constants";
import { type BoardCellType, type BoardType, type Cell } from "@/types";

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