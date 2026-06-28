import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import JSZip from "jszip";

const distDir = "dist";
const zipPath = "hostinger-upload.zip";

if (!existsSync(distDir)) {
  console.error("dist folder is missing. Run npm run build first.");
  process.exit(1);
}

const zip = new JSZip();

function addDirectory(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      addDirectory(fullPath);
      continue;
    }

    if (!stats.isFile()) continue;

    const zipName = relative(distDir, fullPath).split(sep).join("/");
    zip.file(zipName, readFileSync(fullPath));
  }
}

addDirectory(distDir);

const content = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 9 },
});

writeFileSync(zipPath, content);
console.log(`✓ Created ${zipPath}. Upload this zip to Hostinger public_html and extract it there.`);