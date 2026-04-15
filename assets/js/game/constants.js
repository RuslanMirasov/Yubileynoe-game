// Cкорость движения корзины при управлении стрелками клавиатуры
export const KEYBOARD_SPEED = 12;

// Cкорость падения предметов
export const FALL_SPEED = 150;

// отступы у игрового поля (за их пределами нельзя генерировать падающие предметы)
export const CANVAS_SIDE_PADDING = 20;

// на сколько увеличивается скорость падения за время игры
export const END_SPEED_MULTIPLIER = 3;

// Общее время игры (1 минута)
export const GAME_TIME = 1000 * 60;

// Сколько генерировать печенек
export const COOKIES_SUM = 20;

// Сколько генерировать врагов
export const ENEMYS_SUM = 40;

// Разметка падающих предметов
export const FALLING_OBJECTS = [
  { name: 'cookie', markup: '<div class="falling-item cookie" data-plus></div>' },
  { name: 'apple', markup: '<div class="falling-item apple" data-minus></div>' },
  { name: 'cock', markup: '<div class="falling-item cock" data-minus></div>' },
  { name: 'baranka', markup: '<div class="falling-item baranka" data-minus></div>' },
];
