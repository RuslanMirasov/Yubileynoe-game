export const initPreloader = (delay = 0) => {
  const addLoadedClass = () => {
    window.setTimeout(() => {
      document.body.classList.add("loaded");
    }, delay);
  };

  if (document.readyState === "complete") {
    addLoadedClass();
  } else {
    window.addEventListener("load", addLoadedClass, { once: true });
  }
};
