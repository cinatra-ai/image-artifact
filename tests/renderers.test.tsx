import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import type { ArtifactRendererProps } from "../src/renderer-props";
import ImageDetailRenderer from "../src/renderers/detail";
import ImagePreviewRenderer from "../src/renderers/preview";

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

describe("ImageDetailRenderer (port parity with the host image handler)", () => {
  it("draws a passive <img> with the host handler's exact classes inside the soft-panel card", () => {
    const html = renderToStaticMarkup(createElement(ImageDetailRenderer, props()));
    // Same markup contract as src/app/artifacts/[id]/handlers/image-handler.tsx.
    expect(html).toContain('class="soft-panel rounded-card overflow-hidden p-6"');
    expect(html).toContain('src="/api/artifacts/art_1/versions/rev_1/preview"');
    expect(html).toContain('alt="Quarterly dashboard"');
    expect(html).toContain("mx-auto block max-h-[75vh] max-w-full object-contain");
    // A passive <img>, never an inline <svg> executed from content.
    expect(html).toContain("<img");
    expect(html).not.toContain("<svg");
  });

  it("draws SVG through the same passive <img src> (no inline svg)", () => {
    const html = renderToStaticMarkup(
      createElement(
        ImageDetailRenderer,
        props({
          artifact: { ...props().artifact, mime: "image/svg+xml", title: "Logo" },
          urls: { preview: "/api/artifacts/art_1/versions/rev_9/preview", download: null },
        }),
      ),
    );
    expect(html).toContain("<img");
    expect(html).not.toContain("<svg");
    expect(html).toContain('alt="Logo"');
  });

  it("renders a never-blank floor (not an empty node) when there is no preview href", () => {
    const html = renderToStaticMarkup(
      createElement(ImageDetailRenderer, props({ urls: { preview: null, download: null } })),
    );
    expect(html).not.toContain("<img");
    expect(html).toContain("Image preview unavailable");
    expect(html).toContain('data-floor="no-preview"');
    expect(html.length).toBeGreaterThan(0);
  });
});

describe("ImagePreviewRenderer (representation-viewer slot — host-handler parity)", () => {
  it("draws the SAME passive <img> + soft-panel card + classes as the host image handler", () => {
    const html = renderToStaticMarkup(createElement(ImagePreviewRenderer, props()));
    expect(html).toContain('data-slot="preview"');
    // The preview slot is the migration of the host image handler — SAME markup
    // contract as src/app/artifacts/[id]/handlers/image-handler.tsx (no redesign).
    expect(html).toContain('class="soft-panel rounded-card overflow-hidden p-6"');
    expect(html).toContain("<img");
    expect(html).not.toContain("<svg");
    expect(html).toContain("mx-auto block max-h-[75vh] max-w-full object-contain");
    expect(html).toContain('src="/api/artifacts/art_1/versions/rev_1/preview"');
  });

  it("renders a never-blank floor when there is no preview href", () => {
    const html = renderToStaticMarkup(
      createElement(ImagePreviewRenderer, props({ urls: { preview: "", download: null } })),
    );
    expect(html).not.toContain("<img");
    expect(html).toContain("Image preview unavailable");
    expect(html).toContain('data-floor="no-preview"');
  });
});
