import { resetGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import type { SomeoneLeftRoomType } from "./types";


export const useLeaveRoomHandlers = () => {
  const {
    setRoom,
    setPlayers,
    removePlayer,
    setStatus,
    setErrorMessage,
    setPlayerWhoLeft,
  } = useRoomStore();

  const handleYouLeftRoom = () => {
    setRoom(null);
    setPlayers([]);
    setStatus("idle");
    setErrorMessage("");
    
    resetGameStore();
  }

  const handleSomeoneLeftRoom = ({ message, playerId }: SomeoneLeftRoomType) => {
    setStatus("waiting");      
    removePlayer(playerId);
    setPlayerWhoLeft(playerId);

    resetGameStore();

    console.log(message);
  }

  return { handleYouLeftRoom, handleSomeoneLeftRoom }
}
