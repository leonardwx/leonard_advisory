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

// Smooth scroll with navbar offset (mobile & desktop safe)
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    // If mobile, close menu first
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }

    // Use setTimeout to wait for menu to collapse on mobile
    setTimeout(() => {
      const currentNavbarHeight = navbar.offsetHeight;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        currentNavbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }, 50); // 50ms is usually enough
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

