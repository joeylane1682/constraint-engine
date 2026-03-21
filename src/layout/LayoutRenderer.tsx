import React, { useRef, useState, useEffect } from "react";
import * as MUI from "@mui/material";
import * as Icons from "@mui/icons-material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import type { LayoutNode } from "./layoutTypes";
import type { ComputedLayoutMap } from "./layoutTypes";
import {
  layoutNodeToYogaNode,
  computeLayout,
  getComputedLayoutMap,
} from "./yogaAdapter";
import { GlobalHeader } from "./patterns/global-header";
import { ApplicationTitleBar } from "./patterns/application-title-bar";

//Layout node > react mappings (nodeType must be represnted here also)
const MUI_MAP: Record<LayoutNode["type"], React.ElementType> = {
  page: Box,
  section: Box,
  container: Container,
  stack: Stack,
  grid: Grid,
  component: Box,
};

/** Injectable slots mount React from page composition via `meta.regionKey` (not from blueprint `children`). */
export type RegionsMap = Readonly<Record<string, React.ReactNode>>;

interface LayoutRendererProps {
  node: LayoutNode;
  computedMap: ComputedLayoutMap;
  regions: RegionsMap;
}

/** Reserved keys in node.props; not passed through to the MUI content component. */
const RESERVED_PROPS = ["componentType", "icon"];

/**
 * Renders a single layout node with MUI (Box, Container, Stack, Grid) using Yoga-computed layout.
 * Injectable nodes render `regions[meta.regionKey]` inside the Yoga-sized shell.
 * Otherwise, if node.props.componentType is set, resolves that name from MUI and renders it as content
 * inside the layout wrapper; unknown names render a fallback to avoid crashes.
 */
function LayoutNodeView({ node, computedMap, regions }: LayoutRendererProps): React.ReactElement {
  const computed = computedMap[node.id];
  const children = node.children ?? [];
  const MuiComponent = MUI_MAP[node.type];

  const layoutSx = computed
    ? {
      position: "absolute" as const,
      left: computed.left,
      top: computed.top,
      width: computed.width,
      height: computed.height,
      boxSizing: "border-box" as const,
      border: "1px solid",
      borderColor: "divider",
    }
    : {};

  const childElements = children.map((child) => (
    <LayoutNodeView key={child.id} node={child} computedMap={computedMap} regions={regions} />
  ));

  if (node.id === "global-header") {
    return (
      <MuiComponent sx={layoutSx}>
        <GlobalHeader />
      </MuiComponent>
    );
  }

  if (node.id === "application-title-bar") {
    return (
      <MuiComponent sx={layoutSx}>
        <ApplicationTitleBar />
      </MuiComponent>
    );
  }

  const regionKeyRaw = node.meta.regionKey;
  if (
    node.meta.injectable &&
    typeof regionKeyRaw === "string" &&
    regionKeyRaw.trim() !== ""
  ) {
    const regionKey = regionKeyRaw.trim();
    return (
      <MuiComponent sx={layoutSx}>
        {regions[regionKey] ?? null}
        {childElements}
      </MuiComponent>
    );
  }

  const componentType =
    node.props && typeof node.props.componentType === "string"
      ? node.props.componentType
      : null;
  const maybeIcon =
    node.props && typeof (node.props as Record<string, unknown>).icon === "string"
      ? ((node.props as Record<string, unknown>).icon as string)
      : null;

  const materialComponents = MUI as unknown as Record<string, React.ElementType>;
  const iconComponents = Icons as unknown as Record<string, React.ElementType>;
  const ContentComponent = componentType
    ? iconComponents[componentType] ?? materialComponents[componentType]
    : null;
  const restProps =
    node.props && componentType
      ? Object.fromEntries(
        Object.entries(node.props).filter(([k]) => !RESERVED_PROPS.includes(k))
      )
      : {};

  const contentNode =
    componentType && ContentComponent ? (
      componentType === "IconButton" && maybeIcon ? (
        (() => {
          const IconComponent = iconComponents[maybeIcon] ?? materialComponents[maybeIcon];
          return (
            <ContentComponent {...restProps}>
              {IconComponent ? (
                <IconComponent />
              ) : (
                <MUI.Typography variant="caption" color="error">
                  Unknown icon: {maybeIcon}
                </MUI.Typography>
              )}
            </ContentComponent>
          );
        })()
      ) : (
        <ContentComponent {...restProps} />
      )
    ) : componentType ? (
      <MUI.Typography variant="body2" color="error">
        Unknown component: {componentType}
      </MUI.Typography>
    ) : null;

  return (
    <MuiComponent sx={layoutSx}>
      {contentNode}
      {childElements}
    </MuiComponent>
  );
}

