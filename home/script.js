const URL = "https://kaefhycyvuwoozlwakfo.supabase.co";
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZWZoeWN5dnV3b296bHdha2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTc3NTAsImV4cCI6MjA3NjYzMzc1MH0.H5wpYD7UgU82Rxbzwo4ljxaGxwmkOxHekBlHe7SMUBY'
window.supabase = window.supabase.createClient(URL, KEY);

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const resultsContainer = document.getElementById('resultsContainer');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    const urlparams = new URLSearchParams(window.location.search);
    const searchParam = urlparams.get('search');

    if (searchParam && searchInput) {
        searchInput.value = searchParam;    
        const searchEvent = new Event('submit', { bubbles: true });
        searchForm.dispatchEvent(searchEvent);
    }

    let artifactsData = [];

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
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

    async function loadArtifacts() {
        try {
            const { data, error } = await window.supabase
                .from('artifacts')
                .select('*');

            if (error) throw error;
            
            artifactsData = data;
            console.log('Loaded artifacts:', artifactsData.length);
        } catch (error) {
            console.error('Error loading artifacts:', error);
            alert('Erro ao carregar artefatos: ' + error.message);
        }
    }

    function searchArtifacts(query) {
        if (!query.trim()) return [];

        let results = [];
        const querySlices = query.split(", ");
        
        querySlices.forEach(querySlice => {
            if (querySlice.includes('&')) {
                results.push(...handleAndSearch(querySlice));
            } else {  
                results.push(...handleOrSearch(querySlice));
            }
        });
        
        return clean(results);
    }

    function handleAndSearch(querySlice) {
        const andTerms = querySlice.split('&').map(term => term.trim());
        
        return artifactsData.filter(artifact => {
            return andTerms.every(term => matchesSearchTerm(artifact, term));
        });
    }

    function handleOrSearch(querySlice) {
        return artifactsData.filter(artifact => 
            matchesSearchTerm(artifact, querySlice)
        );
    }

    function matchesSearchTerm(artifact, term) {
        const searchTerm = term.toLowerCase().trim();
        const tagonly = searchTerm.startsWith('#');
        const aliasonly = searchTerm.startsWith('@');
        const materialonly = searchTerm.startsWith('!');
        const siteonly = searchTerm.startsWith('$');
        const cleanSearchTerm = searchTerm.replace(/^[@#!$]/, '');

        if (tagonly) {
            return artifact.tags?.some(tag => 
                tag.toLowerCase().includes(cleanSearchTerm)
            );
        }

        if (aliasonly) {
            return artifact.alias?.some(alias => 
                alias.toLowerCase().includes(cleanSearchTerm)
            );
        }

        if (materialonly) {
            return artifact.material?.toLowerCase().includes(cleanSearchTerm);
        }

        if (siteonly) {
            return artifact.site?.toLowerCase().includes(cleanSearchTerm);
        }

        const checkLoop = asset => {
            return asset.toLowerCase().includes(searchTerm);
        }

        const check = asset => {
            return asset?.toLowerCase().includes(searchTerm);
        }

        return (
            artifact.name?.toLowerCase().includes(searchTerm) ||
            artifact.alias?.some(alias => checkLoop(alias)) ||
            artifact.tags?.some(tag => checkLoop(tag)) ||
            check(artifact.material) ||
            check(artifact.description) ||
            check(artifact.site) ||
            check(artifact.municipality_state) ||
            check(artifact.current_location) ||
            check(artifact.registrar) ||
            check(artifact.registration_number)
        );
    }

    function clean(results) {
        return results.filter((artifact, index, self) => 
            index === self.findIndex(a => a.id === artifact.id)
        );
    }

    function displayResults(results, searchTerm) {
        if (!resultsContainer) {
            console.error('resultsContainer element not found');
            return;
        }
        
        resultsContainer.innerHTML = '';
        currentResults = results;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Nenhum artefato encontrado para "<strong>${searchTerm}</strong>"</p>
                    <p>Tente buscar por outros termos ou tags.</p>
                </div>
            `;
            return;
        }

        results.forEach((artifact) => {
            const card = document.createElement('div');
            card.className = 'artifact-card';
            
            card.innerHTML = `
                <img src="${artifact.img || 'assets/placeholder.jpg'}" alt="${artifact.name}" class="artifact-image-small">
                <div class="artifact-content">
                    <h3>${artifact.name || 'Indefinido'}</h3>
                    ${artifact.registration_number ? `<p class="registration-number"><strong>Registro:</strong> ${artifact.registration_number}</p>` : ''}
                    ${artifact.material ? `<p class="material"><strong>Material:</strong> ${artifact.material}</p>` : ''}
                    ${artifact.description ? `<p class="description">${artifact.description}</p>` : ''}
                    <div class="artifact-tags">
                        ${artifact.alias && artifact.alias.map(alias => `<span class="artifact-tag">${alias}</span>`).join('')}
                        ${artifact.tags && artifact.tags.map(tag => `<span class="artifact-tag">${tag}</span>`).join('')}
                    </div>
                    ${artifact.site ? `<p class="site"><strong>Sítio:</strong> ${artifact.site}</p>` : ''}
                </div>
            `;
            
            card.addEventListener('click', () => {
                viewArtifactDetails(artifact.id, searchTerm);
            });
            
            resultsContainer.appendChild(card);
        });
    }

    function viewArtifactDetails(artifactId, searchTerm) {
        if (!artifactId) {
            alert('Erro: ID do artefato não encontrado');
            return;
        }
        let url = `artifact-details.html?id=${artifactId}`;
        if (searchTerm) {
            url += `&searchterm=${encodeURIComponent(searchTerm)}`;
        }
        window.location.href = url;
    }

    function handleSearch(event) {
        event.preventDefault();
        
        const query = searchInput.value.trim();
        if (!query) {
            alert("Por favor, digite uma busca ou tag.");
            return;
        }

        const results = searchArtifacts(query);
        displayResults(results, query);
        
        if (searchResults) {
            searchResults.style.display = 'block';
            searchResults.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async function initialize() {
        await loadArtifacts();
        
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearch);
        }
        
        const titleElement = document.getElementById('title');
        const subtitleElement = document.getElementById('subtitle');
        const btnSubmitElement = document.getElementById('btnSubmit');
        
        if (titleElement) rotateGradient(titleElement, 'var(--gold-light)', '#ba6028ff', 1.5);
        if (subtitleElement) rotateGradient(subtitleElement, '#ffffff', '#feb47b', 0.8);
        if (btnSubmitElement) rotateGradient(btnSubmitElement, 'var(--gold-dark)', '#ffe749ff', 2);
        
        updateNavbarBackground();
    }

    initialize();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});