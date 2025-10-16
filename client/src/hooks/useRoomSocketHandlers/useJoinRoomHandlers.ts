import { useCallback } from "react";
import { useRoomStore } from "@/store/RoomStore";
import type { SomeoneJoinedRoomType, YouJoinedRoomType } from "./types";

export const useJoinRoomHandlers = () => {
  const {
    player,
    setRoom,
    setPlayers,
    setStatus,
    setErrorMessage,
    
  } = useRoomStore();

  const handleYouJoinedRoom = useCallback(({ room, message, ownerId }: YouJoinedRoomType) => {
    setRoom(room)
    setStatus("ready")
    setErrorMessage('')
    setPlayers([{ id: ownerId }, { id: player! }])

    console.log(message)
  }, [player, setErrorMessage, setPlayers, setRoom, setStatus])

  const handleSomeoneJoinedRoom = useCallback(({ message, playerId }: SomeoneJoinedRoomType) => {
    setStatus("ready");
    setPlayers([{ id: player!}, { id: playerId }]);
    
    console.log(message);
  }, [player, setPlayers, setStatus])

  return { handleYouJoinedRoom, handleSomeoneJoinedRoom }
}
