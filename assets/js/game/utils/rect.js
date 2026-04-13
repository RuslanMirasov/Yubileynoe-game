export const getClientRect = element => {
  return element.getBoundingClientRect();
};

export const getHorizontalIntersectionRatio = (itemRect, zoneRect) => {
  const overlapLeft = Math.max(itemRect.left, zoneRect.left);
  const overlapRight = Math.min(itemRect.right, zoneRect.right);
  const intersectionWidth = Math.max(0, overlapRight - overlapLeft);

  if (itemRect.width <= 0) return 0;

  return intersectionWidth / itemRect.width;
};
