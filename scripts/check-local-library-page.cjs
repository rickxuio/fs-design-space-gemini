"use strict";
const fs = require("node:fs"),
  path = require("node:path");
const L = require("./local-component-library.cjs");
const C = require("./check-context.cjs");
// Preserve the existing declared Form-owned textarea, but verify its actual
// pinned anatomy; a data-source-primitive label alone is not authorization.
function nativeTextarea(node, data, JSDOM) {
  const host = node.parentElement;
  if (node.tagName !== 'TEXTAREA' || host?.dataset.sourcePrimitive !== 'Form/white native textarea') return false;
  const example = data.components['library-form']?.variants.white?.exampleHtml;
  if (!example) return false;
  const sampleDOM = new JSDOM(example);
  try {
    const sample = sampleDOM.window.document.querySelector('[data-input-kind="textarea"]');
    if (!sample || host.tagName !== sample.tagName ||
        [...host.attributes].some(a => a.name !== 'data-source-primitive' && sample.getAttribute(a.name) !== a.value) ||
        [...sample.attributes].some(a => host.getAttribute(a.name) !== a.value)) return false;
    require('./local-slot-validation.cjs').structured(host, sample, {}, 'sourcePrimitive',
      {dataset:{libraryComponent:'library-form'}}, data.components['library-form'].variants.white, {});
    return true;
  } catch (_) { return false; }
  finally { sampleDOM.window.close(); }
}
function validateFile(file, { root = L.ROOT, requireShell = true, context = C.createContext() } = {}) {
  context.stats.staticRuns++;
  const issues = [],
    fail = (code, msg) => issues.push({ level: "error", code, msg });
  let dom;
  try {
    const html = fs.readFileSync(file, "utf8"),
      JSDOM = L.domAPI(root);
    dom = new JSDOM(html);
    const doc = dom.window.document,
      version = doc.documentElement.dataset.fsLibrary;
    C.verifiedRelease(root, version, context);
    const data = L.catalog(root, version),
      uses = [],
      nodes = [...doc.querySelectorAll("[data-library-component]")];
    if (!nodes.length)
      throw Error("No real library components in a library page");
    const isSpecDoc = !!doc.querySelector('meta[name="fs-document-template"]');
    // Visual Rule 1: Gray sections (#FAFBFB) must not use bordered white library-card variants
    if (!isSpecDoc) {
      for (const badCard of doc.querySelectorAll(
        '.page-section--gray [data-library-component="library-card"][data-library-fragment*="bordered"], .page-section--gray .ds-card--bordered'
      )) {
        fail(
          "PAGE_SURFACE_BORDER",
          "Gray section (#FAFBFB) must not contain bordered white cards: " +
            (badCard.getAttribute("data-library-fragment") || "ds-card--bordered")
        );
      }
    }
    // Visual Rule 2: Never mix white-bordered and gray form controls in the same form
    const LEGACY_REGRESSION_RELEASES = new Set([
      "140882ce617cdc8b67dfe2da93a9d59bab5926ad3941d8723ad4a0b638e03658",
      "8eb2dc24439210cc01e421e94e820b4e49756fb103698539919abfa2ed26164e",
      "a22a4bab5096efb427a40675637449319261479fdf1380e42bb44ac93c8381e9",
      "d3d1a37d8ef7e691e72a4a75e7cbd2546a023aace81dce5058d9ef040fa645c4",
      "e682b031f8e8a2fa1e80f0e9254300f440d35db94f084f3e639e5da9d3f4768c",
      "d7dd2d6a244026644b4bb1568816e814e46df131d0534fd7fe43732b0eb392da",
      "da9a0a1c942ccd7ef3c9f6e7c8a790c84624b90dcd39b7509b8d95cfb44127e7",
    ]);
    const WHITE_SELECTS = new Set(["single-radio", "multi-checkbox", "search", "phone-search", "grouped-combination"]);
    const GRAY_SELECTS = new Set(["single-basic", "single-check", "multi-basic", "two-column"]);
    const formScopes = isSpecDoc
      ? []
      : LEGACY_REGRESSION_RELEASES.has(version)
      ? [...doc.querySelectorAll("form[data-fs-check-form]")]
      : [...doc.querySelectorAll('form, [data-library-component="library-form"], .page-section')];
    for (const scope of formScopes) {
      const inputs = [...scope.querySelectorAll('[data-library-component="library-input"]')].map((n) =>
        n.getAttribute("data-library-fragment")
      );
      const selects = [...scope.querySelectorAll('[data-library-component="library-select"]')].map((n) =>
        n.getAttribute("data-library-fragment")
      );
      const hasWhite = inputs.includes("white") || selects.some((x) => WHITE_SELECTS.has(x));
      const hasGray = inputs.includes("gray") || selects.some((x) => GRAY_SELECTS.has(x));
      if (hasWhite && hasGray) {
        fail("PAGE_FORM_SURFACE_MIX", "Form mixes white-bordered and gray form controls in the same scope");
        break;
      }
    }
    const normalize = (s) =>
      s.replace(/library-instance-\d+-/g, "library-instance-ID-");
    const stripDirectExtensions = (node, failFn) => {
      const clone = node.cloneNode(true);
      const isShell =
        node.dataset.libraryComponent === "library-navigation" &&
        ["header", "footer"].includes(node.dataset.libraryFragment);
      const extNodes = [...clone.querySelectorAll("[data-fs-extend]")];
      if (!extNodes.length) return { html: clone.outerHTML, extCount: 0 };
      if (isShell) {
        failFn("LIBRARY_SHELL_EXTEND", "Fixed navigation header/footer cannot be extended (Rule 0)");
        return { html: clone.outerHTML, extCount: extNodes.length };
      }
      for (const ext of extNodes) {
        const label = (ext.getAttribute("data-fs-extend") || "").trim();
        if (!label) failFn("LIBRARY_EXTEND_LABEL", "data-fs-extend must describe the business addition");
        if (ext.querySelector("script,iframe,object,embed")) {
          failFn("LIBRARY_EXTEND_UNSAFE", "Disallowed tag inside data-fs-extend: " + label);
        }
        for (const el of [ext, ...ext.querySelectorAll("*")]) {
          if ([...el.attributes].some((a) => /^on/i.test(a.name))) {
            failFn("LIBRARY_EXTEND_UNSAFE", "Inline event handler inside data-fs-extend: " + label);
          }
          const st = el.getAttribute("style") || "";
          if (/gradient\(/i.test(st)) {
            failFn("BG_GRADIENT", "Gradient not allowed in data-fs-extend: " + label);
          }
          const fw = st.match(/font-weight\s*:\s*([a-z0-9]+)/i);
          if (fw && !["400", "600", "normal"].includes(fw[1].toLowerCase())) {
            failFn("FONT_WEIGHT", "Only font-weight 400/600 allowed in data-fs-extend: " + fw[1]);
          }
        }
        ext.remove();
      }
      return { html: clone.outerHTML, extCount: extNodes.length };
    };
    for (const node of nodes) {
      if (node.dataset.libraryRelease !== version)
        throw Error("Mixed component versions");
      const expected = C.canonical(node, root, version, path.dirname(file), context);
      const use = expected.use;
      const stripped = stripDirectExtensions(node, fail);
      if (
        normalize(stripped.html) !==
        expected.html
      )
        fail(
          "LIBRARY_STRUCTURE",
          "Canonical component or undeclared property changed: " +
            node.dataset.libraryComponent +
            "/" +
            node.dataset.libraryFragment,
        );
      if (use.entry.requiresGroup) {
        const owner=node.closest(use.entry.requiresGroup.selector);
        if(!owner || !owner.getAttribute('aria-label')?.trim() || [...owner.querySelectorAll('[data-library-component="library-option-selector"]')].filter(n=>n.closest(use.entry.requiresGroup.selector)===owner).length<use.entry.requiresGroup.minItems)fail('LIBRARY_GROUP','OptionSelector requires a named native radiogroup with at least two actual options');
      }
      uses.push(use);
    }
    // Check outside canonical components as well: source embeds or bare fields
    // must not silently stand in for a missing local component.
    for (const node of doc.querySelectorAll('main iframe, main object, main embed'))
      if (!node.closest('[data-library-component]'))
        fail('LIBRARY_UNDECLARED_EMBED', 'Embedded source content has no canonical component contract: ' + node.tagName.toLowerCase());
    for (const node of doc.querySelectorAll('main input, main select, main textarea, main button[type="submit"], main form button:not([type])'))
      if (!node.closest('[data-library-component]') && !nativeTextarea(node, data, JSDOM))
        fail('LIBRARY_UNREGISTERED_CONTROL', 'Form control outside registered components: ' + node.tagName.toLowerCase() + (node.getAttribute('name') ? '/' + node.getAttribute('name') : ''));
    if (requireShell)
      for (const fragment of ["header", "footer"])
        if (
          nodes.filter(
            (n) =>
              n.dataset.libraryComponent === "library-navigation" &&
              n.dataset.libraryFragment === fragment,
          ).length !== 1
        )
          fail(
            "LIBRARY_SHELL",
            "Exactly one matching fixed navigation " + fragment + " required",
          );
    const styles = L.orderedResources(
        uses.map((u) => u.styles),
        root,
      ).concat(uses[0].fontStyle),
      scripts = L.orderedResources(
        uses.map((u) => u.scripts),
        root,
      );
    for (const [tag, attr, required] of [
      ['link[rel="stylesheet"]', "href", styles],
      ["script[src]", "src", scripts],
    ]) {
      const found = [...doc.querySelectorAll(tag)].map((n) => {
        const url = n.getAttribute(attr);
        if (/^(?:https?:|\/\/)/.test(url))
          throw Error("Unversioned external executable/style resource: " + url);
        const target = path.resolve(path.dirname(file), url.split(/[?#]/)[0]);
        L.safeFile(root, path.relative(root, target));
        return path.relative(root, target).split(path.sep).join("/");
      });
      for (const f of required)
        if (found.filter((x) => x === f).length !== 1)
          fail("LIBRARY_DEPENDENCY", "Missing or duplicate resource: " + f);
      for (const f of found)
        if (!required.includes(f))
          fail(
            "LIBRARY_MIXED_RESOURCE",
            "Style/script outside the component resource closure: " + f,
          );
      const positions = required.map((f) => found.indexOf(f));
      if (positions.some((p, i) => i && p < positions[i - 1]))
        fail("LIBRARY_ORDER", "Dependency resource order changed");
    }
    for (const n of doc.querySelectorAll("[src], [poster]"))
      for (const a of ["src", "poster"])
        if (n.hasAttribute(a)) {
          const url = n.getAttribute(a);
          if (!/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(url))
            L.safeFile(
              root,
              path.relative(
                root,
                path.resolve(
                  path.dirname(file),
                  decodeURIComponent(url.split(/[?#]/)[0]),
                ),
              ),
            );
        }
    const walk = rules => { for (const rule of rules) {
      if(rule.cssRules && !rule.selectorText) { walk(rule.cssRules); continue; }
      if(!rule.selectorText || !rule.style) continue;
      const selector=rule.selectorText, declarations=rule.style.cssText;
      if (/\.ds-|\[data-library|(?:^|[ >+~,(])(?:button|a|img|span|p|header|footer|\*)(?=[#.:[\s>+~]|$)/.test(selector) || /:root/.test(selector))
        fail('LIBRARY_STYLE_OVERRIDE','Page CSS targets component internals or global elements: '+selector);
      if (/--(?:color|font|space|btn|ds)-[\w-]*\s*:/.test(declarations)) fail('LIBRARY_TOKEN_OVERRIDE','Page may not override component tokens');
      if(selector.includes('.section-header__desc')) { const width=rule.style.getPropertyValue('max-width').trim(); if(width && width!=='960px') fail('SECTION_DESC_WIDTH','Page section description max-width must be 960px: '+width); }
      else if(rule.style.getPropertyValue('max-width').trim()==='960px') { try { for(const matched of doc.querySelectorAll(selector)) if(matched.querySelector?.('video') || matched.tagName==='VIDEO') fail('PAGE_MEDIA_CONTAINER_WIDTH','Standalone media panel must fill 1200px container, not 960px text cap: '+selector); } catch(_){} }
      for(const property of ['background','background-color','background-image']) {
        const value=rule.style.getPropertyValue(property).trim(); if(!value) continue;
        if(/gradient\(/i.test(value)) fail('BG_GRADIENT','Page surfaces must not use gradients: '+selector);
        if(property==='background-image') continue;
        const surface=selector.split(',').some(part=>/(?:^|[ >+~])(?:html|body|main)(?=$|[.#:[\s>+~])|\.(?:page-section(?:--[\w-]+)?|container|module-layout|hero-surface)(?=$|[.#:[\s>+~])/.test(part));
        if(!surface) continue;
        const plain=value.replace(/\s+/g,'').toLowerCase();
        if(/^(?:#[0-9a-f]{3,8}|[a-z]+|rgba?\([^)]*\))$/i.test(plain) && !['#fff','#ffffff','#fafbfb','#19191a','white','transparent','inherit','initial','unset','none','rgb(255,255,255)','rgb(250,251,251)','rgb(25,25,26)','rgba(0,0,0,0)'].includes(plain)) fail('PAGE_BACKGROUND','Page surface color is outside local layout specification: '+value+' in '+selector);
      }
      if(rule.cssRules?.length) walk(rule.cssRules);
    }};
    for(const style of doc.querySelectorAll('style')) { if(style.textContent.trim() && !style.sheet) fail('PAGE_CSS_PARSE','Page stylesheet could not be parsed'); else if(style.sheet) walk(style.sheet.cssRules); }
    for (const node of doc.querySelectorAll("[style]"))
      if (node.closest("[data-library-component]") === null)
        fail("INLINE_STYLE", "Page layout must use declared layout classes");
    const ids = new Set();
    for (const n of doc.querySelectorAll("[id]")) {
      if (ids.has(n.id)) fail("DUPLICATE_ID", n.id);
      ids.add(n.id);
    }
    for (const n of doc.querySelectorAll("[aria-controls],[aria-labelledby]"))
      for (const a of ["aria-controls", "aria-labelledby"])
        for (const id of (n.getAttribute(a) || "").split(/\s+/).filter(Boolean))
          if (!doc.getElementById(id)) fail("MISSING_CHILD", a + ": " + id);
    if (!doc.querySelector("main"))
      fail("PAGE_MAIN", "Local page requires main");
  } catch (e) {
    const hint = /^Unknown library (?:component|fragment):/.test(e.message)
      ? "；调用清单未命中不代表规范不存在，请先核对对应契约和 Preview，区分未接入与缺规范；当前调用仍失败，不自动降级。" : "";
    fail("LIBRARY_CALL", e.message + hint);
  } finally {
    dom?.window.close();
  }
  return issues;
}
function pageProbe() {
  const errors = [],
    warns = [];
  if (document.documentElement.scrollWidth > innerWidth + 1)
    errors.push("PAGE_OVERFLOW: horizontal overflow");
  for (const n of document.querySelectorAll("main .container")) {
    const b = n.getBoundingClientRect();
    if (innerWidth >= 1280 && Math.abs(b.width - 1200) > 1)
      errors.push("PAGE_CONTAINER: expected 1200px, got " + b.width);
  }
  for (const n of document.querySelectorAll("main .page-section")) {
    const s = getComputedStyle(n);
    if (s.paddingTop !== "40px" || s.paddingBottom !== "40px")
      errors.push("PAGE_SECTION: expected 40px vertical padding");
  }
  for (const n of document.querySelectorAll("main .grid")) {
    if (getComputedStyle(n).gap !== "20px")
      errors.push("PAGE_GRID: expected 20px gap");
  }
  for (const n of document.querySelectorAll("main .section-header__title")) {
    const s = getComputedStyle(n);
    if (s.fontSize !== "24px" || s.lineHeight !== "32px")
      errors.push("PAGE_HEADING: expected 24/32px");
  }
  // Visual Rule 3: Standalone media showcase panels must fill 1200px container, not 960px text description cap
  for (const n of document.querySelectorAll("main .container > *:not(.section-header)")) {
    if (n.querySelector("video") && getComputedStyle(n).maxWidth === "960px") {
      errors.push("PAGE_MEDIA_CONTAINER_WIDTH: standalone media panel must fill 1200px container, not 960px");
    }
  }
  for (const img of document.images)
    if (!img.complete || !img.naturalWidth)
      errors.push("LIBRARY_IMAGE: " + img.getAttribute("src"));
  if (!document.fonts.check('14px "Open Sans"'))
    errors.push("LIBRARY_FONT: Open Sans not loaded");
  return { errors, warns };
}
module.exports = { validateFile, pageProbe };
