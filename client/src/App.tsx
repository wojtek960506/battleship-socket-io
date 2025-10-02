import './App.css'

function App() {

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Battleship</h1>
      </header>

      <main className="lobby-container">
        <div className="lobby-card">
          <h2>Join or Create a Room</h2>

          <div className="room-form">
            <input type="text" placeholder="Enter room name" />
            <div className="button-group">
              <button className="create-btn">Create Room</button>
              <button className="join-btn">Join Room</button>
            </div>
          </div>
          
          <div className="room-list">
            <h3>Available Rooms</h3>
            <ul>
              <li>Room Alpha <button>Join</button></li>
              <li>Room Bravo <button>Join</button></li>
              <li>Room Charlie <button>Join</button></li>
              <li>Room Delta <button>Join</button></li>
            </ul>
          </div>
          
          <p className="info-text">Join or create a room to start playing!</p>
        </div>
      </main>
    </div>
  )
}

export default App
