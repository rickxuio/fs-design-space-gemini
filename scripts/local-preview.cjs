"use strict";
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
};
const DOC_REDIRECTS = {
  "design-system/docs/fs-design-system-preview.html": "/design-system/component-library.html#tokens",
  "design-system/docs/component-contract-maintenance.html": "/design-system/component-library.html#view/help",
  "design-system/docs/component-preview-structure.md": "/design-system/component-library.html#view/help",
  "design-system/docs/component-contract-benchmark.md": "/design-system/component-library.html#view/help",
  "design-system/docs/component-maintenance.html": "/design-system/component-library.html#view/help",
  "design-system/docs/component-contribution-guide.md": "/design-system/component-library.html#view/help",
  "design-system/README.md": "/design-system/component-library.html#view/project",
};

function resolveLiveCss(root, rel) {
  const m = /^fs-components\/component-specs\/library\/releases\/[^/]+\/components\/([a-z0-9._-]+\.css)$/i.exec(rel);
  if (!m) return null;
  const candidate = path.resolve(root, "design-system/components", m[1]);
  if (candidate.startsWith(path.resolve(root, "design-system/components") + path.sep) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }
  return null;
}

function startPreview(root = ROOT, { port = 5188, liveCss = false, inspector = false } = {}) {
  const server = http.createServer((req, res) => {
    try {
      if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405);
        return res.end();
      }
      const parsedUrl = new URL(req.url, "http://localhost");
      let rel = decodeURIComponent(parsedUrl.pathname).replace(/^\//, "") || "index.html";
      if (rel === "favicon.ico")
        rel = "design-system/components/icons/icon-logo-fs.svg";
      if (Object.hasOwn(DOC_REDIRECTS, rel)) {
        res.writeHead(302, { Location: DOC_REDIRECTS[rel], "Cache-Control": "no-store" });
        return res.end();
      }
      const ext = path.extname(rel).toLowerCase();
      const isInspectorAsset = rel === "scripts/preview-inspector.js";
      if (ext === ".md" && !/^(?:README\.md|design-spec\/fs-design-system\.md|design-system\/docs\/[^/]+\.md)$/.test(rel))
        throw Error("Not a public document");
      if (
        !isInspectorAsset &&
        (!/^(?:index\.html$|README\.md$|(?:pages|fs-components|design-spec|design-system|maintenance|reference-inputs)\/)/.test(
          rel,
        ) ||
          rel.split("/").some((p) => p.startsWith(".") || p === "node_modules") ||
          !TYPES[ext])
      )
        throw Error("Not allowed");

      const wantLiveCss = liveCss || parsedUrl.searchParams.get("live-css") === "1";
      const liveCssPath = wantLiveCss ? resolveLiveCss(root, rel) : null;
      const file = isInspectorAsset
        ? path.join(__dirname, "preview-inspector.js")
        : liveCssPath || path.resolve(root, rel);
      const allowedRoot = isInspectorAsset ? __dirname : root;
      if (
        !file.startsWith(allowedRoot + path.sep) ||
        !fs.realpathSync(file).startsWith(fs.realpathSync(allowedRoot) + path.sep) ||
        !fs.statSync(file).isFile()
      )
        throw Error("Not found");

      const fileExt = path.extname(file).toLowerCase();
      // Non-invasive Preview Inspector injection for pages/*.html (skipped when ?raw=1)
      const shouldInjectInspector =
        inspector &&
        req.method === "GET" &&
        /^pages\/[^/]+\.html$/i.test(rel) &&
        parsedUrl.searchParams.get("raw") !== "1";

      if (shouldInjectInspector) {
        let html = fs.readFileSync(file, "utf8");
        const tag = '\n<script src="/scripts/preview-inspector.js" defer></script>\n';
        html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, tag + "</body>") : html + tag;
        const buf = Buffer.from(html, "utf8");
        res.writeHead(200, {
          "Content-Type": TYPES[".html"],
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "X-FS-Preview-Inspector": "1",
          "Content-Length": buf.length,
        });
        return res.end(buf);
      }

      const size = fs.statSync(file).size;
      const media = [".mp4", ".mov"].includes(fileExt);
      const headers = {
        "Content-Type": TYPES[fileExt],
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Length": size,
      };
      if (liveCssPath) headers["X-FS-Live-CSS"] = "1";
      if (media) headers["Accept-Ranges"] = "bytes";
      if (media && req.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        const start = match?.[1] ? Number(match[1]) : match?.[2] ? Math.max(0, size - Number(match[2])) : NaN;
        const end = match?.[1] && match?.[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) {
          res.writeHead(416, { "Content-Range": "bytes */" + size });
          return res.end();
        }
        headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
        headers["Content-Length"] = end - start + 1;
        res.writeHead(206, headers);
        if (req.method === "HEAD") return res.end();
        return fs.createReadStream(file, { start, end }).pipe(res);
      }
      res.writeHead(200, headers);
      if (req.method === "HEAD") res.end();
      else fs.createReadStream(file).pipe(res);
    } catch (_) {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}
if (require.main === module) {
  const args = process.argv.slice(2),
    value = (key) => (args.includes(key) ? args[args.indexOf(key) + 1] : null);
  const page = value("--page") || "index.html";
  const liveCss = args.includes("--live-css");
  const noInspector = args.includes("--no-inspector");
  startPreview(ROOT, {
    port: Number(value("--port") || 5188),
    liveCss,
    inspector: !noInspector,
  })
    .then((s) =>
      console.log(
        "Local workflow preview: http://127.0.0.1:" +
          s.address().port +
          "/" +
          page +
          (liveCss ? " [live-css]" : ""),
      ),
    )
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    });
}
module.exports = { startPreview };
