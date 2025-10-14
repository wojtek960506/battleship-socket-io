import { create } from "zustand";
import { 
  getEmptyBoard,  
  getDefaultShips,
  getPlacedShip,
  getBoardPlacingShip,
  getBoardRemovingShip,
  getRemovedShip
} from "@/helpers/utils";
import type { BoardCellType, BoardType, Direction, Ship } from "@/helpers/types";

type GameStatus = "setting-board" | "board-set" | "playing" | "finished"


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
  setOpponentBoardCell: (row:number, column: number, value: BoardCellType) => void;
  setYourBoardCell: (row:number, column: number, value: BoardCellType) => void;
  setShips: (newShips: Ship[]) => void;
  updateShipsDirection: (ids: number[], direction: Direction) => void;
  placeShipOnBoard: (id: number, startRow: number, startColumn: number) => void;
  removeShipFromBoard: (id: number) => void;
  moveShipOnBoard: (id: number, startRow: number, startColumn: number) => void;
  setWinner: (winner: string) => void;
  setGameStatus: (gameStatus: GameStatus) => void;
  setChosenShipId: (chosenShipId: number | null) => void;
  setIsOtherBoardSet: (isOtherBoardSet: boolean) => void;
  setCurrentPlayer: (currentPlayer: string | null) => void;
}

const initialGameState: Omit<
  GameState,
  "setYourBoard" |
  "setOpponentBoard" |
  "setOpponentBoardCell" |
  "setYourBoardCell" |
  "setShips" |
  "updateShipsDirection" |
  "placeShipOnBoard" |
  "removeShipFromBoard" |
  "moveShipOnBoard" |
  "setWinner" |
  "setGameStatus" |
  "setChosenShipId" |
  "setIsOtherBoardSet" |
  "setCurrentPlayer"
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
 
  setYourBoard: (newBoard: BoardCellType[][]) => set({ yourBoard: newBoard }),

  setOpponentBoard: (newBoard: BoardCellType[][]) => set({ opponentBoard: newBoard }),

  setWinner: (winner: string | null) => set({ winner }),

  setGameStatus: (gameStatus: GameStatus) => set({ gameStatus }),

  setChosenShipId: (chosenShipId: number | null) => set({ chosenShipId }),

  setIsOtherBoardSet: (isOtherBoardSet: boolean) => set({ isOtherBoardSet }),

  setCurrentPlayer: (currentPlayer: string | null) => set({ currentPlayer }),

  // TODO add some helper function as both functions below are almost the same
  setOpponentBoardCell: (row: number, column: number, value: BoardCellType) => set(state => ({
    opponentBoard: state.opponentBoard.map((stateRow, i) => {
      if (i !== row) return stateRow;
      return stateRow.map((stateValue, j) => {
        if (j === column) return value
        return stateValue
      })
    })
  })),

  setYourBoardCell: (row: number, column: number, value: BoardCellType) => set(state => ({
    yourBoard: state.yourBoard.map((stateRow, i) => {
      if (i !== row) return stateRow;
      return stateRow.map((stateValue, j) => {
        if (j === column) return value
        return stateValue
      })
    })
  })),

  setShips: (newShips: Ship[]) => set({ ships: newShips }),

  // should be used only for ships which are not yet placed
  updateShipsDirection: (ids: number[], direction: Direction) => set(state => ({
    ships: state.ships.map(ship => 
      ids.includes(ship.id) ? { ...ship, direction }  : ship
    )
  })),

  placeShipOnBoard: (id: number, startRow: number, startColumn: number) => set(state => {
    const ship = state.ships.find(s => s.id === id)
    if (!ship) return state;

    const placedShip = getPlacedShip(ship, startRow, startColumn);
    const yourBoard = getBoardPlacingShip(state.yourBoard, placedShip);
    const ships = state.ships.map(s => (s.id === id ? placedShip : s))
    return { yourBoard, ships }
  }),

  removeShipFromBoard: (id: number) => set(state => {
    const ship = state.ships.find(s => s.id === id)
    if (!ship) return state;

    const yourBoard = getBoardRemovingShip(state.yourBoard, ship)
    const removedShip = getRemovedShip(ship)
    const ships = state.ships.map(s => (s.id === id ? removedShip : s))
    return { yourBoard, ships }
  }),

  moveShipOnBoard: (id: number, startRow: number, startColumn: number) => set(state => {
    const ship = state.ships.find(s => s.id === id)
    if (!ship) return state;

    let yourBoard = getBoardRemovingShip(state.yourBoard, ship)
    const removedShip = getRemovedShip(ship)
    const placedShip = getPlacedShip(removedShip, startRow, startColumn);
    yourBoard = getBoardPlacingShip(yourBoard, placedShip);
    const ships = state.ships.map(s => s.id === id ? placedShip : s)
    return { yourBoard, ships }
  }),

}));

export const resetGameStore = () => useGameStore.setState(initialGameState);
