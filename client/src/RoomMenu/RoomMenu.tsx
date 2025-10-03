import { useContext, useEffect, useState } from "react"
import type { RoomData } from "../types";
import { RoomContext } from "../context/RoomContext";

type SocketData = {
  room: string;
  message: string;
}

type SocketRoomsData = [string, RoomData][]


export const RoomMenu = () => {

  const { socket, currentRoom, handleCurrentRoom, handleIsGameSet } = useContext(RoomContext)!;

  const [newRoomName, setNewRoomName] = useState('');
  const [allRooms, setAllRooms] = useState<RoomData[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateRoom = () => {
    socket.emit("create_room", newRoomName)
  }

  const handleJoinRoom = (roomName: string) => {
    socket.emit("join_room", roomName)
  }

  const handleAllRooms = (data: SocketRoomsData) => {
    const rooms: RoomData[] = [];
    for (const [_, roomData] of data) {
      rooms.push(roomData)
    }
    setAllRooms(rooms)
  }

  useEffect(() => {
    socket.emit("get_rooms")
  }, [])

  useEffect(() => {
    socket.on("rooms_map", (data: SocketRoomsData) => {
      handleAllRooms(data)
    })
    socket.on("room_created", ({ room, message }: SocketData) => {
      handleCurrentRoom(room)
      console.log(message)
      // get updated rooms list for yourself
      socket.emit("get_rooms")
      // send message to everyone that the room was created to update list of available rooms
      socket.emit("get_rooms_everyone")
    })
    socket.on("room_exists", (data: SocketData) => {
      setErrorMessage(data.message)
    })
    socket.on("you_joined_room", ({ room, message }: SocketData) => {
      handleCurrentRoom(room);
      console.log(message)
    })
    socket.on("someone_joined_room", ({ room, message }: SocketData) => {
      if (currentRoom === room) {
        handleIsGameSet(true);
        console.log(message);
      }
    })
  }, [socket, currentRoom])

  console.log('currentRoom in RoomMenu', currentRoom);

  return (
    <main className="lobby-container">
        <div className="lobby-card">
          <h2>Join or Create a Room</h2>

          <div className="room-form">
            <div className="input-group">
              <input
                type="text"
                onChange={e => setNewRoomName(e.target.value)}
                placeholder="Enter room name"
              />
              <button className="create-btn" onClick={handleCreateRoom}>Create Room</button>
            </div>
            <div className="error-text">{errorMessage}</div>
          </div>
          
          <div className="room-list">
            <h3>Available Rooms</h3>
            <ul>
              {allRooms.filter(room => room.size < 2).map(room => {
                return (
                <li key={room.name}>
                  {room.name}
                  <button onClick={() => handleJoinRoom(room.name)}>Join</button>
                </li>)
              })}
            </ul>
          </div>
          
          <p className="info-text">Join or create a room to start playing!</p>
        </div>
      </main>
  )
}