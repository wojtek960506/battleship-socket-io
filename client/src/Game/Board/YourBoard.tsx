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

  const handlePlaceShip = useCallback((rowIndex: number, columnIndex: number) => {
    // placing ship on board
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
  }, [chosenShipId, ships, placeShipOnBoard, setChosenShipId])

  const handleRemoveShip = useCallback((rowIndex: number, columnIndex: number) => {
    // removing ship from board and putting it in state of placing
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
  }, [ships, removeShipFromBoard, setChosenShipId])

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    // clicking on your board outside of the ship placement phase has no effect
    if (gameStatus !== "setting-board") return;
    
    // in the current logic when setting ships the values on board are only
    // "empty" or "taken". In case of adding some handling for ship surrounding
    // I will need to change those conditions a little
    const boardValue = yourBoard[rowIndex][columnIndex]
    if (boardValue === "empty") handlePlaceShip(rowIndex, columnIndex);
    else handleRemoveShip(rowIndex, columnIndex);
    
  }, [gameStatus, handlePlaceShip, handleRemoveShip, yourBoard])

  const hoverConditions = useCallback(
    (row: number, column: number): [boolean, Ship | undefined] => {
      // hovering on your board outside of the ship placement phase has no effect
      if (gameStatus !== "setting-board") return [false, undefined];
      if (chosenShipId === null) return [false, undefined];

      const ship = ships.find(s => s.id === chosenShipId)
      if (!ship) return [false, undefined];

      const newShip = {...ship, startRow: row, startColumn: column}
      if (!canShipBePlaced(newShip, ships)) {
        return [false, undefined];
      }

      return [true, newShip];
    }, [gameStatus, chosenShipId, ships]
  )

  const handleCellEnter = useCallback((rowIndex: number, columnIndex: number) => {
    const [result, newShip] = hoverConditions(rowIndex, columnIndex)
    if (!result) return

    setHoverPreview(calculateShipCells(newShip!).shipCells);
  }, [hoverConditions])

  const handleCellLeave = useCallback((rowIndex: number, columnIndex: number) => {
    const [result] = hoverConditions(rowIndex, columnIndex)
    if (!result) return

    setHoverPreview([])
  }, [hoverConditions])

  return <BoardGrid
    board={yourBoard}
    hoverPreview={hoverPreview}
    onCellClick={handleCellClick}
    onCellEnter={handleCellEnter}
    onCellLeave={handleCellLeave}
  />
}