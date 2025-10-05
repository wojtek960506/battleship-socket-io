import { resetRoomStore, useRoomStore } from "./RoomStore"


describe("test RoomStore", () => {
  
  beforeEach(() => resetRoomStore())


  test("addPlayer and removePlayer", () => {
    useRoomStore.getState().addPlayer({ id: 'player1' })
    useRoomStore.getState().addPlayer({ id: 'player2' })

    expect(useRoomStore.getState().players.map(p => p.id)).toContain('player1')
    expect(useRoomStore.getState().players.map(p => p.id)).toContain('player2')

    useRoomStore.getState().removePlayer('player2');

    expect(useRoomStore.getState().players.map(p => p.id)).toContain('player1')
    expect(useRoomStore.getState().players.map(p => p.id)).not.toContain('player2')
  })

})