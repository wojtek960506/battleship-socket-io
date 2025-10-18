import { BOARD_SIZE } from "@/constants";
import { type BoardCellType } from "../types";

export const getEmptyBoard = (): BoardCellType[][] => (
  Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("empty"))
);