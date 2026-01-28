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
  let startX = 0;
  let isDragging = false;

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
    const cardWidth = cards[0].offsetWidth + 24; // 24px spacing between cards
    track.style.transform = `translateX(-${index * cardWidth}px)`;
    track.style.transition = "transform 0.3s ease"; // smooth animation

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === cards.length - 1;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  /* Button events */
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
  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = "none"; // disable transition while dragging
  });

  track.addEventListener("touchmove", e => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(${-index * cardWidth + deltaX}px)`;
  });

  track.addEventListener("touchend", e => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const swipeThreshold = 50; // minimum swipe distance

    if (diff > swipeThreshold && index < cards.length - 1) {
      index++;
    } else if (diff < -swipeThreshold && index > 0) {
      index--;
    }

    updateCarousel();
  });

  /* Make carousel responsive on resize */
  window.addEventListener("resize", () => {
    updateCarousel();
  });

  updateCarousel(); // initial setup

});

