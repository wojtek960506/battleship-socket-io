import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useRoomsStore } from "../store/RoomsStore";


export const RoomsSocketHandler = () => {
  const socket = useSocket();
  const { setRooms } = useRoomsStore();

  useEffect(() => {
    socket.on("rooms:list", (rooms) => {
      setRooms(rooms)
    })
    return () => {
      socket.off("rooms:list")
    }
  }, [socket])

  return null;
}