// ============================================================================
// TEXTFORMATTER · footer.js
// Dynamically injects the site footer with copyright and links
// ============================================================================

(function() {
  'use strict';

  const currentYear = new Date().getFullYear();

  // Create footer HTML structure
  const footerHTML = `
    <footer class="site-footer" id="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#home" class="header-logo" style="text-decoration: none;">
              <div class="logo-mark">T×F</div>
              <span>TextFormatter</span>
            </a>
            <p>Instant text formatting & cleanup tool. Transform messy text into perfectly formatted content in seconds.</p>
          </div>
          
          <div class="footer-col">
            <h4>Tool</h4>
            <ul>
              <li><a href="#formatter">Text Formatter</a></li>
              <li><a href="#formatter" data-mode="json">JSON Formatter</a></li>
              <li><a href="#formatter" data-mode="html">HTML Formatter</a></li>
              <li><a href="#formatter" data-mode="markdown">Markdown Formatter</a></li>
              <li><a href="#formatter" data-mode="css">CSS Beautifier</a></li>
              <li><a href="#formatter" data-mode="sql">SQL Formatter</a></li>
              <li><a href="#formatter" data-mode="case">Case Converter</a></li>
              <li><a href="#formatter" data-mode="lines">Line Tools</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#use-cases">Use Cases</a></li>
              <li><a href="#tips">Formatting Tips</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#" id="privacy-link">Privacy Policy</a></li>
              <li><a href="#" id="terms-link">Terms of Use</a></li>
              <li><a href="#" id="cookies-link">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div>© ${currentYear} TextFormatter. All rights reserved.</div>
          <div>Made with <span style="color: var(--amber);">✦</span> for clean text</div>
        </div>
      </div>
    </footer>
  `;

  // Find the footer root element and inject HTML
  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    footerRoot.innerHTML = footerHTML;
  } else {
    console.warn('footer-root element not found');
  }

  // Helper function to switch formatter mode from footer links
  function switchFormatterMode(mode) {
    const modeTab = document.querySelector(`.mode-tab[data-mode="${mode}"]`);
    if (modeTab) {
      modeTab.click();
      // Scroll to formatter section
      const formatterSection = document.getElementById('formatter');
      if (formatterSection) {
        setTimeout(() => {
          formatterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  // Handle footer tool links to switch modes
  function initFooterToolLinks() {
    const toolLinks = document.querySelectorAll('.footer-col a[data-mode]');
    toolLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = link.getAttribute('data-mode');
        if (mode) {
          switchFormatterMode(mode);
        }
      });
    });
  }

  // Handle regular footer navigation links
  function initFooterNavLinks() {
    const navLinks = document.querySelectorAll('.footer-col a:not([data-mode])');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    });
  }

  // Show modal for legal documents (privacy, terms, cookies)
  function showLegalModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.legal-modal');
    if (existingModal) existingModal.remove();

    const modalHTML = `
      <div class="legal-modal" role="dialog" aria-label="${title}">
        <div class="legal-modal-content">
          <div class="legal-modal-header">
            <h3>${title}</h3>
            <button class="legal-modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="legal-modal-body">
            ${content}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';

    const modal = document.querySelector('.legal-modal');
    const closeBtn = modal.querySelector('.legal-modal-close');

    function closeModal() {
      modal.classList.add('fade-out');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 200);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Add animation
    setTimeout(() => {
      modal.classList.add('visible');
    }, 10);
  }

  // Privacy Policy content
  function getPrivacyContent() {
    return `
      <h4>Privacy Policy</h4>
      <p>Last updated: ${new Date().toLocaleDateString()}</p>
      
      <h5>1. No Data Collection</h5>
      <p>TextFormatter is a completely client-side tool. All text formatting happens directly in your browser. We do not collect, store, or transmit any text you paste or format on this website.</p>
      
      <h5>2. No Cookies</h5>
      <p>TextFormatter does not use cookies for tracking or personalization. Any local storage used is solely for preserving your preferences (like theme or recent mode selection).</p>
      
      <h5>3. Analytics</h5>
      <p>We may use anonymous, aggregated analytics to understand how many people use the tool. No personal information or formatted text is ever collected.</p>
      
      <h5>4. Your Data Stays Yours</h5>
      <p>Because all processing happens locally, your text never leaves your device. You can use TextFormatter with complete confidence for sensitive data, source code, or confidential documents.</p>
      
      <h5>5. Contact</h5>
      <p>If you have questions about this privacy policy, please contact us via GitHub issues on our repository.</p>
    `;
  }

  // Terms of Use content
  function getTermsContent() {
    return `
      <h4>Terms of Use</h4>
      <p>Last updated: ${new Date().toLocaleDateString()}</p>
      
      <h5>1. Free Service</h5>
      <p>TextFormatter is provided completely free of charge. There are no paid tiers, subscriptions, or hidden fees.</p>
      
      <h5>2. No Warranty</h5>
      <p>This tool is provided "as is" without any warranties. While we strive for accuracy, we cannot guarantee that formatting results will always be perfect for every edge case.</p>
      
      <h5>3. Acceptable Use</h5>
      <p>You agree to use TextFormatter for lawful purposes only. Do not use this tool to process or generate illegal content.</p>
      
      <h5>4. Intellectual Property</h5>
      <p>TextFormatter and its source code are open source. However, you may not copy the website design or branding for commercial purposes without permission.</p>
      
      <h5>5. Changes to Terms</h5>
      <p>We may update these terms from time to time. Continued use of the tool constitutes acceptance of any changes.</p>
    `;
  }

  // Cookie Policy content
  function getCookiesContent() {
    return `
      <h4>Cookie Policy</h4>
      <p>Last updated: ${new Date().toLocaleDateString()}</p>
      
      <h5>1. Do We Use Cookies?</h5>
      <p>TextFormatter does not use tracking cookies. We do not serve ads or build user profiles.</p>
      
      <h5>2. Local Storage</h5>
      <p>We may use your browser's local storage to remember:</p>
      <ul>
        <li>Your recently used formatter mode</li>
        <li>Your preferred indentation settings</li>
      </ul>
      <p>This data never leaves your browser and is used only for convenience.</p>
      
      <h5>3. Third-Party Cookies</h5>
      <p>TextFormatter does not integrate any third-party services that set cookies (no Google Analytics, no Facebook pixel, no ad networks).</p>
      
      <h5>4. Managing Local Storage</h5>
      <p>You can clear local storage at any time through your browser's developer tools without affecting the tool's functionality.</p>
    `;
  }

  // Initialize legal modals
  function initLegalModals() {
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');
    const cookiesLink = document.getElementById('cookies-link');

    if (privacyLink) {
      privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLegalModal('Privacy Policy', getPrivacyContent());
      });
    }

    if (termsLink) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLegalModal('Terms of Use', getTermsContent());
      });
    }

    if (cookiesLink) {
      cookiesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLegalModal('Cookie Policy', getCookiesContent());
      });
    }
  }

  // Add modal styles
  function injectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .legal-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 22, 18, 0.8);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }
      
      .legal-modal.visible {
        opacity: 1;
        visibility: visible;
      }
      
      .legal-modal.fade-out {
        opacity: 0;
        visibility: hidden;
      }
      
      .legal-modal-content {
        background: var(--white);
        border-radius: var(--radius-lg);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-lg);
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .legal-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid var(--ivory-3);
        background: var(--ivory);
      }
      
      .legal-modal-header h3 {
        font-family: var(--font-display);
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--ink);
        margin: 0;
      }
      
      .legal-modal-close {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--ivory-2);
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        color: var(--ink-3);
        transition: all var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .legal-modal-close:hover {
        background: var(--ivory-3);
        color: var(--ink);
      }
      
      .legal-modal-body {
        padding: 24px;
        overflow-y: auto;
        font-size: 0.9rem;
        line-height: 1.7;
        color: var(--ink-2);
      }
      
      .legal-modal-body h4 {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: var(--ink);
      }
      
      .legal-modal-body h5 {
        font-weight: 600;
        margin: 16px 0 8px 0;
        color: var(--ink);
      }
      
      .legal-modal-body p {
        margin-bottom: 12px;
      }
      
      .legal-modal-body ul {
        margin: 8px 0 12px 20px;
        list-style: disc;
      }
      
      .legal-modal-body li {
        margin-bottom: 4px;
      }
    `;
    document.head.appendChild(style);
  }

  // Update copyright year dynamically
  function updateCopyrightYear() {
    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
      const yearSpan = footerBottom.querySelector('.copyright-year');
      if (yearSpan) {
        yearSpan.textContent = currentYear;
      }
    }
  }

  // Initialize everything after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFooterToolLinks();
      initFooterNavLinks();
      initLegalModals();
      injectModalStyles();
      updateCopyrightYear();
    });
  } else {
    initFooterToolLinks();
    initFooterNavLinks();
    initLegalModals();
    injectModalStyles();
    updateCopyrightYear();
  }
})();
