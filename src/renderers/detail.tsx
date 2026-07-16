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
// v1 renderer: requests NO host ports. It renders ONLY from the host-supplied
// authorized snapshot (`ArtifactRendererProps`) — `urls.preview` is already
// actor-scoped + access-checked by the host. A plain `<img>` (not Next
// `<Image>`) preserves the host's actor-scoped fetch (Next `<Image>` would route
// through `/_next/image` and bypass it). Degrades to a never-blank floor when
// the snapshot carries no drawable representation.

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
