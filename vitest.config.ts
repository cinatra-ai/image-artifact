import { defineConfig } from "vitest/config";

// Standalone test config for the extracted extension repo. The renderer slot
// tests render via `react-dom/server` (`renderToStaticMarkup`) — no DOM needed,
// so the default `node` environment is correct. `jsx: automatic` matches the
// package tsconfig's `react-jsx` runtime.
export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
