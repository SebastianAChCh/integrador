let rating = 0;

function hoverRating(value) {
  updateStars(value);
}

function rate(value) {
  rating = value;
  updateStars();
}

function updateStars() {
  const stars = document.querySelectorAll(".rating img");
  stars.forEach((star, index) => {
    star.classList.toggle("selected", index < rating);
  });
}

function submitRating() {
  showModal("Calificación enviada: " + rating);
}

function showModal(message) {
  document.getElementById("modal-text").innerHTML = message;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function acceptModal() {
  closeModal();
  // Aquí puedes agregar la lógica para redirigir al usuario a la página anterior
  // window.history.back();
}
