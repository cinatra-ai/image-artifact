// Image PREVIEW renderer (slot `preview`).
//
// The `preview` slot is the neutral representation-viewer capability: on the
// artifact detail page the host resolves a row's REPRESENTATION through this
// slot (first-party representation defaults register at `slot: "preview"`; a
// representation viewer resolves there — the host `renderer-resolution` seam),
// and in-core reuse sites consume the same slot. So this slot IS the direct,
// faithful migration of the host image handler
// (`src/app/artifacts/[id]/handlers/image-handler.tsx`, the `pickHandler` image
// arm) — SAME UX, no redesign: the SAME passive `<img>` (SVG via `<img src>`,
// never inline `<svg>`) inside the SAME soft-panel card with the SAME image
// classes as the detail slot.
//
// It requests NO host ports and renders ONLY from the authorized snapshot,
// painting from the BYTE ROAD the snapshot names — the byte reference at props
// version 2, the session href at the older version. Degrades to a never-blank
// floor when the snapshot carries no address at all.

import type { ReactElement } from "react";

import type { ArtifactRendererProps } from "../renderer-props";
import { IMAGE_FLOOR_LABEL, resolveImageView } from "./image-view";

export default function ImagePreviewRenderer(props: ArtifactRendererProps): ReactElement {
  const view = resolveImageView(props);

  if (view.kind === "floor") {
    return (
      <article
        className="soft-panel rounded-card overflow-hidden p-6 text-sm text-muted-foreground"
        data-artifact-renderer="image"
        data-slot="preview"
        data-floor={view.reason}
        data-byte-road={view.road}
      >
        {IMAGE_FLOOR_LABEL}.
      </article>
    );
  }

  return (
    <article
      className="soft-panel rounded-card overflow-hidden p-6"
      data-artifact-renderer="image"
      data-slot="preview"
      data-byte-road={view.road}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={view.src}
        alt={view.alt}
        className="mx-auto block max-h-[75vh] max-w-full object-contain"
      />
    </article>
  );
}
