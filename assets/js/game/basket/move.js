import { KEYBOARD_SPEED } from '../constants.js';
import { clamp } from '../utils/clamp.js';
import { getClientRect } from '../utils/rect.js';

export const initBasketMove = ({ canvas, basket, basketBack, state }) => {
  if (!canvas || !basket || !basketBack || !state) return;

  const getBasketWidth = () => basket.offsetWidth;

  const updateBounds = () => {
    const canvasWidth = canvas.clientWidth;
    const basketWidth = getBasketWidth();

    state.basketMinX = 0;
    state.basketMaxX = Math.max(0, canvasWidth - basketWidth);
    state.basketX = clamp(state.basketX, state.basketMinX, state.basketMaxX);
  };

  const renderBasket = () => {
    const translate = `translate3d(${state.basketX}px, 0, 0)`;

    basket.style.transform = translate;
    basketBack.style.transform = translate;
  };

  const setBasketByClientX = clientX => {
    const canvasRect = getClientRect(canvas);
    const basketWidth = getBasketWidth();

    const localX = clientX - canvasRect.left;
    const nextX = localX - basketWidth / 2;

    state.basketX = clamp(nextX, state.basketMinX, state.basketMaxX);
    renderBasket();
  };

  const onPointerDown = event => {
    state.pointerActive = true;

    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
    }

    setBasketByClientX(event.clientX);
  };

  const onPointerMove = event => {
    if (!state.pointerActive) return;
    setBasketByClientX(event.clientX);
  };

  const onPointerUp = event => {
    state.pointerActive = false;

    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = event => {
    if (event.key === 'ArrowLeft') {
      state.isLeftPressed = true;
      event.preventDefault();
    }

    if (event.key === 'ArrowRight') {
      state.isRightPressed = true;
      event.preventDefault();
    }
  };

  const onKeyUp = event => {
    if (event.key === 'ArrowLeft') {
      state.isLeftPressed = false;
      event.preventDefault();
    }

    if (event.key === 'ArrowRight') {
      state.isRightPressed = false;
      event.preventDefault();
    }
  };

  const onResize = () => {
    updateBounds();
    renderBasket();
  };

  const tick = () => {
    let nextX = state.basketX;

    if (state.isLeftPressed) nextX -= KEYBOARD_SPEED;
    if (state.isRightPressed) nextX += KEYBOARD_SPEED;

    nextX = clamp(nextX, state.basketMinX, state.basketMaxX);

    if (nextX !== state.basketX) {
      state.basketX = nextX;
      renderBasket();
    }

    state.rafId = requestAnimationFrame(tick);
  };

  const setInitialPosition = () => {
    updateBounds();

    const basketWidth = getBasketWidth();
    state.basketX = clamp((canvas.clientWidth - basketWidth) / 2, state.basketMinX, state.basketMaxX);

    renderBasket();
  };

  setInitialPosition();

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onResize);

  state.rafId = requestAnimationFrame(tick);

  return {
    destroy() {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }

      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
    },
    updateBounds,
    renderBasket,
    setBasketByClientX,
  };
};
