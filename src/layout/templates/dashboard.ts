// Dashboard blueprint: header + list panel + detail panel

import type { LayoutNode } from "../layoutTypes";

export const dashboardLayout: LayoutNode = {
  id: "root",
  type: "page",
  layout: {
    flexDirection: "column",
    padding: 0,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  children: [
    {
      id: "header",
      type: "section",
      layout: {
        flexDirection: "row",
        height: 64,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
        paddingBottom: 16,
        alignItems: "center",
        justifyContent: "space-between",
      },
      props: { componentType: "Typography", variant: "h6", children: "Dashboard" },
      children: [],
    },
    {
      id: "main",
      type: "stack",
      layout: {
        flexDirection: "row",
        flexGrow: 1,
        alignItems: "stretch",
      },
      children: [
        {
          id: "list-panel",
          type: "section",
          layout: {
            flexDirection: "column",
            width: 320,
            padding: 16,
            gap: 8,
          },
          children: [
            {
              id: "list",
              type: "stack",
              layout: {
                flexDirection: "column",
                flexGrow: 1,
                gap: 4,
              },
              children: [
                { id: "list-item-1", type: "component", layout: { minHeight: 48, flexGrow: 0 }, props: { componentType: "ListItemText", primary: "Item 1" }, children: [] },
                { id: "list-item-2", type: "component", layout: { minHeight: 48, flexGrow: 0 }, props: { componentType: "ListItemText", primary: "Item 2" }, children: [] },
                { id: "list-item-3", type: "component", layout: { minHeight: 48, flexGrow: 0 }, props: { componentType: "ListItemText", primary: "Item 3" }, children: [] },
                { id: "list-item-4", type: "component", layout: { minHeight: 48, flexGrow: 0 }, props: { componentType: "ListItemText", primary: "Item 4" }, children: [] },
                { id: "list-item-5", type: "component", layout: { minHeight: 48, flexGrow: 0 }, props: { componentType: "ListItemText", primary: "Item 5" }, children: [] },
              ],
            },
          ],
        },
        {
          id: "detail-panel",
          type: "section",
          layout: {
            flexDirection: "column",
            flexGrow: 1,
            padding: 24,
            gap: 16,
          },
          children: [
            {
              id: "detail-content",
              type: "section",
              layout: {
                flexDirection: "column",
                flexGrow: 1,
                padding: 24,
                gap: 12,
              },
              props: { componentType: "Typography", color: "text.secondary", children: "Select an item" },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
