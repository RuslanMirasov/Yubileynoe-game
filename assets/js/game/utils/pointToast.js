const TOAST_DURATION = 1000;
const BANK_SIZE = 50;
const DOM_DELAY = 1000;

let pointToastContext = null;

const renderPoints = () => {
  if (!pointToastContext) return;

  pointToastContext.plusPoints.forEach(pointElement => {
    pointElement.textContent = String(pointToastContext.state.myPoints);
  });

  pointToastContext.minusPoints.forEach(pointElement => {
    pointElement.textContent = String(pointToastContext.state.targetPoints);
  });
};

const renderMyPoints = () => {
  if (!pointToastContext) return;

  pointToastContext.plusPoints.forEach(pointElement => {
    pointElement.textContent = String(pointToastContext.state.myPoints);
  });
};

const renderTargetPoints = () => {
  if (!pointToastContext) return;

  pointToastContext.minusPoints.forEach(pointElement => {
    pointElement.textContent = String(pointToastContext.state.targetPoints);
  });
};

const createToastElement = ({ sourceBank, value, className }) => {
  const toastElement = document.createElement('div');
  const toastValue = document.createElement('span');

  toastElement.classList.add('point', className);
  toastValue.textContent = String(value);
  toastElement.appendChild(toastValue);
  toastElement.style.left = '0px';
  toastElement.style.top = '0px';
  toastElement.style.width = `${BANK_SIZE}px`;
  toastElement.style.height = `${BANK_SIZE}px`;
  toastElement.style.zIndex = '20';
  toastElement.style.pointerEvents = 'none';
  toastElement.style.willChange = 'transform';

  sourceBank.appendChild(toastElement);

  return toastElement;
};

const animateToast = ({ sourceBank, targetBank, startClassName, endClassName, value }) => {
  if (!sourceBank || !targetBank) return;

  const sourceRect = sourceBank.getBoundingClientRect();
  const targetRect = targetBank.getBoundingClientRect();
  const offsetX = targetRect.left - sourceRect.left;
  const offsetY = targetRect.top - sourceRect.top;
  const toastElement = createToastElement({
    sourceBank,
    value,
    className: startClassName,
  });

  toastElement.animate([{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }], {
    duration: TOAST_DURATION,
    easing: 'ease',
    fill: 'forwards',
  });

  window.setTimeout(() => {
    toastElement.classList.remove(startClassName);
    toastElement.classList.add(endClassName);
  }, TOAST_DURATION / 10);

  window.setTimeout(() => {
    toastElement.remove();
  }, TOAST_DURATION);
};

const animatePlusToast = () => {
  if (!pointToastContext) return;

  animateToast({
    sourceBank: pointToastContext.targetBank,
    targetBank: pointToastContext.myBank,
    startClassName: 'lose',
    endClassName: 'win',
    value: pointToastContext.state.myPoints,
  });
};

const animateMinusToast = () => {
  if (!pointToastContext) return;

  animateToast({
    sourceBank: pointToastContext.myBank,
    targetBank: pointToastContext.targetBank,
    startClassName: 'win',
    endClassName: 'lose',
    value: pointToastContext.state.targetPoints,
  });
};

export const initPointToast = ({ state, plusPoints, minusPoints }) => {
  const targetBank = document.querySelector('[data-target-bank]');
  const myBank = document.querySelector('[data-my-bank]');

  if (!state || !Array.isArray(plusPoints) || !Array.isArray(minusPoints) || plusPoints.length === 0 || minusPoints.length === 0 || !targetBank || !myBank)
    return;

  pointToastContext = {
    state,
    plusPoints,
    minusPoints,
    targetBank,
    myBank,
  };

  renderPoints();
  window.pointToast = pointToast;
};

export const pointToast = type => {
  if (!pointToastContext) return;

  if (type === 'plus') {
    renderTargetPoints();
    animatePlusToast();

    window.setTimeout(() => {
      renderMyPoints();
    }, DOM_DELAY);

    return;
  }

  if (type === 'minus') {
    renderMyPoints();
    animateMinusToast();

    window.setTimeout(() => {
      renderTargetPoints();
    }, DOM_DELAY);
  }
};
