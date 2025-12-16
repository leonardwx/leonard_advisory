// ===============================
// Flip cards tap support (mobile)
// ===============================
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


// ===============================
// Smooth scroll with navbar offset
// ===============================
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar.offsetHeight;

document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    // Use current navbar height dynamically
    const currentNavbarHeight = navbar.offsetHeight;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      currentNavbarHeight; // remove the extra -10

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
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
