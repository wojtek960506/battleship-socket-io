import * as io from 'socket.io-client';
import { RoomMenu } from './RoomMenu/RoomMenu'
import './App.css'
import { useState } from 'react';
import { RoomContext } from './context/RoomContext';


const socket = io.connect("http://192.168.0.213:3001")
// const socket = io.connect("http://localhost:3001")

function App() {
  const [isGameSet, setIsGameSet] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');

  return (
    <RoomContext value={{
      currentRoom,
      handleCurrentRoom: (value: string) => setCurrentRoom(value),
      isGameSet,
      handleIsGameSet: (value: boolean) => setIsGameSet(value),
      socket,
    }}>
      <div className="app-container">
        <header className="app-header">
          <h1>Battleship</h1>
        </header>

        <RoomMenu />
      </div>
    </RoomContext>
  )
}

export default App
