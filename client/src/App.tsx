
import { RoomMenu } from './RoomMenu/RoomMenu'
import './App.css'
import { useState } from 'react';
import { RoomContext } from './context/RoomContext';
import { useSocket } from './context/SocketContext';
import { RoomMenu2 } from './RoomMenu/RoomMenu2';
import { RoomSocketHandler } from './handlers/RoomSocketHandler';
import { RoomsSocketHandler } from './handlers/RoomsSocketHandler';
import { useRoomStore } from './store/RoomStore';

function App() {
  // const [isGameSet, setIsGameSet] = useState(false);
  // const [currentRoom, setCurrentRoom] = useState('');
  // const [playerWhoLeft, setPlayerWhoLeft] = useState('');

  const { roomName, status, player, players } = useRoomStore()

  const socket = useSocket();


  // const handlePlayerWhoLeft = (value: string) => {
  //   console.log('handlePlayerWhoLeft', value)
  //   setPlayerWhoLeft(value);
  // }

  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName)
  }

  console.log('status', status)
  console.log('player: ', player)
  console.log('players: ', players)

  return (
    // <RoomContext value={{
    //   currentRoom,
    //   handleCurrentRoom: (value: string) => setCurrentRoom(value),
    //   isGameSet,
    //   handleIsGameSet: (value: boolean) => setIsGameSet(value),
    //   playerWhoLeft,
    //   handlePlayerWhoLeft,
    // }}>
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
    // </RoomContext>
  )
}

export default App
