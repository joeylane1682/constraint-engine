# Layout pipeline — status

_Last updated: 2025-03-20_

## Checklist

[x] Add **LayoutRenderer** (and `LayoutView` / `LayoutViewWithRef`) support for **`regionKey`** via a `regions` map (`regions[node.meta.regionKey]` for injectable nodes).

[ ] **Defer** renderer / pipeline changes for **ID-based** mounting until after `regionKey` is done (avoid mixing concerns).

[x] **layout-engine** + **yoga-layout-runtime** rules: **`src/pages/`** page modules, **`src/pages/regions/`**, shared **Terminology** (template / page module / layout tree).

[x] **App sample:** import **page module** from `src/pages/` and pass **`tree`** + **`regions`** (`src/pages/application-page.tsx`).

## Notes

- ID-based mounting remains **out of scope** until the **`regionKey`** path is fully exercised in app code.
