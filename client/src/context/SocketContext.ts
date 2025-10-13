import { useContext } from "react";
import { createContext } from "react";
import { socket } from "../socket/socket";


export const SocketContext = createContext(socket);

export const useSocket = () => useContext(SocketContext);
