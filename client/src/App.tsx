import * as io from 'socket.io-client';
import { RoomMenu } from './RoomMenu/RoomMenu'
import './App.css'
import { useMemo, useState } from 'react';
import { RoomContext } from './context/RoomContext';



// const socket = io.connect("http://localhost:3001")

function App() {
  const [isGameSet, setIsGameSet] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [playerWhoLeft, setPlayerWhoLeft] = useState('');

  const socket = useMemo(() => io.connect("http://192.168.0.213:3001"), []);

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
      socket,
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
