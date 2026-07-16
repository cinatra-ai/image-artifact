// The pure, host-neutral decision leaf shared by BOTH image renderer slots
// (`detail`, `preview`). It maps the authorized renderer-props snapshot to
// exactly one of two outcomes:
//   - `image` : a passive `<img>` is safe to draw (a host-authorized preview
//     href is present) — carries the resolved `src` + a non-empty `alt`.
//   - `floor` : the snapshot has no drawable representation (no preview href,
//     or a malformed/absent snapshot) — the slot renders a never-blank floor.
//
// NEVER-BLANK is the whole point of this leaf: the plan requires a renderer to
// "degrade safely (never-blank) on malformed content." Keeping the branch pure
// (no React, no host imports) makes that invariant unit-testable in isolation,
// exactly as `pickHandler` is extracted from the host `page.tsx` for the same
// reason.

import type { ArtifactRendererProps } from "../renderer-props";

/** The floor kept human-readable AND diagnostic — never a blank slot. */
export const IMAGE_FLOOR_LABEL = "Image preview unavailable";

/** The alt fallback when the row has no usable title (parity with the host
 * image handler, which always supplies a non-empty alt). */
export const IMAGE_ALT_FALLBACK = "Image";

export type ImageView =
  | { kind: "image"; src: string; alt: string }
  | { kind: "floor"; reason: "no-preview" | "malformed-props" };

/** Accept the authorized snapshot loosely: a renderer must never THROW on a
 * malformed prop shape — an unexpected input degrades to the floor. */
export type ImageRendererInput = Partial<ArtifactRendererProps> | null | undefined;

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Resolve the drawable view (or the floor) from the renderer snapshot. Pure;
 * total; never throws. */
export function resolveImageView(props: ImageRendererInput): ImageView {
  if (props === null || props === undefined || typeof props !== "object") {
    return { kind: "floor", reason: "malformed-props" };
  }

  const urls = (props as ArtifactRendererProps).urls;
  const previewHref = urls?.preview;
  if (!nonEmptyString(previewHref)) {
    // No materialized/host-authorized representation to draw — floor, not blank.
    return { kind: "floor", reason: "no-preview" };
  }

  const title = (props as ArtifactRendererProps).artifact?.title;
  const alt = nonEmptyString(title) ? title.trim() : IMAGE_ALT_FALLBACK;

  return { kind: "image", src: previewHref, alt };
}
