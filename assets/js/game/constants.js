// Скорость движения корзины при управлении стрелками
export const KEYBOARD_SPEED = 12;

// Время одного раунда
export const GAME_TIME = 1000 * 60;

// Кол-во печенек
export const COOKIES_SUM = 20;

// Кол-во врагов
export const ENEMYS_SUM = 50;

// Персонажи
export const FALLING_OBJECTS = [
  { name: 'cookie', markup: '<div class="falling-item cookie" data-plus></div>' },
  { name: 'apple', markup: '<div class="falling-item apple" data-minus></div>' },
  { name: 'cock', markup: '<div class="falling-item cock" data-minus></div>' },
  { name: 'baranka', markup: '<div class="falling-item baranka" data-minus></div>' },
];
