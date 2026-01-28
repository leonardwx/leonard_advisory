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
// Testimonials Carousel (Drag / Pull Style)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const track = document.getElementById("carouselTrack");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");
  const swipeArrows = document.querySelectorAll(".carousel-swipe-hint .swipe-arrow");

  if (!track || cards.length === 0) return;

  let index = 0;

  // Drag variables
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;


  // ===============================
  // Create Dots
  // ===============================
  cards.forEach((_, i) => {

    const dot = document.createElement("span");

    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      snapToIndex();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".carousel-dots span");


  // ===============================
  // Helpers
  // ===============================
  function getCardWidth() {

    const style = getComputedStyle(cards[0]);

    return (
      cards[0].getBoundingClientRect().width +
      parseInt(style.marginRight)
    );
  }


  function setPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }


  function updateDots() {

    dots.forEach(dot => dot.classList.remove("active"));

    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }


  function snapToIndex() {

    const width = getCardWidth();

    currentTranslate = -index * width;
    prevTranslate = currentTranslate;

    track.style.transition = "transform 0.3s ease";
    setPosition();

    updateDots();
  }


  // ===============================
  // Drag Events
  // ===============================
  function dragStart(x) {

    isDragging = true;
    startX = x;

    track.style.transition = "none";

    animationID = requestAnimationFrame(animation);
  }


  function dragMove(x) {

    if (!isDragging) return;

    const diff = x - startX;

    currentTranslate = prevTranslate + diff;
  }


  function dragEnd() {

    cancelAnimationFrame(animationID);

    isDragging = false;

    const width = getCardWidth();

    const movedBy = currentTranslate - prevTranslate;

    // Decide snap direction
    if (movedBy < -width / 4 && index < cards.length - 1) {
      index++;
    }

    if (movedBy > width / 4 && index > 0) {
      index--;
    }

    snapToIndex();
  }


  function animation() {

    setPosition();

    if (isDragging) {
      requestAnimationFrame(animation);
    }
  }


  // ===============================
  // Touch Events (Mobile)
  // ===============================
  track.addEventListener("touchstart", e => {
    dragStart(e.touches[0].clientX);
  });

  track.addEventListener("touchmove", e => {
    dragMove(e.touches[0].clientX);
  });

  track.addEventListener("touchend", dragEnd);


  // ===============================
  // Mouse Events (Desktop)
  // ===============================
  track.addEventListener("mousedown", e => {
    dragStart(e.clientX);
  });

  window.addEventListener("mousemove", e => {
    dragMove(e.clientX);
  });

  window.addEventListener("mouseup", dragEnd);


  // ===============================
  // Buttons
  // ===============================
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (index < cards.length - 1) {
        index++;
        snapToIndex();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (index > 0) {
        index--;
        snapToIndex();
      }
    });
  }


  // ===============================
  // Bottom Arrows
  // ===============================
  swipeArrows.forEach((arrow, i) => {

    arrow.addEventListener("click", () => {

      if (i === 0 && index > 0) index--;
      if (i === 1 && index < cards.length - 1) index++;

      snapToIndex();
    });

  });


  // ===============================
  // Resize
  // ===============================
  window.addEventListener("resize", snapToIndex);


  // ===============================
  // Init
  // ===============================
  snapToIndex();

});
