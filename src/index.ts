import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// `@cinatra-ai/image-artifact`: the system RENDERER for image artifacts. Unlike
// a meaning-type artifact (e.g. `@cinatra-ai/screenshot-artifact`, which ships a
// classifier matcher), a renderer ships NO matcher / `objectTypes` claim — it
// declares a `cinatra.artifact.ui` block whose per-slot `representations` name
// the MIME patterns it DRAWS (epic #1620 "artifact extensions own their UI",
// M1 Slice B — the four system bases: image/pdf/audio/video).
//
// This is a faithful MIGRATION of the host image handler
// (`src/app/artifacts/[id]/handlers/image-handler.tsx`, the `pickHandler`
// image arm) — same UX, no redesign. It draws any allowlisted image MIME via a
// passive `<img src>` (SVG included — never an inline `<svg>` that could execute
// script). As a SYSTEM base it ships build-bundled and mounts through the host
// SSR fast path (`GENERATED_ARTIFACT_RENDERERS`); the manifest below is the
// source of truth the semantic-manifest bridge consumes.
//
// v1 renderer contract (`packages/sdk-extensions/src/artifact-contract.ts`):
//   - `ui.abiVersion` = 1 (the only shape v1 accepts).
//   - `ui.sdkAbiRange` = the GENERATED caret range over the canonical SDK ABI
//     (`SDK_EXTENSIONS_ABI_VERSION` = "2.4.0" -> "^2.4.0"); never hand-tuned —
//     the conformance gate re-derives it live and asserts equality.
//   - each `renderers[slot]` requests NO host ports (only `{ entry,
//     propsApiVersion, representations }`); the renderer consumes ONLY the
//     host-supplied authorized snapshot (`ArtifactRendererProps`, propsApi v1).
//
// The descriptor is mirrored in package.json `cinatra.artifact`; keep the two
// byte-aligned (the kind-gate reads package.json, this typed export is the
// author-facing source of truth).
export const imageArtifactManifest: SemanticArtifactManifest = {
  accepts: {
    file: {
      mimeTypes: ["image/*"],
    },
  },
  ui: {
    abiVersion: 1,
    sdkAbiRange: "^2.4.0",
    renderers: {
      detail: {
        entry: "./src/renderers/detail.tsx",
        propsApiVersion: 2,
        representations: ["image/*"],
      },
      preview: {
        entry: "./src/renderers/preview.tsx",
        propsApiVersion: 2,
        representations: ["image/*"],
      },
    },
  },
};
