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

export const initPointToast = ({ state, plusPoints, minusPoints }) => {
  if (!state || !Array.isArray(plusPoints) || !Array.isArray(minusPoints) || plusPoints.length === 0 || minusPoints.length === 0) return;

  pointToastContext = {
    state,
    plusPoints,
    minusPoints,
  };

  renderPoints();
};

export const pointToast = () => {
  if (!pointToastContext) return;
  renderPoints();
};
