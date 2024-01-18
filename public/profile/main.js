const returnButton = document.querySelector('.return');

returnButton.addEventListener('click', () => {
  history.back();
});
