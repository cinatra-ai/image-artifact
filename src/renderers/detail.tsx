// Image DETAIL renderer (slot `detail`).
//
// A faithful migration of the host image handler
// (`src/app/artifacts/[id]/handlers/image-handler.tsx`) — SAME UX, no redesign:
// any allowlisted image MIME (PNG/JPEG/GIF/WebP/SVG) is drawn via a plain,
// passive `<img>` inside the soft-panel card. SVG specifically goes through
// `<img src=...>` so the browser treats it as a passive image — NEVER an inline
// `<svg>` from artifact content (which would execute script/event handlers if
// not sanitised). Any future inline-SVG path must add a sanitiser or a sandboxed
// frame.
//
// It requests NO host ports and renders ONLY from the host-supplied authorized
// snapshot, painting from the BYTE ROAD the snapshot names — the byte reference
// at props version 2, the session href where a snapshot was built at the older
// version. A plain `<img>` (not Next `<Image>`) keeps the host's own address
// intact (Next `<Image>` would route through `/_next/image` and replace it).
// Degrades to a never-blank floor when the snapshot carries no address at all.

import type { ReactElement } from "react";

import type { ArtifactRendererProps } from "../renderer-props";
import { IMAGE_FLOOR_LABEL, resolveImageView } from "./image-view";

export default function ImageDetailRenderer(props: ArtifactRendererProps): ReactElement {
  const view = resolveImageView(props);

  if (view.kind === "floor") {
    return (
      <article
        className="soft-panel rounded-card overflow-hidden p-6 text-sm text-muted-foreground"
        data-artifact-renderer="image"
        data-slot="detail"
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
      data-slot="detail"
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
