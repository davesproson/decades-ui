import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { TimeframeSelectorPlot } from "../timeframe-chart";

const mocks = vi.hoisted(() => {
    return {
        useSelectorPlot: vi.fn(),
    };
})

vi.mock("../hooks", () => {
    return {
        useSelectorPlot: mocks.useSelectorPlot,
    };
})


describe("timeframe-chart", () => {
  it("Should render loading text if the hook returns false", () => {
    mocks.useSelectorPlot.mockReturnValue(false)
    render(<TimeframeSelectorPlot />);
    expect(screen.getByText("Loading altitude data...")).toBeInTheDocument();
  });

  it("Should render the plot if the hook returns true", () => {
    mocks.useSelectorPlot.mockReturnValue(true)
    render(<TimeframeSelectorPlot />);
    expect(screen.getByTestId("timeframe-selector-chart")).toBeInTheDocument();
  })
});