import { useCallback, useState } from "react"
import { calculateShipCells, findShip } from "../../helpers/utils"
import { useGameStore } from "../../store/GameStore"
import "./Board.css"
import { canShipBePlaced } from "../../helpers/shipPlacement"
import { BoardGrid } from "./BoardGrid"
import type { Ship, ShipCell } from "../../helpers/types"


export const YourBoard = () => {
  const {
    yourBoard,
    chosenShipId,
    ships,
    setChosenShipId,
    placeShipOnBoard,
    removeShipFromBoard,
    gameStatus,
  } = useGameStore()
  const [hoverPreview, setHoverPreview] = useState<ShipCell[]>([])

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    // clicking on your board outside of the ship placement phase
    // has no effect
    if (gameStatus !== "setting-board") return;
    
    const boardValue = yourBoard[rowIndex][columnIndex]

    if (boardValue === "empty") {
      if (chosenShipId === null) return;

      const ship = ships.find(s => s.id === chosenShipId)
      if (!ship) return;

      const newShip = { ...ship, startRow: rowIndex, startColumn: columnIndex };
      if (!canShipBePlaced(newShip, ships)) {
        return;
      }

      placeShipOnBoard(chosenShipId, rowIndex, columnIndex);
      setChosenShipId(null);
      setHoverPreview([]);

    } else {
      // in the current logic when setting ships the values on board are only
      // "empty" or "taken". In case of adding some handling for ship surrounding
      // I will need to change those conditions a little

      const ship = findShip(ships, rowIndex, columnIndex);
      if (!ship) return;

      setChosenShipId(ship.id);
      const newShip = { ...ship, startRow: rowIndex, startColumn: columnIndex };
      if (!canShipBePlaced(newShip, ships)) {
        setHoverPreview([]);
      } else {
        setHoverPreview(calculateShipCells(newShip!).shipCells);
      }
      removeShipFromBoard(ship.id);
    }
    
  }, [chosenShipId, ships, yourBoard, gameStatus])

  const hoverConditions = useCallback((row: number, column: number): [boolean, Ship | undefined] => {
    // hovering on your board outside of the ship placement phase
    // has no effect
    if (gameStatus !== "setting-board") return [false, undefined];
    
    if (chosenShipId === null) return [false, undefined];

    const ship = ships.find(s => s.id === chosenShipId)
    if (!ship) return [false, undefined];

    const newShip = {...ship, startRow: row, startColumn: column}
    if (!canShipBePlaced(newShip, ships)) {
      return [false, undefined];
    }

    return [true, newShip];
  }, [gameStatus, chosenShipId, ships])

  const handleCellEnter = useCallback((rowIndex: number, columnIndex: number) => {
    const [result, newShip] = hoverConditions(rowIndex, columnIndex)
    if (!result) return

    setHoverPreview(calculateShipCells(newShip!).shipCells);
  }, [chosenShipId, ships, yourBoard])

  const handleCellLeave = useCallback((rowIndex: number, columnIndex: number) => {
    const [result, _] = hoverConditions(rowIndex, columnIndex)
    if (!result) return

    setHoverPreview([])
  }, [chosenShipId, ships, yourBoard])

  return <BoardGrid
    board={yourBoard}
    hoverPreview={hoverPreview}
    onCellClick={handleCellClick}
    onCellEnter={handleCellEnter}
    onCellLeave={handleCellLeave}
  />
}