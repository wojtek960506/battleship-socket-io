import { create } from "zustand";
import type { Room } from "@/utils/types";



type RoomsState = {
  rooms: Room[];

  // actions
  setRooms: (rooms: Room[]) => void;
}

const initialRoomsState: Omit<RoomsState, "setRooms"> = {
  rooms: []
}

export const useRoomsStore = create<RoomsState>((set) => ({
  ...initialRoomsState,

  setRooms: (rooms: Room[]) => set({ rooms })
}));

export const resetRoomsStore = () => useRoomsStore.setState(initialRoomsState)
