import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const mediaRoot = fileURLToPath(new URL("./src/assets/media/", import.meta.url));
const mediaImportPrefix = "sellnautix-media:";
const resolvedMediaImportPrefix = `\0${mediaImportPrefix}`;

function encodedMediaAssets() {
  return {
    name: "encoded-media-assets",
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
