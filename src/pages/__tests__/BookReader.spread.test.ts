import { describe, it, expect } from "vitest";
import { edgesMatch } from "../BookReader";

const ramp = (offset = 0, noise = 0) =>
  Array.from({ length: 192 }, (_, i) => {
    const v = 40 + ((i * 7) % 180) + offset + (i % 2 ? noise : -noise);
    return { r: v, g: v * 0.8, b: v * 0.6 };
  });

describe("spread edge matching", () => {
  it("pairs edges that continue the same picture, even with slight differences", () => {
    expect(edgesMatch(ramp(), ramp(5, 4))).toBe(true);
  });
  it("pairs edges shifted by a couple of rows", () => {
    const a = ramp();
    expect(edgesMatch(a, [...a.slice(2), a[190], a[191]])).toBe(true);
  });
  it("does not pair unrelated edges", () => {
    const other = Array.from({ length: 192 }, (_, i) => ({ r: 200 - (i % 50) * 3, g: 30, b: (i * 13) % 255 }));
    expect(edgesMatch(ramp(), other)).toBe(false);
  });
  it("does not pair flat single-colour edges", () => {
    const flat = Array.from({ length: 192 }, () => ({ r: 255, g: 255, b: 255 }));
    expect(edgesMatch(flat, flat)).toBe(false);
  });
});
