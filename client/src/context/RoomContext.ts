import { createContext } from "react";

type RoomContextType = {
  currentRoom: string;
  handleCurrentRoom: (value: string) => void;
  isGameSet: boolean;
  handleIsGameSet: (value: boolean) => void;
  playerWhoLeft: string;
  handlePlayerWhoLeft: (value: string) => void;
}

export const RoomContext = createContext<RoomContextType | undefined>(undefined);