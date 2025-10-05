import { create } from "zustand";

type Room = {
  name: string;
  owner: string;
  size: number;
}

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
