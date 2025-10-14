import { RoomSelection } from './components/RoomSelection/RoomSelection';
import { RoomSocketHandler } from './handlers/RoomSocketHandler';
import { RoomsSocketHandler } from './handlers/RoomsSocketHandler';
import { useRoomStore } from './store/RoomStore';
import './App.css'
import { Game } from './components/Game/Game';
import { GameSocketHandler } from './handlers/GameSocketHandler';
import { SocketProvider } from './context/SocketProvider';


function App() {
  const { status } = useRoomStore();

  return (
    <SocketProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Battleship</h1>
        </header>
        {status === "ready"
          ? <Game />
          : <RoomSelection />
        }
      </div>
      <RoomSocketHandler />
      <RoomsSocketHandler />
      <GameSocketHandler />
    </SocketProvider>
  )
}

export default App
