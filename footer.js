// Footer Component
function renderFooter() {
  const footer = document.createElement('footer');
  footer.id = 'site-footer';
  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-container">
        <div class="footer-brand">
          <a href="https://textformatter.github.io" class="footer-logo" aria-label="TextFormatter">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563EB"/>
              <rect x="7" y="8" width="18" height="2.5" rx="1.25" fill="white"/>
              <rect x="7" y="13" width="13" height="2.5" rx="1.25" fill="white" opacity="0.8"/>
              <rect x="7" y="18" width="16" height="2.5" rx="1.25" fill="white"/>
              <rect x="7" y="23" width="10" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
            </svg>
            <span>Text<strong>Formatter</strong></span>
          </a>
          <p class="footer-tagline">The smartest free online text formatter. Clean, format, and restructure any text in seconds.</p>
          <div class="footer-badges">
            <span class="badge">✓ 100% Free</span>
            <span class="badge">✓ No Login</span>
            <span class="badge">✓ Instant</span>
          </div>
        </div>
        <div class="footer-links-grid">
          <div class="footer-col">
            <h3>Text Tools</h3>
            <ul>
              <li><a href="#formatter">Article Formatter</a></li>
              <li><a href="#formatter">Online Text Formatter</a></li>
              <li><a href="#formatter">Text Cleaner</a></li>
              <li><a href="#formatter">Case Converter</a></li>
              <li><a href="#formatter">Whitespace Remover</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Formatting</h3>
            <ul>
              <li><a href="#formatter">HTML Formatter</a></li>
              <li><a href="#formatter">Paragraph Formatter</a></li>
              <li><a href="#formatter">List Formatter</a></li>
              <li><a href="#formatter">Code Formatter</a></li>
              <li><a href="#formatter">JSON Formatter</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Learn</h3>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#use-cases">Use Cases</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-container footer-bottom-inner">
        <p>&copy; ${new Date().getFullYear()} TextFormatter.github.io &mdash; Free Online Text Format Tool</p>
        <p class="footer-seo-text">textformatter.github.io | text formatter | article formatter | online text formatter | text format</p>
      </div>
    </div>
  `;
  return footer;
}

document.addEventListener('DOMContentLoaded', () => {
  const footerMount = document.getElementById('footer-mount');
  if (footerMount) footerMount.replaceWith(renderFooter());
});
