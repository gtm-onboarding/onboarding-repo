/* Dark mode + English/Spanish toggles for the iXperience page clone. */
(function () {
  var THEME_KEY = "ix-theme";
  var LANG_KEY = "ix-lang";
  var DARK_CLASS = "ix-dark";
  var root = document.documentElement;
  var originals = new WeakMap();

  /* ---------- inline colours ----------
     Webflow's interactions write light colours straight onto element style
     attributes, which no stylesheet can override, so the same light -> dark
     mapping used by tools/generate-dark-css.py is applied here at runtime. */
  var INLINE_PROPS = ["backgroundColor", "color", "borderColor"];
  var inlineOriginals = new WeakMap();
  var inlineWritten = new WeakMap();

  function parseRgb(value) {
    var m = /^rgba?\(([^)]+)\)$/.exec(value || "");
    if (!m) return null;
    var parts = m[1].split(",").map(parseFloat);
    if (parts.length < 3 || parts.some(isNaN)) return null;
    return {
      r: parts[0] / 255,
      g: parts[1] / 255,
      b: parts[2] / 255,
      a: parts.length > 3 ? parts[3] : 1,
    };
  }

  function luminance(c) {
    return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  }

  function saturation(c) {
    var max = Math.max(c.r, c.g, c.b);
    var min = Math.min(c.r, c.g, c.b);
    if (max === min) return 0;
    var l = (max + min) / 2;
    return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }

  function rgba(r, g, b, a) {
    return (
      "rgba(" +
      [r, g, b]
        .map(function (v) {
          return Math.round(Math.max(0, Math.min(1, v)) * 255);
        })
        .join(", ") +
      ", " +
      a +
      ")"
    );
  }

  function darkEquivalent(prop, value) {
    var c = parseRgb(value);
    if (!c || c.a < 0.05 || saturation(c) > 0.25) return null;
    var lum = luminance(c);
    if (prop === "backgroundColor") {
      return lum > 0.7 ? rgba(0.082, 0.094, 0.114, c.a) : null;
    }
    if (prop === "color") {
      return lum < 0.42 ? rgba(0.914, 0.925, 0.949, c.a) : null;
    }
    return lum > 0.75 || lum < 0.2 ? rgba(0.169, 0.192, 0.231, c.a) : null;
  }

  function themeInline(el) {
    if (!el.style || el.closest(".ix-controls")) return;
    var dark = currentTheme() === "dark";
    INLINE_PROPS.forEach(function (prop) {
      var value = el.style[prop];
      if (!value) return;
      var written = inlineWritten.get(el) || {};
      if (dark) {
        if (value === written[prop]) return;
        var replacement = darkEquivalent(prop, value);
        if (!replacement) return;
        var originals = inlineOriginals.get(el) || {};
        originals[prop] = value;
        inlineOriginals.set(el, originals);
        written[prop] = replacement;
        inlineWritten.set(el, written);
        el.style[prop] = replacement;
      } else {
        var saved = inlineOriginals.get(el);
        if (saved && saved[prop] && value === written[prop]) {
          el.style[prop] = saved[prop];
          written[prop] = null;
          inlineWritten.set(el, written);
        }
      }
    });
  }

  function themeInlineTree(target) {
    if (target.nodeType !== Node.ELEMENT_NODE) return;
    themeInline(target);
    target.querySelectorAll("[style]").forEach(themeInline);
  }

  /* ---------- theme ---------- */
  function storedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function prefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function applyTheme(theme) {
    root.classList.toggle(DARK_CLASS, theme === "dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* storage unavailable */
    }
    if (document.body) themeInlineTree(document.body);
    updateControls();
  }

  function currentTheme() {
    return root.classList.contains(DARK_CLASS) ? "dark" : "light";
  }

  /* ---------- language ---------- */
  /* Keys are matched on whitespace-normalised text: the page mixes regular
     spaces with non-breaking ones. */
  function normalize(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  var dict = (function () {
    var source = (window.IX_TRANSLATIONS || {}).es || {};
    var normalized = {};
    Object.keys(source).forEach(function (key) {
      normalized[normalize(key)] = source[key];
    });
    return normalized;
  })();

  function translatable(node) {
    var parent = node.parentNode;
    if (!parent) return false;
    var tag = parent.nodeName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return false;
    if (parent.closest && parent.closest(".ix-controls")) return false;
    return /\S/.test(node.nodeValue);
  }

  function translateNode(node, lang) {
    if (!translatable(node)) return;
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    var source = originals.get(node);
    if (lang === "en") {
      if (node.nodeValue !== source) node.nodeValue = source;
      return;
    }
    var trimmed = source.trim();
    var translated = dict[normalize(trimmed)];
    if (translated) node.nodeValue = source.replace(trimmed, translated);
  }

  function translateTree(target, lang) {
    var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) translateNode(node, lang);
    var titled = target.querySelectorAll
      ? target.querySelectorAll("[placeholder], [aria-label], [alt]")
      : [];
    titled.forEach(function (el) {
      ["placeholder", "aria-label", "alt"].forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (!value) return;
        var store = "ixOriginal" + attr.replace("-", "");
        if (!el.dataset[store]) el.dataset[store] = value;
        var source = el.dataset[store];
        var translated = dict[normalize(source)];
        el.setAttribute(attr, lang === "es" && translated ? translated : source);
      });
    });
  }

  function applyLang(lang) {
    translateTree(document.body, lang);
    if (document.title) {
      if (!root.dataset.ixTitle) root.dataset.ixTitle = document.title;
      var title = root.dataset.ixTitle;
      var translated = dict[normalize(title)];
      document.title = lang === "es" && translated ? translated : title;
    }
    root.setAttribute("lang", lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* storage unavailable */
    }
    updateControls();
  }

  function currentLang() {
    return root.getAttribute("lang") === "es" ? "es" : "en";
  }

  /* Webflow sliders, interactions and third-party embeds keep touching the DOM
     after load, so translations and inline colours are reapplied as it moves. */
  var observer = new MutationObserver(function (mutations) {
    var es = currentLang() === "es";
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes") {
        themeInline(mutation.target);
        return;
      }
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (es) translateNode(node, "es");
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (es) translateTree(node, "es");
          themeInlineTree(node);
        }
      });
    });
  });

  /* ---------- controls ---------- */
  var themeBtn;
  var langBtn;

  function updateControls() {
    if (!themeBtn || !langBtn) return;
    var dark = currentTheme() === "dark";
    var es = currentLang() === "es";
    themeBtn.textContent = dark ? "☀️ Light" : "🌙 Dark";
    themeBtn.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode"
    );
    themeBtn.setAttribute("aria-pressed", String(dark));
    langBtn.textContent = es ? "🇺🇸 EN" : "🇪🇸 ES";
    langBtn.setAttribute(
      "aria-label",
      es ? "Switch to English" : "Cambiar a español"
    );
  }

  function buildControls() {
    var wrap = document.createElement("div");
    wrap.className = "ix-controls";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Site preferences");

    themeBtn = document.createElement("button");
    themeBtn.type = "button";
    themeBtn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });

    var sep = document.createElement("span");
    sep.className = "ix-sep";

    langBtn = document.createElement("button");
    langBtn.type = "button";
    langBtn.addEventListener("click", function () {
      applyLang(currentLang() === "es" ? "en" : "es");
    });

    wrap.append(themeBtn, sep, langBtn);
    document.body.appendChild(wrap);
    updateControls();
  }

  function init() {
    buildControls();
    themeInlineTree(document.body);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
    var lang = null;
    try {
      lang = localStorage.getItem(LANG_KEY);
    } catch (e) {
      /* storage unavailable */
    }
    if (lang === "es") applyLang("es");
  }

  /* Set the theme before first paint to avoid a flash of the light theme. */
  applyTheme(storedTheme() || (prefersDark() ? "dark" : "light"));

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
