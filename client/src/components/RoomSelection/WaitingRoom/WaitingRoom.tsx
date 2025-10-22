import { useSocket } from "@/context/SocketContext";
import { resetGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import './WaitingRoom.css';


export const WaitingRoom = () => {

  const socket = useSocket();
  const { roomName, playerWhoLeft } = useRoomStore();

   const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName!);
    resetGameStore();
  }

  return (
    <div className="waiting-room">
      {playerWhoLeft !== null
        ? <p 
          className="info-text"
          data-testid="text-player-left"
        >Player with ID '{playerWhoLeft}' has just left room</p>
        : <p
          className="info-text"
          data-testid="text-room-created"
        >You have just created new room with name '{roomName}'</p>
      }
      <h3>Waiting for other player to join</h3>
      <button
        className="leave-room-btn"
        data-testid="leave-room-btn"
        onClick={handleLeaveRoom}
      >Leave Room</button>
    </div>
  )
}