import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LayoutView } from "../../src/layout/LayoutRenderer";
import { applicationPageLayout } from "../../src/layout/templates/application-page";

const theme = createTheme();

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("LayoutView pipeline (Yoga inside component)", () => {
  it("runs layout in useEffect and mounts regions[regionKey] for injectable slots", async () => {
    renderWithTheme(
      <LayoutView
        tree={applicationPageLayout}
        width={1024}
        height={768}
        regions={{
          "main-content": (
            <span data-testid="main-region">Pipeline main content</span>
          ),
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("main-region")).toBeInTheDocument();
    });

    expect(screen.getByTestId("main-region")).toHaveTextContent(
      "Pipeline main content"
    );
  });

  it("shows layout error UI when tree fails validation", async () => {
    const invalidTree = {
      ...applicationPageLayout,
      children: [
        ...(applicationPageLayout.children ?? []),
        {
          id: "bad-injectable",
          type: "section" as const,
          meta: { injectable: true },
          layout: { height: 10 },
          children: [],
        },
      ],
    };

    renderWithTheme(
      <LayoutView tree={invalidTree} width={800} height={600} regions={{}} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Layout failed:/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/injectable nodes must include a non-empty regionKey/i)).toBeInTheDocument();
  });
});
