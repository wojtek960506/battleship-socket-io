import { type ReactNode, useContext, useEffect } from "react";
import { createContext } from "react";
import { socket } from "../socket/socket";


export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    socket.connect();
    return () => { socket.disconnect(); };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext);
