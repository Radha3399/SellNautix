import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const mediaRoot = fileURLToPath(new URL("./src/assets/media/", import.meta.url));
const brandingRoot = fileURLToPath(new URL("./src/assets/brand/", import.meta.url));
const brandingAssets = [
  ["favicon.ico", "favicon.ico.b64"],
  ["favicon-48x48.png", "favicon-48x48.png.b64"],
  ["favicon-192x192.png", "favicon-192x192.png.b64"],
  ["apple-touch-icon.png", "apple-touch-icon.png.b64"],
  ["brand/sellnautix-logo.png", "sellnautix-logo.png.b64"],
  ["brand/sellnautix-og.png", "sellnautix-og.png.b64"]
];
const mediaImportPrefix = "sellnautix-media:";
const resolvedMediaImportPrefix = `\0${mediaImportPrefix}`;

function encodedMediaAssets() {
  return {
    name: "encoded-media-assets",
    async buildStart() {
      for (const [fileName, sourceName] of brandingAssets) {
        const encoded = (await readFile(brandingRoot + sourceName, "utf8")).trim();
        this.emitFile({
          type: "asset",
          fileName,
          source: Buffer.from(encoded, "base64")
        });
      }
    },
    resolveId(source) {
      return source.startsWith(mediaImportPrefix) ? `\0${source}` : null;
    },
    async load(id) {
      if (!id.startsWith(resolvedMediaImportPrefix)) return null;

      const fileName = id.slice(resolvedMediaImportPrefix.length);
      if (!/^[a-z0-9-]+-\d+\.webp$/.test(fileName)) {
        throw new Error(`Invalid encoded media asset: ${fileName}`);
      }

      const encoded = (await readFile(`${mediaRoot}${fileName}.b64`, "utf8")).trim();
      const assetId = this.emitFile({
        type: "asset",
        name: fileName,
        source: Buffer.from(encoded, "base64")
      });

      return `export default import.meta.ROLLUP_FILE_URL_${assetId};`;
    }
  };
}

export default defineConfig({
  plugins: [encodedMediaAssets(), react()]
});
