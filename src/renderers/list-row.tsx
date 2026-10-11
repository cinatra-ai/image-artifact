// Row icon of the image type: the Artifacts list draws this inside its row cell.
// It draws the shared icon set's image icon at 17 pixels, hidden from assistive
// technology, and returns the same icon for every object type. It reads nothing
// but its props, requests no host port and fetches nothing.

import type { ArtifactRendererProps } from "@cinatra-ai/sdk-extensions";
import { Image } from "lucide-react";
import type { ReactElement } from "react";

export default function ImageListRowIcon(
  _props: { artifact: Pick<ArtifactRendererProps["artifact"], "objectType"> },
): ReactElement {
  return <Image aria-hidden size={17} strokeWidth={2} data-row-glyph="image" />;
}
