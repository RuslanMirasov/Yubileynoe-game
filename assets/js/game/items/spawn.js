import { COOKIES_SUM, ENEMYS_SUM, FALLING_OBJECTS, GAME_TIME } from '../constants.js';

const CANVAS_SIDE_PADDING = 20;
const END_SPEED_MULTIPLIER = 1.2;

const createElementFromMarkup = markup => {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
};

const shuffleArray = items => {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = nextItems[index];

    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = currentItem;
  }

  return nextItems;
};

const buildRoundItems = () => {
  const cookieType = FALLING_OBJECTS.find(item => item.name === 'cookie');
  const enemyTypes = FALLING_OBJECTS.filter(item => item.name !== 'cookie');

  if (!cookieType || enemyTypes.length === 0) return [];

  const items = [];
  const enemyCycle = shuffleArray(enemyTypes);
  let cookiesLeft = COOKIES_SUM;
  let enemiesLeft = ENEMYS_SUM;
  let enemyIndex = 0;

  while (cookiesLeft > 0 || enemiesLeft > 0) {
    const remainingItems = cookiesLeft + enemiesLeft;
    const cookieChance = cookiesLeft / remainingItems;
    const shouldPlaceCookie = cookiesLeft > 0 && (enemiesLeft === 0 || Math.random() <= cookieChance);

    if (shouldPlaceCookie) {
      items.push(cookieType);
      cookiesLeft -= 1;
      continue;
    }

    items.push(enemyCycle[enemyIndex % enemyCycle.length]);
    enemyIndex += 1;
    enemiesLeft -= 1;
  }

  return items;
};

const measureItemTypes = (canvas, itemTypes) => {
  const metrics = {};

  itemTypes.forEach(itemType => {
    const element = createElementFromMarkup(itemType.markup);

    element.style.visibility = 'hidden';
    element.style.top = '-9999px';
    element.style.left = '0px';
    element.style.bottom = 'auto';

    canvas.appendChild(element);

    metrics[itemType.name] = {
      width: element.offsetWidth,
      height: element.offsetHeight,
    };

    element.remove();
  });

  return metrics;
};

const createLaneModel = ({ canvasWidth, basketWidth, scannerWidth, itemMetrics }) => {
  const widestItem = Math.max(...Object.values(itemMetrics).map(metric => metric.width));
  const usableWidth = Math.max(0, canvasWidth - CANVAS_SIDE_PADDING * 2);
  const safeLaneDistance = Math.max(scannerWidth, basketWidth * 0.68, widestItem);
  const laneCount = Math.max(2, Math.floor(usableWidth / safeLaneDistance) + 1);
  const lanes = [];

  for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
    lanes.push({
      ratio: laneCount === 1 ? 0.5 : laneIndex / (laneCount - 1),
      availableAt: 0,
    });
  }

  return lanes;
};

const getLaneLeft = ({ canvasWidth, laneRatio, itemWidth }) => {
  const minLeft = CANVAS_SIDE_PADDING;
  const maxLeft = Math.max(minLeft, canvasWidth - CANVAS_SIDE_PADDING - itemWidth);
  return Math.round(minLeft + (maxLeft - minLeft) * laneRatio);
};

const createSpawnSchedule = ({ canvas, basket, scanner, itemMetrics }) => {
  const roundItems = buildRoundItems();
  const totalItems = roundItems.length;

  if (totalItems === 0) return [];

  const lanes = createLaneModel({
    canvasWidth: canvas.clientWidth,
    basketWidth: basket.offsetWidth,
    scannerWidth: scanner.offsetWidth,
    itemMetrics,
  });
  const tallestItem = Math.max(...Object.values(itemMetrics).map(metric => metric.height));
  const interval = GAME_TIME / totalItems;
  const baseDuration = Math.max(interval * lanes.length * 0.9, 1600);
  const jitter = interval / Math.max(4, lanes.length + 1);

  return roundItems.map((itemType, itemIndex) => {
    const progress = totalItems === 1 ? 0 : itemIndex / (totalItems - 1);
    const metrics = itemMetrics[itemType.name];
    const duration = baseDuration / (1 + (END_SPEED_MULTIPLIER - 1) * progress);
    const plannedSpawnTime = interval * itemIndex + (itemIndex % 2 === 0 ? -jitter : jitter);
    const preferredSpawnTime = Math.max(0, plannedSpawnTime);
    const freeLanes = lanes.filter(lane => lane.availableAt <= preferredSpawnTime);
    const lanePool = freeLanes.length > 0 ? shuffleArray(freeLanes) : [...lanes].sort((leftLane, rightLane) => leftLane.availableAt - rightLane.availableAt);
    const lane = lanePool[0];
    const spawnTime = Math.max(preferredSpawnTime, lane.availableAt);

    lane.availableAt = spawnTime + duration;

    return {
      id: `${itemType.name}-${itemIndex}`,
      itemType,
      duration,
      spawnTime,
      width: metrics.width,
      height: metrics.height,
      left: getLaneLeft({
        canvasWidth: canvas.clientWidth,
        laneRatio: lane.ratio,
        itemWidth: metrics.width,
      }),
      startTop: -Math.max(metrics.height, tallestItem),
    };
  });
};

export const initItemsSpawn = ({ canvas, basket, scanner, state, registerItem }) => {
  if (!canvas || !basket || !scanner || !state || !registerItem) return;

  const itemMetrics = measureItemTypes(canvas, FALLING_OBJECTS);

  state.spawnQueue = createSpawnSchedule({
    canvas,
    basket,
    scanner,
    itemMetrics,
  });
  state.spawnIndex = 0;
  state.gameStartTime = performance.now();

  const spawnItem = itemConfig => {
    const element = createElementFromMarkup(itemConfig.itemType.markup);

    element.style.left = `${itemConfig.left}px`;
    element.style.top = `${itemConfig.startTop}px`;
    element.style.bottom = 'auto';

    registerItem({
      id: itemConfig.id,
      type: itemConfig.itemType.name,
      duration: itemConfig.duration,
      width: itemConfig.width,
      height: itemConfig.height,
      element,
    });
  };

  const tick = now => {
    const elapsed = now - state.gameStartTime;

    while (state.spawnIndex < state.spawnQueue.length) {
      const nextItem = state.spawnQueue[state.spawnIndex];

      if (elapsed < nextItem.spawnTime) break;

      spawnItem(nextItem);
      state.spawnIndex += 1;
    }

    state.spawnRafId = requestAnimationFrame(tick);
  };

  state.spawnRafId = requestAnimationFrame(tick);
};
