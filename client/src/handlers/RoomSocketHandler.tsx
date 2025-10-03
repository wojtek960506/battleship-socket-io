import { useEffect } from "react";
import { useSocket } from "../context/SocketContext"
import { useRoomStore } from "../store/RoomStore";

export const RoomSocketHandler = () => {
  const socket = useSocket();
  const {
    player,
    players,
    setRoom,
    setPlayer,
    addPlayer,
    removePlayer,
    setStatus,
    setErrorMessage
  } = useRoomStore();

  useEffect(() => {
    socket.on("room:set-player", playerId => {
      setPlayer(playerId);
    })

    socket.on("room:created", ({ room, message, playerId }) => {
      setRoom(room);
      addPlayer({ id: playerId });
      setStatus("waiting");

      console.log(message)
      // update list for every user of server
      socket.emit("server:list-rooms")
      socket.emit("server:list-rooms-for-everyone")
    });
    socket.on("room:already-exists", (data) => {
      setErrorMessage(data.message)
    })
    socket.on("room:player-joined", ({ room, message, playerId }) => {
      console.log(message)
      setRoom(room)
      setStatus("ready")
      console.log('player:', player)
      console.log('playerId: ', playerId)
      // if (player !== playerId) {
        addPlayer({ id: playerId })
      // }
    });  
    socket.on("room:player-left", ({ message, playerId }) => {
      if (players.length === 2) {
        console.log('2 players when leaving')
        setStatus("waiting")
      } else if (players.length === 1) {
        console.log('one player when leaving')
        setStatus("idle")
        setRoom(null)
      }
      console.log(message);
      removePlayer(playerId)
    });
    socket.on("room:ready", () => setStatus("ready"));
    socket.on("room:game-start", () => setStatus("in-game"));

    return () => {
      socket.off("room:created");
      socket.off("room:player-joined");
      socket.off("room:player-left");
      socket.off("room:ready");
      socket.off("room:game-start");
    }
  }, [socket, player, players])

  return null;
}