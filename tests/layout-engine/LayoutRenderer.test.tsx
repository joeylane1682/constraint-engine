import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { LayoutNode } from "../../src/layout/layoutTypes";
import {
  layoutNodeToYogaNode,
  computeLayout,
  getComputedLayoutMap,
} from "../../src/layout/yogaAdapter";
import { LayoutRenderer } from "../../src/layout/LayoutRenderer";

const theme = createTheme();

function computeLayoutMap(
  tree: LayoutNode,
  width: number,
  height: number
): ReturnType<typeof getComputedLayoutMap> {
  const rootYoga = layoutNodeToYogaNode(tree);
  try {
    computeLayout(rootYoga, width, height);
    return getComputedLayoutMap(tree, rootYoga);
  } finally {
    rootYoga.freeRecursive();
  }
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

/** Minimal tree: one injectable section under column root (matches yogaAdapter-style fixtures). */
function injectableSlotTree(regionKey: string): LayoutNode {
  return {
    id: "root",
    type: "page",
    meta: { injectable: false },
    layout: { flexDirection: "column" },
    children: [
      {
        id: "slot",
        type: "section",
        meta: { injectable: true, regionKey },
        layout: { flexGrow: 1 },
        children: [],
      },
    ],
  };
}

describe("LayoutRenderer regions / regionKey", () => {
  it("mounts regions[regionKey] inside the injectable Yoga shell", () => {
    const tree = injectableSlotTree("slot");
    const map = computeLayoutMap(tree, 400, 300);

    renderWithTheme(
      <LayoutRenderer
        tree={tree}
        computedMap={map}
        regions={{
          slot: <span data-testid="injected">Hello region</span>,
        }}
      />
    );

    expect(screen.getByTestId("injected")).toHaveTextContent("Hello region");
  });

  it("renders nothing inside injectable shell when regions omits the key", () => {
    const tree = injectableSlotTree("slot");
    const map = computeLayoutMap(tree, 400, 300);

    renderWithTheme(
      <LayoutRenderer tree={tree} computedMap={map} regions={{}} />
    );

    expect(screen.queryByTestId("injected")).not.toBeInTheDocument();
  });

  it("trims meta.regionKey when looking up regions", () => {
    const tree = injectableSlotTree("  slot  ");
    const map = computeLayoutMap(tree, 400, 300);

    renderWithTheme(
      <LayoutRenderer
        tree={tree}
        computedMap={map}
        regions={{
          slot: <span data-testid="trimmed-lookup">ok</span>,
        }}
      />
    );

    expect(screen.getByTestId("trimmed-lookup")).toBeInTheDocument();
  });

  it("uses regions for injectable nodes instead of props.componentType", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      meta: { injectable: false },
      layout: { flexDirection: "column" },
      children: [
        {
          id: "slot",
          type: "section",
          meta: { injectable: true, regionKey: "slot" },
          layout: { flexGrow: 1 },
          children: [],
          props: { componentType: "Typography", children: "from props" },
        },
      ],
    };
    const map = computeLayoutMap(tree, 400, 300);

    renderWithTheme(
      <LayoutRenderer
        tree={tree}
        computedMap={map}
        regions={{
          slot: <span data-testid="from-regions">from regions map</span>,
        }}
      />
    );

    expect(screen.getByTestId("from-regions")).toHaveTextContent(
      "from regions map"
    );
    expect(screen.queryByText("from props")).not.toBeInTheDocument();
  });

  it("non-injectable node with componentType still resolves MUI content", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      meta: { injectable: false },
      layout: { flexDirection: "column" },
      children: [
        {
          id: "label",
          type: "section",
          meta: { injectable: false },
          layout: { height: 40 },
          children: [],
          props: { componentType: "Typography", children: "static label" },
        },
      ],
    };
    const map = computeLayoutMap(tree, 400, 300);

    renderWithTheme(
      <LayoutRenderer tree={tree} computedMap={map} regions={{}} />
    );

    expect(screen.getByText("static label")).toBeInTheDocument();
  });
});
