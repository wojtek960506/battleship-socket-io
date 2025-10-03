import { useContext, useEffect, useState } from "react"
import type { RoomData } from "../types";
import { RoomContext } from "../context/RoomContext";

type SocketData = {
  room: string;
  message: string;
}

export const RoomMenu = () => {

  const { socket, currentRoom, handleCurrentRoom } = useContext(RoomContext)!;

  const [newRoomName, setNewRoomName] = useState('');
  const [allRoomsList, setAllRoomsList] = useState<RoomData[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateRoom = () => {
    socket.emit("create_room", newRoomName)
  }

  // useEffect(() => {
  //   socket.emit("get_rooms")
  // }, [])

  useEffect(() => {
    socket.on("room_created", ({ room, message }: SocketData) => {
      handleCurrentRoom(room)
      console.log(message)
    })
    socket.on("room_exists", (data: SocketData) => {
      setErrorMessage(data.message)
    })
  }, [socket])

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
              <li>Room Alpha <button>Join</button></li>
              <li>Room Bravo <button>Join</button></li>
              <li>Room Charlie <button>Join</button></li>
              <li>Room Delta <button>Join</button></li>
            </ul>
          </div>
          
          <p className="info-text">Join or create a room to start playing!</p>
        </div>
      </main>
  )
}