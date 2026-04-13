import { getClientRect, getHorizontalIntersectionRatio } from '../utils/rect.js';

export const initBasketScan = ({ canvas, scanner, state }) => {
  if (!canvas || !scanner || !state) return;

  const getItems = () => canvas.querySelectorAll('.falling-item');

  const updateItemZoneState = item => {
    const itemRect = getClientRect(item);
    const scannerRect = getClientRect(scanner);

    const intersectionRatio = getHorizontalIntersectionRatio(itemRect, scannerRect);
    const isInBasketZone = intersectionRatio > 0.5;

    item.classList.toggle('in-basket-zone', isInBasketZone);
  };

  const updateAllItemsZoneState = () => {
    const items = getItems();

    items.forEach(updateItemZoneState);
  };

  const tick = () => {
    updateAllItemsZoneState();
    state.scanRafId = requestAnimationFrame(tick);
  };

  updateAllItemsZoneState();
  state.scanRafId = requestAnimationFrame(tick);

  return {
    updateAllItemsZoneState,
    updateItemZoneState,
  };
};
