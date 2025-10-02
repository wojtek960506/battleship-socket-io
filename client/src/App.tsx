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
          <p className="info-text">Enter a room name to start playing!</p>
        </div>
      </main>
    </div>
  )
}

export default App
