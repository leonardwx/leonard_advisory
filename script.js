// Flip cards tap support for mobile
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// Smooth scroll with offset to prevent overshoot
const navbarHeight = document.querySelector('.navbar').offsetHeight;

document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10; 
    // -10 for small padding above section
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });

  // Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close menu after clicking a link (mobile UX)
document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

});

