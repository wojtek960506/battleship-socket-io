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

export const useRoomsStore = create<RoomsState>((set) => ({
  rooms: [],

  setRooms: (rooms: Room[]) => set({ rooms })
}));
