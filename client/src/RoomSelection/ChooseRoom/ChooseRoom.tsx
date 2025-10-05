import { useState } from "react";
import { useRoomStore } from "../../store/RoomStore";
import { useRoomsStore } from "../../store/RoomsStore";
import { useSocket } from "../../context/SocketContext";

export const ChooseRoom = () => {

  const [newRoomName, setNewRoomName] = useState('');

  const socket = useSocket();
  const { errorMessage } = useRoomStore();
  const { rooms } = useRoomsStore();

  const handleCreateRoom = () => {
    if (newRoomName === "") return; // room name cannot be empty
    socket.emit("server:create-room", newRoomName);
  }

  const handleJoinRoom = (joinRoomName: string) => {
    socket.emit("server:join-room", joinRoomName);
  }

  return (
    <div className="room-card">
      <h2>Join or Create a Room</h2>

      <div className="room-form">
        <div className="input-group">
          <input
            type="text"
            data-testid="input-room-name"
            onChange={e => setNewRoomName(e.target.value)}
            placeholder="Enter room name"
          />
          <button
            data-testid="create-room-btn"
            className="create-btn"
            onClick={handleCreateRoom}
          >Create Room</button>
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
    </div>
  )
}