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
    setPlayers,
    addPlayer,
    removePlayer,
    setStatus,
    setErrorMessage,
    setPlayerWhoLeft,
  } = useRoomStore();

  useEffect(() => {
    socket.on("room:set-player", playerId => {
      setPlayer(playerId);
    })

    socket.on("room:created", ({ room, message, playerId }) => {
      setRoom(room);
      addPlayer({ id: playerId });
      setStatus("waiting");
      setErrorMessage('');
      setPlayerWhoLeft(null);

      console.log(message)
      // update list for every user of server
      socket.emit("server:list-rooms")
      socket.emit("server:list-rooms-for-everyone")
    });
    socket.on("room:already-exists", (data) => {
      setErrorMessage(data.message)
    });

    socket.on("room:you-joined", ({ room, message, ownerId }) => {
      console.log(message)
      setRoom(room)
      setStatus("ready")
      setErrorMessage('')
      setPlayers([{ id: ownerId }, { id: player }])
    });

    socket.on("room:someone-joined", ({ message, playerId }) => {
      console.log(message)
      setStatus("ready")
      setPlayers([{ id: player}, { id: playerId }])
    });  

    socket.on("room:you-left", () => {
      setErrorMessage("")
      setStatus("idle")
      setRoom(null)
      setPlayers([])
    });

    socket.on("room:someone-left", ({ message, playerId }) => {
      setStatus("waiting")
      console.log(message);
      removePlayer(playerId);
      setPlayerWhoLeft(playerId)
    });

    socket.on("room:ready", () => setStatus("ready"));

    socket.on("room:game-start", () => setStatus("in-game"));

    return () => {
      socket.off("room:set-player");
      socket.off("room:created");
      socket.off("room:already-exists");
      socket.off("room:you-joined");
      socket.off("room:someone-joined");
      socket.off("room:you-left");
      socket.off("room:someone-left");
      socket.off("room:ready");
      socket.off("room:game-start");
    }
  }, [player, players])

  return null;
}
