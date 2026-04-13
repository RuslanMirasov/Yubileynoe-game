export const initItemsFall = ({ canvas, state }) => {
  if (!canvas || !state) return;

  const removeItem = item => {
    item.element.remove();
  };

  const registerItem = item => {
    if (!item?.element) return;

    state.activeItems.push({
      ...item,
      startedAt: performance.now(),
      travelDistance: canvas.clientHeight + item.height * 2,
    });

    canvas.appendChild(item.element);
  };

  const tick = now => {
    const nextActiveItems = [];

    state.activeItems.forEach(item => {
      const elapsed = now - item.startedAt;
      const progress = elapsed / item.duration;

      if (progress >= 1) {
        removeItem(item);
        return;
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
    registerItem,
  };
};
