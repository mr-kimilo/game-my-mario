#!/usr/bin/env node
// Assemble dist/site: the game, the effect lobby, the gallery and the docs as one static folder
// that any static host (GitHub Pages included) can serve as-is.
//
//   node tools/build-site.mjs && node tools/serve.mjs   # then open http://localhost:8080/mario.html

import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT } from "./lib/fxlib.mjs";

const OUT = join(ROOT, "dist", "site");
const FILES = ["mario.html", "index.html", "game-levels.js", "play.md", "LICENSE", "NOTICE.md"];
const DIRS = ["src", "gallery", "docs"];
// the README montage is a 5 MB GIF that only the README uses
const SKIP = new Set([join("docs", "readme")]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const f of FILES) cpSync(join(ROOT, f), join(OUT, f));
for (const d of DIRS) {
  cpSync(join(ROOT, d), join(OUT, d), {
    recursive: true,
    filter: (src) => !SKIP.has(relative(ROOT, src)),
  });
}

console.log(`dist/site built: ${FILES.length} files + ${DIRS.join(" ")}`);
