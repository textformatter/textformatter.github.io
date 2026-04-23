// ============================================================================
// TEXTFORMATTER · header.js
// Dynamically injects the site header with responsive navigation
// ============================================================================

(function() {
  'use strict';

  // Create header HTML structure
  const headerHTML = `
    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <a href="#home" class="header-logo">
          <div class="logo-mark">T×F</div>
          <span>TextFormatter</span>
        </a>
        
        <nav class="header-nav" aria-label="Main navigation">
          <a href="#home" class="nav-link">Home</a>
          <a href="#formatter" class="nav-link">Formatter</a>
          <a href="#features" class="nav-link">Features</a>
          <a href="#how-it-works" class="nav-link">How It Works</a>
          <a href="#use-cases" class="nav-link">Use Cases</a>
          <a href="#faq" class="nav-link">FAQ</a>
          <a href="#tips" class="nav-link">Tips</a>
          <a href="#formatter" class="nav-cta">Start Free</a>
        </nav>
        
        <button class="hamburger" aria-label="Menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div class="mobile-menu" aria-hidden="true">
        <a href="#home" class="mobile-link">Home</a>
        <a href="#formatter" class="mobile-link">Formatter</a>
        <a href="#features" class="mobile-link">Features</a>
        <a href="#how-it-works" class="mobile-link">How It Works</a>
        <a href="#use-cases" class="mobile-link">Use Cases</a>
        <a href="#faq" class="mobile-link">FAQ</a>
        <a href="#tips" class="mobile-link">Tips</a>
        <a href="#formatter" class="mobile-link" style="background: var(--ink); color: var(--ivory); margin-top: 8px; text-align: center;">Start Formatting →</a>
      </div>
    </header>
  `;

  // Find the header root element and inject HTML
  const headerRoot = document.getElementById('header-root');
  if (headerRoot) {
    headerRoot.innerHTML = headerHTML;
  } else {
    console.warn('header-root element not found');
  }

  // Mobile menu functionality (after DOM is updated)
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = hamburger.getAttribute('aria-expanded') === 'true' ? false : true;
        hamburger.setAttribute('aria-expanded', expanded);
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        mobileMenu.setAttribute('aria-hidden', !expanded);
        
        // Prevent body scroll when menu is open
        if (expanded) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
      
      // Close mobile menu when clicking on a link
      const mobileLinks = document.querySelectorAll('.mobile-link');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // Sticky header shadow on scroll
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  }

  // Active link highlighting based on scroll position
  function initActiveLinkHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const allLinks = [...navLinks, ...mobileLinks];
    
    if (sections.length === 0 || allLinks.length === 0) return;
    
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPosition = window.scrollY + 120; // Offset for header
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          current = section.getAttribute('id');
        }
      });
      
      allLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // Close mobile menu on window resize (if screen becomes desktop)
  function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 960) {
          const hamburger = document.querySelector('.hamburger');
          const mobileMenu = document.querySelector('.mobile-menu');
          if (hamburger && mobileMenu) {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        }
      }, 250);
    });
  }

  // Add active link styles to CSS
  function injectActiveLinkStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .nav-link.active,
      .mobile-link.active {
        background: var(--ivory-2);
        color: var(--ink);
        font-weight: 600;
      }
      .nav-link.active {
        border-radius: 50px;
      }
      .mobile-link.active {
        background: var(--ivory-2);
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize everything after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMobileMenu();
      initHeaderScroll();
      initActiveLinkHighlight();
      handleResize();
      injectActiveLinkStyles();
    });
  } else {
    initMobileMenu();
    initHeaderScroll();
    initActiveLinkHighlight();
    handleResize();
    injectActiveLinkStyles();
  }
})();
