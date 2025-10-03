export type MessageData = {
  senderId: string;
  message: string;
  order: number;
  time: string;
  date: string;
}

export type RoomData = {
  owner: string;
  size: number;
  messages: MessageData[];
}
