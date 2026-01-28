// ===============================
// Flip cards tap support (mobile)
// ===============================
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


// ===============================
// Smooth scroll with navbar offset (mobile & desktop)// 
// ===============================
const navbar = document.querySelector('.navbar');

document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    // Get current navbar height dynamically
    const currentNavbarHeight = navbar.offsetHeight;

    // Scroll to section
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - currentNavbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
});


// ===============================
// Hamburger menu toggle (mobile)
// ===============================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu after clicking a link
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const track = document.getElementById("carouselTrack");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");

  let index = 0;

  /* Create dots */
  cards.forEach((_, i) => {
    const dot = document.createElement("span");

    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".carousel-dots span");

  /* Update carousel */
  function updateCarousel() {

    const cardWidth = cards[0].offsetWidth + 24;

    track.style.transform = `translateX(-${index * cardWidth}px)`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === cards.length - 1;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  nextBtn.addEventListener("click", () => {
    if (index < cards.length - 1) {
      index++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });

  /* Mobile swipe */
  let startX = 0;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", e => {

    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50 && index < cards.length - 1) index++;
    if (endX - startX > 50 && index > 0) index--;

    updateCarousel();
  });

  updateCarousel();

});
