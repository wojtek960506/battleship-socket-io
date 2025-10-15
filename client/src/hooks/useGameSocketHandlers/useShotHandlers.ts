import { useCallback } from "react";
import type { ReceiveShotResultType, ReceiveShotType } from "@/helpers/types";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { useBoard } from "../useBoard";
import { useReceiveShot } from "./useReceiveShot";


export const useShotHandlers = () => {
  const { 
    yourBoard,
    setWinner,
    setGameStatus,
    setCurrentPlayer,
  } = useGameStore();
  const { updateOpponentBoard } = useBoard();
  const player = useRoomStore(s => s.player);  
  const { receiveMissedShot, receiveHitShot } = useReceiveShot();

  const handleReceiveShot = useCallback(({ column, row, playerFromServer }: ReceiveShotType) => {
    if (player === playerFromServer) return;

    const currentValue = yourBoard[row][column]
    console.log('currentValue', currentValue);
    if (currentValue === "empty") {
      receiveMissedShot(row, column);
    } else if (currentValue === "taken") {
      receiveHitShot(row, column, playerFromServer);
    } else {
      // shot to the cell already shot (theoretically not possible,
      // but maybe just in case there should be some handling)
      console.log('TODO - wrong shot - send some response')
    }
  }, [player, receiveHitShot, receiveMissedShot, yourBoard])

  const handleReceiveShotResult = useCallback((data: ReceiveShotResultType) => {
    const { column, row, value, playerFromServer, sunkCells, isFinished } = data
    if (playerFromServer === player) return;           
    
    if (value === "sunk") updateOpponentBoard(sunkCells, value);
    else updateOpponentBoard([{ row, column }], value);

    if (isFinished) {
      setGameStatus("finished")
      setWinner(player!);
      setCurrentPlayer(null);
    } else {
      setCurrentPlayer(playerFromServer);
    }
  }, [player, setCurrentPlayer, setGameStatus, setWinner, updateOpponentBoard])
  
  return { handleReceiveShot, handleReceiveShotResult }
}