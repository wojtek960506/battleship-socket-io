import { useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import type { BoardCellType, Cell } from "@/types";
import { getShipsAfterShot } from "@/utils/general_tmp";
import { useBoard } from "../useBoard";
import { useSwitchPlayers } from "./useSwitchPlayers";

export const useReceiveShot = () => {
  const socket = useSocket();
  const { 
    ships,
    setShips,
    setCurrentPlayer,
  } = useGameStore();
  const { updateYourBoard } = useBoard();
  const { player, roomName } = useRoomStore();
  const { switchPlayers } = useSwitchPlayers();
  
  const calculateHitShot = useCallback((row: number, column: number) => {
    let value: BoardCellType = "hit";
    let sunkCells: Cell[] = [];
    const { shipsAfterShot, hitShip } = getShipsAfterShot(ships, row, column);  
    setShips(shipsAfterShot);  
    if (hitShip?.status === "sunk") {
      value = "sunk";
      sunkCells = hitShip.hitCells;
      updateYourBoard(sunkCells, value)
    } else {
      updateYourBoard([{ row, column }], value)
    }
    
    // check game status
    let isFinished = false;
    if (shipsAfterShot.every(s => s.status === "sunk")) isFinished = true;

    return { value, sunkCells, isFinished }
  }, [setShips, ships, updateYourBoard])
  
  const receiveHitShot = useCallback((row: number, column: number, playerFromServer: string) => {
    const { value, sunkCells, isFinished } = calculateHitShot(row, column);
    switchPlayers(playerFromServer, isFinished);
    socket.emit(
      "server:shot-result",
      { player, roomName, value, column, row, sunkCells, isFinished }
    )
  }, [calculateHitShot, player, roomName, socket, switchPlayers])

  const receiveMissedShot = useCallback((row: number, column: number) => {
    const value = "missed"
    socket.emit("server:shot-result", { player, roomName, value, column, row })

    updateYourBoard([{ row,column }], value)
    setCurrentPlayer(player);
  }, [player, roomName, setCurrentPlayer, socket, updateYourBoard])

  return { receiveMissedShot, receiveHitShot }
}