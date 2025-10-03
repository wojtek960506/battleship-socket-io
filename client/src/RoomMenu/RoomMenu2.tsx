import { useEffect, useState } from "react"
import { useRoomStore } from "../store/RoomStore"
import { useRoomsStore } from "../store/RoomsStore";
import { useSocket } from "../context/SocketContext";

export const RoomMenu2 = () => {

  const [newRoomName, setNewRoomName] = useState('');

  const socket = useSocket();
  const { roomName, errorMessage } = useRoomStore();
  const { rooms } = useRoomsStore();

  useEffect(() => {

    socket.emit("server:list-rooms")
  }, [])

  const handleCreateRoom = () => {
    if (newRoomName === "") return; // room name cannot be empty
    socket.emit("server:create-room", newRoomName);
  }

  const handleJoinRoom = (joinRoomName: string) => {
    socket.emit("server:join-room", joinRoomName);
  }

  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName);
  }

  return (
    <main className="lobby-container">
      { roomName === null
        ? (<div className="lobby-card">
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
              {rooms.filter(room => room.size < 2).map(room => {
                return (
                <li key={room.name}>
                  {room.name}
                  <button onClick={() => handleJoinRoom(room.name)}>Join</button>
                </li>)
              })}
            </ul>
          </div>
          
          <p className="info-text">Join or create a room to start playing!</p>
        </div>)
        : (<div className="waiting-room">
          {/* {playerWhoLeft !== ''
            ? <p className="info-text">Player with ID '{playerWhoLeft}' has just left room</p>
            : <p className="info-text">You have just created new room with name '{roomName}'</p>
          } */}
          <h3>Waiting for other player to join</h3>
          <button onClick={handleLeaveRoom}>Leave Room</button>
        </div>)
      }
    </main>
  )
}