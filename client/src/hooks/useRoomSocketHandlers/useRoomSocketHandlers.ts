import { useSocket } from "@/context/SocketContext"
import { useRoomStore } from "@/store/RoomStore";
import type { CreatedRoomType } from "./types";
import { useJoinRoomHandlers } from "./useJoinRoomHandlers";
import { useLeaveRoomHandlers } from "./useLeaveRoomHandlers";

export const useRoomSocketHandlers = () => {
  const socket = useSocket();
  const {
    setRoom,
    setPlayer,
    addPlayer,
    setStatus,
    setErrorMessage,
    setPlayerWhoLeft,
  } = useRoomStore();
  const joinRoomHandlers = useJoinRoomHandlers();
  const leaveRoomHandlers = useLeaveRoomHandlers();

  const handleSetPlayer = (playerId: string) => setPlayer(playerId);

  const handleCreatedRoom = ({ room, message, playerId }: CreatedRoomType) => {
    setRoom(room);
    addPlayer({ id: playerId });
    setStatus("waiting");
    setErrorMessage('');
    setPlayerWhoLeft(null);

    console.log(message);

    // update list for every user of server
    socket.emit("server:list-rooms")
    socket.emit("server:list-rooms-for-everyone")
  }

  const handleRoomAlreadyExists = ({ message }: { message: string }) => {
    setErrorMessage(message);
  }

  return {
    ...joinRoomHandlers,
    ...leaveRoomHandlers,
    handleSetPlayer,
    handleCreatedRoom,
    handleRoomAlreadyExists,
  }
}