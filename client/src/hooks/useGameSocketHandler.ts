import { useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import type { BoardCellType, Cell, ReceiveShotResultType, ReceiveShotType } from "@/helpers/types";
import { getShipsAfterShot } from "@/helpers/utils";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { useBoard } from "./useBoard";

export const useGameSocketHandler = () => {
  
  const socket = useSocket();
  const { 
    ships,
    yourBoard,
    gameStatus,
    currentPlayer,
    setShips,
    setWinner,
    setGameStatus,
    setCurrentPlayer,
    setIsOtherBoardSet,
  } = useGameStore();
  const { updateYourBoard, updateOpponentBoard } = useBoard();
  const { player, roomName } = useRoomStore();

  const handleBoardSet = useCallback(({ otherPlayer }: { otherPlayer: string}) => {
    // just in case message was emited to the sender
      if (player === otherPlayer) return;

      setIsOtherBoardSet(true);
      if (gameStatus === "board-set") {
        setGameStatus("playing")
      } else {
        setCurrentPlayer(otherPlayer)
      }
  }, [player, setIsOtherBoardSet, gameStatus, setGameStatus, setCurrentPlayer])

  const handleRepositionShips = useCallback(({ otherPlayer }: { otherPlayer: string }) => {
    if (player === otherPlayer) return;

    if (otherPlayer === currentPlayer) setCurrentPlayer(null);
    setIsOtherBoardSet(false);
  }, [currentPlayer, player, setCurrentPlayer, setIsOtherBoardSet])

  const receiveMissedShot = useCallback((row: number, column: number) => {
    const value = "missed"
    socket.emit("server:shot-result", { player, roomName, value, column, row })

    updateYourBoard([{ row,column }], value)
    setCurrentPlayer(player);
  }, [player, roomName, setCurrentPlayer, socket, updateYourBoard])

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
  
  const switchPlayers = useCallback((playerFromServer: string, isFinished: boolean) => {
    if (isFinished) {
      setGameStatus("finished");
      setWinner(playerFromServer);
      setCurrentPlayer(null);
    } else {
      setCurrentPlayer(player)
    }
  }, [player, setCurrentPlayer, setGameStatus, setWinner])

  const receiveHitShot = useCallback((row: number, column: number, playerFromServer: string) => {
    const { value, sunkCells, isFinished } = calculateHitShot(row, column);
    switchPlayers(playerFromServer, isFinished);
    socket.emit(
      "server:shot-result",
      { player, roomName, value, column, row, sunkCells, isFinished }
    )
  }, [calculateHitShot, player, roomName, socket, switchPlayers])

  // TODO some helpers for this function
  const handleReceiveShot = useCallback(({ column, row, playerFromServer }: ReceiveShotType) => {
    if (player === playerFromServer) return;

    const currentValue = yourBoard[row][column]
    console.log('currentValue', currentValue);
    if (currentValue === "empty") {
      receiveMissedShot(row, column);
    } else if (currentValue === "taken") {
      receiveHitShot(row, column, playerFromServer);
    } else {
      // shot to the same cell as before (theoretically not possible, but maybe just in case
      // there should be some handling)
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

  return { 
    handleBoardSet,
    handleRepositionShips,
    handleReceiveShot,
    handleReceiveShotResult,
  }
}