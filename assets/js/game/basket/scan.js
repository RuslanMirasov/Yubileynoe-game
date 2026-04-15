import { getClientRect, getHorizontalIntersectionRatio } from '../utils/rect.js';

export const initBasketScan = ({ canvas, scanner, state }) => {
  if (!canvas || !scanner || !state) return;

  const updateItemZoneState = item => {
    if (!item?.element) return;

    const itemRect = getClientRect(item.element);
    const scannerRect = getClientRect(scanner);

    const intersectionRatio = getHorizontalIntersectionRatio(itemRect, scannerRect);
    item.isInBasketZone = intersectionRatio > 0.5;
  };

  const updateAllItemsZoneState = () => {
    state.activeItems.forEach(updateItemZoneState);
  };

  const tick = () => {
    updateAllItemsZoneState();
    state.scanRafId = requestAnimationFrame(tick);
  };

  updateAllItemsZoneState();
  state.scanRafId = requestAnimationFrame(tick);

  return {
    destroy() {
      if (state.scanRafId) {
        cancelAnimationFrame(state.scanRafId);
        state.scanRafId = null;
      }
    },
    updateAllItemsZoneState,
    updateItemZoneState,
  };
};
