var navToggle = document.getElementById('navToggle');
var navMenu = document.getElementById('navMenu');
var navLinks = document.querySelectorAll('.nav-link');
var navbar = document.getElementById('navbar');
if (navToggle) {
    navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
        navToggle.setAttribute('aria-expanded', "".concat(!expanded));
        navMenu.classList.toggle('active');
        var hamburgers = navToggle.querySelectorAll('.hamburger');
        hamburgers.forEach(function (l, index) {
            var line = l;
            if (navMenu.classList.contains('active')) {
                if (index === 0)
                    line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1)
                    line.style.opacity = '0';
                if (index === 2)
                    line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            }
            else {
                line.style.transform = 'none';
                line.style.opacity = '1';
            }
        });
    });
}
// Close mobile menu on link click and reset hamburger
navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.querySelectorAll('.hamburger').forEach(function (line) {
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        }
    });
});
// Smooth scroll and active nav link highlighting for about pag
var updateActiveNav = function () {
    var sections = document.querySelectorAll('section');
    var scrollPos = window.scrollY + 120;
    var currentSectionId = '';
    sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });
    navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === "#".concat(currentSectionId)) {
            link.classList.add('active');
        }
    });
};
function updateNavbarBackground() {
    navbar.style.background = 'var(--white)';
    navbar.style.color = 'var(--black)';
    navbar.style.backdropFilter = 'none';
}
document.addEventListener('DOMContentLoaded', function () {
    updateActiveNav();
    updateNavbarBackground();
    rotateGradient(document.getElementById('title'), 'var(--gold-light)', '#e77f3f', 1.5);
    // Scroll events
    window.addEventListener('scroll', function () {
        updateActiveNav();
        updateNavbarBackground();
    });
});
// Smooth scroll on nav link clicks for about page sections
navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                var offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                target.focus({ preventScroll: true });
            }
        }
    });
});
function rotateGradient(titleElement, colorA, colorB, rotationSpeed) {
    if (!titleElement)
        return;
    var rotationAngle = 0;
    if (titleElement.id !== 'title') {
        var animate_1 = function () {
            rotationAngle = (rotationAngle + rotationSpeed) % 360;
            titleElement.style.background = "linear-gradient(".concat(rotationAngle, "deg, ").concat(colorA, ", ").concat(colorB, ")");
            titleElement.style.backgroundClip = 'text';
            titleElement.style.webkitBackgroundClip = 'text'; // Deprecated -> o backgroundClip "deve" dar certo, mas eu dúvido um pouco.
            titleElement.style.webkitTextFillColor = 'transparent';
            requestAnimationFrame(animate_1);
        };
        animate_1();
    }
    else {
        var handleMouseMove = function (e) {
            var rect = titleElement.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            var deltaX = e.clientX - centerX;
            var deltaY = e.clientY - centerY;
            var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            if (angle < 0) {
                angle += 360;
            }
            titleElement.style.background = "linear-gradient(".concat(angle, "deg, ").concat(colorA, ", ").concat(colorB, ")");
            titleElement.style.backgroundClip = 'text';
            titleElement.style.webkitBackgroundClip = 'text';
            titleElement.style.webkitTextFillColor = 'transparent';
        };
        document.addEventListener('mousemove', handleMouseMove);
    }
}
