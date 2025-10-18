import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useRoomsStore } from "@/store/RoomsStore";
import type { Room } from "@/types";


export const RoomsSocketHandler = () => {
  const socket = useSocket();
  const { setRooms } = useRoomsStore();

  useEffect(() => {
    const handleRoomsList = (rooms: Room[]) => setRooms(rooms);
    
    socket.on("rooms:list", handleRoomsList);
    return () => { socket.off("rooms:list", handleRoomsList) };
  }, [setRooms, socket])

  return null;
}