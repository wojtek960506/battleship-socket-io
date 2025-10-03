import { useContext, useEffect, useState } from "react"
import type { RoomData } from "../types";
import { RoomContext } from "../context/RoomContext";
import { useSocket } from "../context/SocketContext";

type SocketData = {
  room: string;
  message: string;
  playerWhoLeft?: string 
}

type SocketRoomsData = [string, RoomData][]


export const RoomMenu = () => {

  const { currentRoom, handleCurrentRoom, handleIsGameSet, playerWhoLeft, handlePlayerWhoLeft } = useContext(RoomContext)!;
  const socket = useSocket();

  const [newRoomName, setNewRoomName] = useState('');
  const [allRooms, setAllRooms] = useState<RoomData[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleCreateRoom = () => {
    if (newRoomName === '') return
    socket.emit("create_room", newRoomName)
  }

  const handleJoinRoom = (roomName: string) => {
    socket.emit("join_room", roomName)
  }

  const handleLeaveRoom = () => {
    socket.emit("leave_room", currentRoom)
  }

  const handleAllRooms = (data: SocketRoomsData) => {
    const rooms: RoomData[] = [];
    for (const [_, roomData] of data) {
      rooms.push(roomData)
    }
    setAllRooms(rooms)
  }

  


  useEffect(() => {
    socket.emit("get_rooms")
  }, [])

  useEffect(() => {
    socket.on("rooms_map", (data: SocketRoomsData) => {
      handleAllRooms(data)
    })
    socket.on("room_created", ({ room, message }: SocketData) => {
      handleCurrentRoom(room)
      handlePlayerWhoLeft('')
      console.log(message)
      // get updated rooms list for yourself
      socket.emit("get_rooms")
      // send message to everyone that the room was created to update list of available rooms
      socket.emit("get_rooms_everyone")
    })
    socket.on("room_exists", (data: SocketData) => {
      setErrorMessage(data.message)
    })
    socket.on("you_joined_room", ({ room, message }: SocketData) => {
      handleCurrentRoom(room);
      handleIsGameSet(true);
      console.log(message)
    })
    socket.on("someone_joined_room", ({ room, message }: SocketData) => {
      if (currentRoom === room) {
        handleIsGameSet(true);
        console.log(message);
      }
    })
    socket.on("you_left_room", (data: SocketData) => {
      handleCurrentRoom('')
      handleIsGameSet(false);
      handlePlayerWhoLeft('')
      console.log(data.message)
    })

    const someoneLeftRoom = (data: SocketData) => {
      handleIsGameSet(false);
      handlePlayerWhoLeft(data.playerWhoLeft!)
    }

    socket.on("someone_left_room", someoneLeftRoom);
    
    // return () => {
    //   socket.off("someone_left_room", someoneLeftRoom)
    // };
  }, [currentRoom])


  return (
    <main className="lobby-container">
      { currentRoom === ''
        ? (<div className="lobby-card">
          <h2>Join or Create a Room</h2>

          <div className="room-form">
            <div className="input-group">
              <input
                type="text"
                onChange={e => setNewRoomName(e.target.value)}
                placeholder="Enter room name"
              />
              <button className="create-btn" onClick={handleCreateRoom}>Create Room</button>
            </div>
            <div className="error-text">{errorMessage}</div>
          </div>
          
          <div className="room-list">
            <h3>Available Rooms</h3>
            <ul>
              {allRooms.filter(room => room.size < 2).map(room => {
                return (
                <li key={room.name}>
                  {room.name}
                  <button onClick={() => handleJoinRoom(room.name)}>Join</button>
                </li>)
              })}
            </ul>
          </div>
          
          <p className="info-text">Join or create a room to start playing!</p>
        </div>)
        : (<div className="waiting-room">
          {playerWhoLeft !== ''
            ? <p className="info-text">Player with ID '{playerWhoLeft}' has just left room</p>
            : <p className="info-text">You have just created new room with name '{currentRoom}'</p>
          }
          <h3>Waiting for other player to join</h3>
          <button onClick={handleLeaveRoom}>Leave Room</button>
        </div>)
      }
    </main>
  )
}