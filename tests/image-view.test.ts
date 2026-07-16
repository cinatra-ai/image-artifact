import { describe, expect, it } from "vitest";

import type { ArtifactRendererProps } from "../src/renderer-props";
import {
  IMAGE_ALT_FALLBACK,
  resolveImageView,
} from "../src/renderers/image-view";

// A complete, valid authorized snapshot; individual tests override fields.
function props(overrides: Partial<ArtifactRendererProps> = {}): ArtifactRendererProps {
  return {
    propsApiVersion: 1,
    artifact: {
      id: "art_1",
      title: "Quarterly dashboard",
      objectType: "@cinatra-ai/objects:object",
      mime: "image/png",
      size: 12345,
      createdAt: "2026-07-16T00:00:00.000Z",
      updatedAt: "2026-07-16T00:00:00.000Z",
      ownerLevel: "workspace",
      visibility: "workspace",
      sourceUrl: null,
    },
    representation: { revisionId: "rev_1", mime: "image/png" },
    urls: { preview: "/api/artifacts/art_1/versions/rev_1/preview", download: "/dl/art_1" },
    identity: { kind: "extension", extension: "@cinatra-ai/image-artifact", basis: null, selectable: true },
    actions: { download: "/dl/art_1", openInSource: null },
    ...overrides,
  };
}

describe("resolveImageView", () => {
  it("draws the host-authorized preview href with the row title as alt", () => {
    const view = resolveImageView(props());
    expect(view).toEqual({
      kind: "image",
      src: "/api/artifacts/art_1/versions/rev_1/preview",
      alt: "Quarterly dashboard",
    });
  });

  it("draws SVG through the same passive <img> src path (no MIME special-casing)", () => {
    const view = resolveImageView(
      props({
        artifact: { ...props().artifact, mime: "image/svg+xml", title: "Logo" },
        representation: { revisionId: "rev_2", mime: "image/svg+xml" },
      }),
    );
    expect(view).toMatchObject({ kind: "image", alt: "Logo" });
  });

  it("falls back to a generic alt when the title is null", () => {
    const view = resolveImageView(props({ artifact: { ...props().artifact, title: null } }));
    expect(view).toMatchObject({ kind: "image", alt: IMAGE_ALT_FALLBACK });
  });

  it("falls back to a generic alt when the title is blank whitespace", () => {
    const view = resolveImageView(props({ artifact: { ...props().artifact, title: "   " } }));
    expect(view).toMatchObject({ kind: "image", alt: IMAGE_ALT_FALLBACK });
  });

  it("trims a padded title", () => {
    const view = resolveImageView(props({ artifact: { ...props().artifact, title: "  Padded  " } }));
    expect(view).toMatchObject({ kind: "image", alt: "Padded" });
  });

  // --- never-blank floor paths ------------------------------------------------

  it("floors (no-preview) when the preview href is null", () => {
    const view = resolveImageView(props({ urls: { preview: null, download: "/dl" } }));
    expect(view).toEqual({ kind: "floor", reason: "no-preview" });
  });

  it("floors (no-preview) when the preview href is an empty string", () => {
    const view = resolveImageView(props({ urls: { preview: "", download: null } }));
    expect(view).toEqual({ kind: "floor", reason: "no-preview" });
  });

  it("floors (malformed-props) when urls is absent", () => {
    // A deliberately malformed snapshot (missing `urls`) must degrade, not throw.
    const view = resolveImageView({ propsApiVersion: 1 } as Partial<ArtifactRendererProps>);
    expect(view).toEqual({ kind: "floor", reason: "no-preview" });
  });

  it("floors (malformed-props) on null / undefined / non-object input", () => {
    expect(resolveImageView(null)).toEqual({ kind: "floor", reason: "malformed-props" });
    expect(resolveImageView(undefined)).toEqual({ kind: "floor", reason: "malformed-props" });
    // @ts-expect-error — exercising a hostile non-object input at runtime.
    expect(resolveImageView("nope")).toEqual({ kind: "floor", reason: "malformed-props" });
  });

  it("never throws for any of a battery of hostile inputs", () => {
    const hostile: unknown[] = [null, undefined, 0, "", "x", [], {}, { urls: null }, { urls: {} }, { urls: { preview: 42 } }];
    for (const input of hostile) {
      expect(() => resolveImageView(input as Partial<ArtifactRendererProps>)).not.toThrow();
    }
  });
});
