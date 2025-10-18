import { create } from "zustand";
import { getEmptyBoard } from "@/utils/board";
import { getDefaultShips } from "@/utils/general";
import type { BoardCellType, BoardType, GameStatus, Ship } from "@/utils/types";


type GameState = {
  ships: Ship[];
  yourBoard: BoardType;
  winner: string | null;
  gameStatus: GameStatus;
  isOtherBoardSet: boolean;
  opponentBoard: BoardType;
  chosenShipId: number | null;
  currentPlayer: string | null;
  
  // actions
  setShips: (ships: Ship[]) => void;
  setWinner: (winner: string) => void;
  setGameStatus: (gameStatus: GameStatus) => void;
  setYourBoard: (newBoard: BoardCellType[][]) => void;
  setChosenShipId: (chosenShipId: number | null) => void;
  setIsOtherBoardSet: (isOtherBoardSet: boolean) => void;
  setOpponentBoard: (newBoard: BoardCellType[][]) => void;
  setCurrentPlayer: (currentPlayer: string | null) => void;
  setYourBoardAndShips: (yourBoard: BoardType, ships: Ship[]) => void;
}

const initialGameState: Omit<
  GameState,
  "setShips" |
  "setWinner" |
  "setYourBoard" |
  "setGameStatus" |
  "setChosenShipId" |
  "setCurrentPlayer" |
  "setOpponentBoard" |
  "setIsOtherBoardSet" |  
  "setYourBoardAndShips"
> = {
  winner: null,
  chosenShipId: null,
  currentPlayer: null,
  isOtherBoardSet: false,
  ships: getDefaultShips(),
  yourBoard: getEmptyBoard(),
  gameStatus: "setting-board",
  opponentBoard: getEmptyBoard(),
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
