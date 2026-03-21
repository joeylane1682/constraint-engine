import type { LayoutNode } from "../layout/layoutTypes";
import type { RegionsMap } from "../layout/LayoutRenderer";
import { applicationPageLayout } from "../layout/templates/application-page";
import { MainContentRegion } from "./regions/main-content";

/** Runtime layout tree for this route (starts from the application template). */
export const applicationPageTree: LayoutNode = applicationPageLayout;

/** Injectable UI keyed by `meta.regionKey` on `applicationPageTree`. */
export const applicationPageRegions: RegionsMap = {
  "main-content": <MainContentRegion />,
};
