import { useSocket } from './context/SocketContext';
import { RoomMenu2 } from './RoomMenu/RoomMenu2';
import { RoomSocketHandler } from './handlers/RoomSocketHandler';
import { RoomsSocketHandler } from './handlers/RoomsSocketHandler';
import { useRoomStore } from './store/RoomStore';
import './App.css'


function App() {
  const { roomName, status, player, players } = useRoomStore()

  const socket = useSocket();

  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName)
  }

  console.log('status', status)
  console.log('player: ', player)
  console.log('players: ', players)

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <h1>Battleship</h1>
        </header>
        {status === "ready"
          ? <div>
              Game
              <button onClick={handleLeaveRoom}>Leave room</button>
            </div>
          : <RoomMenu2 />
        }
      </div>
      <RoomSocketHandler />
      <RoomsSocketHandler />
    </>
  )
}

export default App
