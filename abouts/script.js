// Navigation toggling for mobile menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('active');

    const hamburgers = navToggle.querySelectorAll('.hamburger');
    hamburgers.forEach((line, index) => {
      if (navMenu.classList.contains('active')) {
        if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) line.style.opacity = '0';
        if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        line.style.transform = 'none';
        line.style.opacity = '1';
      }
    });
  });
}

// Close mobile menu on link click and reset hamburger
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', false);
      navToggle.querySelectorAll('.hamburger').forEach(line => {
        line.style.transform = 'none';
        line.style.opacity = '1';
      });
    }
  });
});

// Smooth scroll and active nav link highlighting for about page
function updateActiveNav() {
  const sections = document.querySelectorAll('section');
  const scrollPos = window.scrollY + 120;
  let currentSectionId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}

function updateNavbarBackground() {
  navbar.style.background = 'var(--white)';
  navbar.style.color = 'var(--black)';
  navbar.style.backdropFilter = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  updateNavbarBackground();

  // Scroll events
  window.addEventListener('scroll', () => {
    updateActiveNav();
    updateNavbarBackground();
  });
});

// Smooth scroll on nav link clicks for about page sections
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        target.focus({ preventScroll: true });
      }
    }
  });
});