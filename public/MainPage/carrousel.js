const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slides = document.querySelectorAll(".slide");
let counter = 0;

const nextSlide = () => {
  slides.forEach((slide, i) => {
    if (i == counter) slide.style.opacity = "1";
    else slide.style.opacity = "0";
  });
};

setInterval(() => {
  if (counter < slides.length - 1) counter++;
  else counter = 0;

  nextSlide();
}, 5000);

prevBtn.addEventListener("click", () => {
  if (counter > 0) counter--;
  else counter = slides.length - 1;

  nextSlide();
});

nextBtn.addEventListener("click", () => {
  if (counter < slides.length - 1) counter++;
  else counter = 0;

  nextSlide();
});
