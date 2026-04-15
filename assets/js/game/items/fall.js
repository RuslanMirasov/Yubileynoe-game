import { getClientRect } from '../utils/rect.js';

const CATCH_OFFSET = 17;

export const initItemsFall = ({ canvas, basket, state, onItemCatch }) => {
  if (!canvas || !basket || !state) return;

  const removeItem = item => {
    item.element.remove();
  };

  const registerItem = item => {
    if (!item?.element) return;

    const activeItem = {
      ...item,
      startedAt: performance.now(),
      travelDistance: canvas.clientHeight + item.height * 2,
      left: Number.parseFloat(item.element.style.left) || 0,
      isCaptured: false,
      isResolved: false,
      isOut: false,
      isInBasketZone: false,
      captureOffsetX: 0,
    };

    item.element.__gameItem = activeItem;
    state.activeItems.push(activeItem);

    canvas.prepend(item.element);
  };

  const tryCaptureItem = (item, basketRect) => {
    if (item.isResolved || item.isOut) return;

    const itemRect = getClientRect(item.element);
    const catchLine = basketRect.top + CATCH_OFFSET;
    const hasReachedCatchLine = itemRect.bottom >= catchLine;

    if (!hasReachedCatchLine) return;

    item.isOut = true;
    if (!item.isInBasketZone) return;

    item.isCaptured = true;
    item.isResolved = true;
    item.captureOffsetX = item.left - state.basketX;
    item.element.classList.add('is-captured');

    onItemCatch?.(item);
  };

  const tick = now => {
    const nextActiveItems = [];
    const basketRect = getClientRect(basket);

    state.activeItems.forEach(item => {
      const elapsed = now - item.startedAt;
      const progress = elapsed / item.duration;

      if (progress >= 1) {
        removeItem(item);
        return;
      }

      tryCaptureItem(item, basketRect);

      if (item.isCaptured) {
        item.left = state.basketX + item.captureOffsetX;
        item.element.style.left = `${item.left}px`;
      }

      const nextTop = -item.height + item.travelDistance * progress;
      item.element.style.top = `${nextTop}px`;
      nextActiveItems.push(item);
    });

    state.activeItems = nextActiveItems;
    state.fallRafId = requestAnimationFrame(tick);
  };

  state.fallRafId = requestAnimationFrame(tick);

  return {
    destroy() {
      if (state.fallRafId) {
        cancelAnimationFrame(state.fallRafId);
        state.fallRafId = null;
      }

      state.activeItems.forEach(removeItem);
      state.activeItems = [];
    },
    registerItem,
  };
};
