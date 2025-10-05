import { create } from "zustand";
import { 
  getEmptyBoard,
  type FieldType,
  type Direction,
  type Ship,
  getDefaultShips
} from "../helpers/utils";



type Board = FieldType[][];





type GameState = {
  yourBoard: Board;
  opponentBoard: Board;
  currentPlayer: string | null;
  ships: Ship[];

  // actions
  setYourBoard: (newBoard: FieldType[][]) => void;
  setOpponentBoard: (newBoard: FieldType[][]) => void;
  setOpponentBoardField: (column: number, row: number, value: FieldType) => void;
  setShips: (newShips: Ship[]) => void;
  updateShip: (id: number, direction: Direction, startColumn: number, startRow: number) => void;
  updateShipDirection: (id: number, direction: Direction) => void;
  updateShipsDirection: (ids: number[], direction: Direction) => void;
  updateShipCoordinates: (id: number, startColumn: number, startRow: number) => void;
}

const initialGameState: Omit<
  GameState,
  "setYourBoard" |
  "setOpponentBoard" |
  "setOpponentBoardField" |
  "setShips" |
  "updateShip" |
  "updateShipDirection" |
  "updateShipsDirection" |
  "updateShipCoordinates"
> = {
  yourBoard: getEmptyBoard(),
  opponentBoard: getEmptyBoard(),
  currentPlayer: null,
  ships: getDefaultShips(),
}

export const useGameStore = create<GameState>((set) => ({
  ...initialGameState,

  setYourBoard: (newBoard: FieldType[][]) => set({ yourBoard: newBoard }),

  setOpponentBoard: (newBoard: FieldType[][]) => set({ opponentBoard: newBoard }),

  setOpponentBoardField: (column: number, row: number, value: FieldType) => set(state => {
    if (column >= 10 || column < 0 || row >= 10 || row < 0) return state;
    return { opponentBoard: state.opponentBoard.map((stateRow, i) => {
      if (i == row) return stateRow;
      return stateRow.map((stateValue, j) => {
        if (j === column) return value
        return stateValue
      }) 
    })}
  }),

  setShips: (newShips: Ship[]) => set({ ships: newShips }),
  
  updateShip: (
    id: number, direction: Direction, startColumn: number, startRow: number
  ) => set(state => ({
    ships: state.ships.map(ship => 
      ship.id !== id ? ship : { ...ship, direction, startColumn, startRow }  
    )
  })),

  updateShipDirection: (id: number, direction: Direction) => set(state => ({
    ships: state.ships.map(ship => 
      ship.id !== id ? ship : { ...ship, direction }  
    )
  })),

  updateShipsDirection: (ids: number[], direction: Direction) => set(state => ({
    ships: state.ships.map(ship => 
      ids.includes(ship.id) ? ship : { ...ship, direction }  
    )
  })),

  updateShipCoordinates: (id: number, startColumn: number, startRow: number) => set(state => ({
    ships: state.ships.map(ship => 
      ship.id !== id ? ship : { ...ship, startColumn, startRow }  
    )
  })),
}));

export const resetGameState = () => useGameStore.setState(initialGameState);
