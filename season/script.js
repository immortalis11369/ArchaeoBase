const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

function initNavigation() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('active');
            updateHamburgerAnimation();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', false);
                }
                resetHamburgerAnimation();
            }
        });
    });
}

function updateHamburgerAnimation() {
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
}

function resetHamburgerAnimation() {
    const hamburgers = navToggle.querySelectorAll('.hamburger');
    hamburgers.forEach(line => {
        line.style.transform = 'none';
        line.style.opacity = '1';
    });
}

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
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.substring(1) === currentSectionId) {
            link.classList.add('active');
        }
    });
}

function updateNavbarBackground() {
    if (navbar) {
        navbar.style.background = 'var(--white)';
        navbar.style.color = 'var(--black)';
        navbar.style.backdropFilter = 'none';
    }
}

function initSmoothScroll() {
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
}

function adjustTimelineContentSizes() {
    const timelineContents = document.querySelectorAll('.timeline-content');
    
    timelineContents.forEach(content => {
        content.classList.remove('short', 'medium', 'long', 'extra-long');
        
        const textContent = content.textContent || content.innerText;
        const charCount = textContent.length;
        
        let sizeClass = 'medium';
        let emoji = '📄';
        
        if (charCount < 200) {
            sizeClass = 'short';
            emoji = '📝';
        } else if (charCount < 400) {
            sizeClass = 'medium';
            emoji = '📄';
        } else if (charCount < 600) {
            sizeClass = 'long';
            emoji = '🔎';
        } else {
            sizeClass = 'extra-long';
            emoji = '📚';
        }
        
        content.classList.add(sizeClass);
        
        let header = content.querySelector('.timeline-header');
        let title = content.querySelector('h3');
        
        if (!header) {
            header = document.createElement('div');
            header.className = 'timeline-header';
            content.insertBefore(header, content.firstChild);
            
            if (title) {
                header.appendChild(title);
            }
        }
        
        let emojiIndicator = header.querySelector('.content-length-indicator');
        if (!emojiIndicator) {
            emojiIndicator = document.createElement('div');
            emojiIndicator.className = 'content-length-indicator';
            header.appendChild(emojiIndicator);
        }
        
        emojiIndicator.textContent = emoji;
        emojiIndicator.className = `content-length-indicator ${sizeClass}`;
        emojiIndicator.title = `${sizeClass.replace('-', ' ')} content`;
    });
}

function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

function initMilestoneAnimation() {
    const milestoneCards = document.querySelectorAll('.milestone-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });

    milestoneCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateActiveNav();
    updateNavbarBackground();
    initSmoothScroll();
    
    if (document.querySelector('.timeline')) {
        adjustTimelineContentSizes();
        initTimelineAnimation();
        initMilestoneAnimation();
    }

    window.addEventListener('scroll', () => {
        updateActiveNav();
        updateNavbarBackground();
    });

    window.addEventListener('resize', () => {
        if (document.querySelector('.timeline')) {
            adjustTimelineContentSizes();
        }
        
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', false);
            }
            resetHamburgerAnimation();
        }
    });
});

window.addEventListener('error', (e) => {
    console.log('Script loaded with minor issues:', e.message);
});