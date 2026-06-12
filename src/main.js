import './style.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import emailjs from '@emailjs/browser';

// EmailJS Credentials
// Register at https://www.emailjs.com to get these keys.
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize all modules when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS with Public Key
  if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });
  }

  // Pre-split the character reveal line in the hero title
  setupTextSplits();

  // Initialize Canvas Particles
  initParticles();
  initFooterParticles();

  // Initialize Smooth Scrolling (Lenis)
  initSmoothScroll();


  // Initialize Hero Parallax
  initHeroParallax();

  // Initialize Navbar Scrolled State & Theme Swapping
  initNavbar();

  // Initialize Magnetic Buttons
  initMagneticButtons();

  // Initialize Horizontal Scroll Gallery
  initHorizontalScroll();

  // Initialize Service Card Spotlight Glow
  initServiceGlow();

  // Initialize Contact Form Submission Handler
  initContactForm();

  // Initialize General Scroll Reveals
  initScrollReveals();

  // Start Preloader Animation Sequence
  runPreloader();
});

// 1. Text Splitting for Character Reveal
function setupTextSplits() {
  const charLine = document.getElementById('char-reveal-line');
  if (charLine) {
    const text = charLine.textContent.trim();
    charLine.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Keep space
      span.style.display = 'inline-block';
      charLine.appendChild(span);
    });
  }
}

// 2. Preloader Animation
function runPreloader() {
  const tl = gsap.timeline();

  // Reveal logo letters in stagger
  tl.to('.preloader-logo .letter', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out'
  });

  // Smoothly fill progress bar
  let progressObj = { value: 0 };
  tl.to(progressObj, {
    value: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      const progressBar = document.getElementById('preloader-progress');
      if (progressBar) {
        progressBar.style.width = `${progressObj.value}%`;
      }
    },
    onComplete: () => {
      // Slide preloader up and out
      gsap.to('#preloader', {
        y: '-100%',
        duration: 0.9,
        ease: 'power4.inOut',
        onComplete: () => {
          const preloader = document.getElementById('preloader');
          if (preloader) preloader.style.display = 'none';
          // Trigger Hero Entrance Animation
          playHeroEntrance();
        }
      });
    }
  }, '-=0.2');
}

// 3. Hero Entrance Animation
function playHeroEntrance() {
  const tl = gsap.timeline();

  // Fade tag line up
  tl.to('.hero-tagline-container', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out'
  });

  // Line 1: slides in from left
  tl.to('.hero-line.line-1', {
    opacity: 1,
    x: 0,
    duration: 0.9,
    ease: 'power3.out'
  }, '-=0.5');

  // Line 2: character reveal
  const charSpans = document.querySelectorAll('#char-reveal-line span');
  if (charSpans.length > 0) {
    tl.to('#char-reveal-line', { opacity: 1, duration: 0.1 }, '-=0.5');
    tl.fromTo(charSpans,
      { opacity: 0, scale: 0.6, y: 15 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.035, duration: 0.5, ease: 'power3.out' },
      '-=0.45'
    );
  }

  // Line 3: scales into view
  tl.to('.hero-line.line-3', {
    opacity: 1,
    scale: 1,
    duration: 1.0,
    ease: 'back.out(1.1)'
  }, '-=0.4');

  // Description & action buttons reveal
  tl.to('.hero-description', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.7');

  tl.to('.hero-actions', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.7');
}

// 4. Smooth Scrolling (Lenis)
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Smooth scroll to anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        lenis.scrollTo(target, { offset: -50 });
      }
    });
  });
}

