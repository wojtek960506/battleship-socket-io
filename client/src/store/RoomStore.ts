import { create } from "zustand";

type Player = {
  id: string;
}

type RoomState = {
  roomName: string | null;
  player: string | null;
  players: Player[];
  status: "idle" | "waiting" | "ready" | "in-game";
  errorMessage: string;

  // actions
  setRoom: (roomId: string | null) => void;
  setPlayer: (player: string) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setStatus: (status: RoomState["status"]) => void;
  setErrorMessage: (errorMessage: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomName: null,
  player: null,
  players: [],
  status: "idle",
  errorMessage: '',

  setRoom: (roomName: string | null) => set({ roomName }),
  setPlayer: (player: string) => set({ player }),
  addPlayer: (player: Player) => set((s) => {
    console.log('addPlayer', player)
    console.log('s.players', s.players)
    return { players: [...s.players, player]}
  }),
  removePlayer: (playerId: string) => set((s) => {
    console.log('abc:', s.players)
    return ({ players: s.players.filter((p) => p.id !== playerId )})
  }),
  setStatus: (status: RoomState["status"]) => set({ status }),
  setErrorMessage: (errorMessage: string) => set({ errorMessage })
}))