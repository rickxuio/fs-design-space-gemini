"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os"),
  assert = require("node:assert/strict"),
  { spawnSync } = require("node:child_process"),
  L = require("./local-component-library.cjs");
const ROOT = L.ROOT,
  out = path.join(ROOT, "maintenance/local-component-regression"),
  temp = fs.mkdtempSync(path.join(os.tmpdir(), "fs-local-sync-")),
  lib = path.join(temp, "design-system"),
  read = (f) => JSON.parse(fs.readFileSync(f));
const report = {
  startedAt: new Date().toISOString(),
  fixtureOnly: true,
  liveSourcesModified: false,
  steps: [],
};
function run(file, args = []) {
  const start = Date.now(),
    r = spawnSync(process.execPath, [file, ...args], {
      cwd: lib,
      encoding: "utf8",
      timeout: 120000,
      maxBuffer: 25 * 1024 * 1024,
      env: Object.fromEntries(
        Object.entries(process.env).filter(([k]) => k !== "NODE_TEST_CONTEXT"),
      ),
    });
  report.steps.push({
    file,
    args,
    exitCode: r.status,
    durationMs: Date.now() - start,
  });
  fs.appendFileSync(
    path.join(out, "isolated-sync.log"),
    file + " " + args.join(" ") + "\n" + r.stdout + r.stderr + "\n",
  );
  assert.equal(r.status, 0, r.stdout + r.stderr);
}
(async () => {
  try {
    fs.writeFileSync(path.join(out, "isolated-sync.log"), "");
    fs.cpSync(path.join(ROOT, "design-system"), lib, {
      recursive: true,
      mode: fs.constants.COPYFILE_FICLONE,
      filter: (file) =>
        ![
          "node_modules",
          ".DS_Store",
          "__pycache__",
          "page-reviews",
          "page-component-releases",
        ].includes(path.basename(file)),
    });
    fs.symlinkSync(
      path.join(ROOT, "design-system/node_modules"),
      path.join(lib, "node_modules"),
      "dir",
    );
    fs.mkdirSync(path.join(temp, "fs-components/component-specs"), {
      recursive: true,
    });
    // The existing publisher must bootstrap its registry without legacy files or fixtures.
    // Exercise the actual root maintenance entry and the real view builder in this isolated copy.
    fs.cpSync(path.join(ROOT,'scripts'),path.join(temp,'scripts'),{recursive:true});
    for (const file of ['build.js','README.md','AGENTS.md']) fs.copyFileSync(path.join(ROOT,file),path.join(temp,file));
    fs.cpSync(path.join(ROOT,'design-spec'),path.join(temp,'design-spec'),{recursive:true});
    const viewDir=path.join(temp,'maintenance/button-prototype-20261113');fs.mkdirSync(viewDir,{recursive:true});
    fs.copyFileSync(path.join(ROOT,'maintenance/button-prototype-20261113/build-preview.cjs'),path.join(viewDir,'build-preview.cjs'));
    const textViewDir=path.join(temp,'maintenance/text-button-prototype-20261114');fs.mkdirSync(textViewDir,{recursive:true});fs.copyFileSync(path.join(ROOT,'maintenance/text-button-prototype-20261114/build-preview.cjs'),path.join(textViewDir,'build-preview.cjs'));
    const iconViewDir=path.join(temp,'maintenance/icon-button-prototype-20261114');fs.mkdirSync(iconViewDir,{recursive:true});fs.copyFileSync(path.join(ROOT,'maintenance/icon-button-prototype-20261114/build-preview.cjs'),path.join(iconViewDir,'build-preview.cjs'));
    const initial = L.compile(temp),
      p = path.join(lib, "components/contracts/button.json"),
      preview = path.join(lib, "components/variants/button.html"),
      original = read(p),
      coordinated = structuredClone(original),
      row = coordinated.relations.variantDecisions.find(
        (d) => d.type === "黑色描边",
      ),
      old = row.selectionCases[0].result,
      marker = "LOCAL_MAINTENANCE_SYNC_PROBE";
    require(path.join(viewDir,'build-preview.cjs')).build({root:temp});
    const oldPreview = fs.readFileSync(preview, "utf8");
    assert.equal(oldPreview.split(old).length - 1, 1);
    fs.writeFileSync(
      preview,
      oldPreview.replace(old, old + " [" + marker + "]"),
    );
    // One explicitly reviewed HTML decision, coordinated into its existing contract field.
    const JSDOM = L.domAPI(ROOT),
      d = new JSDOM(fs.readFileSync(preview, "utf8")),
      cell = [...d.window.document.querySelectorAll("td")].find((n) =>
        n.textContent.includes(marker),
      );
    assert.equal(
      cell.previousElementSibling.textContent.trim(),
      row.selectionCases[0].condition,
    );
    row.selectionCases[0].result = cell.textContent
      .replace(/^(?:候选|必须使用|用)\s*·\s*/, "")
      .trim();
    d.window.close();
    fs.writeFileSync(p, JSON.stringify(coordinated, null, 2) + "\n");
    fs.appendFileSync(
      path.join(lib, "components/button-current.css"),
      "\n/* isolated shared-style proof */\n.ds-btn { outline-offset: 3px; }\n",
    );
    const syncStarted=Date.now();
    const updated=require('./local-component-maintenance.cjs').sync({root:temp});
    report.steps.push({file:'root component:sync',exitCode:0,durationMs:Date.now()-syncStarted});
    const viewFile=path.join(viewDir,'preview.html'),view=fs.readFileSync(viewFile,'utf8');
    assert.ok(view.includes(marker),'source decision must reach the same-sync Button view');
    assert.ok(view.includes('暂不可调用'),'stale engineering must not be shown as currently callable');
    assert.ok(view.includes(updated.version.slice(0,12)),'view must use the same exported version');
    assert.notEqual(updated.version, initial.version);
    assert.ok(
      updated.components["library-button"].decisions.some((x) =>
        JSON.stringify(x).includes(marker),
      ),
    );
    assert.deepEqual(read(p), coordinated);
    assert.notEqual(
      updated.components["library-button"].engineering.status,
      "current",
    );
    for (const file of [
      "components/variants/button.html",
      "components/generation-index.json",
      "components/component-selection-mvp.json",
      "components/references/button.json",
    ])
      assert.ok(
        fs.readFileSync(path.join(lib, file), "utf8").includes(marker),
        file,
      );
    const inventory = read(
      path.join(lib, "components/sources/dialog/source-inventory.json"),
    );
    assert.equal(
      inventory.sources["components/contracts/button.json"].sha256,
      L.hash(p),
    );
    assert.ok(
      fs
        .readFileSync(
          path.join(temp, updated.release, "components/button-current.css"),
          "utf8",
        )
        .includes("outline-offset: 3px"),
    );
    const puppeteer = require(path.join(ROOT, "node_modules/puppeteer-core"));
    const browser = await puppeteer.launch({
      executablePath:
        process.env.CHROME_PATH ||
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
      args: ["--no-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1000 });
      await page.goto(
        "file://" + path.join(lib, "components/variants/dialog.html"),
        { waitUntil: "networkidle2" },
      );
      const values = await page.$$eval(".ds-dialog .ds-btn", (nodes) =>
        nodes.map((n) => getComputedStyle(n).outlineOffset),
      );
      assert.ok(values.length >= 2);
      assert.ok(values.every((v) => v === "3px"));
      report.parentBrowser = {
        parent: "Dialog",
        buttonCount: values.length,
        outlineOffsets: values,
        actualPreview: true,
      };
      await page.goto("file://" + path.join(lib,"components/variants/list.html"), {waitUntil:"networkidle2"});
      const listOffsets = await page.$$eval('.ds-list[data-list-current="operations"] .ds-btn', nodes=>nodes.map(n=>getComputedStyle(n).outlineOffset));
      assert.equal(listOffsets.length,4);assert.ok(listOffsets.every(v=>v==="3px"));
      report.additionalParentBrowser={parent:"List/operation-intensive",buttonCount:listOffsets.length,outlineOffsets:listOffsets,actualPreview:true};
      await page.close();
    } finally {
      await browser.close();
    }
    report.htmlToContract = {
      explicitCoordination: true,
      selectionUpdated: true,
      unchangedContractFields: true,
    };
    report.sync = {
      localFragmentsUpdated: true,
      localSelectionUpdated: true,
      parentInventoryUpdated: true,
      approvalInvalidated: true,
      buttonViewUpdatedInSameRootSync: true,
      staleCallabilityShownHonestly: true,
    };
    // Revalidate the changed finite Button scope by the actual source suite, never forge an approval.
    run("scripts/record-component-acceptance.js", ["--component", "button"]);
    const accepted = L.compile(temp);
    assert.equal(
      accepted.components["library-button"].engineering.status,
      "current",
    );
    const call = L.render(
      "library-button",
      "outline-black",
      { label: "Updated call" },
      { root: temp },
    );
    assert.equal(call.version, accepted.version);
    assert.ok(
      fs
        .readFileSync(
          path.join(temp, accepted.release, "components/button-current.css"),
          "utf8",
        )
        .includes("outline-offset: 3px"),
    );
    report.sync.newCallUpdatedAfterActualRevalidation = true;
    L.verifyRelease(temp, initial.version);
    report.sync.previousVersionUnchanged = true;
    const goodInventory = L.hash(
        path.join(lib, "components/sources/dialog/source-inventory.json"),
      ),
      bad = read(p);
    bad.variants
      .find((v) => v.name === "filled-red")
      .sizes.find((v) => v.name === "xl-regular").styleProperties.height =
      "43px";
    fs.writeFileSync(p, JSON.stringify(bad));
    const invalid = spawnSync(
      process.execPath,
      ["scripts/refresh-component-inventories.js"],
      { cwd: lib, encoding: "utf8" },
    );
    assert.notEqual(invalid.status, 0);
    assert.equal(
      L.hash(path.join(lib, "components/sources/dialog/source-inventory.json")),
      goodInventory,
    );
    report.invalidChange = {
      rejected: true,
      parentInventoryNotPartiallyWritten: true,
    };
    report.status = "passed";
  } catch (e) {
    report.status = "failed";
    report.error = e.stack;
    process.exitCode = 1;
  } finally {
    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(
      path.join(out, "isolated-sync.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
    fs.rmSync(temp, { recursive: true, force: true });
    console.log(JSON.stringify(report, null, 2));
  }
})();
