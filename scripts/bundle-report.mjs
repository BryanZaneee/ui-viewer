import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const html = await readFile("dist/index.html", "utf8");
const paths = [
  ...new Set(
    [
      ...html.matchAll(/(?:src|href)="[^"]*\/(assets\/[^"?]+\.(?:js|css))"/g),
    ].map((m) => m[1]),
  ),
];
let raw = 0,
  gzip = 0;
for (const path of paths) {
  const bytes = await readFile("dist/" + path),
    compressed = gzipSync(bytes).length;
  raw += bytes.length;
  gzip += compressed;
  console.log(
    `${path}: ${(bytes.length / 1024).toFixed(1)} KiB raw / ${(compressed / 1024).toFixed(1)} KiB gzip`,
  );
}
console.log(
  `Shell total: ${(raw / 1024).toFixed(1)} KiB raw / ${(gzip / 1024).toFixed(1)} KiB gzip. Visible preview modules load separately.`,
);
