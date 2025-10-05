import { resetRoomsStore, useRoomsStore } from "./RoomsStore"


describe("test RoomsStore", () => {

  beforeEach(() => {
    resetRoomsStore();
  })

  test("setRooms", () => {
    useRoomsStore.getState().setRooms([{ name: 'a', owner: 'b', size: 1}])
    expect(useRoomsStore.getState().rooms).toHaveLength(1);
  })
})