// 5. Canvas Particles (Drifting Dust)
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.5;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = -(Math.random() * 0.35 + 0.1);
      this.opacity = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX = -this.speedX;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(109, 40, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(50, Math.floor(window.innerWidth / 25));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// 6. Footer Particles
function initFooterParticles() {
  const canvas = document.getElementById('footer-particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedY = -(Math.random() * 0.2 + 0.05);
      this.opacity = Math.random() * 0.25 + 0.1;
    }

    update() {
      this.y += this.speedY;
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = 25;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}


// 8. Hero Parallax Elements
function initHeroParallax() {
  const hero = document.getElementById('hero-section');
  const circle1 = document.querySelector('.circle-1');
  const circle2 = document.querySelector('.circle-2');

  if (!hero || !circle1 || !circle2) return;

  hero.addEventListener('mousemove', (e) => {
    const { width, height } = hero.getBoundingClientRect();
    const moveX = (e.clientX - width / 2) / (width / 2);
    const moveY = (e.clientY - height / 2) / (height / 2);

    gsap.to(circle1, {
      x: moveX * 15,
      y: moveY * 15,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(circle2, {
      x: -moveX * 25,
      y: -moveY * 25,
      duration: 0.6,
      ease: 'power2.out'
    });
  });
}

// 9. Navbar Scrolled State & Theme Swapping
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  // Add scroll handler for glassmorphic navbar shrink
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Auto-theme swap for dark background sections
  const darkSections = document.querySelectorAll('#cta, .footer');
  darkSections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60px',
      end: 'bottom 60px',
      onEnter: () => navbar.classList.add('dark-nav-theme'),
      onLeave: () => navbar.classList.remove('dark-nav-theme'),
      onEnterBack: () => navbar.classList.add('dark-nav-theme'),
      onLeaveBack: () => navbar.classList.remove('dark-nav-theme')
    });
  });

  // Mobile menu interaction
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-nav-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }
}

// 10. Magnetic Buttons
function initMagneticButtons() {
  const wraps = document.querySelectorAll('.magnetic-wrap');
  wraps.forEach(wrap => {
    const btn = wrap.querySelector('.magnetic-btn');
    if (!btn) return;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Soft magnetic force pull
      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    wrap.addEventListener('mouseleave', () => {
      // Smooth reset snap
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
}

// 11. Horizontal Scroll Gallery
function initHorizontalScroll() {
  const track = document.getElementById('projects-track');
  const section = document.getElementById('projects');

  if (!track || !section) return;

  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth + 80),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1.1,
      start: 'top top',
      end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
      invalidateOnRefresh: true
    }
  });
}


// 13. Service Spotlight Glow Effect
function initServiceGlow() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}


// 15. AJAX Form Submission via EmailJS
function initContactForm() {
  const form = document.querySelector('.inquiry-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = submitBtn.querySelector('span');
  const card = document.querySelector('.glass-form-card');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Disable button and update text to show loading state
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending...';

    // Verify configurations are set
    if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" || EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" || EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID") {
      alert("EmailJS is not configured. Please edit the credentials in your .env file or at the top of src/main.js.");
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Send Inquiry';
      return;
    }

    // Build template params matching template variables
    const formData = new FormData(form);
    const templateParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      phone: formData.get('phone'),
      project_type: formData.get('project_type'),
      message: formData.get('message'),
      to_email: 'progenisolutions@gmail.com' // Explicit fallback in case Template 'To Email' setting expects a parameter
    };

    // Send email using EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then((response) => {
      // Smoothly fade out the form elements
      gsap.to(form, {
        opacity: 0,
        y: -15,
        duration: 0.4,
        onComplete: () => {
          form.style.display = 'none';

          // Create success container dynamically
          const successDiv = document.createElement('div');
          successDiv.className = 'form-success-message';
          successDiv.style.opacity = 0;
          successDiv.style.transform = 'translateY(15px)';
          successDiv.innerHTML = `
            <div class="success-icon-container">
              <svg class="check-icon" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 class="success-title">Email Sent Successfully</h3>
            <p class="success-text">
              We will reach out to you soon!
            </p>
            <button type="button" class="btn btn-secondary btn-nav" id="success-reset-btn" style="margin-top: 1rem; gap: 0.5rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="reset-icon">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              <span>Send Another Request</span>
            </button>
          `;

          card.appendChild(successDiv);
          gsap.to(successDiv, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          });

          // Reset button event listener to send another request
          const resetBtn = successDiv.querySelector('#success-reset-btn');
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              gsap.to(successDiv, {
                opacity: 0,
                y: 15,
                duration: 0.4,
                onComplete: () => {
                  successDiv.remove();
                  form.reset();
                  form.style.display = 'flex';
                  gsap.fromTo(form, {
                    opacity: 0,
                    y: -15
                  }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    onComplete: () => {
                      submitBtn.disabled = false;
                      submitBtnText.textContent = 'Send Inquiry';
                    }
                  });
                }
              });
            });
          }
        }
      });
    }, (error) => {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Send Inquiry';
      alert('Oops! EmailJS failed to send message: ' + (error.text || error.message || 'Please check your configurations.'));
    });
  });
}

// 16. General Reveal Transitions
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-fade');
  elements.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('revealed'),
      once: true
    });
  });
}
