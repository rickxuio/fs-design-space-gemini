"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  { spawnSync } = require("node:child_process"),
  L = require("./local-component-library.cjs");
const source = path.join(L.ROOT, "design-system"),
  native = require(path.join(source, "scripts/sync-component-reference.js"));
function runOptionalScript(root, relScript) {
  const scriptPath = path.join(root, relScript);
  if (!fs.existsSync(scriptPath)) return;
  const res = spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    stdio: "inherit",
  });
  if (res.status !== 0) {
    throw Error(`Post-sync script failed (${res.status}): ${relScript}`);
  }
}
function sync({ root = L.ROOT } = {}) {
  const source = path.join(root, "design-system");
  const result = spawnSync(
    process.execPath,
    ["scripts/sync-component-reference.js"],
    { cwd: source, stdio: "inherit" },
  );
  if (result.status !== 0)
    throw Error(
      "Source maintenance failed; local export was not advanced. Existing page versions remain intact.",
    );
  const c = L.compile(root);
  require(path.join(root,"scripts/build-component-docs.cjs")).build({root});
  runOptionalScript(root, "scripts/export-design-core.cjs");
  runOptionalScript(root, "scripts/build-design-portal.cjs");
  console.log(
    "Local registry, variant selection, dependencies and versioned resources synchronized:",
    c.version,
    c.summary,
  );
  return c;
}
function impact(name) {
  const c = L.catalog(),
    key = name.startsWith("library-") ? name : "library-" + name,
    child = c.components[key];
  if (!child) throw Error("Unknown component " + name);
  return {
    component: key,
    dependencies: child.dependencies,
    relationships: child.relationships,
    parents: (child.relationships.parents || []).map(
      (parent) => "library-" + parent.id,
    ),
  };
}
if (require.main === module) {
  try {
    if (process.argv.includes("--impact")) {
      console.log(
        JSON.stringify(
          impact(
            process.argv[process.argv.indexOf("--impact") + 1] || "button",
          ),
          null,
          2,
        ),
      );
    } else {
      sync();
      if (process.argv.includes("--watch")) {
        let previous = native.authoritativeFingerprint(source),
          busy = false;
        console.log(
          "Watching component source; coordinate HTML/contract meaning before saving. No page workflow is run.",
        );
        setInterval(() => {
          if (busy) return;
          try {
            const current = native.authoritativeFingerprint(source);
            if (current === previous) return;
            busy = true;
            previous = current;
            sync();
            previous = native.authoritativeFingerprint(source);
          } catch (e) {
            console.error(e.message);
          } finally {
            busy = false;
          }
        }, 1000);
      }
    }
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
module.exports = { sync, impact };
