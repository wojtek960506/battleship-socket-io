import { RoomSelection } from './RoomSelection/RoomSelection';
import { RoomSocketHandler } from './handlers/RoomSocketHandler';
import { RoomsSocketHandler } from './handlers/RoomsSocketHandler';
import { useRoomStore } from './store/RoomStore';
import './App.css'
import { Game } from './Game/Game';
import { SocketProvider } from './context/SocketContext';


function App() {
  const { status } = useRoomStore();

  // temporary commented code in return for faster testing of setting ships on board

  return (
    <SocketProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Battleship</h1>
        </header>
        {/* {status === "ready"
          ? <Game />
          : <RoomSelection />
        } */ <Game />}
      </div>
      <RoomSocketHandler />
      <RoomsSocketHandler />
    </SocketProvider>
  )
}

export default App
