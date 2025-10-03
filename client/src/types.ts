export type MessageData = {
  senderId: string;
  message: string;
  order: number;
  time: string;
  date: string;
}

export type RoomData = {
  name: string;
  owner: string;
  size: number;
  messages: MessageData[];
}

export type RoomsData = Map<string, RoomData>;
