import type { BoardCellType } from "@/types";

export const getBoardCellClass = (boardCell: BoardCellType): string => {
  const classMapBoardCell: Record<BoardCellType, string> = {
    hit: "hit-cell",
    sunk: "sunk-cell",
    missed: "missed-cell",
    taken: "taken-cell",
    empty: "empty-cell",
  };
  
  return classMapBoardCell[boardCell];
}