export type CreatedRoomType = {
  room: string,
  message: string,
  playerId: string,
}

export type YouJoinedRoomType = Omit<CreatedRoomType, "playerId"> & {
  ownerId: string
}

export type SomeoneJoinedRoomType = Omit<CreatedRoomType, "room">;

export type SomeoneLeftRoomType = Omit<CreatedRoomType, "room">;