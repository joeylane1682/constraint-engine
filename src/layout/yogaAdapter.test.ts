import { describe, it, expect } from "vitest";
import type { LayoutNode } from "./layoutTypes";
import {
  layoutNodeToYogaNode,
  computeLayout,
  getComputedLayoutMap,
} from "./yogaAdapter";
import { dashboardLayout } from "./templates/dashboard";

describe("yogaAdapter", () => {
  it("lays out a sidebar + content correctly", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "row" },
      children: [
        {
          id: "sidebar",
          type: "section",
          layout: { width: 256 },
          children: [],
        },
        {
          id: "content",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
        },
      ],
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 1024, 600);
    const map = getComputedLayoutMap(tree, rootYoga);

    expect(map["root"].width).toBe(1024);
    expect(map["root"].height).toBe(600);
    expect(map["sidebar"].left).toBe(0);
    expect(map["sidebar"].width).toBe(256);
    expect(map["content"].left).toBe(256);
    expect(map["content"].width).toBe(1024 - 256);
  });

  it("lays out column with header + main correctly", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "column" },
      children: [
        { id: "header", type: "section", layout: { height: 64 }, children: [] },
        { id: "main", type: "section", layout: { flexGrow: 1 }, children: [] },
      ],
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 1024, 600);
    const map = getComputedLayoutMap(tree, rootYoga);

    expect(map["root"].height).toBe(600);
    expect(map["header"].top).toBe(0);
    expect(map["header"].height).toBe(64);
    expect(map["main"].top).toBe(64);
    expect(map["main"].height).toBe(600 - 64);
  });

  it("applies padding so child is inset", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "column", padding: 24 },
      children: [
        { id: "inner", type: "section", layout: { flexGrow: 1 }, children: [] },
      ],
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 1024, 600);
    const map = getComputedLayoutMap(tree, rootYoga);

    expect(map["inner"].left).toBe(24);
    expect(map["inner"].top).toBe(24);
    expect(map["inner"].width).toBe(1024 - 48);
    expect(map["inner"].height).toBe(600 - 48);
  });

  it("lays out nested row/column and maps all node ids", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "row" },
      children: [
        {
          id: "left",
          type: "section",
          layout: { width: 200 },
          children: [],
        },
        {
          id: "right",
          type: "section",
          layout: { flexDirection: "column", flexGrow: 1 },
          children: [
            { id: "top", type: "section", layout: { height: 100 }, children: [] },
            { id: "bottom", type: "section", layout: { flexGrow: 1 }, children: [] },
          ],
        },
      ],
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 1024, 600);
    const map = getComputedLayoutMap(tree, rootYoga);

    expect(Object.keys(map)).toEqual(["root", "left", "right", "top", "bottom"]);
    expect(map["left"].width).toBe(200);
    expect(map["right"].left).toBe(200);
    expect(map["top"].top).toBe(0);
    expect(map["top"].height).toBe(100);
    expect(map["bottom"].top).toBe(100);
    expect(map["bottom"].height).toBe(600 - 100);
  });

  it("handles single-node tree", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: {},
      children: [],
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 800, 400);
    const map = getComputedLayoutMap(tree, rootYoga);

    expect(Object.keys(map)).toEqual(["root"]);
    expect(map["root"].width).toBe(800);
    expect(map["root"].height).toBe(400);
  });

  it("applies gap between row children", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "row", gap: 16 },
      children: [
        { id: "a", type: "section", layout: { width: 100 }, children: [] },
        { id: "b", type: "section", layout: { width: 100 }, children: [] },
      ],
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 500, 200);
    const map = getComputedLayoutMap(tree, rootYoga);

    expect(map["a"].left).toBe(0);
    expect(map["a"].width).toBe(100);
    expect(map["b"].left).toBe(100 + 16);
    expect(map["b"].width).toBe(100);
  });

  it("runs full pipeline on dashboardLayout and produces valid layout map", () => {
    const rootYoga = layoutNodeToYogaNode(dashboardLayout);
    computeLayout(rootYoga, 1024, 600);
    const map = getComputedLayoutMap(dashboardLayout, rootYoga);

    const expectedIds = [
      "root",
      "header",
      "main",
      "list-panel",
      "list",
      "list-item-1",
      "list-item-2",
      "list-item-3",
      "list-item-4",
      "list-item-5",
      "detail-panel",
      "detail-content",
    ];
    expect(Object.keys(map).sort()).toEqual([...expectedIds].sort());

    expect(map["root"].width).toBe(1024);
    expect(map["root"].height).toBe(600);

    expect(map["header"].height).toBe(64);
    expect(map["header"].top).toBe(0);

    expect(map["list-panel"].width).toBe(320);
    expect(map["list-panel"].left).toBe(0);

    expect(map["detail-panel"].left).toBe(320);
    expect(map["detail-panel"].width).toBe(1024 - 320);
    expect(map["detail-panel"].height).toBeGreaterThan(0);

    for (const id of expectedIds) {
      expect(map[id].width).toBeGreaterThanOrEqual(0);
      expect(map[id].height).toBeGreaterThanOrEqual(0);
    }
  });
});
