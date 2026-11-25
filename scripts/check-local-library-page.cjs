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
    fail = (code, msg) => issues.push({ level: "error", code, msg }),
    warn = (code, msg) => issues.push({ level: "warn", code, msg });
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
    const LEGACY_REGRESSION_RELEASES = new Set([
      "da9a0a1c942ccd7ef3c9f6e7c8a790c84624b90dcd39b7509b8d95cfb44127e7",
    ]);
    const fileName = path.basename(file);
    const isEngineeringFixture =
      fileName === "variants-59.html" || fileName === "review-calls.html";
    const WHITE_SECTION_GRAY_CARD_ALLOWLIST = new Set([
      "fs-homepage-pc.html",
      "fs-plp-switches-pc.html",
    ]);
    const CUSTOM_GRID_ALLOWLIST = new Set([
      "fs-plp-switches-pc.html",
      "fs-pdp-s5810-pc.html",
      "fs-account-center-pc.html",
    ]);
    // Visual Rule 1B: White sections (#FFFFFF) must use bordered cards (only Homepage & PLP allow borderless #FAFAFB product cards)
    if (
      !isSpecDoc &&
      !isEngineeringFixture &&
      !LEGACY_REGRESSION_RELEASES.has(version) &&
      !WHITE_SECTION_GRAY_CARD_ALLOWLIST.has(fileName)
    ) {
      for (const badCard of doc.querySelectorAll(
        '.page-section:not(.page-section--gray) [data-library-component="library-card"][data-library-fragment="spliced-vertical-single-event"], .page-section:not(.page-section--gray) .ds-card--no-border'
      )) {
        if (badCard.closest(".page-section--gray")) continue;
        fail(
          "PAGE_WHITE_SECTION_BORDER",
          "White section (#FFFFFF) must use bordered library-card variants (borderless cards are only allowed on gray sections or Homepage/PLP exceptions): " +
            (badCard.getAttribute("data-library-fragment") || "ds-card--no-border")
        );
      }
    }
    // Visual Rule 1C: Warn if a non-specialized page builds a custom <article> card grid bypassing library-card
    if (
      !isSpecDoc &&
      !isEngineeringFixture &&
      !LEGACY_REGRESSION_RELEASES.has(version) &&
      !CUSTOM_GRID_ALLOWLIST.has(fileName)
    ) {
      for (const grid of doc.querySelectorAll("main .grid")) {
        const directArticles = [...grid.children].filter(
          (el) => el.tagName === "ARTICLE" && !el.hasAttribute("data-library-component")
        );
        if (
          directArticles.length >= 3 &&
          !grid.querySelector('[data-library-component="library-card"], [data-library-component="library-icon-card"]')
        ) {
          warn(
            "PAGE_CUSTOM_CARD_GRID",
            "Grid contains " +
              directArticles.length +
              " hand-written <article> cards without library-card/library-icon-card; prefer native components"
          );
        }
      }
    }
    // Visual Rule 1D: Enforce native horizontal card/banner, official solid carousel arrows, native sort select, and 16px icon resolution match
    if (
      !isSpecDoc &&
      !isEngineeringFixture &&
      !LEGACY_REGRESSION_RELEASES.has(version)
    ) {
      for (const badHub of doc.querySelectorAll("main .pdp-hub-card, main .pdp-guide-banner, main .pdp-guide-card")) {
        fail(
          "PAGE_HANDCRAFTED_HORIZONTAL_CARD",
          "Do not hand-code horizontal feature cards/banners (" +
            (badHub.className || badHub.tagName) +
            "); use native library-card/spliced-horizontal-full-width"
        );
      }
      for (const badSort of doc.querySelectorAll("main [data-rev-sort], main .pdp-sort-btn")) {
        fail(
          "PAGE_HANDCRAFTED_SORT_BUTTONS",
          "Do not hand-code review sort buttons (" +
            (badSort.className || "data-rev-sort") +
            "); use native library-select"
        );
      }
      for (const navBtn of doc.querySelectorAll("main .pdp-gallery__nav img, main .pdp-media-quote__nav img")) {
        const s = navBtn.getAttribute("src") || "";
        if (!/icon-carousel-solid(?:36|48)-(?:left|right)-current\.svg/.test(s)) {
          fail(
            "PAGE_CAROUSEL_ARROW_ICON",
            "Carousel/gallery prev-next buttons must use official FS solid dark circular arrow icons (icon-carousel-solid36/48-*-current.svg): " + s
          );
        }
      }
      for (const iconImg of doc.querySelectorAll("main .pdp-perk-icon, main .duo-card__rewards-icon, main .pdp-trust-icon")) {
        const s = iconImg.getAttribute("src") || "";
        if (/-(?:36|48|68)\.svg$/i.test(s) || /icon-verified\.svg$/i.test(s)) {
          fail(
            "PAGE_ICON_SIZE_MISMATCH",
            "Inline 16px icon slot must use crisp 16px/18px linear icons, not downscaled 36/48px icons or solid green check badges: " + s
          );
        }
      }
      // Visual Rule 1D-bis: Same section must NOT mix different display icon styleFamilies (e.g. duotone-line vs duotone-surface)
      const styleFamiliesPath = path.join(root, "design-spec/icon-style-families.json");
      if (fs.existsSync(styleFamiliesPath)) {
        try {
          const styleCfg = JSON.parse(fs.readFileSync(styleFamiliesPath, "utf8"));
          const displaySet = new Set(Array.isArray(styleCfg.displayFamilies) ? styleCfg.displayFamilies : []);
          const byFile = styleCfg.byFile || {};
          const iconSections = doc.querySelectorAll("main section");
          const scopes = iconSections.length ? [...iconSections] : [doc.querySelector("main")].filter(Boolean);
          for (const sec of scopes) {
            const found = new Map();
            const inferLocalSvgFamily = (relHref) => {
              try {
                const abs = path.resolve(path.dirname(filePath), relHref.split("?")[0]);
                if (!abs.endsWith(".svg") || !fs.existsSync(abs)) return null;
                const svg = fs.readFileSync(abs, "utf8");
                const hasRed = /#c00000/i.test(svg);
                const hasSurfaceOp = /fill-opacity="0\.[1-8]/.test(svg);
                if (hasRed && hasSurfaceOp) return "duotone-surface";
                if (hasRed) return "duotone-line";
                const vb = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/i);
                if (vb && Number(vb[1]) >= 32) return "line-mono-lg";
              } catch {}
              return null;
            };
            const collectFile = (raw) => {
              if (!raw) return;
              const matches = String(raw).match(/(?:assets\/[^"'\s)\\?]+|(?:icon|img|goods)-[^"'\s)\\?]+)\.(?:svg|png)/gi) || [];
              for (const m of matches) {
                const fname = path.basename(m);
                let fam = byFile[fname];
                if (!fam && /^assets\//i.test(m) && m.toLowerCase().endsWith(".svg")) {
                  fam = inferLocalSvgFamily(m);
                }
                if (fam && displaySet.has(fam)) {
                  if (!found.has(fam)) found.set(fam, new Set());
                  found.get(fam).add(fname);
                }
              }
            };
            for (const img of sec.querySelectorAll("img[src]")) collectFile(img.getAttribute("src"));
            for (const el of sec.querySelectorAll("[style]")) collectFile(el.getAttribute("style"));
            for (const el of sec.querySelectorAll("[data-props]")) collectFile(el.getAttribute("data-props"));
            if (found.size > 1) {
              const detail = [...found.entries()].map(([fam, files]) => `${fam}: [${[...files].join(", ")}]`).join(" vs ");
              const secId = sec.getAttribute("id") || sec.className || "section";
              fail(
                "PAGE_ICON_STYLE_MIXED",
                `Section (${secId}) mixes incompatible display icon styleFamilies (${detail}); keep a single styleFamily per section.`
              );
            }
          }
        } catch {}
      }
      // Visual Rule 1E (P0): Source Coverage & Anti-Carousel-Flattening check against reference-inputs/<slug>/page-ir.json
      const baseSlug = fileName.replace(/\.html$/i, "");
      const irCandidates = [
        path.join(root, "reference-inputs", baseSlug, "page-ir.json"),
        path.join(root, "reference-inputs", baseSlug.replace(/-pc$/i, ""), "page-ir.json"),
      ];
      const irPath = irCandidates.find((p) => fs.existsSync(p));
      if (irPath) {
        try {
          const ir = JSON.parse(fs.readFileSync(irPath, "utf8"));
          const irSections = Array.isArray(ir.sections) ? ir.sections : [];
          const renderedText = (doc.querySelector("main")?.textContent || "").replace(/\s+/g, " ").toLowerCase();
          const noiseHeadingRe = /^(menu|search|cart|account|cookie|subscribe|newsletter|sign in|log in|privacy|terms|free shipping|black friday|limited[- ]time)/i;
          const majorSourceHeadings = [];
          for (const s of irSections) {
            const firstH = (Array.isArray(s.headings) ? s.headings : []).find(
              (h) => typeof h === "string" && h.trim().length >= 6 && h.trim().length <= 90 && !noiseHeadingRe.test(h.trim())
            );
            if (firstH) majorSourceHeadings.push(firstH.trim());
          }
          if (majorSourceHeadings.length >= 3) {
            const missing = majorSourceHeadings.filter((h) => {
              const tokens = h.toLowerCase().split(/[^a-z0-9\u4e00-\u9fff]+/).filter((w) => w.length >= 4);
              if (!tokens.length) return false;
              const matched = tokens.filter((w) => renderedText.includes(w)).length;
              return matched / tokens.length < 0.5;
            });
            if (missing.length >= Math.max(2, Math.ceil(majorSourceHeadings.length * 0.4))) {
              warn(
                "PAGE_SOURCE_COVERAGE_MISSING",
                `Synthesized page may be missing ${missing.length}/${majorSourceHeadings.length} major source sections from page-ir.json (e.g. "${missing.slice(0, 3).join('", "')}")`
              );
            }
          }
          const sourceCarouselCount = irSections.filter(
            (s) => s.hasCarousel && (s.carouselMeta?.itemCount || 0) >= 4
          ).length;
          if (sourceCarouselCount > 0) {
            const renderedCarousels = doc.querySelectorAll(
              'main [data-library-component="library-carousel"], main .ds-carousel, main .ds-carousel-external'
            ).length;
            if (renderedCarousels === 0) {
              warn(
                "PAGE_SOURCE_CAROUSEL_FLATTENED",
                `Source page-ir.json has ${sourceCarouselCount} multi-item carousel section(s), but synthesized page has 0 library-carousel components`
              );
            }
          }
          // Reverse check: detect fabricated headings, Hero/section descriptions, table headers, and card copy not in source
          let rawHtmlText = "";
          for (const candidate of ["live-main.html", "source.html"]) {
            const p = path.join(path.dirname(irPath), candidate);
            if (fs.existsSync(p)) {
              rawHtmlText = fs
                .readFileSync(p, "utf8")
                .replace(/<script[\s\S]*?<\/script>/gi, " ")
                .replace(/<style[\s\S]*?<\/style>/gi, " ")
                .replace(/<[^>]+>/g, " ");
              break;
            }
          }
          const sourceAllText = (
            irSections
              .map(
                (s) =>
                  `${(s.headings || []).join(" ")} ${s.visibleText || ""} ${(s.hiddenCopy || []).join(" ")} ${(s.collapsedDrawers || []).join(" ")} ${(s.tables || []).map((t) => JSON.stringify(t)).join(" ")}`
              )
              .join(" ") +
            " " +
            rawHtmlText
          )
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5\s]+/g, " ")
            .replace(/\s+/g, " ");
          if (sourceAllText.length > 80) {
            const checkNodes = [
              { sel: "main .section-header__title", kind: "Section title", minLen: 6 },
              { sel: "main .section-header__desc", kind: "Section description", minLen: 12 },
              { sel: "main .ds-banner__desc", kind: "Hero description", minLen: 12 },
              { sel: "main table thead th", kind: "Table header", minLen: 4 },
              { sel: "main [data-fs-extend] p:not(.ds-card__desc)", kind: "Extended card/body copy", minLen: 28, useNgram: true },
            ];
            for (const { sel, kind, minLen, useNgram } of checkNodes) {
              for (const el of doc.querySelectorAll(sel)) {
                if (el.querySelector("img, button") || (useNgram && el.closest(".ds-card__desc"))) continue;
                const text = (el.textContent || "").replace(/\s+/g, " ").trim();
                if (text.length < minLen) continue;
                const words = text
                  .toLowerCase()
                  .replace(/[^a-z0-9\u4e00-\u9fa5\s]+/g, " ")
                  .split(/\s+/)
                  .filter(Boolean);
                if (useNgram && words.length >= 6) {
                  const ngrams = [];
                  for (let i = 0; i <= words.length - 3; i++) {
                    ngrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
                  }
                  const ngramHits = ngrams.filter((g) => sourceAllText.includes(g)).length;
                  if (ngramHits === 0) {
                    warn(
                      "PAGE_SOURCE_TEXT_FABRICATED",
                      `${kind} "${text.slice(0, 60)}" has zero 3-word phrase overlap with source (likely fabricated or rewritten copy)`
                    );
                  }
                  continue;
                }
                const tokens = words.filter((w) => w.length >= 4);
                if (!tokens.length) continue;
                const hits = tokens.filter((w) => sourceAllText.includes(w)).length;
                if (hits === 0) {
                  warn(
                    "PAGE_SOURCE_TEXT_FABRICATED",
                    `${kind} "${text.slice(0, 60)}" has zero word overlap with source page-ir.json (possible fabricated copy)`
                  );
                }
              }
            }
          }
        } catch (_) {}
      }
    }
    // Visual Rule 2: Never mix white-bordered and gray form controls in the same form
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
      if(!isSpecDoc && !LEGACY_REGRESSION_RELEASES.has(version)) {
        const isErrorSel=/error|invalid|danger|alert|red-cta|filled-red/i.test(selector);
        if(!isErrorSel) {
          for(const prop of ['border','border-color','border-top','border-top-color','border-right','border-right-color','outline','outline-color']) {
            const val=rule.style.getPropertyValue(prop).trim();
            if(val && /(?:#c00000\b|rgb\(\s*192\s*,\s*0\s*,\s*0\s*\)|var\(\s*--color-red\s*\))/i.test(val)) {
              fail('PAGE_RED_BORDER_MISUSE','Selected/non-error containers must use #19191A dark border, not #C00000 red border: '+selector+' ('+prop+': '+val+')');
              break;
            }
          }
        }
        if(/:hover\b/i.test(selector)) {
          const hColor=rule.style.getPropertyValue('color').trim();
          if(hColor && /(?:#0060bf\b|rgb\(\s*0\s*,\s*96\s*,\s*191\s*\))/i.test(hColor)) {
            fail('PAGE_HOVER_BLUE_MISUSE','#0060BF is reserved for resting inline blue links; dark/gray text links and triggers must stay #19191A on :hover (with underline or active border): '+selector);
          }
        }
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
    if (!isSpecDoc && !LEGACY_REGRESSION_RELEASES.has(version)) {
      const SKIP_LIB = '[data-library-component="library-input-number"],[data-library-component="library-pagination"],[data-library-component="library-select"],[data-library-component="library-carousel"],[data-library-component="library-navigation"]';
      for (const btn of doc.querySelectorAll('main button, main [role="button"], main a.ds-btn')) {
        if (btn.closest(SKIP_LIB)) continue;
        const txt = (btn.textContent || "").replace(/\s+/g, " ").trim();
        if (!txt) continue;
        if (/^[×✕✖+−✓✔→←↑↓‹›«»▶▼▲<>]+$/.test(txt) || /^[×✕✖+−✓✔→←↑↓‹›«»▶▼▲]\s+\S|\S\s+[×✕✖+−✓✔→←↑↓‹›«»▶▼▲]$/.test(txt)) {
          fail("PAGE_BUTTON_UNICODE_ICON", `Button "${txt}" uses raw Unicode symbol instead of registered SVG icon or fs-icon.cjs --mono`);
        }
      }
      for (const img of doc.querySelectorAll('main .ds-tab--product .ds-tab__item-icon img[src]')) {
        const src = (img.getAttribute("src") || "").split(/[?#]/)[0];
        if (!/\.svg$/i.test(src) || /^(?:https?:|\/\/)/i.test(src)) continue;
        const svgFile = path.resolve(path.dirname(file), decodeURIComponent(src));
        if (fs.existsSync(svgFile)) {
          const svgRaw = fs.readFileSync(svgFile, "utf8");
          if (!/#c00000\b/i.test(svgRaw)) {
            fail("PAGE_PRODUCT_TAB_ICON_MONO", `library-tab/product icon "${src}" must be red-black duotone (#19191A + #C00000 accent), not pure monochrome`);
          }
        }
      }
      for (const lbl of doc.querySelectorAll('main .ds-input__label, main .ds-select__label')) {
        const txt = (lbl.textContent || "").trim();
        if (/^lable$/i.test(txt)) {
          fail("PAGE_UNEDITED_DEFAULT_LABEL", `Form control still renders default template label "${txt}" — pass an explicit label prop`);
        }
      }
      for (const el of doc.querySelectorAll('main span, main div, main p, main strong')) {
        if (el.children.length > 0) continue;
        if (el.closest('[data-library-component="library-rate"]')) continue;
        const txt = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (/^[★☆]+\s*\d(?:\.\d)?(?:\s*\(\d+\))?$/.test(txt)) {
          fail("PAGE_UNICODE_STAR_RATING", `Element "${txt}" uses raw Unicode star rating instead of native library-rate/display`);
        }
      }
    }
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
  // Visual Rule 4: Multi-product comparison tables must center-align product columns
  for (const tbl of document.querySelectorAll("main table")) {
    if (tbl.querySelectorAll("thead th img").length >= 2) {
      const cells = [...tbl.querySelectorAll("thead th:not(:first-child), tbody td:not(:first-child)")];
      if (cells.some((c) => getComputedStyle(c).textAlign !== "center")) {
        errors.push("PAGE_COMPARE_TABLE_ALIGN: product comparison table columns must be center-aligned");
        break;
      }
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
