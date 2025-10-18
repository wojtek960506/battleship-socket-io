import { useGameStore } from "@/store/GameStore"
import { getUpdatedBoard } from "@/utils/boardHelper";
import { getBoardPlacingShip, getBoardRemovingShip, getPlacedShip, getRemovedShip } from "@/utils/general";
import type { BoardCellType, Cell } from "@/utils/types";


export const useBoard = () => {
  const {
    ships,
    yourBoard,
    opponentBoard,
    setYourBoard,
    setOpponentBoard,
    setYourBoardAndShips,
  } = useGameStore();

  const placeShipOnBoard = (id: number, startRow: number, startColumn: number) => {
    const ship = ships.find(s => s.id === id)
      if (!ship) return;
  
      const placedShip = getPlacedShip(ship, startRow, startColumn);
      const yourNewBoard = getBoardPlacingShip(yourBoard, placedShip);
      const newShips = ships.map(s => (s.id === id ? placedShip : s));

      setYourBoardAndShips(yourNewBoard, newShips);
  }

  const removeShipFromBoard = (id: number) => {
    const ship = ships.find(s => s.id === id)
    if (!ship) return;

    const yourNewBoard = getBoardRemovingShip(yourBoard, ship);
    const removedShip = getRemovedShip(ship);
    const newShips = ships.map(s => (s.id === id ? removedShip : s));

    setYourBoardAndShips(yourNewBoard, newShips);
  }

  const updateYourBoard = (cells: Cell[], value: BoardCellType) => {
    setYourBoard(getUpdatedBoard(yourBoard, cells, value))
  }

  const updateOpponentBoard = (cells: Cell[], value: BoardCellType) => {
    setOpponentBoard(getUpdatedBoard(opponentBoard, cells, value))
  }

  return {
    placeShipOnBoard,
    removeShipFromBoard,
    updateYourBoard,
    updateOpponentBoard,
  }
}