
import { RoomMenu } from './RoomMenu/RoomMenu'
import './App.css'
import { useState } from 'react';
import { RoomContext } from './context/RoomContext';
import { useSocket } from './context/SocketContext';

function App() {
  const [isGameSet, setIsGameSet] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [playerWhoLeft, setPlayerWhoLeft] = useState('');

  const socket = useSocket();


  const handlePlayerWhoLeft = (value: string) => {
    console.log('handlePlayerWhoLeft', value)
    setPlayerWhoLeft(value);
  }

  const handleLeaveRoom = () => {
    socket.emit("leave_room", currentRoom)
  }

  return (
    <RoomContext value={{
      currentRoom,
      handleCurrentRoom: (value: string) => setCurrentRoom(value),
      isGameSet,
      handleIsGameSet: (value: boolean) => setIsGameSet(value),
      playerWhoLeft,
      handlePlayerWhoLeft,
    }}>
      <div className="app-container">
        <header className="app-header">
          <h1>Battleship</h1>
        </header>
        {isGameSet
          ? <div>
              Game
              <button onClick={handleLeaveRoom}>Leave room</button>
            </div>
          : <RoomMenu />
        }
      </div>
    </RoomContext>
  )
}

export default App
