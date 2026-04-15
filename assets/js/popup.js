export const initPopup = () => {
  const popups = Array.from(document.querySelectorAll('.popup'));

  if (popups.length === 0) return;

  const close = () => {
    popups.forEach(popup => {
      popup.classList.remove('active');
    });
  };

  const open = id => {
    if (!id) return;

    const targetPopup = document.getElementById(id);

    close();

    if (!targetPopup || !targetPopup.classList.contains('popup')) return;

    targetPopup.classList.add('active');
  };

  const popupApi = {
    open,
    close,
  };

  window.popup = popupApi;

  return popupApi;
};
