"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os"),
  { spawnSync } = require("node:child_process");
const L = require("./local-component-library.cjs"),
  B = require("../build.js"),
  V = require("./check-local-library-page.cjs"),
  ROOT = L.ROOT;
const read = (f) => JSON.parse(fs.readFileSync(f));
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fs-local-flow-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function makePage(target) {
  const placeholders = [
    ["navigation", "header"],
    [
      "button",
      "outline-black",
      {
        label: "Download",
        icon: "components/icons/icon-fs-download-black-16.svg",
        iconHidden: false,
      },
    ],
    [
      "text-button",
      "inline-blue",
      { label: "Contact Us", href: "https://www.fs.com/contact_us.html" },
    ],
    ["collapse", "feature"],
    ["navigation", "footer"],
  ].map(
    ([c, f, p]) =>
      `<div data-component="library-${c}" data-fragment="${f}"${p ? " data-props='" + JSON.stringify(p) + "'" : ""}></div>`,
  );
  const source =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Local adapter test</title></head><body>' +
    placeholders[0] +
    '<main><section class="page-section"><div class="container">' +
    placeholders.slice(1, -1).join("\n") +
    "</div></section></main>" +
    placeholders.at(-1) +
    "</body></html>";
  return B.assemblePage(
    source,
    B.loadRegistry(),
    new Map(),
    "isolated-local-test.html",
    { targetDir: target },
  ).html;
}
test("default entries remain local; requiring build never starts a build", () => {
  const scripts = read(path.join(ROOT, "package.json")).scripts;
  for (const retired of ['design-system/page-plans','design-system/workbench.html','design-system/test-pages.html','design-system/scripts/run-page-generation.js','design-system/scripts/prepare-page-generation-context.js','design-system/scripts/register-test-page.js']) assert.equal(fs.existsSync(path.join(ROOT,retired)),false,'Retired workflow returned: '+retired);
  const sourceScripts=read(path.join(ROOT,'design-system/package.json')).scripts;
  for(const key of ['run:page-generation','prepare:page-context','register:test-page','workbench','check:delivery'])assert.equal(sourceScripts[key],undefined);

  for (const k of ["build", "validate", "verify", "check", "preview"])
    assert.ok(!scripts[k].includes("--prefix design-system"), k);
  for (const k of [
    "run:page-generation",
    "register:test-page",
    "draft:page-plan",
  ])
    assert.equal(scripts[k], undefined);
  const result = spawnSync(process.execPath, ["-e", "require('./build.js')"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, "");
  assert.ok(
    fs
      .readFileSync(path.join(ROOT, "AGENTS.md"), "utf8")
      .includes("## Step 1 — Read Spec Files"),
  );
  assert.ok(
    !fs
      .readFileSync(path.join(ROOT, "index.html"), "utf8")
      .includes("location.replace"),
  );
});
test("current registry needs no legacy files; exact variants, selection and dependencies are preserved", () => {
  const registry = B.loadRegistry(), data = L.catalog();
  assert.equal(data.summary.components, 31);
  assert.equal(Object.keys(registry.components).length, 31);
  assert.ok(Object.keys(registry.components).every(k => k.startsWith("library-")));
  assert.deepEqual(data.preexistingGaps, []);
  for (const retired of ["fs-components/component-specs/preview", "fs-components/component-specs/icons", "fs-components/component-specs/tokens.css", "fs-components/component-specs/components.css", "scripts/fixtures/legacy-component-registry.json"])
    assert.equal(fs.existsSync(path.join(ROOT, retired)), false, "Retired dependency returned: " + retired);
  for (const [key, c] of Object.entries(data.components)) {
    const entry = registry.components[key],
      fragments = B.parseFragments(
        fs.readFileSync(path.join(ROOT, "fs-components", entry.path), "utf8"),
      );
    assert.deepEqual([...fragments.keys()], entry.fragments);
    for (const f of entry.fragments) {
      assert.match(f, /^[a-z][a-z0-9-]*$/);
      const use = L.render(key, f);
      assert.equal(use.entry.sourceVariant, c.variants[f].name);
      assert.ok(use.styles.length);
    }
  }
  assert.ok(
    data.components["library-button"].relationships.parents.some(
      (p) => p.id === "dialog",
    ),
  );
  assert.ok(
    data.components["library-card"].relationships.children.some(
      (p) => p.id === "button",
    ),
  );
});
test("actual local assembly, canonical verification and constrained edits", (t) => {
  const folder = path.join(ROOT, "maintenance/local-component-regression"),
    file = path.join(folder, "temporary-probe.html");
  t.after(() => fs.rmSync(file, { force: true }));
  const html = makePage(folder);
  fs.writeFileSync(file, html);
  assert.deepEqual(V.validateFile(file), []);
  for (const [name, f, props] of [
    ["library-button", "outline-black", { addClass: "rogue" }],
    ["library-button", "filled-red", { icon: "rogue.svg" }],
    ["library-text-button", "inline-blue", { href: "javascript:alert(1)" }],
    ["library-text-button", "inline-blue", { href: "java\nscript:alert(1)" }],
    ["library-carousel", "navigation-outlined-m-left", { accessibleLabel: "" }],
  ])
    assert.throws(() => L.render(name, f, props));
  assert.throws(() => L.render("library-button", "wrong"));
  assert.equal(L.render("library-card", "spliced-horizontal-full-width").entry.callable, true);
  assert.equal(L.render("library-menu-navigation", "multi-level-search").entry.callable,true);
  assert.ok(
    L.render("library-icon-card", "center-single-event").html.includes(
      "ds-icon-card",
    ),
  );
  assert.throws(
    () =>
      L.render("library-icon-card", "center-single-event", {
        icon: "unregistered.svg",
      }),
    /registered/,
  );
  const linked = L.render("library-text-button", "inline-blue", {
    href: "../index.html",
  });
  assert.ok(linked.html.includes('href="../index.html"'));
  const image = L.render("library-card", "embedded-product-small", {
    image: { src: "https://example.com/test.png", alt: "Fixture image" },
  });
  assert.ok(image.html.includes('alt="Fixture image"'));
  const collapse = L.catalog().components["library-collapse"].variants.feature;
  const JSDOM = L.domAPI(),
    dom = new JSDOM(L.render("library-collapse", "feature").html),
    items = dom.window.document.body.firstElementChild.innerHTML;
  assert.ok(
    L.render("library-collapse", "feature", { items }).html.includes(
      "ds-collapse__item",
    ),
  );
  dom.window.close();
  for (const changed of [
    html.replace("collapse-current.js", "missing-child.js"),
    html.replace("ds-btn ds-btn--outline-black", "ds-btn ds-btn--filled-red"),
    html.replace("</head>", "<style>.ds-btn { color:red }</style></head>"),
    html.replace(
      "</head>",
      '<link rel="stylesheet" href="../../fs-components/component-specs/components.css"></head>',
    ),
  ]) {
    fs.writeFileSync(file, changed);
    assert.ok(V.validateFile(file).some((i) => i.level === "error"));
  }
  const use = L.render("library-button", "outline-black");
  assert.throws(() =>
    L.finalizePage(
      "<html><head></head><body></body></html>",
      [use, { ...use, version: "0".repeat(64) }],
      folder,
    ),
  );
});
test("pinned resource corruption fails without touching real sources or old releases", (t) => {
  const tmp = fixture(t),
    c = L.catalog(),
    rel = c.release;
  fs.mkdirSync(path.dirname(path.join(tmp, rel)), { recursive: true });
  fs.cpSync(path.join(ROOT, rel), path.join(tmp, rel), {
    recursive: true,
    mode: fs.constants.COPYFILE_FICLONE,
  });
  L.verifyRelease(tmp, c.version);
  fs.appendFileSync(
    path.join(tmp, rel, "components/button-current.css"),
    "/* altered */",
  );
  assert.throws(() => L.verifyRelease(tmp, c.version), /corrupt/);
});
test("HTTP preview serves local home and new versioned resources, denies writes and private paths", async (t) => {
  const server = await require("./local-preview.cjs").startPreview(ROOT, {
    port: 0,
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = "http://127.0.0.1:" + server.address().port,
    c = L.catalog();
  assert.equal((await fetch(base + "/")).status, 200);
  assert.equal((await fetch(base + "/favicon.ico")).status, 200);
  assert.equal(
    (await fetch(base + "/" + c.release + "/components/button-current.css"))
      .status,
    200,
  );
  assert.equal((await fetch(base + "/package.json")).status, 404);
  assert.equal((await fetch(base + "/", { method: "POST" })).status, 405);
});
module.exports = { makePage };

test("stale maintained source rejects new calls; all admitted families share one resource closure", (t) => {
  const tmp = fixture(t),
    data = L.catalog(),
    name = "components/button-current.css",
    file = path.join(tmp, "design-system", name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "design-system", name), file);
  const source = { ...data, inputs: { [name]: data.inputs[name] } };
  L.assertFreshSource(tmp, source);
  fs.appendFileSync(file, "/* changed */");
  assert.throws(() => L.assertFreshSource(tmp, source), /source changed/);
  const uses = Object.values(data.components)
    .filter((c) => c.status === "integrated")
    .map((c) =>
      L.render(
        c.key,
        Object.values(c.variants).find((v) => v.callable).fragment,
      ),
    );
  assert.ok(
    L.finalizePage(
      "<html><head></head><body><main></main></body></html>",
      uses,
      path.join(ROOT, "pages"),
    ).includes("data-fs-library"),
  );
});

test("retired unprefixed calls fail explicitly instead of being silently mapped", () => {
  const result = spawnSync(process.execPath, ["-e", "const B=require('./build.js');B.assemblePage('<div data-component=\"navigation\" data-fragment=\"header\"></div>',B.loadRegistry(),new Map(),'retired-probe.html');"], {cwd: ROOT, encoding: "utf8"});
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown component.*navigation/);
});
