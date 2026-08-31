// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { imageArtifactManifest } from "../src/index";
import { IMAGE_RENDERER_PROPS_API_VERSION } from "../src/renderer-props";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as {
  exports: Record<string, unknown>;
  cinatra: {
    artifact: {
      ui: {
        renderers: Record<
          string,
          { entry: string; propsApiVersion: number; representations?: string[] }
        >;
      };
    };
  };
};

const renderers = pkg.cinatra.artifact.ui.renderers;

describe("image-artifact — the declared props version", () => {
  it("declares the byte-road props version on every renderer slot", () => {
    expect(Object.keys(renderers).sort()).toEqual(["detail", "preview"]);
    for (const slot of Object.keys(renderers)) {
      expect(renderers[slot].propsApiVersion).toBe(2);
    }
  });

  it("keeps the local props mirror at the same version the manifest declares", () => {
    expect(IMAGE_RENDERER_PROPS_API_VERSION).toBe(2);
    for (const slot of Object.keys(renderers)) {
      expect(renderers[slot].propsApiVersion).toBe(IMAGE_RENDERER_PROPS_API_VERSION);
    }
  });

  it("agrees with the typed descriptor the package also exports", () => {
    expect(imageArtifactManifest.ui.renderers.detail?.propsApiVersion).toBe(2);
    expect(imageArtifactManifest.ui.renderers.preview?.propsApiVersion).toBe(2);
  });
});

describe("image-artifact — every renderer resolves through the package exports", () => {
  it("names an exports subpath, and a file on disk, for each declared entry", () => {
    for (const slot of Object.keys(renderers)) {
      const entry = renderers[slot].entry;
      const subpath = "./" + entry.replace(/\.tsx?$/, "").replace(/^\.\//, "");
      expect(Object.keys(pkg.exports)).toContain(subpath);
      expect(existsSync(fileURLToPath(new URL(`../${entry.slice(2)}`, import.meta.url)))).toBe(
        true,
      );
    }
  });
});
