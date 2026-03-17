// Reusable global header bar (single use per page)

import type { LayoutNode } from "../layoutTypes";

export const globalHeaderBar: LayoutNode = {
  id: "global-header",
  type: "section",
  layout: {
    flexDirection: "row",
    height: 56,
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  children: [
    {
      id: "global-header-left",
      type: "stack",
      layout: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      },
      children: [
        {
          id: "global-header-menu",
          type: "component",
          layout: { width: 48, height: 48 },
          props: { componentType: "IconButton", icon: "Menu", size: "large" },
          children: [],
        },
        {
          id: "global-header-brand",
          type: "component",
          layout: { minHeight: 24 },
          props: { componentType: "Typography", variant: "h6", children: "Brand" },
          children: [],
        },
      ],
    },
    {
      id: "global-header-right",
      type: "stack",
      layout: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      },
      children: [
        {
          id: "global-header-calendar",
          type: "component",
          layout: { width: 48, height: 48 },
          props: { componentType: "IconButton", icon: "EventAvailable" },
          children: [],
        },
        {
          id: "global-header-notifications",
          type: "component",
          layout: { width: 48, height: 48 },
          props: { componentType: "IconButton", icon: "NotificationsNone" },
          children: [],
        },
        {
          id: "global-header-apps",
          type: "component",
          layout: { width: 48, height: 48 },
          props: { componentType: "IconButton", icon: "Apps" },
          children: [],
        },
        {
          id: "global-header-avatar",
          type: "component",
          layout: { width: 40, height: 40 },
          props: { componentType: "Avatar", children: "J" },
          children: [],
        },
      ],
    },
  ],
};
