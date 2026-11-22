"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const Slots = require("./local-slot-validation.cjs");
const {stateEvidence}=require("./button-state-evidence.cjs");
const ROOT = path.resolve(__dirname, ".."),
  LIBRARY = "design-system",
  BASE = "fs-components/component-specs/library",
  ACTIVE = BASE + "/catalog.json";
const slash = (p) => p.split(path.sep).join("/"),
  digest = (b) => crypto.createHash("sha256").update(b).digest("hex"),
  read = (f) => JSON.parse(fs.readFileSync(f)),
  hash = (f) => digest(fs.readFileSync(f));
const adapterHash = () => digest(fs.readFileSync(__filename) + fs.readFileSync(path.join(__dirname,"local-slot-validation.cjs")) + fs.readFileSync(path.join(__dirname,"button-state-evidence.cjs")) + fs.readFileSync(path.join(__dirname,"local-form-fields.cjs")) + fs.readFileSync(path.join(__dirname,"local-comment-media.cjs")));
function domAPI(root = ROOT) {
  return require(path.join(root, LIBRARY, "node_modules/jsdom")).JSDOM;
}
function safeFile(root, name) {
  const file = path.resolve(root, name);
  if (
    !file.startsWith(path.resolve(root) + path.sep) ||
    !fs.existsSync(file) ||
    !fs.statSync(file).isFile() ||
    !fs.realpathSync(file).startsWith(fs.realpathSync(root) + path.sep)
  )
    throw Error("Missing or unsafe library resource: " + name);
  return file;
}
function relativeURL(file, from) {
  return slash(path.relative(from, file));
}
function fragmentName(name) {
  const value = name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(value))
    throw Error("Invalid fragment name: " + name);
  return value;
}
function rewrite(html, from, to, root, releaseDir = null) {
  return html.replace(
    /\b(src|href|poster)=(['"])([^'"]+)\2/g,
    (m, key, q, url) => {
      if (/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(url)) return m;
      const clean = url.split(/[?#]/)[0],
        suffix = url.slice(clean.length),
        target = path.resolve(from, decodeURIComponent(clean));
      if (!target.startsWith(path.resolve(root) + path.sep))
        throw Error("Resource escapes source: " + url);
      return (
        key +
        "=" +
        q +
        relativeURL(
          releaseDir
            ? path.join(releaseDir, path.relative(root, target))
            : target,
          to,
        ) +
        suffix +
        q
      );
    },
  );
}
function compile(root = ROOT, { check = false } = {}) {
  const lib = path.join(root, LIBRARY),
    JSDOM = domAPI(root),
    { buildReference } = require(
      path.join(lib, "scripts/compile-component-reference.js"),
    ),
    runtime = require(
      path.join(lib, "scripts/component-runtime-resources.js"),
    );
  const quality = read(path.join(lib, "components/quality/report.json")),
    names = fs
      .readdirSync(path.join(lib, "components/contracts"))
      .filter((n) => n.endsWith(".json"))
      .sort(),
    inputs = {},
    resources = new Set(runtime.runtimeInputs(lib)),
    components = {};
  for (const file of [
    "pages/fonts/bdcom-oem-pc-1009-open-sans-400.woff2",
    "pages/fonts/bdcom-oem-pc-1009-open-sans-600.woff2",
  ])
    resources.add(file);
  for (const file of [
    "components/reference-policy.json",
    "components/local-integration-review.json",
    "components/selection-mvp-policy.json",
    "components/quality/acceptance.json",
    "components/quality/report.json",
  ])
    inputs[file] = hash(safeFile(lib, file));
  const collect = (html, from) => {
    for (const m of html.matchAll(/\b(?:src|poster)=["']([^"']+)["']/g)) {
      const url = m[1];
      if (/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(url)) continue;
      const file = path.resolve(from, decodeURIComponent(url.split(/[?#]/)[0]));
      if (!file.startsWith(lib + path.sep))
        throw Error("Example resource escapes library: " + url);
      resources.add(
        slash(path.relative(lib, safeFile(lib, path.relative(lib, file)))),
      );
    }
  };
  for (const name of names) {
    const id = name.slice(0, -5),
      contract = read(path.join(lib, "components/contracts", name)),
      { variantSource, SPEC_PAGE } = require(path.join(lib, "scripts/variant-source.js")),
      source =
        contract.aiContract?.exampleFile ||
        variantSource(id),
      engineering = quality.components.find((c) => c.id === id)?.ai.acceptance;
    const item = {
      id,
      name: contract.name,
      key: "library-" + id,
      contract: LIBRARY + "/components/contracts/" + name,
      source: LIBRARY + "/" + source,
      preview: SPEC_PAGE(id),
      engineering,
      variants: {},
      declaredVariants: contract.variants.map((v) => v.name),
      variantReviews: read(path.join(lib,"components/local-integration-review.json")).rows.filter(r=>r.component===id),
      decisions: contract.relations?.variantDecisions || [],
      dependencies: contract.relations?.componentDependencies || [],
    };
    components[item.key] = item;
    try {
      const pack = buildReference(lib, id);
      item.runtime = pack.runtime;
      item.relationships = pack.relationships;
      if(contract.aiContract?.evidence?.currentMgReview){
        const file=contract.aiContract.evidence.currentMgReview,review=read(safeFile(lib,file)),snapshot=review.source.file;
        const snapshotCurrent=hash(safeFile(lib,snapshot))===review.source.sha256;
        const rulesCurrent=digest(JSON.stringify(contract.relations.variantDecisions))===review.ruleDigest;
        inputs[file]=hash(safeFile(lib,file));inputs[snapshot]=hash(safeFile(lib,snapshot));
        item.sourceVerification={status:snapshotCurrent&&rulesCurrent?review.status:'stale',source:review.source,scope:review.scope,report:file,unverified:review.unverified,claim:'Rule/structure source verification only; visual approval is independent'};
      }
      if(id==='button' && contract.relations.iconSlots){
        const registryFile='components/icons/mastergo-library/manifest.json',registry=read(path.join(lib,registryFile));
        inputs[registryFile]=hash(safeFile(lib,registryFile));
        for(const [slot,file]of Object.entries(contract.relations.iconSlots.assetBindings)){
          const entry=registry.icons.find(i=>i.file===file);
          if(!entry || hash(safeFile(lib,file))!==entry.sha256)throw Error('Button source icon identity mismatch: '+slot);
          item.relationships.icons.push({file,registry:registryFile,slot,source:'components/contracts/button.json#/relations/iconSlots',usage:'Current finite Button slot; dimensions and paint follow exact registered host states, not arbitrary icon editing.'});
        }
      }
      if(id==='button' && contract.prototypeStandard?.ruleReview){
        const reviewFile=contract.prototypeStandard.ruleReview;
        item.ruleReview=read(safeFile(lib,reviewFile));
        inputs[reviewFile]=hash(safeFile(lib,reviewFile));
        const ruleSource=contract.aiContract.evidence.currentRuleSource;
        item.sourceVerification={stateAndIcons:contract.relations.iconSlots.source,rules:read(safeFile(lib,ruleSource)).source,scope:'Finite rule/atom nodes only; not whole-family or host visual approval'};
        inputs[ruleSource]=hash(safeFile(lib,ruleSource));
      }
      if(id==='button'){const audit=stateEvidence(lib,contract);item.sourceVerification.currentStates=audit.info;for(const file of audit.files)inputs[file]=hash(safeFile(lib,file));}
      if(id==='text-button' && contract.prototypeStandard?.source){
        const sourceFile=contract.prototypeStandard.source;
        const audit=stateEvidence(lib,contract,{reportPath:'components/sources/text-button/open-state-audit-20261114.json',schema:'fs-text-button-open-state-audit/1.0.0',expectedKeys:contract.aiContract.supported.flatMap(v=>['Default','Hover'].map(s=>[v,contract.aiContract.variants[v].defaultSize,s].join('/')))});
        item.sourceVerification={rules:read(safeFile(lib,sourceFile)).source,currentStates:audit.info,scope:contract.prototypeStandard.scope};
        for(const file of [sourceFile,...audit.files])inputs[file]=hash(safeFile(lib,file));
      }
      if(id==='icon-button' && contract.prototypeStandard?.source){
        const sourceFile=contract.prototypeStandard.source;
        const audit=stateEvidence(lib,contract,{reportPath:'components/sources/icon-button/open-state-audit-20261114.json',schema:'fs-icon-button-open-state-audit/1.0.0',expectedKeys:contract.aiContract.supported.flatMap(v=>contract.aiContract.variants[v].bindings.icon.values.flatMap(icon=>['Default','Hover'].map(s=>[v,path.basename(icon),s].join('/')))),claim:'Current registered icons only; finite MG declarations plus two explicitly local-spec filter Hover states; original SVG contours retained.'});
        item.sourceVerification={rules:read(safeFile(lib,sourceFile)).source,currentStates:audit.info,scope:contract.prototypeStandard.scope};
        for(const file of [sourceFile,...audit.files])inputs[file]=hash(safeFile(lib,file));
      }
      item.selection = pack.selection;
      for (const [file, value] of Object.entries(pack.freshness.fingerprints))
        inputs[file] = value;
      for (const example of pack.examples) {
        const fragment = fragmentName(example.name);
        if (item.variants[fragment])
          throw Error("Fragment collision: " + id + "/" + fragment);
        const current = engineering?.status === "current",
          live = example.publication?.newPages === true && current;
        const d = new JSDOM(example.exampleHtml),
          el = d.window.document.body.firstElementChild;
        if (!el || d.window.document.body.children.length !== 1)
          throw Error("Example must have one root: " + id + "/" + example.name);
        if (
          el.querySelector("script") ||
          [el, ...el.querySelectorAll("*")].some((n) =>
            [...n.attributes].some((a) => /^on/i.test(a.name)),
          )
        )
          throw Error(
            "Example contains inline executable behavior: " +
              id +
              "/" +
              example.name,
          );
        collect(example.exampleHtml, path.dirname(path.join(lib, source)));
        d.window.close();
        item.variants[fragment] = {
          ...example,
          ...(['tab','collapse','card','icon-card','carousel'].includes(id)?{publication:{...example.publication,baselineContractPolicy:example.publication.contractPolicy,contractPolicy:contract.aiContract.selectionPolicy}}:{}),
          fragment,
          callable: live,
          status: !example.publication?.newPages
            ? "withheld"
            : current
              ? "integrated"
              : "engineering-pending",
          reason: !example.publication?.newPages
            ? example.publication?.reason
            : current
              ? "Actual canonical Preview, preserved published scope and current source engineering record."
              : engineering?.reason || "Source engineering review not current",
          sourceVariant: example.name,
          contractCall: contract.aiContract.variants[example.name],
          runtimeParameters: contract.aiContract.variants[example.name].localRuntime?.parameters,
          localCallScope: id==='text-button'?{size:example.defaultSize,states:['Default','Hover'],editableFields:contract.aiContract.variants[example.name].allowedEdits,referenceOnlySizes:(example.sizeOptions||[]).filter(x=>x.name!==example.defaultSize).map(x=>x.name)}:undefined,
          ...(id==='icon-button'?{localCallScope:{container:contract.variants.find(v=>v.name===example.name).buttonSize,iconSize:contract.variants.find(v=>v.name===example.name).iconSize,registeredIcons:contract.aiContract.variants[example.name].bindings.icon.values,editableFields:contract.aiContract.variants[example.name].allowedEdits,states:['Default','Hover'],stateBoundary:example.name.startsWith('bordered')?'Filter pressed state is host-controlled; Hover retains existing local specification, no independent MG Hover identity':'Current registered role and size only'}}:{}),
          runtime: example.runtime,
          requiresGroup: contract.aiContract.variants[example.name].requiresGroup,
          review: item.variantReviews.find(r=>r.name===example.name),
        };
      }
      item.status = Object.values(item.variants).some((v) => v.callable)
        ? "integrated"
        : "specification-only";
    } catch (error) {
      item.status = "gap";
      item.reason = error.message;
      for (const v of Object.values(item.variants)) {
        v.callable = false;
        v.status = "gap";
        v.reason = error.message;
      }
    }
  }
  const files = {};
  for (const name of [...resources].sort())
    files[name] = hash(safeFile(lib, name));
  // Retired legacy previews are not publication inputs. Keep the catalog field for readers.
  const preexistingGaps = [];
  const payload = {
    schemaVersion: "fs-local-library/1",
    source: LIBRARY,
    adapterSha256: adapterHash(),
    inputs,
    files,
    components,
    preexistingGaps,
  };
  const version = digest(JSON.stringify(payload)),
    rel = BASE + "/releases/" + version,
    release = path.join(root, rel);
  const registry = { components: {} };
  const catalog = {
    ...payload,
    version,
    release: rel,
    summary: {
      components: names.length,
      integrated: Object.values(components).filter(
        (c) => c.status === "integrated",
      ).length,
      specificationOnly: Object.values(components).filter(
        (c) => c.status === "specification-only",
      ).length,
      gaps: Object.values(components).filter((c) => c.status === "gap").length,
      callableFragments: Object.values(components)
        .flatMap((c) => Object.values(c.variants))
        .filter((v) => v.callable).length,
    },
  };
  const output = new Map();
  for (const [key, c] of Object.entries(components)) {
    const live = Object.values(c.variants).filter((v) => v.callable);
    const file = rel + "/fragments/" + c.id + ".html";
    let html =
      "<!-- AUTO-GENERATED: local adapters; edit the source Preview/contract, then component:sync. -->\n";
    for (const v of live) {
      const d = new JSDOM(v.exampleHtml),
        el = d.window.document.body.firstElementChild;
      el.setAttribute("data-fragment", v.fragment);
      el.setAttribute("data-library-component", key);
      el.setAttribute("data-library-fragment", v.fragment);
      el.setAttribute("data-library-release", version);
      html +=
        rewrite(
          el.outerHTML,
          path.dirname(path.join(lib, (c.source || c.preview).slice(LIBRARY.length + 1))),
          path.dirname(path.join(root, file)),
          lib,
          release,
        ) + "\n";
      d.window.close();
    }
    output.set(file, html);
    registry.components[key] = {
      path: slash(
        path.relative(path.join(root, "fs-components"), path.join(root, file)),
      ),
      fragments: live.map((v) => v.fragment),
      source: "migrated-library",
      catalog: slash(
        path.relative(
          path.join(root, "fs-components"),
          path.join(root, rel, "catalog.json"),
        ),
      ),
      status: c.status,
    };
  }
  output.set(
    rel + "/local-fonts.css",
    "@font-face{font-family:'Open Sans';font-style:normal;font-weight:400;font-display:swap;src:url('pages/fonts/bdcom-oem-pc-1009-open-sans-400.woff2') format('woff2')}\n@font-face{font-family:'Open Sans';font-style:normal;font-weight:600;font-display:swap;src:url('pages/fonts/bdcom-oem-pc-1009-open-sans-600.woff2') format('woff2')}\nhtml,body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\n",
  );
  const selection = {
    version,
    source: LIBRARY,
    priority:
      "Select callable library-* variants from the current catalog; retired unprefixed names are not registered",
    components: Object.values(components).map((c) => ({
      key: c.key,
      status: c.status,
      reason: c.reason,
      contract: c.contract,
      preview: c.preview,
      engineering: c.engineering,
      ruleReview: c.ruleReview,
      sourceVerification: c.sourceVerification,
      decisions: c.decisions,
      variantReviews: c.variantReviews,
      dependencies: c.dependencies,
      variants: Object.values(c.variants).map((v) => ({
        fragment: v.fragment,
        sourceVariant: v.sourceVariant,
        callable: v.callable,
        status: v.status,
        reason: v.reason,
        purpose: v.purpose,
        whenToUse: v.whenToUse,
        whenNotToUse: v.whenNotToUse,
        defaultSize: v.defaultSize,
        sizeOptions: v.sizeOptions,
        allowedEdits: v.allowedEdits,
        requiresGroup: v.requiresGroup,
        review: v.review,
        runtimeParameters: v.runtimeParameters,
        localCallScope: v.localCallScope,
        adapterScope:
          "Exact canonical example; alternative sizes require real-source extraction, not arbitrary class replacement",
      })),
    })),
  };
  output.set(
    BASE + "/selection.json",
    JSON.stringify(selection, null, 2) + "\n",
  );
  output.set(rel + "/catalog.json", JSON.stringify(catalog, null, 2) + "\n");
  output.set(ACTIVE, JSON.stringify(catalog, null, 2) + "\n");
  output.set(
    "fs-components/component-registry.json",
    JSON.stringify(registry, null, 2) + "\n",
  );
  const manifest = { version, files: {} };
  for (const [name, value] of output)
    if (name.startsWith(rel + "/"))
      manifest.files[name.slice(rel.length + 1)] = digest(Buffer.from(value));
  for (const [name, value] of Object.entries(files))
    manifest.files[name] = value;
  output.set(rel + "/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  if (check) {
    for (const [name, value] of output)
      if (
        !fs.existsSync(path.join(root, name)) ||
        fs.readFileSync(path.join(root, name), "utf8") !== value
      )
        throw Error("Local library export is stale: " + name);
    verifyRelease(root, version);
    return catalog;
  }
  for (const name of Object.keys(files)) {
    const target = path.join(release, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (fs.existsSync(target)) {
      if (hash(target) !== files[name])
        throw Error("Immutable release was altered: " + name);
    } else fs.copyFileSync(path.join(lib, name), target);
  }
  for (const [name, value] of output) {
    const target = path.join(root, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (
      name.startsWith(rel + "/") &&
      fs.existsSync(target) &&
      fs.readFileSync(target, "utf8") !== value
    )
      throw Error("Immutable export was altered: " + name);
    const temp = target + ".tmp";
    fs.writeFileSync(temp, value);
    fs.renameSync(temp, target);
  }
  return catalog;
}
const verified = new Map();
function catalog(root = ROOT, version = null) {
  return read(
    path.join(
      root,
      version ? BASE + "/releases/" + version + "/catalog.json" : ACTIVE,
    ),
  );
}
function verifyRelease(root = ROOT, version) {
  if (!/^[a-f0-9]{64}$/.test(version || ""))
    throw Error("Invalid library release");
  const base = path.join(root, BASE, "releases", version),
    manifest = read(
      safeFile(root, path.relative(root, path.join(base, "manifest.json"))),
    );
  if (manifest.version !== version)
    throw Error("Library release identity mismatch");
  for (const [file, expected] of Object.entries(manifest.files))
    if (hash(safeFile(base, file)) !== expected)
      throw Error("Library release resource corrupt: " + file);
  return manifest;
}
let sequence = 0;
function getUse(root, name, fragment, version = null) {
  const data = catalog(root, version),
    c = data.components[name],
    v = c?.variants[fragment];
  if (!c) throw Error("Unknown library component: " + name);
  if (!v) throw Error("Unknown library fragment: " + name + "/" + fragment);
  if (!v.callable)
    throw Error(
      "Library fragment unavailable: " +
        name +
        "/" +
        fragment +
        "; " +
        v.reason,
    );
  return { data, c, v };
}
function targets(el, selector) {
  return selector === "root" || selector === ":scope"
    ? [el]
    : [...el.querySelectorAll(selector)];
}
function sanitizeStructure(node, slot) {
  if (
    node.querySelector("script,style,iframe,object,embed") ||
    [node, ...node.querySelectorAll("*")].some((n) =>
      [...n.attributes].some((a) => /^on/i.test(a.name) || a.name === "style"),
    )
  )
    throw Error("Unsafe structured slot");
  for (const selector of slot.preserve || [])
    if (!node.querySelector(selector))
      throw Error("Structured slot missing " + selector);
}
function applyLibraryProps(el, v, props, root, data, targetDir) {
  const allowed = new Set(v.allowedEdits || []);
  for (const [field, value] of Object.entries(props || {})) {
    if (!allowed.has(field)) throw Error("Property not editable: " + field);
    const slot = v.slots?.[field],
      binding = v.bindings?.[field];
    if (slot) {
      const nodes = targets(el, slot.selector);
      if (nodes.length !== 1) throw Error("Ambiguous slot: " + field);
      if (slot.mode === "text") {
        Slots.text(nodes[0],slot,value,field);
      } else if (slot.mode === "structured-content") {
        if (nodes[0].tagName === "IMG") {
          if (
            !value ||
            typeof value !== "object" ||
            Object.keys(value).some((k) => !["src", "alt"].includes(k)) ||
            typeof value.src !== "string" ||
            !value.src ||
            typeof value.alt !== "string" ||
            !value.alt.trim() ||
            /^(?:data|javascript|vbscript):/i.test(value.src.trim())
          )
            throw Error(
              "Image attribute slot requires only safe src and descriptive alt",
            );
          nodes[0].setAttribute("src", value.src);
          nodes[0].setAttribute("alt", value.alt);
          continue;
        }
        if (typeof value !== "string")
          throw Error("Structured slot requires native HTML: " + field);
        const before = nodes[0].cloneNode(true);
        nodes[0].innerHTML = value;
        Slots.structured(nodes[0],before,slot,field,el,v,{registeredIconURLs:(slot.registeredIcons?.values||[]).map(file=>relativeURL(path.join(root,data.release,file),targetDir))});
      } else throw Error("Unsupported slot mode: " + field);
      continue;
    }
    if (!binding) throw Error("Binding unavailable: " + field);
    if(binding.mode==='comment-media-list'){
      if(el.dataset.libraryComponent!=='library-comment'||v.name!=='customer-gallery')throw Error('Comment media binding outside actual gallery');
      require('./local-comment-media.cjs').apply(el,value,binding);continue;
    }
    const nodes = targets(el, binding.target || "root");
    if (nodes.length !== 1) throw Error("Ambiguous binding: " + field);
    const node = nodes[0];
    const validated = Slots.attribute(binding,value,field);
    if (binding.sizes && !binding.sizes.includes(v.defaultSize))
      throw Error("Binding is unavailable at the canonical size: " + field);
    if(binding.mode==='linked-identity'){
      if(typeof value!=='string'||!/^[A-Za-z][A-Za-z0-9_-]*$/.test(value)||[el,...el.querySelectorAll('[id]')].some(n=>n!==node&&n.id===value))throw Error('Linked identity must be a unique safe DOM id');
      const previous=node.id;node.id=value;for(const reference of binding.references){const linked=targets(el,reference.selector);if(linked.length!==1||linked[0].getAttribute(reference.attribute)!==previous)throw Error('Linked identity reference mismatch');linked[0].setAttribute(reference.attribute,value);}
    } else if (binding.mode === "source-absence") {
      if (!value || typeof value !== "object" || Object.keys(value).some(k=>!["reference","objectId","slots"].includes(k)) || !Array.isArray(value.slots) || !value.slots.length || new Set(value.slots).size!==value.slots.length) throw Error("Source absence requires reference, objectId and unique optional slots");
      if (typeof value.reference!=="string" || !value.reference.startsWith("reference-inputs/") || value.reference.split("/").includes("..")) throw Error("Source absence must cite retained original input");
      const reference=read(safeFile(root,value.reference));
      const object=(reference.modules||[]).flatMap(m=>m.items||[]).find(o=>o.objectId===value.objectId);
      if(reference.kind!=="original-page-content-reference" || !object)throw Error("Unknown source content object");
      for(const region of value.slots){if(!Object.hasOwn(binding.regions,region)||Object.hasOwn(object,region))throw Error("Required/present content cannot be omitted");const regionNode=el.querySelector(binding.regions[region]);if(!regionNode)throw Error("Optional region missing");regionNode.remove();}
    } else if (binding.mode === "event-handler") {
      if (typeof value !== "string" || !/^[a-zA-Z][\w-]*$/.test(value))
        throw Error("Event callbacks are declarative hook names, not code");
      node.setAttribute("data-library-event-" + field.toLowerCase(), value);
    } else if (binding.mode === "navigation-target") {
      if (
        typeof value !== "string" ||
        !value.trim() ||
        /[\u0000-\u0020]/.test(value) ||
        value.startsWith("//") ||
        value.startsWith("\\")
      )
        throw Error("Unsafe navigation target");
      const protocol = value
        .match(/^([a-z][a-z0-9+.-]*:)/i)?.[1]
        ?.toLowerCase();
      if (protocol ? !binding.protocols?.includes(protocol) : !binding.relative)
        throw Error("Navigation protocol outside contract");
      node.setAttribute(binding.attribute, value);
      node.removeAttribute("aria-disabled");
      node.removeAttribute("role");
    } else if (binding.mode === "registered-icon") {
      const isLocalSvg =
        typeof value === "string" &&
        /^assets\/[a-z0-9_-]+\/[a-z0-9_.-]+\.svg$/i.test(value) &&
        fs.existsSync(path.join(root, "pages", value));
      if (!binding.values?.includes(value) && !isLocalSvg)
        throw Error("Icon is outside the registered binding");
      node.setAttribute(
        binding.attribute,
        isLocalSvg
          ? value
          : relativeURL(path.join(root, data.release, value), targetDir),
      );
    } else if (
      binding.mode === "native-attribute" ||
      binding.mode === "accessible-label"
    ) {
      if (binding.nonEmpty && (typeof value !== "string" || !value.trim()))
        throw Error("Accessible label must be nonempty");
      if (binding.values && !binding.values.includes(value))
        throw Error("Attribute value not allowed: " + field);
      if (typeof value === "boolean") {
        if (value) node.setAttribute(binding.attribute, "");
        else node.removeAttribute(binding.attribute);
      } else node.setAttribute(binding.attribute, String(validated));
      if (field === 'placeholder' && binding.attribute === 'data-placeholder' && node.matches('span.ds-select__value') && !el.querySelector('[role="option"][aria-selected="true"]')) node.textContent = validated;
    } else throw Error("Binding not supported by local adapter: " + field);
  }
}
function assertFreshSource(root, data) {
  if (data.adapterSha256 !== adapterHash())
    throw Error("Local component adapter changed; run component:export");
  for (const [file, expected] of Object.entries(data.inputs))
    if (hash(safeFile(path.join(root, LIBRARY), file)) !== expected)
      throw Error(
        "Component source changed; coordinate HTML/contract then run component:sync: " +
          file,
      );
}
function buttonProfile(el, v, props, data, targetDir, root) {
  const p=v.contractCall.localRuntime;
  for(const key of Object.keys(props))if(!v.allowedEdits.includes(key))throw Error('Property not editable: '+key);
  for(const key of ['disabled','loading','showLeftIcon','showRightArrow','iconHidden'])if(Object.hasOwn(props,key)&&typeof props[key]!=='boolean')throw Error('Button boolean required: '+key);
  if(props.disabled&&props.loading)throw Error('Button disabled and loading are mutually exclusive');
  const state=props.loading?'Processing':props.disabled?'Disabled':'Default',row=p.states.find(r=>r.size===v.defaultSize&&r.state===state);
  if(!row)throw Error('Unregistered Button state/size');
  const requested=props.icon==='download'?p.assets.download:props.icon;
  const legacy=p.legacyIconBinding;
  if(requested&&requested!==p.assets.download&&!(legacy?.sizes.includes(v.defaultSize)&&legacy.values.includes(requested)))throw Error('Button icon outside registered size/palette');
  if(props.showLeftIcon!==undefined&&props.iconHidden!==undefined&&props.showLeftIcon===props.iconHidden)throw Error('Conflicting Button visibility flags');
  const left=props.showLeftIcon??(props.iconHidden!==undefined?!props.iconHidden:Boolean(requested)),right=props.showRightArrow??false;
  const label=el.querySelector('.ds-btn__text');
  el.setAttribute('data-button-current','mg-20261112');
  el.classList.toggle('ds-btn--disabled',Boolean(props.disabled));el.classList.toggle('ds-btn--processing',Boolean(props.loading));
  el.disabled=Boolean(props.disabled||props.loading);
  if(props.loading){el.setAttribute('aria-busy','true');el.setAttribute('aria-label',label.textContent);}else{el.removeAttribute('aria-busy');el.removeAttribute('aria-label');}
  const doc=el.ownerDocument,mask=(cls,role)=>{const n=doc.createElement('span');n.className=cls;n.setAttribute('data-button-icon',role);n.setAttribute('aria-hidden','true');return n;};
  const loading=mask('ds-btn__icon-loading','loading');loading.hidden=!props.loading;
  const leading=doc.createElement('span');leading.className='ds-btn__leading';leading.hidden=!left||Boolean(props.loading);
  if(requested&&requested!==p.assets.download){const img=doc.createElement('img');img.className='ds-btn__legacy-leading-icon';img.src=relativeURL(safeFile(path.join(root,data.release),requested),targetDir);img.alt='';img.setAttribute('aria-hidden','true');leading.append(img);}else leading.append(mask('ds-btn__leading-icon','download'));
  const trailing=mask('ds-btn__trailing-icon','right');trailing.hidden=!right||Boolean(props.loading);
  el.replaceChildren(loading,leading,label,trailing);
}

function render(name, fragment, props = {}, options = {}) {
  const root = options.root || ROOT,
    { data, c, v } = getUse(root, name, fragment, options.version),
    file = path.join(root, data.release, "fragments", c.id + ".html"),
    JSDOM = domAPI(root);
  if (!options.version) assertFreshSource(root, data);
  const targetDir = options.targetDir || path.join(root, "pages");
  const profile=v.contractCall?.localRuntime;
  const tabSized=c.id==='tab' && v.allowedEdits.includes('size') && v.bindings?.size?.mode==='source-example-size' && Array.isArray(v.sizeOptions) && v.sizeOptions.length>0;
  let effective=v,sourceHTML=fs.readFileSync(file,"utf8"),from=path.dirname(file);
  if(profile){
    const size=props.size??v.defaultSize,selected=v.sizeOptions.find(s=>s.name===size);
    if(!selected)throw Error("Unregistered Button size: "+size);
    sourceHTML=selected.exampleHtml;from=fs.existsSync(path.join(root,data.release,"components/variants"))?path.join(root,data.release,"components/variants"):path.join(root,data.release,"components/preview");
    effective={...v,defaultSize:size,bindings:selected.bindings};
  }
  if(tabSized){
    const size=props.size??v.defaultSize,selected=v.sizeOptions.find(s=>s.name===size);
    if(!selected)throw Error('Unregistered Tab size: '+size);
    sourceHTML=selected.exampleHtml;from=fs.existsSync(path.join(root,data.release,'components/variants'))?path.join(root,data.release,'components/variants'):path.join(root,data.release,'components/preview');
  }
  const d = new JSDOM(
      rewrite(
        sourceHTML,
        from,
        targetDir,
        root,
      ),
    ),
    el = [...d.window.document.body.children].find(
      (n) => profile || tabSized || n.dataset.fragment === fragment,
    );
  if (!el) throw Error("Canonical fragment missing");
  if(profile){
    const parameters=Object.fromEntries(Object.entries(props).filter(([k])=>!['size','disabled','loading','showLeftIcon','showRightArrow','icon','iconHidden'].includes(k)));
    applyLibraryProps(el,effective,parameters,root,data,targetDir);
    buttonProfile(el,effective,props,data,targetDir,root);
    el.setAttribute('data-fragment',fragment);el.setAttribute('data-library-component',name);el.setAttribute('data-library-fragment',fragment);el.setAttribute('data-library-release',data.version);
  } else if(tabSized){
    const parameters=Object.fromEntries(Object.entries(props).filter(([k])=>k!=='size'));
    applyLibraryProps(el,v,parameters,root,data,targetDir);
    el.setAttribute('data-fragment',fragment);el.setAttribute('data-library-component',name);el.setAttribute('data-library-fragment',fragment);el.setAttribute('data-library-release',data.version);
  } else if(c.id==='form' && props.sourceFields!==undefined){
    if(fragment!=='gray' || props.fieldContent!==undefined || props.title!==undefined || props.description!==undefined)throw Error('Source Form composition cannot mix arbitrary fieldContent/heading overrides');
    const F=require('./local-form-fields.cjs'), fields=F.readFields(root,props.sourceFields),parameters={...props};delete parameters.sourceFields;
    applyLibraryProps(el,v,parameters,root,data,targetDir);
    F.assemble(el,fields,{render,root,data,targetDir,variant:v});
  } else if(c.id==='carousel' && fragment==='external-cards'){
    const parameters={...props};delete parameters.items;
    applyLibraryProps(el,v,parameters,root,data,targetDir);
    const binding=v.bindings.items,items=props.items??v.contractCall.defaultItems;
    if(!Array.isArray(items)||items.length<binding.minItems||items.length>binding.maxItems)throw Error('Carousel items must contain1..24 genuine child calls');
    const track=el.querySelector(binding.target);let family;
    const children=items.map(item=>{
      if(!item||typeof item!=='object'||Array.isArray(item)||Object.keys(item).some(k=>!['component','fragment','props'].includes(k))||!binding.allowedComponents[item.component]?.includes(item.fragment)||item.props!==undefined&&(!item.props||typeof item.props!=='object'||Array.isArray(item.props)))throw Error('Carousel child outside registered component/fragment contract');
      const identity=item.component+'/'+item.fragment;if(family&&identity!==family)throw Error('Carousel items must use one homogeneous child variant');family=identity;
      const child=render(item.component,item.fragment,item.props||{},{root,version:data.version,targetDir});const holder=el.ownerDocument.createElement('div');holder.className='ds-carousel-external__item';holder.innerHTML=child.html;return holder;
    });track.replaceChildren(...children);
  } else applyLibraryProps(el, v, props, root, data, targetDir);
  Slots.model(el);
  el.setAttribute("data-library-props", JSON.stringify(props));
  const prefix = "library-instance-" + ++sequence,
    ids = new Map();
  for (const n of [el, ...el.querySelectorAll("[id]")])
    if (n.id && (n===el || !n.closest("[data-library-component]") || n.closest("[data-library-component]")===el)) {
      ids.set(n.id, prefix + "-" + n.id);
      n.id = ids.get(n.id);
    }
  for (const n of [el, ...el.querySelectorAll("*")])
    for (const a of [
      "for",
      "aria-controls",
      "aria-labelledby",
      "aria-describedby",
    ])
      if (n.hasAttribute(a))
        n.setAttribute(
          a,
          n
            .getAttribute(a)
            .split(" ")
            .map((x) => ids.get(x) || x)
            .join(" "),
        );
  for (const n of [el, ...el.querySelectorAll("[href]")]) {
    const h = n.getAttribute("href");
    if (h?.startsWith("#") && ids.has(h.slice(1)))
      n.setAttribute("href", "#" + ids.get(h.slice(1)));
  }
  const html = el.outerHTML;
  d.window.close();
  const runtime=v.runtime||c.runtime;
  return {
    html,
    version: data.version,
    component: name,
    fragment,
    styles: runtime.styles.map((f) => data.release + "/" + f),
    scripts: runtime.scripts.map((f) => data.release + "/" + f),
    fontStyle: data.release + "/local-fonts.css",
    dependencies: c.dependencies,
    entry: v,
  };
}
// Only independently scoped, reviewed styles may commute. Host/atom overrides
// and global sheets retain every declared ordering edge and fail on cycles.
function commutativeAtoms(a, b, root) {
  const scopes = {"button-current.css":".ds-btn", "text-button-current.css":".ds-text-btn", "checkbox-current.css":".ds-checkbox", "icon-button-current.css":".ds-icon-btn", "dialog-current.css":".ds-dialog__close-position"};
  if (!scopes[path.basename(a)] || !scopes[path.basename(b)] || a === b) return false;
  for (const f of [a, b]) {
    const abs = path.isAbsolute(f) ? f : path.join(root, f);
    const css = fs.readFileSync(abs, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const prefix = scopes[path.basename(f)];
    for (const m of css.matchAll(/([^{}]+)\{[^{}]*\}/g))
      for (const selector of m[1].trim().split(","))
        if (!selector.trim().startsWith(prefix) || /^[a-zA-Z0-9]/.test(selector.trim().slice(prefix.length)))
          throw Error("Atom stylesheet scope changed; resource order requires review: " + f);
    if (/@/.test(css)) throw Error("Atom CSS contains global effects: " + f);
  }
  return true;
}
function orderedResources(groups, root = ROOT) {
  const nodes = new Set(),
    edges = new Map(),
    degree = new Map();
  for (const list of groups) {
    for (const name of list) {
      nodes.add(name);
      if (!degree.has(name)) degree.set(name, 0);
    }
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1],
        b = list[i];
      if (a === b || commutativeAtoms(a, b, root)) continue;
      if (!edges.has(a)) edges.set(a, new Set());
      if (!edges.get(a).has(b)) {
        edges.get(a).add(b);
        degree.set(b, degree.get(b) + 1);
      }
    }
  }
  const out = [],
    queue = [...nodes].filter((n) => degree.get(n) === 0);
  while (queue.length) {
    const a = queue.shift();
    out.push(a);
    for (const b of edges.get(a) || []) {
      degree.set(b, degree.get(b) - 1);
      if (degree.get(b) === 0) queue.push(b);
    }
  }
  if (out.length !== nodes.size)
    throw Error("Conflicting library resource order");
  return out;
}
function finalizePage(html, uses, targetDir, root = ROOT) {
  if (!uses.length) return html;
  const versions = new Set(uses.map((x) => x.version));
  if (versions.size !== 1)
    throw Error("Cannot mix library releases in one page");
  if (
    /(?:href|src)=["'][^"']*fs-components\/component-specs\/(?!library\/)/.test(
      html,
    )
  )
    throw Error("Cannot mix legacy resources into a new-library page");
  const version = uses[0].version;
  const links = orderedResources(
    uses.map((u) => u.styles),
    root,
  )
    .concat(uses[0].fontStyle)
    .map(
      (f) =>
        '<link rel="stylesheet" data-library-resource="' +
        version +
        '" href="' +
        relativeURL(path.join(root, f), targetDir) +
        '">',
    )
    .join("\n");
  const scripts = orderedResources(
    uses.map((u) => u.scripts),
    root,
  )
    .map(
      (f) =>
        '<script data-library-resource="' +
        version +
        '" src="' +
        relativeURL(path.join(root, f), targetDir) +
        '"></script>',
    )
    .join("\n");
  if (
    !/<html\b/i.test(html) ||
    !/<\/head>/i.test(html) ||
    !/<\/body>/i.test(html)
  )
    throw Error("Library page requires a full HTML document");
  return html
    .replace(/<html\b/i, '<html data-fs-library="' + version + '"')
    .replace(/<\/head>/i, links + "\n</head>")
    .replace(/<\/body>/i, scripts + "\n</body>");
}
module.exports = {
  ROOT,
  BASE,
  ACTIVE,
  compile,
  catalog,
  verifyRelease,
  getUse,
  render,
  finalizePage,
  orderedResources,
  fragmentName,
  domAPI,
  rewrite,
  safeFile,
  hash,
  assertFreshSource,
};
if (require.main === module) {
  try {
    const c = compile(ROOT, { check: process.argv.includes("--check") });
    console.log(JSON.stringify(c.summary));
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
