import { useEffect, type ReactNode } from "react";
import { SocketContext } from "./SocketContext";
import { socket } from "@/socket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    socket.connect();
    return () => { socket.disconnect(); };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}