interface LayoutRendererRootProps {
  tree: LayoutNode;
  computedMap: ComputedLayoutMap;
  regions: RegionsMap;
}

/**
 * Root wrapper: holds the layout tree with position relative so root node is the containing block.
 */
export function LayoutRenderer({ tree, computedMap, regions }: LayoutRendererRootProps): React.ReactElement {
  const rootComputed = computedMap[tree.id];
  const rootSx = rootComputed
    ? {
      position: "relative" as const,
      width: rootComputed.width,
      height: rootComputed.height,
      minHeight: "100vh",
      maxWidth: "100%",
      maxHeight: "100%",
    }
    : {};

  return (
    <Box sx={rootSx}>
      <LayoutNodeView node={tree} computedMap={computedMap} regions={regions} />
    </Box>
  );
}

interface LayoutViewProps {
  tree: LayoutNode;
  width: number;
  height: number;
  /** Keys must match injectable `meta.regionKey` on the layout tree. */
  regions?: RegionsMap;
}

/**
 * Runs the full pipeline: build Yoga tree → computeLayout → getComputedLayoutMap → render.
 * Use when you have a known width/height (e.g. from a container ref).
 * On Yoga load/layout failure, shows an error message instead of white-screen.
 */
export function LayoutView({ tree, width, height, regions = {} }: LayoutViewProps): React.ReactElement | null {
  const [computedMap, setComputedMap] = useState<ComputedLayoutMap | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setError(null);
    let yogaRoot: ReturnType<typeof layoutNodeToYogaNode> | null = null;
    try {
      yogaRoot = layoutNodeToYogaNode(tree);
      computeLayout(yogaRoot, width, height);
      setComputedMap(getComputedLayoutMap(tree, yogaRoot));
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setComputedMap(null);
    } finally {
      yogaRoot?.freeRecursive();
    }
  }, [tree, width, height]);

  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          color: "error.main",
          bgcolor: "error.light",
          border: "1px solid",
          borderColor: "error.main",
          borderRadius: 1,
        }}
      >
        Layout failed: {error.message}
      </Box>
    );
  }
  if (computedMap == null) return null;
  return <LayoutRenderer tree={tree} computedMap={computedMap} regions={regions} />;
}

interface LayoutViewWithRefProps {
  tree: LayoutNode;
  regions?: RegionsMap;
}

/**
 * Measures a container via ref, then runs the layout pipeline and renders.
 * Use as the root layout component in the app.
 */
function getViewportSize(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 800, height: 600 };
  return { width: window.innerWidth, height: window.innerHeight };
}

/**
 * Measures a container via ref, then runs the layout pipeline and renders.
 * Initial size is viewport (100vw × 100vh); ResizeObserver keeps it in sync.
 */
export function LayoutViewWithRef({ tree, regions = {} }: LayoutViewWithRefProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(getViewportSize);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setSize({ width: el.offsetWidth, height: el.offsetHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Box ref={containerRef} sx={{ width: "100vw", height: "100vh", overflow: "auto" }}>
      <LayoutView tree={tree} width={size.width} height={size.height} regions={regions} />
    </Box>
  );
}
