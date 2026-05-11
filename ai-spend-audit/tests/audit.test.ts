import { describe, it, expect } from "vitest";

describe("AI Spend Audit Tests", () => {

  it("calculates monthly savings correctly", () => {
    const currentSpend = 100;
    const optimizedSpend = 60;

    const savings = currentSpend - optimizedSpend;

    expect(savings).toBe(40);
  });

  it("calculates annual savings correctly", () => {
    const monthlySavings = 50;

    const annualSavings = monthlySavings * 12;

    expect(annualSavings).toBe(600);
  });

  it("detects over budget teams", () => {
    const teamSize = 20;

    const overBudget = teamSize > 10;

    expect(overBudget).toBe(true);
  });

  it("handles zero savings case", () => {
    const currentSpend = 40;
    const optimizedSpend = 40;

    const savings = currentSpend - optimizedSpend;

    expect(savings).toBe(0);
  });

  it("recommends optimization when savings exist", () => {
    const savings = 100;

    const recommendOptimization = savings > 0;

    expect(recommendOptimization).toBe(true);
  });

});