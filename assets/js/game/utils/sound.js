import { ITEM_TYPES } from '../items/types.js';

const FALL_SOUND_SRC = './assets/sounds/fall.mp3';
const CATCH_SOUND_SRC = './assets/sounds/catch.mp3';
const SUCCESS_SOUND_SRC = './assets/sounds/success.mp3';
const GAME_OVER_SOUND_SRC = './assets/sounds/game-over.mp3';

let audioContext = null;
let unlockBound = false;
let soundLibrary = null;
let preloadPromise = null;

const getAudioContext = () => {
  if (audioContext) return audioContext;

  const Context = window.AudioContext || window.webkitAudioContext;

  if (!Context) return null;

  audioContext = new Context();
  return audioContext;
};

const resumeAudioContext = async () => {
  const context = getAudioContext();

  if (!context || context.state !== 'suspended') return;

  try {
    await context.resume();
  } catch {}
};

const bindAudioUnlock = () => {
  if (unlockBound) return;

  unlockBound = true;

  const unlockAudio = () => {
    resumeAudioContext();
    document.removeEventListener('pointerdown', unlockAudio, true);
    document.removeEventListener('touchstart', unlockAudio, true);
    document.removeEventListener('mousedown', unlockAudio, true);
    document.removeEventListener('click', unlockAudio, true);
    window.removeEventListener('keydown', unlockAudio, true);
  };

  document.addEventListener('pointerdown', unlockAudio, { capture: true, once: true });
  document.addEventListener('touchstart', unlockAudio, { capture: true, once: true });
  document.addEventListener('mousedown', unlockAudio, { capture: true, once: true });
  document.addEventListener('click', unlockAudio, { capture: true, once: true });
  window.addEventListener('keydown', unlockAudio, { capture: true, once: true });
};

const loadSoundBuffer = async src => {
  const context = getAudioContext();

  if (!context) return null;

  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));

  return audioBuffer;
};

const ensureSoundLibrary = () => {
  if (soundLibrary) {
    return Promise.resolve(soundLibrary);
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  preloadPromise = Promise.all([loadSoundBuffer(FALL_SOUND_SRC), loadSoundBuffer(CATCH_SOUND_SRC), loadSoundBuffer(SUCCESS_SOUND_SRC), loadSoundBuffer(GAME_OVER_SOUND_SRC)])
    .then(([fallBuffer, catchBuffer, successBuffer, gameOverBuffer]) => {
      soundLibrary = {
        fall: fallBuffer,
        catch: catchBuffer,
        success: successBuffer,
        gameOver: gameOverBuffer,
      };

      return soundLibrary;
    })
    .catch(() => null);

  return preloadPromise;
};

const playAudioBuffer = buffer => {
  const context = getAudioContext();

  if (!context || !buffer) return;

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
};

export const initGameAudio = () => {
  getAudioContext();
  bindAudioUnlock();
  ensureSoundLibrary();
};

export const playCatchSound = async scoreType => {
  await resumeAudioContext();

  const library = soundLibrary || (await ensureSoundLibrary());

  if (!library) return;

  playAudioBuffer(library.fall);

  if (scoreType === ITEM_TYPES.PLUS) {
    playAudioBuffer(library.catch);
  }
};

export const playSuccessSound = async () => {
  await resumeAudioContext();

  const library = soundLibrary || (await ensureSoundLibrary());

  if (!library) return;

  playAudioBuffer(library.success);
};

export const playGameOverSound = async () => {
  await resumeAudioContext();

  const library = soundLibrary || (await ensureSoundLibrary());

  if (!library) return;

  playAudioBuffer(library.gameOver);
};
