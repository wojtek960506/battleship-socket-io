import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext"
import { useRoomSocketHandlers } from "@/hooks/useRoomSocketHandlers";

export const RoomSocketHandler = () => {
  const socket = useSocket();
  const {
    handleSetPlayer,
    handleCreatedRoom,
    handleRoomAlreadyExists,
    handleYouJoinedRoom,
    handleSomeoneJoinedRoom,
    handleYouLeftRoom,
    handleSomeoneLeftRoom,
  } = useRoomSocketHandlers();

  useEffect(() => {
    socket.on("room:set-player", handleSetPlayer)

    socket.on("room:created", handleCreatedRoom);
    
    socket.on("room:already-exists", handleRoomAlreadyExists);

    socket.on("room:you-joined", handleYouJoinedRoom);

    socket.on("room:someone-joined", handleSomeoneJoinedRoom);  

    socket.on("room:you-left", handleYouLeftRoom);

    socket.on("room:someone-left", handleSomeoneLeftRoom);

    return () => {
      socket.off("room:set-player", handleSetPlayer);
      socket.off("room:created", handleCreatedRoom);
      socket.off("room:already-exists", handleRoomAlreadyExists);
      socket.off("room:you-joined", handleYouJoinedRoom);
      socket.off("room:someone-joined", handleSomeoneJoinedRoom);
      socket.off("room:you-left", handleYouLeftRoom);
      socket.off("room:someone-left", handleSomeoneLeftRoom);
    }
  }, [
    handleCreatedRoom,
    handleRoomAlreadyExists,
    handleSetPlayer,
    handleSomeoneJoinedRoom,
    handleYouJoinedRoom,
    handleYouLeftRoom,
    handleSomeoneLeftRoom,
    socket
  ])

  return null;
}
