import { describe, it, expect, vi } from "vitest";
import type { LayoutNode } from "./layoutTypes";
import {
  layoutNodeToYogaNode,
  computeLayout,
  getComputedLayoutMap,
} from "./yogaAdapter";
import { appShellLayout } from "./templates/app-shell";

describe("yogaAdapter", () => {
  it("throws when a node is missing meta", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "column" },
      children: [],
      // @ts-expect-error test runtime validation for missing meta
      meta: undefined,
    };

    expect(() => layoutNodeToYogaNode(tree)).toThrow(/meta is required/i);
  });

  it("throws when injectable node is missing regionKey", () => {
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "column" },
      children: [
        {
          id: "main",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: true },
        },
      ],
      meta: { injectable: false },
    };

    expect(() => layoutNodeToYogaNode(tree)).toThrow(
      /injectable nodes must include a non-empty regionKey/i
    );
  });

  it("warns when non-injectable node includes regionKey", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "column" },
      children: [
        {
          id: "main",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: false, regionKey: "main-content" },
        },
      ],
      meta: { injectable: false },
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 1024, 600);
    getComputedLayoutMap(tree, rootYoga);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Redundant regionKey on non-injectable node "main"/)
    );
    warnSpy.mockRestore();
  });

  it("warns on duplicate regionKey values", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "column" },
      children: [
        {
          id: "main-a",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: true, regionKey: "main-content" },
        },
        {
          id: "main-b",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: true, regionKey: "main-content" },
        },
      ],
      meta: { injectable: false },
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 1024, 600);
    getComputedLayoutMap(tree, rootYoga);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Duplicate regionKey "main-content"/)
    );
    warnSpy.mockRestore();
  });

  it("warns when injectable regionKey differs from node id", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const tree: LayoutNode = {
      id: "root",
      type: "page",
      layout: { flexDirection: "column" },
      children: [
        {
          id: "main-content",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: true, regionKey: "content-main" },
        },
      ],
      meta: { injectable: false },
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 1024, 600);
    getComputedLayoutMap(tree, rootYoga);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/does not match id; prefer regionKey === id/)
    );
    warnSpy.mockRestore();
  });

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
          meta: { injectable: false },
        },
        {
          id: "content",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: false },
        },
      ],
      meta: { injectable: false },
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
        {
          id: "header",
          type: "section",
          layout: { height: 64 },
          children: [],
          meta: { injectable: false },
        },
        {
          id: "main",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: false },
        },
      ],
      meta: { injectable: false },
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
        {
          id: "inner",
          type: "section",
          layout: { flexGrow: 1 },
          children: [],
          meta: { injectable: false },
        },
      ],
      meta: { injectable: false },
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
          meta: { injectable: false },
        },
        {
          id: "right",
          type: "section",
          layout: { flexDirection: "column", flexGrow: 1 },
          children: [
            {
              id: "top",
              type: "section",
              layout: { height: 100 },
              children: [],
              meta: { injectable: false },
            },
            {
              id: "bottom",
              type: "section",
              layout: { flexGrow: 1 },
              children: [],
              meta: { injectable: false },
            },
          ],
          meta: { injectable: false },
        },
      ],
      meta: { injectable: false },
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
      meta: { injectable: false },
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
        {
          id: "a",
          type: "section",
          layout: { width: 100 },
          children: [],
          meta: { injectable: false },
        },
        {
          id: "b",
          type: "section",
          layout: { width: 100 },
          children: [],
          meta: { injectable: false },
        },
      ],
      meta: { injectable: false },
    };

    const rootYoga = layoutNodeToYogaNode(tree);
    computeLayout(rootYoga, 500, 200);
    const map = getComputedLayoutMap(tree, rootYoga);

    expect(map["a"].left).toBe(0);
    expect(map["a"].width).toBe(100);
    expect(map["b"].left).toBe(100 + 16);
    expect(map["b"].width).toBe(100);
  });

  it("runs full pipeline on appShellLayout and produces valid layout map", () => {
    const rootYoga = layoutNodeToYogaNode(appShellLayout);
    computeLayout(rootYoga, 1024, 600);
    const map = getComputedLayoutMap(appShellLayout, rootYoga);

    const expectedIds = [
      "root",
      "global-header",
      "application-title-bar",
      "main-content",
    ];
    expect(Object.keys(map).sort()).toEqual([...expectedIds].sort());

    // root should match viewport
    expect(map["root"].width).toBe(1024);
    expect(map["root"].height).toBe(600);

    // global header: fixed 64px at top
    expect(map["global-header"].top).toBe(0);
    expect(map["global-header"].height).toBe(64);

    // title bar: directly below header, 48px tall
    expect(map["application-title-bar"].top).toBe(64);
    expect(map["application-title-bar"].height).toBe(48);

    // main content: below title bar, fills remaining height
    expect(map["main-content"].top).toBe(64 + 48);
    expect(map["main-content"].height).toBeGreaterThan(0);

    // all nodes should have non‑negative sizes
    for (const id of expectedIds) {
      expect(map[id].width).toBeGreaterThanOrEqual(0);
      expect(map[id].height).toBeGreaterThanOrEqual(0);
    }
  });
});
