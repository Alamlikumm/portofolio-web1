// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when link is clicked
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Active Nav Link on Scroll
const sections = document.querySelectorAll('section');
const navLinksList = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // Offset slightly for the fixed navbar
    if (window.scrollY >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navLinksList.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Interactive Project Card Mouse Tracker (Glow Effect)
const cards = document.querySelectorAll('.project-card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});



// Scroll-triggered Theme Shift (Gallery Section)
const gallerySection = document.getElementById('gallery');
if (gallerySection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    });
  }, {
    // Threshold set to trigger when at least 25% of the section is visible
    threshold: 0.25
  });
  observer.observe(gallerySection);
}

// Kinetic Text Word Splitting for Manifesto Paragraphs
const manifestoTexts = document.querySelectorAll('.manifesto-text');
manifestoTexts.forEach(p => {
  const words = p.textContent.trim().split(/\s+/);
  p.innerHTML = words.map((word, idx) => `<span class="word" style="--word-index: ${idx}">${word}</span>`).join(' ');
});

// Scroll-triggered Active State for Manifesto kinetic text
const manifestoSection = document.getElementById('manifesto');
if (manifestoSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        manifestoSection.classList.add('active');
        observer.unobserve(manifestoSection); // Only animate once for premium feel
      }
    });
  }, {
    threshold: 0.2
  });
  observer.observe(manifestoSection);
}

// ----------------------------------------------------
// FINAL ENHANCEMENTS
// ----------------------------------------------------

// 1. Scroll Progress Bar
window.addEventListener('scroll', () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollHeight) * 100;
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
});

// 2. Scroll Reveal Animations (Intersection Observer)
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});
reveals.forEach(r => revealObserver.observe(r));

// 3. Smooth Scroll for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 4. Mobile Haptics (Vibration API)
const hapticElements = document.querySelectorAll('button, .btn, .btn-pill, .btn-secondary, .project-card, .link-card, .nav-link, .hamburger');
hapticElements.forEach(el => {
  el.addEventListener('click', () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Subtle 10ms tap vibration
    }
  });
});

// 5. Easter Egg: Canvas Confetti & Toast
function triggerConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // Respect preferences
  
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const colors = ['#ff4d8a', '#ff8158', '#ffd166', '#39e58c', '#00b4d8'];
  const particles = [];
  
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      r: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: Math.random() * Math.PI
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.tiltAngle) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      
      const xTilt = p.x + Math.sin(p.tiltAngle) * 10;
      
      if (p.y <= canvas.height) {
        active = true;
      }
      
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(xTilt + p.r / 2, p.y);
      ctx.lineTo(xTilt, p.y + p.r / 2);
      ctx.stroke();
    });
    
    if (active) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }
  
  draw();
}

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Mobile Pull gesture detector
let startY = 0;
let isPulling = false;

window.addEventListener('touchstart', (e) => {
  if (window.scrollY === 0) {
    startY = e.touches[0].pageY;
    isPulling = true;
  }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!isPulling) return;
  const currentY = e.touches[0].pageY;
  const diff = currentY - startY;

  if (diff > 140) {
    isPulling = false; // Trigger once per drag gesture
    triggerConfetti();
    showToast("Thanks for visiting! 🎉");
  }
}, { passive: true });

window.addEventListener('touchend', () => {
  isPulling = false;
});

// ----------------------------------------------------
// EXTRA POLISH
// ----------------------------------------------------

// 6. Hero Typewriter Effect
const typewriterEl = document.querySelector('.typewriter-text');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typewriterEl) {
  if (!reducedMotion) {
    const roles = ['Web Developer', 'Full Stack Developer', 'Tech Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeTick = () => {
      const current = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typewriterEl.textContent = current.slice(0, charIndex);

      let delay = deleting ? 35 : 70;
      if (!deleting && charIndex === current.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }
      setTimeout(typeTick, delay);
    };
    typeTick();
  } else {
    typewriterEl.textContent = 'Web Developer';
  }
}

// 7. 3D Tilt for Hero Flip Card (Desktop Only)
const card3d = document.querySelector('.card-3d');
const isTouchDevice = window.matchMedia('(max-width: 1024px)').matches;

if (card3d && !reducedMotion && !isTouchDevice) {
  card3d.addEventListener('mousemove', (e) => {
    const rect = card3d.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card3d.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -8}deg)`;
  });

  card3d.addEventListener('mouseleave', () => {
    card3d.style.transform = '';
  });
}

// 8. Back to Top Button
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 9. Header Elevation on Scroll
const siteHeader = document.querySelector('.header');
if (siteHeader) {
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// 10. Copy Email to Clipboard
const emailCard = document.querySelector('.link-card-primary');
if (emailCard) {
  emailCard.addEventListener('click', async () => {
    const emailEl = emailCard.querySelector('.link-title');
    if (!emailEl) return;
    try {
      await navigator.clipboard.writeText(emailEl.textContent.trim());
      showToast('Email tersalin!');
    } catch {
      // Clipboard tidak tersedia; mailto tetap berfungsi sebagai fallback
    }
  });
}
