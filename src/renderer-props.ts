// Local, STRUCTURAL mirror of the host renderer-props contract
// (`src/lib/artifacts/artifact-renderer-props.ts`, cinatra#1629 — the versioned,
// normalized, SERIALIZABLE snapshot a v1 artifact renderer receives).
//
// WHY A LOCAL MIRROR: the host does NOT (yet) export `ArtifactRendererProps`
// from `@cinatra-ai/sdk-extensions` — it lives in the host app tree, coupled to
// host-internal types (`ArtifactSummary`, `EffectiveIdentity`). A renderer
// extension is a source mirror the host builds into its own graph, so it mirrors
// only the snapshot FIELDS it consumes. This interface is structurally
// compatible with the host's `propsApiVersion: 1` snapshot the loader passes;
// the host remains the authoritative owner of the type. When the SDK exports the
// props type, this local mirror is replaced by that import (no behaviour change).
//
// v1 renderers request NO host ports: every field is plain JSON data (row
// metadata, the resolved representation, host-authorized URLs, navigational
// action hrefs) — never closures or host context.

export const IMAGE_RENDERER_PROPS_API_VERSION = 1;

export interface ArtifactRendererProps {
  /** The props-contract version this snapshot conforms to. */
  propsApiVersion: number;
  /** Row metadata (a projection of the authorized artifact summary). */
  artifact: {
    id: string;
    title: string | null;
    objectType: string;
    mime: string;
    size: number;
    createdAt: string;
    updatedAt: string;
    ownerLevel: string;
    visibility: string;
    sourceUrl: string | null;
  };
  /** The resolved representation to serve (null when none is materialized). */
  representation: {
    revisionId: string;
    mime: string;
  } | null;
  /** Host-authorized URLs — already access-checked before this snapshot. */
  urls: {
    preview: string | null;
    download: string | null;
  };
  /** The resolved effective identity, flattened to plain data. */
  identity: {
    kind: string;
    extension: string | null;
    basis: string | null;
    selectable: boolean;
  };
  /** Sanctioned action handles — SERIALIZABLE navigational hrefs only. */
  actions: {
    download: string | null;
    openInSource: string | null;
  };
}
