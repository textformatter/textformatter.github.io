// Header Component
function renderHeader() {
  const header = document.createElement('header');
  header.id = 'site-header';
  header.innerHTML = `
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <a href="https://textformatter.github.io" class="nav-logo" aria-label="TextFormatter Home">
          <span class="logo-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563EB"/>
              <rect x="7" y="8" width="18" height="2.5" rx="1.25" fill="white"/>
              <rect x="7" y="13" width="13" height="2.5" rx="1.25" fill="white" opacity="0.8"/>
              <rect x="7" y="18" width="16" height="2.5" rx="1.25" fill="white"/>
              <rect x="7" y="23" width="10" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
            </svg>
          </span>
          <span class="logo-text">Text<strong>Formatter</strong></span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navMenu">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-menu" id="navMenu" role="menubar">
          <li role="none"><a href="#formatter" class="nav-link" role="menuitem">Formatter</a></li>
          <li role="none"><a href="#features" class="nav-link" role="menuitem">Features</a></li>
          <li role="none"><a href="#how-it-works" class="nav-link" role="menuitem">How It Works</a></li>
          <li role="none"><a href="#tools" class="nav-link" role="menuitem">Tools</a></li>
          <li role="none"><a href="#faq" class="nav-link" role="menuitem">FAQ</a></li>
          <li role="none"><a href="#formatter" class="nav-cta" role="menuitem">Try Free</a></li>
        </ul>
      </div>
    </nav>
  `;

  // Mobile toggle logic
  const toggle = header.querySelector('#navToggle');
  const menu = header.querySelector('#navMenu');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Sticky scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Close menu on nav link click
  header.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
    });
  });

  return header;
}

document.addEventListener('DOMContentLoaded', () => {
  const headerMount = document.getElementById('header-mount');
  if (headerMount) headerMount.replaceWith(renderHeader());
});
