// ===============================
// Flip cards tap support (mobile)
// ===============================
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


// ===============================
// Hamburger menu toggle (mobile)
// ===============================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu'); // <- moved up so it's defined early


// ===============================
// Smooth scroll with navbar offset (mobile & desktop)
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
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
});


// ===============================
// Hamburger menu toggle (mobile)
// ===============================
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

// ===============================
// Testimonials Carousel
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const track = document.getElementById("carouselTrack");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");
  const swipeArrows = document.querySelectorAll(".carousel-swipe-hint .swipe-arrow");

  if (!track || cards.length === 0) return; // safety check

  let index = 0;
  let startX = 0;

  // ===============================
  // Create dots
  // ===============================
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


  // ===============================
  // Update carousel
  // ===============================
  function updateCarousel() {

    const cardStyle = getComputedStyle(cards[0]);

    const cardWidth =
      cards[0].getBoundingClientRect().width +
      parseInt(cardStyle.marginRight);

    track.style.transform = `translateX(-${index * cardWidth}px)`;

    // Buttons disable
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index >= cards.length - 1;

    // Update dots
    dots.forEach(dot => dot.classList.remove("active"));

    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }


  // ===============================
  // Button Navigation
  // ===============================
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (index < cards.length - 1) {
        index++;
        updateCarousel();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (index > 0) {
        index--;
        updateCarousel();
      }
    });
  }


  // ===============================
  // Swipe Support (Mobile)
  // ===============================
  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", e => {

    const endX = e.changedTouches[0].clientX;

    const swipeDistance = startX - endX;

    const threshold = cards[0].offsetWidth * 0.25; // 25%

    // Swipe left → next
    if (swipeDistance > threshold && index < cards.length - 1) {
      index++;
    }

    // Swipe right → prev
    if (-swipeDistance > threshold && index > 0) {
      index--;
    }

    updateCarousel();
  });


  // ===============================
  // Bottom Swipe Arrows
  // ===============================
  swipeArrows.forEach((arrow, i) => {

    arrow.addEventListener("click", () => {

      // Left arrow
      if (i === 0 && index > 0) {
        index--;
      }

      // Right arrow
      if (i === 1 && index < cards.length - 1) {
        index++;
      }

      updateCarousel();
    });

  });


  // ===============================
  // Resize Support
  // ===============================
  window.addEventListener("resize", updateCarousel);


  // ===============================
  // Init
  // ===============================
  updateCarousel();

});
