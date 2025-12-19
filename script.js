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



