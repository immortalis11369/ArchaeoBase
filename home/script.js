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

function updateNavbarBackground() {
  navbar.style.background = 'var(--white)';
  navbar.style.color = 'var(--black)';
  navbar.style.backdropFilter = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  rotateGradient(document.getElementById('title'), 'var(--gold-light)', '#ba6028ff', 1.5);
  rotateGradient(document.getElementById('subtitle'), '#ffffff', '#feb47b', 0.8);
  rotateGradient(document.getElementById('btnSubmit'), 'var(--gold-dark)', '#ffe749ff', 2);
  updateNavbarBackground();
});

// Search bar alert placeholder
function alertSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Por favor, digite uma busca ou tag.");
  } else {
    alert(`Você buscou por: "${query}"\n(Banco de dados ainda não conectado)`);
  }
}

function rotateGradient(titleElement, colorA, colorB, rotationSpeed) {
  if (!titleElement) return;
  
  let rotationAngle = 0;

  // For elements that aren't the 'title' - keep the original animation
  if (titleElement.id !== 'title') {
    const animate = () => {
      rotationAngle = (rotationAngle + rotationSpeed) % 360;
      
      titleElement.style.background = `linear-gradient(${rotationAngle}deg, ${colorA}, ${colorB})`;
      titleElement.style.backgroundClip = 'text';
      titleElement.style.webkitBackgroundClip = 'text';
      titleElement.style.webkitTextFillColor = 'transparent';
      
      requestAnimationFrame(animate);
    }
    
    // Start the animation
    animate();
  } 
  else {
    const handleMouseMove = (e) => {
      const rect = titleElement.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // Adjust angle to be between 0-360 instead of -180 to 180
      if (angle < 0) {
        angle += 360;
      }
      
      titleElement.style.background = `linear-gradient(${angle}deg, ${colorA}, ${colorB})`;
      titleElement.style.backgroundClip = 'text';
      titleElement.style.webkitBackgroundClip = 'text';
      titleElement.style.webkitTextFillColor = 'transparent';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
  }
}