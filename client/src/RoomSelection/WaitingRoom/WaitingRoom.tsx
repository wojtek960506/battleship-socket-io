import { useSocket } from "../../context/SocketContext";
import { useRoomStore } from "../../store/RoomStore";

export const WaitingRoom = () => {

  const socket = useSocket();
  const { roomName, playerWhoLeft } = useRoomStore();

   const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName);
  }

  return (
    <div className="waiting-room">
      {playerWhoLeft !== null
        ? <p className="info-text">Player with ID '{playerWhoLeft}' has just left room</p>
        : <p className="info-text">You have just created new room with name '{roomName}'</p>
      }
      <h3>Waiting for other player to join</h3>
      <button onClick={handleLeaveRoom}>Leave Room</button>
    </div>
  )
}