const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const resultsContainer = document.getElementById('resultsContainer');

let artifactsData = [];
let currentResults = [];

async function loadArtifacts() {
    try {
        const response = await fetch('../ArchaeoBase/data/artifacts.json');
        const data = await response.json();
        artifactsData = data.artifacts;
    } catch (error) {
        console.error('Error loading artifacts:', error);
    }
}

function searchArtifacts(query) {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    
    return artifactsData.filter(artifact => {
        if (artifact.name.toLowerCase().includes(searchTerm)) return true;
        if (artifact.alias.some(alias => alias.toLowerCase().includes(searchTerm))) return true;
        if (artifact.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
        if (artifact.description.toLowerCase().includes(searchTerm)) return true;
        return false;
    });
}

function displayResults(results) {
    resultsContainer.innerHTML = '';
    currentResults = results;

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>Nenhum artefato encontrado para sua busca.</p>
                <p>Tente usar termos como: "lego", "L", "preto", etc.</p>
            </div>
        `;
        return;
    }

    results.forEach((artifact, index) => {
        const card = document.createElement('div');
        card.className = 'artifact-card';
        card.dataset.artifactIndex = index;
        
        card.innerHTML = `
            <img src="${artifact.img}" alt="${artifact.name}" class="artifact-image-small">
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

function viewArtifactDetails(artifactId) {
    if (!artifactId) {
        alert('Erro: ID do artefato não encontrado');
        return;
    }
    window.location.href = `artifact-details.html?id=${artifactId}`;
}

function handleSearch(event) {
    event.preventDefault();
    
    const query = searchInput.value.trim();
    if (!query) {
        alert("Por favor, digite uma busca ou tag.");
        return;
    }

    const results = searchArtifacts(query);
    displayResults(results);
    searchResults.style.display = 'block';
    searchResults.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadArtifacts();
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    rotateGradient(document.getElementById('title'), 'var(--gold-light)', '#ba6028ff', 1.5);
    rotateGradient(document.getElementById('subtitle'), '#ffffff', '#feb47b', 0.8);
    rotateGradient(document.getElementById('btnSubmit'), 'var(--gold-dark)', '#ffe749ff', 2);
    updateNavbarBackground();
});

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