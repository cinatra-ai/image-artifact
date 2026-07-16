# Image

The system viewer for image artifacts. It draws any image a workspace holds — screenshots, photographs, illustrations, diagrams, logos — as a clean, passive image in the artifact detail view and in inline previews across the app. Image is a **renderer** artifact: it does not classify or tag content, it owns how an image is *shown*.

Install from the Cinatra marketplace by searching for "Image" and clicking **Add**. No credentials or configuration are required. As a system base viewer it is present for every workspace and activates immediately. Any image artifact (PNG, JPEG, GIF, WebP, or SVG) is rendered in place: the detail view shows the full image scaled to fit; inline reuse sites show a compact preview. SVG is always rendered as a passive image (`<img src>`), never as inline markup, so image content can never execute script. When an image has no viewable representation yet — still uploading, or a representation the host has not authorized — the viewer shows a small "Image preview unavailable" placeholder rather than a blank panel; it never leaves an empty slot.

For development, edit the manifest in `package.json` (`cinatra.artifact`) or the renderer sources in `src/renderers/`, then run `node extension-kind-gate.mjs --package-root .` to validate the package, and `pnpm test` to run the renderer tests, before publishing.

## Works with

- Cinatra artifact library — the image detail view
- Any in-app site that previews an artifact inline (the neutral `preview` slot)

## Capabilities

- Render PNG, JPEG, GIF, WebP, and SVG image artifacts as a passive image
- Full-size, fit-to-viewport rendering in the artifact detail view
- Compact inline previews for in-app reuse sites
- Degrade to a never-blank placeholder when an image has no viewable representation
- Render SVG safely as a passive image, never as executable inline markup
