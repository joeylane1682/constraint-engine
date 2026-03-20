//LayoutType defines the available node types and node spec (page, section, grid) and 

export type LayoutNodeType =
  | "page"
  | "section"
  | "container"
  | "stack"
  | "grid"
  | "component";

/** Yoga-friendly layout properties (pixels). */
export interface LayoutSpec {
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  gap?: number;
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  justifyContent?:
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";
  /** Flex grow factor; children with flexGrow share remaining space. */
  flexGrow?: number;
  /** Fixed width (px). */
  width?: number;
  /** Fixed height (px). */
  height?: number;
  /** Min width (px). */
  minWidth?: number;
  /** Min height (px). */
  minHeight?: number;
  /** Flex wrap for grid-like layouts. */
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
}

/** Optional breakpoint-keyed overrides for future responsive behavior. */
export interface ResponsiveOverrides {
  [breakpoint: string]: Partial<LayoutSpec>;
}

export interface LayoutNode {
  id: string;
  type: LayoutNodeType;
  meta: {
    injectable: boolean;
    regionKey?: string;
  };
  children?: LayoutNode[];
  layout?: LayoutSpec;
  props?: Record<string, unknown>;
  responsive?: ResponsiveOverrides;
}

/** Computed layout from Yoga (x = left, y = top). */
export interface ComputedLayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type ComputedLayoutMap = Record<string, ComputedLayout>;
