// Navigation toggling for mobile menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const resultsContainer = document.getElementById('resultsContainer');

let artifactsData = [];

async function loadArtifacts() {
    try {
        const response = await fetch('../ArchaeoBase/data/artifacts.json');
        const data = await response.json();
        artifactsData = data.artifacts;
        console.log('Artifacts loaded:', artifactsData); // Debug log
    } catch (error) {
        console.error('Error loading artifacts:', error);
    }
}

// Search functionality
function searchArtifacts(query) {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    console.log('Searching for:', searchTerm); // Debug log
    
    const results = artifactsData.filter(artifact => {
        // Search in name
        if (artifact.name.toLowerCase().includes(searchTerm)) return true;
        
        // Search in alias
        if (artifact.alias.some(alias => alias.toLowerCase().includes(searchTerm))) return true;
        
        // Search in tags
        if (artifact.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
        
        // Search in description
        if (artifact.description.toLowerCase().includes(searchTerm)) return true;
        
        return false;
    });

    console.log('Found results:', results); // Debug log
    return results;
}

// Display search results
function displayResults(results) {
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>Nenhum artefato encontrado para sua busca.</p>
                <p>Tente usar termos como: "lego", "L", "preto", etc.</p>
            </div>
        `;
        return;
    }

    results.forEach(artifact => {
        const card = document.createElement('div');
        card.className = 'artifact-card';
        
        card.innerHTML = `
            <img src="${artifact.img}" alt="${artifact.name}" class="artifact-image-small" 
                 onerror="this.src='assets/placeholder.jpg'">
            <div class="artifact-content">
                <h4>${artifact.name}</h4>
                <p>${artifact.description}</p>
                <div class="artifact-tags">
                    ${artifact.alias.map(alias => `<span class="artifact-tag">${alias}</span>`).join('')}
                    ${artifact.tags.map(tag => `<span class="artifact-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            viewArtifactDetails(artifact.id);
        });
        
        resultsContainer.appendChild(card);
    });
}

// View artifact details (redirect to detail page)
function viewArtifactDetails(artifactId) {
    window.location.href = `artifact-details.html?id=${artifactId}`;
}

// Handle search form submission
function handleSearch(event) {
    event.preventDefault();
    console.log('Form submitted'); // Debug log
    
    const query = searchInput.value.trim();
    if (!query) {
        alert("Por favor, digite uma busca ou tag.");
        return;
    }

    const results = searchArtifacts(query);
    displayResults(results);
    searchResults.style.display = 'block';
    
    // Scroll to results
    searchResults.scrollIntoView({ behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded'); // Debug log
    await loadArtifacts();
    
    // Search form event listener
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
        console.log('Search form event listener attached'); // Debug log
    }
    
    // Initialize other functions
    rotateGradient(document.getElementById('title'), 'var(--gold-light)', '#ba6028ff', 1.5);
    rotateGradient(document.getElementById('subtitle'), '#ffffff', '#feb47b', 0.8);
    rotateGradient(document.getElementById('btnSubmit'), 'var(--gold-dark)', '#ffe749ff', 2);
    updateNavbarBackground();
});

// Navigation functionality
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
  if (navbar) {
    navbar.style.background = 'var(--white)';
    navbar.style.color = 'var(--black)';
    navbar.style.backdropFilter = 'none';
  }
}

function rotateGradient(titleElement, colorA, colorB, rotationSpeed) {
  if (!titleElement) return;
  
  let rotationAngle = 0;

  if (titleElement.id !== 'title') {
    const animate = () => {
      rotationAngle = (rotationAngle + rotationSpeed) % 360;
      
      titleElement.style.background = `linear-gradient(${rotationAngle}deg, ${colorA}, ${colorB})`;
      titleElement.style.backgroundClip = 'text';
      titleElement.style.webkitBackgroundClip = 'text';
      titleElement.style.webkitTextFillColor = 'transparent';
      
      requestAnimationFrame(animate);
    }
    
    animate();
  } else {
    const handleMouseMove = (e) => {
      const rect = titleElement.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
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