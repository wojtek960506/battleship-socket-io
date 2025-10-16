import { useCallback } from "react";
import { useSocket } from "@/context/SocketContext"
import { resetGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";

export const useRoomSocketHandlers = () => {
  const socket = useSocket();
    const {
      player,
      setRoom,
      setPlayer,
      setPlayers,
      addPlayer,
      removePlayer,
      setStatus,
      setErrorMessage,
      setPlayerWhoLeft,
    } = useRoomStore();

    const handleSetPlayer = (playerId: string) => setPlayer(playerId);

    type CreatedRoomType = {
      room: string,
      message: string,
      playerId: string,
    }

    type YouJoinedRoomType = Omit<CreatedRoomType, "playerId"> & {
      ownerId: string
    }

    type SomeoneJoinedRoomType = Omit<CreatedRoomType, "room">;

    type SomeoneLeftRoomType = Omit<CreatedRoomType, "room">;

    const handleCreatedRoom = ({ room, message, playerId }: CreatedRoomType) => {
      setRoom(room);
      addPlayer({ id: playerId });
      setStatus("waiting");
      setErrorMessage('');
      setPlayerWhoLeft(null);

      console.log(message)

      // update list for every user of server
      socket.emit("server:list-rooms")
      socket.emit("server:list-rooms-for-everyone")
    }

    const handleRoomAlreadyExists = ({ message }: { message: string }) => {
      setErrorMessage(message);
    }

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

    return {
      handleSetPlayer,
      handleCreatedRoom,
      handleRoomAlreadyExists,
      handleYouJoinedRoom,
      handleSomeoneJoinedRoom,
      handleYouLeftRoom,
      handleSomeoneLeftRoom,
    }
}