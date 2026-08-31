// The pure, host-neutral decision leaf shared by BOTH image renderer slots
// (`detail`, `preview`). It maps the authorized renderer-props snapshot to
// exactly one of two outcomes:
//   - `image` : a passive `<img>` is safe to draw — carries the resolved `src`,
//     a non-empty `alt`, and the ROAD the src is on.
//   - `floor` : the snapshot has no drawable address (no reference and no
//     session href, or a malformed/absent snapshot) — the slot renders a
//     never-blank floor.
//
// THE SRC COMES FROM THE BYTE ROAD, not from the session preview href. A
// subresource load from inside a third-party application carries no cookie, so
// a picture painted from the session route draws a blank plate there; at props
// version 2 the snapshot carries the address the reader may actually fetch on
// the surface they are on, and `resolveByteRoad` is where that choice lives.
// A version-1 snapshot has no reference, falls back to the session href, and
// still paints — the version window, not a flag day.
//
// NEVER-BLANK is the whole point of this leaf: the plan requires a renderer to
// "degrade safely (never-blank) on malformed content." Keeping the branch pure
// (no React, no host imports) makes that invariant unit-testable in isolation.

import type { ArtifactRendererProps } from "../renderer-props";
import { resolveByteRoad, type ByteRoadName } from "./byte-road";

/** The floor kept human-readable AND diagnostic — never a blank slot. */
export const IMAGE_FLOOR_LABEL = "Image preview unavailable";

/** The alt fallback when the row has no usable title (parity with the host
 * image handler, which always supplies a non-empty alt). */
export const IMAGE_ALT_FALLBACK = "Image";

export type ImageView =
  | { kind: "image"; src: string; alt: string; road: ByteRoadName }
  | { kind: "floor"; reason: "no-preview" | "malformed-props"; road: ByteRoadName };

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
    return { kind: "floor", reason: "malformed-props", road: "none" };
  }

  const bytes = resolveByteRoad(props);
  if (!nonEmptyString(bytes.preview)) {
    // No address this surface may fetch — floor, not blank.
    return { kind: "floor", reason: "no-preview", road: "none" };
  }

  const title = (props as ArtifactRendererProps).artifact?.title;
  const alt = nonEmptyString(title) ? title.trim() : IMAGE_ALT_FALLBACK;

  return { kind: "image", src: bytes.preview, alt, road: bytes.road };
}
