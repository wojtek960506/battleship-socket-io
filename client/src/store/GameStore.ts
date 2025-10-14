import { create } from "zustand";
import { getEmptyBoard, getDefaultShips } from "@/helpers/utils";
import type { BoardCellType, BoardType, GameStatus, Ship } from "@/helpers/types";


type GameState = {
  yourBoard: BoardType;
  opponentBoard: BoardType;
  currentPlayer: string | null;
  ships: Ship[];
  gameStatus: GameStatus;
  winner: string | null;
  chosenShipId: number | null;
  isOtherBoardSet: boolean;

  // actions
  setYourBoard: (newBoard: BoardCellType[][]) => void;
  setOpponentBoard: (newBoard: BoardCellType[][]) => void;
  setShips: (ships: Ship[]) => void;
  setWinner: (winner: string) => void;
  setGameStatus: (gameStatus: GameStatus) => void;
  setChosenShipId: (chosenShipId: number | null) => void;
  setIsOtherBoardSet: (isOtherBoardSet: boolean) => void;
  setCurrentPlayer: (currentPlayer: string | null) => void;
  setYourBoardAndShips: (yourBoard: BoardType, ships: Ship[]) => void;
}

const initialGameState: Omit<
  GameState,
  "setYourBoard" |
  "setOpponentBoard" |
  "setShips" |
  "setWinner" |
  "setGameStatus" |
  "setChosenShipId" |
  "setIsOtherBoardSet" |
  "setCurrentPlayer" |
  "setYourBoardAndShips"
> = {
  yourBoard: getEmptyBoard(),
  opponentBoard: getEmptyBoard(),
  currentPlayer: null,
  ships: getDefaultShips(),
  gameStatus: "setting-board",
  winner: null,
  chosenShipId: null,
  isOtherBoardSet: false,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialGameState,
 
  setYourBoard: (yourBoard: BoardCellType[][]) => set({ yourBoard }),

  setOpponentBoard: (opponentBoard: BoardCellType[][]) => set({ opponentBoard }),

  setWinner: (winner: string | null) => set({ winner }),

  setGameStatus: (gameStatus: GameStatus) => set({ gameStatus }),

  setChosenShipId: (chosenShipId: number | null) => set({ chosenShipId }),

  setIsOtherBoardSet: (isOtherBoardSet: boolean) => set({ isOtherBoardSet }),

  setCurrentPlayer: (currentPlayer: string | null) => set({ currentPlayer }),

  setYourBoardAndShips: (yourBoard: BoardType, ships: Ship[]) => set(
    { yourBoard, ships }
  ),

  setShips: (ships: Ship[]) => set({ ships }),
}));

export const resetGameStore = () => useGameStore.setState(initialGameState);
