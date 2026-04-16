import { COOKIES_SUM } from '../constants.js';
import { ITEM_TYPES } from '../items/types.js';
import { initPointToast, pointToast } from '../utils/pointToast.js';
import { playCatchSound } from '../utils/sound.js';

export const initPoints = ({ plusPoints, minusPoints, state }) => {
  if (!Array.isArray(plusPoints) || !Array.isArray(minusPoints) || plusPoints.length === 0 || minusPoints.length === 0 || !state) return;

  state.myPoints = 0;
  state.targetPoints = COOKIES_SUM;

  initPointToast({
    state,
    plusPoints,
    minusPoints,
  });

  const handlePlusCatch = () => {
    state.targetPoints = Math.max(0, state.targetPoints - 1);
    state.myPoints += 1;
    pointToast();
  };

  const handleMinusCatch = () => {
    if (state.myPoints <= 0) return;

    state.myPoints -= 1;
    state.targetPoints += 1;
    pointToast();
  };

  const handleItemCatch = item => {
    playCatchSound(item.scoreType);

    if (item.scoreType === ITEM_TYPES.PLUS) {
      handlePlusCatch();
      return;
    }

    handleMinusCatch();
  };

  return {
    handleItemCatch,
  };
};
