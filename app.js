// ============================================================================
// TEXTFORMATTER · app.js
// Complete interactive functionality – formatter core, UI handlers,
// mode switching, copy/paste, animations, and all formatting logic.
// ============================================================================

(function() {
  'use strict';

  // ---------- DOM Elements ----------
  const inputEl = document.getElementById('input-text');
  const outputEl = document.getElementById('output-text');
  const formatBtn = document.getElementById('format-btn');
  const swapBtn = document.getElementById('swap-btn');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const clearOutputBtn = document.getElementById('clear-output-btn');
  const pasteBtn = document.getElementById('paste-btn');
  const sampleBtn = document.getElementById('sample-btn');
  const notifBar = document.getElementById('notif-bar');
  const inputCountSpan = document.getElementById('input-count');
  const outputCountSpan = document.getElementById('output-count');
  const diffBadge = document.getElementById('diff-badge');
  const subOptionsDiv = document.getElementById('sub-options');

  // Mode tabs
  const modeTabs = document.querySelectorAll('.mode-tab');
  
  // ---------- State ----------
  let currentMode = 'plain';        // plain, json, html, markdown, css, sql, case, lines
  let currentSubOption = null;      // varies by mode: 'pretty'/'minify', indent size, case style, etc.
  let lastInputValue = '';
  let lastOutputValue = '';

  // ---------- Helper: Show Notification ----------
  function showNotification(message, type = 'info') {
    notifBar.textContent = message;
    notifBar.className = `notif-bar ${type}`;
    setTimeout(() => {
      if (notifBar.textContent === message) {
        notifBar.textContent = '';
        notifBar.className = 'notif-bar';
      }
    }, 2800);
  }

  // ---------- Helper: Update Character/Word/Line Counts ----------
  function updateCounts() {
    const inputText = inputEl.value;
    const outputText = outputEl.value;
    
    const inputChars = inputText.length;
    const inputWords = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const inputLines = inputText ? inputText.split(/\r?\n/).length : 0;
    inputCountSpan.textContent = `${inputChars} chars · ${inputWords} words · ${inputLines} lines`;
    
    const outputChars = outputText.length;
    const outputWords = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;
    const outputLines = outputText ? outputText.split(/\r?\n/).length : 0;
    outputCountSpan.textContent = `${outputChars} chars · ${outputWords} words · ${outputLines} lines`;
    
    // Update diff badge
    if (lastInputValue !== inputText) {
      diffBadge.classList.remove('show');
      lastInputValue = inputText;
      lastOutputValue = outputText;
    } else if (outputText !== lastOutputValue) {
      const inputLen = inputText.length;
      const outputLen = outputText.length;
      if (outputLen > inputLen) {
        diffBadge.textContent = `+${outputLen - inputLen} chars`;
        diffBadge.className = 'diff-badge show grow';
      } else if (outputLen < inputLen) {
        diffBadge.textContent = `-${inputLen - outputLen} chars`;
        diffBadge.className = 'diff-badge show shrink';
      } else if (outputLen === inputLen && outputText !== inputText) {
        diffBadge.textContent = `reformatted`;
        diffBadge.className = 'diff-badge show info';
      } else {
        diffBadge.classList.remove('show');
      }
      lastOutputValue = outputText;
    }
  }
  
  // ---------- Core Formatting Functions (by mode) ----------
  
  // Plain Text: whitespace cleanup, trim lines, normalize spaces
  function formatPlain(text, option) {
    if (option === 'trim-lines') {
      return text.split(/\r?\n/).map(line => line.trim()).join('\n');
    } else if (option === 'collapse-spaces') {
      return text.replace(/[ \t]+/g, ' ').replace(/[ \t]+\n/g, '\n');
    } else if (option === 'remove-blanks') {
      return text.split(/\r?\n/).filter(line => line.trim().length > 0).join('\n');
    } else if (option === 'tabs-to-spaces') {
      return text.replace(/\t/g, '  ');
    } else if (option === 'spaces-to-tabs') {
      return text.replace(/^  /gm, '\t');
    }
    // default: basic normalization (trim trailing spaces)
    return text.replace(/[ \t]+$/gm, '');
  }
  
  // JSON Formatter
  function formatJSON(text, option) {
    try {
      const parsed = JSON.parse(text);
      if (option === 'minify') {
        return JSON.stringify(parsed);
      } else {
        const indentSize = option === 'indent-4' ? 4 : 2;
        return JSON.stringify(parsed, null, indentSize);
      }
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  }
  
  // HTML Formatter (basic beautify)
  function formatHTML(text, option) {
    if (option === 'minify') {
      return text.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
    }
    // Pretty print: naive but effective indentation
    let formatted = '';
    let indent = 0;
    const lines = text.replace(/>\s+</g, '><').split(/(<[^>]+>)/g);
    for (let line of lines) {
      if (line.trim() === '') continue;
      if (line.match(/^<\//)) {
        indent = Math.max(0, indent - 1);
      }
      formatted += '  '.repeat(indent) + line + '\n';
      if (line.match(/^<[^\/][^>]*>$/i) && !line.match(/\/>$/)) {
        indent++;
      }
    }
    return formatted;
  }
  
  // Markdown Formatter (normalize headings, lists)
  function formatMarkdown(text, option) {
    const lines = text.split(/\r?\n/);
    const out = [];
    let inList = false;
    for (let line of lines) {
      // heading spacing: ensure space after #
      line = line.replace(/^(#{1,6})([^#\s])/, '$1 $2');
      // list items: normalize indentation
      if (line.match(/^(\s*)[-*+]\s+/)) {
        if (!inList) out.push('');
        inList = true;
        line = line.replace(/^(\s*)[-*+]\s+/, '- ');
      } else {
        inList = false;
      }
      out.push(line);
    }
    let result = out.join('\n');
    if (option === 'fix-blank-lines') {
      result = result.replace(/\n{3,}/g, '\n\n');
    }
    return result;
  }
  
  // CSS Beautifier
  function formatCSS(text, option) {
    if (option === 'minify') {
      return text.replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}').replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').replace(/\s*,\s*/g, ',').trim();
    }
    let out = '';
    let indent = 0;
    const blocks = text.split(/(\{|\})/);
    for (let block of blocks) {
      if (block === '{') {
        out += ' {\n';
        indent++;
      } else if (block === '}') {
        indent = Math.max(0, indent - 1);
        out += '  '.repeat(indent) + '}\n';
      } else {
        const lines = block.split(';');
        for (let line of lines) {
          if (line.trim()) {
            out += '  '.repeat(indent) + line.trim() + ';\n';
          }
        }
      }
    }
    return out;
  }
  
  // SQL Formatter
  function formatSQL(text, option) {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'SET', 'VALUES'];
    let upperSql = text.toUpperCase();
    for (let kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      upperSql = upperSql.replace(regex, `\n${kw}\n`);
    }
    let lines = upperSql.split(/\r?\n/).filter(l => l.trim().length > 0);
    let result = '';
    let indentLevel = 0;
    for (let line of lines) {
      line = line.trim();
      if (line.match(/\)/)) indentLevel = Math.max(0, indentLevel - 1);
      result += '  '.repeat(indentLevel) + line + '\n';
      if (line.match(/\(/)) indentLevel++;
    }
    return result;
  }
  
  // Case Converter
  function convertCase(text, style) {
    if (style === 'lowercase') return text.toLowerCase();
    if (style === 'uppercase') return text.toUpperCase();
    if (style === 'sentence') return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    if (style === 'title') {
      const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
      return text.split(/\s+/).map((word, i) => {
        if (i > 0 && smallWords.includes(word.toLowerCase())) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(' ');
    }
    if (style === 'camel') {
      return text.replace(/[-\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toLowerCase());
    }
    if (style === 'pascal') {
      return text.replace(/[-\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toUpperCase());
    }
    if (style === 'snake') return text.replace(/\s+/g, '_').toLowerCase();
    if (style === 'kebab') return text.replace(/\s+/g, '-').toLowerCase();
    return text;
  }
  
  // Lines Tools
  function processLines(text, action) {
    const lines = text.split(/\r?\n/);
    if (action === 'sort-alpha') lines.sort((a,b) => a.localeCompare(b));
    if (action === 'sort-length') lines.sort((a,b) => a.length - b.length);
    if (action === 'reverse') lines.reverse();
    if (action === 'dedupe') {
      const seen = new Set();
      return lines.filter(l => { if (seen.has(l)) return false; seen.add(l); return true; }).join('\n');
    }
    if (action === 'shuffle') {
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    }
    if (action === 'number') return lines.map((l, i) => `${i+1}. ${l}`).join('\n');
    return lines.join('\n');
  }
  
  // Main dispatcher
  function formatText(text, mode, option) {
    if (!text.trim()) return '';
    try {
      switch(mode) {
        case 'plain':
          return formatPlain(text, option || 'default');
        case 'json':
          return formatJSON(text, option || 'pretty-2');
        case 'html':
          return formatHTML(text, option || 'pretty');
        case 'markdown':
          return formatMarkdown(text, option || 'default');
        case 'css':
          return formatCSS(text, option || 'pretty');
        case 'sql':
          return formatSQL(text, option || 'default');
        case 'case':
          return convertCase(text, option || 'sentence');
        case 'lines':
          return processLines(text, option || 'sort-alpha');
        default:
          return text;
      }
    } catch (err) {
      throw err;
    }
  }
  
  // Format button handler
  function handleFormat() {
    const inputText = inputEl.value;
    if (!inputText.trim()) {
      showNotification('Nothing to format. Please enter some text first.', 'error');
      return;
    }
    try {
      const formatted = formatText(inputText, currentMode, currentSubOption);
      outputEl.value = formatted;
      updateCounts();
      showNotification(`Formatted in ${currentMode} mode.`, 'success');
    } catch (err) {
      showNotification(`Formatting error: ${err.message}`, 'error');
      outputEl.value = `Error: ${err.message}`;
    }
  }
  
  // ---------- Sub-Options UI ----------
  const subOptionConfig = {
    plain: [
      { value: 'default', label: 'Trim trailing spaces' },
      { value: 'trim-lines', label: 'Trim each line' },
      { value: 'collapse-spaces', label: 'Collapse spaces' },
      { value: 'remove-blanks', label: 'Remove blank lines' },
      { value: 'tabs-to-spaces', label: 'Tabs → Spaces' },
      { value: 'spaces-to-tabs', label: 'Spaces → Tabs' }
    ],
    json: [
      { value: 'pretty-2', label: 'Pretty (2 spaces)' },
      { value: 'pretty-4', label: 'Pretty (4 spaces)' },
      { value: 'minify', label: 'Minify / Compact' }
    ],
    html: [
      { value: 'pretty', label: 'Pretty Print' },
      { value: 'minify', label: 'Minify' }
    ],
    markdown: [
      { value: 'default', label: 'Normalize' },
      { value: 'fix-blank-lines', label: 'Fix blank lines' }
    ],
    css: [
      { value: 'pretty', label: 'Beautify' },
      { value: 'minify', label: 'Minify' }
    ],
    sql: [
      { value: 'default', label: 'Format SQL' }
    ],
    case: [
      { value: 'sentence', label: 'Sentence case' },
      { value: 'lowercase', label: 'lowercase' },
      { value: 'uppercase', label: 'UPPERCASE' },
      { value: 'title', label: 'Title Case' },
      { value: 'camel', label: 'camelCase' },
      { value: 'pascal', label: 'PascalCase' },
      { value: 'snake', label: 'snake_case' },
      { value: 'kebab', label: 'kebab-case' }
    ],
    lines: [
      { value: 'sort-alpha', label: 'Sort A-Z' },
      { value: 'sort-length', label: 'Sort by length' },
      { value: 'reverse', label: 'Reverse order' },
      { value: 'dedupe', label: 'Remove duplicates' },
      { value: 'shuffle', label: 'Shuffle' },
      { value: 'number', label: 'Add line numbers' }
    ]
  };
  
  function updateSubOptions() {
    subOptionsDiv.innerHTML = '';
    const opts = subOptionConfig[currentMode] || [];
    let firstValue = null;
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'sub-option';
      btn.textContent = opt.label;
      btn.dataset.value = opt.value;
      if (firstValue === null) firstValue = opt.value;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sub-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSubOption = opt.value;
        if (inputEl.value.trim()) handleFormat();
      });
      subOptionsDiv.appendChild(btn);
    });
    // Set default active
    const defaultVal = currentSubOption || firstValue;
    if (defaultVal) {
      const activeBtn = Array.from(subOptionsDiv.children).find(btn => btn.dataset.value === defaultVal);
      if (activeBtn) activeBtn.classList.add('active');
      currentSubOption = defaultVal;
    }
  }
  
  // ---------- Mode Switching ----------
  function setMode(mode) {
    currentMode = mode;
    // Update default sub-option per mode
    if (mode === 'json') currentSubOption = 'pretty-2';
    else if (mode === 'html') currentSubOption = 'pretty';
    else if (mode === 'css') currentSubOption = 'pretty';
    else if (mode === 'case') currentSubOption = 'sentence';
    else if (mode === 'lines') currentSubOption = 'sort-alpha';
    else currentSubOption = 'default';
    updateSubOptions();
    if (inputEl.value.trim()) handleFormat();
  }
  
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      setMode(tab.dataset.mode);
    });
  });
  
  // ---------- Utility Functions ----------
  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      inputEl.value = text;
      updateCounts();
      showNotification('Text pasted from clipboard.', 'success');
      handleFormat();
    } catch (err) {
      showNotification('Unable to paste. Please allow clipboard permissions.', 'error');
    }
  }
  
  function copyToClipboard() {
    if (!outputEl.value.trim()) {
      showNotification('Nothing to copy.', 'error');
      return;
    }
    navigator.clipboard.writeText(outputEl.value).then(() => {
      showNotification('Copied to clipboard!', 'success');
    }).catch(() => showNotification('Copy failed.', 'error'));
  }
  
  function downloadOutput() {
    const content = outputEl.value;
    if (!content.trim()) {
      showNotification('No output to download.', 'error');
      return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_${currentMode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Download started.', 'success');
  }
  
  function clearInput() {
    inputEl.value = '';
    updateCounts();
    showNotification('Input cleared.', 'info');
  }
  
  function clearOutput() {
    outputEl.value = '';
    updateCounts();
    showNotification('Output cleared.', 'info');
  }
  
  function swapInputOutput() {
    const temp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = temp;
    updateCounts();
    handleFormat();
    showNotification('Swapped input and output.', 'info');
  }
  
  function loadSample() {
    const samples = {
      plain: "This is   a messy   text   example.\nIt has   irregular spaces   and\ntrailing spaces.   \n\n\nRemove extra blank lines?",
      json: '{"name":"Sample","version":1,"data":{"nested":true,"array":[1,2,3]}}',
      html: '<div><h1>Hello World</h1><p>This is   minified   HTML.</p></div>',
      markdown: '#Heading\n\n## Another  heading\n- item1\n- item2\n\nSome text   with spaces.',
      css: 'body{background:#fff;margin:0;padding:0}h1{font-size:2rem}',
      sql: 'select id,name,email from users where active=1 order by name',
      case: 'this is a sample sentence that needs different case conversions',
      lines: 'apple\nbanana\ncherry\napple\ndate\nbanana'
    };
    inputEl.value = samples[currentMode] || samples.plain;
    updateCounts();
    handleFormat();
    showNotification(`Sample ${currentMode} loaded.`, 'success');
  }
  
  // Live update on input change (auto-format? optional, but we update counts)
  inputEl.addEventListener('input', () => {
    updateCounts();
    // optional: auto-format on keyup? But we keep explicit format.
  });
  
  // ---------- Event Listeners ----------
  formatBtn.addEventListener('click', handleFormat);
  swapBtn.addEventListener('click', swapInputOutput);
  copyBtn.addEventListener('click', copyToClipboard);
  downloadBtn.addEventListener('click', downloadOutput);
  clearInputBtn.addEventListener('click', clearInput);
  clearOutputBtn.addEventListener('click', clearOutput);
  pasteBtn.addEventListener('click', pasteFromClipboard);
  sampleBtn.addEventListener('click', loadSample);
  
  // ---------- Intersection Observer for Animations ----------
  const animElements = document.querySelectorAll('[data-anim]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  animElements.forEach(el => observer.observe(el));
  
  // ---------- Mobile Menu (optional, if header exists) ----------
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }
  
  // ---------- FAQ Accordion ----------
  const faqQs = document.querySelectorAll('.faq-q');
  faqQs.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true' ? false : true;
      btn.setAttribute('aria-expanded', expanded);
      const answerDiv = btn.nextElementSibling;
      if (expanded) {
        answerDiv.classList.add('open');
        answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
      } else {
        answerDiv.classList.remove('open');
        answerDiv.style.maxHeight = null;
      }
    });
  });
  
  // ---------- Sticky Header Shadow ----------
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }
  
  // ---------- Initialization ----------
  function init() {
    setMode('plain');
    updateCounts();
    // Load sample placeholder text for better UX
    inputEl.value = 'Paste or type your text here...\n\nTry pasting JSON, HTML, or messy text then click "Format".';
    outputEl.value = '';
    updateCounts();
    // Pre-run intro format?
  }
  init();
})();
