export const createGameState = () => {
  return {
    basketX: 0,
    basketMinX: 0,
    basketMaxX: 0,

    isLeftPressed: false,
    isRightPressed: false,
    pointerActive: false,

    rafId: null,
    scanRafId: null,
    spawnRafId: null,
    fallRafId: null,

    gameStartTime: 0,
    spawnQueue: [],
    spawnIndex: 0,
    activeItems: [],
  };
};
